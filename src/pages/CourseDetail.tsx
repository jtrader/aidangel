import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Award, Play, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import CourseLayout from "@/components/CourseLayout";
import { SeoHead } from "@/components/SeoHead";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type Course = any;
type Lesson = { id: string; slug: string; title: string; duration_minutes: number; sort_order: number };

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [enrolled, setEnrolled] = useState(false);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from("courses").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (!c) { setLoading(false); return; }
      setCourse(c);
      const { data: ls } = await supabase.from("lessons").select("id,slug,title,duration_minutes,sort_order").eq("course_id", c.id).order("sort_order");
      setLessons(ls ?? []);
      if (user) {
        const { data: enr } = await supabase.from("course_enrollments").select("id").eq("user_id", user.id).eq("course_id", c.id).maybeSingle();
        setEnrolled(!!enr);
        const { data: prog } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("course_id", c.id);
        setCompletedIds(new Set((prog ?? []).map(p => p.lesson_id)));
        const { data: attempt } = await supabase.from("quiz_attempts").select("id").eq("user_id", user.id).eq("course_id", c.id).eq("passed", true).limit(1).maybeSingle();
        setPassed(!!attempt);
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const enroll = async () => {
    if (!user) { navigate(`/auth?redirect=/courses/${slug}`); return; }
    const { error } = await supabase.from("course_enrollments").insert({ user_id: user.id, course_id: course.id });
    if (error && !error.message.includes("duplicate")) { toast.error(error.message); return; }
    setEnrolled(true);
    if (lessons[0]) navigate(`/courses/${slug}/lesson/${lessons[0].slug}`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">{t("courseNotFound")}</div>;

  const completedCount = lessons.filter(l => completedIds.has(l.id)).length;
  const allDone = lessons.length > 0 && completedCount === lessons.length;
  const pct = lessons.length ? (completedCount / lessons.length) * 100 : 0;

  return (
    <CourseLayout>
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang="en"
        basePath="/courses"
        title={`${course.title} — Free Online Course | First Aid Angel`}
        description={course.summary ?? `Free self-paced ${course.title} course with quiz and PDF certificate.`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": course.title,
          "description": course.summary,
          "provider": { "@type": "Organization", "name": "First Aid Angel", "url": "https://firstaidangel.org" },
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "courseWorkload": `PT${course.duration_minutes}M`
          },
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "category": "Free" }
        }}
      />
      <CoursesHeader />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">← {t("courseAllCourses")}</Link>
        <Card className="overflow-hidden rounded-2xl mb-8">
          {course.cover_url && (
            <div className="aspect-[2/1] bg-muted">
              <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="flex gap-2 mb-3 flex-wrap">
              <Badge variant="secondary" className="capitalize">{course.level}</Badge>
              <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{course.duration_minutes} {t("courseDurationMin")}</Badge>
              <Badge variant="outline" className="gap-1"><BookOpen className="h-3 w-3" />{lessons.length} {t("courseLessonsLabel")}</Badge>
              <Badge variant="outline" className="gap-1"><Award className="h-3 w-3" />{t("coursePassMark")} {course.pass_mark}%</Badge>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
            {course.summary && <p className="text-muted-foreground text-lg mb-6">{course.summary}</p>}
            {course.description && <div className="prose prose-sm max-w-none text-foreground/80 mb-6 whitespace-pre-wrap">{course.description}</div>}

            {enrolled && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t("courseProgressLabel")}</span>
                  <span className="text-muted-foreground">{completedCount} / {lessons.length}</span>
                </div>
                <Progress value={pct} />
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              {!enrolled ? (
                <Button size="lg" onClick={enroll}>
                  <Play className="h-4 w-4 mr-2" /> {user ? t("courseStart") : t("courseSignInToStart")}
                </Button>
              ) : passed ? (
                <Button size="lg" variant="outline" disabled>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> {t("courseCompleted") || "Topic completed"}
                </Button>
              ) : allDone ? (
                <Button size="lg" onClick={() => navigate(`/courses/${slug}/quiz`)}>
                  {t("courseTakeFinalQuiz")}
                </Button>
              ) : (
                <Button size="lg" onClick={() => {
                  const next = lessons.find(l => !completedIds.has(l.id)) ?? lessons[0];
                  navigate(`/courses/${slug}/lesson/${next.slug}`);
                }}>
                  <Play className="h-4 w-4 mr-2" /> {t("actionContinue")}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <h2 className="font-display text-2xl font-bold mb-4">{t("courseLessonsHeading")}</h2>
        <div className="space-y-2">
          {lessons.map((l, i) => {
            const done = completedIds.has(l.id);
            return (
              <Link
                key={l.id}
                to={enrolled ? `/courses/${slug}/lesson/${l.slug}` : "#"}
                onClick={(e) => { if (!enrolled) { e.preventDefault(); enroll(); } }}
                className="block"
              >
                <Card className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${done ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{l.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {l.duration_minutes} {t("courseDurationMin")}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <NetworkFooter />
    </div>
    </CourseLayout>
  );
}
