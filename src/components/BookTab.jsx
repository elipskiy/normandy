import { AlertTriangle, ArrowUpRight, Download } from "lucide-react";
import { CHECKLIST } from "../data/days";

export default function BookTab() {
  return (
    <>
      <div className="book-warning">
        <AlertTriangle size={18} />
        <div>
          <strong>Забронируй до поездки:</strong>
        </div>
      </div>

      <div className="book-list">
        {CHECKLIST.map((c, i) => (
          <a
            key={i}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`book-item${c.critical ? " critical" : ""}`}
          >
            <div className={`book-dot ${c.critical ? "critical" : "normal"}`} />
            <span className="book-name">{c.item}</span>
            <span className="book-arrow">
              <ArrowUpRight size={16} />
            </span>
          </a>
        ))}
      </div>

      <div className="book-tip">
        <Download size={18} />
        <div>
          <strong>Скачай перед поездкой:</strong>
          <br />
          Park4Night — все стоянки для кемперов с отзывами.
          <br />
          maps.me — офлайн карты на случай без связи.
        </div>
      </div>
    </>
  );
}
