import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import CourseLayout from "@/components/CourseLayout";
import { SeoHead } from "@/components/SeoHead";
import { toast } from "sonner";

type Q = { id: string; question: string; choices: string[]; correct_index: number; explanation: string | null };

export default function CourseQuiz() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      if (!c) return;
      setCourse(c);
      const { data: qs } = await supabase.from("quiz_questions").select("*").eq("course_id", c.id).order("sort_order");
      setQuestions((qs ?? []) as Q[]);
      setLoading(false);
    })();
  }, [slug]);

  const submit = async () => {
    if (!user || !course) return;
    if (Object.keys(answers).length < questions.length) { toast.error("Please answer every question."); return; }
    setSubmitting(true);
    const correct = questions.filter(q => answers[q.id] === q.correct_index).length;
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= course.pass_mark;
    await supabase.from("quiz_attempts").insert({
      user_id: user.id, course_id: course.id, score: pct, total: 100, passed, answers,
    });
    setResult({ score: pct, total: 100, passed });
    setSubmitting(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!course || questions.length === 0) return (
    <div className="min-h-screen flex flex-col"><CoursesHeader /><div className="flex-1 flex items-center justify-center">No quiz available yet.</div></div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead lang="en" basePath="/courses" title={`${course.title} Quiz | First Aid Angel`} description="Test your knowledge and earn your certificate." />
      <CoursesHeader />
      <main className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        <Link to={`/courses/${slug}`} className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">← {course.title}</Link>
        <h1 className="font-display text-3xl font-bold mb-2">Final Quiz</h1>
        <p className="text-muted-foreground mb-6">Score {course.pass_mark}% or higher to earn your certificate.</p>

        {!result ? (
          <div className="space-y-6">
            {questions.map((q, i) => (
              <Card key={q.id} className="p-5 rounded-2xl">
                <div className="font-medium mb-3">{i + 1}. {q.question}</div>
                <RadioGroup
                  value={answers[q.id]?.toString() ?? ""}
                  onValueChange={(v) => setAnswers({ ...answers, [q.id]: parseInt(v) })}
                >
                  {q.choices.map((c, ci) => (
                    <div key={ci} className="flex items-center space-x-2">
                      <RadioGroupItem value={ci.toString()} id={`${q.id}-${ci}`} />
                      <Label htmlFor={`${q.id}-${ci}`} className="font-normal cursor-pointer">{c}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </Card>
            ))}
            <Button size="lg" onClick={submit} disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit quiz"}
            </Button>
          </div>
        ) : (
          <Card className="p-8 rounded-2xl text-center">
            {result.passed ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="font-display text-3xl font-bold mb-2">Passed — {result.score}%</h2>
                <p className="text-muted-foreground mb-6">Congratulations! Your certificate is ready.</p>
                <Button size="lg" onClick={() => navigate(`/courses/${slug}/certificate`)}>
                  <Award className="h-4 w-4 mr-2" /> Get certificate
                </Button>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="font-display text-3xl font-bold mb-2">Not quite — {result.score}%</h2>
                <p className="text-muted-foreground mb-6">You need {course.pass_mark}% to pass. Review the lessons and try again.</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button variant="outline" onClick={() => navigate(`/courses/${slug}`)}>Review lessons</Button>
                  <Button onClick={() => { setResult(null); setAnswers({}); }}>Retry quiz</Button>
                </div>
              </>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}
