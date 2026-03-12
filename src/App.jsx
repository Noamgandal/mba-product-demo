import { useState, useEffect, useRef } from "react";

const TR_TEAL = "#4A9B7F";
const TR_TEAL_LIGHT = "#E8F5F0";
const TR_TEAL_DARK = "#2D7A60";
const TR_TEXT = "#1A1A1A";
const TR_MUTED = "#6B7280";

const TASKERS_ERRAND = [
  { name: "Marcus T.", rating: 4.97, reviews: 312, tasks: 847, rate: 28, badge: "Top Rated", vehicle: true, avatar: "MT", color: "#E8D5B7", bio: "Fast, reliable, and careful with your items. Same-day available.", tags: ["Errands", "Delivery", "Shopping"] },
  { name: "Sofia R.", rating: 4.92, reviews: 178, tasks: 423, rate: 24, badge: "Elite Tasker", vehicle: true, avatar: "SR", color: "#D4E8D4", bio: "Organized and detail-oriented. Happy to handle grocery runs & pickups.", tags: ["Errands", "Grocery", "Pickup"] },
  { name: "James K.", rating: 4.88, reviews: 94, tasks: 201, rate: 21, badge: "Great Value", vehicle: false, avatar: "JK", color: "#D4D4E8", bio: "Quick on foot or transit. Perfect for local deliveries & errands.", tags: ["Errands", "Local Delivery"] },
];
const TASKERS_FURNITURE = [
  { name: "Alex P.", rating: 4.99, reviews: 521, tasks: 1203, rate: 35, badge: "Top Rated", vehicle: true, avatar: "AP", color: "#F0E0D0", bio: "IKEA specialist. Fast, clean, and no leftover screws. Guaranteed.", tags: ["Furniture", "IKEA", "Assembly"] },
  { name: "Dana M.", rating: 4.94, reviews: 287, tasks: 634, rate: 30, badge: "Elite Tasker", vehicle: true, avatar: "DM", color: "#D0E8E0", bio: "10+ years experience. Handles complex wardrobes, beds, and shelving.", tags: ["Furniture", "Assembly", "Heavy Lifting"] },
  { name: "Chris L.", rating: 4.85, reviews: 112, tasks: 298, rate: 26, badge: "Great Value", vehicle: false, avatar: "CL", color: "#E0D0F0", bio: "Efficient and tidy. Brings all tools needed.", tags: ["Furniture", "Assembly"] },
];
const TASKERS_CLEANING = [
  { name: "Maria G.", rating: 5.0, reviews: 643, tasks: 1540, rate: 32, badge: "Top Rated", vehicle: false, avatar: "MG", color: "#F0D0D0", bio: "Thorough and trustworthy. Clients rebook every time.", tags: ["Cleaning", "Deep Clean", "Recurring"] },
  { name: "Tom B.", rating: 4.91, reviews: 198, tasks: 412, rate: 27, badge: "Elite Tasker", vehicle: false, avatar: "TB", color: "#D0F0E8", bio: "Move-in/out specialist. Leaves the place spotless.", tags: ["Cleaning", "Move-in", "Move-out"] },
  { name: "Nina W.", rating: 4.83, reviews: 87, tasks: 189, rate: 23, badge: "Great Value", vehicle: false, avatar: "NW", color: "#F0F0D0", bio: "Eco-friendly products. Great with pets and kids around.", tags: ["Cleaning", "Eco-friendly"] },
];

const TASKER_POOLS = { errand: TASKERS_ERRAND, furniture: TASKERS_FURNITURE, cleaning: TASKERS_CLEANING };

const SCENARIOS = [
  { key: "errand",    icon: "🛍️", label: "Run an Errand",       desc: "Grocery pickup, delivery, waiting in line", firstPrefill: "I need someone to run an errand for me" },
  { key: "furniture", icon: "🪑", label: "Furniture Assembly",   desc: "IKEA, flatpack, wardrobes & more",          firstPrefill: "I need help assembling furniture" },
  { key: "cleaning",  icon: "🧹", label: "Home Cleaning",        desc: "Standard, deep clean, or move-in/out",      firstPrefill: "I need my apartment cleaned" },
];

const SCRIPTS = {
  errand: [
    { id: 0, from: "ai",   text: "Hi there! 👋 I'm your TaskRabbit assistant. Tell me what you need help with today, and I'll find the perfect Tasker for you." },
    { id: 1, from: "user", text: "I need someone to run an errand for me" },
    { id: 2, from: "ai",   text: "Got it — errands! Tell me a bit more. What needs to be done? For example: pick up groceries, drop off a package, wait in line, etc.", prefill: "Pick up groceries from Whole Foods and deliver them to my apartment" },
    { id: 3, from: "user", text: "Pick up groceries from Whole Foods and deliver them to my apartment" },
    { id: 4, from: "ai",   text: "Perfect. About how long do you think this will take?", prefill: "About 1–2 hours" },
    { id: 5, from: "user", text: "About 1–2 hours" },
    { id: 6, from: "ai",   text: "Will the Tasker need a car or truck to complete this errand?", prefill: "Yes, they'll need a car" },
    { id: 7, from: "user", text: "Yes, they'll need a car" },
    { id: 8, from: "ai",   text: "All set! Here's what I captured:", summary: { category: "Run Errands", description: "Pick up groceries from Whole Foods and deliver to apartment", duration: "1–2 hours", vehicle: "Car required" }, cta: true },
  ],
  furniture: [
    { id: 0, from: "ai",   text: "Hi there! 👋 I'm your TaskRabbit assistant. Tell me what you need help with today, and I'll find the perfect Tasker for you." },
    { id: 1, from: "user", text: "I need help assembling furniture" },
    { id: 2, from: "ai",   text: "Happy to help with furniture assembly! What are you putting together — IKEA, another brand, or something custom?", prefill: "A large IKEA wardrobe, the PAX system" },
    { id: 3, from: "user", text: "A large IKEA wardrobe, the PAX system" },
    { id: 4, from: "ai",   text: "Got it, PAX wardrobes can be tricky! Do you have all the parts ready, or does the Tasker need to bring tools too?", prefill: "I have everything, just need someone with experience" },
    { id: 5, from: "user", text: "I have everything, just need someone with experience" },
    { id: 6, from: "ai",   text: "Understood. About how many hours do you expect this to take?", prefill: "Probably 2–3 hours" },
    { id: 7, from: "user", text: "Probably 2–3 hours" },
    { id: 8, from: "ai",   text: "All set! Here's what I captured:", summary: { category: "Furniture Assembly", description: "IKEA PAX wardrobe — all parts on site, needs experienced Tasker", duration: "2–3 hours", vehicle: "Not required" }, cta: true },
  ],
  cleaning: [
    { id: 0, from: "ai",   text: "Hi there! 👋 I'm your TaskRabbit assistant. Tell me what you need help with today, and I'll find the perfect Tasker for you." },
    { id: 1, from: "user", text: "I need my apartment cleaned" },
    { id: 2, from: "ai",   text: "Great! Is this a standard clean, a deep clean, or a move-in/move-out clean?", prefill: "Deep clean — haven't done it in a while" },
    { id: 3, from: "user", text: "Deep clean — haven't done it in a while" },
    { id: 4, from: "ai",   text: "Understood! How big is the space — roughly how many bedrooms and bathrooms?", prefill: "2 bedrooms, 1 bathroom" },
    { id: 5, from: "user", text: "2 bedrooms, 1 bathroom" },
    { id: 6, from: "ai",   text: "Should the Tasker bring their own cleaning supplies, or do you have everything at home?", prefill: "Please bring supplies" },
    { id: 7, from: "user", text: "Please bring supplies" },
    { id: 8, from: "ai",   text: "All set! Here's what I captured:", summary: { category: "Home Cleaning", description: "Deep clean, 2BR/1BA — Tasker to bring supplies", duration: "3–4 hours (est.)", vehicle: "Not required" }, cta: true },
  ],
};

function TaskerCard({ tasker, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1.5px solid #E5E7EB", marginBottom: 12, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all 0.4s ease", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: tasker.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#444" }}>{tasker.avatar}</div>
          {tasker.vehicle && <div style={{ position: "absolute", bottom: -2, right: -2, background: TR_TEAL, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, border: "2px solid white" }}>🚗</div>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: TR_TEXT }}>{tasker.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                <span style={{ color: "#F59E0B", fontSize: 13, fontWeight: 600 }}>★ {tasker.rating}</span>
                <span style={{ color: TR_MUTED, fontSize: 12 }}>({tasker.reviews} reviews)</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: TR_TEXT }}>${tasker.rate}/hr</div>
              <div style={{ fontSize: 11, color: TR_MUTED }}>{tasker.tasks} tasks done</div>
            </div>
          </div>
          <div style={{ display: "inline-block", background: TR_TEAL_LIGHT, color: TR_TEAL_DARK, fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "2px 10px", marginTop: 6 }}>{tasker.badge}</div>
          <p style={{ fontSize: 13, color: TR_MUTED, margin: "8px 0", lineHeight: 1.5 }}>{tasker.bio}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tasker.tags.map(tag => <span key={tag} style={{ background: "#F3F4F6", color: "#6B7280", fontSize: 11, borderRadius: 20, padding: "2px 10px" }}>{tag}</span>)}
          </div>
        </div>
      </div>
      <button style={{ width: "100%", marginTop: 14, background: TR_TEAL, color: "#fff", border: "none", borderRadius: 10, padding: 11, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
        onMouseEnter={e => e.target.style.background = TR_TEAL_DARK}
        onMouseLeave={e => e.target.style.background = TR_TEAL}>
        Select & Continue →
      </button>
    </div>
  );
}

function SummaryCard({ summary }) {
  return (
    <div style={{ background: TR_TEAL_LIGHT, borderRadius: 14, padding: "14px 16px", marginTop: 8, border: `1.5px solid ${TR_TEAL}33` }}>
      {[["📋","Service",summary.category],["📝","Task",summary.description],["⏱️","Duration",summary.duration],["🚗","Vehicle",summary.vehicle]].map(([icon,label,value]) => (
        <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }}>
          <span>{icon}</span>
          <span style={{ color: TR_MUTED, minWidth: 65 }}>{label}:</span>
          <span style={{ color: TR_TEXT, fontWeight: 600 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 6, padding: "12px 16px", alignItems: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: TR_TEAL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
      <div style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: "18px 18px 18px 4px", padding: "10px 16px", display: "flex", gap: 4, alignItems: "center" }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: TR_TEAL, animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  );
}

export default function TaskRabbitAI() {
  const [phase, setPhase] = useState("chat");
  const [activeFlow, setActiveFlow] = useState(null);
  const [messages, setMessages] = useState([]);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [waitingForUser, setWaitingForUser] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      html, body, #root { margin: 0; padding: 0; height: 100dvh; overflow: hidden; }
      @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
      @keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping, waitingForUser]);

  // Drive AI turns
  useEffect(() => {
    if (!started || !activeFlow) return;
    const script = SCRIPTS[activeFlow];
    if (scriptIndex >= script.length) return;
    const step = script[scriptIndex];
    if (step.from !== "ai") return;

    setIsTyping(true);
    const t = setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, step]);
      setScriptIndex(i => i + 1);
      if (step.cta) {
        setShowCTA(true);
      } else if (step.prefill !== undefined) {
        setInputValue(step.prefill);
        setWaitingForUser(true);
      }
    }, scriptIndex === 0 ? 700 : 1100);
    return () => clearTimeout(t);
  }, [scriptIndex, started, activeFlow]);

  const startFlow = (scenarioKey) => {
    const scenario = SCENARIOS.find(s => s.key === scenarioKey);
    setActiveFlow(scenarioKey);
    setMessages([]);
    setScriptIndex(0);
    setWaitingForUser(false);
    setShowCTA(false);
    setShowDropdown(false);
    setPhase("chat");
    setStarted(false);
    // Pre-fill with the first user message for this scenario
    setInputValue(scenario.firstPrefill);
    // started stays false — user must press Send to begin
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    if (!started) {
      // First message — user sends their opening line, AI responds from script[2]
      const userMsg = { id: Date.now(), from: "user", text: inputValue.trim() };
      setMessages([userMsg]);
      setInputValue("");
      setStarted(true);
      setScriptIndex(2); // script[0]=AI greeting (skipped), script[1]=user (shown), script[2]=first AI reply
      return;
    }
    if (!waitingForUser) return;
    const userMsg = { id: Date.now(), from: "user", text: inputValue.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setWaitingForUser(false);
    setScriptIndex(i => i + 1);
  };

  const resetDemo = () => {
    setPhase("chat");
    setActiveFlow(null);
    setMessages([]);
    setScriptIndex(0);
    setWaitingForUser(false);
    setShowCTA(false);
    setInputValue("");
    setStarted(false);
  };

  const currentScenario = SCENARIOS.find(s => s.key === activeFlow);
  const inputPlaceholder = !activeFlow
    ? "Tell me what you need help with..."
    : waitingForUser ? "Edit if you want, then press Send..." : started ? "Waiting for assistant..." : "Press Send to start";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", height: "100dvh", background: "#F9FAFB", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ background: TR_TEAL, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 12px rgba(74,155,127,0.3)" }}>
        <div style={{ width: 36, height: 36, background: "white", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: TR_TEAL }}>TR</div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px" }}>TaskRabbit</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
            {phase === "results" ? "Taskers Near You" : "AI Booking Assistant • Beta"}
          </div>
        </div>
        {(messages.length > 0 || phase === "results") && (
          <button onClick={resetDemo} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            ← Start Over
          </button>
        )}
      </div>

      {/* Progress bar */}
      {phase === "chat" && (
        <div style={{ background: "#E5E7EB", height: 3 }}>
          <div style={{ height: "100%", background: TR_TEAL, width: activeFlow ? `${Math.min((scriptIndex / SCRIPTS[activeFlow].length) * 100, 100)}%` : "0%", transition: "width 0.5s ease" }} />
        </div>
      )}

      {/* Chat area */}
      {phase === "chat" && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: TR_MUTED, animation: "fadeSlideIn 0.4s ease" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: TR_TEXT, marginBottom: 8 }}>TaskRabbit AI Assistant</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>Tell me what you need help with,<br />or pick a demo scenario below ↓</div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", flexDirection: msg.from === "user" ? "row-reverse" : "row", gap: 8, marginBottom: 16, animation: "fadeSlideIn 0.3s ease" }}>
                {msg.from === "ai" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: TR_TEAL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
                )}
                <div style={{ maxWidth: "78%" }}>
                  <div style={{ background: msg.from === "user" ? TR_TEAL : "#fff", color: msg.from === "user" ? "#fff" : TR_TEXT, borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "11px 15px", fontSize: 14, lineHeight: 1.5, border: msg.from === "ai" ? "1.5px solid #E5E7EB" : "none", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    {msg.text}
                  </div>
                  {msg.summary && <SummaryCard summary={msg.summary} />}
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}

            {showCTA && (
              <div style={{ padding: "8px 0 16px 36px", animation: "fadeSlideIn 0.3s ease" }}>
                <button onClick={() => setPhase("results")} style={{ background: TR_TEAL, color: "#fff", border: "none", borderRadius: 12, padding: "13px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 4px 16px ${TR_TEAL}55` }}
                  onMouseEnter={e => e.target.style.background = TR_TEAL_DARK}
                  onMouseLeave={e => e.target.style.background = TR_TEAL}>
                  🔍 Find My Taskers
                </button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1.5px solid #E5E7EB" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", position: "relative" }} ref={dropdownRef}>

              {/* Input with embedded dropdown trigger */}
              <div style={{ flex: 1, position: "relative" }}>
                {showDemoHint && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 0, background: "#1A1A1A", color: "#fff", fontSize: 12, fontWeight: 500, borderRadius: 8, padding: "6px 12px", whiteSpace: "nowrap", zIndex: 200, animation: "slideUp 0.15s ease", pointerEvents: "none" }}>
                    🎬 Demo mode — text is pre-filled, just press Send
                    <div style={{ position: "absolute", bottom: -5, left: 16, width: 10, height: 10, background: "#1A1A1A", transform: "rotate(45deg)" }} />
                  </div>
                )}
                <input
                  value={inputValue}
                  onChange={e => { if (!started) setInputValue(e.target.value); }}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder={inputPlaceholder}
                  readOnly={started && waitingForUser}
                  title={started && waitingForUser ? "Demo mode — text is pre-filled" : ""}
                  style={{ width: "100%", border: started && waitingForUser ? "1.5px dashed #D1D5DB" : "1.5px solid #E5E7EB", borderRadius: 12, padding: "11px 44px 11px 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: started && waitingForUser ? "#F9FAFB" : "#fff", color: started && waitingForUser ? TR_MUTED : TR_TEXT, boxSizing: "border-box", cursor: started && waitingForUser ? "default" : "text", caretColor: started && waitingForUser ? "transparent" : "auto" }}
                  onFocus={e => { 
                    if (!started) { e.target.style.borderColor = TR_TEAL; setShowDropdown(true); }
                    else if (waitingForUser) { setShowDemoHint(true); setTimeout(() => setShowDemoHint(false), 2000); }
                  }}
                  onClick={e => { 
                    if (started && waitingForUser) { setShowDemoHint(true); setTimeout(() => setShowDemoHint(false), 2000); }
                  }}
                  onBlur={e => { if (!started) e.target.style.borderColor = "#E5E7EB"; }}
                />
                {/* Lock icon when in demo mid-flow, dropdown trigger when not started */}
                {started && waitingForUser ? (
                  <span title="Demo mode — text is pre-filled" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#D1D5DB", pointerEvents: "none" }}>🔒</span>
                ) : (
                  <button
                    onClick={() => setShowDropdown(v => !v)}
                    title="Choose a demo scenario"
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4, color: TR_TEAL, display: "flex", alignItems: "center" }}
                  >✦</button>
                )}

                {/* Dropdown menu */}
                {showDropdown && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 100, animation: "slideUp 0.18s ease" }}>
                    <div style={{ padding: "8px 14px 6px", fontSize: 11, color: TR_MUTED, fontWeight: 600, letterSpacing: "0.5px" }}>DEMO SCENARIOS</div>
                    {SCENARIOS.map((s, i) => (
                      <button key={s.key} onClick={() => startFlow(s.key)}
                        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: s.key === activeFlow ? TR_TEAL_LIGHT : "#fff", border: "none", borderTop: i === 0 ? "1px solid #F3F4F6" : "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}
                        onMouseEnter={e => { if (s.key !== activeFlow) e.currentTarget.style.background = "#F9FAFB"; }}
                        onMouseLeave={e => { if (s.key !== activeFlow) e.currentTarget.style.background = "#fff"; }}>
                        <span style={{ fontSize: 20 }}>{s.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: s.key === activeFlow ? TR_TEAL_DARK : TR_TEXT }}>{s.label}</div>
                          <div style={{ fontSize: 11, color: TR_MUTED }}>{s.desc}</div>
                        </div>
                        {s.key === activeFlow && <span style={{ color: TR_TEAL, fontSize: 14, fontWeight: 700 }}>✓</span>}
                      </button>
                    ))}
                    <div style={{ padding: "10px 14px", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>💡</span>
                      <span style={{ fontSize: 11, color: TR_MUTED, fontStyle: "italic" }}>In the real product, users type freely. Pick a scenario to demo.</span>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleSend}
                disabled={!inputValue.trim() || (started && !waitingForUser && !showCTA)}
                style={{ background: inputValue.trim() && (!started || waitingForUser) ? TR_TEAL : "#E5E7EB", color: inputValue.trim() && (!started || waitingForUser) ? "#fff" : "#9CA3AF", border: "none", borderRadius: 12, padding: "11px 18px", fontWeight: 700, fontSize: 14, cursor: inputValue.trim() && (!started || waitingForUser) ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                Send
              </button>
            </div>
          </div>
        </>
      )}

      {/* Results */}
      {phase === "results" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", marginBottom: 16, border: "1.5px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 12, color: TR_MUTED, marginBottom: 6 }}>Your task</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: TR_TEXT }}>
              {currentScenario?.icon} {SCRIPTS[activeFlow]?.find(s => s.summary)?.summary?.description}
            </div>
            <div style={{ fontSize: 13, color: TR_MUTED, marginTop: 4 }}>
              {SCRIPTS[activeFlow]?.find(s => s.summary)?.summary?.duration} · {SCRIPTS[activeFlow]?.find(s => s.summary)?.summary?.vehicle} · {currentScenario?.label}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: TR_TEXT }}>3 Taskers Available</div>
            <div style={{ fontSize: 12, color: TR_TEAL, fontWeight: 600 }}>Sorted by: Best Match</div>
          </div>
          {TASKER_POOLS[activeFlow].map((tasker, i) => <TaskerCard key={tasker.name} tasker={tasker} delay={i * 200} />)}
          <div style={{ textAlign: "center", padding: "16px 0", fontSize: 13, color: TR_MUTED }}>🔒 All Taskers are background-checked & insured</div>
        </div>
      )}
    </div>
  );
}
