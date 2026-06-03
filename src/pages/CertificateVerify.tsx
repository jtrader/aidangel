import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { SeoHead } from "@/components/SeoHead";
import { useUiStrings } from "@/hooks/useUiStrings";

export default function CertificateVerify() {
  const { number } = useParams<{ number: string }>();
  const tr = useUiStrings({
    valid: "Valid certificate",
    issuedBy: "Issued by First Aid Angel",
    number: "Number",
    course: "Course",
    learner: "Learner",
    issued: "Issued",
    notFound: "Certificate not found",
    notFoundBlurb: "No certificate exists with this number.",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!number) return;
    (async () => {
      // Try free LMS / program certs first
      const { data: freeRes } = await supabase.rpc("verify_certificate", { _cert_number: number });
      if (freeRes && freeRes.length) {
        setResult({
          certificate_number: freeRes[0].certificate_number,
          course_title: freeRes[0].course_title,
          learner_initial: freeRes[0].learner_initial,
          issued_at: freeRes[0].issued_at,
        });
        setLoading(false);
        return;
      }
      // Fall back to paid Shopify cert
      const { data: paidRes } = await supabase.rpc("verify_shopify_certificate", { _certificate_id: number });
      if (paidRes && paidRes.length) {
        setResult({
          certificate_number: paidRes[0].certificate_id,
          course_title: paidRes[0].program_name,
          learner_initial: paidRes[0].learner_initial,
          issued_at: paidRes[0].issue_date,
        });
      }
      setLoading(false);
    })();
  }, [number]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead lang="en" basePath="/verify" title={`Verify certificate ${number} | First Aid Angel`} description="Verify a First Aid Angel course certificate." />
      <CoursesHeader />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 rounded-2xl text-center">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          ) : result ? (
            <>
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">{tr.valid}</h1>
              <p className="text-muted-foreground mb-4">{tr.issuedBy}</p>
              <div className="text-left bg-muted rounded-lg p-4 space-y-2 text-sm">
                <div><span className="text-muted-foreground">{tr.number}:</span> <span className="font-mono">{result.certificate_number}</span></div>
                <div><span className="text-muted-foreground">{tr.course}:</span> {result.course_title}</div>
                <div><span className="text-muted-foreground">{tr.learner}:</span> {result.learner_initial}***</div>
                <div><span className="text-muted-foreground">{tr.issued}:</span> {new Date(result.issued_at).toLocaleDateString()}</div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">{tr.notFound}</h1>
              <p className="text-muted-foreground">{tr.notFoundBlurb}</p>
            </>
          )}
        </Card>
      </main>
      <NetworkFooter />
    </div>
  );
}
