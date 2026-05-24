import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Upload, Trash2, Video as VideoIcon, CheckCircle2, ArrowLeft, Save, ChevronDown, Link as LinkIcon } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  slug: string;
  title: string;
  video_url: string | null;
  video_duration_seconds: number | null;
  sort_order: number;
  video_source_name: string | null;
  video_source_website: string | null;
  video_source_youtube: string | null;
}

function formatDuration(sec: number | null | undefined): string {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function getMp4Duration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(v.duration || 0);
    };
    v.onerror = () => { URL.revokeObjectURL(url); resolve(0); };
    v.src = url;
  });
}

export default function AdminVideos() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { name: string; website: string; youtube: string }>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id,slug,title,video_url,video_duration_seconds,sort_order,video_source_name,video_source_website,video_source_youtube")
      .order("sort_order");
    if (error) toast.error(error.message);
    const list = (data ?? []) as Course[];
    setCourses(list);
    setEdits(Object.fromEntries(list.map(c => [c.id, {
      name: c.video_source_name ?? "",
      website: c.video_source_website ?? "",
      youtube: c.video_source_youtube ?? "",
    }])));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleFile = async (course: Course, file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please pick an MP4 (or other video) file.");
      return;
    }
    setUploadingId(course.id);
    setProgress((p) => ({ ...p, [course.id]: 0 }));
    try {
      const duration = await getMp4Duration(file);
      const ext = file.name.split(".").pop() || "mp4";
      const path = `${course.slug}/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("lesson-videos")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("lesson-videos").getPublicUrl(path);

      // Delete old file (best-effort)
      if (course.video_url) {
        const oldPath = course.video_url.split("/lesson-videos/")[1];
        if (oldPath) {
          await supabase.storage.from("lesson-videos").remove([oldPath]);
        }
      }

      const { error: updErr } = await supabase
        .from("courses")
        .update({ video_url: pub.publicUrl, video_duration_seconds: duration })
        .eq("id", course.id);
      if (updErr) throw updErr;

      toast.success(`Uploaded video for "${course.title}"`);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploadingId(null);
      setProgress((p) => { const n = { ...p }; delete n[course.id]; return n; });
    }
  };

  const removeVideo = async (course: Course) => {
    if (!course.video_url) return;
    if (!confirm(`Remove video from "${course.title}"?`)) return;
    const oldPath = course.video_url.split("/lesson-videos/")[1];
    if (oldPath) {
      await supabase.storage.from("lesson-videos").remove([oldPath]);
    }
    const { error } = await supabase
      .from("courses")
      .update({ video_url: null, video_duration_seconds: null })
      .eq("id", course.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Video removed");
    await load();
  };

  const saveSource = async (course: Course) => {
    const e = edits[course.id] ?? { name: "", website: "", youtube: "" };
    setSavingId(course.id);
    const { error } = await supabase
      .from("courses")
      .update({
        video_source_name: e.name.trim() || null,
        video_source_website: e.website.trim() || null,
        video_source_youtube: e.youtube.trim() || null,
      })
      .eq("id", course.id);
    setSavingId(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Source saved");
    await load();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const withVideo = courses.filter(c => c.video_url).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <Link to="/admin/courses" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to topics
        </Link>
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold">Course videos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Upload one MP4 per topic. Learners must watch 90% before they can take the quiz.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {withVideo} / {courses.length} topics have a video
          </Badge>
        </div>

        <div className="space-y-3">
          {courses.map((c) => {
            const hasVideo = !!c.video_url;
            const isUploading = uploadingId === c.id;
            return (
              <Card key={c.id} className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${hasVideo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {hasVideo ? <CheckCircle2 className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {hasVideo
                        ? <>Video uploaded · {formatDuration(c.video_duration_seconds)}</>
                        : <>No video yet</>}
                    </div>
                  </div>
                  {hasVideo && (
                    <a
                      href={c.video_url!}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Preview
                    </a>
                  )}
                  <input
                    ref={(el) => { fileRefs.current[c.id] = el; }}
                    type="file"
                    accept="video/mp4,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(c, f);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    size="sm"
                    variant={hasVideo ? "outline" : "default"}
                    disabled={isUploading}
                    onClick={() => fileRefs.current[c.id]?.click()}
                  >
                    {isUploading ? (
                      <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Uploading…</>
                    ) : (
                      <><Upload className="h-4 w-4 mr-1.5" /> {hasVideo ? "Replace" : "Upload"}</>
                    )}
                  </Button>
                  {hasVideo && !isUploading && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeVideo(c)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor={`src-name-${c.id}`} className="text-xs">Source name</Label>
                    <Input
                      id={`src-name-${c.id}`}
                      placeholder="e.g. British Red Cross"
                      value={edits[c.id]?.name ?? ""}
                      onChange={(e) => setEdits(p => ({ ...p, [c.id]: { ...(p[c.id] ?? { name: "", website: "", youtube: "" }), name: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`src-web-${c.id}`} className="text-xs">Website</Label>
                    <Input
                      id={`src-web-${c.id}`}
                      placeholder="https://…"
                      value={edits[c.id]?.website ?? ""}
                      onChange={(e) => setEdits(p => ({ ...p, [c.id]: { ...(p[c.id] ?? { name: "", website: "", youtube: "" }), website: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`src-yt-${c.id}`} className="text-xs">YouTube URL</Label>
                    <Input
                      id={`src-yt-${c.id}`}
                      placeholder="https://youtube.com/…"
                      value={edits[c.id]?.youtube ?? ""}
                      onChange={(e) => setEdits(p => ({ ...p, [c.id]: { ...(p[c.id] ?? { name: "", website: "", youtube: "" }), youtube: e.target.value } }))}
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end">
                    <Button size="sm" variant="outline" disabled={savingId === c.id} onClick={() => saveSource(c)}>
                      {savingId === c.id
                        ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving…</>
                        : <><Save className="h-4 w-4 mr-1.5" /> Save source</>}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Tip: videos play directly from Cloud Storage. Keep files under ~100&nbsp;MB each for best playback. Total bucket capacity is generous.
        </p>
      </main>
    </div>
  );
}
