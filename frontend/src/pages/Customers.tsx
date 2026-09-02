import { useEffect, useState } from "react";
import { Search, Users, UserCheck, ShieldAlert } from "lucide-react";
import { api } from "../api";
import { PageIntro, StatCard, RiskBadge, Empty } from "../components/UI";

export default function Customers(){
 const [rows,setRows]=useState<any[]>([]);const [search,setSearch]=useState("");
 useEffect(()=>{api.customers(`?search=${encodeURIComponent(search)}`).then(setRows)},[search]);
 return <><PageIntro title="Customer intelligence" description="Understand customer activity, exposure and current risk posture."/>
 <div className="stats-grid"><StatCard label="Customers" value={rows.length} icon={Users}/><StatCard label="Active" value={rows.filter(x=>x.status==="Active").length} icon={UserCheck}/><StatCard label="High risk" value={rows.filter(x=>x.riskLevel==="High").length} icon={ShieldAlert}/><StatCard label="Under review" value={rows.filter(x=>x.status==="Under Review").length}/></div>
 <div className="panel"><div className="toolbar"><div className="searchbar"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customer, email or country..."/></div></div><div className="table-wrap">{!rows.length?<Empty/>:<table><thead><tr><th>Customer</th><th>Email</th><th>Country</th><th>Transactions</th><th>Total amount</th><th>Risk</th><th>Status</th></tr></thead><tbody>{rows.map(x=><tr key={x.customerId}><td><strong>{x.name}</strong><small className="sub">{x.customerId}</small></td><td>{x.email}</td><td>{x.country}</td><td>{x.transactionCount}</td><td>{new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(x.totalAmount)}</td><td><RiskBadge level={x.riskLevel}/></td><td>{x.status}</td></tr>)}</tbody></table>}</div></div></>
}
