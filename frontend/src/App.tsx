import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Customers from "./pages/Customers";
import FraudAlerts from "./pages/FraudAlerts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function App() {
  const [auth, setAuth] = useState(Boolean(localStorage.getItem("fraudguard_token")));
  useEffect(() => {
    const onStorage = () => setAuth(Boolean(localStorage.getItem("fraudguard_token")));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!auth) return <Routes><Route path="*" element={<Login onLogin={() => setAuth(true)} />} /></Routes>;

  return (
    <Routes>
      <Route element={<Layout onLogout={() => { localStorage.removeItem("fraudguard_token"); setAuth(false); }} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/alerts" element={<FraudAlerts />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
