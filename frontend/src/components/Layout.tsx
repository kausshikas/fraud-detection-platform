import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, ArrowLeftRight, Users, ShieldAlert, BarChart3, Settings, LogOut, Activity } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/alerts", label: "Fraud Alerts", icon: ShieldAlert },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Layout({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const current = links.find(x => x.to === location.pathname)?.label || "FraudGuard";
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={22}/></div>
          <div><strong>FraudGuard</strong><span>Risk Intelligence</span></div>
        </div>
        <div className="side-label">MONITORING</div>
        <nav>{links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to==="/"} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
        <div className="sidebar-bottom">
          <div className="system-mini"><span className="pulse"></span><div><strong>System Operational</strong><small>All services healthy</small></div></div>
          <button className="logout-btn" onClick={onLogout}><LogOut size={17}/> Sign out</button>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div><span className="eyebrow">FINANCIAL SECURITY</span><h1>{current}</h1></div>
          <div className="top-status"><Activity size={16}/> Live monitoring <span className="pulse"></span></div>
        </header>
        <section className="content"><Outlet /></section>
      </main>
    </div>
  );
}
