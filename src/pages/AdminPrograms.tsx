import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadList = async () => {
    const [{ data: ps }, { data: cs }] = await Promise.all([
      supabase.from("programs").select("*").order("sort_order"),
      supabase.from("courses").select("id,title,slug").order("sort_order"),
    ]);
    setPrograms(ps ?? []);
    setCourses(cs ?? []);
  };

  useEffect(() => { loadList().then(() => setLoading(false)); }, []);

  const loadDetails = async (p: any) => {
    setSelected(p);
    const [{ data: ts }, { data: qs }] = await Promise.all([
      supabase.from("program_topics").select("id,course_id,sort_order").eq("program_id", p.id).order("sort_order"),
      supabase.from("program_quiz_questions").select("*").eq("program_id", p.id).order("sort_order"),
    ]);
    setTopics(ts ?? []);
    setQuestions(qs ?? []);
  };

  const newProgram = async () => {
    const { data, error } = await supabase.from("programs").insert({
      slug: `program-${Date.now()}`, title: "New program",
    }).select().single();
    if (error) { toast.error(error.message); return; }
    await loadList();
    loadDetails(data);
  };

  const saveProgram = async () => {
    if (!selected) return;
    const { id, created_at, updated_at, ...patch } = selected;
    const { error } = await supabase.from("programs").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Saved"); loadList(); }
  };

  const deleteProgram = async () => {
    if (!selected || !confirm("Delete this program?")) return;
    await supabase.from("programs").delete().eq("id", selected.id);
    setSelected(null); setTopics([]); setQuestions([]);
    loadList();
  };

  const toggleTopic = async (courseId: string) => {
    if (!selected) return;
    const existing = topics.find(t => t.course_id === courseId);
    if (existing) {
      await supabase.from("program_topics").delete().eq("id", existing.id);
    } else {
      await supabase.from("program_topics").insert({
        program_id: selected.id, course_id: courseId, sort_order: topics.length,
      });
    }
    loadDetails(selected);
  };

  const moveTopic = async (id: string, dir: -1 | 1) => {
    const idx = topics.findIndex(t => t.id === id);
    const swapWith = topics[idx + dir];
    if (!swapWith) return;
    await Promise.all([
      supabase.from("program_topics").update({ sort_order: swapWith.sort_order }).eq("id", id),
      supabase.from("program_topics").update({ sort_order: topics[idx].sort_order }).eq("id", swapWith.id),
    ]);
    loadDetails(selected);
  };

  const addQuestion = async () => {
    const { data, error } = await supabase.from("program_quiz_questions").insert({
      program_id: selected.id, question: "New question",
      choices: ["Option A", "Option B", "Option C", "Option D"],
      correct_index: 0, sort_order: questions.length,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setQuestions([...questions, data]);
  };

  const saveQuestion = async (q: any) => {
    const { id, created_at, updated_at, ...patch } = q;
    const { error } = await supabase.from("program_quiz_questions").update(patch).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Question saved");
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await supabase.from("program_quiz_questions").delete().eq("id", id);
    setQuestions(questions.filter(q => q.id !== id));
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Programs</h1>
          <Link to="/admin/courses" className="text-sm text-muted-foreground hover:text-primary">→ Manage topics (courses)</Link>
        </div>
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <aside>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold">All programs</h2>
              <Button size="sm" onClick={newProgram}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-1">
              {programs.map(p => (
                <button key={p.id} onClick={() => loadDetails(p)}
                  className={`block w-full text-left p-3 rounded-lg text-sm hover:bg-muted ${selected?.id === p.id ? "bg-muted font-medium" : ""}`}>
                  <div className="truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.is_published ? "Published" : "Draft"}</div>
                </button>
              ))}
            </div>
          </aside>

          {selected ? (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="topics">Topics ({topics.length})</TabsTrigger>
                <TabsTrigger value="quiz">Final quiz ({questions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={selected.title} onChange={e => setSelected({ ...selected, title: e.target.value })} /></div>
                    <div><Label>Slug</Label><Input value={selected.slug} onChange={e => setSelected({ ...selected, slug: e.target.value })} /></div>
                  </div>
                  <div><Label>Summary</Label><Input value={selected.summary ?? ""} onChange={e => setSelected({ ...selected, summary: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea rows={5} value={selected.description ?? ""} onChange={e => setSelected({ ...selected, description: e.target.value })} /></div>
                  <div><Label>Cover image URL</Label><Input value={selected.cover_url ?? ""} onChange={e => setSelected({ ...selected, cover_url: e.target.value })} /></div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div><Label>Minutes</Label><Input type="number" value={selected.duration_minutes} onChange={e => setSelected({ ...selected, duration_minutes: +e.target.value })} /></div>
                    <div><Label>Pass mark %</Label><Input type="number" value={selected.pass_mark} onChange={e => setSelected({ ...selected, pass_mark: +e.target.value })} /></div>
                    <div><Label>Sort</Label><Input type="number" value={selected.sort_order} onChange={e => setSelected({ ...selected, sort_order: +e.target.value })} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={selected.is_published} onCheckedChange={v => setSelected({ ...selected, is_published: v })} />
                    <Label>Published</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveProgram}><Save className="h-4 w-4 mr-1" /> Save</Button>
                    <Button variant="destructive" onClick={deleteProgram}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="topics">
                <Card className="p-5 space-y-4">
                  <div>
                    <h3 className="font-display font-bold mb-2">Included topics (in order)</h3>
                    {topics.length === 0 && <p className="text-sm text-muted-foreground">No topics yet — pick from the list below.</p>}
                    <div className="space-y-2">
                      {topics.map((t, i) => {
                        const c = courses.find(x => x.id === t.course_id);
                        return (
                          <div key={t.id} className="flex items-center gap-2 p-2 border rounded-lg">
                            <span className="text-xs w-6 text-muted-foreground">{i + 1}.</span>
                            <span className="flex-1">{c?.title ?? "Unknown topic"}</span>
                            <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => moveTopic(t.id, -1)}><ArrowUp className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" disabled={i === topics.length - 1} onClick={() => moveTopic(t.id, 1)}><ArrowDown className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleTopic(t.course_id)}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="font-display font-bold mb-2">Available topics</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {courses.map(c => {
                        const checked = !!topics.find(t => t.course_id === c.id);
                        return (
                          <label key={c.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                            <Checkbox checked={checked} onCheckedChange={() => toggleTopic(c.id)} />
                            <span className="text-sm">{c.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="quiz">
                <p className="text-sm text-muted-foreground mb-3">Optional. If you add questions, learners must pass this final quiz (in addition to all topic quizzes) to earn the program certificate.</p>
                <Button onClick={addQuestion} className="mb-3"><Plus className="h-4 w-4 mr-1" /> Add question</Button>
                <div className="space-y-3">
                  {questions.map((q) => (
                    <Card key={q.id} className="p-4 space-y-3">
                      <div><Label>Question</Label><Textarea rows={2} value={q.question} onChange={e => setQuestions(questions.map(x => x.id === q.id ? { ...x, question: e.target.value } : x))} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        {(q.choices as string[]).map((ch, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input type="radio" name={`correct-${q.id}`} checked={q.correct_index === i}
                              onChange={() => setQuestions(questions.map(x => x.id === q.id ? { ...x, correct_index: i } : x))} />
                            <Input value={ch} onChange={e => {
                              const cs = [...q.choices]; cs[i] = e.target.value;
                              setQuestions(questions.map(x => x.id === q.id ? { ...x, choices: cs } : x));
                            }} />
                          </div>
                        ))}
                      </div>
                      <div><Label>Explanation</Label><Input value={q.explanation ?? ""} onChange={e => setQuestions(questions.map(x => x.id === q.id ? { ...x, explanation: e.target.value } : x))} /></div>
                      <div className="grid grid-cols-[100px_1fr_auto_auto] gap-2 items-end">
                        <div><Label>Order</Label><Input type="number" value={q.sort_order} onChange={e => setQuestions(questions.map(x => x.id === q.id ? { ...x, sort_order: +e.target.value } : x))} /></div>
                        <div />
                        <Button size="sm" onClick={() => saveQuestion(q)}><Save className="h-4 w-4 mr-1" />Save</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteQuestion(q.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="p-10 text-center text-muted-foreground">Select or create a program</Card>
          )}
        </div>
      </main>
    </div>
  );
}
