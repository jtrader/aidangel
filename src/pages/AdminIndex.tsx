import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { SeoHead } from "@/components/SeoHead";
import RequireAuth from "@/components/RequireAuth";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Video,
  FileText,
  Users,
  Heart,
  ShieldCheck,
  LayoutTemplate,
  ExternalLink,
  Newspaper,
  UserCheck,
  Award,
} from "lucide-react";

const sections = [
  {
    group: "Content (CMS)",
    items: [
      { to: "/admin/cms", title: "Pages & Blocks", desc: "Edit marketing pages and content blocks", icon: LayoutTemplate },
      { to: "/admin/blog", title: "Blog", desc: "SEO articles & course landing content", icon: Newspaper },
    ],
  },
  {
    group: "Learn (LMS)",
    items: [
      { to: "/admin/courses", title: "Courses", desc: "Manage course catalog", icon: BookOpen },
      { to: "/admin/topics", title: "Topics", desc: "Manage topic content", icon: Layers },
      { to: "/admin/programs", title: "Programs", desc: "Bundled certification programs", icon: GraduationCap },
      { to: "/admin/videos", title: "Videos", desc: "Lesson and program videos", icon: Video },
      { to: "/admin/kb", title: "Knowledge Base", desc: "First aid KB articles", icon: FileText },
      { to: "/admin/educators", title: "Educators", desc: "Educator directory listings", icon: Users },
      { to: "/admin/learners", title: "Learners", desc: "Course & program enrollments", icon: UserCheck },
      { to: "/admin/graduates", title: "Graduates", desc: "Issued certificates", icon: Award },
    ],
  },
  {
    group: "Give",
    items: [
      { to: "/admin/donations", title: "Donations", desc: "Charity referrals & analytics", icon: Heart },
      { to: "/admin/routes", title: "Route Catalogue", desc: "Partner courses & products from Shopify", icon: ExternalLink },
    ],
  },
];

export default function AdminIndex() {
  return (
    <RequireAuth adminOnly>
      <div className="min-h-screen bg-background">
        <SeoHead lang="en" basePath="/admin" title="Admin — First Aid Angel" description="Administrative dashboard for First Aid Angel." />
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage all areas of First Aid Angel.</p>
            </div>
          </div>

          {sections.map((section) => (
            <section key={section.group} className="mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                {section.group}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className="group">
                      <Card className="p-5 h-full rounded-2xl hover:border-primary hover:shadow-md transition">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </RequireAuth>
  );
}
