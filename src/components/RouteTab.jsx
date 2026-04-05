import { useState } from "react";
import { MapPin, UtensilsCrossed, Fish, Compass } from "lucide-react";
import { DAYS } from "../data/days";
import DayCard from "./DayCard";

export default function RouteTab() {
  const [openDays, setOpenDays] = useState({ 1: true });

  const toggle = (i) =>
    setOpenDays((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="days">
      {DAYS.map((d, i) => (
        <DayCard
          key={i}
          data={d}
          isOpen={!!openDays[i]}
          toggle={() => toggle(i)}
        />
      ))}

      <div className="legend">
        <div className="legend-title">Легенда</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "var(--amber)" }} />
            Основная точка
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "var(--border)" }} />
            Optional — заедь если есть время
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "var(--violet)" }} />
            Ночёвка
          </div>
          <div className="legend-item">
            <MapPin size={13} />
            <span style={{ color: "var(--red)", fontWeight: 500 }}>Нужна бронь</span>
          </div>
          <div className="legend-item">
            <UtensilsCrossed size={13} /> Еда
          </div>
          <div className="legend-item">
            <Fish size={13} /> Рынки
          </div>
          <div className="legend-item">
            <Compass size={13} /> Рядом
          </div>
        </div>
      </div>
    </div>
  );
}
