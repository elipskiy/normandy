import * as icons from "lucide-react";
import { ChevronDown, Compass, UtensilsCrossed, Fish, AlertTriangle } from "lucide-react";
import StopCard from "./StopCard";

function SectionBlock({ icon: Icon, title, className, children }) {
  return (
    <div className={`day-section ${className}`}>
      <div className="day-section-title">
        <Icon size={13} /> {title}
      </div>
      {children}
    </div>
  );
}

function FoodSection({ items }) {
  if (!items?.length) return null;
  return (
    <SectionBlock icon={UtensilsCrossed} title="Где есть" className="section-food">
      {items.map((f, i) => (
        <div key={i} className={`food-item${f.trap ? " food-trap" : ""}`}>
          <div className="food-head">
            <span className="food-name">
              {f.trap && <AlertTriangle size={13} className="food-trap-icon" />}
              {f.name}
            </span>
            <span className="food-price">{f.price}</span>
          </div>
          <div className="food-meta">{f.place} · {f.vibe}</div>
          <div className="food-desc">{f.desc}</div>
        </div>
      ))}
    </SectionBlock>
  );
}

function MarketsSection({ items }) {
  if (!items?.length) return null;
  return (
    <SectionBlock icon={Fish} title="Рынки и морепродукты" className="section-markets">
      {items.map((m, i) => {
        const MIcon = icons[m.icon] || icons.Store;
        return (
          <div key={i} className="market-item">
            <div className="market-name">
              <MIcon size={14} className="market-icon" /> {m.name}
            </div>
            <div className="market-when">{m.when}</div>
            <div className="market-desc">{m.desc}</div>
          </div>
        );
      })}
    </SectionBlock>
  );
}

function NearbySection({ items }) {
  if (!items?.length) return null;
  return (
    <SectionBlock icon={Compass} title="Рядом, если будет время" className="section-nearby">
      {items.map((n, i) => (
        <div key={i} className="nearby-item">
          <span className="nearby-item-name">{n.name}</span>
          <span className="nearby-item-desc"> — {n.desc}</span>
        </div>
      ))}
    </SectionBlock>
  );
}

export default function DayCard({ data, isOpen, toggle }) {
  const Icon = icons[data.icon] || icons.Circle;

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
          {data.stops.map((s, i) => (
            <StopCard key={i} stop={s} />
          ))}
          <FoodSection items={data.food} />
          <MarketsSection items={data.markets} />
          <NearbySection items={data.nearby} />
        </div>
      </div>
    </div>
  );
}
