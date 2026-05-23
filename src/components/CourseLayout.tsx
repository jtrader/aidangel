import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TopicsSidebar from "@/components/TopicsSidebar";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <TopicsSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <SidebarTrigger className="absolute top-3 left-3 z-40 md:top-4 md:left-4" />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
