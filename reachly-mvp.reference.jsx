import { useState } from "react";
import { Search, ArrowLeftRight, Plane, Train, Bus, Car, Ship, ChevronRight, Clock, Leaf, ArrowRight, SlidersHorizontal, X, MapPin as MapPinIcon, Star, Zap, TrendingDown, Filter, Info } from "lucide-react";

/* ── DATA ───────────────────────────────────────────────────── */
const DESTS = [
  { id:1, name:"Barcelone", country:"Espagne", code:"BCN", emoji:"🇪🇸", img:"🏖️", temp:"27°C", px:18, py:65,
    desc:"Gaudí · plages · tapas · nightlife",
    train:{time:"4h30",price:39,op:"SNCF Renfe",stops:1,co2:0.4},
    bus:{time:"8h45",price:19,op:"FlixBus",stops:0,co2:0.8},
    plane:{time:"1h20",price:55,op:"EasyJet",stops:0,co2:89},
    car:{time:"6h00",price:58,op:"Voiture perso",stops:0,co2:62}},
  { id:2, name:"Milan", country:"Italie", code:"MXP", emoji:"🇮🇹", img:"🏛️", temp:"23°C", px:55, py:52,
    desc:"Mode · design · Duomo · gastronomie",
    train:{time:"3h15",price:29,op:"Trenitalia",stops:0,co2:0.3},
    bus:{time:"7h00",price:15,op:"FlixBus",stops:1,co2:0.6},
    plane:{time:"1h10",price:48,op:"Transavia",stops:0,co2:72},
    car:{time:"4h30",price:46,op:"Voiture perso",stops:0,co2:49}},
  { id:3, name:"Paris", country:"France", code:"CDG", emoji:"🇫🇷", img:"🗼", temp:"22°C", px:30, py:25,
    desc:"Louvre · Tour Eiffel · boulangeries",
    train:{time:"2h00",price:29,op:"TGV INOUI",stops:0,co2:0.2},
    bus:{time:"4h30",price:12,op:"BlaBlaBus",stops:0,co2:0.4},
    plane:null,
    car:{time:"4h30",price:46,op:"Voiture perso",stops:0,co2:49}},
  { id:4, name:"Genève", country:"Suisse", code:"GVA", emoji:"🇨🇭", img:"⛰️", temp:"19°C", px:53, py:43,
    desc:"Lac Léman · montres · nature alpine",
    train:{time:"2h00",price:24,op:"SBB / SNCF",stops:0,co2:0.2},
    bus:null,
    plane:null,
    car:{time:"2h30",price:26,op:"Voiture perso",stops:0,co2:28}},
  { id:5, name:"Marseille", country:"France", code:"MRS", emoji:"🇫🇷", img:"⛵", temp:"28°C", px:34, py:62,
    desc:"Calanques · Vieux-Port · bouillabaisse",
    train:{time:"1h45",price:19,op:"TGV INOUI",stops:0,co2:0.2},
    bus:{time:"3h30",price:9,op:"BlaBlaBus",stops:0,co2:0.3},
    plane:null,
    car:{time:"3h00",price:32,op:"Voiture perso",stops:0,co2:34}},
  { id:6, name:"Amsterdam", country:"Pays-Bas", code:"AMS", emoji:"🇳🇱", img:"🌷", temp:"18°C", px:42, py:18,
    desc:"Canaux · Rijksmuseum · vélos",
    train:{time:"8h00",price:89,op:"Eurostar/Thalys",stops:2,co2:0.8},
    bus:{time:"15h",price:29,op:"FlixBus",stops:1,co2:1.4},
    plane:{time:"1h40",price:65,op:"Transavia",stops:0,co2:105},
    car:{time:"10h",price:98,op:"Voiture perso",stops:0,co2:104}},
  { id:7, name:"Nice", country:"France", code:"NCE", emoji:"🇫🇷", img:"🌊", temp:"28°C", px:50, py:63,
    desc:"Promenade des Anglais · Côte d'Azur",
    train:{time:"3h15",price:24,op:"TGV INOUI",stops:1,co2:0.3},
    bus:{time:"6h00",price:18,op:"FlixBus",stops:0,co2:0.6},
    plane:{time:"1h10",price:52,op:"Air France",stops:0,co2:70},
    car:{time:"4h00",price:41,op:"Voiture perso",stops:0,co2:43}},
  { id:8, name:"Madrid", country:"Espagne", code:"MAD", emoji:"🇪🇸", img:"🎭", temp:"32°C", px:14, py:68,
    desc:"Prado · Retiro · flamenco · sieste",
    train:{time:"7h00",price:59,op:"SNCF Renfe",stops:1,co2:0.7},
    bus:{time:"14h",price:28,op:"Alsa",stops:1,co2:1.2},
    plane:{time:"1h50",price:62,op:"Vueling",stops:0,co2:118},
    car:{time:"9h00",price:86,op:"Voiture perso",stops:0,co2:91}},
  { id:9, name:"Rome", country:"Italie", code:"FCO", emoji:"🇮🇹", img:"🏟️", temp:"29°C", px:63, py:70,
    desc:"Colisée · Vatican · pasta · storia",
    train:{time:"6h30",price:69,op:"Trenitalia",stops:1,co2:0.6},
    bus:{time:"14h",price:24,op:"FlixBus",stops:2,co2:1.3},
    plane:{time:"1h30",price:72,op:"Ryanair",stops:0,co2:94},
    car:{time:"8h00",price:82,op:"Voiture perso",stops:0,co2:87}},
  { id:10, name:"Zurich", country:"Suisse", code:"ZRH", emoji:"🇨🇭", img:"🏔️", temp:"20°C", px:58, py:35,
    desc:"Finance · Vieille-Ville · lacs alpins",
    train:{time:"3h30",price:36,op:"SBB / SNCF",stops:0,co2:0.3},
    bus:null,
    plane:null,
    car:{time:"4h00",price:40,op:"Voiture perso",stops:0,co2:43}},
];

const MODES = {
  train:{ label:"Train",       color:"#F97316", bg:"#FFF7ED", border:"#FED7AA", Icon:Train  },
  bus:  { label:"Bus",         color:"#16A34A", bg:"#F0FDF4", border:"#BBF7D0", Icon:Bus    },
  plane:{ label:"Avion",       color:"#0063DC", bg:"#EFF6FF", border:"#BFDBFE", Icon:Plane  },
  car:  { label:"Voiture",     color:"#6B7280", bg:"#F9FAFB", border:"#E5E7EB", Icon:Car    },
};

const DEST_COLORS = ["#0063DC","#F97316","#16A34A","#7C3AED","#EC4899","#0891B2","#D97706","#9333EA","#059669","#DC2626"];

function getMinMode(dest, activeModes) {
  let best = null, bestPrice = Infinity;
  activeModes.forEach(m => { if (dest[m] && dest[m].price < bestPrice) { bestPrice = dest[m].price; best = m; } });
  return best;
}

/* ── COMPONENTS ─────────────────────────────────────────────── */
function TransportBadge({ mode, small }) {
  const m = MODES[mode];
  const I = m.Icon;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding: small ? "2px 8px" : "4px 10px",
      borderRadius:6, fontSize: small ? 11 : 12, fontWeight:600,
      background:m.bg, color:m.color, border:`1px solid ${m.border}`
    }}>
      <I size={small ? 10 : 12} /> {m.label}
    </span>
  );
}

function RouteStep({ mode, op, stops }) {
  const m = MODES[mode];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#374151" }}>
      <div style={{ width:28, height:28, borderRadius:8, background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${m.border}`, flexShrink:0 }}>
        <m.Icon size={14} color={m.color} />
      </div>
      <div>
        <span style={{ fontWeight:500 }}>{op}</span>
        {stops > 0 && <span style={{ color:"#9CA3AF", marginLeft:6, fontSize:12 }}>· {stops} correspondance{stops>1?"s":""}</span>}
      </div>
    </div>
  );
}

function TransportCard({ mode, data, dest, from, isBest, isLowest, onClick }) {
  const m = MODES[mode];
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:0,
        background:"#fff",
        border:`1px solid ${isBest ? m.border : "#E5E7EB"}`,
        borderLeft:`4px solid ${m.color}`,
        borderRadius:12, overflow:"hidden",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
        transition:"all 0.18s", cursor:"pointer",
        position:"relative",
      }}>
      {isBest && (
        <div style={{
          position:"absolute", top:0, right:12,
          background:m.color, color:"#fff",
          fontSize:10, fontWeight:700, padding:"2px 8px",
          borderRadius:"0 0 6px 6px", letterSpacing:"0.03em"
        }}>⭐ MEILLEUR</div>
      )}
      {isLowest && !isBest && (
        <div style={{
          position:"absolute", top:0, right:12,
          background:"#16A34A", color:"#fff",
          fontSize:10, fontWeight:700, padding:"2px 8px",
          borderRadius:"0 0 6px 6px"
        }}>💰 MOINS CHER</div>
      )}

      {/* Mode icon col */}
      <div style={{
        width:64, flexShrink:0, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", padding:"16px 8px",
        background: m.bg, borderRight:`1px solid ${m.border}`,
        gap:4
      }}>
        <m.Icon size={24} color={m.color} />
        <span style={{ fontSize:10, fontWeight:600, color:m.color }}>{m.label}</span>
      </div>

      {/* Route col */}
      <div style={{ flex:1, padding:"14px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{from}</span>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ flex:1, height:1, background:"#E5E7EB", position:"relative" }}>
              <div style={{
                position:"absolute", left:"50%", top:-4, transform:"translateX(-50%)",
                width:8, height:8, borderRadius:"50%", background:m.color
              }}/>
            </div>
          </div>
          <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{dest.name}</span>
        </div>
        <RouteStep mode={mode} op={data.op} stops={data.stops} />
      </div>

      {/* Time col */}
      <div style={{
        padding:"14px 12px", textAlign:"center", flexShrink:0,
        borderLeft:"1px solid #F3F4F6"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:4, color:"#6B7280", marginBottom:4 }}>
          <Clock size={12} />
          <span style={{ fontSize:13, fontWeight:500, color:"#374151" }}>{data.time}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11 }}>
          <Leaf size={10} color={data.co2 < 5 ? "#16A34A" : "#F97316"} />
          <span style={{ color: data.co2 < 5 ? "#16A34A" : "#F97316", fontWeight:500 }}>{data.co2} kg CO₂</span>
        </div>
      </div>

      {/* Price + CTA */}
      <div style={{
        padding:"14px 16px", textAlign:"right", flexShrink:0,
        borderLeft:"1px solid #F3F4F6", minWidth:100
      }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#111827", lineHeight:1 }}>{data.price}€</div>
        <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:10 }}>par personne</div>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:4,
          padding:"7px 12px", borderRadius:8, fontSize:12, fontWeight:600,
          background: isBest ? m.color : "#F3F4F6",
          color: isBest ? "#fff" : "#374151",
          cursor:"pointer"
        }}>
          Voir <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}

function DestCard({ dest, color, activeModes, onClick, selected }) {
  const bestMode = getMinMode(dest, activeModes);
  const bestData = bestMode ? dest[bestMode] : null;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"#fff", borderRadius:16, overflow:"hidden", cursor:"pointer",
        border: selected ? `2px solid ${color}` : "1px solid #E5E7EB",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 1px 6px rgba(0,0,0,0.06)",
        transition:"all 0.2s", transform: hovered ? "translateY(-3px)" : "none"
      }}>
      {/* Image area */}
      <div style={{
        height:110, background:`linear-gradient(135deg, ${color}15, ${color}30)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        position:"relative", fontSize:52
      }}>
        {dest.img}
        {bestData && (
          <div style={{
            position:"absolute", bottom:8, right:8,
            background:"rgba(255,255,255,0.95)", backdropFilter:"blur(4px)",
            borderRadius:8, padding:"3px 8px", fontSize:12, fontWeight:700, color:"#111827",
            boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
          }}>
            dès {bestData.price}€
          </div>
        )}
        <div style={{
          position:"absolute", top:8, left:8,
          background:"rgba(255,255,255,0.95)", borderRadius:20, padding:"2px 8px",
          fontSize:10, fontWeight:600, color:"#374151"
        }}>{dest.emoji} {dest.country}</div>
      </div>

      {/* Info */}
      <div style={{ padding:"12px 14px" }}>
        <div style={{ fontWeight:700, fontSize:15, color:"#111827", marginBottom:4 }}>{dest.name}</div>
        <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:8, lineHeight:1.4 }}>{dest.desc.split("·")[0].trim()}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {bestMode && <TransportBadge mode={bestMode} small />}
          {bestData && (
            <span style={{ fontSize:11, color:"#6B7280", display:"flex", alignItems:"center", gap:3 }}>
              <Clock size={10} />{bestData.time}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── MAP PIN ─────────────────────────────────────────────────── */
function MapPin({ dest, color, active, onClick, activeModes }) {
  const bestMode = getMinMode(dest, activeModes);
  const bestData = bestMode ? dest[bestMode] : null;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position:"absolute",
        left:`${dest.px}%`, top:`${dest.py}%`,
        transform:"translate(-50%,-50%)",
        cursor:"pointer", zIndex: hovered ? 20 : 5,
        transition:"all 0.2s", opacity: active ? 1 : 0.25
      }}>
      {/* Tooltip */}
      {hovered && active && (
        <div style={{
          position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)",
          background:"#111827", color:"#fff", borderRadius:8, padding:"6px 10px",
          fontSize:11, whiteSpace:"nowrap", pointerEvents:"none",
          boxShadow:"0 4px 12px rgba(0,0,0,0.25)"
        }}>
          <div style={{ fontWeight:600, marginBottom:2 }}>{dest.emoji} {dest.name}</div>
          {bestData && <div style={{ color:"#9CA3AF" }}>{bestMode && MODES[bestMode].label} · {bestData.price}€ · {bestData.time}</div>}
          <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", width:8, height:8, background:"#111827", clipPath:"polygon(0 0,100% 0,50% 100%)" }}/>
        </div>
      )}
      {/* Pin */}
      {active && bestData ? (
        <div style={{
          background:"#fff", borderRadius:8, padding:"3px 8px",
          fontSize:11, fontWeight:700, color:"#111827",
          border:`2px solid ${color}`,
          boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.12)",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          transition:"all 0.15s"
        }}>
          {bestData.price}€
          <div style={{
            position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%)",
            width:0, height:0, borderLeft:"5px solid transparent", borderRight:"5px solid transparent",
            borderTop:`5px solid ${color}`
          }}/>
        </div>
      ) : (
        <div style={{
          width:10, height:10, borderRadius:"50%",
          background: active ? color : "#D1D5DB",
          border:"2px solid white",
          boxShadow:"0 1px 4px rgba(0,0,0,0.2)"
        }}/>
      )}
    </div>
  );
}

/* ── MAIN APP ─────────────────────────────────────────────────── */
export default function Reachly() {
  const [tab, setTab] = useState("explore");
  const [timeMax, setTimeMax] = useState(5);
  const [budget, setBudget] = useState(150);
  const [activeModes, setActiveModes] = useState(["train","bus","plane","car"]);
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const [from, setFrom] = useState("Lyon");
  const [toSearch, setToSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2200); };

  const toggleMode = m => setActiveModes(p => p.includes(m) ? (p.length>1?p.filter(x=>x!==m):p) : [...p,m]);

  const visible = DESTS.filter(d => {
    const best = getMinMode(d, activeModes);
    if (!best) return false;
    if (d[best].price > budget) return false;
    return activeModes.some(m => d[m] && parseFloat(d[m].time) <= timeMax + 1.5);
  });

  const compareOptions = selected
    ? activeModes.filter(m=>selected[m]).map(m=>({mode:m,...selected[m]})).sort((a,b)=>
        sortBy==="price" ? a.price-b.price : parseFloat(a.time)-parseFloat(b.time)
      )
    : [];

  const lowestPrice = compareOptions.length ? Math.min(...compareOptions.map(o=>o.price)) : null;
  const fastestTime = compareOptions.length ? Math.min(...compareOptions.map(o=>parseFloat(o.time))) : null;

  const handleDestSelect = d => { setSelected(d); setToSearch(d.name); setTab("compare"); };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#F5F7FA", minHeight:"100vh", fontSize:14, WebkitFontSmoothing:"antialiased" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ background:"linear-gradient(135deg,#0055C8 0%,#0077EE 100%)", padding:"16px 20px 0" }}>
        {/* Nav */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"6px 12px" }}>
              <span style={{ fontWeight:800, fontSize:18, color:"#fff", letterSpacing:"-0.5px" }}>Reachly</span>
            </div>
            <span style={{ fontSize:10, background:"rgba(255,255,255,0.2)", color:"#fff", padding:"2px 8px", borderRadius:20, fontWeight:600 }}>BETA</span>
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", display:"flex", alignItems:"center", gap:4 }}>
            <MapPinIcon size={12}/> Lyon, France
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4 }}>
          {[
            { id:"explore", label:"🗺️  Explorer", desc:"Découvrir des destinations" },
            { id:"compare", label:"⚡  Comparer", desc:"Comparer les transports" },
          ].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:"10px 20px 14px", border:"none", cursor:"pointer", borderRadius:"10px 10px 0 0",
              background: tab===t.id ? "#F5F7FA" : "rgba(255,255,255,0.12)",
              color: tab===t.id ? "#0055C8" : "rgba(255,255,255,0.85)",
              fontWeight: tab===t.id ? 700 : 500, fontSize:13, fontFamily:"inherit",
              transition:"all 0.15s"
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── EXPLORE TAB ───────────────────────────────────────────── */}
      {tab==="explore" && (
        <div>
          {/* Search + Filters bar */}
          <div style={{ background:"#fff", padding:"16px 20px", borderBottom:"1px solid #E5E7EB", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:220 }}>
              <div style={{ position:"relative", flex:1 }}>
                <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9CA3AF" }}/>
                <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Depuis…" style={{
                  width:"100%", padding:"9px 10px 9px 32px", borderRadius:8, border:"1px solid #E5E7EB",
                  fontSize:13, fontFamily:"inherit", outline:"none", color:"#111827", background:"#F9FAFB"
                }}/>
              </div>
            </div>

            {/* Mode toggles */}
            <div style={{ display:"flex", gap:5 }}>
              {Object.entries(MODES).map(([k,v]) => (
                <button key={k} onClick={()=>toggleMode(k)} style={{
                  display:"flex", alignItems:"center", gap:4, padding:"7px 10px",
                  borderRadius:8, border:`1px solid ${activeModes.includes(k) ? v.color : "#E5E7EB"}`,
                  background: activeModes.includes(k) ? v.bg : "#fff",
                  color: activeModes.includes(k) ? v.color : "#9CA3AF",
                  cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit",
                  transition:"all 0.15s"
                }}>
                  <v.Icon size={13}/><span>{v.label}</span>
                </button>
              ))}
            </div>

            {/* Filters btn */}
            <button onClick={()=>setShowFilters(!showFilters)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
              borderRadius:8, border:`1px solid ${showFilters?"#0063DC":"#E5E7EB"}`,
              background: showFilters?"#EFF6FF":"#fff", color: showFilters?"#0063DC":"#6B7280",
              cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit"
            }}>
              <SlidersHorizontal size={13}/> Filtres
              <span style={{ background: showFilters?"#0063DC":"#E5E7EB", color: showFilters?"#fff":"#6B7280", borderRadius:20, padding:"1px 6px", fontSize:10, fontWeight:700 }}>2</span>
            </button>
          </div>

          {/* Filter sliders */}
          {showFilters && (
            <div style={{ background:"#EFF6FF", borderBottom:"1px solid #BFDBFE", padding:"14px 20px", display:"flex", gap:32, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"flex", alignItems:"center", gap:5 }}>
                    <Clock size={12} color="#0063DC"/> Durée maximale
                  </label>
                  <span style={{ fontSize:13, fontWeight:700, color:"#0063DC" }}>{timeMax}h</span>
                </div>
                <input type="range" min="1" max="12" step="1" value={timeMax} onChange={e=>setTimeMax(+e.target.value)}
                  style={{ width:"100%", accentColor:"#0063DC" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#9CA3AF", marginTop:4 }}>
                  <span>1h</span><span>12h</span>
                </div>
              </div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:"#374151" }}>💰 Budget max</label>
                  <span style={{ fontSize:13, fontWeight:700, color:"#0063DC" }}>{budget}€</span>
                </div>
                <input type="range" min="20" max="300" step="10" value={budget} onChange={e=>setBudget(+e.target.value)}
                  style={{ width:"100%", accentColor:"#0063DC" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#9CA3AF", marginTop:4 }}>
                  <span>20€</span><span>300€</span>
                </div>
              </div>
            </div>
          )}

          {/* MAP ZONE */}
          <div style={{ margin:"16px 20px", borderRadius:16, overflow:"hidden", border:"1px solid #E5E7EB", background:"#EBF5FF", position:"relative", height:340 }}>
            {/* Europe SVG background */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.5 }}>
              <rect width="100" height="100" fill="#DBEAFE"/>
              {/* Simplified Europe landmass shapes */}
              <path d="M15,15 Q25,10 40,12 Q52,10 62,14 Q74,18 80,28 Q86,38 84,52 Q82,62 76,70 Q68,80 58,84 Q46,88 34,84 Q22,80 14,68 Q6,56 8,42 Q10,28 15,15Z" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="0.5"/>
              <path d="M20,35 Q28,28 38,30 Q50,32 54,42 Q52,54 44,60 Q34,58 26,50 Q18,44 20,35Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="0.3"/>
              <path d="M60,15 Q68,12 76,18 Q80,26 76,34 Q70,38 64,34 Q58,28 60,15Z" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="0.3"/>
              {/* Grid lines */}
              {[20,40,60,80].map(x=><line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(147,197,253,0.4)" strokeWidth="0.3" strokeDasharray="2,4"/>)}
              {[20,40,60,80].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(147,197,253,0.4)" strokeWidth="0.3" strokeDasharray="2,4"/>)}
            </svg>

            {/* Lyon origin */}
            <div style={{ position:"absolute", left:"38%", top:"46%", transform:"translate(-50%,-50%)", zIndex:15 }}>
              <div style={{
                background:"#0063DC", color:"#fff", borderRadius:8, padding:"4px 10px",
                fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:5,
                boxShadow:"0 4px 12px rgba(0,99,220,0.4)"
              }}>
                <MapPinIcon size={11}/> Lyon
              </div>
              <div style={{ position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)", width:12, height:12, background:"#0063DC", borderRadius:"50%", border:"2px solid #fff", boxShadow:"0 0 0 4px rgba(0,99,220,0.2)" }}/>
            </div>

            {/* Destination pins */}
            {DESTS.map((d,i) => (
              <MapPin key={d.id} dest={d} color={DEST_COLORS[i%DEST_COLORS.length]} active={visible.includes(d)} onClick={()=>handleDestSelect(d)} activeModes={activeModes}/>
            ))}

            {/* Counter badge */}
            <div style={{
              position:"absolute", bottom:12, right:12,
              background:"rgba(255,255,255,0.95)", backdropFilter:"blur(8px)",
              border:"1px solid #E5E7EB", borderRadius:10, padding:"6px 12px",
              fontSize:12, fontWeight:600, color:"#374151",
              boxShadow:"0 2px 8px rgba(0,0,0,0.08)"
            }}>
              {visible.length} destinations · {timeMax}h max · {budget}€ max
            </div>
          </div>

          {/* Results grid */}
          <div style={{ padding:"0 20px 24px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div>
                <span style={{ fontSize:17, fontWeight:700, color:"#111827" }}>Destinations accessibles</span>
                <span style={{ marginLeft:8, fontSize:12, color:"#0063DC", background:"#EFF6FF", padding:"2px 8px", borderRadius:20, fontWeight:600 }}>{visible.length}</span>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                {[{k:"price",l:"💰 Prix"},{k:"time",l:"⏱ Rapidité"}].map(s=>(
                  <button key={s.k} onClick={()=>setSortBy(s.k)} style={{
                    padding:"5px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                    background: sortBy===s.k?"#0063DC":"#fff",
                    color: sortBy===s.k?"#fff":"#6B7280",
                    border: sortBy===s.k?"1px solid #0063DC":"1px solid #E5E7EB"
                  }}>{s.l}</button>
                ))}
              </div>
            </div>
            {visible.length===0 ? (
              <div style={{ textAlign:"center", padding:"48px 20px", color:"#9CA3AF" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:14 }}>Aucune destination avec ces filtres.<br/>Augmente le budget ou la durée.</div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:12 }}>
                {[...visible]
                  .sort((a,b)=>{
                    const ma=getMinMode(a,activeModes), mb=getMinMode(b,activeModes);
                    if(!ma||!mb) return 0;
                    return sortBy==="price" ? a[ma].price-b[mb].price : parseFloat(a[ma].time)-parseFloat(b[mb].time);
                  })
                  .map((d,i)=>(
                    <DestCard key={d.id} dest={d} color={DEST_COLORS[i%DEST_COLORS.length]}
                      activeModes={activeModes} onClick={()=>handleDestSelect(d)} selected={selected?.id===d.id}/>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── COMPARE TAB ─────────────────────────────────────────── */}
      {tab==="compare" && (
        <div>
          {/* Search widget */}
          <div style={{ background:"#fff", padding:"16px 20px", borderBottom:"1px solid #E5E7EB" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", maxWidth:600 }}>
              {/* From */}
              <div style={{ flex:1, position:"relative" }}>
                <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:10, fontWeight:700, color:"#0063DC", background:"#EFF6FF", padding:"1px 6px", borderRadius:4 }}>DE</div>
                <input value={from} onChange={e=>setFrom(e.target.value)} style={{
                  width:"100%", padding:"11px 10px 11px 46px", borderRadius:10,
                  border:"1px solid #E5E7EB", fontSize:13, fontFamily:"inherit",
                  fontWeight:600, color:"#111827", outline:"none", background:"#F9FAFB"
                }}/>
              </div>
              {/* Swap */}
              <button onClick={()=>{ const t=from; setFrom(toSearch||""); setToSearch(t); }} style={{
                width:36, height:36, borderRadius:"50%", border:"1px solid #E5E7EB",
                background:"#fff", cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0, color:"#6B7280"
              }}>
                <ArrowLeftRight size={14}/>
              </button>
              {/* To */}
              <div style={{ flex:1, position:"relative" }}>
                <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:10, fontWeight:700, color:"#16A34A", background:"#F0FDF4", padding:"1px 6px", borderRadius:4 }}>À</div>
                <input list="dest-opts" value={toSearch} onChange={e=>{
                  setToSearch(e.target.value);
                  const f=DESTS.find(d=>d.name.toLowerCase()===e.target.value.toLowerCase());
                  if(f) setSelected(f);
                }} placeholder="Destination…" style={{
                  width:"100%", padding:"11px 10px 11px 42px", borderRadius:10,
                  border:"1px solid #E5E7EB", fontSize:13, fontFamily:"inherit",
                  fontWeight:600, color:"#111827", outline:"none", background:"#F9FAFB"
                }}/>
                <datalist id="dest-opts">{DESTS.map(d=><option key={d.id} value={d.name}/>)}</datalist>
              </div>
              {/* Search btn */}
              <button onClick={()=>{
                const f=DESTS.find(d=>d.name.toLowerCase().includes(toSearch.toLowerCase()));
                if(f){ setSelected(f); setToSearch(f.name); }
                else if(toSearch) showToast("Destination pas encore disponible 🔜");
              }} style={{
                padding:"11px 18px", background:"#0063DC", color:"#fff",
                borderRadius:10, border:"none", fontWeight:700, fontSize:13,
                cursor:"pointer", fontFamily:"inherit", flexShrink:0,
                display:"flex", alignItems:"center", gap:6
              }}>
                <Search size={14}/> Chercher
              </button>
            </div>

            {/* Quick picks */}
            <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:11, color:"#9CA3AF", padding:"5px 0", alignSelf:"center" }}>Populaires :</span>
              {DESTS.slice(0,6).map(d=>(
                <button key={d.id} onClick={()=>{setSelected(d);setToSearch(d.name);}} style={{
                  padding:"4px 12px", borderRadius:20, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                  background: selected?.id===d.id?"#EFF6FF":"#F9FAFB",
                  border: selected?.id===d.id?"1px solid #0063DC":"1px solid #E5E7EB",
                  color: selected?.id===d.id?"#0063DC":"#374151", fontWeight:500
                }}>{d.emoji} {d.name}</button>
              ))}
            </div>
          </div>

          {selected ? (
            <div style={{ padding:"16px 20px" }}>
              {/* Destination header card */}
              <div style={{ background:"#fff", borderRadius:14, padding:"16px 20px", marginBottom:16, border:"1px solid #E5E7EB", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:56, height:56, borderRadius:14, background:`linear-gradient(135deg,${DEST_COLORS[DESTS.findIndex(d=>d.id===selected.id)%DEST_COLORS.length]}15,${DEST_COLORS[DESTS.findIndex(d=>d.id===selected.id)%DEST_COLORS.length]}30)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>
                  {selected.img}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:800, color:"#111827" }}>{selected.emoji} {selected.name}</div>
                  <div style={{ fontSize:12, color:"#9CA3AF" }}>{selected.country} · {selected.desc}</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:22, fontWeight:800, color:"#111827" }}>{selected.temp}</div>
                  <div style={{ fontSize:10, color:"#9CA3AF" }}>actuellement</div>
                </div>
              </div>

              {/* Sort bar */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div>
                  <span style={{ fontSize:15, fontWeight:700, color:"#111827" }}>
                    {from} → {selected.name}
                  </span>
                  <span style={{ marginLeft:8, fontSize:12, color:"#6B7280" }}>
                    {compareOptions.length} option{compareOptions.length>1?"s":""}
                  </span>
                </div>
                <div style={{ display:"flex", gap:5 }}>
                  <button onClick={()=>setSortBy("price")} style={{
                    padding:"5px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                    background:sortBy==="price"?"#0063DC":"#fff", color:sortBy==="price"?"#fff":"#6B7280",
                    border:sortBy==="price"?"1px solid #0063DC":"1px solid #E5E7EB",
                    display:"flex", alignItems:"center", gap:4
                  }}><TrendingDown size={11}/>Prix</button>
                  <button onClick={()=>setSortBy("time")} style={{
                    padding:"5px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                    background:sortBy==="time"?"#0063DC":"#fff", color:sortBy==="time"?"#fff":"#6B7280",
                    border:sortBy==="time"?"1px solid #0063DC":"1px solid #E5E7EB",
                    display:"flex", alignItems:"center", gap:4
                  }}><Zap size={11}/>Durée</button>
                </div>
              </div>

              {/* Summary stats */}
              {compareOptions.length > 0 && (
                <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                  {[
                    { label:"Plus économique", value:`${lowestPrice}€`, sub:compareOptions.find(o=>o.price===lowestPrice)?.mode, icon:"💰" },
                    { label:"Plus rapide",      value:`${fastestTime}h`, sub:compareOptions.find(o=>parseFloat(o.time)===fastestTime)?.mode, icon:"⚡" },
                    { label:"Plus écologique",  value:`${Math.min(...compareOptions.map(o=>o.co2))} kg`, sub:"CO₂", icon:"🌱" },
                  ].map((s,i) => (
                    <div key={i} style={{ flex:1, background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:"12px 14px" }}>
                      <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:4 }}>{s.icon} {s.label}</div>
                      <div style={{ fontSize:18, fontWeight:800, color:"#111827" }}>{s.value}</div>
                      {s.sub && MODES[s.sub] && <TransportBadge mode={s.sub} small/>}
                    </div>
                  ))}
                </div>
              )}

              {/* Transport cards — Rome2Rio style */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {compareOptions.length===0 ? (
                  <div style={{ background:"#fff", borderRadius:12, padding:"32px", textAlign:"center", color:"#9CA3AF", border:"1px solid #E5E7EB" }}>
                    Aucun transport actif pour cette destination
                  </div>
                ) : compareOptions.map((r,i) => (
                  <TransportCard key={r.mode} mode={r.mode} data={r} dest={selected} from={from}
                    isBest={i===0} isLowest={r.price===lowestPrice && i!==0}
                    onClick={()=>showToast(`Redirection vers ${MODES[r.mode].label} — ${r.price}€ ✓`)}/>
                ))}
              </div>

              {/* CO2 bar chart */}
              <div style={{ background:"#fff", borderRadius:14, padding:"16px 20px", marginTop:14, border:"1px solid #E5E7EB" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                  <Leaf size={14} color="#16A34A"/> Impact CO₂ comparé
                </div>
                {compareOptions.map(r => {
                  const m = MODES[r.mode];
                  const maxCo2 = Math.max(...compareOptions.map(x=>x.co2));
                  const pct = Math.max(4, (r.co2/maxCo2)*100);
                  const good = r.co2 < 5;
                  return (
                    <div key={r.mode} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <div style={{ width:60, display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
                        <m.Icon size={13} color={m.color}/>
                        <span style={{ fontSize:11, color:"#6B7280" }}>{m.label}</span>
                      </div>
                      <div style={{ flex:1, height:8, background:"#F3F4F6", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:good?"#16A34A":r.co2<50?"#F97316":"#EF4444", borderRadius:4, transition:"width 0.5s ease" }}/>
                      </div>
                      <span style={{ fontSize:11, color: good?"#16A34A":r.co2<50?"#F97316":"#EF4444", fontWeight:600, minWidth:46, textAlign:"right" }}>
                        {good?"🌿":"💨"} {r.co2} kg
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Book CTA */}
              {compareOptions.length>0 && (()=>{
                const best = compareOptions[0];
                const BtnIcon = MODES[best.mode].Icon;
                return (
                  <button onClick={()=>showToast(`Redirection partenaire — ${MODES[best.mode].label} ${best.price}€ ✓`)}
                    style={{
                      width:"100%", padding:"15px", marginTop:14,
                      background:"#0063DC", color:"#fff", border:"none",
                      borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer",
                      fontFamily:"inherit", display:"flex", alignItems:"center",
                      justifyContent:"center", gap:10
                    }}>
                    <BtnIcon size={16}/>
                    Réserver en {MODES[best.mode].label} — {best.price}€
                    <ArrowRight size={16}/>
                  </button>
                );
              })()}
              <p style={{ textAlign:"center", fontSize:11, color:"#9CA3AF", marginTop:8 }}>
                Prix indicatifs · Redirection vers l'opérateur · Affiliation Reachly
              </p>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"64px 24px", color:"#9CA3AF" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✈️</div>
              <div style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:8 }}>Où veux-tu aller ?</div>
              <div style={{ fontSize:13 }}>Cherche une destination ou clique sur une ville dans Explorer</div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign:"center", padding:"16px", fontSize:11, color:"#9CA3AF", borderTop:"1px solid #E5E7EB", background:"#fff" }}>
        Reachly · MVP v0.2 · Données simulées · Powered by ❤️
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:"#111827", color:"#fff", padding:"11px 20px", borderRadius:12,
          fontSize:13, fontWeight:500, boxShadow:"0 8px 24px rgba(0,0,0,0.25)",
          zIndex:200, animation:"fadein 0.25s ease-out", whiteSpace:"nowrap"
        }}>
          {toast}
        </div>
      )}
      <style>{`@keyframes fadein{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}
