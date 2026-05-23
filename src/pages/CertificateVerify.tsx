import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import { SeoHead } from "@/components/SeoHead";

export default function CertificateVerify() {
  const { number } = useParams<{ number: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!number) return;
    supabase.rpc("verify_certificate", { _cert_number: number }).then(({ data }) => {
      setResult(data && data.length ? data[0] : null);
      setLoading(false);
    });
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
              <h1 className="font-display text-2xl font-bold mb-2">Valid certificate</h1>
              <p className="text-muted-foreground mb-4">Issued by First Aid Angel</p>
              <div className="text-left bg-muted rounded-lg p-4 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Number:</span> <span className="font-mono">{result.certificate_number}</span></div>
                <div><span className="text-muted-foreground">Course:</span> {result.course_title}</div>
                <div><span className="text-muted-foreground">Learner:</span> {result.learner_initial}***</div>
                <div><span className="text-muted-foreground">Issued:</span> {new Date(result.issued_at).toLocaleDateString()}</div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold mb-2">Certificate not found</h1>
              <p className="text-muted-foreground">No certificate exists with this number.</p>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
