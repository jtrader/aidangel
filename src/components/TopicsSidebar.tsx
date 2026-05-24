import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, BookOpen, Loader2 } from "lucide-react";
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

  useEffect(() => {
    (async () => {
      // Prefer the Emergency Response Program topic order so the sidebar
      // matches the program hierarchy. Fall back to courses.sort_order.
      const { data: prog } = await supabase
        .from("programs")
        .select("id")
        .eq("slug", "emergency-response-program")
        .maybeSingle();

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
  }, []);

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

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            {loading ? (
              <div className="px-3 py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : (
              <SidebarMenu>
                {courses.map((c, i) => {
                  const isActive = c.slug === slug;
                  return (
                    <SidebarMenuItem key={c.id}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={`${i + 1}. ${c.title}`}>
                        <NavLink to={`/courses/${c.slug}`} className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] font-semibold shrink-0">
                            {i + 1}
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
                                <SidebarMenuSubButton asChild isActive={lessonActive}>
                                  <NavLink to={`/courses/${c.slug}/lesson/${l.slug}`} className="flex items-center gap-2">
                                    {done ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                    ) : (
                                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
