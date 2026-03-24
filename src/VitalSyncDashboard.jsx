import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  RiDashboardLine, RiCalendarLine, RiUserLine, RiBarChartLine,
  RiBookOpenLine, RiPieChartLine, RiMessage2Line, RiMoneyDollarCircleLine,
  RiFileTextLine, RiSettingsLine, RiLogoutBoxLine, RiSearchLine,
  RiBellLine, RiUser3Line, RiArrowLeftSLine, RiArrowRightSLine,
  RiAddLine, RiRefreshLine, RiVideoLine, RiChat3Line, RiHeartPulseLine,
  RiCloseLine, RiCheckLine, RiPhoneLine, RiMedicineBottleLine, RiMenuLine,
  RiDownloadLine,
} from "react-icons/ri";

/* ─── Google Font inject ──────────────────────────────────────── */
if (!document.getElementById("vs-font")) {
  const l = document.createElement("link");
  l.id = "vs-font";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap";
  l.rel = "stylesheet";
  document.head.appendChild(l);
}

/* ─── Data ────────────────────────────────────────────────────── */
const VISIT_DATA = [
  { t: "09:30", v: 2 }, { t: "10:00", v: 5 }, { t: "10:30", v: 3 },
  { t: "11:00", v: 7 }, { t: "11:30", v: 5 }, { t: "12:00", v: 9 },
  { t: "12:30", v: 6 }, { t: "13:00", v: 11 }, { t: "13:30", v: 8 },
  { t: "14:00", v: 13 }, { t: "14:30", v: 10 }, { t: "15:00", v: 14 },
];

const ALL_PATIENTS = [
  { id: 1, name: "Taigo Wilkinson",   initials: "TW", color: "#c5e8a0", type: "Emergency Visit",    status: "OK", time: "08:15 AM", age: "38y 5m", gender: "Male",   symptoms: ["Fever","Cough","Heart Burn"], obs: "High fever and persistent cough at normal prescription levels. Blood pressure slightly elevated.", prescription: ["Paracetamol — 2×/day","Diazepam — Day & Night before meal"], id_code: "1EG4-TE5-NK72", lastDoc: "Dr. Emily",  lastDate: "27 Apr 2023" },
  { id: 2, name: "Samantha Williams", initials: "SW", color: "#f5b8c4", type: "Routine Check-up",   status: "OT", time: "11:30 AM", age: "29y 2m", gender: "Female", symptoms: ["Headache","Fatigue"],         obs: "Mild tension headache. Reports fatigue due to work stress. Sleep pattern irregular.",           prescription: ["Ibuprofen — 1×/day","Melatonin — Night before sleep"],   id_code: "2RK7-AB3-PQ19", lastDoc: "Dr. Chen",   lastDate: "12 Mar 2024" },
  { id: 3, name: "Amy White",         initials: "AW", color: "#a8d8ea", type: "Video Consultation", status: "OK", time: "01:15 PM", age: "45y 8m", gender: "Female", symptoms: ["Back Pain","Stiffness"],       obs: "Chronic lower back pain. Muscle stiffness after long sitting hours at desk.",                   prescription: ["Naproxen — 2×/day","Muscle relaxant — Night"],            id_code: "3VX2-CD5-MN44", lastDoc: "Dr. Patel",  lastDate: "05 May 2024" },
  { id: 4, name: "Tyler Young",       initials: "TY", color: "#f5e642", type: "Fever Checkup",      status: "OF", time: "04:45 PM", age: "12y 3m", gender: "Male",   symptoms: ["High Fever","Runny Nose"],    obs: "Temperature 103°F. Viral infection suspected. Parents report symptoms started 2 days ago.",       prescription: ["Calpol — 3×/day","Cetirizine — Night"],                   id_code: "4BN9-EF1-ST67", lastDoc: "Dr. Emily",  lastDate: "01 May 2024" },
  { id: 5, name: "Rachel Green",      initials: "RG", color: "#e8c5f5", type: "Follow-up",          status: "OK", time: "05:00 PM", age: "33y 1m", gender: "Female", symptoms: ["Anxiety","Insomnia"],         obs: "Follow-up on anxiety treatment. Patient reports improvement. Sleep still fragmented.",            prescription: ["Sertraline — 1×/day","Clonazepam — Night if needed"],     id_code: "5QW3-GH7-UV88", lastDoc: "Dr. Chen",   lastDate: "18 Apr 2024" },
];

const SCHEDULE = [
  { time: "07:00", title: "Emergency visit",     location: "West camp, Room 312",          color: "#fce4ec", dot: "#f06292", tag: "Emergency" },
  { time: "07:30", title: "Diagnostic test",     location: "East camp, Laboratory floor 8", color: "#fff9c4", dot: "#fdd835", tag: "Test" },
  { time: "08:00", title: "Team daily planning", location: "East camp, Meeting Room 202",   color: "#e3f2fd", dot: "#42a5f5", tag: "Meeting", avatars: true },
  { time: "09:00", title: "Emergency visit",     location: "West camp, Room 312",           color: "#fce4ec", dot: "#f06292", tag: "Emergency" },
];

const INIT_NOTIFS = [
  { id: 1, msg: "Taigo Wilkinson's lab results are ready",    time: "2m ago",   read: false, type: "result" },
  { id: 2, msg: "New appointment request from Rachel Green",  time: "15m ago",  read: false, type: "appointment" },
  { id: 3, msg: "Team meeting starts in 30 minutes",          time: "30m ago",  read: true,  type: "meeting" },
  { id: 4, msg: "Lab report for Amy White uploaded",          time: "1h ago",   read: true,  type: "result" },
];

const CAL_DAYS = ["MO","TU","WE","TH","FR","SA","SU"];
const CAL_GRID = [[null,null,1,2,3,4,5],[6,7,8,9,10,11,12],[13,14,15,16,17,18,19],[20,21,22,23,24,25,26],[27,28,29,30,31,null,null]];

/* ─── Helpers ────────────────────────────────────────────────── */
const ss = s => s === "OK" ? { bg:"#e8f5e9", color:"#388e3c" } : s === "OT" ? { bg:"#fff3e0", color:"#e65100" } : { bg:"#f5f5f5", color:"#757575" };
const btn = (extra={}) => ({ border:"none", cursor:"pointer", transition:"all 0.15s", ...extra });

function Sparkbar({ bars, color }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:32 }}>
      {bars.map((h,i)=><div key={i} style={{ flex:1, borderRadius:3, background:color, opacity:0.7, height:`${h}%` }} />)}
    </div>
  );
}

/* ═══ SIDEBAR ════════════════════════════════════════════════════ */
const NAV_ITEMS  = [{icon:RiDashboardLine,label:"Dashboard"},{icon:RiCalendarLine,label:"Schedule"},{icon:RiUserLine,label:"Patients"},{icon:RiBarChartLine,label:"Statistics & Reports"},{icon:RiBookOpenLine,label:"Education"},{icon:RiPieChartLine,label:"My Articles"}];
const TOOL_ITEMS = [{icon:RiPhoneLine,label:"Chats & Calls"},{icon:RiMoneyDollarCircleLine,label:"Billing"},{icon:RiFileTextLine,label:"Documents Base"},{icon:RiSettingsLine,label:"Settings"}];

function Sidebar({ active, setActive, open, setOpen }) {
  const NavBtn = ({ icon: Icon, label }) => {
    const a = active === label;
    const [hover, setHover] = useState(false);
    return (
      <button
        onClick={() => { setActive(label); setOpen(false); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={btn({ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:12, width:"100%", textAlign:"left", fontSize:13, fontWeight: a ? 600 : 400, background: a ? "#f5e642" : hover ? "#2a2a2e" : "transparent", color: a ? "#1c1c1e" : hover ? "#fff" : "#888" })}
      >
        <Icon style={{ fontSize:16, flexShrink:0 }} />
        <span style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{label}</span>
      </button>
    );
  };
  return (
    <>
      {open && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:30 }} onClick={() => setOpen(false)} className="lg:hidden" />}
      <aside style={{ fontFamily:"'DM Sans',sans-serif", background:"#1c1c1e", position:"fixed", top:0, left:0, height:"100vh", width:208, zIndex:40, display:"flex", flexDirection:"column", padding:"20px 12px", transform: open ? "translateX(0)" : undefined }} className={`transition-transform duration-300 ${open ? "" : "-translate-x-full"} lg:translate-x-0`}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 4px", marginBottom:28 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"#f5e642", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <RiHeartPulseLine style={{ color:"#1c1c1e", fontSize:14 }} />
          </div>
          <span style={{ color:"#fff", fontWeight:700, fontSize:16, letterSpacing:"-0.3px" }}>vitalsync</span>
          <div style={{ width:7, height:7, borderRadius:99, background:"#f5e642", marginLeft:2 }} />
        </div>

        <p style={{ color:"#555", fontSize:10, fontWeight:600, letterSpacing:"0.08em", padding:"0 6px", marginBottom:6 }}>GENERAL</p>
        <div style={{ display:"flex", flexDirection:"column", gap:2, marginBottom:20 }}>
          {NAV_ITEMS.map(i => <NavBtn key={i.label} {...i} />)}
        </div>
        <p style={{ color:"#555", fontSize:10, fontWeight:600, letterSpacing:"0.08em", padding:"0 6px", marginBottom:6 }}>TOOLS</p>
        <div style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
          {TOOL_ITEMS.map(i => <NavBtn key={i.label} {...i} />)}
        </div>
        <button
          style={btn({ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:12, width:"100%", textAlign:"left", fontSize:13, background:"transparent", color:"#555" })}
          onMouseEnter={e => e.currentTarget.style.color="#ff6b6b"}
          onMouseLeave={e => e.currentTarget.style.color="#555"}
        >
          <RiLogoutBoxLine style={{ fontSize:16 }} /><span>Log out</span>
        </button>
      </aside>
    </>
  );
}

/* ═══ TOPBAR ════════════════════════════════════════════════════ */
function TopBar({ setMenuOpen, notifs, notifOpen, setNotifOpen, searchQ, setSearchQ, searchRes, setSearchRes }) {
  const unread = notifs.filter(n => !n.read).length;
  const handleSearch = q => {
    setSearchQ(q);
    setSearchRes(q.trim().length > 1 ? ALL_PATIENTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.type.toLowerCase().includes(q.toLowerCase())) : []);
  };
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:10, marginBottom:20, position:"relative" }}>
      {/* hamburger */}
      <button className="lg:hidden" onClick={() => setMenuOpen(true)} style={btn({ width:36, height:36, borderRadius:10, background:"#fff", border:"1.5px solid #e8e0d4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 })}>
        <RiMenuLine style={{ fontSize:17, color:"#555" }} />
      </button>
      {/* search */}
      <div style={{ position:"relative", flex:1, maxWidth:280 }}>
        <RiSearchLine style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#aaa", fontSize:14 }} />
        <input value={searchQ} onChange={e => handleSearch(e.target.value)} placeholder="Search patients..."
          style={{ width:"100%", paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, borderRadius:99, background:"#fff", border:"1.5px solid #e8e0d4", fontSize:12.5, color:"#333", outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box" }}
          onFocus={e => e.target.style.borderColor="#c8b878"}
          onBlur={e => e.target.style.borderColor="#e8e0d4"}
        />
        {searchRes.length > 0 && (
          <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"#fff", borderRadius:14, boxShadow:"0 8px 30px rgba(0,0,0,0.12)", border:"1px solid #eee", zIndex:100, overflow:"hidden" }}>
            {searchRes.map(p => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", cursor:"pointer" }}
                onMouseEnter={e => e.currentTarget.style.background="#f9f6f0"}
                onMouseLeave={e => e.currentTarget.style.background="#fff"}
                onClick={() => { setSearchQ(""); setSearchRes([]); }}>
                <div style={{ width:30, height:30, borderRadius:99, background:p.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#333", flexShrink:0 }}>{p.initials}</div>
                <div style={{ flex:1 }}><p style={{ fontSize:12.5, fontWeight:600, color:"#222" }}>{p.name}</p><p style={{ fontSize:10.5, color:"#aaa" }}>{p.type}</p></div>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99, background:ss(p.status).bg, color:ss(p.status).color }}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* filter chips */}
      <div className="hidden md:flex" style={{ gap:6, alignItems:"center" }}>
        {["Patients","Education","Prescriptions","Test results"].map(f => (
          <button key={f} style={btn({ padding:"5px 10px", borderRadius:99, fontSize:11, fontWeight:500, background:"#fff", border:"1.5px solid #e8e0d4", color:"#777" })}
            onMouseEnter={e => { e.currentTarget.style.background="#f5e642"; e.currentTarget.style.borderColor="#f5e642"; e.currentTarget.style.color="#333"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#e8e0d4"; e.currentTarget.style.color="#777"; }}
          >{f}</button>
        ))}
      </div>
      {/* icons */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto", flexShrink:0 }}>
        <div style={{ position:"relative" }}>
          <button onClick={() => setNotifOpen(!notifOpen)} style={btn({ width:36, height:36, borderRadius:99, background:"#fff", border:"1.5px solid #e8e0d4", display:"flex", alignItems:"center", justifyContent:"center" })}>
            <RiBellLine style={{ fontSize:17, color:"#555" }} />
          </button>
          {unread > 0 && <span style={{ position:"absolute", top:-2, right:-2, width:16, height:16, borderRadius:99, background:"#f06292", color:"#fff", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #f5f0e8" }}>{unread}</span>}
        </div>
        <button style={btn({ width:36, height:36, borderRadius:99, background:"#fff", border:"1.5px solid #e8e0d4", display:"flex", alignItems:"center", justifyContent:"center" })}><RiUser3Line style={{ fontSize:18, color:"#555" }} /></button>
        <button style={btn({ width:36, height:36, borderRadius:99, background:"#fff", border:"1.5px solid #e8e0d4", display:"flex", alignItems:"center", justifyContent:"center" })}><RiSettingsLine style={{ fontSize:17, color:"#555" }} /></button>
      </div>
      {notifOpen && <NotifPanel notifs={notifs} onClose={() => setNotifOpen(false)} />}
    </div>
  );
}

function NotifPanel({ notifs, onClose }) {
  return (
    <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, width:310, background:"#fff", borderRadius:18, boxShadow:"0 12px 40px rgba(0,0,0,0.14)", border:"1px solid #eee", zIndex:200, overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ padding:"13px 15px", borderBottom:"1px solid #f0ece4", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p style={{ fontWeight:700, fontSize:14, color:"#1c1c1e" }}>Notifications</p>
        <button onClick={onClose} style={btn({ background:"none", color:"#aaa" })}><RiCloseLine style={{ fontSize:18 }} /></button>
      </div>
      {notifs.map(n => (
        <div key={n.id} style={{ padding:"11px 15px", display:"flex", gap:10, alignItems:"flex-start", background:n.read?"#fff":"#fffdf5", borderBottom:"1px solid #f5f0ea", cursor:"pointer" }}
          onMouseEnter={e => e.currentTarget.style.background="#f9f6f0"}
          onMouseLeave={e => e.currentTarget.style.background=n.read?"#fff":"#fffdf5"}>
          <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:n.type==="result"?"#e8f5e9":n.type==="appointment"?"#fce4ec":"#e3f2fd" }}>
            {n.type==="result"?<RiFileTextLine style={{fontSize:15,color:"#388e3c"}}/>:n.type==="appointment"?<RiUserLine style={{fontSize:15,color:"#e91e63"}}/>:<RiCalendarLine style={{fontSize:15,color:"#1976d2"}}/>}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:12, color:"#333", fontWeight:n.read?400:600, lineHeight:1.4 }}>{n.msg}</p>
            <p style={{ fontSize:10.5, color:"#bbb", marginTop:2 }}>{n.time}</p>
          </div>
          {!n.read && <div style={{ width:7, height:7, borderRadius:99, background:"#f5e642", flexShrink:0, marginTop:4 }} />}
        </div>
      ))}
    </div>
  );
}

/* ═══ STAT CARDS ════════════════════════════════════════════════ */
function PatientsCard({ count }) {
  return (
    <div style={{ background:"#f5e642", borderRadius:20, padding:"18px 16px 14px", minHeight:170, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
      <div>
        <p style={{ fontSize:13, fontWeight:600, color:"#5a5000", marginBottom:10 }}>Patients:</p>
        <div style={{ display:"flex", gap:14 }}>
          {[{n:count,r:"07:00–07:30"},{n:5,r:"07:40–10:30"},{n:2,r:"14:00 +"}].map(({n,r},i)=>(
            <div key={i}><p style={{fontSize:22,fontWeight:700,color:"#1c1c1e",lineHeight:1}}>{n}</p><p style={{fontSize:10,color:"#7a6e00",marginTop:1}}>pers.</p><p style={{fontSize:9,color:"#9a8e20",marginTop:2}}>{r}</p></div>
          ))}
        </div>
      </div>
      <div><Sparkbar bars={[40,65,50,80,60,90,70,100,75]} color="#b8ac00" /><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#8a7e10",marginTop:3}}><span>07:30 pm</span><span>12:00 pm</span></div></div>
    </div>
  );
}

function VisitsSummaryCard() {
  return (
    <div style={{ background:"#f5b8c4", borderRadius:20, padding:"18px 16px 14px", minHeight:170, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      <p style={{ fontSize:13, fontWeight:600, color:"#8b3040", marginBottom:8 }}>Visits summary:</p>
      <div style={{ display:"flex", gap:12, marginBottom:8 }}>
        {[{v:"24 min",l:"AVERAGE"},{v:"15 min",l:"MINIMUM"},{v:"01:30 h",l:"MAXIMUM"}].map(({v,l})=>(
          <div key={l}><p style={{fontSize:14,fontWeight:700,color:"#1c1c1e"}}>{v}</p><p style={{fontSize:9,color:"#8b3040",marginTop:1}}>{l}</p></div>
        ))}
      </div>
      <div style={{ flex:1, minHeight:55 }}>
        <ResponsiveContainer width="100%" height={55}>
          <LineChart data={VISIT_DATA}><Line type="monotone" dataKey="v" stroke="#c0304a" strokeWidth={2} dot={false} /><XAxis dataKey="t" hide /><YAxis hide /></LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#8b3040", marginTop:2 }}>
        {["09:30","10:00","10:30","11:00","11:30","12:00"].map(t=><span key={t}>{t}</span>)}
      </div>
    </div>
  );
}

function ConditionCard() {
  return (
    <div style={{ background:"#c5e8a0", borderRadius:20, padding:"18px 16px 14px", minHeight:170, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
      <div>
        <p style={{ fontSize:13, fontWeight:600, color:"#2d5a00", marginBottom:10 }}>By condition:</p>
        <div style={{ display:"flex", gap:14 }}>
          {[{n:"14",l:"STABLE",c:"#3a7a00"},{n:"5",l:"FAIR",c:"#3a7a00"},{n:"1",l:"CRITICAL",c:"#cc3300"}].map(({n,l,c})=>(
            <div key={l}><p style={{fontSize:22,fontWeight:700,color:"#1c1c1e",lineHeight:1}}>{n}</p><p style={{fontSize:10,color:"#2d5a00"}}>pers.</p><p style={{fontSize:9,fontWeight:700,color:c,letterSpacing:"0.06em",marginTop:1}}>{l}</p></div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ display:"flex", gap:3, height:6 }}>
          <div style={{flex:14,background:"#74c411",borderRadius:99}}/><div style={{flex:5,background:"#a8d860",borderRadius:99}}/><div style={{flex:1,background:"#e57373",borderRadius:99}}/>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:5 }}>
          {[{c:"#74c411",l:"Stable"},{c:"#a8d860",l:"Fair"},{c:"#e57373",l:"Critical"}].map(({c,l})=>(
            <span key={l} style={{fontSize:9,color:"#444",display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,borderRadius:99,background:c,display:"inline-block"}}/>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionsCard() {
  return (
    <div style={{ background:"#a8d8ea", borderRadius:20, padding:"18px 16px 14px", minHeight:170, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
      <div>
        <p style={{ fontSize:13, fontWeight:600, color:"#1a4e6e", marginBottom:10 }}>Sessions:</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[{v:"03:45 h",l:"IN CLINIC"},{v:"02:00",l:"VIDEO CALLS"},{v:"00:24",l:"IN CHAT"}].map(({v,l})=>(
            <div key={l}><p style={{fontSize:14,fontWeight:700,color:"#1c1c1e"}}>{v}</p><p style={{fontSize:9,color:"#1a4e6e",marginTop:1}}>{l}</p></div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:6 }}>
        {[{I:RiUserLine,bg:"#3a9abf"},{I:RiVideoLine,bg:"#5ab0d0"},{I:RiChat3Line,bg:"#7ec8e0"}].map(({I,bg},i)=>(
          <div key={i} style={{width:28,height:28,borderRadius:99,background:bg,display:"flex",alignItems:"center",justifyContent:"center"}}><I style={{color:"#fff",fontSize:13}}/></div>
        ))}
      </div>
    </div>
  );
}

/* ═══ CHART ═════════════════════════════════════════════════════ */
function ChartCard() {
  const [range, setRange] = useState("Today");
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"16px 18px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #ede8df", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <p style={{ fontSize:13, fontWeight:600, color:"#222" }}>Visit activity</p>
        <div style={{ display:"flex", gap:4 }}>
          {["Today","Week","Month"].map(r=>(
            <button key={r} onClick={()=>setRange(r)} style={btn({ padding:"4px 10px", borderRadius:99, fontSize:11, fontWeight:500, background:range===r?"#1c1c1e":"#f0ece4", color:range===r?"#fff":"#888" })}>{r}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={VISIT_DATA} margin={{top:5,right:5,left:-25,bottom:0}}>
          <defs>
            <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5e642" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#f5e642" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" vertical={false}/>
          <XAxis dataKey="t" tick={{fontSize:9,fill:"#bbb"}} axisLine={false} tickLine={false} interval={2}/>
          <YAxis tick={{fontSize:9,fill:"#bbb"}} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{background:"#1c1c1e",border:"none",borderRadius:10,color:"#fff",fontSize:11}} cursor={{stroke:"#c8b800",strokeWidth:1,strokeDasharray:"4 4"}}/>
          <Area type="monotone" dataKey="v" stroke="#c8b800" strokeWidth={2.5} fill="url(#vg)" dot={false} activeDot={{r:4,fill:"#f5e642",stroke:"#c8b800"}}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══ PATIENT LIST ══════════════════════════════════════════════ */
function PatientList({ patients, selected, onSelect, filter, setFilter }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #ede8df", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <p style={{ fontSize:13, fontWeight:600, color:"#222" }}>Patient's list</p>
        <div style={{ display:"flex", gap:4 }}>
          {["Today","All"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={btn({ padding:"4px 12px", borderRadius:99, fontSize:11, fontWeight:500, background:filter===f?"#1c1c1e":"#f0ece4", color:filter===f?"#fff":"#888" })}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {patients.map(p=>{
          const style = ss(p.status);
          const isSelected = selected?.id === p.id;
          return (
            <button key={p.id} onClick={()=>onSelect(p)}
              style={btn({ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:14, width:"100%", textAlign:"left", background:isSelected?"#f9f6ee":"transparent", outline:isSelected?"1.5px solid #e8d840":"none" })}
              onMouseEnter={e=>{ if(!isSelected) e.currentTarget.style.background="#faf8f3"; }}
              onMouseLeave={e=>{ if(!isSelected) e.currentTarget.style.background="transparent"; }}
            >
              <div style={{width:34,height:34,borderRadius:99,background:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#333",flexShrink:0}}>{p.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:12.5,fontWeight:600,color:"#222",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</p>
                <p style={{fontSize:10.5,color:"#aaa",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.type}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99,background:style.bg,color:style.color}}>{p.status}</span>
                <p style={{fontSize:10,color:"#bbb",marginTop:2}}>{p.time}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ VISIT DETAILS ═════════════════════════════════════════════ */
function VisitDetails({ patient }) {
  const [tab, setTab] = useState("details");
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    if (patient) setNoteText(`Clinical notes for ${patient.name}:\n\n• Patient presents with ${patient.symptoms.join(", ")}.\n• Vitals within acceptable range.\n• Follow-up recommended in 2 weeks.`);
  }, [patient]);

  if (!patient) return (
    <div style={{ background:"#fff", borderRadius:20, padding:16, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #ede8df", display:"flex", alignItems:"center", justifyContent:"center", minHeight:200, fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ color:"#ccc", fontSize:13 }}>Select a patient to view details</p>
    </div>
  );

  return (
    <div style={{ background:"#fff", borderRadius:20, padding:"16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #ede8df", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{width:34,height:34,borderRadius:99,background:patient.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#333"}}>{patient.initials}</div>
          <div><p style={{fontSize:13,fontWeight:700,color:"#1c1c1e"}}>{patient.name}</p><p style={{fontSize:10,color:"#aaa"}}>{patient.gender} · {patient.age}</p></div>
        </div>
        <span style={{fontSize:9,fontFamily:"monospace",background:"#f0ece4",padding:"3px 7px",borderRadius:6,color:"#888"}}>{patient.id_code}</span>
      </div>
      {/* Tabs */}
      <div style={{ display:"flex", gap:3, marginBottom:10, background:"#f5f0e8", borderRadius:10, padding:3 }}>
        {["details","notes","prescription"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={btn({ flex:1, padding:"5px 4px", borderRadius:8, fontSize:10.5, fontWeight:tab===t?600:400, background:tab===t?"#fff":"transparent", color:tab===t?"#222":"#999", boxShadow:tab===t?"0 1px 4px rgba(0,0,0,0.08)":"none", textTransform:"capitalize" })}>{t}</button>
        ))}
      </div>

      {tab === "details" && (
        <div>
          <p style={{fontSize:10,color:"#aaa",marginBottom:4}}>Symptoms</p>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
            {patient.symptoms.map(s=><span key={s} style={{fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:99,background:"#fce4ec",color:"#c2185b"}}>{s}</span>)}
          </div>
          <p style={{fontSize:11,color:"#666",marginBottom:8}}><span style={{fontWeight:600,color:"#444"}}>Last Checked: </span><span style={{color:"#1976d2"}}>{patient.lastDoc}</span> on {patient.lastDate}</p>
          <div style={{background:"#f9f6f0",borderRadius:12,padding:"10px 12px"}}>
            <p style={{fontSize:10,fontWeight:600,color:"#888",marginBottom:4}}>OBSERVATION</p>
            <p style={{fontSize:12,color:"#444",lineHeight:1.6}}>{patient.obs}</p>
          </div>
        </div>
      )}
      {tab === "notes" && (
        <div>
          <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
            style={{width:"100%",minHeight:110,borderRadius:12,border:"1.5px solid #e8e0d4",padding:"10px 12px",fontSize:12,color:"#444",fontFamily:"'DM Sans',sans-serif",resize:"vertical",outline:"none",lineHeight:1.6,background:"#faf8f4",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor="#c8b800"}
            onBlur={e=>e.target.style.borderColor="#e8e0d4"}
          />
          <button onClick={()=>{ setNoteSaved(true); setTimeout(()=>setNoteSaved(false),1500); }}
            style={btn({ marginTop:6, padding:"7px 16px", borderRadius:10, background:noteSaved?"#4caf50":"#1c1c1e", color:"#fff", fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:5, transition:"background 0.3s" })}>
            {noteSaved?<><RiCheckLine/>Saved!</>:"Save Note"}
          </button>
        </div>
      )}
      {tab === "prescription" && (
        <div>
          <p style={{fontSize:10,fontWeight:600,color:"#888",marginBottom:6}}>CURRENT PRESCRIPTION</p>
          {patient.prescription.map((rx,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:10,background:i%2===0?"#f5f0e8":"#fff",marginBottom:4}}>
              <RiMedicineBottleLine style={{color:"#c8b800",fontSize:14,flexShrink:0}}/>
              <p style={{fontSize:12,color:"#444",flex:1}}>{rx}</p>
            </div>
          ))}
          <button style={btn({ marginTop:8, width:"100%", padding:"7px", borderRadius:10, background:"#f5e642", color:"#1c1c1e", fontSize:11, fontWeight:700 })}>+ Add Prescription</button>
        </div>
      )}
    </div>
  );
}

/* ═══ CALENDAR PANEL ════════════════════════════════════════════ */
function CalendarPanel({ selDate, setSelDate, setShowAdd }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12, fontFamily:"'DM Sans',sans-serif" }}>
      {/* Cal grid */}
      <div style={{ background:"#fff", borderRadius:20, padding:"16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #ede8df" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <button style={btn({ width:26,height:26,borderRadius:99,background:"#f0ece4",display:"flex",alignItems:"center",justifyContent:"center" })}><RiArrowLeftSLine style={{fontSize:15,color:"#666"}}/></button>
          <p style={{ fontSize:13, fontWeight:700, color:"#1c1c1e" }}>May 2024</p>
          <button style={btn({ width:26,height:26,borderRadius:99,background:"#f0ece4",display:"flex",alignItems:"center",justifyContent:"center" })}><RiArrowRightSLine style={{fontSize:15,color:"#666"}}/></button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:4 }}>
          {CAL_DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:9.5,fontWeight:600,color:"#bbb",padding:"2px 0"}}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
          {CAL_GRID.flat().map((d,i)=>(
            <button key={i} onClick={()=>d&&setSelDate(d)}
              style={btn({ textAlign:"center", padding:"6px 0", borderRadius:10, fontSize:11.5, background:d===selDate?"#1c1c1e":d===15&&selDate!==15?"#f5e642":"transparent", color:d===selDate?"#fff":d===15&&selDate!==15?"#1c1c1e":d?"#444":"transparent", fontWeight:(d===selDate||d===15)?700:400, cursor:d?"pointer":"default" })}
              onMouseEnter={e=>{ if(d&&d!==selDate) e.currentTarget.style.background="#f0ece4"; }}
              onMouseLeave={e=>{ if(d&&d!==selDate) e.currentTarget.style.background=d===15?"#f5e642":"transparent"; }}
            >{d||""}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:6, marginTop:12 }}>
          <button onClick={()=>setShowAdd(true)} style={btn({ flex:1, background:"#1c1c1e", color:"#fff", borderRadius:12, padding:"8px 0", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:5 })}
            onMouseEnter={e=>e.currentTarget.style.background="#333"}
            onMouseLeave={e=>e.currentTarget.style.background="#1c1c1e"}
          ><RiAddLine style={{fontSize:15}}/>Add event</button>
          <button style={btn({ width:36,height:36,borderRadius:12,background:"#f0ece4",display:"flex",alignItems:"center",justifyContent:"center" })}><RiRefreshLine style={{fontSize:15,color:"#666"}}/></button>
          <button style={btn({ width:36,height:36,borderRadius:12,background:"#f0ece4",display:"flex",alignItems:"center",justifyContent:"center" })}><RiDownloadLine style={{fontSize:15,color:"#666"}}/></button>
        </div>
      </div>
      {/* Timeline */}
      <div style={{ background:"#fff", borderRadius:20, padding:"16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:"1px solid #ede8df" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <p style={{fontSize:13,fontWeight:700,color:"#1c1c1e"}}>May {selDate}</p>
          <div style={{display:"flex",alignItems:"center",gap:6}}><p style={{fontSize:10,color:"#aaa"}}>Today's timeline</p><button style={btn({fontSize:10,background:"#f0ece4",padding:"3px 8px",borderRadius:99,color:"#666"})}>All ↓</button></div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {SCHEDULE.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <span style={{fontSize:9.5,color:"#aaa",width:32,flexShrink:0,paddingTop:8,textAlign:"right"}}>{item.time}</span>
              <div style={{flex:1,background:item.color,borderRadius:14,padding:"8px 10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <div style={{width:8,height:8,borderRadius:99,background:item.dot,flexShrink:0}}/>
                  <p style={{fontSize:11.5,fontWeight:600,color:"#1c1c1e"}}>{item.title}</p>
                  <span style={{marginLeft:"auto",fontSize:9,padding:"1px 6px",borderRadius:99,background:"rgba(0,0,0,0.08)",color:"#555"}}>{item.tag}</span>
                </div>
                <p style={{fontSize:10,color:"#777",paddingLeft:14}}>{item.location}</p>
                {item.avatars&&<div style={{display:"flex",alignItems:"center",gap:0,paddingLeft:14,marginTop:5}}>{["#f5b8c4","#a8d8ea","#c5e8a0","#f5e642"].map((c,ai)=><div key={ai} style={{width:18,height:18,borderRadius:99,background:c,border:"2px solid #fff",marginLeft:ai>0?-4:0}}/>)}<span style={{fontSize:9,color:"#888",marginLeft:6}}>+4</span></div>}
              </div>
            </div>
          ))}
        </div>
        <button style={btn({ width:"100%", background:"#1c1c1e", color:"#fff", borderRadius:12, padding:"9px 0", fontSize:12, fontWeight:600, marginTop:10 })}
          onMouseEnter={e=>e.currentTarget.style.background="#333"}
          onMouseLeave={e=>e.currentTarget.style.background="#1c1c1e"}
        >View all details</button>
      </div>
    </div>
  );
}

/* ═══ ADD EVENT MODAL ═══════════════════════════════════════════ */
function AddEventModal({ onClose }) {
  const [form, setForm] = useState({ title:"", location:"", date:"", time:"", type:"Appointment" });
  const [saved, setSaved] = useState(false);
  const save = () => {
    if (!form.title || !form.date) return;
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:28, width:"100%", maxWidth:400, fontFamily:"'DM Sans',sans-serif", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <p style={{fontWeight:700,fontSize:17,color:"#1c1c1e"}}>Add New Event</p>
          <button onClick={onClose} style={btn({ background:"#f0ece4", width:32, height:32, borderRadius:99, display:"flex", alignItems:"center", justifyContent:"center" })}><RiCloseLine style={{fontSize:17,color:"#666"}}/></button>
        </div>
        {["title","location","date","time"].map(f=>(
          <div key={f} style={{marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:"#888",textTransform:"capitalize",display:"block",marginBottom:4}}>{f}</label>
            <input type={f==="date"?"date":f==="time"?"time":"text"} placeholder={f==="title"?"Event title...":f==="location"?"Location...":""} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}
              style={{width:"100%",padding:"10px 12px",borderRadius:12,border:"1.5px solid #e8e0d4",fontSize:13,color:"#333",fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#faf8f4",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor="#c8b800"}
              onBlur={e=>e.target.style.borderColor="#e8e0d4"}
            />
          </div>
        ))}
        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,fontWeight:600,color:"#888",display:"block",marginBottom:4}}>Type</label>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{width:"100%",padding:"10px 12px",borderRadius:12,border:"1.5px solid #e8e0d4",fontSize:13,color:"#333",fontFamily:"'DM Sans',sans-serif",outline:"none",background:"#faf8f4"}}>
            {["Appointment","Emergency","Meeting","Test","Follow-up"].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={save} style={btn({ width:"100%", padding:"12px", borderRadius:14, background:saved?"#4caf50":"#1c1c1e", color:"#fff", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"background 0.3s" })}>
          {saved?<><RiCheckLine style={{fontSize:16}}/>Saved!</>:"Save Event"}
        </button>
      </div>
    </div>
  );
}

/* ═══ ROOT ══════════════════════════════════════════════════════ */
export default function DoctorDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [selPatient, setSelPatient] = useState(ALL_PATIENTS[0]);
  const [ptFilter, setPtFilter]   = useState("Today");
  const [selDate, setSelDate]     = useState(15);
  const [showAdd, setShowAdd]     = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs]                  = useState(INIT_NOTIFS);
  const [searchQ, setSearchQ]     = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [time, setTime]           = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const patients = ptFilter === "Today" ? ALL_PATIENTS.slice(0,4) : ALL_PATIENTS;

  return (
    <div style={{ background:"#f5f0e8", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <Sidebar active={activeNav} setActive={setActiveNav} open={menuOpen} setOpen={setMenuOpen} />

      {/* page */}
      <div className="lg:ml-52">
        <div style={{ padding:20 }} className="sm:p-6">
          <TopBar setMenuOpen={setMenuOpen} notifs={notifs} notifOpen={notifOpen} setNotifOpen={setNotifOpen} searchQ={searchQ} setSearchQ={setSearchQ} searchRes={searchRes} setSearchRes={setSearchRes} />

          {/* content grid */}
          <div className="flex flex-col xl:flex-row gap-4">
            {/* center */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {/* greeting row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
                <div>
                  <h1 style={{ fontSize:"clamp(20px,3vw,26px)", fontWeight:700, color:"#1c1c1e", letterSpacing:"-0.5px", margin:0, fontFamily:"'DM Serif Display',serif" }}>{greeting}, Dr. Olivia 👋</h1>
                  <p style={{ fontSize:13, color:"#999", marginTop:4 }}>VitalSync — <span style={{color:"#555",fontWeight:500}}>45 patients</span> waiting · <span style={{color:"#1976d2",fontWeight:500}}>1 live event</span> today</p>
                </div>
                <div style={{ background:"#fff", borderRadius:14, padding:"8px 14px", border:"1px solid #ede8df", textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontSize:18, fontWeight:700, color:"#1c1c1e", fontVariantNumeric:"tabular-nums" }}>{time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</p>
                  <p style={{ fontSize:10, color:"#aaa" }}>{time.toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}</p>
                </div>
              </div>

              {/* stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <PatientsCard count={ALL_PATIENTS.length} />
                <VisitsSummaryCard />
                <ConditionCard />
                <SessionsCard />
              </div>

              <ChartCard />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PatientList patients={patients} selected={selPatient} onSelect={setSelPatient} filter={ptFilter} setFilter={setPtFilter} />
                <VisitDetails patient={selPatient} />
              </div>
            </div>

            {/* right panel */}
            <div className="w-full xl:w-64 xl:shrink-0">
              <div className="xl:sticky xl:top-5">
                <CalendarPanel selDate={selDate} setSelDate={setSelDate} setShowAdd={setShowAdd} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
