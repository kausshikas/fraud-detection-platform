import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ShieldAlert,
  Users,
  Activity,
  IndianRupee,
} from "lucide-react";
import { api } from "../api";
import {
  PageIntro,
  StatCard,
  RiskBadge,
  money,
  Empty,
} from "../components/UI";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [d, setD] = useState<any>();
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .dashboard()
      .then(setD)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="error">
        {error}. Make sure the backend and MongoDB are running.
      </div>
    );
  }

  if (!d) {
    return <div className="loading">Loading security overview...</div>;
  }

  const totalRisk =
    (d.risk || []).reduce(
      (a: number, x: any) => a + x.count,
      0
    ) || 1;

  const low = Math.round(
    (((d.risk?.find((x: any) => x._id === "Low")?.count || 0) /
      totalRisk) *
      100)
  );

  const med = Math.round(
    (((d.risk?.find((x: any) => x._id === "Medium")?.count || 0) /
      totalRisk) *
      100)
  );

  const high = 100 - low - med;

  return (
    <>
      <PageIntro
        title="Security overview"
        description="Real-time visibility across transactions, customers and fraud alerts."
        action={
          <div className="live-pill">
            <span className="pulse"></span>
            LIVE MONITORING
          </div>
        }
      />

      <div className="stats-grid">
        <StatCard
          label="Total transactions"
          value={d.totalTransactions.toLocaleString()}
          note="+12.5% today"
          icon={Activity as any}
        />

        <StatCard
          label="Suspicious transactions"
          value={d.suspicious.toLocaleString()}
          note="Requires attention"
          icon={ShieldAlert as any}
        />

        <StatCard
          label="Customers monitored"
          value={d.customers.toLocaleString()}
          note="Active customer base"
          icon={Users as any}
        />

        <StatCard
          label="High-risk transactions"
          value={d.highRisk.toLocaleString()}
          note="Prioritize investigation"
          icon={IndianRupee as any}
        />
      </div>

      <div className="grid-2">
        <div className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h3>Transaction activity</h3>
              <p>Volume and suspicious activity over time</p>
            </div>
            <ArrowUpRight size={18} />
          </div>

          <div className="chart">
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={d.trend || []}>
                <defs>
                  <linearGradient
                    id="g1"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopOpacity={0.25} />
                    <stop offset="100%" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />

                <YAxis tick={{ fontSize: 11 }} />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="transactions"
                  strokeWidth={2.5}
                  fill="url(#g1)"
                  name="Transactions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Risk distribution</h3>
              <p>Current portfolio risk profile</p>
            </div>
          </div>

          <div className="risk-donut">
            <div
              className="donut"
              style={{
                background: `conic-gradient(
                  #ef4444 0 ${high}%,
                  #f59e0b ${high}% ${high + med}%,
                  #22c55e ${high + med}% 100%
                )`,
              }}
            >
              <div>
                {high}%
                <small>high risk</small>
              </div>
            </div>

            <div className="legend">
              <div>
                <i className="dot high"></i>
                High risk <strong>{high}%</strong>
              </div>

              <div>
                <i className="dot medium"></i>
                Medium risk <strong>{med}%</strong>
              </div>

              <div>
                <i className="dot low"></i>
                Low risk <strong>{low}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Recent fraud activity</h3>
            <p>
              Latest suspicious transactions generated by the engine
            </p>
          </div>
        </div>

        <RecentTransactions />
      </div>
    </>
  );
}

function RecentTransactions() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    api.transactions("?risk=High").then(setRows);
  }, []);

  if (!rows.length) {
    return <Empty>No high-risk transactions yet.</Empty>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Country</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.slice(0, 6).map((x) => (
            <tr key={x.transactionId}>
              <td className="mono">{x.transactionId}</td>
              <td>{x.customerName}</td>
              <td>{money(x.amount)}</td>
              <td>{x.country}</td>
              <td>
                <RiskBadge level={x.riskLevel} />
              </td>
              <td>{x.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}