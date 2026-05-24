import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, BookOpen, Loader2, GraduationCap, ClipboardCheck, Lock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Course = { id: string; slug: string; title: string; sort_order: number };
type Lesson = { id: string; slug: string; title: string; sort_order: number; course_id: string };

export default function TopicsSidebar() {
  const { slug, lessonSlug } = useParams();
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const [courses, setCourses] = useState<Course[]>([]);
  const [activeLessons, setActiveLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<{ id: string; slug: string; title: string } | null>(null);
  const [programCourseIds, setProgramCourseIds] = useState<string[]>([]);
  const [passedCourseIds, setPassedCourseIds] = useState<Set<string>>(new Set());
  const [startedCourseIds, setStartedCourseIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Determine which program context to show:
      // 1. localStorage (set when visiting a program page)
      // 2. first published program that contains the current course
      // 3. fall back to emergency-response-program
      let targetSlug: string | null = null;
      try { targetSlug = localStorage.getItem("currentProgramSlug"); } catch {}

      if (slug) {
        const { data: course } = await supabase
          .from("courses").select("id").eq("slug", slug).maybeSingle();
        if (course?.id) {
          const { data: matches } = await supabase
            .from("program_topics")
            .select("programs:program_id(id,slug,title,is_published,sort_order)")
            .eq("course_id", course.id);
          const published = (matches ?? [])
            .map((m: any) => m.programs)
            .filter((p: any) => p?.is_published)
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          if (targetSlug && !published.some((p: any) => p.slug === targetSlug)) {
            targetSlug = null;
          }
          if (!targetSlug && published[0]) targetSlug = published[0].slug;
        }
      }
      if (!targetSlug) targetSlug = "emergency-response-program";

      const { data: prog } = await supabase
        .from("programs")
        .select("id, slug, title")
        .eq("slug", targetSlug)
        .maybeSingle();
      if (prog) {
        setProgram({ id: prog.id, slug: prog.slug, title: prog.title });
        try { localStorage.setItem("currentProgramSlug", prog.slug); } catch {}
      }

      if (prog?.id) {
        const { data: topics } = await supabase
          .from("program_topics")
          .select("sort_order, courses:course_id(id,slug,title)")
          .eq("program_id", prog.id)
          .order("sort_order");
        const ordered = (topics ?? [])
          .map((t: any) => (t.courses ? { ...t.courses, sort_order: t.sort_order } : null))
          .filter(Boolean) as Course[];
        if (ordered.length) {
          setCourses(ordered);
          setProgramCourseIds(ordered.map((c) => c.id));
          setLoading(false);
          return;
        }
      }

      const { data } = await supabase
        .from("courses")
        .select("id,slug,title,sort_order")
        .eq("is_published", true)
        .order("sort_order");
      setCourses(data ?? []);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    (async () => {
      const active = courses.find((c) => c.slug === slug);
      if (!active) { setActiveLessons([]); return; }
      const { data } = await supabase
        .from("lessons")
        .select("id,slug,title,sort_order,course_id")
        .eq("course_id", active.id)
        .order("sort_order");
      setActiveLessons(data ?? []);
      if (user) {
        const { data: prog } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .eq("course_id", active.id);
        setCompletedIds(new Set((prog ?? []).map((p: any) => p.lesson_id)));
      }
    })();
  }, [slug, courses, user]);
  useEffect(() => {
    (async () => {
      if (!user || programCourseIds.length === 0) { setPassedCourseIds(new Set()); return; }
      const { data } = await supabase
        .from("quiz_attempts")
        .select("course_id")
        .eq("user_id", user.id)
        .eq("passed", true)
        .in("course_id", programCourseIds);
      setPassedCourseIds(new Set((data ?? []).map((r: any) => r.course_id)));
    })();
  }, [user, programCourseIds]);
  useEffect(() => {
    (async () => {
      if (!user || programCourseIds.length === 0) { setStartedCourseIds(new Set()); return; }
      const { data } = await supabase
        .from("lesson_progress")
        .select("course_id")
        .eq("user_id", user.id)
        .in("course_id", programCourseIds);
      setStartedCourseIds(new Set((data ?? []).map((p: any) => p.course_id)));
    })();
  }, [user, programCourseIds]);

  const allTopicsPassed = programCourseIds.length > 0 && programCourseIds.every((id) => passedCourseIds.has(id));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {program && (
          <SidebarGroup>
            <SidebarGroupLabel>Program</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={program.title}
                    className="h-auto min-h-8 items-start overflow-visible"
                  >
                    <NavLink to={`/programs/${program.slug}`} className="flex min-w-0 items-start gap-2">
                      <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                      {!collapsed && <span className="min-w-0 flex-1 !overflow-visible !whitespace-normal !text-clip break-words font-semibold leading-tight">{program.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            {loading ? (
              <div className="px-3 py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : (
              <SidebarMenu>
                {courses.map((c, i) => {
                  const isActive = c.slug === slug;
                  const isPassed = passedCourseIds.has(c.id);
                  const isStarted = startedCourseIds.has(c.id);
                  const bulletClass = isPassed
                    ? "bg-green-600 border border-green-600 text-white"
                    : isActive
                    ? "bg-primary border border-primary text-primary-foreground"
                    : isStarted
                    ? "bg-orange-500 border border-orange-500 text-white"
                    : "bg-background border border-muted-foreground/30 text-foreground";
                  return (
                    <SidebarMenuItem key={c.id}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={c.title} className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                        <NavLink to={`/courses/${c.slug}`} className="flex items-center gap-2">
                          <span className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${bulletClass}`}>
                            {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                          </span>
                          {!collapsed && <span className="truncate">{c.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                      {isActive && !collapsed && activeLessons.length > 0 && (
                        <SidebarMenuSub>
                          {activeLessons.map((l) => {
                            const done = completedIds.has(l.id);
                            const lessonActive = l.slug === lessonSlug;
                            return (
                              <SidebarMenuSubItem key={l.id}>
                                <SidebarMenuSubButton asChild isActive={lessonActive} className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary">
                                  <NavLink to={`/courses/${c.slug}/lesson/${l.slug}`} className="flex items-center gap-2">
                                    {done ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-1" />
                                    ) : (
                                      <BookOpen className={`h-3.5 w-3.5 shrink-0 ${lessonActive ? "text-primary" : "text-muted-foreground"}`} />
                                    )}
                                    <span className="truncate">{l.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                })}
                {program && (
                  <SidebarMenuItem>
                    {allTopicsPassed ? (
                      <SidebarMenuButton asChild tooltip="Program Final Quiz">
                        <NavLink to={`/programs/${program.slug}/quiz`} className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-primary shrink-1" />
                          {!collapsed && <span className="font-semibold">Program Final Quiz</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        tooltip={`Complete all ${programCourseIds.length} topic quizzes to unlock (${passedCourseIds.size}/${programCourseIds.length} passed)`}
                        className="opacity-60 cursor-not-allowed"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Lock className="h-4 w-4 text-muted-foreground shrink-1" />
                        {!collapsed && (
                          <span className="font-semibold text-muted-foreground">
                            Program Final Quiz ({passedCourseIds.size}/{programCourseIds.length})
                          </span>
                        )}
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
