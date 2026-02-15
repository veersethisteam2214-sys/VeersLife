import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   LIFEOS — Personal Life Management Dashboard (White Theme)
   ═══════════════════════════════════════════════════════════════════════ */

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CATEGORIES = ["Uni","Gym","Business","Personal","Other"];
const GOAL_CATEGORIES = ["Academic","Fitness","Business","Personal"];
const UNI_STATUSES = ["Not Started","In Progress","Submitted","Completed"];

const WORKOUT_PLAN = {
  1:{name:"Push + Cardio + Abs",exercises:["Bench Press","Overhead Press","Tricep Dips","Lateral Raises","30min Cardio","Ab Circuit"]},
  2:{name:"Pull + Cardio + Abs",exercises:["Deadlifts","Barbell Rows","Pull-ups","Bicep Curls","30min Cardio","Ab Circuit"]},
  3:{name:"Legs + Cardio + Abs",exercises:["Squats","Leg Press","Lunges","Calf Raises","30min Cardio","Ab Circuit"]},
  4:{name:"Push + Cardio + Abs",exercises:["Incline Press","Arnold Press","Cable Flyes","Skull Crushers","30min Cardio","Ab Circuit"]},
  5:{name:"Chest & Back + Cardio + Abs",exercises:["Flat Bench","T-Bar Row","Dumbbell Flyes","Lat Pulldown","30min Cardio","Ab Circuit"]},
  6:{name:"Arms & Shoulders + Cardio + Abs",exercises:["Barbell Curl","Hammer Curl","Shoulder Press","Face Pulls","30min Cardio","Ab Circuit"]},
  0:{name:"Lower Back + Cardio + Abs",exercises:["Hyperextensions","Good Mornings","Reverse Flyes","Superman Hold","30min Cardio","Ab Circuit"]},
};

const fmtDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const getToday = () => fmtDate(new Date());
const makeId = () => Math.random().toString(36).slice(2,10);
const ld = (k,d) => { try { const v = localStorage.getItem("lifeos_"+k); return v ? JSON.parse(v) : d; } catch { return d; } };
const sv = (k,v) => localStorage.setItem("lifeos_"+k, JSON.stringify(v));

/* ─── Color Palette ──────────────────────────────────────────────────── */
const C = {
  bg:"#f5f6fa", card:"#ffffff", border:"#e5e7ee", borderSoft:"#f0f1f6",
  text:"#1e2033", textMid:"#5c6078", textLight:"#9498b3",
  pri:"#6366f1", priSoft:"#eef0ff", priBorder:"#d0d3fc",
  grn:"#10b981", grnSoft:"#ecfdf5", grnBorder:"#a7f3d0",
  ylw:"#f59e0b", ylwSoft:"#fffbeb",
  red:"#ef4444", redSoft:"#fef2f2",
  blu:"#3b82f6", bluSoft:"#eff6ff",
  pur:"#8b5cf6", purSoft:"#f5f3ff",
};
const catClr = c => ({Uni:C.pri,Gym:C.grn,Business:C.ylw,Personal:C.pur,Other:C.blu}[c]||C.pri);
const catBg = c => ({Uni:C.priSoft,Gym:C.grnSoft,Business:C.ylwSoft,Personal:C.purSoft,Other:C.bluSoft}[c]||C.priSoft);

/* ═══════════════════════════════════════════════════════════════════════
   AUTH SCREEN — with Remember Me
   ═══════════════════════════════════════════════════════════════════════ */
function AuthScreen({ onLogin }) {
  const saved = ld("saved_login", null);
  const [email, setEmail] = useState(saved ? saved.email : "");
  const [pass, setPass] = useState(saved ? atob(saved.pass) : "");
  const [remember, setRemember] = useState(!!saved);
  const [error, setError] = useState("");
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => { if (!ld("auth_creds", null)) setIsSetup(true); }, []);

  const submit = () => {
    if (!email || !pass) return setError("Please fill in all fields");
    if (remember) sv("saved_login", { email, pass: btoa(pass) });
    else localStorage.removeItem("lifeos_saved_login");

    if (isSetup) { sv("auth_creds", { email, pass: btoa(pass) }); onLogin(); }
    else {
      const creds = ld("auth_creds", null);
      if (creds && creds.email === email && atob(creds.pass) === pass) onLogin();
      else setError("Invalid credentials");
    }
  };

  const inp = { width:"100%", padding:"12px 16px", borderRadius:12, border:`2px solid ${C.border}`, background:C.bg, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(160deg, #eef0fb 0%, #f5f6fa 40%, #f0ecfa 100%)`, fontFamily:"'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width:400, padding:44, borderRadius:24, background:"#fff", boxShadow:"0 12px 48px rgba(99,102,241,0.08), 0 2px 6px rgba(0,0,0,0.03)" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:16, color:"#fff", fontSize:22 }}>◆</div>
          <h1 style={{ color:C.text, fontSize:24, fontWeight:700, margin:0, letterSpacing:"-0.03em" }}>{isSetup?"Create Your Account":"Welcome Back"}</h1>
          <p style={{ color:C.textLight, fontSize:13, marginTop:8 }}>{isSetup?"Set up your private VeersLife dashboard":"Sign in to your dashboard"}</p>
        </div>

        {error && <div style={{ background:C.redSoft, border:"1px solid #fecaca", borderRadius:10, padding:"10px 14px", color:C.red, fontSize:13, marginBottom:14 }}>{error}</div>}

        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", color:C.textMid, fontSize:11, fontWeight:600, marginBottom:5, letterSpacing:"0.05em", textTransform:"uppercase" }}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" style={inp}
            onFocus={e=>e.target.style.borderColor=C.pri} onBlur={e=>e.target.style.borderColor=C.border} />
        </div>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", color:C.textMid, fontSize:11, fontWeight:600, marginBottom:5, letterSpacing:"0.05em", textTransform:"uppercase" }}>Password</label>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" style={inp}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            onFocus={e=>e.target.style.borderColor=C.pri} onBlur={e=>e.target.style.borderColor=C.border} />
        </div>

        <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24, cursor:"pointer", userSelect:"none" }}>
          <div onClick={()=>setRemember(!remember)} style={{ width:18, height:18, borderRadius:5, border:`2px solid ${remember?C.pri:C.border}`, background:remember?C.pri:"#fff", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s", flexShrink:0 }}>
            {remember && <span style={{ color:"#fff", fontSize:12, lineHeight:1 }}>✓</span>}
          </div>
          <span style={{ color:C.textMid, fontSize:13 }}>Remember my login</span>
        </label>

        <button onClick={submit} style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 14px rgba(99,102,241,0.25)", fontFamily:"inherit" }}>
          {isSetup?"Create Account":"Sign In"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */
const Card = ({children, style={}}) => <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:22, boxShadow:"0 1px 4px rgba(0,0,0,0.02)", ...style }}>{children}</div>;

const Badge = ({children, color=C.pri}) => {
  const bg = {[C.pri]:C.priSoft,[C.grn]:C.grnSoft,[C.ylw]:C.ylwSoft,[C.red]:C.redSoft,[C.blu]:C.bluSoft,[C.pur]:C.purSoft}[color]||`${color}18`;
  return <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:7, background:bg, color, fontSize:11, fontWeight:600 }}>{children}</span>;
};

const Bar = ({pct, color=C.pri, h=6}) => (
  <div style={{ width:"100%", height:h, borderRadius:h, background:C.borderSoft, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", borderRadius:h, background:color, transition:"width 0.4s" }} />
  </div>
);

const Btn = ({children, onClick, primary, small, style={}}) => (
  <button onClick={onClick} style={{ padding:small?"6px 13px":"10px 18px", borderRadius:10, border:primary?"none":`1px solid ${C.border}`, background:primary?"linear-gradient(135deg,#6366f1,#8b5cf6)":C.card, color:primary?"#fff":C.text, fontSize:small?12:13, fontWeight:600, cursor:"pointer", boxShadow:primary?"0 2px 8px rgba(99,102,241,0.18)":"none", fontFamily:"inherit", ...style }}>{children}</button>
);

const Modal = ({open, onClose, title, children}) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(30,32,51,0.18)", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:420, maxHeight:"85vh", overflow:"auto", background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:30, boxShadow:"0 20px 60px rgba(0,0,0,0.08)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ color:C.text, fontSize:17, fontWeight:700, margin:0 }}>{title}</h3>
          <span onClick={onClose} style={{ cursor:"pointer", color:C.textLight, fontSize:18 }}>✕</span>
        </div>
        {children}
      </div>
    </div>
  );
};

const Inp = ({label, value, onChange, type="text", placeholder="", style={}}) => (
  <div style={{ marginBottom:13, ...style }}>
    {label && <label style={{ display:"block", color:C.textMid, fontSize:11, fontWeight:600, marginBottom:5, letterSpacing:"0.04em", textTransform:"uppercase" }}>{label}</label>}
    <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder}
      style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.15s" }}
      onFocus={e=>e.target.style.borderColor=C.pri} onBlur={e=>e.target.style.borderColor=C.border} />
  </div>
);

const Sel = ({label, value, onChange, options}) => (
  <div style={{ marginBottom:13 }}>
    {label && <label style={{ display:"block", color:C.textMid, fontSize:11, fontWeight:600, marginBottom:5, letterSpacing:"0.04em", textTransform:"uppercase" }}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, outline:"none", fontFamily:"inherit" }}>
      {options.map(o=><option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value}>{typeof o==="string"?o:o.label}</option>)}
    </select>
  </div>
);

const TxtArea = ({label, value, onChange, placeholder="", rows=3}) => (
  <div style={{ marginBottom:13 }}>
    {label && <label style={{ display:"block", color:C.textMid, fontSize:11, fontWeight:600, marginBottom:5, letterSpacing:"0.04em", textTransform:"uppercase" }}>{label}</label>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"inherit" }} />
  </div>
);

const SectionTitle = ({children, right}) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
    <h2 style={{ color:C.text, fontSize:22, fontWeight:700, margin:0, letterSpacing:"-0.02em" }}>{children}</h2>
    {right}
  </div>
);

const Empty = ({text}) => <Card><p style={{ color:C.textLight, fontSize:13, textAlign:"center", padding:36 }}>{text}</p></Card>;

/* ═══════════════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════════════ */
function Dashboard({tasks, goals, weights, workouts}) {
  const t = getToday(), d = new Date();
  const dt = tasks.filter(x=>x.date===t);
  const done = dt.filter(x=>x.done).length;
  const pct = dt.length ? Math.round((done/dt.length)*100) : 0;
  const wo = WORKOUT_PLAN[d.getDay()];
  const woDone = workouts[t];
  const cw = weights.length ? weights[weights.length-1].weight : "—";
  const upcoming = tasks.filter(x=>(x.dueDate||x.date)>=t&&!x.done).sort((a,b)=>(a.dueDate||a.date).localeCompare(b.dueDate||b.date)).slice(0,5);

  const stats = [
    {label:"Today's Progress",value:`${pct}%`,sub:`${done}/${dt.length} tasks`,color:C.pri,bg:C.priSoft,icon:"◉"},
    {label:"Current Weight",value:`${cw}${cw!=="—"?" kg":""}`,sub:weights.length>1?`${(cw-weights[0].weight)>0?"+":""}${(cw-weights[0].weight).toFixed(1)} kg`:"Start tracking",color:C.grn,bg:C.grnSoft,icon:"⚖"},
    {label:"Active Goals",value:goals.filter(g=>g.progress<100).length,sub:`${goals.filter(g=>g.progress>=100).length} completed`,color:C.ylw,bg:C.ylwSoft,icon:"◎"},
    {label:"Workout",value:woDone?"Done":"Pending",sub:wo.name,color:woDone?C.grn:C.red,bg:woDone?C.grnSoft:C.redSoft,icon:"♦"},
  ];

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h2 style={{ color:C.text, fontSize:26, fontWeight:700, margin:0, letterSpacing:"-0.03em" }}>
          Good {d.getHours()<12?"Morning":d.getHours()<17?"Afternoon":"Evening"}
        </h2>
        <p style={{ color:C.textLight, fontSize:14, marginTop:5 }}>{DAYS[d.getDay()]}, {MONTHS[d.getMonth()]} {d.getDate()}, {d.getFullYear()}</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14, marginBottom:24 }}>
        {stats.map((s,i) => (
          <Card key={i} style={{ padding:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ color:C.textMid, fontSize:11, fontWeight:600 }}>{s.label}</span>
              <span style={{ width:26, height:26, borderRadius:8, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, fontSize:13 }}>{s.icon}</span>
            </div>
            <div style={{ color:C.text, fontSize:24, fontWeight:700 }}>{s.value}</div>
            <div style={{ color:C.textLight, fontSize:11, marginTop:3 }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 14px" }}>Today's Tasks</h3>
          {dt.length===0 ? <p style={{ color:C.textLight, fontSize:13 }}>No tasks for today</p> :
            dt.map(x => (
              <div key={x.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid ${C.borderSoft}` }}>
                <span style={{ color:x.done?C.grn:C.textLight, fontSize:15, fontWeight:700 }}>{x.done?"✓":"○"}</span>
                <span style={{ flex:1, color:x.done?C.textLight:C.text, fontSize:13, textDecoration:x.done?"line-through":"none" }}>{x.title}</span>
                <Badge color={catClr(x.category)}>{x.category}</Badge>
              </div>
            ))
          }
        </Card>
        <Card>
          <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 14px" }}>Upcoming Deadlines</h3>
          {upcoming.length===0 ? <p style={{ color:C.textLight, fontSize:13 }}>All clear!</p> :
            upcoming.map(x => (
              <div key={x.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.borderSoft}` }}>
                <span style={{ color:C.text, fontSize:13 }}>{x.title}</span>
                <span style={{ color:C.textLight, fontSize:11 }}>{x.dueDate||x.date}</span>
              </div>
            ))
          }
        </Card>
        <Card>
          <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 14px" }}>Today's Workout</h3>
          <div style={{ color:C.pri, fontSize:13, fontWeight:700, marginBottom:10 }}>{wo.name}</div>
          {wo.exercises.map((e,i) => <div key={i} style={{ color:C.textMid, fontSize:13, padding:"4px 0", display:"flex", alignItems:"center", gap:7 }}><span style={{ color:C.grn, fontSize:7 }}>●</span>{e}</div>)}
        </Card>
        <Card>
          <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 14px" }}>Daily Progress</h3>
          <div style={{ position:"relative", width:120, height:120, margin:"0 auto" }}>
            <svg viewBox="0 0 120 120" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke={C.borderSoft} strokeWidth="8"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke={C.pri} strokeWidth="8" strokeDasharray={`${(pct/100)*314} 314`} strokeLinecap="round"/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
              <span style={{ color:C.text, fontSize:28, fontWeight:700 }}>{pct}</span>
              <span style={{ color:C.textLight, fontSize:10 }}>percent</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CALENDAR
   ═══════════════════════════════════════════════════════════════════════ */
function CalendarView({tasks, setTasks}) {
  const [view, setView] = useState("month");
  const [cur, setCur] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [nt, setNt] = useState({title:"",date:getToday(),dueDate:"",category:"Personal",recurring:"none"});

  const yr=cur.getFullYear(), mo=cur.getMonth();
  const fd=new Date(yr,mo,1).getDay(), dim=new Date(yr,mo+1,0).getDate();
  const tasksOn = d => tasks.filter(t=>t.date===d);
  const dayPct = d => { const ts=tasksOn(d); return ts.length ? Math.round((ts.filter(t=>t.done).length/ts.length)*100) : -1; };
  const toggle = id => setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));

  const add = () => {
    if (!nt.title) return;
    const tk = {id:makeId(),...nt,done:false};
    if (nt.recurring!=="none") {
      const arr=[tk]; const s=new Date(nt.date);
      for(let i=1;i<52;i++){const n=new Date(s);if(nt.recurring==="daily")n.setDate(n.getDate()+i);else if(nt.recurring==="weekly")n.setDate(n.getDate()+i*7);else if(nt.recurring==="monthly")n.setMonth(n.getMonth()+i);arr.push({...tk,id:makeId(),date:fmtDate(n)});}
      setTasks(p=>[...p,...arr]);
    } else setTasks(p=>[...p,tk]);
    setModal(false); setNt({title:"",date:getToday(),dueDate:"",category:"Personal",recurring:"none"});
  };

  const nav = dir => { const n=new Date(cur); n.setMonth(n.getMonth()+dir); setCur(n); };
  const ws = new Date(cur); ws.setDate(ws.getDate()-ws.getDay());

  return (
    <div>
      <SectionTitle right={
        <div style={{ display:"flex", gap:6 }}>
          {["month","week","day"].map(v=><Btn key={v} small primary={view===v} onClick={()=>setView(v)}>{v[0].toUpperCase()+v.slice(1)}</Btn>)}
          <Btn primary onClick={()=>setModal(true)}>+ Task</Btn>
        </div>
      }>Calendar</SectionTitle>

      {view==="month" && (
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <span onClick={()=>nav(-1)} style={{ cursor:"pointer", color:C.textLight, fontSize:20, padding:"2px 10px", fontWeight:700 }}>‹</span>
            <span style={{ color:C.text, fontSize:15, fontWeight:700 }}>{MONTHS[mo]} {yr}</span>
            <span onClick={()=>nav(1)} style={{ cursor:"pointer", color:C.textLight, fontSize:20, padding:"2px 10px", fontWeight:700 }}>›</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {DAYS.map(d=><div key={d} style={{ textAlign:"center", color:C.textLight, fontSize:10, padding:6, fontWeight:600 }}>{d.slice(0,3)}</div>)}
            {Array.from({length:fd}).map((_,i)=><div key={`e${i}`}/>)}
            {Array.from({length:dim}).map((_,i)=>{
              const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
              const p=dayPct(ds), isT=ds===getToday();
              return (
                <div key={i} style={{ textAlign:"center", padding:7, borderRadius:10, background:isT?C.priSoft:C.bg, border:isT?`1.5px solid ${C.priBorder}`:"1.5px solid transparent", minHeight:56 }}>
                  <div style={{ color:isT?C.pri:C.text, fontSize:12, fontWeight:isT?700:500 }}>{i+1}</div>
                  {p>=0 && <div style={{ marginTop:5 }}><Bar pct={p} color={p===100?C.grn:C.pri} h={3}/><span style={{ fontSize:8, color:p===100?C.grn:C.textLight, fontWeight:600 }}>{p}%</span></div>}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {view==="week" && (
        <Card>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
            {Array.from({length:7}).map((_,i)=>{
              const d=new Date(ws); d.setDate(d.getDate()+i);
              const ds=fmtDate(d), dt=tasksOn(ds), isT=ds===getToday();
              return (
                <div key={i} style={{ padding:10, borderRadius:12, background:isT?C.priSoft:C.bg, border:isT?`1.5px solid ${C.priBorder}`:`1.5px solid ${C.borderSoft}` }}>
                  <div style={{ color:C.textLight, fontSize:10, fontWeight:600, marginBottom:3 }}>{DAYS[d.getDay()].slice(0,3)}</div>
                  <div style={{ color:isT?C.pri:C.text, fontSize:17, fontWeight:700, marginBottom:10 }}>{d.getDate()}</div>
                  {dt.map(t=>(
                    <div key={t.id} onClick={()=>toggle(t.id)} style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 0", cursor:"pointer" }}>
                      <span style={{ color:t.done?C.grn:C.textLight, fontSize:11, fontWeight:700 }}>{t.done?"✓":"○"}</span>
                      <span style={{ color:t.done?C.textLight:C.text, fontSize:11, textDecoration:t.done?"line-through":"none" }}>{t.title}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {view==="day" && (
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <span onClick={()=>{const n=new Date(cur);n.setDate(n.getDate()-1);setCur(new Date(n));}} style={{ cursor:"pointer", color:C.textLight, fontSize:20, padding:"2px 10px", fontWeight:700 }}>‹</span>
            <span style={{ color:C.text, fontSize:15, fontWeight:700 }}>{DAYS[cur.getDay()]}, {MONTHS[cur.getMonth()]} {cur.getDate()}</span>
            <span onClick={()=>{const n=new Date(cur);n.setDate(n.getDate()+1);setCur(new Date(n));}} style={{ cursor:"pointer", color:C.textLight, fontSize:20, padding:"2px 10px", fontWeight:700 }}>›</span>
          </div>
          {(()=>{
            const ds=fmtDate(cur), dt=tasksOn(ds), p=dt.length?Math.round((dt.filter(t=>t.done).length/dt.length)*100):0;
            return <>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}><Bar pct={p} h={7}/><span style={{ color:C.text, fontSize:14, fontWeight:700, minWidth:36 }}>{p}%</span></div>
              {dt.length===0 ? <p style={{ color:C.textLight, fontSize:13 }}>No tasks</p> :
                dt.map(t=>(
                  <div key={t.id} onClick={()=>toggle(t.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", marginBottom:6, borderRadius:10, background:t.done?C.grnSoft:C.bg, border:`1.5px solid ${t.done?C.grnBorder:C.borderSoft}`, cursor:"pointer" }}>
                    <span style={{ color:t.done?C.grn:C.textLight, fontSize:16, fontWeight:700 }}>{t.done?"✓":"○"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:t.done?C.textLight:C.text, fontSize:13, textDecoration:t.done?"line-through":"none" }}>{t.title}</div>
                      {t.dueDate && <div style={{ color:C.textLight, fontSize:11, marginTop:2 }}>Due: {t.dueDate}</div>}
                    </div>
                    <Badge color={catClr(t.category)}>{t.category}</Badge>
                  </div>
                ))
              }
            </>;
          })()}
        </Card>
      )}

      <Modal open={modal} onClose={()=>setModal(false)} title="Add Task">
        <Inp label="Task Title" value={nt.title} onChange={v=>setNt({...nt,title:v})} placeholder="What needs to be done?" />
        <Inp label="Start Date" value={nt.date} onChange={v=>setNt({...nt,date:v})} type="date" />
        <Inp label="Due Date (optional)" value={nt.dueDate} onChange={v=>setNt({...nt,dueDate:v})} type="date" />
        <Sel label="Category" value={nt.category} onChange={v=>setNt({...nt,category:v})} options={CATEGORIES} />
        <Sel label="Recurring" value={nt.recurring} onChange={v=>setNt({...nt,recurring:v})} options={[{value:"none",label:"One-time"},{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"monthly",label:"Monthly"}]} />
        <Btn primary onClick={add} style={{ width:"100%", marginTop:6 }}>Add Task</Btn>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TASKS
   ═══════════════════════════════════════════════════════════════════════ */
function TasksView({tasks, setTasks}) {
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [nt, setNt] = useState({title:"",date:getToday(),dueDate:"",category:"Personal",recurring:"none"});

  const t = getToday();
  const filtered = filter==="all"?tasks:filter==="today"?tasks.filter(x=>x.date===t):filter==="upcoming"?tasks.filter(x=>x.date>=t&&!x.done):tasks.filter(x=>x.category===filter);
  const toggle = id => setTasks(p=>p.map(x=>x.id===id?{...x,done:!x.done}:x));
  const del = id => setTasks(p=>p.filter(x=>x.id!==id));
  const overdue = x => x.dueDate && x.dueDate < t && !x.done;

  const add = () => {
    if (!nt.title) return;
    const tk={id:makeId(),...nt,done:false};
    if(nt.recurring!=="none"){const arr=[tk];const s=new Date(nt.date);for(let i=1;i<52;i++){const n=new Date(s);if(nt.recurring==="daily")n.setDate(n.getDate()+i);else if(nt.recurring==="weekly")n.setDate(n.getDate()+i*7);else if(nt.recurring==="monthly")n.setMonth(n.getMonth()+i);arr.push({...tk,id:makeId(),date:fmtDate(n)});}setTasks(p=>[...p,...arr]);}
    else setTasks(p=>[...p,tk]);
    setModal(false); setNt({title:"",date:getToday(),dueDate:"",category:"Personal",recurring:"none"});
  };

  return (
    <div>
      <SectionTitle right={<Btn primary onClick={()=>setModal(true)}>+ Add Task</Btn>}>Tasks</SectionTitle>
      <div style={{ display:"flex", gap:5, marginBottom:18, flexWrap:"wrap" }}>
        {["all","today","upcoming",...CATEGORIES].map(f=><Btn key={f} small primary={filter===f} onClick={()=>setFilter(f)}>{f[0].toUpperCase()+f.slice(1)}</Btn>)}
      </div>
      {filtered.length===0 ? <Empty text="No tasks found"/> : (
        <div style={{ display:"grid", gap:6 }}>
          {filtered.sort((a,b)=>a.date.localeCompare(b.date)).map(x=>(
            <Card key={x.id} style={{ padding:12, display:"flex", alignItems:"center", gap:10, background:overdue(x)?C.redSoft:C.card, border:`1px solid ${overdue(x)?"#fecaca":C.border}` }}>
              <span onClick={()=>toggle(x.id)} style={{ cursor:"pointer", color:x.done?C.grn:C.textLight, fontSize:17, fontWeight:700 }}>{x.done?"✓":"○"}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:x.done?C.textLight:C.text, fontSize:13, fontWeight:500, textDecoration:x.done?"line-through":"none" }}>{x.title}</div>
                <div style={{ display:"flex", gap:8, marginTop:2 }}>
                  <span style={{ color:C.textLight, fontSize:11 }}>{x.date}</span>
                  {x.dueDate && <span style={{ color:overdue(x)?C.red:C.textLight, fontSize:11, fontWeight:overdue(x)?600:400 }}>Due: {x.dueDate}</span>}
                </div>
              </div>
              <Badge color={catClr(x.category)}>{x.category}</Badge>
              <span onClick={()=>del(x.id)} style={{ cursor:"pointer", color:"#ddd", fontSize:13 }}>✕</span>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Task">
        <Inp label="Task Title" value={nt.title} onChange={v=>setNt({...nt,title:v})} placeholder="What needs to be done?" />
        <Inp label="Start Date" value={nt.date} onChange={v=>setNt({...nt,date:v})} type="date" />
        <Inp label="Due Date (optional)" value={nt.dueDate} onChange={v=>setNt({...nt,dueDate:v})} type="date" />
        <Sel label="Category" value={nt.category} onChange={v=>setNt({...nt,category:v})} options={CATEGORIES} />
        <Sel label="Recurring" value={nt.recurring} onChange={v=>setNt({...nt,recurring:v})} options={[{value:"none",label:"One-time"},{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"monthly",label:"Monthly"}]} />
        <Btn primary onClick={add} style={{ width:"100%", marginTop:6 }}>Add Task</Btn>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   UNIVERSITY
   ═══════════════════════════════════════════════════════════════════════ */
function UniView() {
  const [courses, setCourses] = useState(()=>ld("uni",[]));
  const [modal, setModal] = useState(false);
  const [aModal, setAModal] = useState(null);
  const [nc, setNc] = useState({name:""});
  const [na, setNa] = useState({title:"",deadline:"",status:"Not Started",notes:""});

  useEffect(()=>sv("uni",courses),[courses]);

  const addC = () => { if(!nc.name)return; setCourses(p=>[...p,{id:makeId(),name:nc.name,assignments:[]}]); setModal(false); setNc({name:""}); };
  const addA = () => { if(!na.title)return; setCourses(p=>p.map(c=>c.id===aModal?{...c,assignments:[...c.assignments,{id:makeId(),...na}]}:c)); setAModal(null); setNa({title:"",deadline:"",status:"Not Started",notes:""}); };
  const updS = (cid,aid,s) => setCourses(p=>p.map(c=>c.id===cid?{...c,assignments:c.assignments.map(a=>a.id===aid?{...a,status:s}:a)}:c));
  const pct = c => c.assignments.length ? Math.round((c.assignments.filter(a=>a.status==="Completed").length/c.assignments.length)*100) : 0;
  const sc = {"Not Started":C.red,"In Progress":C.ylw,"Submitted":C.blu,"Completed":C.grn};
  const sb = {"Not Started":C.redSoft,"In Progress":C.ylwSoft,"Submitted":C.bluSoft,"Completed":C.grnSoft};

  return (
    <div>
      <SectionTitle right={<Btn primary onClick={()=>setModal(true)}>+ Course</Btn>}>University</SectionTitle>
      {courses.length===0 ? <Empty text="No courses yet. Add your first course."/> : (
        <div style={{ display:"grid", gap:14 }}>
          {courses.map(c=>(
            <Card key={c.id}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div>
                  <h3 style={{ color:C.text, fontSize:15, fontWeight:700, margin:0 }}>{c.name}</h3>
                  <span style={{ color:C.textLight, fontSize:11 }}>{c.assignments.length} assignments</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:C.pri, fontSize:13, fontWeight:700 }}>{pct(c)}%</span>
                  <Btn small onClick={()=>setAModal(c.id)}>+ Assignment</Btn>
                </div>
              </div>
              <Bar pct={pct(c)}/>
              {c.assignments.map(a=>(
                <div key={a.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.borderSoft}` }}>
                  <div>
                    <div style={{ color:C.text, fontSize:13, fontWeight:500 }}>{a.title}</div>
                    {a.deadline && <div style={{ color:C.textLight, fontSize:11, marginTop:1 }}>Due: {a.deadline}</div>}
                  </div>
                  <select value={a.status} onChange={e=>updS(c.id,a.id,e.target.value)}
                    style={{ padding:"4px 10px", borderRadius:7, border:"none", background:sb[a.status], color:sc[a.status], fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    {UNI_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Course">
        <Inp label="Course Name" value={nc.name} onChange={v=>setNc({name:v})} placeholder="e.g. Computer Science 101" />
        <Btn primary onClick={addC} style={{ width:"100%" }}>Add Course</Btn>
      </Modal>
      <Modal open={!!aModal} onClose={()=>setAModal(null)} title="Add Assignment">
        <Inp label="Title" value={na.title} onChange={v=>setNa({...na,title:v})} placeholder="Assignment title" />
        <Inp label="Deadline" value={na.deadline} onChange={v=>setNa({...na,deadline:v})} type="date" />
        <Sel label="Status" value={na.status} onChange={v=>setNa({...na,status:v})} options={UNI_STATUSES} />
        <TxtArea label="Notes" value={na.notes} onChange={v=>setNa({...na,notes:v})} placeholder="Notes..." />
        <Btn primary onClick={addA} style={{ width:"100%" }}>Add Assignment</Btn>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   GOALS
   ═══════════════════════════════════════════════════════════════════════ */
function GoalsView() {
  const [goals, setGoals] = useState(()=>ld("goals",[]));
  const [modal, setModal] = useState(false);
  const [msModal, setMsModal] = useState(null);
  const [ng, setNg] = useState({title:"",category:"Academic",target:"",progress:0,milestones:[]});
  const [nm, setNm] = useState("");

  useEffect(()=>sv("goals",goals),[goals]);

  const addG = () => { if(!ng.title)return; setGoals(p=>[...p,{id:makeId(),...ng}]); setModal(false); setNg({title:"",category:"Academic",target:"",progress:0,milestones:[]}); };
  const updP = (id,p) => setGoals(prev=>prev.map(g=>g.id===id?{...g,progress:Math.min(100,Math.max(0,+p))}:g));
  const addM = () => { if(!nm)return; setGoals(p=>p.map(g=>g.id===msModal?{...g,milestones:[...g.milestones,{id:makeId(),title:nm,done:false}]}:g)); setNm(""); };
  const togM = (gid,mid) => setGoals(p=>p.map(g=>g.id===gid?{...g,milestones:g.milestones.map(m=>m.id===mid?{...m,done:!m.done}:m)}:g));

  const gc = {Academic:C.pri,Fitness:C.grn,Business:C.ylw,Personal:C.pur};
  const gb = {Academic:C.priSoft,Fitness:C.grnSoft,Business:C.ylwSoft,Personal:C.purSoft};

  return (
    <div>
      <SectionTitle right={<Btn primary onClick={()=>setModal(true)}>+ Goal</Btn>}>2026 Goals</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {GOAL_CATEGORIES.map(cat=>{
          const cg=goals.filter(g=>g.category===cat), avg=cg.length?Math.round(cg.reduce((s,g)=>s+g.progress,0)/cg.length):0;
          return (
            <Card key={cat} style={{ padding:14, background:gb[cat], border:`1px solid ${gc[cat]}20` }}>
              <div style={{ color:gc[cat], fontSize:11, fontWeight:700, marginBottom:4 }}>{cat}</div>
              <div style={{ color:C.text, fontSize:20, fontWeight:700 }}>{cg.length}</div>
              <Bar pct={avg} color={gc[cat]} h={4}/><span style={{ color:C.textLight, fontSize:10 }}>{avg}%</span>
            </Card>
          );
        })}
      </div>
      <div style={{ display:"grid", gap:14 }}>
        {goals.map(g=>(
          <Card key={g.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <Badge color={gc[g.category]}>{g.category}</Badge>
                <h3 style={{ color:C.text, fontSize:15, fontWeight:700, margin:"6px 0 0" }}>{g.title}</h3>
                {g.target && <div style={{ color:C.textLight, fontSize:12, marginTop:3 }}>Target: {g.target}</div>}
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <input type="range" min="0" max="100" value={g.progress} onChange={e=>updP(g.id,e.target.value)} style={{ width:80, accentColor:C.pri }} />
                <span style={{ color:C.text, fontSize:13, fontWeight:700, minWidth:32 }}>{g.progress}%</span>
              </div>
            </div>
            <Bar pct={g.progress} color={gc[g.category]}/>
            {g.milestones.length>0 && (
              <div style={{ marginTop:14 }}>
                <div style={{ color:C.textLight, fontSize:10, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>Milestones</div>
                {g.milestones.map(m=>(
                  <div key={m.id} onClick={()=>togM(g.id,m.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 0", cursor:"pointer" }}>
                    <span style={{ color:m.done?C.grn:C.textLight, fontSize:13, fontWeight:700 }}>{m.done?"✓":"○"}</span>
                    <span style={{ color:m.done?C.textLight:C.text, fontSize:12, textDecoration:m.done?"line-through":"none" }}>{m.title}</span>
                  </div>
                ))}
              </div>
            )}
            <Btn small onClick={()=>setMsModal(g.id)} style={{ marginTop:10 }}>+ Milestone</Btn>
          </Card>
        ))}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Goal">
        <Inp label="Goal Title" value={ng.title} onChange={v=>setNg({...ng,title:v})} placeholder="What do you want to achieve?" />
        <Sel label="Category" value={ng.category} onChange={v=>setNg({...ng,category:v})} options={GOAL_CATEGORIES} />
        <Inp label="Target Date" value={ng.target} onChange={v=>setNg({...ng,target:v})} type="date" />
        <Btn primary onClick={addG} style={{ width:"100%" }}>Add Goal</Btn>
      </Modal>
      <Modal open={!!msModal} onClose={()=>setMsModal(null)} title="Add Milestone">
        <Inp label="Milestone" value={nm} onChange={setNm} placeholder="e.g. Complete first chapter" />
        <Btn primary onClick={addM} style={{ width:"100%" }}>Add Milestone</Btn>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FITNESS
   ═══════════════════════════════════════════════════════════════════════ */
function FitnessView({workouts, setWorkouts}) {
  const d=new Date(), t=getToday(), ws=new Date(d); ws.setDate(d.getDate()-d.getDay());
  const tog = ds => setWorkouts(p=>({...p,[ds]:!p[ds]}));
  const wc = Array.from({length:7}).filter((_,i)=>{const w=new Date(ws);w.setDate(w.getDate()+i);return workouts[fmtDate(w)];}).length;

  return (
    <div>
      <SectionTitle right={<Badge color={C.grn}>{wc}/7 this week</Badge>}>Fitness</SectionTitle>
      <Card style={{ marginBottom:16 }}>
        <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 14px" }}>Weekly Overview</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
          {Array.from({length:7}).map((_,i)=>{
            const w=new Date(ws); w.setDate(w.getDate()+i);
            const ds=fmtDate(w), wo=WORKOUT_PLAN[w.getDay()], dn=workouts[ds], isT=ds===t;
            return (
              <div key={i} onClick={()=>tog(ds)} style={{ padding:12, borderRadius:12, cursor:"pointer", textAlign:"center", background:dn?C.grnSoft:isT?C.priSoft:C.bg, border:`1.5px solid ${dn?C.grnBorder:isT?C.priBorder:C.borderSoft}` }}>
                <div style={{ color:dn?C.grn:C.textLight, fontSize:10, fontWeight:600, marginBottom:3 }}>{DAYS[w.getDay()].slice(0,3)}</div>
                <div style={{ color:dn?C.grn:C.text, fontSize:20, marginBottom:4, fontWeight:700 }}>{dn?"✓":"○"}</div>
                <div style={{ color:C.textLight, fontSize:9 }}>{wo.name.split(" + ")[0]}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 12px" }}>Today's Workout</h3>
          <div style={{ color:C.pri, fontSize:12, fontWeight:700, marginBottom:10 }}>{WORKOUT_PLAN[d.getDay()].name}</div>
          {WORKOUT_PLAN[d.getDay()].exercises.map((e,i)=><div key={i} style={{ color:C.textMid, fontSize:12, padding:"4px 0", display:"flex", gap:6, alignItems:"center" }}><span style={{ color:C.grn, fontSize:6 }}>●</span>{e}</div>)}
        </Card>
        <Card>
          <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 12px" }}>Full Week Plan</h3>
          {DAYS.map((day,i)=>(
            <div key={day} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.borderSoft}` }}>
              <span style={{ color:C.textLight, fontSize:11, fontWeight:600, minWidth:36 }}>{day.slice(0,3)}</span>
              <span style={{ color:C.textMid, fontSize:11 }}>{WORKOUT_PLAN[i].name}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WEIGHT TRACKER
   ═══════════════════════════════════════════════════════════════════════ */
function WeightView() {
  const [wts, setWts] = useState(()=>ld("weight",[]));
  const [nw, setNw] = useState("");
  const [tw, setTw] = useState(()=>ld("target_w",""));

  useEffect(()=>sv("weight",wts),[wts]);
  useEffect(()=>sv("target_w",tw),[tw]);

  const add = () => { if(!nw)return; const e={date:getToday(),weight:parseFloat(nw)}; setWts(p=>{const x=p.findIndex(w=>w.date===getToday());if(x>=0){const n=[...p];n[x]=e;return n;}return[...p,e];}); setNw(""); };
  const sw = wts.length?wts[0].weight:0, cw=wts.length?wts[wts.length-1].weight:0;
  const mx=wts.length?Math.max(...wts.map(w=>w.weight)):100, mn=wts.length?Math.min(...wts.map(w=>w.weight)):0, rng=mx-mn||1;

  return (
    <div>
      <SectionTitle>Weight Tracker</SectionTitle>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        <Card style={{ textAlign:"center", background:C.bg }}><div style={{ color:C.textLight, fontSize:11, fontWeight:600, marginBottom:4 }}>Starting</div><div style={{ color:C.text, fontSize:26, fontWeight:700 }}>{sw||"—"}</div><div style={{ color:C.textLight, fontSize:10 }}>kg</div></Card>
        <Card style={{ textAlign:"center", background:C.priSoft, border:`1px solid ${C.priBorder}` }}><div style={{ color:C.pri, fontSize:11, fontWeight:600, marginBottom:4 }}>Current</div><div style={{ color:C.pri, fontSize:26, fontWeight:700 }}>{cw||"—"}</div><div style={{ color:C.textLight, fontSize:10 }}>kg</div></Card>
        <Card style={{ textAlign:"center", background:C.grnSoft, border:`1px solid ${C.grnBorder}` }}><div style={{ color:C.grn, fontSize:11, fontWeight:600, marginBottom:4 }}>Target</div><input value={tw} onChange={e=>setTw(e.target.value)} placeholder="—" type="number" style={{ width:"100%", background:"transparent", border:"none", color:C.grn, fontSize:26, fontWeight:700, textAlign:"center", outline:"none", fontFamily:"inherit" }}/><div style={{ color:C.textLight, fontSize:10 }}>kg</div></Card>
      </div>
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end", marginBottom:18 }}>
          <Inp label="Log Today's Weight" value={nw} onChange={setNw} type="number" placeholder="e.g. 75.5" style={{ flex:1, marginBottom:0 }} />
          <Btn primary onClick={add} style={{ height:40 }}>Log</Btn>
        </div>
        {wts.length>1 && (
          <>
            <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 14px" }}>Progress Chart</h3>
            <div style={{ height:180, position:"relative", borderLeft:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, marginLeft:36 }}>
              {[0,25,50,75,100].map(p=><div key={p} style={{ position:"absolute", left:-36, top:`${100-p}%`, transform:"translateY(-50%)", color:C.textLight, fontSize:9, width:32, textAlign:"right" }}>{(mn+(rng*p/100)).toFixed(1)}</div>)}
              <svg viewBox={`0 0 ${Math.max(wts.length*30,200)} 180`} style={{ width:"100%", height:"100%", overflow:"visible" }}>
                <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.pri} stopOpacity="0.12"/><stop offset="100%" stopColor={C.pri} stopOpacity="0"/></linearGradient></defs>
                <path d={wts.map((w,i)=>`${i===0?"M":"L"} ${(i/(wts.length-1))*Math.max(wts.length*30,200)} ${180-((w.weight-mn)/rng)*180}`).join(" ")+` L ${Math.max(wts.length*30,200)} 180 L 0 180 Z`} fill="url(#wg)"/>
                <polyline fill="none" stroke={C.pri} strokeWidth="2.5" strokeLinecap="round" points={wts.map((w,i)=>`${(i/(wts.length-1))*Math.max(wts.length*30,200)},${180-((w.weight-mn)/rng)*180}`).join(" ")}/>
                {wts.map((w,i)=><circle key={i} cx={(i/(wts.length-1))*Math.max(wts.length*30,200)} cy={180-((w.weight-mn)/rng)*180} r="3.5" fill={C.pri} stroke="#fff" strokeWidth="2"/>)}
              </svg>
            </div>
          </>
        )}
      </Card>
      {wts.length>0 && <Card><h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 12px" }}>History</h3>{[...wts].reverse().slice(0,15).map((w,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.borderSoft}` }}><span style={{ color:C.textLight, fontSize:12 }}>{w.date}</span><span style={{ color:C.text, fontSize:12, fontWeight:600 }}>{w.weight} kg</span></div>)}</Card>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PHOTOS
   ═══════════════════════════════════════════════════════════════════════ */
function PhotosView() {
  const [photos, setPhotos] = useState(()=>ld("photos",[]));
  useEffect(()=>sv("photos",photos),[photos]);
  const up = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>setPhotos(p=>[...p,{id:makeId(),date:getToday(),data:r.result}]); r.readAsDataURL(f); e.target.value=""; };

  return (
    <div>
      <SectionTitle right={
        <label style={{ padding:"10px 18px", borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", boxShadow:"0 2px 8px rgba(99,102,241,0.2)" }}>
          + Upload <input type="file" accept="image/*" onChange={up} style={{ display:"none" }}/>
        </label>
      }>Progress Photos</SectionTitle>
      {photos.length===0 ? <Empty text="No photos yet."/> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:10 }}>
          {[...photos].reverse().map(p=>(
            <div key={p.id} style={{ borderRadius:14, overflow:"hidden", background:C.card, border:`1px solid ${C.border}` }}>
              <img src={p.data} alt="" style={{ width:"100%", height:220, objectFit:"cover" }}/>
              <div style={{ padding:"8px 12px" }}><span style={{ color:C.textLight, fontSize:11 }}>{p.date}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PROJECTS
   ═══════════════════════════════════════════════════════════════════════ */
function ProjectsView() {
  const [pjs, setPjs] = useState(()=>ld("projects",[]));
  const [modal, setModal] = useState(false);
  const [exp, setExp] = useState(null);
  const [np, setNp] = useState({name:"",description:"",status:"Active"});
  const [nn, setNn] = useState("");
  const [npt, setNpt] = useState("");

  useEffect(()=>sv("projects",pjs),[pjs]);

  const addP = () => { if(!np.name)return; setPjs(p=>[...p,{id:makeId(),...np,notes:[],tasks:[]}]); setModal(false); setNp({name:"",description:"",status:"Active"}); };
  const addN = pid => { if(!nn)return; setPjs(p=>p.map(x=>x.id===pid?{...x,notes:[...x.notes,{id:makeId(),text:nn,date:getToday()}]}:x)); setNn(""); };
  const addT = pid => { if(!npt)return; setPjs(p=>p.map(x=>x.id===pid?{...x,tasks:[...x.tasks,{id:makeId(),title:npt,done:false}]}:x)); setNpt(""); };
  const togT = (pid,tid) => setPjs(p=>p.map(x=>x.id===pid?{...x,tasks:x.tasks.map(t=>t.id===tid?{...t,done:!t.done}:t)}:x));

  const sc = {Active:C.grn,Paused:C.ylw,Completed:C.pri};

  return (
    <div>
      <SectionTitle right={<Btn primary onClick={()=>setModal(true)}>+ Project</Btn>}>Projects</SectionTitle>
      {pjs.length===0 ? <Empty text="No projects yet."/> : (
        <div style={{ display:"grid", gap:14 }}>
          {pjs.map(p=>{
            const ex=exp===p.id, tp=p.tasks.length?Math.round((p.tasks.filter(t=>t.done).length/p.tasks.length)*100):0;
            return (
              <Card key={p.id}>
                <div onClick={()=>setExp(ex?null:p.id)} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <h3 style={{ color:C.text, fontSize:15, fontWeight:700, margin:0 }}>{p.name}</h3>
                      <Badge color={sc[p.status]}>{p.status}</Badge>
                    </div>
                    {p.description && <div style={{ color:C.textLight, fontSize:12, marginTop:3 }}>{p.description}</div>}
                  </div>
                  <span style={{ color:C.textLight, fontSize:16, transform:ex?"rotate(180deg)":"", transition:"transform 0.2s" }}>▾</span>
                </div>
                {p.tasks.length>0 && <div style={{ marginTop:10 }}><Bar pct={tp}/><span style={{ color:C.textLight, fontSize:10 }}>{tp}%</span></div>}
                {ex && (
                  <div style={{ marginTop:18, paddingTop:14, borderTop:`1px solid ${C.borderSoft}` }}>
                    <div style={{ marginBottom:16 }}>
                      <div style={{ color:C.textLight, fontSize:10, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>Tasks</div>
                      {p.tasks.map(t=>(
                        <div key={t.id} onClick={()=>togT(p.id,t.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 0", cursor:"pointer" }}>
                          <span style={{ color:t.done?C.grn:C.textLight, fontSize:13, fontWeight:700 }}>{t.done?"✓":"○"}</span>
                          <span style={{ color:t.done?C.textLight:C.text, fontSize:12, textDecoration:t.done?"line-through":"none" }}>{t.title}</span>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:6, marginTop:6 }}>
                        <input value={npt} onChange={e=>setNpt(e.target.value)} placeholder="Add task..." onKeyDown={e=>e.key==="Enter"&&addT(p.id)}
                          style={{ flex:1, padding:"7px 10px", borderRadius:7, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:11, outline:"none", fontFamily:"inherit" }}/>
                        <Btn small onClick={()=>addT(p.id)}>Add</Btn>
                      </div>
                    </div>
                    <div>
                      <div style={{ color:C.textLight, fontSize:10, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>Notes</div>
                      {p.notes.map(n=>(
                        <div key={n.id} style={{ padding:"7px 10px", marginBottom:4, borderRadius:7, background:C.bg, border:`1px solid ${C.borderSoft}` }}>
                          <div style={{ color:C.textMid, fontSize:12 }}>{n.text}</div>
                          <div style={{ color:C.textLight, fontSize:9, marginTop:3 }}>{n.date}</div>
                        </div>
                      ))}
                      <div style={{ display:"flex", gap:6, marginTop:6 }}>
                        <input value={nn} onChange={e=>setNn(e.target.value)} placeholder="Add note..." onKeyDown={e=>e.key==="Enter"&&addN(p.id)}
                          style={{ flex:1, padding:"7px 10px", borderRadius:7, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:11, outline:"none", fontFamily:"inherit" }}/>
                        <Btn small onClick={()=>addN(p.id)}>Add</Btn>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title="New Project">
        <Inp label="Name" value={np.name} onChange={v=>setNp({...np,name:v})} placeholder="Project name" />
        <TxtArea label="Description" value={np.description} onChange={v=>setNp({...np,description:v})} placeholder="Brief description..." />
        <Sel label="Status" value={np.status} onChange={v=>setNp({...np,status:v})} options={["Active","Paused","Completed"]} />
        <Btn primary onClick={addP} style={{ width:"100%" }}>Create Project</Btn>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   REMINDERS
   ═══════════════════════════════════════════════════════════════════════ */
function RemindersView() {
  const [rems, setRems] = useState(()=>ld("reminders",[]));
  const [modal, setModal] = useState(false);
  const [nr, setNr] = useState({title:"",date:"",time:"",recurring:"none"});

  useEffect(()=>sv("reminders",rems),[rems]);

  useEffect(()=>{
    if("Notification" in window && Notification.permission==="default") Notification.requestPermission();
    const iv=setInterval(()=>{
      const now=new Date(), ns=fmtDate(now), nt=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      rems.forEach(r=>{if(r.date===ns&&r.time===nt&&!r.fired){if(Notification.permission==="granted")new Notification("Reminder",{body:r.title});setRems(p=>p.map(x=>x.id===r.id?{...x,fired:true}:x));}});
    },30000);
    return()=>clearInterval(iv);
  },[rems]);

  const add = () => {
    if(!nr.title||!nr.time)return;
    const r={id:makeId(),...nr,fired:false};
    if(nr.recurring!=="none"){const arr=[r];const s=new Date(nr.date||getToday());for(let i=1;i<30;i++){const n=new Date(s);if(nr.recurring==="daily")n.setDate(n.getDate()+i);else if(nr.recurring==="weekly")n.setDate(n.getDate()+i*7);arr.push({...r,id:makeId(),date:fmtDate(n)});}setRems(p=>[...p,...arr]);}
    else setRems(p=>[...p,r]);
    setModal(false); setNr({title:"",date:"",time:"",recurring:"none"});
  };

  const del = id => setRems(p=>p.filter(r=>r.id!==id));
  const upcoming = rems.filter(r=>r.date>=getToday()&&!r.fired).sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <div>
      <SectionTitle right={<Btn primary onClick={()=>setModal(true)}>+ Reminder</Btn>}>Reminders</SectionTitle>
      {upcoming.length===0 ? <Empty text="No upcoming reminders"/> : (
        <div style={{ display:"grid", gap:10 }}>
          {upcoming.slice(0,20).map(r=>(
            <Card key={r.id} style={{ padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:C.text, fontSize:13, fontWeight:600 }}>{r.title}</div>
                <div style={{ color:C.textLight, fontSize:11, marginTop:3 }}>{r.date} at {r.time}</div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                {r.recurring!=="none" && <Badge color={C.pur}>{r.recurring}</Badge>}
                <span onClick={()=>del(r.id)} style={{ cursor:"pointer", color:C.red, fontSize:14 }}>✕</span>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modal} onClose={()=>setModal(false)} title="Set Reminder">
        <Inp label="Title" value={nr.title} onChange={v=>setNr({...nr,title:v})} placeholder="Reminder title" />
        <Inp label="Date" value={nr.date} onChange={v=>setNr({...nr,date:v})} type="date" />
        <Inp label="Time" value={nr.time} onChange={v=>setNr({...nr,time:v})} type="time" />
        <Sel label="Recurring" value={nr.recurring} onChange={v=>setNr({...nr,recurring:v})} options={[{value:"none",label:"One-time"},{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"}]} />
        <Btn primary onClick={add} style={{ width:"100%" }}>Set Reminder</Btn>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NAVIGATION & MAIN APP
   ═══════════════════════════════════════════════════════════════════════ */
const NAV = [
  {id:"dashboard",label:"Dashboard",icon:"◉"},
  {id:"calendar",label:"Calendar",icon:"▦"},
  {id:"tasks",label:"Tasks",icon:"✓"},
  {id:"university",label:"University",icon:"◈"},
  {id:"goals",label:"Goals",icon:"◎"},
  {id:"fitness",label:"Fitness",icon:"♦"},
  {id:"weight",label:"Weight",icon:"⚖"},
  {id:"photos",label:"Photos",icon:"▣"},
  {id:"projects",label:"Projects",icon:"◇"},
  {id:"reminders",label:"Reminders",icon:"◆"},
];

export default function App() {
  const [auth, setAuth] = useState(()=>ld("session",false));
  const [page, setPage] = useState("dashboard");
  const [sb, setSb] = useState(true);
  const [tasks, setTasks] = useState(()=>ld("tasks",[]));
  const [workouts, setWorkouts] = useState(()=>ld("workouts",{}));

  useEffect(()=>sv("tasks",tasks),[tasks]);
  useEffect(()=>sv("workouts",workouts),[workouts]);

  if (!auth) return <AuthScreen onLogin={()=>{setAuth(true);sv("session",true);}}/>;

  const weights = ld("weight",[]);
  const goals = ld("goals",[]);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',sans-serif", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* Sidebar */}
      <div style={{ width:sb?224:60, background:C.card, borderRight:`1px solid ${C.border}`, padding:"18px 0", transition:"width 0.2s", display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden", boxShadow:"1px 0 6px rgba(0,0,0,0.02)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 14px", marginBottom:28, cursor:"pointer" }} onClick={()=>setSb(!sb)}>
          <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, color:"#fff" }}>◆</div>
          {sb && <span style={{ fontSize:16, fontWeight:700, letterSpacing:"-0.03em", whiteSpace:"nowrap" }}>VeersLife</span>}
        </div>
        <div style={{ flex:1 }}>
          {NAV.map(n=>(
            <div key={n.id} onClick={()=>setPage(n.id)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 14px", margin:"1px 6px", borderRadius:9, cursor:"pointer",
              background:page===n.id?C.priSoft:"transparent", color:page===n.id?C.pri:C.textMid, fontWeight:page===n.id?600:400, transition:"all 0.12s"
            }}>
              <span style={{ fontSize:15, width:22, textAlign:"center", flexShrink:0 }}>{n.icon}</span>
              {sb && <span style={{ fontSize:13, whiteSpace:"nowrap" }}>{n.label}</span>}
            </div>
          ))}
        </div>
        <div onClick={()=>{setAuth(false);sv("session",false);}} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", margin:"1px 6px", borderRadius:9, cursor:"pointer", color:C.red }}>
          <span style={{ fontSize:15, width:22, textAlign:"center", flexShrink:0 }}>⏻</span>
          {sb && <span style={{ fontSize:13, whiteSpace:"nowrap" }}>Logout</span>}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:"28px 36px", overflow:"auto", maxHeight:"100vh" }}>
        {page==="dashboard" && <Dashboard tasks={tasks} goals={goals} weights={weights} workouts={workouts}/>}
        {page==="calendar" && <CalendarView tasks={tasks} setTasks={setTasks}/>}
        {page==="tasks" && <TasksView tasks={tasks} setTasks={setTasks}/>}
        {page==="university" && <UniView/>}
        {page==="goals" && <GoalsView/>}
        {page==="fitness" && <FitnessView workouts={workouts} setWorkouts={setWorkouts}/>}
        {page==="weight" && <WeightView/>}
        {page==="photos" && <PhotosView/>}
        {page==="projects" && <ProjectsView/>}
        {page==="reminders" && <RemindersView/>}
      </div>
    </div>
  );
}
