import { invitation } from "../config/invitation";
import { coupleNames, fullAddress, getEventEnd, getEventStart } from "./event";

const title = () => `${invitation.event.title} — ${coupleNames}`;

/** 20261118T133000Z */
const toUtcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(): string | null {
  const start = getEventStart();
  const end = getEventEnd();
  if (!start || !end) return null;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title(),
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: invitation.event.description,
    location: fullAddress,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const escapeIcs = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Builds and downloads an .ics file. Returns false if the date is invalid. */
export function downloadIcs(): boolean {
  const start = getEventStart();
  const end = getEventEnd();
  if (!start || !end) return false;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Engagement Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${toUtcStamp(start)}-engagement@invitation`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeIcs(title())}`,
    `DESCRIPTION:${escapeIcs(invitation.event.description)}`,
    `LOCATION:${escapeIcs(fullAddress)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(title())}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  try {
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engagement-ceremony.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}
