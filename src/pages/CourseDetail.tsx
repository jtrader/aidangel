import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Award, Play, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import CourseLayout from "@/components/CourseLayout";
import CourseVideoPlayer from "@/components/CourseVideoPlayer";
import { SeoHead } from "@/components/SeoHead";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickTranslated } from "@/lib/lmsI18n";

type Course = any;
type Lesson = { id: string; slug: string; title: string; duration_minutes: number; sort_order: number };

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromKb = searchParams.get("from") === "kb";
  const kbSlug = searchParams.get("kbSlug") ?? "";

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [enrolled, setEnrolled] = useState(false);
  const [passed, setPassed] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: c } = await supabase.from("courses").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (!c) { setLoading(false); return; }

      // If translations exist for this language, merge them into the course row
      let mergedCourse = c;
      if (language !== "en") {
        const { data: ct } = await supabase.from("course_translations").select("*").eq("course_id", c.id).eq("language", language).maybeSingle();
        if (ct) mergedCourse = pickTranslated(c, ct, ["title", "summary", "description", "cover_url", "video_url", "video_source_name", "video_source_website", "video_source_youtube"]);
      }

      if (cancelled) return;
      setCourse(mergedCourse);

      const { data: ls } = await supabase.from("lessons").select("id,slug,title,duration_minutes,sort_order").eq("course_id", c.id).order("sort_order");
      let lessonsRows = ls ?? [];

      // Merge lesson translations when available
      if (language !== "en" && lessonsRows.length > 0) {
        const ids = lessonsRows.map(l => l.id);
        const { data: ltrs } = await supabase.from("lesson_translations").select("lesson_id,title,body").in("lesson_id", ids).eq("lang", language);
        const byId = new Map((ltrs ?? []).map((lt: any) => [lt.lesson_id, lt]));
        lessonsRows = lessonsRows.map((r: any) => pickTranslated(r, byId.get(r.id) ?? null, ["title", "body"]));
      }

      setLessons(lessonsRows);
      let enr: { id: string } | null = null;
      if (user) {
        const { data } = await supabase.from("course_enrollments").select("id").eq("user_id", user.id).eq("course_id", c.id).maybeSingle();
        enr = data;
        setEnrolled(!!enr);
        const { data: prog } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id).eq("course_id", c.id);
        setCompletedIds(new Set((prog ?? []).map(p => p.lesson_id)));
        const { data: attempt } = await supabase.from("quiz_attempts").select("id").eq("user_id", user.id).eq("course_id", c.id).eq("passed", true).limit(1).maybeSingle();
        setPassed(!!attempt);
        const { data: vp } = await supabase.from("course_video_progress").select("completed").eq("user_id", user.id).eq("course_id", c.id).maybeSingle();
        setVideoCompleted(!!vp?.completed);
      }
      setLoading(false);

      // Deep-link from KB: auto-enrol and jump straight to first lesson
      if (fromKb && !cancelled) {
        const isEnrolled = !!enr;
        if (!isEnrolled && user && c) {
          await supabase
            .from("course_enrollments")
            .insert({ user_id: user.id, course_id: c.id })
            .throwOnError();
        }
        const firstLesson = (ls ?? [])[0];
        if (firstLesson) {
          // Carry kbSlug forward so the lesson page can show "Back to article"
          navigate(
            `/topics/${c.slug}/lesson/${firstLesson.slug}?from=kb&kbSlug=${kbSlug}`,
            { replace: true },
          );
        }
      }
    })();
    return () => { cancelled = true; };
  }, [slug, user, language]);


  const enroll = async () => {
    if (!user) { navigate(`/auth?redirect=/topics/${slug}`); return; }
    const { error } = await supabase.from("course_enrollments").insert({ user_id: user.id, course_id: course.id });
    if (error && !error.message.includes("duplicate")) { toast.error(error.message); return; }
    setEnrolled(true);
    if (lessons[0]) navigate(`/topics/${slug}/lesson/${lessons[0].slug}`);
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
        lang={language}
        basePath={`/topics/${course.slug}`}
        title={`${course.title} — Free Online Course | First Aid Angel`}
        description={course.summary ?? `Free self-paced ${course.title} course with quiz, ${lessons.length} lessons.`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": course.summary,
            "url": `https://firstaidangel.org/topics/${course.slug}`,
            "provider": { "@type": "Organization", "name": "First Aid Angel", "url": "https://firstaidangel.org" },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "online",
              "courseWorkload": `PT${course.duration_minutes}M`
            },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "category": "Free" }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://firstaidangel.org/" },
              { "@type": "ListItem", "position": 2, "name": "Topics", "item": "https://firstaidangel.org/topics" },
              { "@type": "ListItem", "position": 3, "name": course.title, "item": `https://firstaidangel.org/topics/${course.slug}` }
            ]
          }
        ]}
      />

      <CoursesHeader />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        <Link to="/topics" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">← {t("courseAllCourses")}</Link>
        <Card className="overflow-hidden rounded-2xl mb-8">
          {course.cover_url && !course.video_url && (
            <div className="aspect-[2/1] bg-muted">
              <img src={course.cover_url} alt={course.title} width={800} height={400} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
          )}
          {course.video_url && (
            <>
              <CourseVideoPlayer
                courseId={course.id}
                videoUrl={course.video_url}
                posterUrl={course.cover_url}
                storedDuration={course.video_duration_seconds}
                onCompleted={() => setVideoCompleted(true)}
                trackProgress={enrolled}
                edgeToEdge
              />
              {(course.video_source_name || course.video_source_website || course.video_source_youtube) && (
                <div className="px-6 md:px-8 pt-3 pb-1">
                  <p className="text-xs text-muted-foreground">
                    Source/credit:{" "}
                    {course.video_source_website ? (
                      <a href={course.video_source_website} target="_blank" rel="noreferrer noopener" className="underline hover:text-primary">
                        {course.video_source_name || course.video_source_website}
                      </a>
                    ) : (
                      <span>{course.video_source_name}</span>
                    )}
                    {course.video_source_youtube && (
                      <>
                        {" · "}
                        <a href={course.video_source_youtube} target="_blank" rel="noreferrer noopener" className="underline hover:text-primary">
                          YouTube Channel
                        </a>
                      </>
                    )}
                  </p>
                </div>
              )}
            </>
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
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Topic completed
                </Button>
              ) : allDone ? (
                course.video_url && !videoCompleted ? (
                  <Button size="lg" disabled>
                    <Lock className="h-4 w-4 mr-2" /> Watch the video to unlock the quiz
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => navigate(`/topics/${slug}/quiz`)}>
                    {t("courseTakeFinalQuiz")}
                  </Button>
                )
              ) : (
                <Button size="lg" onClick={() => {
                  const next = lessons.find(l => !completedIds.has(l.id)) ?? lessons[0];
                  navigate(`/topics/${slug}/lesson/${next.slug}`);
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
                to={enrolled ? `/topics/${slug}/lesson/${l.slug}` : "#"}
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
