import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Loader2 } from "lucide-react";
import { COVERS as KB_COVERS } from "@/components/TopicCover";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import EmergencyCallButton from "@/components/EmergencyCallButton";

type Course = {
  id: string; slug: string; title: string; summary: string | null;
  cover_url: string | null; level: string; duration_minutes: number;
};

export default function Courses() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("courses").select("id,slug,title,summary,cover_url,level,duration_minutes")
      .eq("is_published", true).order("sort_order", { ascending: true })
      .then(({ data }) => { setCourses(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang="en"
        basePath="/topics"
        title="First Aid Topics — Free Online Lessons with Certificate | First Aid Angel"
        description="Self-paced first aid topics with quizzes and free PDF certificate. CPR, choking, bleeding, burns and more — based on Australian First Aid 5th Edition."
      />
      <CoursesHeader />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-10">
        <header className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold mb-3">{t("coursesPageTitle")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("coursesPageSubtitle")}
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : courses.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground rounded-2xl">
            {t("coursesEmpty")}
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Link key={c.id} to={`/topics/${c.slug}`} className="block group">
                <Card className="overflow-hidden rounded-2xl h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {c.cover_url ? (
                      <img src={c.cover_url} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <BookOpen className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">{c.level}</Badge>
                      <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{c.duration_minutes} {t("courseDurationMin")}</Badge>
                      <Badge>Topic</Badge>
                    </div>
                    <h2 className="font-display font-bold text-lg mb-1 group-hover:text-primary">{c.title}</h2>
                    {c.summary && <p className="text-sm text-muted-foreground line-clamp-2">{c.summary}</p>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <EmergencyCallButton />
      <NetworkFooter />
    </div>
  );
}
