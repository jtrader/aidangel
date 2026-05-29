import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import NetworkFooter from "@/components/NetworkFooter";

export default function Terms() {
  return (
    <>
      <CmsPageRenderer
        slug="terms"
        fallback={
          <main className="container mx-auto px-4 py-12 prose">
            <h1>Terms and Conditions</h1>
            <p>Coming soon.</p>
          </main>
        }
      />
      <NetworkFooter />
    </>
  );
}
