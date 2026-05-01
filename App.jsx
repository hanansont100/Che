import { useState, useEffect } from "react";

const DEFAULT_PETS = [
  { id: "leo", name: "豹紋守宮", emoji: "🦎", color: "#E8A838", bg: "#FFF8EC", accent: "#C97D10", feedInterval: 2, icon: "leopard", acquireDate: "", feedLogs: [] },
  { id: "frog", name: "角蛙", emoji: "🐸", color: "#5A9E4A", bg: "#F0F8EC", accent: "#3A7A2A", feedInterval: 3, icon: "frog", acquireDate: "", feedLogs: [] },
  { id: "fat", name: "肥尾守宮", emoji: "🦎", color: "#C4934A", bg: "#FBF4EC", accent: "#8A5E20", feedInterval: 2, icon: "fattail", acquireDate: "", feedLogs: [] },
];

const FOODS = [
  { id: "cockroach", label: "蟑螂", emoji: "🪳" },
  { id: "cricket", label: "蟋蟀", emoji: "🦗" },
  { id: "mealworm", label: "麵包蟲", emoji: "🐛" },
];

const SPECIES_PRESETS = [
  { name: "豹紋守宮", emoji: "🦎", icon: "leopard", color: "#E8A838", bg: "#FFF8EC", accent: "#C97D10" },
  { name: "肥尾守宮", emoji: "🦎", icon: "fattail", color: "#C4934A", bg: "#FBF4EC", accent: "#8A5E20" },
  { name: "角蛙",     emoji: "🐸", icon: "frog",    color: "#5A9E4A", bg: "#F0F8EC", accent: "#3A7A2A" },
  { name: "玉米蛇",   emoji: "🐍", icon: "snake",   color: "#D4614A", bg: "#FDF0EE", accent: "#A03820" },
  { name: "球蟒",     emoji: "🐍", icon: "snake",   color: "#7A6A4A", bg: "#F5F2EC", accent: "#4A3A20" },
  { name: "鬃獅蜥",   emoji: "🦎", icon: "lizard",  color: "#D4A44A", bg: "#FDF8EC", accent: "#A07020" },
  { name: "藍舌石龍子", emoji: "🦎", icon: "lizard", color: "#5A8AAA", bg: "#EEF4F8", accent: "#2A5A7A" },
  { name: "自定義",   emoji: "✨", icon: "lizard",  color: "#9B59B6", bg: "#F8F0FC", accent: "#6C3483" },
];

const COLOR_PALETTES = [
  { color: "#E8A838", bg: "#FFF8EC", accent: "#C97D10" },
  { color: "#5A9E4A", bg: "#F0F8EC", accent: "#3A7A2A" },
  { color: "#C4934A", bg: "#FBF4EC", accent: "#8A5E20" },
  { color: "#D4614A", bg: "#FDF0EE", accent: "#A03820" },
  { color: "#5A8AAA", bg: "#EEF4F8", accent: "#2A5A7A" },
  { color: "#9B59B6", bg: "#F8F0FC", accent: "#6C3483" },
  { color: "#E74C8B", bg: "#FEF0F6", accent: "#A42060" },
  { color: "#2ECC71", bg: "#EDFDF5", accent: "#1A7A44" },
];

const today = () => new Date().toISOString().split("T")[0];

function calcAge(dateStr) {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  const now = new Date();
  const days = Math.floor((now - birth) / 86400000);
  const months = Math.floor(days / 30.4375);
  const years = Math.floor(months / 12);
  if (years > 0) return `${years}歲 ${months % 12}個月`;
  if (months > 0) return `${months}個月 ${days % 30}天`;
  return `${days}天`;
}

function daysUntilFeed(lastFeedDate, interval) {
  if (!lastFeedDate) return 0;
  const next = new Date(lastFeedDate);
  next.setDate(next.getDate() + interval);
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((next - now) / 86400000);
}

function PetIcon({ type, color, size = 60 }) {
  const s = size;
  if (type === "leopard") return (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <ellipse cx="40" cy="48" rx="22" ry="16" fill={color} opacity="0.9"/>
      <ellipse cx="40" cy="32" rx="14" ry="12" fill={color}/>
      <circle cx="34" cy="29" r="3" fill="rgba(0,0,0,0.3)"/>
      <circle cx="46" cy="29" r="3" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx="35" cy="28" rx="1.5" ry="2" fill="white" opacity="0.6"/>
      <ellipse cx="47" cy="28" rx="1.5" ry="2" fill="white" opacity="0.6"/>
      {[28,34,40,46,52,30,38,44,50].map((cx,i)=><circle key={i} cx={cx} cy={44+(i%3)*5} r="2.5" fill="rgba(160,80,0,0.35)"/>)}
      <line x1="22" y1="48" x2="8" y2="44" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="58" y1="48" x2="72" y2="52" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="30" y1="60" x2="26" y2="72" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="60" x2="54" y2="72" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <path d="M52 58 Q60 60 68 55" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if (type === "frog") return (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <ellipse cx="40" cy="52" rx="22" ry="16" fill={color} opacity="0.85"/>
      <ellipse cx="40" cy="36" rx="16" ry="13" fill={color}/>
      <circle cx="28" cy="28" r="7" fill={color}/>
      <circle cx="52" cy="28" r="7" fill={color}/>
      <circle cx="28" cy="28" r="4" fill="#1a1a1a"/>
      <circle cx="52" cy="28" r="4" fill="#1a1a1a"/>
      <circle cx="26" cy="26" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="50" cy="26" r="1.5" fill="white" opacity="0.8"/>
      <path d="M34 42 Q40 46 46 42" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" fill="none"/>
      <line x1="20" y1="60" x2="12" y2="70" stroke={color} strokeWidth="5" strokeLinecap="round"/>
      <line x1="60" y1="60" x2="68" y2="70" stroke={color} strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
  if (type === "fattail") return (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <ellipse cx="40" cy="50" rx="20" ry="14" fill={color} opacity="0.85"/>
      <ellipse cx="40" cy="34" rx="13" ry="11" fill={color}/>
      <circle cx="34" cy="31" r="3" fill="rgba(0,0,0,0.3)"/>
      <circle cx="46" cy="31" r="3" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx="35" cy="30" rx="1.5" ry="2" fill="white" opacity="0.6"/>
      <ellipse cx="47" cy="30" rx="1.5" ry="2" fill="white" opacity="0.6"/>
      <ellipse cx="40" cy="58" rx="9" ry="6" fill={color} opacity="0.7"/>
      <line x1="22" y1="50" x2="8" y2="46" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="58" y1="50" x2="72" y2="54" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="30" y1="62" x2="26" y2="74" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="50" y1="62" x2="54" y2="74" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <path d="M54 60 Q62 56 66 48" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if (type === "snake") return (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <path d="M15 65 Q10 50 20 40 Q30 30 40 35 Q55 42 60 30 Q65 18 55 15" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round"/>
      <ellipse cx="55" cy="14" rx="8" ry="6" fill={color}/>
      <circle cx="52" cy="12" r="2" fill="rgba(0,0,0,0.4)"/>
      <circle cx="58" cy="12" r="2" fill="rgba(0,0,0,0.4)"/>
    </svg>
  );
  // lizard / default
  return (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <ellipse cx="38" cy="46" rx="20" ry="13" fill={color} opacity="0.9"/>
      <ellipse cx="38" cy="32" rx="13" ry="10" fill={color}/>
      <circle cx="32" cy="29" r="3" fill="rgba(0,0,0,0.3)"/>
      <circle cx="44" cy="29" r="3" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx="33" cy="28" rx="1.5" ry="2" fill="white" opacity="0.6"/>
      <ellipse cx="45" cy="28" rx="1.5" ry="2" fill="white" opacity="0.6"/>
      <line x1="20" y1="46" x2="6"  y2="42" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="56" y1="46" x2="70" y2="50" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="28" y1="58" x2="24" y2="70" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <line x1="48" y1="58" x2="52" y2="70" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      <path d="M56 55 Q65 52 70 44" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

const loadData = () => {
  try {
    const s = localStorage.getItem("reptile_app_v2");
    if (s) return JSON.parse(s);
  } catch {}
  return { pets: DEFAULT_PETS };
};

const BLANK_FORM = { name: "", emoji: "🦎", icon: "lizard", color: "#E8A838", bg: "#FFF8EC", accent: "#C97D10", feedInterval: 3, acquireDate: "" };

export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("home");
  const [activePetId, setActivePetId] = useState(null);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [feedForm, setFeedForm] = useState({ food: "cockroach", note: "", date: today() });
  const [showAcquireModal, setShowAcquireModal] = useState(false);
  const [acquireDate, setAcquireDate] = useState("");
  const [showPetModal, setShowPetModal] = useState(false);
  const [petModalMode, setPetModalMode] = useState("add");
  const [petForm, setPetForm] = useState(BLANK_FORM);
  const [petFormStep, setPetFormStep] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("reptile_app_v2", JSON.stringify(data)); } catch {}
  }, [data]);

  const activePet = data.pets.find(p => p.id === activePetId);
  const urgentPets = data.pets.filter(p => {
    const last = p.feedLogs?.length ? p.feedLogs[p.feedLogs.length-1].date : null;
    return daysUntilFeed(last, p.feedInterval) <= 0;
  });

  const updatePet = (id, patch) =>
    setData(d => ({ ...d, pets: d.pets.map(p => p.id === id ? { ...p, ...patch } : p) }));

  function recordFeed(petId) {
    const pet = data.pets.find(p => p.id === petId);
    updatePet(petId, { feedLogs: [...(pet?.feedLogs||[]), { ...feedForm, id: Date.now() }] });
    setShowFeedModal(false);
    setFeedForm({ food: "cockroach", note: "", date: today() });
  }

  const deleteLog = (petId, logId) => {
    const pet = data.pets.find(p => p.id === petId);
    updatePet(petId, { feedLogs: pet.feedLogs.filter(l => l.id !== logId) });
  };

  function openAdd() {
    setPetForm(BLANK_FORM); setPetModalMode("add"); setPetFormStep(1); setShowPetModal(true);
  }
  function openEdit(pet) {
    setPetForm({ name: pet.name, emoji: pet.emoji, icon: pet.icon, color: pet.color, bg: pet.bg, accent: pet.accent, feedInterval: pet.feedInterval, acquireDate: pet.acquireDate||"" });
    setPetModalMode("edit"); setPetFormStep(2); setShowPetModal(true);
  }
  function savePet() {
    if (!petForm.name.trim()) return;
    if (petModalMode === "add") {
      setData(d => ({ ...d, pets: [...d.pets, { ...petForm, id:"pet_"+Date.now(), feedLogs:[], acquireDate:petForm.acquireDate||"" }] }));
    } else {
      updatePet(activePetId, petForm);
    }
    setShowPetModal(false);
  }
  function deletePet(id) {
    setData(d => ({ ...d, pets: d.pets.filter(p => p.id !== id) }));
    setActivePetId(null); setShowDeleteConfirm(false); setTab("pets");
  }

  const selectPreset = (sp) => {
    setPetForm(f => ({ ...f, name: sp.name === "自定義" ? "" : sp.name, emoji: sp.emoji, icon: sp.icon, color: sp.color, bg: sp.bg, accent: sp.accent }));
    setPetFormStep(2);
  };

  /* ─── RENDER ─── */
  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:"#F7F4EE", minHeight:"100vh", maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Fredoka+One&display=swap');
        *{box-sizing:border-box} ::-webkit-scrollbar{display:none}
        .card{transition:transform .13s;cursor:pointer} .card:active{transform:scale(.97)}
        .btn{transition:transform .1s;cursor:pointer} .btn:active{transform:scale(.93)}
        input{font-family:inherit}
      `}</style>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#2D5016,#4A7C1F)", padding:"18px 20px 14px", color:"white", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:"rgba(255,255,255,.2)", borderRadius:14, padding:"6px 9px", fontSize:26 }}>🦎</div>
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:20 }}>爬寵餵食日誌</div>
            <div style={{ fontSize:11, opacity:.75 }}>Reptile Feeding Tracker</div>
          </div>
          {urgentPets.length > 0 && (
            <div style={{ marginLeft:"auto", background:"#FF6B35", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700 }}>
              ⚠️ {urgentPets.length} 需餵食
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"white", borderBottom:"2px solid #E8E4DC", flexShrink:0 }}>
        {[{id:"home",label:"首頁",icon:"🏠"},{id:"pets",label:"寵物",icon:"🦎"},{id:"logs",label:"記錄",icon:"📋"}].map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);if(t.id!=="pets")setActivePetId(null);}} className="btn"
            style={{ flex:1, border:"none", background:"none", padding:"10px 0", fontSize:12, fontWeight:tab===t.id?700:400, color:tab===t.id?"#4A7C1F":"#999", borderBottom:tab===t.id?"3px solid #4A7C1F":"3px solid transparent" }}>
            <div style={{fontSize:16}}>{t.icon}</div>{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 80px" }}>

        {/* HOME */}
        {tab==="home" && <>
          <div style={{ fontSize:12, color:"#999", marginBottom:10 }}>
            {new Date().toLocaleDateString("zh-TW",{year:"numeric",month:"long",day:"numeric",weekday:"long"})}
          </div>
          {urgentPets.length>0 && (
            <div style={{ background:"#FFF3EE", border:"1.5px solid #FF6B35", borderRadius:14, padding:"12px 14px", marginBottom:14 }}>
              <div style={{ fontWeight:700, color:"#FF6B35", marginBottom:6, fontSize:13 }}>🔔 餵食提醒</div>
              {urgentPets.map(p=>(
                <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{fontSize:13}}>{p.emoji} {p.name}</span>
                  <button onClick={()=>{setActivePetId(p.id);setShowFeedModal(true);}} className="btn"
                    style={{ background:"#FF6B35", color:"white", border:"none", borderRadius:18, padding:"3px 12px", fontSize:12, fontWeight:700 }}>餵食</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontWeight:700, color:"#333", fontSize:14, marginBottom:10 }}>寵物狀態總覽</div>
          {data.pets.length===0 && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#bbb" }}>
              <div style={{fontSize:44}}>🦎</div>
              <div style={{marginTop:10,fontSize:13}}>還沒有寵物<br/>到「寵物」頁面新增吧！</div>
            </div>
          )}
          {data.pets.map(pet=>{
            const lastLog=pet.feedLogs?.length?pet.feedLogs[pet.feedLogs.length-1]:null;
            const daysLeft=daysUntilFeed(lastLog?.date,pet.feedInterval);
            const isUrgent=daysLeft<=0;
            const food=FOODS.find(f=>f.id===lastLog?.food);
            return (
              <div key={pet.id} className="card" onClick={()=>{setActivePetId(pet.id);setTab("pets");}}
                style={{ background:"white", borderRadius:16, padding:"12px 14px", marginBottom:10, boxShadow:"0 2px 10px rgba(0,0,0,.07)", border:isUrgent?"2px solid #FF6B35":"2px solid transparent" }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{background:pet.bg,borderRadius:12,padding:6,flexShrink:0}}>
                    <PetIcon type={pet.icon} color={pet.color} size={52}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:15,color:"#222"}}>{pet.emoji} {pet.name}</div>
                    {pet.acquireDate&&<div style={{fontSize:11,color:"#999"}}>🎂 {calcAge(pet.acquireDate)}</div>}
                    <div style={{fontSize:11,color:"#aaa",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {lastLog?`上次：${lastLog.date} ${food?.emoji||""} ${food?.label||""}`:"尚未餵食"}
                    </div>
                  </div>
                  <div style={{ background:isUrgent?"#FF6B35":daysLeft<=1?"#FFC107":"#E8F5E9", color:isUrgent?"white":daysLeft<=1?"#7a5500":"#2D7A1F", borderRadius:18, padding:"4px 9px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", flexShrink:0 }}>
                    {isUrgent?"需餵食！":`${daysLeft}天後`}
                  </div>
                </div>
              </div>
            );
          })}
        </>}

        {/* PETS */}
        {tab==="pets" && <>
          {!activePetId ? (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:700,color:"#333",fontSize:15}}>我的寵物（{data.pets.length}）</div>
                <button onClick={openAdd} className="btn"
                  style={{ background:"linear-gradient(135deg,#4A7C1F,#2D5016)", color:"white", border:"none", borderRadius:20, padding:"7px 16px", fontSize:13, fontWeight:700 }}>
                  ＋ 新增寵物
                </button>
              </div>
              {data.pets.length===0 && (
                <div style={{textAlign:"center",padding:"50px 0",color:"#bbb"}}>
                  <div style={{fontSize:50}}>🦎</div>
                  <div style={{marginTop:10,fontSize:14}}>點擊「新增寵物」開始吧！</div>
                </div>
              )}
              {data.pets.map(pet=>(
                <div key={pet.id} className="card" onClick={()=>setActivePetId(pet.id)}
                  style={{background:"white",borderRadius:18,padding:"14px",marginBottom:12,boxShadow:"0 3px 12px rgba(0,0,0,.07)",border:`2px solid ${pet.color}22`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{background:pet.bg,borderRadius:14,padding:8,flexShrink:0}}>
                      <PetIcon type={pet.icon} color={pet.color} size={56}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:16,color:"#222"}}>{pet.emoji} {pet.name}</div>
                      <div style={{fontSize:12,color:"#aaa"}}>{pet.feedLogs?.length||0} 筆餵食記錄</div>
                      {pet.acquireDate&&<div style={{fontSize:12,color:pet.accent,fontWeight:600}}>🎂 {calcAge(pet.acquireDate)}</div>}
                    </div>
                    <div style={{color:"#ccc",fontSize:22}}>›</div>
                  </div>
                </div>
              ))}
            </>
          ) : activePet ? (
            <>
              <button onClick={()=>setActivePetId(null)} className="btn"
                style={{background:"none",border:"none",color:"#4A7C1F",fontSize:13,marginBottom:10,padding:"4px 0",fontWeight:600}}>
                ← 返回列表
              </button>

              {/* Pet header card */}
              <div style={{background:activePet.bg,borderRadius:20,padding:"18px",marginBottom:14,textAlign:"center",border:`2px solid ${activePet.color}30`,position:"relative"}}>
                <button onClick={()=>openEdit(activePet)} className="btn"
                  style={{position:"absolute",top:12,right:12,background:"white",border:`1.5px solid ${activePet.color}55`,borderRadius:20,padding:"4px 12px",fontSize:12,color:activePet.accent,fontWeight:600}}>
                  ✏️ 編輯
                </button>
                <PetIcon type={activePet.icon} color={activePet.color} size={64}/>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:activePet.accent,marginTop:6}}>{activePet.emoji} {activePet.name}</div>
                {activePet.acquireDate ? (
                  <div style={{fontSize:12,color:"#777",marginTop:4}}>
                    📅 入住：{activePet.acquireDate}　🎂 年齡：<b>{calcAge(activePet.acquireDate)}</b>
                    <br/>
                    <button onClick={()=>{setAcquireDate(activePet.acquireDate);setShowAcquireModal(true);}} className="btn"
                      style={{marginTop:6,background:"transparent",color:activePet.accent,border:`1px solid ${activePet.color}88`,borderRadius:16,padding:"3px 12px",fontSize:11}}>
                      修改日期
                    </button>
                  </div>
                ) : (
                  <button onClick={()=>{setAcquireDate("");setShowAcquireModal(true);}} className="btn"
                    style={{marginTop:8,background:activePet.color,color:"white",border:"none",borderRadius:18,padding:"5px 16px",fontSize:12}}>
                    ＋ 設定入住日期
                  </button>
                )}
              </div>

              {/* Feed interval */}
              <div style={{background:"white",borderRadius:14,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:14,fontWeight:600,color:"#444"}}>⏰ 餵食周期</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={()=>updatePet(activePet.id,{feedInterval:Math.max(1,activePet.feedInterval-1)})} className="btn"
                    style={{width:28,height:28,borderRadius:8,border:"1.5px solid #ddd",background:"white",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontWeight:700,fontSize:18,minWidth:40,textAlign:"center",color:activePet.accent}}>{activePet.feedInterval}天</span>
                  <button onClick={()=>updatePet(activePet.id,{feedInterval:activePet.feedInterval+1})} className="btn"
                    style={{width:28,height:28,borderRadius:8,border:"1.5px solid #ddd",background:"white",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              </div>

              {/* Feed button */}
              <button onClick={()=>setShowFeedModal(true)} className="btn"
                style={{width:"100%",background:`linear-gradient(135deg,${activePet.color},${activePet.accent})`,color:"white",border:"none",borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,marginBottom:14,boxShadow:`0 4px 14px ${activePet.color}55`}}>
                🍽️ 記錄餵食
              </button>

              {/* Logs */}
              <div style={{fontWeight:700,color:"#333",fontSize:13,marginBottom:8}}>餵食記錄（{activePet.feedLogs?.length||0}）</div>
              {!activePet.feedLogs?.length ? (
                <div style={{textAlign:"center",padding:"24px 0",color:"#ccc",fontSize:13}}>尚無記錄</div>
              ) : (
                [...(activePet.feedLogs||[])].reverse().map(log=>{
                  const food=FOODS.find(f=>f.id===log.food);
                  return (
                    <div key={log.id} style={{background:"white",borderRadius:12,padding:"10px 12px",marginBottom:7,display:"flex",alignItems:"center",gap:9,boxShadow:"0 1px 5px rgba(0,0,0,.06)"}}>
                      <span style={{fontSize:20}}>{food?.emoji}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13}}>{food?.label}</div>
                        <div style={{fontSize:11,color:"#aaa"}}>{log.date}{log.note?` · ${log.note}`:""}</div>
                      </div>
                      <button onClick={()=>deleteLog(activePet.id,log.id)} className="btn"
                        style={{background:"#FEE",border:"none",color:"#E44",borderRadius:7,padding:"3px 8px",fontSize:12}}>✕</button>
                    </div>
                  );
                })
              )}

              {/* Delete */}
              <div style={{marginTop:20,textAlign:"center"}}>
                <button onClick={()=>setShowDeleteConfirm(true)} className="btn"
                  style={{background:"none",border:"1.5px solid #E44",color:"#E44",borderRadius:20,padding:"7px 20px",fontSize:13}}>
                  🗑️ 刪除此寵物
                </button>
              </div>
            </>
          ) : null}
        </>}

        {/* LOGS */}
        {tab==="logs" && <>
          <div style={{fontWeight:700,color:"#333",fontSize:15,marginBottom:14}}>📋 所有餵食記錄</div>
          {data.pets.map(pet=>{
            const logs=[...(pet.feedLogs||[])].reverse();
            if(!logs.length) return null;
            return (
              <div key={pet.id} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <div style={{background:pet.bg,borderRadius:10,padding:"3px 6px"}}><PetIcon type={pet.icon} color={pet.color} size={36}/></div>
                  <span style={{fontWeight:700,color:pet.accent,fontSize:14}}>{pet.emoji} {pet.name}</span>
                  <span style={{fontSize:11,color:"#bbb"}}>{logs.length} 筆</span>
                </div>
                {logs.map(log=>{
                  const food=FOODS.find(f=>f.id===log.food);
                  return (
                    <div key={log.id} style={{background:"white",borderRadius:11,padding:"9px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:9,borderLeft:`4px solid ${pet.color}`}}>
                      <span style={{fontSize:18}}>{food?.emoji}</span>
                      <div style={{flex:1}}>
                        <span style={{fontWeight:600,fontSize:13}}>{food?.label}</span>
                        <span style={{fontSize:11,color:"#aaa",marginLeft:8}}>{log.date}</span>
                        {log.note&&<div style={{fontSize:11,color:"#bbb"}}>{log.note}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {data.pets.every(p=>!p.feedLogs?.length) && (
            <div style={{textAlign:"center",padding:"60px 0",color:"#ccc"}}>
              <div style={{fontSize:46}}>🦎</div>
              <div style={{marginTop:10,fontSize:13}}>還沒有餵食記錄</div>
            </div>
          )}
        </>}
      </div>

      {/* ═══ FEED MODAL ═══ */}
      {showFeedModal && activePet && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}>
          <div style={{background:"white",borderRadius:"22px 22px 0 0",padding:"22px 18px 40px",width:"100%",maxWidth:430}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:19,color:activePet.accent,marginBottom:14}}>🍽️ 餵食 {activePet.name}</div>
            <div style={{fontSize:12,color:"#888",marginBottom:7}}>食物種類</div>
            <div style={{display:"flex",gap:9,marginBottom:14}}>
              {FOODS.map(f=>(
                <button key={f.id} onClick={()=>setFeedForm(v=>({...v,food:f.id}))} className="btn"
                  style={{flex:1,padding:"11px 0",borderRadius:13,border:feedForm.food===f.id?`2.5px solid ${activePet.color}`:"2px solid #eee",background:feedForm.food===f.id?activePet.bg:"white",fontSize:22,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  {f.emoji}
                  <span style={{fontSize:11,fontWeight:feedForm.food===f.id?700:400,color:feedForm.food===f.id?activePet.accent:"#aaa"}}>{f.label}</span>
                </button>
              ))}
            </div>
            <div style={{fontSize:12,color:"#888",marginBottom:5}}>日期</div>
            <input type="date" value={feedForm.date} onChange={e=>setFeedForm(v=>({...v,date:e.target.value}))}
              style={{width:"100%",padding:"10px 12px",borderRadius:11,border:"1.5px solid #E0E0E0",fontSize:14,marginBottom:10,outline:"none"}}/>
            <div style={{fontSize:12,color:"#888",marginBottom:5}}>備註（選填）</div>
            <input type="text" placeholder="例：吃了3隻..." value={feedForm.note} onChange={e=>setFeedForm(v=>({...v,note:e.target.value}))}
              style={{width:"100%",padding:"10px 12px",borderRadius:11,border:"1.5px solid #E0E0E0",fontSize:14,marginBottom:18,outline:"none"}}/>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setShowFeedModal(false)} className="btn"
                style={{flex:1,padding:"13px",borderRadius:13,border:"1.5px solid #ddd",background:"white",fontSize:14,color:"#999"}}>取消</button>
              <button onClick={()=>recordFeed(activePet.id)} className="btn"
                style={{flex:2,padding:"13px",borderRadius:13,border:"none",background:`linear-gradient(135deg,${activePet.color},${activePet.accent})`,color:"white",fontSize:14,fontWeight:700}}>
                ✓ 確認記錄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ACQUIRE DATE MODAL ═══ */}
      {showAcquireModal && activePet && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
          <div style={{background:"white",borderRadius:22,padding:"22px",width:"100%",maxWidth:360}}>
            <div style={{fontWeight:700,fontSize:17,color:"#333",marginBottom:14}}>📅 設定入住日期</div>
            <input type="date" value={acquireDate} onChange={e=>setAcquireDate(e.target.value)}
              style={{width:"100%",padding:"11px 12px",borderRadius:11,border:"1.5px solid #E0E0E0",fontSize:15,marginBottom:18,outline:"none"}}/>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setShowAcquireModal(false)} className="btn"
                style={{flex:1,padding:"11px",borderRadius:12,border:"1.5px solid #ddd",background:"white",fontSize:13,color:"#999"}}>取消</button>
              <button onClick={()=>{updatePet(activePet.id,{acquireDate});setShowAcquireModal(false);}} className="btn"
                style={{flex:2,padding:"11px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${activePet.color},${activePet.accent})`,color:"white",fontSize:13,fontWeight:700}}>確認</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ADD / EDIT PET MODAL ═══ */}
      {showPetModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200}}>
          <div style={{background:"white",borderRadius:"24px 24px 0 0",padding:"22px 18px 44px",width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>

            {/* Step 1 – species picker */}
            {petModalMode==="add" && petFormStep===1 && <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:"#2D5016"}}>🦎 選擇種類</div>
                <button onClick={()=>setShowPetModal(false)} className="btn"
                  style={{background:"#f0f0f0",border:"none",borderRadius:20,width:30,height:30,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {SPECIES_PRESETS.map(sp=>(
                  <button key={sp.name} onClick={()=>selectPreset(sp)} className="btn"
                    style={{background:sp.bg,border:`2px solid ${sp.color}44`,borderRadius:16,padding:"14px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <PetIcon type={sp.icon} color={sp.color} size={50}/>
                    <span style={{fontSize:13,fontWeight:700,color:sp.accent}}>{sp.name}</span>
                  </button>
                ))}
              </div>
            </>}

            {/* Step 2 – details */}
            {petFormStep===2 && <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:"#2D5016"}}>
                  {petModalMode==="add"?"➕ 新增寵物":"✏️ 編輯寵物"}
                </div>
                <button onClick={()=>setShowPetModal(false)} className="btn"
                  style={{background:"#f0f0f0",border:"none",borderRadius:20,width:30,height:30,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>

              {/* Preview */}
              <div style={{background:petForm.bg,borderRadius:16,padding:"14px",textAlign:"center",marginBottom:16,border:`2px solid ${petForm.color}33`}}>
                <PetIcon type={petForm.icon} color={petForm.color} size={60}/>
                <div style={{fontSize:16,fontWeight:700,color:petForm.accent,marginTop:6}}>{petForm.emoji} {petForm.name||"（未命名）"}</div>
              </div>

              <div style={{fontSize:12,color:"#888",marginBottom:5}}>名字 *</div>
              <input type="text" placeholder="例：小花、Mochi..." value={petForm.name} onChange={e=>setPetForm(f=>({...f,name:e.target.value}))}
                style={{width:"100%",padding:"10px 12px",borderRadius:11,border:"1.5px solid #E0E0E0",fontSize:14,marginBottom:12,outline:"none"}}/>

              <div style={{fontSize:12,color:"#888",marginBottom:5}}>表情符號</div>
              <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
                {["🦎","🐸","🐍","🦕","🐊","🦖","🦜","🐢","🐉","✨"].map(e=>(
                  <button key={e} onClick={()=>setPetForm(f=>({...f,emoji:e}))} className="btn"
                    style={{width:36,height:36,borderRadius:9,border:petForm.emoji===e?`2.5px solid ${petForm.color}`:"1.5px solid #eee",background:petForm.emoji===e?petForm.bg:"white",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {e}
                  </button>
                ))}
              </div>

              <div style={{fontSize:12,color:"#888",marginBottom:5}}>顏色主題</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {COLOR_PALETTES.map((p,i)=>(
                  <button key={i} onClick={()=>setPetForm(f=>({...f,color:p.color,bg:p.bg,accent:p.accent}))} className="btn"
                    style={{width:30,height:30,borderRadius:"50%",background:p.color,border:petForm.color===p.color?"3px solid #333":"2px solid white",boxShadow:"0 1px 4px rgba(0,0,0,.18)"}}/>
                ))}
              </div>

              <div style={{fontSize:12,color:"#888",marginBottom:5}}>入住日期（選填）</div>
              <input type="date" value={petForm.acquireDate} onChange={e=>setPetForm(f=>({...f,acquireDate:e.target.value}))}
                style={{width:"100%",padding:"10px 12px",borderRadius:11,border:"1.5px solid #E0E0E0",fontSize:14,marginBottom:12,outline:"none"}}/>

              <div style={{fontSize:12,color:"#888",marginBottom:5}}>餵食周期</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <button onClick={()=>setPetForm(f=>({...f,feedInterval:Math.max(1,f.feedInterval-1)}))} className="btn"
                  style={{width:32,height:32,borderRadius:9,border:"1.5px solid #ddd",background:"white",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontWeight:700,fontSize:20,minWidth:50,textAlign:"center",color:petForm.accent}}>{petForm.feedInterval}天</span>
                <button onClick={()=>setPetForm(f=>({...f,feedInterval:f.feedInterval+1}))} className="btn"
                  style={{width:32,height:32,borderRadius:9,border:"1.5px solid #ddd",background:"white",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>

              <div style={{display:"flex",gap:9}}>
                {petModalMode==="add" && (
                  <button onClick={()=>setPetFormStep(1)} className="btn"
                    style={{flex:1,padding:"13px",borderRadius:13,border:"1.5px solid #ddd",background:"white",fontSize:13,color:"#888"}}>← 返回</button>
                )}
                <button onClick={savePet} disabled={!petForm.name.trim()} className="btn"
                  style={{flex:2,padding:"13px",borderRadius:13,border:"none",background:petForm.name.trim()?`linear-gradient(135deg,${petForm.color},${petForm.accent})`:"#ddd",color:"white",fontSize:14,fontWeight:700,opacity:petForm.name.trim()?1:0.6}}>
                  {petModalMode==="add"?"✓ 新增寵物":"✓ 儲存變更"}
                </button>
              </div>
            </>}
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRM ═══ */}
      {showDeleteConfirm && activePet && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20}}>
          <div style={{background:"white",borderRadius:22,padding:"24px",width:"100%",maxWidth:340,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:8}}>🗑️</div>
            <div style={{fontWeight:700,fontSize:17,color:"#333",marginBottom:8}}>確定要刪除？</div>
            <div style={{fontSize:13,color:"#888",marginBottom:20}}>將刪除「{activePet.name}」及所有餵食記錄，<br/>此操作無法復原。</div>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setShowDeleteConfirm(false)} className="btn"
                style={{flex:1,padding:"12px",borderRadius:12,border:"1.5px solid #ddd",background:"white",fontSize:14,color:"#888"}}>取消</button>
              <button onClick={()=>deletePet(activePet.id)} className="btn"
                style={{flex:1,padding:"12px",borderRadius:12,border:"none",background:"#E44",color:"white",fontSize:14,fontWeight:700}}>確認刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
