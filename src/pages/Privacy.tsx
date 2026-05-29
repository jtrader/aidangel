import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import NetworkFooter from "@/components/NetworkFooter";

export default function PrivacyPolicy() {
  return (
    <>
      <CmsPageRenderer
        slug="privacy"
        fallback={
          <main className="container mx-auto px-4 py-12 prose">
            <h1>Privacy Policy</h1>
            <p>Coming soon.</p>
          </main>
        }
      />
      <NetworkFooter />
    </>
  );
}
