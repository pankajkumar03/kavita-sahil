import { useId, useState, type FormEvent } from "react";
import { ChevronRight, MessageCircle, Send } from "lucide-react";
import { invitation } from "../config/invitation";
import { coupleNames } from "../lib/event";
import { defaultRsvpMessage, whatsappUrl } from "../lib/links";
import { FloralCorner } from "./decor";
import { SectionHeading } from "./SectionHeading";
import { ShareButton } from "./ShareButton";

type Panel = "rsvp" | "blessing" | null;

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Opens in a new tab via a real link click (window.open with noopener can't report blocking). */
const openExternal = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

function RsvpForm({ onSent }: { onSent: () => void }) {
  const id = useId();
  const [attending, setAttending] = useState<"yes" | "no">("yes");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const guests = String(data.get("guests") || "1");
    const message = String(data.get("message") || "").trim();
    const lines =
      attending === "yes"
        ? [
            `Hello, this is ${name}. I would like to confirm my presence at the engagement ceremony of ${coupleNames}.`,
            `Number of guests: ${guests}`,
          ]
        : [
            `Hello, this is ${name}. With regret, I won't be able to attend the engagement ceremony of ${coupleNames}, but my blessings are with you both.`,
          ];
    if (message) lines.push("", message);
    openExternal(whatsappUrl(lines.join("\n")));
    onSent();
  };

  return (
    <form className="invite-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor={`${id}-name`}>Your name</label>
        <input id={`${id}-name`} name="name" required autoComplete="name" placeholder="Full name" />
      </div>

      <fieldset className="field">
        <legend>Will you be joining us?</legend>
        <div className="choice-row">
          <label className={`choice ${attending === "yes" ? "is-on" : ""}`}>
            <input type="radio" name="attending" value="yes" checked={attending === "yes"} onChange={() => setAttending("yes")} />
            Joyfully attending
          </label>
          <label className={`choice ${attending === "no" ? "is-on" : ""}`}>
            <input type="radio" name="attending" value="no" checked={attending === "no"} onChange={() => setAttending("no")} />
            Regretfully unable
          </label>
        </div>
      </fieldset>

      {attending === "yes" && (
        <div className="field">
          <label htmlFor={`${id}-guests`}>Number of guests</label>
          <select id={`${id}-guests`} name="guests" defaultValue="1">
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label htmlFor={`${id}-msg`}>
          Message <span className="field__optional">(optional)</span>
        </label>
        <textarea id={`${id}-msg`} name="message" rows={3} placeholder="A few words for the families" />
      </div>

      <button type="submit" className="btn btn--primary">
        <Send aria-hidden="true" size={15} strokeWidth={1.5} />
        <span>Send RSVP on WhatsApp</span>
      </button>
    </form>
  );
}

function BlessingForm({ onSent }: { onSent: () => void }) {
  const id = useId();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const message = String(data.get("message") || "").trim();
    openExternal(whatsappUrl(`Blessings for ${coupleNames} from ${name}:\n\n${message}`));
    onSent();
  };
  return (
    <form className="invite-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor={`${id}-name`}>Your name</label>
        <input id={`${id}-name`} name="name" required autoComplete="name" placeholder="Full name" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-msg`}>Your blessings</label>
        <textarea
          id={`${id}-msg`}
          name="message"
          rows={4}
          required
          placeholder="May your new journey be blessed with joy and togetherness…"
        />
      </div>
      <button type="submit" className="btn btn--primary">
        <Send aria-hidden="true" size={15} strokeWidth={1.5} />
        <span>Send Blessings</span>
      </button>
    </form>
  );
}

export function RSVPSection() {
  const { rsvp } = invitation;
  const [panel, setPanel] = useState<Panel>(null);
  const [sent, setSent] = useState<Panel>(null);
  const useGoogleForm = rsvp.mode === "googleForm" && rsvp.googleFormUrl.trim() !== "";

  const toggle = (p: Exclude<Panel, null>) => {
    setSent(null);
    setPanel((cur) => (cur === p ? null : p));
  };

  return (
    <section id="rsvp" className="section rsvp" aria-labelledby="rsvp-title">
      <FloralCorner corner="bottom-right" className="section-floral section-floral--br" />
      <div className="container container--narrow">
        <SectionHeading
          id="rsvp-title"
          title="Your Presence Will Make It Special"
          subtitle="We would be delighted to celebrate this beautiful occasion with you."
          divider="diamond"
        />
        {rsvp.respondBy && (
          <p className="rsvp__respond" data-reveal>
            {rsvp.respondBy}
          </p>
        )}

        <div className="rsvp__buttons" data-reveal style={d(120)}>
          {useGoogleForm ? (
            <a className="btn btn--primary" href={rsvp.googleFormUrl} target="_blank" rel="noopener noreferrer">
              <span>RSVP</span>
              <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} />
            </a>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              aria-expanded={panel === "rsvp"}
              aria-controls="rsvp-panel"
              onClick={() => toggle("rsvp")}
            >
              <span>RSVP</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn--ghost"
            aria-expanded={panel === "blessing"}
            aria-controls="blessing-panel"
            onClick={() => toggle("blessing")}
          >
            <span>Send Your Blessings</span>
          </button>
        </div>

        <div id="rsvp-panel" className={`rsvp__panel ${panel === "rsvp" ? "is-open" : ""}`} hidden={panel !== "rsvp"}>
          {sent === "rsvp" ? (
            <p className="rsvp__sent">WhatsApp is opening with your reply. Just press send. Thank you!</p>
          ) : (
            <RsvpForm onSent={() => setSent("rsvp")} />
          )}
        </div>
        <div id="blessing-panel" className={`rsvp__panel ${panel === "blessing" ? "is-open" : ""}`} hidden={panel !== "blessing"}>
          {sent === "blessing" ? (
            <p className="rsvp__sent">Your blessings are on their way through WhatsApp. Dhanyavaad!</p>
          ) : (
            <BlessingForm onSent={() => setSent("blessing")} />
          )}
        </div>

        <div className="rsvp__quick" data-reveal style={d(200)}>
          <a className="quick-card" href={whatsappUrl(defaultRsvpMessage)} target="_blank" rel="noopener noreferrer">
            <span className="icon-ring icon-ring--solid" aria-hidden="true">
              <MessageCircle size={18} strokeWidth={1.4} />
            </span>
            <span>
              <strong>RSVP on WhatsApp</strong>
              <small>One tap to confirm your presence</small>
            </span>
            <ChevronRight aria-hidden="true" size={16} strokeWidth={1.4} className="quick-card__chev" />
          </a>
          <ShareButton variant="card" />
        </div>
      </div>
    </section>
  );
}
