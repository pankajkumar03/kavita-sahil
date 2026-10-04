import type { ReactNode } from "react";
import { GoldDivider } from "./decor";

interface Props {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  divider?: "diamond" | "lotus" | "paisley" | false;
  align?: "center" | "left";
}

export function SectionHeading({ id, eyebrow, title, subtitle, divider = "diamond", align = "center" }: Props) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow && (
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="section-title" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
        {title}
      </h2>
      {subtitle && (
        <p className="section-subtitle" data-reveal style={{ "--d": "180ms" } as React.CSSProperties}>
          {subtitle}
        </p>
      )}
      {divider && (
        <div data-reveal style={{ "--d": "240ms" } as React.CSSProperties}>
          <GoldDivider variant={divider} />
        </div>
      )}
    </header>
  );
}
