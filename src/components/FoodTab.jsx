import usePersistedState from "../hooks/usePersistedState";
import * as icons from "lucide-react";
import {
  ChevronDown,
  UtensilsCrossed,
  Fish,
  AlertTriangle,
  Store,
  Navigation,
  Star,
} from "lucide-react";
import { DAYS, DISHES } from "../data/days";

function FoodDayCard({ data, isOpen, toggle }) {
  const Icon = icons[data.icon] || icons.Circle;
  const hasFood = data.food?.length > 0;
  const hasMarkets = data.markets?.length > 0;
  if (!hasFood && !hasMarkets) return null;

  return (
    <div className={`day-card${isOpen ? " open" : ""}`}>
      <button className="day-header" onClick={toggle}>
        <div
          className="day-icon"
          style={{ background: data.bg, color: data.color }}
        >
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
          <div className="day-summary">
            {[
              hasFood && `${data.food.length} рестор.`,
              hasMarkets && `${data.markets.length} рынк.`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>
        <span className="day-chevron">
          <ChevronDown size={18} />
        </span>
      </button>

      <div className="day-body">
        <div className="day-body-inner">
          {data.foodTip && (
            <div className="food-tip-block">
              {data.foodTip}
            </div>
          )}
          {hasFood && (
            <div className="day-section section-food">
              <div className="day-section-title">
                <UtensilsCrossed size={13} /> Где есть
              </div>
              {data.food.map((f, i) => (
                <div
                  key={i}
                  className={`food-item${f.trap ? " food-trap" : ""}`}
                >
                  <div className="food-head">
                    <span className="food-name">
                      {f.trap && (
                        <AlertTriangle size={13} className="food-trap-icon" />
                      )}
                      {f.name}
                    </span>
                    <span className="food-price">{f.price}</span>
                  </div>
                  <div className="food-meta">
                    {f.place} · {f.vibe}
                  </div>
                  <div className="food-desc">{f.desc}</div>
                  {(f.rating || f.maps) && (
                    <div className="stop-tags" style={{ marginTop: 6 }}>
                      {f.rating && (
                        <span className="tag tag-rating">
                          <Star size={12} /> {f.rating}
                        </span>
                      )}
                      {f.maps && (
                        <a href={f.maps} target="_blank" rel="noopener noreferrer" className="tag tag-maps">
                          <Navigation size={12} /> Карта
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasMarkets && (
            <div className="day-section section-markets">
              <div className="day-section-title">
                <Fish size={13} /> Рынки и морепродукты
              </div>
              {data.markets.map((m, i) => {
                const MIcon = icons[m.icon] || Store;
                return (
                  <div key={i} className="market-item">
                    <div className="market-name">
                      <MIcon size={14} className="market-icon" /> {m.name}
                    </div>
                    <div className="market-when">{m.when}</div>
                    <div className="market-desc">{m.desc}</div>
                    {(m.rating || m.maps) && (
                      <div className="stop-tags" style={{ marginTop: 6 }}>
                        {m.rating && (
                          <span className="tag tag-rating">
                            <Star size={12} /> {m.rating}
                          </span>
                        )}
                        {m.maps && (
                          <a href={m.maps} target="_blank" rel="noopener noreferrer" className="tag tag-maps">
                            <Navigation size={12} /> Карта
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FoodTab() {
  const daysWithFood = DAYS.filter(
    (d) => d.food?.length > 0 || d.markets?.length > 0
  );
  const [openDays, setOpenDays] = usePersistedState("normandy:food-days", () => {
    const init = {};
    daysWithFood.forEach((_, i) => {
      init[i] = true;
    });
    return init;
  });

  const toggle = (i) => setOpenDays((prev) => ({ ...prev, [i]: !prev[i] }));

  const [showGuide, setShowGuide] = usePersistedState("normandy:food-guide", false);

  return (
    <div className="days">
      {/* Dishes guide */}
      <div className="day-card">
        <button className="day-header" onClick={() => setShowGuide((v) => !v)}>
          <div className="day-icon" style={{ background: "var(--amber-light)", color: "var(--amber-dark)" }}>
            <UtensilsCrossed size={20} />
          </div>
          <div className="day-info">
            <div className="day-title-row">
              <span className="day-name" style={{ color: "var(--amber-dark)" }}>Что пробовать</span>
            </div>
            <div className="day-summary">Гайд по нормандским блюдам — что, где и почему</div>
          </div>
          <span className="day-chevron" style={showGuide ? { transform: "rotate(180deg)" } : {}}>
            <ChevronDown size={18} />
          </span>
        </button>
        {showGuide && (
          <div style={{ padding: "0 18px 18px" }}>
            {DISHES.map((d, i) => {
              const DIcon = icons[d.icon] || icons.Circle;
              return (
                <div key={i} className="dish-guide-item">
                  <div className="dish-guide-content">
                    <div className="dish-guide-text">
                      <div className="dish-guide-head">
                        <DIcon size={16} className="dish-guide-icon" />
                        <span className="dish-guide-name">{d.name}</span>
                        <span className="dish-guide-where">{d.where}</span>
                      </div>
                      <div className="dish-guide-desc">{d.desc}</div>
                    </div>
                    {d.photo && (
                      <div className="dish-guide-photo">
                        <img src={import.meta.env.BASE_URL + d.photo} alt={d.name} loading="lazy" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {daysWithFood.map((d, i) => (
        <FoodDayCard
          key={i}
          data={d}
          isOpen={!!openDays[i]}
          toggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}
