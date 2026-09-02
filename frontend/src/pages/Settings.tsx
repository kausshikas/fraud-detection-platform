import { useEffect, useState } from "react";
import { ShieldCheck, Database, Cpu, BellRing } from "lucide-react";
import { PageIntro } from "../components/UI";

export default function Settings(){
 const [health,setHealth]=useState<any>(null);
 useEffect(()=>{fetch("http://localhost:5000/api/health").then(r=>r.json()).then(setHealth).catch(()=>setHealth({status:"offline"}))},[]);
 return <><PageIntro title="Platform settings" description="Review system configuration and monitoring controls."/>
 <div className="settings-grid"><Setting icon={ShieldCheck} title="Fraud monitoring" text="Continuous transaction scoring is enabled." value="Enabled"/><Setting icon={BellRing} title="Alert generation" text="Medium and high-risk transactions create alerts." value="Enabled"/><Setting icon={Cpu} title="Detection engine" text="Explainable rule-based scoring engine." value="Active"/><Setting icon={Database} title="MongoDB" text="Primary operational transaction store." value={health?.status==="ok"?"Connected":"Offline"}/></div>
 <div className="panel"><div className="eyebrow">DEMO CONFIGURATION</div><h3>Risk thresholds</h3><div className="thresholds"><div><span>Low</span><strong>0–39</strong></div><div><span>Medium</span><strong>40–69</strong></div><div><span>High</span><strong>70–100</strong></div></div><p className="muted">These thresholds are configurable in the backend fraud scoring engine for academic demonstration.</p></div></>
}
function Setting({icon:Icon,title,text,value}:{icon:any;title:string;text:string;value:string}){return <div className="setting-card"><div className="setting-icon"><Icon size={19}/></div><div><h3>{title}</h3><p>{text}</p></div><span className="enabled">{value}</span></div>}
