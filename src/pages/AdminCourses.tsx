import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Save, Loader2, Upload, FileText, ExternalLink } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import LessonSourcesEditor from "@/components/admin/LessonSourcesEditor";
import { toast } from "sonner";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("sort_order");
    setCourses(data ?? []);
  };

  useEffect(() => { loadCourses().then(() => setLoading(false)); }, []);

  const loadDetails = async (c: any) => {
    setSelected(c);
    const { data: ls } = await supabase.from("lessons").select("*").eq("course_id", c.id).order("sort_order");
    setLessons(ls ?? []);
    const { data: qs } = await supabase.from("quiz_questions").select("*").eq("course_id", c.id).order("sort_order");
    setQuestions(qs ?? []);
  };

  const newCourse = async () => {
    const { data, error } = await supabase.from("courses").insert({
      slug: `course-${Date.now()}`, title: "New course",
    }).select().single();
    if (error) { toast.error(error.message); return; }
    await loadCourses();
    loadDetails(data);
  };

  const saveCourse = async () => {
    if (!selected) return;
    const { id, created_at, updated_at, ...patch } = selected;
    const { error } = await supabase.from("courses").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Saved"); loadCourses(); }
  };

  const deleteCourse = async () => {
    if (!selected || !confirm("Delete this course and all lessons/questions?")) return;
    await supabase.from("courses").delete().eq("id", selected.id);
    setSelected(null); setLessons([]); setQuestions([]);
    loadCourses();
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

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <aside>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold">Courses</h2>
              <Button size="sm" onClick={newCourse}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-1">
              {courses.map(c => (
                <button key={c.id} onClick={() => loadDetails(c)}
                  className={`block w-full text-left p-3 rounded-lg text-sm hover:bg-muted ${selected?.id === c.id ? "bg-muted font-medium" : ""}`}>
                  <div className="truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.is_published ? "Published" : "Draft"}</div>
                </button>
              ))}
            </div>
          </aside>

          {selected ? (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
                <TabsTrigger value="quiz">Quiz ({questions.length})</TabsTrigger>
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
                  <div className="flex gap-2">
                    <Button onClick={saveCourse}><Save className="h-4 w-4 mr-1" /> Save</Button>
                    <Button variant="destructive" onClick={deleteCourse}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="lessons">
                <Button onClick={addLesson} className="mb-3"><Plus className="h-4 w-4 mr-1" /> Add lesson</Button>
                <div className="space-y-3">
                  {lessons.map((l, i) => (
                    <Card key={l.id} className="p-4 space-y-3">
                      <div className="grid sm:grid-cols-[80px_1fr_1fr_120px_120px] gap-3">
                        <div><Label>Order</Label><Input type="number" value={l.sort_order} onChange={e => setLessons(lessons.map(x => x.id === l.id ? { ...x, sort_order: +e.target.value } : x))} /></div>
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
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="quiz">
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
            <Card className="p-10 text-center text-muted-foreground">Select or create a course</Card>
          )}
        </div>
      </main>
    </div>
  );
}
