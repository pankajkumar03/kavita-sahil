import { useEffect, useRef, useState } from "react";
import { invitation } from "../config/invitation";
import { Lightbox } from "./Lightbox";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "./SmartImage";

/** Editorial rhythm for the masonry — repeats for any number of photos. */
const SHAPES = ["tall", "square", "wide", "square", "tall", "wide", "square", "tall", "wide"] as const;

export function Gallery() {
  const images = invitation.gallery.slice(0, 12);
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Track which slide is in view for the mobile dots
  useEffect(() => {
    const list = listRef.current;
    if (!list || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { root: list, threshold: 0.6 },
    );
    list.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  if (!images.length) return null;

  const scrollTo = (i: number) => {
    const li = listRef.current?.children[i] as HTMLElement | undefined;
    li?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title">
      <div className="container container--wide">
        <SectionHeading id="gallery-title" title="Moments Before the Celebration" divider="diamond" />

        <ul ref={listRef} className="gallery__list" aria-label="Photo gallery">
          {images.map((img, i) => (
            <li
              key={img.src + i}
              data-index={i}
              className={`gallery__item gallery__item--${SHAPES[i % SHAPES.length]}`}
              data-reveal
              style={{ "--d": `${(i % 3) * 100}ms` } as React.CSSProperties}
            >
              <button type="button" className="gallery__button" onClick={() => setOpen(i)} aria-label={`Open photo: ${img.alt}`}>
                <SmartImage src={img.src} alt={img.alt} label={`Photo ${i + 1}`} sizes="(min-width: 768px) 33vw, 78vw" />
              </button>
            </li>
          ))}
        </ul>

        <div className="gallery__dots" aria-hidden="true">
          {images.map((_, i) => (
            <button key={i} type="button" tabIndex={-1} className={i === active ? "is-active" : ""} onClick={() => scrollTo(i)} />
          ))}
        </div>
        <p className="gallery__hint">Swipe to see more · tap a photo to enlarge</p>
      </div>

      {open !== null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
