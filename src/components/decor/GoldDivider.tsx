import { useId } from "react";
import { C } from "./palette";

interface Props {
  variant?: "diamond" | "lotus" | "paisley";
  className?: string;
}

/** Hairline gold rule that fades at both ends, with a small centre ornament. */
export function GoldDivider({ variant = "diamond", className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 220 24" className={`gold-divider ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`l${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity={0} />
          <stop offset="1" stopColor={C.gold} />
        </linearGradient>
        <linearGradient id={`r${id}`} x1="1" x2="0">
          <stop offset="0" stopColor={C.gold} stopOpacity={0} />
          <stop offset="1" stopColor={C.gold} />
        </linearGradient>
      </defs>
      <path d="M2 12H88" stroke={`url(#l${id})`} strokeWidth={0.9} />
      <path d="M132 12H218" stroke={`url(#r${id})`} strokeWidth={0.9} />
      <circle cx={93} cy={12} r={1.3} fill={C.gold} />
      <circle cx={127} cy={12} r={1.3} fill={C.gold} />
      {variant === "diamond" && (
        <g fill="none" stroke={C.gold} strokeWidth={0.9}>
          <path d="M110 3L119 12 110 21 101 12Z" />
          <path d="M110 8L114 12 110 16 106 12Z" fill={C.gold} fillOpacity={0.35} />
        </g>
      )}
      {variant === "lotus" && (
        <g fill="none" stroke={C.gold} strokeWidth={0.9} strokeLinejoin="round">
          <path d="M110 3C114 8 114 14 110 19 106 14 106 8 110 3Z" />
          <path d="M110 19C105 17 101 13 100 8 105 10 108 14 110 19Z" />
          <path d="M110 19C115 17 119 13 120 8 115 10 112 14 110 19Z" />
          <path d="M102 21H118" />
        </g>
      )}
      {variant === "paisley" && (
        <g fill="none" stroke={C.gold} strokeWidth={0.9} strokeLinecap="round">
          <path d="M104 18C99 15 99 8 104 6 108 4 112 7 110 11 109 13 106 12 107 10" />
          <path d="M116 6C121 9 121 16 116 18 112 20 108 17 110 13 111 11 114 12 113 14" />
        </g>
      )}
    </svg>
  );
}
