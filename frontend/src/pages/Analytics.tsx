import { useEffect, useState } from "react";
import { BarChart3, IndianRupee, Target, Globe2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { api } from "../api";
import { PageIntro, StatCard, RiskBadge } from "../components/UI";

export default function Analytics(){
 const [d,setD]=useState<any>();useEffect(()=>{api.analytics().then(setD)},[]);
 if(!d)return <div className="loading">Building analytics...</div>;
 const risk=d.byRisk.map((x:any)=>({name:x._id,value:x.count}));const colors=["#22c55e","#f59e0b","#ef4444"];
 return <><PageIntro title="Risk analytics" description="Explore fraud patterns across countries, payment methods and risk levels."/>
 <div className="stats-grid"><StatCard label="Processed volume" value={new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(d.totals.amount)} icon={IndianRupee}/><StatCard label="Average transaction" value={new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(d.totals.avg)}/><StatCard label="Transactions" value={d.totals.count} icon={BarChart3}/><StatCard label="Detection model" value="Rule engine" note="Explainable scoring" icon={Target}/></div>
 <div className="grid-2"><div className="panel chart-panel"><div className="panel-head"><div><h3>Fraud by country</h3><p>Transactions vs medium/high-risk cases</p></div><Globe2 size={18}/></div><ResponsiveContainer width="100%" height={310}><BarChart data={d.byCountry}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="_id"/><YAxis/><Tooltip/><Bar dataKey="transactions" name="Transactions" fill="#94a3b8" radius={[5,5,0,0]}/><Bar dataKey="fraud" name="Risk cases" fill="#ef4444" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div>
 <div className="panel"><div className="panel-head"><div><h3>Risk mix</h3><p>Current transaction distribution</p></div></div><div className="pie-wrap"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={risk} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={68} outerRadius={96} paddingAngle={4}>{risk.map((_:any,i:number)=><Cell key={i} fill={colors[i%3]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="pie-legend">{risk.map((x:any,i:number)=><div key={x.name}><span><i className="dot" style={{background:colors[i%3]}}></i>{x.name}</span><strong>{x.value}</strong></div>)}</div></div></div></div>
 <div className="panel"><div className="panel-head"><div><h3>Payment method distribution</h3><p>Where monitored activity is coming from</p></div></div><div className="method-grid">{d.byMethod.map((x:any)=><div className="method-card" key={x._id}><span>{x._id}</span><strong>{x.count}</strong><small>transactions</small></div>)}</div></div>
 </>;
}
