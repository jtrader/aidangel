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
import NotFound from "./pages/NotFound";
import AdminDonations from "./pages/AdminDonations";
import SymptomFinder from "./pages/SymptomFinder";
import SymptomLander from "./pages/SymptomLander";
import LearnIndex from "./pages/LearnIndex";
import LearnCountry from "./pages/LearnCountry";
import LearnCity from "./pages/LearnCity";
import EducatorProfile from "./pages/EducatorProfile";

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
            <BrowserRouter>
              <Routes>
                {/* English (default, no prefix) */}
                <Route path="/" element={<Index />} />
                <Route path="/kb" element={<KbIndex />} />
                <Route path="/kb/:slug" element={<KbTopic />} />
                <Route path="/symptoms" element={<SymptomFinder />} />
                <Route path="/symptoms/:slug" element={<SymptomLander />} />

                <Route path="/admin/donations" element={<AdminDonations />} />

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
