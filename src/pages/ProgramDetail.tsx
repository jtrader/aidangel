import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Layers, Award, Play, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { toast } from "sonner";

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [passedCourseIds, setPassedCourseIds] = useState<Set<string>>(new Set());
  const [enrolled, setEnrolled] = useState(false);
  const [hasCert, setHasCert] = useState(false);
  const [hasFinalQuiz, setHasFinalQuiz] = useState(false);
  const [passedFinal, setPassedFinal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("programs").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (!p) { setLoading(false); return; }
      setProgram(p);

      const { data: pt } = await supabase.from("program_topics")
        .select("course_id, sort_order, courses(id,slug,title,duration_minutes,cover_url)")
        .eq("program_id", p.id).order("sort_order");
      setTopics(pt ?? []);

      const { count: qCount } = await supabase.from("program_quiz_questions")
        .select("*", { count: "exact", head: true }).eq("program_id", p.id);
      setHasFinalQuiz((qCount ?? 0) > 0);

      if (user) {
        const { data: enr } = await supabase.from("program_enrollments").select("id").eq("user_id", user.id).eq("program_id", p.id).maybeSingle();
        setEnrolled(!!enr);
        const { data: cert } = await supabase.from("program_certificates").select("id").eq("user_id", user.id).eq("program_id", p.id).maybeSingle();
        setHasCert(!!cert);
        const courseIds = (pt ?? []).map((r: any) => r.course_id);
        if (courseIds.length) {
          const { data: attempts } = await supabase.from("quiz_attempts")
            .select("course_id").eq("user_id", user.id).eq("passed", true).in("course_id", courseIds);
          setPassedCourseIds(new Set((attempts ?? []).map((a: any) => a.course_id)));
        }
        const { data: fa } = await supabase.from("program_quiz_attempts")
          .select("id").eq("user_id", user.id).eq("program_id", p.id).eq("passed", true).maybeSingle();
        setPassedFinal(!!fa);
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const enroll = async () => {
    if (!user) { navigate(`/auth?redirect=/programs/${slug}`); return; }
    const { error } = await supabase.from("program_enrollments").insert({ user_id: user.id, program_id: program.id });
    if (error && !error.message.includes("duplicate")) { toast.error(error.message); return; }
    setEnrolled(true);
    if (topics[0]?.courses) navigate(`/courses/${topics[0].courses.slug}`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!program) return <div className="min-h-screen flex items-center justify-center">Program not found</div>;

  const passedCount = topics.filter(t => passedCourseIds.has(t.course_id)).length;
  const topicsDone = topics.length > 0 && passedCount === topics.length;
  const programDone = topicsDone && (!hasFinalQuiz || passedFinal);
  const pct = topics.length ? (passedCount / topics.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-10">
        <Link to="/programs" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">← All programs</Link>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Left sidebar — program hierarchy */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card className="p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">Program topics</h2>
              </div>
              <nav className="space-y-1">
                {topics.map((t, i) => {
                  const c = t.courses;
                  if (!c) return null;
                  const done = passedCourseIds.has(t.course_id);
                  return (
                    <Link
                      key={t.course_id}
                      to={`/courses/${c.slug}`}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors group"
                    >
                      <div className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-full text-xs font-semibold ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium leading-tight group-hover:text-primary">{c.title}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {c.duration_minutes} min
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
              {hasFinalQuiz && (
                <div className="mt-3 pt-3 border-t">
                  <Link
                    to={enrolled && topicsDone ? `/programs/${slug}/quiz` : "#"}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${enrolled && topicsDone ? "hover:bg-muted/60 text-foreground" : "text-muted-foreground cursor-not-allowed"}`}
                    onClick={(e) => { if (!(enrolled && topicsDone)) e.preventDefault(); }}
                  >
                    <Award className="h-4 w-4" />
                    <span className="font-medium">Final program quiz</span>
                  </Link>
                </div>
              )}
            </Card>
          </aside>

          {/* Main column */}
          <div>
            <Card className="overflow-hidden rounded-2xl">
              {program.cover_url && (
                <div className="aspect-[2/1] bg-muted">
                  <img src={program.cover_url} alt={program.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className="gap-1"><Layers className="h-3 w-3" />{topics.length} topics</Badge>
                  <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{program.slug === "emergency-response-program" ? "60-90 min" : `${program.duration_minutes} min`}</Badge>
                  <Badge variant="outline" className="gap-1"><Award className="h-3 w-3" />Pass {program.pass_mark}%</Badge>
                  {hasFinalQuiz && <Badge variant="outline">Final quiz</Badge>}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{program.title}</h1>
                {program.summary && <p className="text-muted-foreground text-lg mb-6">{program.summary}</p>}
                {program.description && <div className="prose prose-sm max-w-none text-foreground/80 mb-6 whitespace-pre-wrap">{program.description}</div>}

                {enrolled && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Topics complete</span>
                      <span className="text-muted-foreground">{passedCount} / {topics.length}</span>
                    </div>
                    <Progress value={pct} />
                  </div>
                )}

                <div className="flex gap-3 flex-wrap">
                  {!enrolled ? (
                    <Button size="lg" onClick={enroll}>
                      <Play className="h-4 w-4 mr-2" /> {user ? "Start program" : "Sign in to start"}
                    </Button>
                  ) : hasCert ? (
                    <Button size="lg" onClick={() => navigate(`/programs/${slug}/certificate`)}>
                      <Award className="h-4 w-4 mr-2" /> View program certificate
                    </Button>
                  ) : programDone ? (
                    <Button size="lg" onClick={() => navigate(`/programs/${slug}/certificate`)}>
                      <Award className="h-4 w-4 mr-2" /> Claim program certificate
                    </Button>
                  ) : topicsDone && hasFinalQuiz ? (
                    <Button size="lg" onClick={() => navigate(`/programs/${slug}/quiz`)}>
                      Take final quiz
                    </Button>
                  ) : (
                    <Button size="lg" onClick={() => {
                      const next = topics.find(t => !passedCourseIds.has(t.course_id)) ?? topics[0];
                      if (next?.courses) navigate(`/courses/${next.courses.slug}`);
                    }}>
                      <Play className="h-4 w-4 mr-2" /> Continue
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <NetworkFooter />
    </div>
  );
}
