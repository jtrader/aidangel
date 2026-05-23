import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Download, Loader2, ShieldPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import { SeoHead } from "@/components/SeoHead";
import { generateCertificatePdf } from "@/lib/certificate";
import { toast } from "sonner";

export default function CourseCertificate() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [cert, setCert] = useState<any>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: c } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      if (!c) { setLoading(false); return; }
      setCourse(c);
      const { data: existing } = await supabase.from("certificates").select("*").eq("user_id", user.id).eq("course_id", c.id).maybeSingle();
      if (existing) {
        setCert(existing);
      } else {
        const { data: attempt } = await supabase.from("quiz_attempts").select("score,passed")
          .eq("user_id", user.id).eq("course_id", c.id).eq("passed", true)
          .order("score", { ascending: false }).limit(1).maybeSingle();
        setBestScore(attempt?.score ?? null);
        setName((user.user_metadata?.full_name as string) ?? "");
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const issue = async () => {
    if (!user || !course || !name.trim()) { toast.error("Enter the name to appear on your certificate"); return; }
    setIssuing(true);
    const { data, error } = await supabase.from("certificates").insert({
      user_id: user.id, course_id: course.id, learner_name: name.trim(),
    }).select().single();
    if (error) { toast.error(error.message); setIssuing(false); return; }
    setCert(data);
    setIssuing(false);
  };

  const download = () => {
    if (!cert || !course) return;
    generateCertificatePdf({
      learnerName: cert.learner_name,
      courseTitle: course.title,
      certificateNumber: cert.certificate_number,
      issuedAt: cert.issued_at,
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;
  if (!cert && bestScore === null) {
    return (
      <div className="min-h-screen flex flex-col"><CoursesHeader />
        <main className="flex-1 container max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="mb-4">You need to pass the quiz before claiming a certificate.</p>
          <Button onClick={() => navigate(`/courses/${slug}/quiz`)}>Take the quiz</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead title={`${course.title} Certificate | First Aid Angel`} description="Download your certificate of completion." />
      <CoursesHeader />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-10">
        {!cert ? (
          <Card className="p-8 rounded-2xl">
            <Award className="h-12 w-12 text-primary mb-4" />
            <h1 className="font-display text-3xl font-bold mb-2">Claim your certificate</h1>
            <p className="text-muted-foreground mb-6">You passed with {bestScore}%. Enter the full name to appear on the certificate.</p>
            <div className="space-y-3 mb-6">
              <Label htmlFor="learner-name">Full name</Label>
              <Input id="learner-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Jane Smith" />
            </div>
            <Button size="lg" onClick={issue} disabled={issuing || !name.trim()}>
              {issuing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Issue certificate"}
            </Button>
          </Card>
        ) : (
          <>
            {/* Certificate preview */}
            <Card className="rounded-2xl overflow-hidden mb-6 border-4 border-primary/20">
              <div className="bg-[#F7F7F7] p-10 text-center">
                <div className="inline-flex items-center gap-2 text-primary mb-2">
                  <ShieldPlus className="h-5 w-5" />
                  <span className="font-display font-bold tracking-widest text-sm">FIRST AID ANGEL</span>
                </div>
                <div className="text-xs text-muted-foreground mb-6">Love Key Emergency & Recovery Network</div>
                <h2 className="font-display text-3xl font-bold mb-3">Certificate of Completion</h2>
                <p className="text-muted-foreground mb-2">This certifies that</p>
                <p className="font-display text-3xl text-primary font-bold mb-2">{cert.learner_name}</p>
                <div className="h-0.5 w-48 bg-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-1">has successfully completed</p>
                <p className="font-display text-xl font-bold mb-6">{course.title}</p>
                <div className="flex justify-between text-xs text-muted-foreground mt-8">
                  <span>Issued {new Date(cert.issued_at).toLocaleDateString()}</span>
                  <span>No. {cert.certificate_number}</span>
                </div>
              </div>
            </Card>
            <div className="flex gap-3 justify-center">
              <Button size="lg" onClick={download}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/my-learning")}>My learning</Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Verify at <Link to={`/verify/${cert.certificate_number}`} className="underline">firstaidangel.org/verify/{cert.certificate_number}</Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
