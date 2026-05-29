import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { useUiStrings } from "@/hooks/useUiStrings";

export default function CheckoutSuccess() {
  const tr = useUiStrings({
    heading: "You're all set!",
    blurb:
      "Thanks for subscribing to First Aid Angel. Your access is being activated — a confirmation email is on its way.",
    goToLearning: "Go to my learning",
    browseTopics: "Browse topics",
  });
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang="en"
        basePath="/checkout/success"
        title="Payment successful | First Aid Angel"
        description="Your First Aid Angel subscription is active."
      />
      <CoursesHeader />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-20">
        <Card className="p-8 md:p-12 rounded-2xl text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{tr.heading}</h1>
          <p className="text-muted-foreground mb-8">{tr.blurb}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/my-learning">{tr.goToLearning}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/topics">{tr.browseTopics}</Link>
            </Button>
          </div>
        </Card>
      </main>
      <NetworkFooter />
    </div>
  );
}
