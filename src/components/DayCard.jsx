import * as icons from "lucide-react";
import { ChevronDown, Compass, MapPinned, Camera, Navigation, Sun } from "lucide-react";
import StopCard from "./StopCard";
import { buildDayRouteUrl } from "../utils/maps";

function NearbySection({ items }) {
  if (!items?.length) return null;
  return (
    <div className="day-section section-nearby">
      <div className="day-section-title">
        <Compass size={13} /> Рядом, если будет время
      </div>
      {items.map((n, i) => (
        <div key={i} className={`nearby-item${n.type === "photo" ? " nearby-photo" : ""}`}>
          <div className="nearby-item-head">
            {n.type === "photo" && <Camera size={13} className="nearby-photo-icon" />}
            <span className="nearby-item-name">{n.name}</span>
            {n.maps && (
              <a href={n.maps} target="_blank" rel="noopener noreferrer" className="nearby-maps-link">
                <Navigation size={11} />
              </a>
            )}
          </div>
          <div className="nearby-item-desc">{n.desc}</div>
          {n.light && <div className="nearby-light"><Sun size={11} /> {n.light}</div>}
        </div>
      ))}
    </div>
  );
}

export default function DayCard({ data, isOpen, toggle }) {
  const Icon = icons[data.icon] || icons.Circle;
  const routeUrl = buildDayRouteUrl(data.stops);

  return (
    <div className={`day-card${isOpen ? " open" : ""}`}>
      <button className="day-header" onClick={toggle}>
        <div className="day-icon" style={{ background: data.bg, color: data.color }}>
          <Icon size={20} />
        </div>
        <div className="day-info">
          <div className="day-title-row">
            <span className="day-name" style={{ color: data.color }}>
              {data.day}
            </span>
            <span
              className="day-label"
              style={{ background: data.bg, color: data.color }}
            >
              {data.label}
            </span>
          </div>
          <div className="day-summary">{data.summary}</div>
        </div>
        <span className="day-chevron">
          <ChevronDown size={18} />
        </span>
      </button>

      <div className="day-body">
        <div className="day-body-inner">
          {routeUrl && (
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="day-route-btn"
            >
              <MapPinned size={15} />
              Маршрут дня в Google Maps
            </a>
          )}

          {data.stops.map((s, i) => (
            <StopCard key={i} stop={s} />
          ))}
          <NearbySection items={data.nearby} />
        </div>
      </div>
    </div>
  );
}
