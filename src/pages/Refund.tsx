import { Helmet } from "react-helmet-async";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";
import NetworkFooter from "@/components/NetworkFooter";

const LAST_UPDATED = "29 May 2026";
const ENTITY = "Streamline Direct";
const CONTACT = "support@firstaidangel.org";

function RefundContent() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1>Refund Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <h2>30-day money-back guarantee</h2>
      <p>
        We want you to be confident in your purchase from First Aid Angel,
        operated by <strong>{ENTITY}</strong>. If you are not satisfied,
        you can request a full refund within <strong>30 days</strong> of
        your order date.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Refunds for all orders are processed by our payment provider and
        Merchant of Record, <strong>Paddle</strong>. To request a refund:
      </p>
      <ol>
        <li>
          Go to{" "}
          <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
            paddle.net
          </a>{" "}
          and look up your order using the email address you used at
          checkout, or
        </li>
        <li>
          Email us at{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a> with your order
          reference and reason for the request, and we will work with
          Paddle on your behalf.
        </li>
      </ol>

      <h2>How refunds are processed</h2>
      <p>
        Approved refunds are returned to the original payment method.
        Processing times depend on your bank or card issuer and typically
        take 5–10 business days to appear on your statement. Subscription
        renewals can be refunded under the same 30-day window from the
        renewal charge date.
      </p>

      <h2>Cancelling a subscription</h2>
      <p>
        You may cancel a subscription at any time through{" "}
        <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
          paddle.net
        </a>{" "}
        or by contacting us. Cancellation stops future renewals; you
        retain access until the end of the current paid period.
      </p>

      <h2>Contact</h2>
      <p>
        {ENTITY} — <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </main>
  );
}

export default function RefundPolicy() {
  return (
    <>
      <Helmet>
        <title>Refund Policy · First Aid Angel</title>
        <meta name="description" content={`Refund policy for First Aid Angel, operated by ${ENTITY}. 30-day money-back guarantee, refunds handled by Paddle.`} />
      </Helmet>
      <CmsPageRenderer slug="refund" fallback={<RefundContent />} />
      <NetworkFooter />
    </>
  );
}
