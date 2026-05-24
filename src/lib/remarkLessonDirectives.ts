import { visit } from "unist-util-visit";

/**
 * Converts remark-directive nodes (:::name[label]{attrs}) into custom
 * HAST elements so ReactMarkdown can render them via the components map.
 *
 * Supported directives:
 *   :::danger / :::warning / :::tip / :::remember / :::did-you-know  -> <callout type="...">
 *   :::steps                                                          -> <steps>
 *   :::checklist                                                      -> <checklist>
 *   :::quiz{q="..." a="0" choices="A|B|C" explain="..."}              -> <quiz>
 *   :::scenario[Title]                                                -> <scenario title="...">
 */
const CALLOUT_TYPES = new Set([
  "danger",
  "warning",
  "tip",
  "remember",
  "did-you-know",
  "info",
  "success",
]);

export function remarkLessonDirectives() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type !== "containerDirective" &&
        node.type !== "leafDirective" &&
        node.type !== "textDirective"
      ) {
        return;
      }

      const data = node.data || (node.data = {});
      const attrs = node.attributes || {};
      const name = node.name as string;

      // Label is the bracketed text after :::name[Label]
      let label: string | undefined;
      if (Array.isArray(node.children) && node.children.length > 0) {
        const first = node.children[0];
        if (first?.data?.directiveLabel) {
          label = (first.children || [])
            .map((c: any) => c.value || "")
            .join("");
          // Remove the label paragraph so it isn't rendered as content
          node.children.shift();
        }
      }

      if (CALLOUT_TYPES.has(name)) {
        data.hName = "callout";
        data.hProperties = { type: name, title: label, ...attrs };
        return;
      }

      if (name === "steps") {
        data.hName = "steps";
        data.hProperties = { title: label, ...attrs };
        return;
      }

      if (name === "checklist") {
        data.hName = "checklist";
        data.hProperties = { title: label, ...attrs };
        return;
      }

      if (name === "scenario") {
        data.hName = "scenario";
        data.hProperties = { title: label, ...attrs };
        return;
      }

      if (name === "quiz") {
        data.hName = "quiz";
        data.hProperties = {
          q: attrs.q,
          a: attrs.a,
          choices: attrs.choices,
          explain: attrs.explain,
        };
        // quiz is fully attribute-driven; drop body children
        node.children = [];
        return;
      }

      if (name === "illustration") {
        data.hName = "illustration";
        // `:::illustration[key]` -> label becomes the registry key.
        // Also support `{name="key"}` attribute form.
        data.hProperties = { name: attrs.name ?? label, title: label, ...attrs };
        node.children = [];
        return;
      }

      // Unknown directive: render as a plain div with a data attribute
      data.hName = "div";
      data.hProperties = { "data-directive": name, ...attrs };
    });
  };
}
