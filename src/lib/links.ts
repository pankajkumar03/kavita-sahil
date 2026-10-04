import { invitation } from "../config/invitation";
import { coupleNames, fullAddress } from "./event";

const { event, contact } = invitation;

/** Coordinates or place from a pasted maps link (…?query=30.14,74.11), else the written address. */
const mapsQuery = (() => {
  try {
    return new URL(event.mapsUrl).searchParams.get("query");
  } catch {
    return null;
  }
})();
const destination = encodeURIComponent(mapsQuery || fullAddress);

export const mapsSearchUrl = event.mapsUrl.trim() || `https://www.google.com/maps/search/?api=1&query=${destination}`;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

export const mapEmbedUrl = `https://maps.google.com/maps?q=${destination}&z=15&output=embed`;

/** wa.me link; with no number configured WhatsApp lets the guest pick a contact. */
export function whatsappUrl(message: string) {
  const number = contact.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const defaultRsvpMessage = `Hello, I would like to confirm my presence at the engagement ceremony of ${coupleNames}.`;

export function shareUrl() {
  return invitation.site.url.trim() || window.location.href.split("#")[0];
}
