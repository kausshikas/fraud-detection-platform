import { FormEvent, useState } from "react";
import { ShieldCheck, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { api } from "../api";

export default function Login({onLogin}:{onLogin:()=>void}) {
  const [email,setEmail]=useState("admin@fraudguard.local");
  const [password,setPassword]=useState("Admin@123");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError("");try{const data=await api.login(email,password);localStorage.setItem("fraudguard_token",data.token);localStorage.setItem("fraudguard_user",JSON.stringify(data.user));onLogin()}catch(err:any){setError(err.message)}finally{setLoading(false)}}
  return <div className="login-page"><div className="login-visual"><div className="login-glow"></div><div className="brand big"><div className="brand-mark"><ShieldCheck size={28}/></div><div><strong>FraudGuard</strong><span>Risk Intelligence Platform</span></div></div><div className="visual-copy"><div className="eyebrow">SECURE • ANALYZE • RESPOND</div><h1>Financial security,<br/><em>made intelligent.</em></h1><p>Monitor transactions, surface suspicious behaviour and give investigators the context they need to act.</p></div><div className="visual-foot">Academic demonstration platform • Rule-based fraud scoring</div></div><div className="login-panel"><div className="login-card"><div className="mobile-brand"><ShieldCheck size={24}/> FraudGuard</div><h2>Welcome back</h2><p className="muted">Sign in to your monitoring console.</p><form onSubmit={submit}><label>Email<div className="input-wrap"><Mail size={17}/><input value={email} onChange={e=>setEmail(e.target.value)} type="email"/></div></label><label>Password<div className="input-wrap"><LockKeyhole size={17}/><input value={password} onChange={e=>setPassword(e.target.value)} type="password"/></div></label>{error&&<div className="error">{error}</div>}<button className="primary full" disabled={loading}>{loading?"Signing in...":"Sign in"}<ArrowRight size={17}/></button></form><div className="demo-hint"><strong>Demo credentials</strong><span>admin@fraudguard.local</span><span>Admin@123</span></div></div></div></div>
}
