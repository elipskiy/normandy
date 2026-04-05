import * as icons from "lucide-react";
import { BUDGET } from "../data/days";

export default function BudgetTab() {
  return (
    <>
      <div className="budget-table">
        {BUDGET.map((b, i) => {
          const Icon = icons[b.icon] || icons.Circle;
          return (
            <div key={i} className="budget-row">
              <span className="budget-row-name">
                <Icon size={15} /> {b.item}
              </span>
              <span className="budget-row-cost">{b.cost}</span>
            </div>
          );
        })}
      </div>

      <div className="budget-total">
        <span className="budget-total-label">Итого на человека</span>
        <span className="budget-total-value">~€340</span>
      </div>

      <div className="budget-note">без еды в ресторанах и аренды кемпера</div>
    </>
  );
}
