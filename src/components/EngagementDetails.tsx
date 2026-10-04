import { invitation } from "../config/invitation";
import { cityLine, getDateParts, getDisplayTime } from "../lib/event";
import { DecorativeBorder, FloralCorner } from "./decor";
import { EventActions } from "./EventActions";
import { SectionHeading } from "./SectionHeading";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/** The one place the date, time and venue are spelled out in full. */
export function EngagementDetails() {
  const { event } = invitation;
  const date = getDateParts();

  return (
    <section id="details" className="section ceremony" aria-labelledby="ceremony-title">
      <div className="container container--narrow">
        <SectionHeading
          id="ceremony-title"
          title={
            <>
              The Engagement <em>Ceremony</em>
            </>
          }
          subtitle="A celebration of tradition, family & togetherness"
          divider="lotus"
        />

        <div data-reveal style={d(100)}>
          <DecorativeBorder className="date-card">
            <FloralCorner corner="top-left" className="date-card__floral" />
            <FloralCorner corner="bottom-right" className="date-card__floral" />
            <div className="date-card__date">
              <span className="date-card__weekday">{date.weekday}</span>
              <span className="date-card__rule" aria-hidden="true" />
              <span className="date-card__day" aria-hidden="true">
                {date.dayNumber}
              </span>
              <span className="date-card__rule" aria-hidden="true" />
              <span className="date-card__month" aria-hidden="true">
                {date.month}
              </span>
              <span className="date-card__year" aria-hidden="true">
                {date.year}
              </span>
              <span className="sr-only">{date.long}</span>
            </div>
            <span className="date-card__divider" aria-hidden="true" />
            <div className="date-card__place">
              <span className="date-card__time">{getDisplayTime()}</span>
              <span className="date-card__onwards">onwards</span>
              <span className="date-card__venue">{event.venue}</span>
              {event.address && <span className="date-card__address">{event.address}</span>}
              <span className="date-card__city">{cityLine}</span>
            </div>
          </DecorativeBorder>
        </div>

        <div className="ceremony__actions" data-reveal style={d(200)}>
          <EventActions />
        </div>
      </div>
    </section>
  );
}
