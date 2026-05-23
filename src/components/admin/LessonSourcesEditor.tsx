import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, FileText, Globe, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export type LessonSource = {
  label: string;
  url: string;
  type?: "web" | "pdf";
  path?: string; // storage path for PDFs (so we can delete them)
};

export default function LessonSourcesEditor({
  lesson,
  onChange,
}: {
  lesson: any;
  onChange: (sources: LessonSource[]) => void;
}) {
  const sources: LessonSource[] = Array.isArray(lesson.sources) ? lesson.sources : [];
  const [uploading, setUploading] = useState(false);
  const [pendingLabel, setPendingLabel] = useState("");

  const update = (idx: number, patch: Partial<LessonSource>) => {
    onChange(sources.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const remove = async (idx: number) => {
    const s = sources[idx];
    if (s.type === "pdf" && s.path) {
      await supabase.storage.from("lesson-sources").remove([s.path]);
    }
    onChange(sources.filter((_, i) => i !== idx));
  };

  const addWeb = () => {
    onChange([...sources, { label: "", url: "", type: "web" }]);
  };

  const uploadPdf = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please choose a PDF file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("PDF must be 20 MB or smaller.");
      return;
    }
    setUploading(true);
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${lesson.id}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("lesson-sources").upload(path, file, {
      contentType: "application/pdf",
      upsert: false,
    });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("lesson-sources").getPublicUrl(path);
    onChange([
      ...sources,
      {
        label: pendingLabel || file.name.replace(/\.pdf$/i, ""),
        url: data.publicUrl,
        type: "pdf",
        path,
      },
    ]);
    setPendingLabel("");
    setUploading(false);
    toast.success("PDF uploaded. Click Save to attach to this lesson.");
  };

  return (
    <div className="space-y-3">
      <Label>Sources</Label>

      {sources.length === 0 && (
        <p className="text-xs text-muted-foreground">No sources yet. Add a website link or upload a PDF below.</p>
      )}

      <div className="space-y-2">
        {sources.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            {s.type === "pdf" ? (
              <FileText className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <Input
              className="flex-1"
              placeholder="Label"
              value={s.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <Input
              className="flex-[2]"
              placeholder="https://..."
              value={s.url}
              onChange={(e) => update(i, { url: e.target.value })}
              readOnly={s.type === "pdf"}
            />
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
        <Button type="button" size="sm" variant="outline" onClick={addWeb}>
          <Plus className="h-4 w-4 mr-1" /> Add website
        </Button>

        <Input
          placeholder="PDF label (optional)"
          value={pendingLabel}
          onChange={(e) => setPendingLabel(e.target.value)}
          className="w-48"
        />
        <label className="inline-flex items-center">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadPdf(f);
              e.currentTarget.value = "";
            }}
          />
          <Button type="button" size="sm" disabled={uploading} asChild>
            <span>
              {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
              Upload PDF
            </span>
          </Button>
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        After uploading or editing sources, click <strong>Save</strong> on this lesson to persist the changes.
      </p>
    </div>
  );
}
