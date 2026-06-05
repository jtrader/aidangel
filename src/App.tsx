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

function RedirectCourseToTopic({ suffix }: { suffix?: "lesson" | "quiz" }) {
  const params = useParams();
  const slug = params.slug;
  if (!slug) return <Navigate to="/topics" replace />;
  if (suffix === "lesson") return <Navigate to={`/topics/${slug}/lesson/${params.lessonSlug}`} replace />;
  if (suffix === "quiz") return <Navigate to={`/topics/${slug}/quiz`} replace />;
  return <Navigate to={`/topics/${slug}`} replace />;
}
import Index from "./pages/Index";
import KbIndex from "./pages/KbIndex";
import KbTopic from "./pages/KbTopic";
import StyleGuide from "./pages/StyleGuide";
import AngelActionIndex from "./pages/AngelActionIndex";
import NotFound from "./pages/NotFound";
import AdminDonations from "./pages/AdminDonations";
import AdminRoutes from "./pages/AdminRoutes";
import AdminIndex from "./pages/AdminIndex";
import AdminCms from "./pages/AdminCms";
import AdminCmsEditor from "./pages/AdminCmsEditor";
import CmsPreview from "./pages/CmsPreview";
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
import ResetPassword from "./pages/ResetPassword";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseLesson from "./pages/CourseLesson";
import CourseQuiz from "./pages/CourseQuiz";

import CertificateVerify from "./pages/CertificateVerify";
import GoRedirect from "./pages/GoRedirect";
import MyLearning from "./pages/MyLearning";
import AdminCourses from "./pages/AdminCourses";
import AdminVideos from "./pages/AdminVideos";
import AdminPrograms from "./pages/AdminPrograms";
import AdminLearners from "./pages/AdminLearners";
import AdminGraduates from "./pages/AdminGraduates";
import MyLocationPage from "./pages/MyLocationPage";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import ProgramQuiz from "./pages/ProgramQuiz";
import ProgramCertificate from "./pages/ProgramCertificate";
import RequireAuth from "./components/RequireAuth";
import OfflineBanner from "./components/OfflineBanner";
import InstallPrompt from "./components/InstallPrompt";
import Partners from "./pages/Partners";
import ShopPartners from "./pages/ShopPartners";
import ShopKits from "./pages/ShopKits";
import About from "./pages/About";
import Availability from "./pages/Availability";
import CountryDetail from "./pages/CountryDetail";
import PrivacyPolicy from "./pages/Privacy";
import RefundPolicy from "./pages/Refund";
import Terms from "./pages/Terms";
import MedicialDisclaimer from "./pages/MedicalDisclaimer";
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
import EmployerMarketing from "./pages/EmployerMarketing";
import PersonalMarketing from "./pages/PersonalMarketing";
import JoinCodeEntry from "./pages/JoinCodeEntry";
import JoinOrg from "./pages/JoinOrg";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CourseLanding from "./pages/CourseLanding";
import BlogIndex from "./pages/BlogIndex";
import BlogCategoryPage from "./pages/BlogCategory";
import BlogPostPage from "./pages/BlogPost";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import LessonRenderer from "./components/lesson/LessonRenderer";
import { PaymentTestModeBanner } from "./components/PaymentTestModeBanner";
import RequireProgramAccess from "./components/RequireProgramAccess";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import { useCartSync } from "./hooks/useCartSync";
import { useRSPAdapter } from "./hooks/useRSPAdapter";

const queryClient = new QueryClient();

function CartSyncMount() {
  useCartSync();
  useRSPAdapter();
  return null;
}


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
            <PaymentTestModeBanner />
            <InstallPrompt />
            <BrowserRouter>
              <CartSyncMount />
              <Routes>
                {/* English (default, no prefix) */}
                <Route path="/" element={<Index />} />
                <Route path="/kb" element={<KbIndex />} />
                <Route path="/kb/:slug" element={<KbTopic />} />
                <Route path="/style-guide" element={<StyleGuide />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/kits" element={<ShopKits />} />
                <Route path="/product/:handle" element={<ProductDetail />} />
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
                <Route path="/go/:slug" element={<GoRedirect />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/about" element={<About />} />
                <Route path="/my-location" element={<MyLocationPage />} />
                <Route path="/location" element={<Navigate to="/my-location" replace />} />
                <Route path="/:lang/about" element={<About />} />
                <Route path="/availability" element={<Availability />} />
                <Route path="/:lang/availability" element={<Availability />} />
                <Route path="/availability/:code" element={<CountryDetail />} />
                <Route path="/:lang/availability/:code" element={<CountryDetail />} />

                <Route path="/workplace" element={<WorkplaceIndex />} />
                <Route path="/workplace/:slug" element={<WorkplaceVertical />} />

                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<AdminIndex />} />
                <Route path="/admin/cms" element={<AdminCms />} />
                <Route path="/admin/cms/:slug" element={<AdminCmsEditor />} />
                <Route path="/cms-preview/:slug" element={<CmsPreview />} />
                <Route path="/admin/donations" element={<AdminDonations />} />
                <Route path="/admin/routes" element={<AdminRoutes />} />
                <Route path="/admin/educators" element={<AdminEducators />} />
                <Route path="/admin/kb" element={<AdminKb />} />
                <Route path="/admin/courses" element={<RequireAuth adminOnly><AdminCourses /></RequireAuth>} />
                <Route path="/admin/topics" element={<RequireAuth adminOnly><AdminCourses /></RequireAuth>} />
                <Route path="/admin/videos" element={<RequireAuth adminOnly><AdminVideos /></RequireAuth>} />
                <Route path="/admin/programs" element={<RequireAuth adminOnly><AdminPrograms /></RequireAuth>} />
                <Route path="/admin/learners" element={<RequireAuth adminOnly><AdminLearners /></RequireAuth>} />
                <Route path="/admin/graduates" element={<RequireAuth adminOnly><AdminGraduates /></RequireAuth>} />

                {/* Learning / LMS */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/:lang/partners" element={<Partners />} />
                <Route path="/shop" element={<ShopPartners />} />
                <Route path="/:lang/shop" element={<ShopPartners />} />
                <Route path="/topics" element={<Courses />} />
                <Route path="/topics/:slug" element={<CourseDetail />} />
                <Route path="/topics/:slug/lesson/:lessonSlug" element={<RequireAuth><CourseLesson /></RequireAuth>} />
                <Route path="/topics/:slug/quiz" element={<RequireAuth><CourseQuiz /></RequireAuth>} />
                {/* SEO course landing pages (/courses/<program-slug>-guide) — must precede legacy redirects */}
                <Route path="/courses/:slugGuide" element={<CourseLanding />} />
                {/* Legacy /courses redirects */}
                <Route path="/courses" element={<Navigate to="/topics" replace />} />
                <Route path="/courses/:slug/lesson/:lessonSlug" element={<RedirectCourseToTopic suffix="lesson" />} />
                <Route path="/courses/:slug/quiz" element={<RedirectCourseToTopic suffix="quiz" />} />

                {/* Blog */}
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:category" element={<BlogCategoryPage />} />
                <Route path="/blog/:category/:slug" element={<BlogPostPage />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/blog/:slug" element={<AdminBlogEditor />} />
                
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/:slug" element={<ProgramDetail />} />
                <Route path="/programs/:slug/quiz" element={<RequireAuth><RequireProgramAccess><ProgramQuiz /></RequireProgramAccess></RequireAuth>} />
                <Route path="/programs/:slug/certificate" element={<RequireAuth><RequireProgramAccess><ProgramCertificate /></RequireProgramAccess></RequireAuth>} />
                <Route path="/my-learning" element={<RequireAuth><MyLearning /></RequireAuth>} />
                <Route path="/verify/:number" element={<CertificateVerify />} />

                {/* Employer admin */}
                <Route path="/employer" element={<EmployerMarketing />} />
                <Route path="/personal" element={<PersonalMarketing />} />
                <Route path="/employer/onboarding" element={<RequireAuth><EmployerOnboarding /></RequireAuth>} />
                <Route path="/employer/dashboard" element={<RequireAuth><EmployerDashboard /></RequireAuth>} />
                <Route path="/employer/people" element={<RequireAuth><EmployerPeople /></RequireAuth>} />
                <Route path="/employer/people/import" element={<RequireAuth><EmployerImport /></RequireAuth>} />
                <Route path="/employer/assignments" element={<RequireAuth><EmployerAssignments /></RequireAuth>} />
                <Route path="/employer/reports" element={<RequireAuth><EmployerReports /></RequireAuth>} />
                <Route path="/employer/settings" element={<RequireAuth><EmployerSettings /></RequireAuth>} />
                <Route path="/join" element={<JoinCodeEntry />} />
                <Route path="/join/:token" element={<JoinOrg />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/test-renderer" element={<LessonRenderer />} />

                {/* Legal */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/medical-disclaimer" element={<MedicialDisclaimer />} />

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
