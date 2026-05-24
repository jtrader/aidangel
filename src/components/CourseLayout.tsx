import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopicsSidebar from "@/components/TopicsSidebar";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <TopicsSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
