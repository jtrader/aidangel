import { useState, type ReactNode } from "react";
import { Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import MyLocationPanel from "./MyLocationPanel";

export interface CallConfirmDialogProps {
  /** Trigger element. Rendered as the dialog opener (asChild). */
  children: ReactNode;
  /** Override the emergency number. Defaults to the detected country's number. */
  number?: string;
  /** Short context for the description, e.g. "Police · Fire · Ambulance". */
  serviceLabel?: string;
}

/**
 * Wraps an emergency-call trigger with a confirmation dialog that lets the
 * caller capture their location (coordinates + nearest address + what3words)
 * BEFORE dialing, so they can read it straight to the operator. The final
 * action is a tel: link that places the actual call.
 *
 * Mirrors the Love Key HELP Network confirm-before-dial pattern used on
 * crisis-compass.org, but reuses AidAngel's own MyLocation panel (in
 * `embedded` mode) so location capture, what3words and address lookup are
 * shared with the /my-location page.
 */
export default function CallConfirmDialog({
  children,
  number: numberOverride,
  serviceLabel,
}: CallConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const { code } = useCountry();
  const number = numberOverride ?? emergencyNumberForCountry(code);
  const telHref = `tel:${number}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Phone className="w-5 h-5" />
            Calling {number}
          </DialogTitle>
          <DialogDescription>
            {serviceLabel ? `${serviceLabel}. ` : ""}
            Confirm your location below, then tap{" "}
            <span className="font-semibold">Call {number} now</span>. Read the
            details to the operator.
          </DialogDescription>
        </DialogHeader>

        <a
          href={telHref}
          onClick={() => setOpen(false)}
          className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground font-bold text-lg py-4 px-4 shadow-md transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <Phone className="w-5 h-5" />
          Call {number} now
        </a>

        <div className="mt-4">
          <MyLocationPanel embedded />
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full rounded-md border bg-background py-2 px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </DialogContent>
    </Dialog>
  );
}
