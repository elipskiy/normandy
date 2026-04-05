import { useState } from "react";
import { Caravan, MapPin, Bookmark, Coins, ChefHat } from "lucide-react";
import RouteTab from "./components/RouteTab";
import BookTab from "./components/BookTab";
import BudgetTab from "./components/BudgetTab";
import { FOOD_HIGHLIGHTS } from "./data/days";

const TABS = [
  { key: "route", label: "Маршрут", Icon: MapPin },
  { key: "book", label: "Бронь", Icon: Bookmark },
  { key: "budget", label: "Бюджет", Icon: Coins },
];

export default function App() {
  const [tab, setTab] = useState("route");

  return (
    <div className="shell">
      {/* Header */}
      <header className="header">
        <div className="header-meta">
          <Caravan size={14} />5 дней &middot; 1 500 км
        </div>
        <h1>Нормандия</h1>
        <div className="header-route">
          Сидр<span>&rarr;</span>Via Ferrata<span>&rarr;</span>Мон-Сен-Мишель
          <span>&rarr;</span>Aéroplume
        </div>
        <div className="header-food">
          <ChefHat size={13} className="header-food-icon" />
          <span><strong>Пробовать:</strong> {FOOD_HIGHLIGHTS}</span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`tab-btn${tab === key ? " active" : ""}`}
            onClick={() => setTab(key)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="content">
        {tab === "route" && <RouteTab />}
        {tab === "book" && <BookTab />}
        {tab === "budget" && <BudgetTab />}
      </main>
    </div>
  );
}
