import { useState } from "react";
import { asset } from "../lib/asset";
import { Lotus } from "./decor";

interface Props {
  src?: string;
  alt: string;
  /** Shown on the placeholder when the photo is missing, e.g. "Bride's portrait". */
  label: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/** A soft, printed-looking stand-in used whenever a photo is missing or fails to load. */
export function PhotoPlaceholder({ label, file }: { label: string; file?: string }) {
  return (
    <div className="photo-placeholder" role="img" aria-label={`${label} (photo coming soon)`}>
      <Lotus className="photo-placeholder__lotus" />
      <span className="photo-placeholder__label">{label}</span>
      {import.meta.env.DEV && file && <span className="photo-placeholder__file">{file}</span>}
    </div>
  );
}

/** <img> that fades in once loaded and falls back to a placeholder on error. */
export function SmartImage({ src, alt, label, className = "", priority = false, sizes }: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">(src ? "loading" : "error");

  if (state === "error" || !src) return <PhotoPlaceholder label={label} file={src} />;

  return (
    <img
      src={asset(src)}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setState("loaded")}
      onError={() => setState("error")}
      className={`smart-image ${state === "loaded" ? "is-loaded" : ""} ${className}`}
    />
  );
}
