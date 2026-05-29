import { Helmet } from "react-helmet-async";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import NetworkFooter from "@/components/NetworkFooter";

const LAST_UPDATED = "29 May 2026";
const ENTITY = "Streamline Direct";
const CONTACT = "support@firstaidangel.org";

function TermsContent() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1>Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <h2>1. Who you are contracting with</h2>
      <p>
        These Terms govern your use of First Aid Angel (the "Service"),
        provided by <strong>{ENTITY}</strong> ("we", "us", "our"). By
        accessing or using the Service, you agree to be bound by these
        Terms. If you do not agree, do not use the Service.
      </p>

      <h2>2. Eligibility and authority</h2>
      <p>
        You must be at least the age of majority in your jurisdiction (or
        have a parent or guardian's permission) to use the Service. If you
        use the Service on behalf of an organisation, you confirm you have
        authority to bind that organisation to these Terms.
      </p>

      <h2>3. The Service</h2>
      <p>
        First Aid Angel provides AI-assisted first-aid information, a
        learning management system with quizzes and certificates, an AED
        locator, an educator directory, and related tools. The Service is
        provided for general informational and educational purposes and
        is <strong>not a substitute for emergency services or
        professional medical advice</strong>. In a medical emergency, call
        your local emergency number (in Australia, <a href="tel:000">Triple
        Zero (000)</a>) immediately.
      </p>

      <h2>4. Accounts</h2>
      <p>
        You must provide accurate information and keep it up to date. You
        are responsible for safeguarding your credentials and for all
        activity under your account. Notify us promptly of any
        unauthorised use.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service unlawfully or to facilitate unlawful activity;</li>
        <li>Commit fraud, send spam, or impersonate others;</li>
        <li>Infringe any intellectual property, privacy, or publicity right;</li>
        <li>Interfere with the Service's security or integrity, including by introducing malware, probing for vulnerabilities, scraping at scale, or circumventing technical limits;</li>
        <li>Reverse engineer, decompile, or resell any part of the Service except as permitted by mandatory law.</li>
      </ul>

      <h2>6. AI-generated content</h2>
      <p>
        The Service uses generative AI to produce explanations, voice
        coaching, and other outputs. You acknowledge that:
      </p>
      <ul>
        <li>Outputs may be inaccurate, incomplete, or out of date and must not be relied upon as professional medical, legal, or other regulated advice.</li>
        <li>You are responsible for your prompts and for how you use any output, including verifying its accuracy before acting on it.</li>
        <li>You must have all necessary rights to any content you submit to the Service.</li>
        <li>You must not use the Service to generate illegal content, deepfakes, hate speech, harassment, malware, sexual content involving minors, content that facilitates self-harm, or any content prohibited by applicable law.</li>
        <li>You must not attempt to jailbreak, override safety guardrails, or extract system prompts.</li>
        <li>We may filter, refuse, or remove outputs and content, and may suspend accounts that repeatedly produce or attempt to produce prohibited content.</li>
        <li>Rights-holders may report alleged infringement to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>; we will review reports and may remove content and terminate repeat infringers.</li>
      </ul>

      <h2>7. Intellectual property</h2>
      <p>
        The Service, its software, content (other than user content),
        branding, and documentation are owned by {ENTITY} or its
        licensors and protected by intellectual property laws. Subject to
        these Terms, we grant you a limited, non-exclusive,
        non-transferable, revocable licence to use the Service for its
        intended purpose. All rights not expressly granted are reserved.
      </p>
      <p>
        You retain ownership of content you submit. You grant {ENTITY} a
        worldwide, non-exclusive, royalty-free licence to host, store,
        reproduce, and process that content solely to provide and improve
        the Service.
      </p>

      <h2>8. Payments, subscriptions, and refunds — Merchant of Record</h2>
      <p>
        <strong>
          Our order process is conducted by our online reseller
          Paddle.com. Paddle.com is the Merchant of Record for all our
          orders. Paddle provides all customer service inquiries and
          handles returns.
        </strong>
      </p>
      <p>
        Payment, billing, taxes, currency conversion, invoicing,
        cancellations, and refund mechanics are governed by Paddle's{" "}
        <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer">Buyer Terms</a>{" "}
        and our <a href="/refund">Refund Policy</a>. Subscriptions renew
        automatically at the interval shown at checkout until cancelled.
        You may cancel at any time via{" "}
        <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a>{" "}
        or by contacting us.
      </p>

      <h2>9. Service availability and modifications</h2>
      <p>
        We strive to keep the Service available but do not guarantee that
        it will be uninterrupted, timely, secure, or error-free. We may
        modify, suspend, or discontinue features at any time. Scheduled
        and emergency maintenance may occur without notice.
      </p>

      <h2>10. Suspension and termination</h2>
      <p>
        We may suspend or terminate your access to the Service for: (a)
        material breach of these Terms; (b) non-payment of fees; (c)
        suspected fraud or security risk; or (d) repeated or serious
        policy violations. You may stop using the Service at any time. On
        termination, your right to use the Service ends and we may delete
        your data after a reasonable period, subject to legal retention
        obligations.
      </p>

      <h2>11. Disclaimers</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED
        "AS IS" AND "AS AVAILABLE", AND WE DISCLAIM ALL IMPLIED
        WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, AND NON-INFRINGEMENT. CONTENT FROM THE SERVICE IS NOT
        MEDICAL ADVICE.
      </p>

      <h2>12. Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, {ENTITY.toUpperCase()} WILL NOT BE
        LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
        EXEMPLARY DAMAGES, OR FOR LOSS OF PROFITS, REVENUE, DATA, OR
        GOODWILL. OUR AGGREGATE LIABILITY ARISING OUT OF OR RELATING TO
        THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE FEES YOU PAID
        TO US IN THE TWELVE MONTHS BEFORE THE CLAIM, OR (B) USD $100.
        NOTHING IN THESE TERMS EXCLUDES OR LIMITS LIABILITY FOR FRAUD,
        DEATH, OR PERSONAL INJURY CAUSED BY OUR NEGLIGENCE, OR ANY OTHER
        LIABILITY THAT CANNOT BE EXCLUDED BY LAW.
      </p>

      <h2>13. Indemnity</h2>
      <p>
        You agree to indemnify and hold {ENTITY} harmless from claims,
        damages, and expenses (including reasonable legal fees) arising
        out of your content, your use of the Service in breach of these
        Terms, or your violation of applicable law or third-party rights.
      </p>

      <h2>14. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the State of Victoria,
        Australia, without regard to its conflict of laws rules. The
        courts of Victoria, Australia have exclusive jurisdiction over
        any dispute arising out of or relating to these Terms or the
        Service, except where mandatory consumer protection laws give
        you the right to bring proceedings in your place of residence.
      </p>

      <h2>15. Assignment</h2>
      <p>
        You may not assign these Terms without our prior written consent.
        We may assign these Terms in connection with a merger,
        acquisition, reorganisation, or sale of assets.
      </p>

      <h2>16. Force majeure</h2>
      <p>
        Neither party will be liable for failure or delay in performance
        caused by events beyond its reasonable control, including acts of
        God, war, terrorism, civil unrest, government action, labour
        disputes, internet or utility outages, or pandemic.
      </p>

      <h2>17. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes
        will be communicated by updating the "Last updated" date and,
        where appropriate, by notice in the Service. Continued use of the
        Service after changes take effect constitutes acceptance.
      </p>

      <h2>18. Contact</h2>
      <p>
        {ENTITY} — <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </main>
  );
}

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions · First Aid Angel</title>
        <meta name="description" content={`Terms and Conditions for First Aid Angel, operated by ${ENTITY}.`} />
      </Helmet>
      <CmsPageRenderer slug="terms" fallback={<TermsContent />} />
      <NetworkFooter />
    </>
  );
}
