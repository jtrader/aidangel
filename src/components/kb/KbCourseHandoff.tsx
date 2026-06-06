import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { courseSlugForKbTopic, SENSITIVE_KB_SLUGS } from "@/lib/kbCourseMap";
import { fireKbCourseConversion } from "@/lib/rsp/faaAdapter";
import { translateStrings } from "@/lib/uiTranslate";
import { pickTranslated } from "@/lib/lmsI18n";

interface Props {
  /** KB topic slug, e.g. "cpr" or "aed" */
  kbSlug: string;
  /** Active UI language code */
  lang: string;
}

export function KbCourseHandoff({ kbSlug, lang }: Props) {
  const courseSlug = courseSlugForKbTopic(kbSlug);
  const isSensitive = SENSITIVE_KB_SLUGS.has(kbSlug);
  
  const { user } = useAuth();
  const { language } = useLanguage();
  const { code: countryCode } = useCountry();
  const navigate = useNavigate();

  const defaultLabels = isSensitive
    ? {
        eyebrow: "Free online course",
        heading: "Learn the ALGEE framework",
        body: "A free self-paced course on the Australian Mental Health First Aid approach — how to approach, listen and connect someone in distress with the right support.",
        cta: "Start the free course",
        passed: "You've completed this course",
        passedSub: "Well done for building your mental health first aid skills.",
      }
    : {
        eyebrow: "Test your knowledge",
        heading: "Ready to put this into practice?",
        body: "Take the free quiz for this topic and see how much you've retained.",
        cta: "Start the quiz",
        passed: "You've passed this topic",
        passedSub: "Well done — you've already completed this quiz.",
      };

  const [labels, setLabels] = useState(defaultLabels);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (language === "en") return;
    let cancelled = false;
    const values = Object.values(defaultLabels);
    const keys = Object.keys(defaultLabels) as (keyof typeof defaultLabels)[];
    translateStrings(language, values).then((s) => {
      if (!cancelled) {
        const next = {} as typeof defaultLabels;
        keys.forEach((k, i) => { next[k] = s[i]; });
        setLabels(next);
      }
    });
    return () => { cancelled = true; };
  }, [language, kbSlug]);
  
  useEffect(() => {
    if (!courseSlug) {
      setLoading(false);
      return;
    }
    (async () => {
      // Fetch course title (and id for pass check)
      const { data: course } = await supabase
        .from("courses")
        .select("id, title")
        .eq("slug", courseSlug)
        .eq("is_published", true)
        .maybeSingle();

      if (!course) {
        setLoading(false);
        return;
      }

      // If UI language differs, try to load a translation row and prefer its title
      if (language !== "en") {
        const { data: ct } = await supabase
          .from("course_translations")
          .select("title")
          .eq("course_id", course.id)
          .eq("lang", language)
          .maybeSingle();
        setCourseTitle(ct?.title ?? course.title);
      } else {
        setCourseTitle(course.title);
      }

      // Check if user has already passed this topic's quiz
      if (user) {
        const { data: attempt } = await supabase
          .from("quiz_attempts")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", course.id)
          .eq("passed", true)
          .limit(1)
          .maybeSingle();
        setAlreadyPassed(!!attempt);
      }

      setLoading(false);
    })();
  }, [courseSlug, user, language]);

  // Don't render if no matching course or course doesn't exist in DB
  if (!courseSlug || loading || !courseTitle) return null;

  const handleClick = async () => {
    // Fire RSP conversion signal (fire and forget)
    void fireKbCourseConversion(kbSlug, courseSlug, lang, countryCode ?? null);

    // Navigate — carry kbSlug so the lesson page can offer "Back to article"
    // If not signed in, go to auth with full redirect target preserved
    const target = `/topics/${courseSlug}?from=kb&kbSlug=${kbSlug}`;
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(target)}`);
      return;
    }
    navigate(target);
  };

  // Passed state — quiet acknowledgement, no CTA
  if (alreadyPassed) {
    return (
      <aside className="mt-8 rounded-2xl border border-safe/30 bg-safe/5 p-5 flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-safe/10 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-safe" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{labels.passed}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{labels.passedSub}</p>
        </div>
      </aside>
    );
  }

  // Default CTA card
  return (
    <aside className="mt-8 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
          {isSensitive ? <Heart className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {labels.eyebrow}
          </p>
          <h3 lang={lang} className="text-lg font-bold text-foreground mt-0.5">
            {labels.heading}
          </h3>
          <p lang={lang} className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {labels.body}
          </p>
          <button
            onClick={handleClick}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors"
          >
            {labels.cta}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default KbCourseHandoff;
