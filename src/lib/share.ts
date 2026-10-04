import { coupleNames } from "./event";
import { shareUrl } from "./links";

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / insecure origins
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export async function shareInvitation(): Promise<ShareResult> {
  const url = shareUrl();
  const text = `You're invited to celebrate the engagement of ${coupleNames}.`;
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: `${coupleNames} — Engagement Invitation`, text, url });
      return "shared";
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return "cancelled";
    }
  }
  return (await copyText(url)) ? "copied" : "failed";
}
