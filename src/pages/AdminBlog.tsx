import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RequireAuth from "@/components/RequireAuth";
import { SeoHead } from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, FileText, Eye, EyeOff, Folder } from "lucide-react";
import { listCategories, type BlogCategory, type BlogPost } from "@/lib/blog";

export default function AdminBlog() {
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [catId, setCatId] = useState<string>("");

  // Category editor
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatProgram, setNewCatProgram] = useState("");

  const load = async () => {
    setLoading(true);
    const [c, { data: p }] = await Promise.all([
      listCategories(),
      supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
    ]);
    setCats(c);
    setPosts((p as BlogPost[]) ?? []);
    if (!catId && c[0]) setCatId(c[0].id);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = newCatSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!s || !newCatName.trim()) return toast.error("Slug + name required");
    const { error } = await supabase.from("blog_categories").insert({
      slug: s,
      name: newCatName.trim(),
      program_slug: newCatProgram.trim() || null,
    });
    if (error) return toast.error(error.message);
    setNewCatSlug(""); setNewCatName(""); setNewCatProgram("");
    toast.success("Category created");
    load();
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId) return toast.error("Pick a category");
    const s = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!s || !title.trim()) return toast.error("Slug + title required");
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ slug: s, title: title.trim(), category_id: catId })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setSlug(""); setTitle("");
    toast.success("Post created");
    window.location.href = `/admin/blog/${(data as any).slug}`;
  };

  const togglePublish = async (p: BlogPost) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ is_published: !p.is_published, published_at: !p.is_published ? new Date().toISOString() : p.published_at })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <RequireAuth adminOnly>
      <div className="min-h-screen bg-background">
        <SeoHead lang="en" basePath="/admin/blog" title="Blog — Admin" description="Manage blog categories and posts." />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground mb-8">SEO-focused articles. Each category powers one course landing page.</p>

          <Card className="p-5 mb-6 rounded-2xl">
            <h2 className="font-display font-semibold mb-3 flex items-center gap-2"><Folder className="h-4 w-4" /> Categories</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {cats.map((c) => (
                <span key={c.id} className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1">
                  {c.name} <span className="opacity-60">/{c.slug}</span>{c.program_slug && <span className="opacity-60"> · {c.program_slug}</span>}
                </span>
              ))}
            </div>
            <form onSubmit={createCategory} className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              <div>
                <Label htmlFor="cs">Slug</Label>
                <Input id="cs" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} placeholder="e.g. paediatric" maxLength={64} />
              </div>
              <div>
                <Label htmlFor="cn">Name</Label>
                <Input id="cn" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Display name" maxLength={120} />
              </div>
              <div>
                <Label htmlFor="cp">Program slug (optional)</Label>
                <Input id="cp" value={newCatProgram} onChange={(e) => setNewCatProgram(e.target.value)} placeholder="parents-childcare-essentials" />
              </div>
              <Button type="submit"><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </form>
          </Card>

          <Card className="p-5 mb-8 rounded-2xl">
            <h2 className="font-display font-semibold mb-3 flex items-center gap-2"><Plus className="h-4 w-4" /> New post</h2>
            <form onSubmit={createPost} className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              <div>
                <Label>Category</Label>
                <Select value={catId} onValueChange={setCatId}>
                  <SelectTrigger><SelectValue placeholder="Pick…" /></SelectTrigger>
                  <SelectContent>
                    {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ps">Slug</Label>
                <Input id="ps" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" maxLength={120} />
              </div>
              <div>
                <Label htmlFor="pt">Title</Label>
                <Input id="pt" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" maxLength={200} />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </Card>

          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid gap-3">
              {posts.map((p) => {
                const cat = cats.find((c) => c.id === p.category_id);
                return (
                  <Card key={p.id} className="p-4 rounded-2xl flex items-center justify-between gap-4">
                    <Link to={`/admin/blog/${p.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold truncate">{p.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {cat?.name ?? "—"} · /blog/{cat?.slug}/{p.slug}
                        </div>
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => togglePublish(p)}>
                      {p.is_published ? <><Eye className="h-4 w-4 mr-1" /> Published</> : <><EyeOff className="h-4 w-4 mr-1" /> Draft</>}
                    </Button>
                  </Card>
                );
              })}
              {posts.length === 0 && (
                <Card className="p-10 text-center text-muted-foreground rounded-2xl">No posts yet.</Card>
              )}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
