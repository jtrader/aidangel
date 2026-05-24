import { forwardRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LangParamSync } from "@/components/LangParamSync";
import { LANGS } from "@/lib/i18n";
import Index from "./pages/Index";
import KbIndex from "./pages/KbIndex";
import KbTopic from "./pages/KbTopic";
import AngelActionIndex from "./pages/AngelActionIndex";
import NotFound from "./pages/NotFound";
import AdminDonations from "./pages/AdminDonations";
import AdminEducators from "./pages/AdminEducators";
import AdminKb from "./pages/AdminKb";
import SymptomFinder from "./pages/SymptomFinder";
import SymptomLander from "./pages/SymptomLander";
import LearnIndex from "./pages/LearnIndex";
import LearnCountry from "./pages/LearnCountry";
import LearnCity from "./pages/LearnCity";
import LearnSubmit from "./pages/LearnSubmit";
import EducatorProfile from "./pages/EducatorProfile";
import CprGuide from "./pages/CprGuide";
import AgentChat from "./pages/AgentChat";
import Unsubscribe from "./pages/Unsubscribe";
import AedFinder from "./pages/AedFinder";
import AedIndex from "./pages/AedIndex";
import AedCountry from "./pages/AedCountry";
import AedCity from "./pages/AedCity";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseLesson from "./pages/CourseLesson";
import CourseQuiz from "./pages/CourseQuiz";
import CourseCertificate from "./pages/CourseCertificate";
import CertificateVerify from "./pages/CertificateVerify";
import MyLearning from "./pages/MyLearning";
import AdminCourses from "./pages/AdminCourses";
import RequireAuth from "./components/RequireAuth";
import OfflineBanner from "./components/OfflineBanner";
import InstallPrompt from "./components/InstallPrompt";
import Partners from "./pages/Partners";
import ShopPartners from "./pages/ShopPartners";
import About from "./pages/About";
import WorkplaceIndex from "./pages/WorkplaceIndex";
import WorkplaceVertical from "./pages/WorkplaceVertical";
import EmployerOnboarding from "./pages/EmployerOnboarding";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerPeople from "./pages/EmployerPeople";
import EmployerSettings from "./pages/EmployerSettings";
import EmployerPlaceholder from "./pages/EmployerPlaceholder";
import EmployerImport from "./pages/EmployerImport";
import EmployerAssignments from "./pages/EmployerAssignments";
import EmployerReports from "./pages/EmployerReports";
import JoinOrg from "./pages/JoinOrg";

const queryClient = new QueryClient();

// Validates :lang and either renders the page (with sync) or redirects to English equivalent.
function LangRoute({ children, to }: { children: React.ReactNode; to: (slug?: string) => string }) {
  const { lang, slug } = useParams<{ lang: string; slug?: string }>();
  if (!lang || !(LANGS as string[]).includes(lang) || lang === "en") {
    return <Navigate to={to(slug)} replace />;
  }
  return (
    <>
      <LangParamSync />
      {children}
    </>
  );
}

const App = forwardRef(function App(_props, _ref) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <OfflineBanner />
            <InstallPrompt />
            <BrowserRouter>
              <Routes>
                {/* English (default, no prefix) */}
                <Route path="/" element={<Index />} />
                <Route path="/kb" element={<KbIndex />} />
                <Route path="/kb/:slug" element={<KbTopic />} />
                <Route path="/angel-action" element={<AngelActionIndex />} />
                <Route path="/:lang/angel-action" element={<AngelActionIndex />} />
                <Route path="/symptoms" element={<SymptomFinder />} />
                <Route path="/symptoms/:slug" element={<SymptomLander />} />
                <Route path="/learn" element={<LearnIndex />} />
                <Route path="/learn/submit" element={<LearnSubmit />} />
                <Route path="/learn/provider/:slug" element={<EducatorProfile />} />
                <Route path="/learn/:country" element={<LearnCountry />} />
                <Route path="/learn/:country/:city" element={<LearnCity />} />
                <Route path="/cpr" element={<CprGuide />} />
                <Route path="/aed-finder" element={<AedFinder />} />
                <Route path="/aed" element={<AedIndex />} />
                <Route path="/aed/:country" element={<AedCountry />} />
                <Route path="/aed/:country/:city" element={<AedCity />} />
                <Route path="/agent" element={<AgentChat />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/about" element={<About />} />
                <Route path="/:lang/about" element={<About />} />
                <Route path="/workplace" element={<WorkplaceIndex />} />
                <Route path="/workplace/:slug" element={<WorkplaceVertical />} />

                <Route path="/admin/donations" element={<AdminDonations />} />
                <Route path="/admin/educators" element={<AdminEducators />} />
                <Route path="/admin/kb" element={<AdminKb />} />
                <Route path="/admin/courses" element={<RequireAuth adminOnly><AdminCourses /></RequireAuth>} />

                {/* Learning / LMS */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/:lang/partners" element={<Partners />} />
                <Route path="/shop" element={<ShopPartners />} />
                <Route path="/:lang/shop" element={<ShopPartners />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:slug" element={<CourseDetail />} />
                <Route path="/courses/:slug/lesson/:lessonSlug" element={<RequireAuth><CourseLesson /></RequireAuth>} />
                <Route path="/courses/:slug/quiz" element={<RequireAuth><CourseQuiz /></RequireAuth>} />
                <Route path="/courses/:slug/certificate" element={<RequireAuth><CourseCertificate /></RequireAuth>} />
                <Route path="/my-learning" element={<RequireAuth><MyLearning /></RequireAuth>} />
                <Route path="/verify/:number" element={<CertificateVerify />} />

                {/* Employer admin */}
                <Route path="/employer" element={<RequireAuth><EmployerDashboard /></RequireAuth>} />
                <Route path="/employer/onboarding" element={<RequireAuth><EmployerOnboarding /></RequireAuth>} />
                <Route path="/employer/dashboard" element={<RequireAuth><EmployerDashboard /></RequireAuth>} />
                <Route path="/employer/people" element={<RequireAuth><EmployerPeople /></RequireAuth>} />
                <Route path="/employer/people/import" element={<RequireAuth><EmployerImport /></RequireAuth>} />
                <Route path="/employer/assignments" element={<RequireAuth><EmployerAssignments /></RequireAuth>} />
                <Route path="/employer/reports" element={<RequireAuth><EmployerReports /></RequireAuth>} />
                <Route path="/employer/settings" element={<RequireAuth><EmployerSettings /></RequireAuth>} />
                <Route path="/join/:token" element={<JoinOrg />} />

                {/* Localized */}
                <Route
                  path="/:lang"
                  element={<LangRoute to={() => "/"}><Index /></LangRoute>}
                />
                <Route
                  path="/:lang/kb"
                  element={<LangRoute to={() => "/kb"}><KbIndex /></LangRoute>}
                />
                <Route
                  path="/:lang/kb/:slug"
                  element={
                    <LangRoute to={(slug) => `/kb/${slug ?? ""}`}>
                      <KbTopic />
                    </LangRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
});

export default App;
