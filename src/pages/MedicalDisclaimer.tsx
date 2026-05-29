import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import NetworkFooter from "@/components/NetworkFooter";

export default function MedicalDisclaimer() {
  return (
    <>
      <CmsPageRenderer
        slug="medical-disclaimer"
        fallback={
          <main className="container mx-auto px-4 py-12 prose">
            <h1>Medical Disclaimer</h1>
            <p>Coming soon.</p>
          </main>
        }
      />
      <NetworkFooter />
    </>
  );
}
