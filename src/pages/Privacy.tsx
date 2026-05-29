import { Helmet } from "react-helmet-async";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import NetworkFooter from "@/components/NetworkFooter";

const LAST_UPDATED = "29 May 2026";
const ENTITY = "Streamline Direct";
const CONTACT = "privacy@firstaidangel.org";

function PrivacyContent() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1>Privacy Notice</h1>
      <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <h2>1. Who we are</h2>
      <p>
        This service ("First Aid Angel", the "Service") is operated by{" "}
        <strong>{ENTITY}</strong> ("we", "us", "our"). {ENTITY} is the data
        controller for personal data processed through the Service. You can
        reach us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>2. Categories of personal data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> email address, password (hashed), display name.</li>
        <li><strong>Profile &amp; usage data:</strong> course progress, quiz results, certificates issued, language preference, country.</li>
        <li><strong>Content you submit:</strong> chat messages to the first-aid assistant, educator listing submissions, claim requests.</li>
        <li><strong>Technical data:</strong> IP address, device and browser identifiers, page paths, referrer, approximate location derived from IP.</li>
        <li><strong>Analytics &amp; referral data:</strong> outbound click events (Give / Shop / Learn), session identifiers, Google Analytics measurements.</li>
        <li><strong>Support data:</strong> messages you send to us by email or contact forms.</li>
      </ul>

      <h2>3. Purposes and legal bases</h2>
      <table>
        <thead>
          <tr><th>Purpose</th><th>Legal basis</th></tr>
        </thead>
        <tbody>
          <tr><td>Creating and operating your account; delivering courses, certificates, and AI guidance</td><td>Performance of a contract</td></tr>
          <tr><td>Security, fraud prevention, abuse detection, rate limiting</td><td>Legitimate interests</td></tr>
          <tr><td>Service improvement, debugging, aggregated analytics</td><td>Legitimate interests</td></tr>
          <tr><td>Customer support and communications about the Service</td><td>Performance of a contract / Legitimate interests</td></tr>
          <tr><td>Marketing emails (where applicable)</td><td>Consent (withdrawable at any time)</td></tr>
          <tr><td>Compliance with legal obligations (tax, accounting, lawful requests)</td><td>Legal obligation</td></tr>
        </tbody>
      </table>

      <h2>4. Who we share data with</h2>
      <p>We share personal data only with the following categories of recipients:</p>
      <ul>
        <li><strong>Service providers / sub-processors:</strong> cloud hosting and database (Supabase / AWS), AI inference providers, voice synthesis (ElevenLabs), email delivery, mapping providers (Google Maps, OpenAEDMap), and analytics (Google Analytics).</li>
        <li><strong>Merchant of Record — Paddle:</strong> Paddle.com Market Ltd acts as our reseller and Merchant of Record for all paid orders. Paddle handles checkout, billing, payment processing, tax compliance, invoicing, subscription management, and refunds. Their privacy notice is available at <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer">paddle.com/legal/privacy</a>.</li>
        <li><strong>Professional advisers:</strong> legal, accounting, and insurance advisers, under duties of confidentiality.</li>
        <li><strong>Authorities:</strong> where required by law, court order, or to protect the rights, safety, and property of {ENTITY}, our users, or the public.</li>
      </ul>
      <p>We do not sell personal data.</p>

      <h2>5. International transfers</h2>
      <p>
        Some of our service providers are located outside your country of
        residence, including in the United States and the European Economic
        Area. Where personal data is transferred outside the UK or EEA, we
        rely on appropriate safeguards such as the European Commission's
        Standard Contractual Clauses, UK International Data Transfer
        Addenda, or adequacy decisions where available.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain personal data only for as long as necessary for the
        purposes described in this notice. Account and learning records
        are retained while your account is active and for a reasonable
        period afterwards. Billing and tax records retained by Paddle are
        kept for the period required by applicable tax law (typically
        7–10 years). Analytics events are retained in aggregated form. When
        data is no longer needed, it is deleted or anonymised.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access,
        rectify, erase, restrict, or port your personal data, to object
        to processing, and to withdraw consent. UK and EEA users also have
        the right to lodge a complaint with their local supervisory
        authority. We aim to respond to verified requests within one
        month. To exercise any right, email{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>8. Security</h2>
      <p>
        We use appropriate technical and organisational measures designed
        to protect personal data, including TLS encryption in transit,
        encryption at rest for our database, role-based access controls,
        row-level security on user data, and secrets managed outside the
        codebase. No method of transmission or storage is 100% secure;
        we work to continuously improve our safeguards.
      </p>

      <h2>9. Cookies and similar technologies</h2>
      <p>
        We use a small number of cookies and local storage entries to
        operate the Service:
      </p>
      <ul>
        <li><strong>Essential:</strong> authentication tokens, language preference, session identifiers.</li>
        <li><strong>Analytics:</strong> Google Analytics (G-FTSXCZTK1V) to measure traffic and usage anonymously.</li>
      </ul>
      <p>You can manage cookies through your browser settings.</p>

      <h2>10. Children</h2>
      <p>
        The Service is not directed to children under 13 (or the
        equivalent minimum age in your jurisdiction). We do not knowingly
        collect personal data from children. If you believe a child has
        provided us with personal data, contact us and we will delete it.
      </p>

      <h2>11. Changes to this notice</h2>
      <p>
        We may update this notice from time to time. Material changes will
        be communicated by updating the "Last updated" date and, where
        appropriate, by notice in the Service.
      </p>

      <h2>12. Contact</h2>
      <p>
        {ENTITY} — <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </main>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Notice · First Aid Angel</title>
        <meta name="description" content={`Privacy notice for First Aid Angel, operated by ${ENTITY}.`} />
      </Helmet>
      <CmsPageRenderer slug="privacy" fallback={<PrivacyContent />} />
      <NetworkFooter />
    </>
  );
}
