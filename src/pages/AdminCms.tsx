import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RequireAuth from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeoHead } from "@/components/SeoHead";
import { toast } from "sonner";
import { ArrowLeft, FileText, Plus, Eye, EyeOff } from "lucide-react";

type Page = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_published: boolean;
  updated_at: string;
};

export default function AdminCms() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cms_pages")
      .select("id, slug, title, description, is_published, updated_at")
      .order("slug");
    if (error) toast.error(error.message);
    setPages((data as Page[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createPage = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!s || !title.trim()) return toast.error("Slug and title required");
    const { error } = await supabase.from("cms_pages").insert({ slug: s, title: title.trim() });
    if (error) return toast.error(error.message);
    toast.success("Page created");
    setSlug(""); setTitle("");
    load();
  };

  const togglePublish = async (p: Page) => {
    const { error } = await supabase.from("cms_pages").update({ is_published: !p.is_published }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <RequireAuth adminOnly>
      <div className="min-h-screen bg-background">
        <SeoHead lang="en" basePath="/admin/cms" title="CMS — First Aid Angel Admin" description="Manage site content." />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">Content Manager</h1>
          <p className="text-muted-foreground mb-8">Edit marketing pages and reusable content blocks across the site.</p>

          <Card className="p-5 mb-8 rounded-2xl">
            <h2 className="font-display font-semibold mb-3 flex items-center gap-2"><Plus className="h-4 w-4" /> New page</h2>
            <form onSubmit={createPage} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. about" maxLength={64} />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" maxLength={120} />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </Card>

          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid gap-3">
              {pages.map((p) => (
                <Card key={p.id} className="p-4 rounded-2xl flex items-center justify-between gap-4">
                  <Link to={`/admin/cms/${p.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-semibold truncate">{p.title}</div>
                      <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
                    </div>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => togglePublish(p)}>
                    {p.is_published ? <><Eye className="h-4 w-4 mr-1" /> Published</> : <><EyeOff className="h-4 w-4 mr-1" /> Hidden</>}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
