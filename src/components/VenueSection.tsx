import { useState } from "react";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { invitation } from "../config/invitation";
import { cityLine } from "../lib/event";
import { directionsUrl, mapEmbedUrl, mapsSearchUrl } from "../lib/links";
import { C } from "./decor/palette";
import { FloralCorner, Lotus } from "./decor";
import { SectionHeading } from "./SectionHeading";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** Hand-drawn style map used until a real address is configured (or if the live map fails). */
function IllustratedMap() {
  return (
    <svg viewBox="0 0 400 260" className="venue-map__art" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="260" fill={C.white} />
      <path d="M-10 190C60 170 110 200 170 182S290 140 410 160" fill="none" stroke={C.blush} strokeWidth={18} />
      <g fill="none" stroke={C.goldSoft} strokeOpacity={0.55}>
        <path d="M0 60H400M0 120H400M0 225H400M70 0V260M150 0V260M260 0V260M340 0V260" strokeWidth={6} stroke={C.ivory} strokeOpacity={1} />
        <path d="M0 60H400M0 120H400M0 225H400M70 0V260M150 0V260M260 0V260M340 0V260" strokeWidth={0.7} />
        <path d="M0 10L400 250" strokeWidth={9} stroke={C.ivory} strokeOpacity={1} />
        <path d="M0 10L400 250" strokeWidth={0.8} />
      </g>
      <g fill={C.sage} fillOpacity={0.12}>
        <rect x="80" y="70" width="60" height="40" rx="3" />
        <rect x="270" y="130" width="60" height="40" rx="3" />
        <circle cx="300" cy="80" r="22" />
      </g>
      <g transform="translate(205 118)">
        <circle r="26" fill={C.maroon} fillOpacity={0.08} />
        <path d="M0 6C-9-4-12-10-12-15A12 12 0 0 1 12-15C12-10 9-4 0 6Z" fill={C.maroon} />
        <circle cy="-15" r="4.2" fill={C.ivory} />
      </g>
    </svg>
  );
}

export function VenueSection() {
  const { event } = invitation;
  const [mapFailed, setMapFailed] = useState(false);
  // Google's embedded map won't load inside a local file (the shareable HTML), so show the drawn card there
  const live = event.showLiveMap && !mapFailed && window.location.protocol.startsWith("http");

  return (
    <section id="venue" className="section venue" aria-labelledby="venue-title">
      <FloralCorner corner="top-left" className="section-floral section-floral--tl" />
      <div className="container">
        <div className="venue__layout">
          <div className="venue__info">
            <SectionHeading id="venue-title" eyebrow="Where we gather" title="The Celebration" divider={false} align="left" />
            <address className="venue__address" data-reveal style={d(120)}>
              <Lotus className="venue__lotus" />
              <strong>{event.venue}</strong>
              <span>{event.address}</span>
              <span>{cityLine}</span>
            </address>
            <div className="venue__actions" data-reveal style={d(220)}>
              <a className="btn btn--ghost btn--sm" href={mapsSearchUrl} target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden="true" size={16} strokeWidth={1.5} />
                <span>View Location</span>
              </a>
              <a className="btn btn--ghost btn--sm" href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation aria-hidden="true" size={15} strokeWidth={1.5} />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          <div className="venue-map" data-reveal style={d(160)}>
            {live ? (
              <iframe
                title={`Map showing ${event.venue}`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={() => setMapFailed(true)}
              />
            ) : (
              <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="venue-map__link" aria-label={`Open ${event.venue} in Google Maps`}>
                <IllustratedMap />
                <span className="venue-map__chip">
                  Open in Google Maps
                  <ExternalLink aria-hidden="true" size={13} strokeWidth={1.5} />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
