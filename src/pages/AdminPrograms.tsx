import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Loader2, Copy, Eye, EyeOff, Users, Award, BarChart3, BookOpen, HelpCircle } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import { SortableList } from "@/components/admin/Sortable";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProgramStats { enrollments: number; certificates: number; avgFinalScore: number | null; }
interface TopicMeta { lessons: number; questions: number; title: string; slug: string; }

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, ProgramStats>>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [topicMeta, setTopicMeta] = useState<Record<string, TopicMeta>>({});
  const [selected, setSelected] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const loadList = async () => {
    const [{ data: ps }, { data: cs }] = await Promise.all([
      supabase.from("programs").select("*").order("sort_order"),
      supabase.from("courses").select("id,title,slug").order("sort_order"),
    ]);
    setPrograms(ps ?? []);
    setCourses(cs ?? []);
    loadStats(ps ?? []);
    loadTopicMeta(cs ?? []);
  };

  const loadStats = async (list: any[]) => {
    if (!list.length) return;
    const ids = list.map(p => p.id);
    const [{ data: enrolls }, { data: certs }, { data: attempts }] = await Promise.all([
      supabase.from("program_enrollments").select("program_id").in("program_id", ids),
      supabase.from("program_certificates").select("program_id").in("program_id", ids),
      supabase.from("program_quiz_attempts").select("program_id,score,total").in("program_id", ids),
    ]);
    const map: Record<string, ProgramStats> = {};
    for (const id of ids) map[id] = { enrollments: 0, certificates: 0, avgFinalScore: null };
    for (const e of enrolls ?? []) map[e.program_id].enrollments++;
    for (const c of certs ?? []) map[c.program_id].certificates++;
    const sums: Record<string, { total: number; n: number }> = {};
    for (const a of attempts ?? []) {
      const pct = a.total ? (a.score / a.total) * 100 : 0;
      sums[a.program_id] = sums[a.program_id] || { total: 0, n: 0 };
      sums[a.program_id].total += pct; sums[a.program_id].n++;
    }
    for (const id of ids) if (sums[id]) map[id].avgFinalScore = Math.round(sums[id].total / sums[id].n);
    setStats(map);
  };

  const loadTopicMeta = async (cs: any[]) => {
    if (!cs.length) return;
    const ids = cs.map(c => c.id);
    const [{ data: ls }, { data: qs }] = await Promise.all([
      supabase.from("lessons").select("course_id").in("course_id", ids),
      supabase.from("quiz_questions").select("course_id").in("course_id", ids),
    ]);
    const map: Record<string, TopicMeta> = {};
    for (const c of cs) map[c.id] = { lessons: 0, questions: 0, title: c.title, slug: c.slug };
    for (const l of ls ?? []) if (map[l.course_id]) map[l.course_id].lessons++;
    for (const q of qs ?? []) if (map[q.course_id]) map[q.course_id].questions++;
    setTopicMeta(map);
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

  const duplicateProgram = async (src: any) => {
    if (!confirm(`Duplicate "${src.title}" with topics & final quiz?`)) return;
    const { id, created_at, updated_at, slug, title, is_published, ...rest } = src;
    const { data: copy, error } = await supabase.from("programs").insert({
      ...rest, slug: `${slug}-copy-${Date.now()}`, title: `${title} (copy)`, is_published: false,
    }).select().single();
    if (error || !copy) { toast.error(error?.message ?? "Failed"); return; }
    const { data: ts } = await supabase.from("program_topics").select("*").eq("program_id", src.id);
    if (ts?.length) {
      await supabase.from("program_topics").insert(ts.map(({ id, created_at, ...t }) => ({ ...t, program_id: copy.id })));
    }
    const { data: qs } = await supabase.from("program_quiz_questions").select("*").eq("program_id", src.id);
    if (qs?.length) {
      await supabase.from("program_quiz_questions").insert(qs.map(({ id, created_at, updated_at, ...q }) => ({ ...q, program_id: copy.id })));
    }
    toast.success("Duplicated");
    await loadList();
    loadDetails(copy);
  };

  const bulkSetPublished = async (publish: boolean) => {
    if (selectedIds.size === 0) return;
    const { error } = await supabase.from("programs").update({ is_published: publish }).in("id", Array.from(selectedIds));
    if (error) { toast.error(error.message); return; }
    toast.success(`${publish ? "Published" : "Unpublished"} ${selectedIds.size} program(s)`);
    setSelectedIds(new Set());
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

  const reorderTopics = async (next: any[]) => {
    setTopics(next.map((t, i) => ({ ...t, sort_order: i })));
    await Promise.all(next.map((t, i) => supabase.from("program_topics").update({ sort_order: i }).eq("id", t.id)));
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
  const reorderQuestions = async (next: any[]) => {
    setQuestions(next.map((q, i) => ({ ...q, sort_order: i })));
    await Promise.all(next.map((q, i) => supabase.from("program_quiz_questions").update({ sort_order: i }).eq("id", q.id)));
  };

  const allSelected = selectedIds.size > 0 && selectedIds.size === programs.length;

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const selStats = selected ? stats[selected.id] : null;
  const totalMinutes = topics.reduce((sum, t) => sum + (courses.find(c => c.id === t.course_id) as any)?.duration_minutes || 0, 0);
  const totalLessons = topics.reduce((sum, t) => sum + (topicMeta[t.course_id]?.lessons ?? 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Courses</h1>
          <Link to="/admin/courses" className="text-sm text-muted-foreground hover:text-primary">→ Manage topics</Link>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <aside>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold">All programs ({programs.length})</h2>
              <Button size="sm" onClick={newProgram}><Plus className="h-4 w-4" /></Button>
            </div>

            {selectedIds.size > 0 && (
              <Card className="p-2 mb-3 flex items-center justify-between bg-primary/5">
                <span className="text-xs">{selectedIds.size} selected</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => bulkSetPublished(true)} title="Publish"><Eye className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => bulkSetPublished(false)} title="Unpublish"><EyeOff className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear</Button>
                </div>
              </Card>
            )}

            <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
              <Checkbox checked={allSelected} onCheckedChange={v => setSelectedIds(v ? new Set(programs.map(p => p.id)) : new Set())} />
              <span>Select all</span>
            </div>

            <div className="space-y-1 mt-1">
              {programs.map(p => {
                const s = stats[p.id];
                const isSel = selectedIds.has(p.id);
                return (
                  <div key={p.id} className={`flex items-start gap-2 p-2 rounded-lg hover:bg-muted ${selected?.id === p.id ? "bg-muted" : ""}`}>
                    <Checkbox
                      className="mt-1"
                      checked={isSel}
                      onCheckedChange={v => {
                        const next = new Set(selectedIds);
                        if (v) next.add(p.id); else next.delete(p.id);
                        setSelectedIds(next);
                      }}
                    />
                    <button onClick={() => loadDetails(p)} className="flex-1 text-left min-w-0">
                      <div className={`truncate text-sm ${selected?.id === p.id ? "font-medium" : ""}`}>{p.title}</div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 flex-wrap">
                        <span className={p.is_published ? "text-green-600" : ""}>{p.is_published ? "● Published" : "○ Draft"}</span>
                        {s && (<>
                          <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" />{s.enrollments}</span>
                          <span className="flex items-center gap-0.5"><Award className="h-2.5 w-2.5" />{s.certificates}</span>
                          {s.avgFinalScore !== null && <span>{s.avgFinalScore}% final</span>}
                        </>)}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>

          {selected ? (
            <Tabs defaultValue="details">
              <div className="flex items-center justify-between mb-3">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="topics">Topics ({topics.length})</TabsTrigger>
                  <TabsTrigger value="quiz">Final quiz ({questions.length})</TabsTrigger>
                  <TabsTrigger value="stats"><BarChart3 className="h-3 w-3 mr-1" />Stats</TabsTrigger>
                </TabsList>
                <Button size="sm" variant="outline" onClick={() => duplicateProgram(selected)}><Copy className="h-3 w-3 mr-1" />Duplicate</Button>
              </div>

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
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold">Included topics ({topics.length})</h3>
                    <div className="text-xs text-muted-foreground">{totalLessons} lessons · ~{totalMinutes} min total</div>
                  </div>
                  {topics.length === 0 && <p className="text-sm text-muted-foreground">No topics yet — pick from the list below.</p>}
                  <SortableList items={topics} onReorder={reorderTopics}>
                    {(t, i) => {
                      const meta = topicMeta[t.course_id];
                      return (
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                          <span className="text-xs w-6 text-muted-foreground font-mono">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{meta?.title ?? "Unknown topic"}</div>
                            <div className="flex gap-3 text-[11px] text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-0.5"><BookOpen className="h-3 w-3" />{meta?.lessons ?? 0} lessons</span>
                              <span className="flex items-center gap-0.5"><HelpCircle className="h-3 w-3" />{meta?.questions ?? 0} questions</span>
                            </div>
                          </div>
                          <Link to={`/admin/courses`} className="text-xs text-primary hover:underline">Edit</Link>
                          <Button size="sm" variant="ghost" onClick={() => toggleTopic(t.course_id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      );
                    }}
                  </SortableList>

                  <div className="pt-4 border-t">
                    <h3 className="font-display font-bold mb-2">Available topics</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {courses.map(c => {
                        const checked = !!topics.find(t => t.course_id === c.id);
                        const meta = topicMeta[c.id];
                        return (
                          <label key={c.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                            <Checkbox checked={checked} onCheckedChange={() => toggleTopic(c.id)} />
                            <span className="text-sm flex-1 truncate">{c.title}</span>
                            {meta && <Badge variant="secondary" className="text-[10px]">{meta.lessons}L · {meta.questions}Q</Badge>}
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
                <SortableList items={questions} onReorder={reorderQuestions}>
                  {(q) => (
                    <Card className="p-4 space-y-3">
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
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => saveQuestion(q)}><Save className="h-4 w-4 mr-1" />Save</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteQuestion(q.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </Card>
                  )}
                </SortableList>
              </TabsContent>

              <TabsContent value="stats">
                <Card className="p-5">
                  {selStats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <Stat label="Enrollments" value={selStats.enrollments} icon={Users} />
                      <Stat label="Certificates" value={selStats.certificates} icon={Award} />
                      <Stat label="Avg final score" value={selStats.avgFinalScore !== null ? `${selStats.avgFinalScore}%` : "—"} icon={BarChart3} />
                      <Stat label="Topics included" value={topics.length} icon={BookOpen} />
                    </div>
                  ) : <p className="text-muted-foreground text-sm">No data yet.</p>}
                </Card>
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

function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="p-4 rounded-xl bg-muted/40">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <Icon className="h-3 w-3" />
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
