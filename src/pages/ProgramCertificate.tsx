import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Award, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import { toast } from "sonner";
import { generateCertificatePdf } from "@/lib/certificate";

export default function ProgramCertificate() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [cert, setCert] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      if (!user) { navigate(`/auth?redirect=/programs/${slug}/certificate`); return; }
      const { data: p } = await supabase.from("programs").select("*").eq("slug", slug).maybeSingle();
      if (!p) { setLoading(false); return; }
      setProgram(p);

      const { data: existing } = await supabase.from("program_certificates")
        .select("*").eq("user_id", user.id).eq("program_id", p.id).maybeSingle();
      if (existing) setCert(existing);

      // pick first org for branding (if any)
      const { data: orgs } = await supabase.from("organisations")
        .select("name,logo_url,primary_color").limit(1);
      if (orgs?.[0]) setOrg({ name: orgs[0].name, logoUrl: orgs[0].logo_url, primaryColor: orgs[0].primary_color });

      setName(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "");
      setLoading(false);
    })();
  }, [slug, user, navigate]);

  const issue = async () => {
    if (!user || !program || !name.trim()) { toast.error("Please enter your name"); return; }
    // verify topics + final quiz
    const { data: topics } = await supabase.from("program_topics").select("course_id").eq("program_id", program.id);
    const ids = (topics ?? []).map(t => t.course_id);
    const { data: attempts } = await supabase.from("quiz_attempts")
      .select("course_id").eq("user_id", user.id).eq("passed", true).in("course_id", ids);
    const passed = new Set((attempts ?? []).map(a => a.course_id));
    if (ids.some(id => !passed.has(id))) { toast.error("Complete all topic quizzes first"); return; }

    const { count: qCount } = await supabase.from("program_quiz_questions")
      .select("*", { count: "exact", head: true }).eq("program_id", program.id);
    if ((qCount ?? 0) > 0) {
      const { data: fa } = await supabase.from("program_quiz_attempts")
        .select("id").eq("user_id", user.id).eq("program_id", program.id).eq("passed", true).maybeSingle();
      if (!fa) { toast.error("Pass the final quiz first"); return; }
    }

    const { data, error } = await supabase.from("program_certificates")
      .insert({ user_id: user.id, program_id: program.id, learner_name: name.trim() })
      .select().single();
    if (error) { toast.error(error.message); return; }
    setCert(data);
    toast.success("Certificate issued!");
  };

  const download = async () => {
    if (!cert || !program) return;
    await generateCertificatePdf({
      learnerName: cert.learner_name,
      courseTitle: program.title,
      certificateNumber: cert.certificate_number,
      issuedAt: cert.issued_at,
      org,
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!program) return <div className="min-h-screen flex items-center justify-center">Program not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <CoursesHeader />
      <main className="container max-w-2xl mx-auto px-4 py-10">
        <Card className="p-8 text-center rounded-2xl">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Program Certificate</h1>
          <p className="text-muted-foreground mb-6">{program.title}</p>

          {cert ? (
            <>
              <p className="text-lg mb-2">Issued to <strong>{cert.learner_name}</strong></p>
              <p className="text-sm text-muted-foreground mb-6">Certificate No: {cert.certificate_number}</p>
              <Button size="lg" onClick={download}><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
            </>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">Enter the name to appear on your certificate.</p>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full max-w-sm mx-auto block border rounded-lg px-3 py-2 mb-4 text-center"
              />
              <Button size="lg" onClick={issue}>Issue certificate</Button>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
