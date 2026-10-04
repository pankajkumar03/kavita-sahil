import { ChevronRight, Share2 } from "lucide-react";
import { shareInvitation } from "../lib/share";
import { useToast } from "./Toast";

/** Web Share API on phones; copies the link elsewhere. */
export function ShareButton({ variant = "icon" }: { variant?: "icon" | "card" }) {
  const toast = useToast();

  const onShare = async () => {
    const result = await shareInvitation();
    if (result === "copied") toast("Invitation link copied!");
    else if (result === "failed") toast("Couldn't copy the link. Please copy it from the address bar.");
  };

  if (variant === "card") {
    return (
      <button type="button" className="quick-card" onClick={onShare}>
        <span className="icon-ring" aria-hidden="true">
          <Share2 size={17} strokeWidth={1.4} />
        </span>
        <span>
          <strong>Share Invitation</strong>
          <small>Send this invitation to your loved ones</small>
        </span>
        <ChevronRight aria-hidden="true" size={16} strokeWidth={1.4} className="quick-card__chev" />
      </button>
    );
  }

  return (
    <button type="button" className="float-btn" onClick={onShare} aria-label="Share this invitation">
      <Share2 size={17} strokeWidth={1.4} aria-hidden="true" />
    </button>
  );
}
