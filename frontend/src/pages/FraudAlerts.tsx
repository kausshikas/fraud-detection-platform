import { useEffect, useState } from "react";
import { api } from "../api";

export default function FraudAlerts() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.alerts();
        setRows(data);
      } catch (error) {
        console.error("Error fetching fraud alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div>
      <h1>Fraud Alerts</h1>
      <p>Total alerts: {rows.length}</p>
    </div>
  );
}
