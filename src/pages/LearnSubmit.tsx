import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, CheckCircle2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "@/lib/donations";
import NetworkFooter from "@/components/NetworkFooter";
import { toast } from "@/hooks/use-toast";

export default function LearnSubmit() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "commercial",
    blurb: "",
    website: "",
    booking_url: "",
    is_online: false,
    country_code: "AU",
    region: "",
    city: "",
    address: "",
    phone: "",
    languages: "en",
    submitter_name: "",
    submitter_email: "",
  });

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("pending_educators").insert({
      name: form.name,
      type: form.type as "st_john" | "red_cross" | "other_ngo" | "commercial" | "online" | "community",
      blurb: form.blurb || null,
      website: form.website || null,
      booking_url: form.booking_url || null,
      hq_country_code: form.country_code,
      is_online: form.is_online,
      country_code: form.country_code,
      region: form.region || null,
      city: form.city || null,
      address: form.address || null,
      phone: form.phone || null,
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      submitter_name: form.submitter_name || null,
      submitter_email: form.submitter_email || null,
      source: "submission",
      status: "pending",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet><title>Thank you — First Aid Angel</title></Helmet>
        <main className="flex-1 grid place-items-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold mb-2">Thanks for the tip!</h1>
            <p className="text-muted-foreground mb-6">
              We'll review your submission and add it to the directory once verified.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate("/learn")}>Back to Learn</Button>
              <Button onClick={() => { setSubmitted(false); setForm({ ...form, name: "" }); }}>Submit another</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Submit a first aid course — First Aid Angel</title>
        <meta name="description" content="Tell us about a first aid training provider so we can add them to the global directory." />
      </Helmet>
      <SiteHeader backTo="/learn" backLabel="Learn" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        <h1 className="font-heading text-2xl font-bold mb-1">Submit a first aid course</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Know a great accredited provider that isn't listed? Tell us — admins review every submission.
        </p>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <Label htmlFor="name">Provider name *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="st_john">St John Ambulance</SelectItem>
                  <SelectItem value="red_cross">Red Cross / Red Crescent</SelectItem>
                  <SelectItem value="other_ngo">Other NGO / non-profit</SelectItem>
                  <SelectItem value="commercial">Commercial provider</SelectItem>
                  <SelectItem value="online">Online-only</SelectItem>
                  <SelectItem value="community">Community group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 pb-2">
              <Checkbox id="online" checked={form.is_online} onCheckedChange={(c) => setForm({ ...form, is_online: !!c })} />
              <Label htmlFor="online" className="cursor-pointer">Online-only training</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="blurb">Short description</Label>
            <Textarea id="blurb" rows={2} value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
            </div>
            <div>
              <Label htmlFor="booking">Booking URL</Label>
              <Input id="booking" type="url" value={form.booking_url} onChange={(e) => setForm({ ...form, booking_url: e.target.value })} placeholder="https://" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Country *</Label>
              <Select value={form.country_code} onValueChange={(v) => setForm({ ...form, country_code: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lang">Languages taught (comma-sep)</Label>
              <Input id="lang" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} placeholder="en, es" />
            </div>
          </div>

          {!form.is_online && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="region">Region / State</Label>
                  <Input id="region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </>
          )}

          <div className="border-t pt-4 grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sname">Your name (optional)</Label>
              <Input id="sname" value={form.submitter_name} onChange={(e) => setForm({ ...form, submitter_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="semail">Your email (optional)</Label>
              <Input id="semail" type="email" value={form.submitter_email} onChange={(e) => setForm({ ...form, submitter_email: e.target.value })} />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            <Send className="h-4 w-4 mr-2" /> {loading ? "Submitting…" : "Submit for review"}
          </Button>
        </form>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
}
