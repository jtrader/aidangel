import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { useUiStrings } from "@/hooks/useUiStrings";
import { toast } from "sonner";

export default function ProgramQuiz() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const tr = useUiStrings({
    backToProgram: "Back to program",
    finalQuiz: "Final quiz",
    passMark: "Pass mark",
    locked: "Final quiz locked",
    lockedHint: "Pass all topic quizzes to unlock the program final quiz.",
    passedLabel: "Passed!",
    notQuite: "Not quite",
    youScored: "You scored",
    claimCertificate: "Claim certificate",
    tryAgain: "Try again",
    answerAll: "Please answer all questions",
    submitting: "Submitting…",
    submitAnswers: "Submit answers",
    courseNotFound: "Course not found",
    progress: "You've passed {n} of {total}.",
  });
  const [program, setProgram] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [topicCount, setTopicCount] = useState(0);
  const [topicsPassed, setTopicsPassed] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("programs").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (!p) { setLoading(false); return; }
      setProgram(p);
      const { data: qs } = await supabase.from("program_quiz_questions").select("*").eq("program_id", p.id).order("sort_order");
      setQuestions(qs ?? []);
      const { data: topics } = await supabase.from("program_topics").select("course_id").eq("program_id", p.id);
      const courseIds = (topics ?? []).map((t: any) => t.course_id);
      setTopicCount(courseIds.length);
      if (user && courseIds.length) {
        const { data: attempts } = await supabase
          .from("quiz_attempts")
          .select("course_id")
          .eq("user_id", user.id)
          .eq("passed", true)
          .in("course_id", courseIds);
        const passed = new Set((attempts ?? []).map((a: any) => a.course_id));
        setTopicsPassed(courseIds.filter((id) => passed.has(id)).length);
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const submit = async () => {
    if (!user || !program) return;
    if (Object.keys(answers).length !== questions.length) {
      toast.error(tr.answerAll);
      return;
    }
    setSubmitting(true);
    let score = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct_index) score++; });
    const passed = (score / questions.length) * 100 >= program.pass_mark;
    const { error } = await supabase.from("program_quiz_attempts").insert({
      user_id: user.id, program_id: program.id, score, total: questions.length, passed, answers,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setResult({ score, total: questions.length, passed });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!program) return <div className="min-h-screen flex items-center justify-center">{tr.courseNotFound}</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="container max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => navigate(`/programs/${slug}`)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {tr.backToProgram}
        </button>
        <h1 className="font-display text-3xl font-bold mb-2">{program.title} — {tr.finalQuiz}</h1>
        <p className="text-muted-foreground mb-6">{tr.passMark}: {program.pass_mark}%</p>

        {topicCount > 0 && topicsPassed < topicCount ? (
          <Card className="p-8 text-center rounded-2xl">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">{tr.locked}</h2>
            <p className="text-muted-foreground mb-6">
              {tr.lockedHint} {tr.progress.replace("{n}", String(topicsPassed)).replace("{total}", String(topicCount))}
            </p>
            <Button onClick={() => navigate(`/programs/${slug}`)}>{tr.backToProgram}</Button>
          </Card>
        ) : result ? (
          <Card className="p-8 text-center rounded-2xl">
            {result.passed ? (
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            )}
            <h2 className="font-display text-2xl font-bold mb-2">
              {result.passed ? tr.passedLabel : tr.notQuite}
            </h2>
            <p className="text-muted-foreground mb-6">
              {tr.youScored} {result.score} / {result.total} ({Math.round((result.score / result.total) * 100)}%)
            </p>
            <div className="flex gap-3 justify-center">
              {result.passed ? (
                <Button onClick={() => navigate(`/programs/${slug}/certificate`)}>{tr.claimCertificate}</Button>
              ) : (
                <Button onClick={() => { setResult(null); setAnswers({}); }}>{tr.tryAgain}</Button>
              )}
              <Button variant="outline" onClick={() => navigate(`/programs/${slug}`)}>{tr.backToProgram}</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <Card key={q.id} className="p-5">
                <p className="font-medium mb-3">{i + 1}. {q.question}</p>
                <div className="space-y-2">
                  {(q.choices as string[]).map((c, idx) => (
                    <label key={idx} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/40">
                      <input type="radio" name={q.id} checked={answers[q.id] === idx}
                        onChange={() => setAnswers({ ...answers, [q.id]: idx })} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
            <Button size="lg" onClick={submit} disabled={submitting}>
              {submitting ? tr.submitting : tr.submitAnswers}
            </Button>
          </div>
        )}
      </main>
      <NetworkFooter />
    </div>
  );
}
