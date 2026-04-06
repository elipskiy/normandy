import {
  Star,
  ExternalLink,
  Phone,
  MapPin,
  Lightbulb,
  Clock,
  Navigation,
} from "lucide-react";

export default function StopCard({ stop }) {
  return (
    <div className="stop" data-type={stop.type}>
      <div className="stop-dot" />

      <div className="stop-head">
        {stop.time && <span className="stop-time">{stop.time}</span>}
        <span className="stop-name">{stop.name}</span>
        {stop.type === "optional" && (
          <span className="stop-optional-badge">optional</span>
        )}
      </div>

      <div className="stop-content">
        <div className="stop-text">
          {stop.place && <div className="stop-place">{stop.place}</div>}
          <div className="stop-desc">{stop.desc}</div>
        </div>
        {stop.photo && (
          <a
            href={stop.maps || stop.link || "#"}
            target={stop.maps || stop.link ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="stop-photo"
          >
            <img src={import.meta.env.BASE_URL + stop.photo} alt={stop.name} loading="lazy" />
          </a>
        )}
      </div>

      {stop.fallback && (
        <div className="stop-fallback">
          <Lightbulb size={14} />
          {stop.fallback}
        </div>
      )}

      {stop.booking && (
        <div className="stop-booking">
          <MapPin size={14} />
          {stop.booking}
        </div>
      )}

      {stop.hours && (
        <div className="stop-hours">
          <Clock size={13} />
          {stop.hours}
        </div>
      )}

      <div className="stop-tags">
        {stop.rating && (
          <span className="tag tag-rating">
            <Star size={12} /> {stop.rating}
          </span>
        )}
        {stop.link && (
          <a
            href={stop.link}
            target="_blank"
            rel="noopener noreferrer"
            className="tag tag-link"
          >
            <ExternalLink size={12} /> Сайт
          </a>
        )}
        {stop.maps && (
          <a
            href={stop.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="tag tag-maps"
          >
            <Navigation size={12} /> Карта
          </a>
        )}
        {stop.phone && (
          <a href={`tel:${stop.phone}`} className="tag tag-phone">
            <Phone size={12} /> {stop.phone}
          </a>
        )}
      </div>
    </div>
  );
}
