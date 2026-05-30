import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import RequireAuth from "@/components/RequireAuth";
import { SeoHead } from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, Upload, ExternalLink, Eye,
  Type, Heading2, Image as ImageIcon, Video, Volume2, BarChart3, Code2, MessageCircle,
  Quote as QuoteIcon, MousePointerClick, HelpCircle, Minus,
} from "lucide-react";
import type { BlogBlock, BlogCategory, BlogPost } from "@/lib/blog";
import { listCategories } from "@/lib/blog";
import { BlogBlockRenderer } from "@/components/blog/BlogBlockRenderer";

type BlockType = BlogBlock["block_type"];
const BLOCK_TYPES: { value: BlockType; label: string; icon: any }[] = [
  { value: "richtext", label: "Rich text", icon: Type },
  { value: "heading", label: "Section heading", icon: Heading2 },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Volume2 },
  { value: "infographic", label: "Infographic", icon: BarChart3 },
  { value: "embed", label: "Embed (YouTube/Vimeo/iframe)", icon: Code2 },
  { value: "callout", label: "Callout", icon: MessageCircle },
  { value: "quote", label: "Quote", icon: QuoteIcon },
  { value: "cta", label: "Call-to-action", icon: MousePointerClick },
  { value: "faq", label: "FAQ", icon: HelpCircle },
  { value: "divider", label: "Divider", icon: Minus },
];

export default function AdminBlogEditor() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [blocks, setBlocks] = useState<BlogBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const load = async () => {
    if (!slug) return;
    setLoading(true);
    const [{ data: p }, c] = await Promise.all([
      supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle(),
      listCategories(),
    ]);
    setCats(c);
    if (!p) { setLoading(false); return; }
    setPost(p as BlogPost);
    const { data: b } = await supabase
      .from("blog_post_blocks").select("*").eq("post_id", (p as any).id).order("sort_order");
    setBlocks((b as BlogBlock[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [slug]);

  const savePost = async () => {
    if (!post) return;
    const { error } = await supabase.from("blog_posts").update({
      title: post.title,
      excerpt: post.excerpt,
      cover_image_url: post.cover_image_url,
      cover_alt: post.cover_alt,
      author: post.author,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      is_published: post.is_published,
      is_featured: post.is_featured,
      published_at: post.is_published && !post.published_at ? new Date().toISOString() : post.published_at,
      reading_minutes: post.reading_minutes,
      category_id: post.category_id,
    }).eq("id", post.id);
    if (error) return toast.error(error.message);
    toast.success("Post saved");
    load();
  };

  const addBlock = async (block_type: BlockType) => {
    if (!post) return;
    const next = (blocks[blocks.length - 1]?.sort_order ?? -1) + 1;
    const { data, error } = await supabase.from("blog_post_blocks").insert({
      post_id: post.id, sort_order: next, block_type,
      title: block_type === "heading" ? "New section" : null,
    }).select().single();
    if (error) return toast.error(error.message);
    setBlocks([...blocks, data as BlogBlock]);
  };

  const updateBlock = (id: string, patch: Partial<BlogBlock>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const saveBlock = async (b: BlogBlock) => {
    const { error } = await supabase.from("blog_post_blocks").update({
      block_type: b.block_type,
      title: b.title, body_md: b.body_md,
      media_url: b.media_url, media_poster_url: b.media_poster_url, media_alt: b.media_alt,
      caption: b.caption, embed_html: b.embed_html,
      cta_label: b.cta_label, cta_url: b.cta_url, data: b.data,
    }).eq("id", b.id);
    if (error) return toast.error(error.message);
    toast.success("Block saved");
  };

  const deleteBlock = async (id: string) => {
    if (!confirm("Delete this block?")) return;
    const { error } = await supabase.from("blog_post_blocks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= blocks.length) return;
    const a = blocks[idx], c = blocks[j];
    const newOrder = [...blocks];
    newOrder[idx] = { ...c, sort_order: a.sort_order };
    newOrder[j] = { ...a, sort_order: c.sort_order };
    setBlocks(newOrder.sort((x, y) => x.sort_order - y.sort_order));
    await Promise.all([
      supabase.from("blog_post_blocks").update({ sort_order: c.sort_order }).eq("id", a.id),
      supabase.from("blog_post_blocks").update({ sort_order: a.sort_order }).eq("id", c.id),
    ]);
  };

  const uploadMedia = async (b: BlogBlock, file: File, field: "media_url" | "media_poster_url" | "cover_image_url") => {
    setUploadingId(b.id + ":" + field);
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${post!.slug}/${b.id}-${field}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file, { upsert: true });
    if (error) { setUploadingId(null); return toast.error(error.message); }
    const { data: pub } = supabase.storage.from("blog-media").getPublicUrl(path);
    updateBlock(b.id, { [field]: pub.publicUrl } as any);
    await supabase.from("blog_post_blocks").update({ [field]: pub.publicUrl }).eq("id", b.id);
    setUploadingId(null);
    toast.success("Uploaded");
  };

  const uploadCover = async (file: File) => {
    if (!post) return;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${post.slug}/cover-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-media").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data: pub } = supabase.storage.from("blog-media").getPublicUrl(path);
    setPost({ ...post, cover_image_url: pub.publicUrl });
  };

  if (loading) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!post) return (
    <div className="p-10">Post not found. <Link to="/admin/blog" className="text-primary underline">Back</Link></div>
  );

  const cat = cats.find((c) => c.id === post.category_id);
  const liveUrl = `/blog/${cat?.slug ?? "uncategorised"}/${post.slug}`;

  return (
    <RequireAuth adminOnly>
      <div className="min-h-screen bg-background">
        <SeoHead lang="en" basePath={`/admin/blog/${post.slug}`} title={`Edit ${post.title} — Admin`} description="Edit blog post." />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link to="/admin/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>

          {/* Meta */}
          <Card className="p-5 mb-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-display font-bold text-2xl">{post.title}</h1>
              <div className="flex items-center gap-2">
                <Label htmlFor="pub" className="text-sm">Published</Label>
                <Switch id="pub" checked={post.is_published} onCheckedChange={(v) => setPost({ ...post, is_published: v })} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={post.category_id} onValueChange={(v) => setPost({ ...post, category_id: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Author</Label>
                <Input value={post.author ?? ""} onChange={(e) => setPost({ ...post, author: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Title</Label>
                <Input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} maxLength={200} />
              </div>
              <div className="sm:col-span-2">
                <Label>Excerpt (shown on cards + search results)</Label>
                <Textarea value={post.excerpt ?? ""} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} maxLength={300} rows={2} />
              </div>
              <div>
                <Label>SEO title (overrides page title)</Label>
                <Input value={post.seo_title ?? ""} onChange={(e) => setPost({ ...post, seo_title: e.target.value })} maxLength={70} />
              </div>
              <div>
                <Label>SEO description</Label>
                <Input value={post.seo_description ?? ""} onChange={(e) => setPost({ ...post, seo_description: e.target.value })} maxLength={160} />
              </div>
              <div>
                <Label>Reading minutes</Label>
                <Input type="number" min={1} value={post.reading_minutes ?? ""} onChange={(e) => setPost({ ...post, reading_minutes: parseInt(e.target.value) || null })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="feat" checked={post.is_featured} onCheckedChange={(v) => setPost({ ...post, is_featured: v })} />
                <Label htmlFor="feat">Featured (boost on landing pages)</Label>
              </div>
              <div className="sm:col-span-2">
                <Label>Cover image</Label>
                <div className="flex items-center gap-3">
                  {post.cover_image_url && <img src={post.cover_image_url} alt="" className="h-16 w-16 object-cover rounded-md border" />}
                  <Input value={post.cover_image_url ?? ""} onChange={(e) => setPost({ ...post, cover_image_url: e.target.value })} placeholder="https://…" />
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const f = e.target.files?.[0]; if (f) uploadCover(f);
                    }} />
                    <Button asChild variant="outline" size="sm"><span><Upload className="h-4 w-4 mr-1" /> Upload</span></Button>
                  </label>
                </div>
                <Input className="mt-2" value={post.cover_alt ?? ""} onChange={(e) => setPost({ ...post, cover_alt: e.target.value })} placeholder="Alt text (accessibility + SEO)" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <Button onClick={savePost}><Save className="h-4 w-4 mr-1" /> Save post</Button>
              <Button asChild variant="outline">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-1" /> View live</a>
              </Button>
            </div>
          </Card>

          {/* Block library */}
          <Card className="p-5 mb-6 rounded-2xl">
            <h2 className="font-display font-semibold mb-3">Add a block</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {BLOCK_TYPES.map((bt) => (
                <Button key={bt.value} variant="outline" size="sm" onClick={() => addBlock(bt.value)} className="justify-start">
                  <bt.icon className="h-4 w-4 mr-1" /> {bt.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Blocks */}
          <div className="space-y-4">
            {blocks.map((b, i) => (
              <Card key={b.id} className="p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">#{i + 1}</span>
                    <Select value={b.block_type} onValueChange={(v) => updateBlock(b.id, { block_type: v as BlockType })}>
                      <SelectTrigger className="w-56 h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {BLOCK_TYPES.map((bt) => <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="outline" onClick={() => move(b.id, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" onClick={() => move(b.id, 1)} disabled={i === blocks.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" onClick={() => deleteBlock(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>

                {b.block_type !== "divider" && (
                  <div className="grid gap-3">
                    {!["divider", "image", "infographic", "embed"].includes(b.block_type) && (
                      <div>
                        <Label>Title</Label>
                        <Input value={b.title ?? ""} onChange={(e) => updateBlock(b.id, { title: e.target.value })} maxLength={200} />
                      </div>
                    )}

                    {["richtext", "callout", "quote", "cta", "faq"].includes(b.block_type) && (
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label>Body (Markdown)</Label>
                          <Textarea rows={6} value={b.body_md ?? ""} onChange={(e) => updateBlock(b.id, { body_md: e.target.value })} />
                        </div>
                        <div>
                          <Label>Preview</Label>
                          <div className="border rounded-md p-3 bg-muted/30 min-h-[120px] prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{b.body_md ?? "*Empty*"}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}

                    {b.block_type === "callout" && (
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <Label>Variant</Label>
                          <Select
                            value={(b.data as any)?.variant ?? "info"}
                            onValueChange={(v) => updateBlock(b.id, { data: { ...(b.data ?? {}), variant: v } })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Info (blue)</SelectItem>
                              <SelectItem value="tip">Tip (amber)</SelectItem>
                              <SelectItem value="warning">Warning (red)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {["image", "infographic", "video", "audio"].includes(b.block_type) && (
                      <>
                        <div>
                          <Label>Media URL</Label>
                          <div className="flex items-center gap-3">
                            <Input value={b.media_url ?? ""} onChange={(e) => updateBlock(b.id, { media_url: e.target.value })} placeholder="https://…" />
                            <label className="cursor-pointer">
                              <input type="file" className="hidden"
                                accept={b.block_type === "audio" ? "audio/*" : b.block_type === "video" ? "video/*" : "image/*"}
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMedia(b, f, "media_url"); }} />
                              <Button asChild variant="outline" size="sm" disabled={uploadingId === b.id + ":media_url"}>
                                <span><Upload className="h-4 w-4 mr-1" />{uploadingId === b.id + ":media_url" ? "…" : "Upload"}</span>
                              </Button>
                            </label>
                          </div>
                        </div>
                        {b.block_type === "video" && (
                          <div>
                            <Label>Poster image URL (optional)</Label>
                            <div className="flex items-center gap-3">
                              <Input value={b.media_poster_url ?? ""} onChange={(e) => updateBlock(b.id, { media_poster_url: e.target.value })} placeholder="https://…" />
                              <label className="cursor-pointer">
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMedia(b, f, "media_poster_url"); }} />
                                <Button asChild variant="outline" size="sm"><span><Upload className="h-4 w-4 mr-1" />Upload</span></Button>
                              </label>
                            </div>
                          </div>
                        )}
                        {["image", "infographic"].includes(b.block_type) && (
                          <div>
                            <Label>Alt text (SEO + accessibility)</Label>
                            <Input value={b.media_alt ?? ""} onChange={(e) => updateBlock(b.id, { media_alt: e.target.value })} />
                          </div>
                        )}
                        <div>
                          <Label>Caption</Label>
                          <Input value={b.caption ?? ""} onChange={(e) => updateBlock(b.id, { caption: e.target.value })} />
                        </div>
                      </>
                    )}

                    {b.block_type === "embed" && (
                      <div>
                        <Label>Embed HTML (iframe or oEmbed snippet — sanitised on render)</Label>
                        <Textarea rows={4} value={b.embed_html ?? ""} onChange={(e) => updateBlock(b.id, { embed_html: e.target.value })}
                          placeholder='<iframe src="https://www.youtube.com/embed/..." allow="..." allowfullscreen></iframe>' />
                      </div>
                    )}

                    {b.block_type === "cta" && (
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
                    )}

                    {/* Inline live preview */}
                    <div>
                      <Label className="flex items-center gap-1"><Eye className="h-4 w-4" /> Live preview</Label>
                      <div className="border rounded-md p-4 bg-background mt-1">
                        <BlogBlockRenderer block={b} />
                      </div>
                    </div>

                    <Button onClick={() => saveBlock(b)} className="w-fit"><Save className="h-4 w-4 mr-1" /> Save block</Button>
                  </div>
                )}
              </Card>
            ))}
            {blocks.length === 0 && (
              <Card className="p-10 text-center text-muted-foreground rounded-2xl">No blocks yet. Add one above.</Card>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
