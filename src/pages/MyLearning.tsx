import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Loader2, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MyLearning() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [programCerts, setProgramCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: enrolls } = await supabase
        .from("course_enrollments")
        .select("course_id, started_at, course:courses(id,slug,title,cover_url,duration_minutes,level)")
        .eq("user_id", user.id).order("started_at", { ascending: false });
      const courseIds = (enrolls ?? []).map((e: any) => e.course_id);
      let progressByCourse: Record<string, number> = {};
      let lessonsByCourse: Record<string, number> = {};
      if (courseIds.length) {
        const { data: prog } = await supabase.from("lesson_progress").select("course_id").eq("user_id", user.id).in("course_id", courseIds);
        for (const p of prog ?? []) progressByCourse[p.course_id] = (progressByCourse[p.course_id] ?? 0) + 1;
        const { data: ls } = await supabase.from("lessons").select("course_id").in("course_id", courseIds);
        for (const l of ls ?? []) lessonsByCourse[l.course_id] = (lessonsByCourse[l.course_id] ?? 0) + 1;
      }
      setRows((enrolls ?? []).map((e: any) => ({
        ...e,
        completed: progressByCourse[e.course_id] ?? 0,
        total: lessonsByCourse[e.course_id] ?? 0,
      })));
      const { data: cs } = await supabase
        .from("certificates")
        .select("certificate_number, issued_at, course:courses(slug,title)")
        .eq("user_id", user.id).order("issued_at", { ascending: false });
      setCerts(cs ?? []);

      const { data: pEnrolls } = await supabase
        .from("program_enrollments")
        .select("program_id, started_at, program:programs(id,slug,title,cover_url,duration_minutes)")
        .eq("user_id", user.id).order("started_at", { ascending: false });
      const programIds = (pEnrolls ?? []).map((p: any) => p.program_id);
      let topicsTotal: Record<string, number> = {};
      let topicsPassed: Record<string, number> = {};
      if (programIds.length) {
        const { data: pts } = await supabase.from("program_topics").select("program_id, course_id").in("program_id", programIds);
        const allCourseIds = (pts ?? []).map((x: any) => x.course_id);
        for (const pt of pts ?? []) topicsTotal[pt.program_id] = (topicsTotal[pt.program_id] ?? 0) + 1;
        const { data: passes } = await supabase
          .from("quiz_attempts")
          .select("course_id")
          .eq("user_id", user.id).eq("passed", true).in("course_id", allCourseIds);
        const passedCourses = new Set((passes ?? []).map((p: any) => p.course_id));
        for (const pt of pts ?? []) {
          if (passedCourses.has(pt.course_id)) topicsPassed[pt.program_id] = (topicsPassed[pt.program_id] ?? 0) + 1;
        }
      }
      setPrograms((pEnrolls ?? []).map((p: any) => ({
        ...p,
        passed: topicsPassed[p.program_id] ?? 0,
        total: topicsTotal[p.program_id] ?? 0,
      })));

      const { data: pcs } = await supabase
        .from("program_certificates")
        .select("certificate_number, issued_at, program:programs(slug,title)")
        .eq("user_id", user.id).order("issued_at", { ascending: false });
      setProgramCerts(pcs ?? []);

      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead lang="en" basePath="/my-learning" title="My Learning | First Aid Angel" description="Your enrolled courses, progress and certificates." />
      <CoursesHeader />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold mb-6">{t("myLearningTitle")}</h1>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : rows.length === 0 && certs.length === 0 && programs.length === 0 && programCerts.length === 0 ? (
          <Card className="p-8 rounded-2xl text-center">
            <BookOpen className="h-10 w-10 text-primary/40 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">{t("myLearningEmpty")}</p>
            <Link to="/courses" className="text-primary underline">{t("myLearningBrowse")}</Link>
          </Card>
        ) : (
          <>
            {rows.length > 0 && (
              <>
                <h2 className="font-display text-xl font-bold mb-3">{t("myLearningInProgress")}</h2>
                <div className="grid gap-3 mb-10">
                  {rows.map((r) => {
                    const pct = r.total ? (r.completed / r.total) * 100 : 0;
                    return (
                      <Link to={`/courses/${r.course.slug}`} key={r.course_id}>
                        <Card className="p-4 hover:shadow-md transition flex gap-4">
                          <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                            {r.course.cover_url && <img src={r.course.cover_url} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{r.course.title}</div>
                            <Badge variant="secondary" className="capitalize text-xs mt-1">{r.course.level}</Badge>
                            <div className="mt-2">
                              <Progress value={pct} className="h-2" />
                              <div className="text-xs text-muted-foreground mt-1">{t("myLearningLessonsCount").replace("{done}", String(r.completed)).replace("{total}", String(r.total))}</div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
            {programs.length > 0 && (
              <>
                <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Programs</h2>
                <div className="grid gap-3 mb-10">
                  {programs.map((p) => {
                    const pct = p.total ? (p.passed / p.total) * 100 : 0;
                    return (
                      <Link to={`/programs/${p.program.slug}`} key={p.program_id}>
                        <Card className="p-4 hover:shadow-md transition flex gap-4">
                          <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {p.program.cover_url ? <img src={p.program.cover_url} alt="" className="w-full h-full object-cover" /> : <GraduationCap className="h-8 w-8 text-primary/40" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{p.program.title}</div>
                            <Badge variant="secondary" className="text-xs mt-1">Program</Badge>
                            <div className="mt-2">
                              <Progress value={pct} className="h-2" />
                              <div className="text-xs text-muted-foreground mt-1">{p.passed} of {p.total} topics passed</div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
            {programCerts.length > 0 && (
              <>
                <h2 className="font-display text-xl font-bold mb-3">Program certificates</h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-10">
                  {programCerts.map((c) => (
                    <Link to={`/programs/${c.program.slug}/certificate`} key={c.certificate_number}>
                      <Card className="p-4 hover:shadow-md transition flex items-center gap-3">
                        <Award className="h-8 w-8 text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{c.program.title}</div>
                          <div className="text-xs text-muted-foreground">{c.certificate_number} · {new Date(c.issued_at).toLocaleDateString()}</div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
            {certs.length > 0 && (
              <>
                <h2 className="font-display text-xl font-bold mb-3">{t("myLearningCertificates")}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {certs.map((c) => (
                    <Link to={`/courses/${c.course.slug}/certificate`} key={c.certificate_number}>
                      <Card className="p-4 hover:shadow-md transition flex items-center gap-3">
                        <Award className="h-8 w-8 text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{c.course.title}</div>
                          <div className="text-xs text-muted-foreground">{c.certificate_number} · {new Date(c.issued_at).toLocaleDateString()}</div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <NetworkFooter />
    </div>
  );
}
