import { ReactNode } from "react";
import {
  Search,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        {Icon && <Icon size={18} />}
      </div>

      <div className="stat-value">{value}</div>

      {note && <div className="stat-note">{note}</div>}
    </div>
  );
}

export function PageIntro({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="searchbar">
      <Search size={17} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function RiskBadge({
  level,
}: {
  level?: string | null;
}) {
  const safeLevel =
    typeof level === "string" && level.trim()
      ? level.trim()
      : "Unknown";

  const riskClass = safeLevel.toLowerCase();

  return (
    <span className={`badge risk-${riskClass}`}>
      {safeLevel}
    </span>
  );
}

export function Empty({
  children = "No records found.",
}: {
  children?: ReactNode;
}) {
  return <div className="empty">{children}</div>;
}

export function money(n: number | string | null | undefined) {
  const amount = Number(n ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}