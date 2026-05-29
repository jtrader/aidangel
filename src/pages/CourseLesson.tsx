import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, FileText, Globe } from "lucide-react";
import LessonContent from "@/components/lesson/LessonContent";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import CourseLayout from "@/components/CourseLayout";
import NetworkFooter from "@/components/NetworkFooter";
import { SeoHead } from "@/components/SeoHead";
import { buildLessonSeo } from "@/lib/lessonSeo";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CourseLesson() {
  const { slug, lessonSlug } = useParams();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data: c } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      if (!c) { setLoading(false); return; }
      setCourse(c);
      const { data: ls } = await supabase.from("lessons").select("*").eq("course_id", c.id).order("sort_order");
      setLessons(ls ?? []);
      const cur = (ls ?? []).find((l: any) => l.slug === lessonSlug);
      setLesson(cur);
      if (cur) {
        const { data: prog } = await supabase.from("lesson_progress").select("id").eq("user_id", user.id).eq("lesson_id", cur.id).maybeSingle();
        setDone(!!prog);
      }
      setLoading(false);
    })();
  }, [slug, lessonSlug, user]);

  const markComplete = async () => {
    if (!user || !lesson || done) return;
    const { error } = await supabase.from("lesson_progress").insert({
      user_id: user.id, lesson_id: lesson.id, course_id: course.id,
    });
    if (error && !error.message.includes("duplicate")) { toast.error(error.message); return; }
    setDone(true);
  };

  const idx = lessons.findIndex(l => l.id === lesson?.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;
  const isLast = idx === lessons.length - 1;

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!lesson) return <div className="min-h-screen flex items-center justify-center">{t("lessonNotFound")}</div>;

  const seo = course && lesson
    ? buildLessonSeo({ lesson, course, lang: language, t })
    : null;

  return (
    <CourseLayout>
    <div className="min-h-screen bg-background flex flex-col">
      {seo ? (
        <SeoHead
          lang={language}
          basePath={seo.basePath}
          title={seo.title}
          description={seo.description}
          jsonLd={seo.jsonLd}
        />
      ) : null}
      <CoursesHeader />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        <Link to={`/topics/${slug}`} className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">← {course?.title}</Link>
        <h1 className="font-display text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t("lessonOfTotal").replace("{n}", String(idx + 1)).replace("{total}", String(lessons.length))}</p>

        {lesson.video_url && (
          <Card className="overflow-hidden rounded-2xl mb-6">
            <div className="aspect-video bg-black">
              {/\.(mp4|webm|mov|m4v)(\?|$)/i.test(lesson.video_url) ? (
                <video
                  src={lesson.video_url}
                  title={lesson.title}
                  className="w-full h-full"
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <iframe
                  src={lesson.video_url}
                  title={lesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </Card>
        )}

        {lesson.body && (
          <Card className="p-6 md:p-8 rounded-2xl mb-6">
            <LessonContent>{lesson.body}</LessonContent>
          </Card>
        )}

        {Array.isArray(lesson.sources) && lesson.sources.length > 0 && (
          <Card className="p-6 rounded-2xl mb-6">
            <h2 className="font-display text-lg font-semibold mb-3">{t("sourcesTitle")}</h2>
            <ul className="space-y-2 text-sm">
              {(lesson.sources as Array<{ label: string; url: string; type?: "web" | "pdf" }>).map((s, i) => {
                const isPdf = s.type === "pdf" || /\.pdf($|\?)/i.test(s.url);
                return (
                  <li key={i} className="flex items-start gap-2">
                    {isPdf ? (
                      <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-words"
                    >
                      {s.label || s.url}
                      {isPdf && <span className="ml-1 text-xs text-muted-foreground">(PDF)</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              {t("lessonSourcesDisclaimer")}
            </p>
          </Card>
        )}


        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="outline" onClick={() => prev && navigate(`/topics/${slug}/lesson/${prev.slug}`)} disabled={!prev}>
            <ChevronLeft className="h-4 w-4 mr-1" /> {t("lessonPrevious")}
          </Button>
          <Button onClick={async () => {
            await markComplete();
            if (next) navigate(`/topics/${slug}/lesson/${next.slug}`);
            else navigate(`/topics/${slug}/quiz`);
          }}>
            {done ? <CheckCircle2 className="h-4 w-4 mr-1" /> : null}
            {isLast ? t("lessonCompleteStartQuiz") : (done ? t("lessonNextLesson") : t("lessonMarkCompleteNext"))}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </main>
      <NetworkFooter />
    </div>
    </CourseLayout>
  );
}
