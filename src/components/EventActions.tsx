import { useEffect, useId, useRef, useState } from "react";
import { CalendarPlus, ChevronDown, Download, ExternalLink } from "lucide-react";
import { downloadIcs, googleCalendarUrl } from "../lib/calendar";
import { useToast } from "./Toast";

/** Add to calendar: Google Calendar link or a downloadable .ics file. */
export function EventActions() {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const gcal = googleCalendarUrl();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onIcs = () => {
    setOpen(false);
    if (downloadIcs()) toast("Calendar file downloaded");
    else toast("Sorry, the calendar file couldn't be created");
  };

  return (
    <div className="event-actions">
      <div className="calendar-menu" ref={wrapRef}>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={(e) => {
            // Open upward if the menu (~120px) wouldn't fit below the button
            const r = e.currentTarget.getBoundingClientRect();
            setUp(window.innerHeight - r.bottom < 140);
            setOpen((o) => !o);
          }}
        >
          <CalendarPlus aria-hidden="true" size={16} strokeWidth={1.5} />
          <span>Add to Calendar</span>
          <ChevronDown aria-hidden="true" size={14} strokeWidth={1.5} className={`chev ${open ? "is-open" : ""}`} />
        </button>
        <div id={menuId} role="menu" className={`calendar-menu__list ${open ? "is-open" : ""} ${up ? "is-up" : ""}`} hidden={!open}>
          {gcal && (
            <a role="menuitem" href={gcal} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <ExternalLink aria-hidden="true" size={15} strokeWidth={1.4} />
              Google Calendar
            </a>
          )}
          <button role="menuitem" type="button" onClick={onIcs}>
            <Download aria-hidden="true" size={15} strokeWidth={1.4} />
            Apple / Outlook (.ics)
          </button>
        </div>
      </div>
    </div>
  );
}
