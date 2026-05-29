import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import RequireAuth from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SeoHead } from "@/components/SeoHead";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Upload, Save, Languages, Eye, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CmsBlocksRenderer } from "@/components/CmsBlocksRenderer";
import type { CmsPage } from "@/hooks/useCmsPage";

type Block = {
  id: string;
  page_id: string;
  block_key: string;
  block_type: string;
  sort_order: number;
  title: string | null;
  body_md: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
};

type Page = { id: string; slug: string; title: string; description: string | null; is_published: boolean };

export default function AdminCmsEditor() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const load = async () => {
    if (!slug) return;
    setLoading(true);
    const { data: p } = await supabase.from("cms_pages").select("*").eq("slug", slug).maybeSingle();
    if (!p) { setLoading(false); return; }
    setPage(p as Page);
    const { data: b } = await supabase.from("cms_blocks").select("*").eq("page_id", p.id).order("sort_order");
    setBlocks((b as Block[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [slug]);

  const savePageMeta = async () => {
    if (!page) return;
    const { error } = await supabase.from("cms_pages").update({
      title: page.title, description: page.description, is_published: page.is_published,
    }).eq("id", page.id);
    if (error) return toast.error(error.message);
    toast.success("Page updated");
  };

  const addBlock = async () => {
    if (!page) return;
    const nextSort = (blocks[blocks.length - 1]?.sort_order ?? -1) + 1;
    const key = `block-${Date.now()}`;
    const { data, error } = await supabase.from("cms_blocks").insert({
      page_id: page.id, block_key: key, sort_order: nextSort, title: "New block",
    }).select().single();
    if (error) return toast.error(error.message);
    setBlocks([...blocks, data as Block]);
  };

  const updateBlock = (id: string, patch: Partial<Block>) =>
    setBlocks(bs => bs.map(b => b.id === id ? { ...b, ...patch } : b));

  const saveBlock = async (b: Block) => {
    const { error } = await supabase.from("cms_blocks").update({
      block_key: b.block_key, block_type: b.block_type, title: b.title,
      body_md: b.body_md, image_url: b.image_url, cta_label: b.cta_label, cta_url: b.cta_url,
    }).eq("id", b.id);
    if (error) return toast.error(error.message);
    toast.success("Block saved");
  };

  const deleteBlock = async (id: string) => {
    if (!confirm("Delete this block?")) return;
    const { error } = await supabase.from("cms_blocks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setBlocks(bs => bs.filter(b => b.id !== id));
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = blocks.findIndex(b => b.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= blocks.length) return;
    const a = blocks[idx], c = blocks[j];
    const newOrder = [...blocks];
    newOrder[idx] = { ...c, sort_order: a.sort_order };
    newOrder[j] = { ...a, sort_order: c.sort_order };
    setBlocks(newOrder.sort((x, y) => x.sort_order - y.sort_order));
    await Promise.all([
      supabase.from("cms_blocks").update({ sort_order: c.sort_order }).eq("id", a.id),
      supabase.from("cms_blocks").update({ sort_order: a.sort_order }).eq("id", c.id),
    ]);
  };

  const uploadImage = async (b: Block, file: File) => {
    setUploadingId(b.id);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${page!.slug}/${b.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("cms-media").upload(path, file, { upsert: true });
    if (error) { setUploadingId(null); return toast.error(error.message); }
    const { data: pub } = supabase.storage.from("cms-media").getPublicUrl(path);
    updateBlock(b.id, { image_url: pub.publicUrl });
    await supabase.from("cms_blocks").update({ image_url: pub.publicUrl }).eq("id", b.id);
    setUploadingId(null);
    toast.success("Image uploaded");
  };

  const [translating, setTranslating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewPage: CmsPage | null = page
    ? {
        id: page.id,
        slug: page.slug,
        title: page.title,
        description: page.description,
        is_published: page.is_published,
        blocks: blocks.map((b) => ({
          id: b.id,
          block_key: b.block_key,
          block_type: b.block_type,
          sort_order: b.sort_order,
          title: b.title,
          body_md: b.body_md,
          image_url: b.image_url,
          cta_label: b.cta_label,
          cta_url: b.cta_url,
          data: {},
        })),
      }
    : null;
  const translateAll = async () => {
    if (!page) return;
    if (!confirm("Translate this page (title, description, and all blocks) into all 47 supported languages? This may take a minute and will overwrite existing machine translations.")) return;
    setTranslating(true);
    const t = toast.loading("Translating into 47 languages…");
    const { data, error } = await supabase.functions.invoke("translate-cms", {
      body: { slug: page.slug },
    });
    setTranslating(false);
    toast.dismiss(t);
    if (error) return toast.error(error.message);
    const results = (data as { results?: Record<string, { ok: boolean; error?: string }> })?.results ?? {};
    const ok = Object.values(results).filter((r) => r.ok).length;
    const failed = Object.entries(results).filter(([, r]) => !r.ok).map(([l]) => l);
    if (failed.length) toast.warning(`Translated ${ok}. Failed: ${failed.join(", ")}`);
    else toast.success(`Translated into ${ok} languages`);
  };

  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!page) return <div className="p-10">Page not found. <Link to="/admin/cms" className="text-primary underline">Back</Link></div>;

  return (
    <RequireAuth adminOnly>
      <div className="min-h-screen bg-background">
        <SeoHead lang="en" basePath={`/admin/cms/${page.slug}`} title={`Edit ${page.title} — Admin`} description="Edit CMS page." />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link to="/admin/cms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All pages
          </Link>

          <Card className="p-5 mb-6 rounded-2xl">
            <h1 className="font-display font-bold text-2xl mb-4">/{page.slug}</h1>
            <div className="grid gap-4">
              <div>
                <Label>Title</Label>
                <Input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} maxLength={200} />
              </div>
              <div>
                <Label>Description (SEO)</Label>
                <Textarea value={page.description ?? ""} onChange={(e) => setPage({ ...page, description: e.target.value })} maxLength={300} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={page.is_published} onChange={(e) => setPage({ ...page, is_published: e.target.checked })} />
                Published
              </label>
              <div className="flex flex-wrap gap-2">
                <Button onClick={savePageMeta} className="w-fit"><Save className="h-4 w-4 mr-1" /> Save page</Button>
                <Button onClick={() => setPreviewOpen(true)} variant="secondary" className="w-fit">
                  <Eye className="h-4 w-4 mr-1" /> Preview
                </Button>
                <Button asChild variant="outline" className="w-fit">
                  <a href={`/${page.slug === "home" ? "" : page.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" /> Open live page
                  </a>
                </Button>
                <Button onClick={translateAll} variant="outline" className="w-fit" disabled={translating}>
                  <Languages className="h-4 w-4 mr-1" /> {translating ? "Translating…" : "Translate into 47 languages"}
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl">Content blocks</h2>
            <Button onClick={addBlock} size="sm"><Plus className="h-4 w-4 mr-1" /> Add block</Button>
          </div>

          <div className="space-y-4">
            {blocks.map((b, i) => (
              <Card key={b.id} className="p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">#{i + 1}</span>
                    <Input className="w-48" value={b.block_key} onChange={(e) => updateBlock(b.id, { block_key: e.target.value })} placeholder="block_key" />
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="outline" onClick={() => move(b.id, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" onClick={() => move(b.id, 1)} disabled={i === blocks.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" onClick={() => deleteBlock(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div>
                    <Label>Title</Label>
                    <Input value={b.title ?? ""} onChange={(e) => updateBlock(b.id, { title: e.target.value })} maxLength={200} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label>Body (Markdown)</Label>
                      <Textarea rows={8} value={b.body_md ?? ""} onChange={(e) => updateBlock(b.id, { body_md: e.target.value })} />
                    </div>
                    <div>
                      <Label>Preview</Label>
                      <div className="prose prose-sm max-w-none border rounded-md p-3 bg-muted/30 min-h-[200px]">
                        <ReactMarkdown>{b.body_md ?? "*Empty*"}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label>CTA label</Label>
                      <Input value={b.cta_label ?? ""} onChange={(e) => updateBlock(b.id, { cta_label: e.target.value })} maxLength={80} />
                    </div>
                    <div>
                      <Label>CTA URL</Label>
                      <Input value={b.cta_url ?? ""} onChange={(e) => updateBlock(b.id, { cta_url: e.target.value })} maxLength={500} />
                    </div>
                  </div>
                  <div>
                    <Label>Image</Label>
                    <div className="flex items-center gap-3">
                      {b.image_url && <img src={b.image_url} alt="" className="h-16 w-16 object-cover rounded-md border" />}
                      <Input value={b.image_url ?? ""} onChange={(e) => updateBlock(b.id, { image_url: e.target.value })} placeholder="https://…" />
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0]; if (f) uploadImage(b, f);
                        }} />
                        <Button asChild variant="outline" size="sm" disabled={uploadingId === b.id}>
                          <span><Upload className="h-4 w-4 mr-1" /> {uploadingId === b.id ? "Uploading…" : "Upload"}</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                  <Button onClick={() => saveBlock(b)} className="w-fit"><Save className="h-4 w-4 mr-1" /> Save block</Button>
                </div>
              </Card>
            ))}
            {blocks.length === 0 && (
              <Card className="p-10 text-center text-muted-foreground rounded-2xl">No blocks yet. Add your first one above.</Card>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
