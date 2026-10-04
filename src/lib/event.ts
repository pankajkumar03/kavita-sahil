import { invitation } from "../config/invitation";

const { event, bride, groom } = invitation;

export const coupleNames = `${bride.name} & ${groom.name}`;

/** Event start as an absolute instant (respects the venue's timezone offset). */
export function getEventStart(): Date | null {
  const d = new Date(`${event.date}T${event.time}:00${event.timezoneOffset}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getEventEnd(): Date | null {
  const start = getEventStart();
  return start ? new Date(start.getTime() + event.durationHours * 3_600_000) : null;
}

/** Date parts as written on the invitation — always in the venue's local calendar. */
export function getDateParts() {
  const [y, m, d] = event.date.split("-").map(Number);
  const local = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(local);
  return {
    day: String(d || "").padStart(2, "0"),
    dayNumber: String(d || ""),
    weekday: fmt({ weekday: "long" }),
    month: fmt({ month: "long" }),
    monthShort: fmt({ month: "short" }),
    year: String(y || ""),
    long: fmt({ day: "numeric", month: "long", year: "numeric" }),
  };
}

/** "07:00 PM" from "19:00" — no timezone conversion, it is the time printed on the card. */
export function getDisplayTime() {
  const [h, min] = event.time.split(":").map(Number);
  if (Number.isNaN(h)) return event.time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(min || 0).padStart(2, "0")} ${suffix}`;
}

/** "Fazilka, Punjab – 152123" (PIN code only when set) */
export const cityLine = [event.city, event.pincode].filter(Boolean).join(" – ");

export const fullAddress = [event.venue, event.address, event.city, event.pincode].filter(Boolean).join(", ");
