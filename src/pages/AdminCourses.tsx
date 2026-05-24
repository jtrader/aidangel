import { useEffect, useMemo, useState } from "react";
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
import { Plus, Trash2, Save, Loader2, Copy, Eye, EyeOff, Users, Award, GraduationCap, BarChart3 } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import LessonSourcesEditor from "@/components/admin/LessonSourcesEditor";
import { SortableList } from "@/components/admin/Sortable";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface TopicStats { enrollments: number; certificates: number; avgScore: number | null; programs: number; }

export default function AdminCourses() {
  const [topics, setTopics] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, TopicStats>>({});
  const [programsByTopic, setProgramsByTopic] = useState<Record<string, { id: string; title: string; slug: string }[]>>({});
  const [selected, setSelected] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const loadTopics = async () => {
    const { data } = await supabase.from("courses").select("*").order("sort_order");
    setTopics(data ?? []);
    loadStats(data ?? []);
  };

  const loadStats = async (list: any[]) => {
    if (!list.length) return;
    const ids = list.map(c => c.id);
    const [{ data: enrolls }, { data: certs }, { data: attempts }, { data: pt }] = await Promise.all([
      supabase.from("course_enrollments").select("course_id").in("course_id", ids),
      supabase.from("certificates").select("course_id").in("course_id", ids),
      supabase.from("quiz_attempts").select("course_id,score,total").in("course_id", ids),
      supabase.from("program_topics").select("course_id, program:programs(id,title,slug)").in("course_id", ids),
    ]);
    const map: Record<string, TopicStats> = {};
    const progMap: Record<string, any[]> = {};
    for (const id of ids) map[id] = { enrollments: 0, certificates: 0, avgScore: null, programs: 0 };
    for (const e of enrolls ?? []) map[e.course_id].enrollments++;
    for (const c of certs ?? []) map[c.course_id].certificates++;
    const sums: Record<string, { total: number; n: number }> = {};
    for (const a of attempts ?? []) {
      const pct = a.total ? (a.score / a.total) * 100 : 0;
      sums[a.course_id] = sums[a.course_id] || { total: 0, n: 0 };
      sums[a.course_id].total += pct; sums[a.course_id].n++;
    }
    for (const id of ids) if (sums[id]) map[id].avgScore = Math.round(sums[id].total / sums[id].n);
    for (const row of (pt ?? []) as any[]) {
      progMap[row.course_id] = progMap[row.course_id] || [];
      if (row.program) progMap[row.course_id].push(row.program);
      map[row.course_id].programs++;
    }
    setStats(map);
    setProgramsByTopic(progMap);
  };

  useEffect(() => { loadTopics().then(() => setLoading(false)); }, []);

  const loadDetails = async (c: any) => {
    setSelected(c);
    const { data: ls } = await supabase.from("lessons").select("*").eq("course_id", c.id).order("sort_order");
    setLessons(ls ?? []);
    const { data: qs } = await supabase.from("quiz_questions").select("*").eq("course_id", c.id).order("sort_order");
    setQuestions(qs ?? []);
  };

  const newTopic = async () => {
    const { data, error } = await supabase.from("courses").insert({
      slug: `topic-${Date.now()}`, title: "New topic",
    }).select().single();
    if (error) { toast.error(error.message); return; }
    await loadTopics();
    loadDetails(data);
  };

  const saveTopic = async () => {
    if (!selected) return;
    const { id, created_at, updated_at, ...patch } = selected;
    const { error } = await supabase.from("courses").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Saved"); loadTopics(); }
  };

  const deleteTopic = async () => {
    if (!selected || !confirm("Delete this topic and all its lessons/questions?")) return;
    await supabase.from("courses").delete().eq("id", selected.id);
    setSelected(null); setLessons([]); setQuestions([]);
    loadTopics();
  };

  const duplicateTopic = async (src: any) => {
    if (!confirm(`Duplicate "${src.title}" with all lessons & quiz questions?`)) return;
    const { id, created_at, updated_at, slug, title, is_published, ...rest } = src;
    const { data: copy, error } = await supabase.from("courses").insert({
      ...rest, slug: `${slug}-copy-${Date.now()}`, title: `${title} (copy)`, is_published: false,
    }).select().single();
    if (error || !copy) { toast.error(error?.message ?? "Failed"); return; }
    const { data: ls } = await supabase.from("lessons").select("*").eq("course_id", src.id);
    if (ls?.length) {
      await supabase.from("lessons").insert(ls.map(({ id, created_at, updated_at, slug, ...l }) => ({
        ...l, course_id: copy.id, slug: `${slug}-${Date.now()}`,
      })));
    }
    const { data: qs } = await supabase.from("quiz_questions").select("*").eq("course_id", src.id);
    if (qs?.length) {
      await supabase.from("quiz_questions").insert(qs.map(({ id, created_at, updated_at, ...q }) => ({
        ...q, course_id: copy.id,
      })));
    }
    toast.success("Duplicated");
    await loadTopics();
    loadDetails(copy);
  };

  const bulkSetPublished = async (publish: boolean) => {
    if (selectedIds.size === 0) return;
    const { error } = await supabase.from("courses").update({ is_published: publish }).in("id", Array.from(selectedIds));
    if (error) { toast.error(error.message); return; }
    toast.success(`${publish ? "Published" : "Unpublished"} ${selectedIds.size} topic(s)`);
    setSelectedIds(new Set());
    loadTopics();
  };

  const reorderLessons = async (next: any[]) => {
    setLessons(next.map((l, i) => ({ ...l, sort_order: i })));
    await Promise.all(next.map((l, i) => supabase.from("lessons").update({ sort_order: i }).eq("id", l.id)));
  };
  const reorderQuestions = async (next: any[]) => {
    setQuestions(next.map((q, i) => ({ ...q, sort_order: i })));
    await Promise.all(next.map((q, i) => supabase.from("quiz_questions").update({ sort_order: i }).eq("id", q.id)));
  };

  const addLesson = async () => {
    const { data, error } = await supabase.from("lessons").insert({
      course_id: selected.id, slug: `lesson-${Date.now()}`, title: "New lesson", sort_order: lessons.length,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setLessons([...lessons, data]);
  };
  const saveLesson = async (l: any) => {
    const { id, created_at, updated_at, ...patch } = l;
    const { error } = await supabase.from("lessons").update(patch).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Lesson saved");
  };
  const deleteLesson = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    await supabase.from("lessons").delete().eq("id", id);
    setLessons(lessons.filter(l => l.id !== id));
  };

  const addQuestion = async () => {
    const { data, error } = await supabase.from("quiz_questions").insert({
      course_id: selected.id, question: "New question", choices: ["Option A", "Option B", "Option C", "Option D"], correct_index: 0, sort_order: questions.length,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setQuestions([...questions, data]);
  };
  const saveQuestion = async (q: any) => {
    const { id, created_at, updated_at, ...patch } = q;
    const { error } = await supabase.from("quiz_questions").update(patch).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Question saved");
  };
  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await supabase.from("quiz_questions").delete().eq("id", id);
    setQuestions(questions.filter(q => q.id !== id));
  };

  const allSelected = selectedIds.size > 0 && selectedIds.size === topics.length;

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const selStats = selected ? stats[selected.id] : null;
  const selPrograms = selected ? (programsByTopic[selected.id] ?? []) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Topics</h1>
          <Link to="/admin/programs" className="text-sm text-muted-foreground hover:text-primary">→ Manage programs</Link>
        </div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6">
          <aside>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold">All topics ({topics.length})</h2>
              <Button size="sm" onClick={newTopic}><Plus className="h-4 w-4" /></Button>
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
              <Checkbox checked={allSelected} onCheckedChange={v => setSelectedIds(v ? new Set(topics.map(t => t.id)) : new Set())} />
              <span>Select all</span>
            </div>

            <div className="space-y-1 mt-1">
              {topics.map(c => {
                const s = stats[c.id];
                const isSel = selectedIds.has(c.id);
                return (
                  <div key={c.id} className={`flex items-start gap-2 p-2 rounded-lg hover:bg-muted ${selected?.id === c.id ? "bg-muted" : ""}`}>
                    <Checkbox
                      className="mt-1"
                      checked={isSel}
                      onCheckedChange={v => {
                        const next = new Set(selectedIds);
                        if (v) next.add(c.id); else next.delete(c.id);
                        setSelectedIds(next);
                      }}
                    />
                    <button onClick={() => loadDetails(c)} className="flex-1 text-left min-w-0">
                      <div className={`truncate text-sm ${selected?.id === c.id ? "font-medium" : ""}`}>{c.title}</div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 flex-wrap">
                        <span className={c.is_published ? "text-green-600" : ""}>{c.is_published ? "● Published" : "○ Draft"}</span>
                        {s && (<>
                          <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" />{s.enrollments}</span>
                          <span className="flex items-center gap-0.5"><Award className="h-2.5 w-2.5" />{s.certificates}</span>
                          {s.avgScore !== null && <span>{s.avgScore}% avg</span>}
                          {s.programs > 0 && <span className="flex items-center gap-0.5 text-primary"><GraduationCap className="h-2.5 w-2.5" />{s.programs}</span>}
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
                  <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz ({questions.length})</TabsTrigger>
                  <TabsTrigger value="stats"><BarChart3 className="h-3 w-3 mr-1" />Stats</TabsTrigger>
                </TabsList>
                <Button size="sm" variant="outline" onClick={() => duplicateTopic(selected)}><Copy className="h-3 w-3 mr-1" />Duplicate</Button>
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
                  <div className="grid sm:grid-cols-4 gap-4">
                    <div><Label>Level</Label><Input value={selected.level} onChange={e => setSelected({ ...selected, level: e.target.value })} /></div>
                    <div><Label>Minutes</Label><Input type="number" value={selected.duration_minutes} onChange={e => setSelected({ ...selected, duration_minutes: +e.target.value })} /></div>
                    <div><Label>Pass mark %</Label><Input type="number" value={selected.pass_mark} onChange={e => setSelected({ ...selected, pass_mark: +e.target.value })} /></div>
                    <div><Label>Sort</Label><Input type="number" value={selected.sort_order} onChange={e => setSelected({ ...selected, sort_order: +e.target.value })} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={selected.is_published} onCheckedChange={v => setSelected({ ...selected, is_published: v })} />
                    <Label>Published</Label>
                  </div>
                  {selPrograms.length > 0 && (
                    <div className="pt-3 border-t">
                      <Label className="text-xs text-muted-foreground">Used in programs</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selPrograms.map(p => (
                          <Link key={p.id} to="/admin/programs">
                            <Badge variant="secondary" className="hover:bg-primary/10 cursor-pointer"><GraduationCap className="h-3 w-3 mr-1" />{p.title}</Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={saveTopic}><Save className="h-4 w-4 mr-1" /> Save</Button>
                    <Button variant="destructive" onClick={deleteTopic}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="lessons">
                <Button onClick={addLesson} className="mb-3"><Plus className="h-4 w-4 mr-1" /> Add lesson</Button>
                <SortableList items={lessons} onReorder={reorderLessons}>
                  {(l) => (
                    <Card className="p-4 space-y-3">
                      <div className="grid sm:grid-cols-[1fr_1fr_120px_120px] gap-3">
                        <div><Label>Title</Label><Input value={l.title} onChange={e => setLessons(lessons.map(x => x.id === l.id ? { ...x, title: e.target.value } : x))} /></div>
                        <div><Label>Slug</Label><Input value={l.slug} onChange={e => setLessons(lessons.map(x => x.id === l.id ? { ...x, slug: e.target.value } : x))} /></div>
                        <div><Label>Minutes</Label><Input type="number" value={l.duration_minutes} onChange={e => setLessons(lessons.map(x => x.id === l.id ? { ...x, duration_minutes: +e.target.value } : x))} /></div>
                        <div className="flex items-end gap-1">
                          <Button size="sm" onClick={() => saveLesson(l)}><Save className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteLesson(l.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div><Label>Video URL (YouTube/Vimeo embed)</Label><Input value={l.video_url ?? ""} onChange={e => setLessons(lessons.map(x => x.id === l.id ? { ...x, video_url: e.target.value } : x))} /></div>
                      <div><Label>Body (Markdown)</Label><Textarea rows={6} value={l.body ?? ""} onChange={e => setLessons(lessons.map(x => x.id === l.id ? { ...x, body: e.target.value } : x))} /></div>
                      <LessonSourcesEditor
                        lesson={l}
                        onChange={(sources) => setLessons(lessons.map(x => x.id === l.id ? { ...x, sources } : x))}
                      />
                    </Card>
                  )}
                </SortableList>
              </TabsContent>

              <TabsContent value="quiz">
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
                      <Stat label="Avg quiz score" value={selStats.avgScore !== null ? `${selStats.avgScore}%` : "—"} icon={BarChart3} />
                      <Stat label="In programs" value={selStats.programs} icon={GraduationCap} />
                    </div>
                  ) : <p className="text-muted-foreground text-sm">No data yet.</p>}
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="p-10 text-center text-muted-foreground">Select or create a topic</Card>
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
