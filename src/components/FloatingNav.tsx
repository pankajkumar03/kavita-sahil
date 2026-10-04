import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { invitation } from "../config/invitation";
import { Lotus } from "./decor";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "families", label: "Families" },
  { id: "details", label: "Details" },
  { id: "gallery", label: "Gallery" },
  { id: "venue", label: "Venue" },
].filter((s) => s.id !== "gallery" || invitation.gallery.length > 0);

/** A quiet dot rail on desktop, a single lotus button on mobile. No navbar. */
export function FloatingNav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className="float-nav" aria-label="Invitation sections">
      <ul className="dot-rail">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className={active === s.id ? "is-active" : ""} aria-current={active === s.id ? "true" : undefined}>
              <span className="dot-rail__label">{s.label}</span>
              <span className="dot-rail__dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <div className="mini-nav">
        <button
          type="button"
          className="float-btn mini-nav__toggle"
          aria-expanded={open}
          aria-controls="mini-nav-list"
          aria-label={open ? "Close sections menu" : "Open sections menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} strokeWidth={1.4} aria-hidden="true" /> : <Lotus className="mini-nav__lotus" />}
        </button>
        <ul id="mini-nav-list" className={`mini-nav__list ${open ? "is-open" : ""}`} hidden={!open}>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.id ? "is-active" : ""} onClick={() => setOpen(false)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
