import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import NetworkFooter from "@/components/NetworkFooter";

export default function RefundPolicy() {
  return (
    <>
      <CmsPageRenderer
        slug="refund"
        fallback={
          <main className="container mx-auto px-4 py-12 prose">
            <h1>Refund Policy</h1>
            <p>Coming soon.</p>
          </main>
        }
      />
      <NetworkFooter />
    </>
  );
}
