import usePersistedState from "./hooks/usePersistedState";
import { Caravan, MapPin, Bookmark, Coins, UtensilsCrossed, Map } from "lucide-react";
import RouteTab from "./components/RouteTab";
import FoodTab from "./components/FoodTab";
import BookTab from "./components/BookTab";
import BudgetTab from "./components/BudgetTab";
import MapTab from "./components/MapTab";

const TABS = [
  { key: "route", label: "Маршрут", Icon: MapPin },
  { key: "food", label: "Еда", Icon: UtensilsCrossed },
  { key: "book", label: "Бронь", Icon: Bookmark },
  { key: "budget", label: "Бюджет", Icon: Coins },
  { key: "map", label: "Карта", Icon: Map },
];

export default function App() {
  const [tab, setTab] = usePersistedState("normandy:tab", "route");

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
        {tab === "food" && <FoodTab />}
        {tab === "book" && <BookTab />}
        {tab === "budget" && <BudgetTab />}
        {tab === "map" && <MapTab />}
      </main>
    </div>
  );
}
