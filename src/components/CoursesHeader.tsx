import { Link, useNavigate } from "react-router-dom";
import { ShieldPlus, LogOut, User as UserIcon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function CoursesHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="border-b bg-card sticky top-0 z-30">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <ShieldPlus className="h-6 w-6" />
          <span className="font-display font-bold">First Aid Angel</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/courses" className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-primary">
            <BookOpen className="h-4 w-4" /> Courses
          </Link>
          <HamburgerMenu />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline truncate max-w-[140px]">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/my-learning")}>My learning</DropdownMenuItem>
                {isAdmin && <DropdownMenuItem onClick={() => navigate("/admin/courses")}>Admin · Courses</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut().then(() => navigate("/"))}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>Sign in</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
