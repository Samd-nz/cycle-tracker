import { useState, useEffect } from "react";

// ─── PHASE DATA ───────────────────────────────────────────────────────────────
// Reviewed against: Mayo Clinic, ACOG, Harvard Health, Cambridge Nutrition Research Reviews (2024),
// WebMD, HealthPartners, Women's Health CT, PMC systematic reviews, Covenant Health OB-GYN
const PHASES = {
  menstrual: {
    name: "Menstrual",
    days: [1, 5],
    color: "#B85C63",
    bg: "#FDF0F0",
    accent: "#E8A0A5",
    emoji: "🌑",
    tagline: "Rest & renewal",
    description:
      "Your uterus is shedding its lining as oestrogen and progesterone drop to their lowest. Energy is naturally low — your body is doing real work. This is a time to slow down, turn inward, and give yourself permission to rest without guilt.",
    symptoms: [
      "Cramping in the lower abdomen & lower back",
      "Fatigue and low energy",
      "Bloating & heaviness",
      "Headaches (triggered by hormone drop)",
      "Mood may feel introspective, low or tender",
      "Heightened sensitivity to pain & emotions",
    ],
    foods: [
      { item: "Dark leafy greens — spinach, kale", reason: "Replenish iron lost through bleeding and support energy levels" },
      { item: "Red meat, lentils & beans", reason: "Iron-rich foods help prevent anaemia and period fatigue" },
      { item: "Dark chocolate (70%+)", reason: "Magnesium eases cramps and lifts mood — this one is genuinely evidenced" },
      { item: "Oily fish — salmon, sardines, mackerel", reason: "Omega-3s reduce prostaglandins, the chemicals that drive cramping pain" },
      { item: "Ginger & turmeric tea", reason: "Natural anti-inflammatories with evidence for reducing cramping severity" },
      { item: "Warming soups, broths & stews", reason: "Easy to digest, comforting, nourishing and hydrating on heavy days" },
    ],
    supplements: [
      { item: "Magnesium glycinate (300–400mg)", reason: "Strong evidence for reducing cramps, bloating, and improving sleep quality during menstruation" },
      { item: "Omega-3 fatty acids / fish oil", reason: "Reduces inflammatory prostaglandins — the compounds that cause cramping. Evidenced in multiple studies." },
      { item: "Iron + Vitamin C", reason: "Replenish iron lost through bleeding. Vitamin C doubles absorption — take together" },
      { item: "Vitamin B1 (Thiamine, 100mg)", reason: "Clinical studies show thiamine significantly reduces menstrual pain" },
    ],
    selfCare: [
      { tip: "Heat pack on your lower abdomen or lower back", why: "Heat relaxes uterine muscles, increases blood flow and triggers natural endorphins. Evidence shows it can be as effective as ibuprofen for mild-moderate cramps. (Mayo Clinic)" },
      { tip: "Warm bath with Epsom salts", why: "Magnesium absorbs through skin while full-body warmth eases muscle tension. A genuinely restorative practice." },
      { tip: "Gentle movement — walking, stretching or yin yoga", why: "Exercise releases pain-relieving endorphins. Studies show even 15 minutes of gentle movement helps. Skip intense workouts if your body says no." },
      { tip: "Ibuprofen if needed — start early", why: "NSAIDs are most effective when taken at the first sign of cramps, before pain peaks. (ACOG recommendation)" },
      { tip: "Rest without guilt — this is maintenance", why: "Your body is doing significant work. More sleep, cancelled plans, slower days are not weakness — they are appropriate self-care." },
      { tip: "Loose, comfortable clothing", why: "Reduces pressure on an already tender abdomen. Simple but genuinely effective." },
      { tip: "Reduce caffeine and alcohol", why: "Both worsen bloating, disrupt sleep, and increase sensitivity to cramping pain" },
    ],
  },
  follicular: {
    name: "Follicular",
    days: [6, 13],
    color: "#3D8BA3",
    bg: "#EEF6FA",
    accent: "#8DC5D8",
    emoji: "🌒",
    tagline: "Rising energy & fresh starts",
    description:
      "Oestrogen rises steadily as your ovaries develop follicles. Energy, mood, focus and creativity all lift. This is your brain's sharpest phase — a natural window for starting new things, learning, deep work and social connection.",
    symptoms: [
      "Steadily increasing energy and motivation",
      "Improved mood, optimism and confidence",
      "Sharper thinking and easier focus",
      "More sociable, talkative and outgoing",
      "Skin often looks clearer and brighter",
      "Greater physical stamina",
    ],
    foods: [
      { item: "Eggs & quality protein", reason: "Support follicle development and provide steady, sustained energy" },
      { item: "Fermented foods — yoghurt, kefir, kimchi, sauerkraut", reason: "Gut health is essential for metabolising and balancing oestrogen" },
      { item: "Broccoli, cauliflower & Brussels sprouts", reason: "Cruciferous vegetables support the liver in clearing used oestrogen efficiently" },
      { item: "Flaxseeds & pumpkin seeds", reason: "Phytoestrogens gently support rising oestrogen in the follicular phase" },
      { item: "Berries & citrus fruits", reason: "Antioxidants protect developing follicles and support immune function" },
      { item: "Whole grains — oats, quinoa, brown rice", reason: "Steady, sustained energy as vitality builds across the phase" },
    ],
    supplements: [
      { item: "Vitamin D3 (1000–2000 IU)", reason: "Supports follicle development, hormone signalling and mood. Low D3 is very common and worsens cycle symptoms." },
      { item: "B-vitamin complex (especially B6)", reason: "Supports energy metabolism and production of mood neurotransmitters like serotonin" },
      { item: "Zinc (15–25mg)", reason: "Evidence supports zinc for follicular development, immune function and skin clarity" },
      { item: "Probiotic", reason: "Supports the 'oestrobolome' — the gut bacteria responsible for regulating oestrogen levels" },
    ],
    selfCare: [
      { tip: "Start a new project, habit or goal", why: "Oestrogen boosts dopamine and serotonin. Your brain is genuinely wired for novelty, learning and motivation right now — use it." },
      { tip: "Increase workout intensity gradually", why: "Energy is building — a great phase for strength training, cardio, or trying a new class. Your body responds well to challenge." },
      { tip: "Schedule social plans and important meetings", why: "You're naturally more outgoing, articulate and persuasive this week — lean into connection and collaboration." },
      { tip: "Spend time outdoors in natural light", why: "Natural light boosts vitamin D and serotonin, amplifying the natural energy lift of this phase." },
      { tip: "Creative and strategic thinking work", why: "Cognitive flexibility and verbal fluency are measurably higher in the follicular phase — ideal for brainstorming or planning." },
      { tip: "Try new foods and build good habits", why: "Digestion is strong and energy is high — a good window to establish routines that'll support you later in the cycle." },
    ],
  },
  ovulatory: {
    name: "Ovulatory",
    days: [14, 16],
    color: "#C47B2B",
    bg: "#FDF6EE",
    accent: "#ECC08A",
    emoji: "🌕",
    tagline: "Peak energy & connection",
    description:
      "A surge in LH triggers the release of a mature egg. Oestrogen peaks and testosterone rises briefly. Energy, confidence and libido are at their highest for the whole cycle. You're naturally magnetic — communication, collaboration and intimacy all feel easier.",
    symptoms: [
      "Highest energy and confidence of the cycle",
      "Increased libido",
      "Mild mid-cycle cramping — mittelschmerz — is normal",
      "Cervical mucus becomes clear and stretchy (egg-white texture)",
      "Slight rise in basal body temperature after ovulation",
      "Heightened senses, especially smell",
    ],
    foods: [
      { item: "Leafy greens & raw salads", reason: "Support the liver in clearing oestrogen as it begins to decline post-ovulation" },
      { item: "High-fibre foods — vegetables, whole grains, legumes", reason: "Fibre binds used hormones in the gut and helps the body eliminate them efficiently" },
      { item: "Light proteins — fish, tofu, chicken", reason: "Sustain energy without heaviness during peak activity days" },
      { item: "Avocado & olive oil", reason: "Healthy fats are building blocks for continued hormone production" },
      { item: "Tomatoes & red peppers", reason: "Lycopene and Vitamin C support egg quality and immune function" },
      { item: "Coconut water or electrolyte drinks", reason: "Support hydration and peak physical performance" },
    ],
    supplements: [
      { item: "CoQ10 / Coenzyme Q10 (100–200mg)", reason: "Supports egg quality and cellular energy production in the ovaries" },
      { item: "Vitamin C (500–1000mg)", reason: "Antioxidant protection; supports the transition into the luteal phase" },
      { item: "Selenium (55–100mcg)", reason: "Antioxidant shown to protect egg quality" },
      { item: "Continue Vitamin D3 & Zinc", reason: "Ongoing support for hormone signalling and reproductive health across the cycle" },
    ],
    selfCare: [
      { tip: "Schedule important conversations, presentations or negotiations", why: "Verbal fluency, empathy and confidence measurably peak around ovulation. Use this window intentionally." },
      { tip: "Enjoy higher-intensity exercise", why: "Peak energy and natural pain tolerance mean this is your body's best week for challenging workouts" },
      { tip: "Prioritise intimacy and social connection", why: "Libido and oxytocin are elevated. Relationships feel easier and more rewarding — lean in." },
      { tip: "Enjoy the energy — but don't overcommit", why: "It's tempting to say yes to everything now. Remember the luteal phase is coming — a little balance protects you." },
      { tip: "Hydrate more than usual", why: "Energy expenditure is high. Good hydration supports mood, focus, skin and physical performance." },
    ],
  },
  luteal: {
    name: "Luteal",
    days: [17, 28],
    color: "#6B5B9E",
    bg: "#F4F1FB",
    accent: "#B0A0D8",
    emoji: "🌖",
    tagline: "Grounding & deep nourishment",
    description:
      "Progesterone rises after ovulation, then both oestrogen and progesterone fall sharply if pregnancy hasn't occurred. This hormonal drop reduces serotonin — explaining PMS mood symptoms. Cortisol is also naturally higher in the late luteal phase. Your body is winding down — it needs slower, quieter, more nourishing support.",
    symptoms: [
      "Bloating & water retention",
      "Breast tenderness or fullness",
      "Mood changes — irritability, anxiety or tearfulness",
      "Food cravings, especially carbs & sweets (blood sugar fluctuates)",
      "Fatigue, disrupted or vivid sleep",
      "Reduced focus, brain fog or forgetfulness",
      "Skin may break out in the days before your period",
    ],
    foods: [
      { item: "Complex carbohydrates — sweet potato, oats, brown rice", reason: "Stabilise blood sugar, reduce cravings and support serotonin production. Cravings are physiological, not weakness." },
      { item: "Turkey, chicken & salmon", reason: "Tryptophan supports serotonin — the mood neurotransmitter that naturally drops in the late luteal phase" },
      { item: "Sesame & sunflower seeds", reason: "Support progesterone production in the second half of the cycle" },
      { item: "Calcium-rich foods — dairy, almonds, sardines, leafy greens", reason: "Clinical trials show calcium intake reduces overall PMS symptoms including mood changes and fatigue" },
      { item: "Dark chocolate & nuts (magnesium-rich)", reason: "Reduces PMS bloating, cramps and anxiety — magnesium levels dip in the luteal phase" },
      { item: "Chamomile or passionflower tea before bed", reason: "Natural support for luteal phase sleep disruption and anxiety" },
    ],
    supplements: [
      { item: "Magnesium glycinate (400mg)", reason: "The most evidence-backed PMS supplement. Reduces mood swings, cramps, bloating and sleep disruption." },
      { item: "Calcium carbonate (1000–1200mg)", reason: "Randomised controlled trials show calcium reduces overall PMS severity by approximately 50%" },
      { item: "Vitamin B6 (50mg)", reason: "Supports progesterone production and serotonin synthesis — reduces PMS mood symptoms" },
      { item: "Chasteberry / Vitex agnus-castus", reason: "Herbal supplement with clinical evidence for reducing PMS, breast pain and irritability. Consult a doctor first." },
    ],
    selfCare: [
      { tip: "Reduce your schedule in the 5 days before your period", why: "Cortisol is measurably higher in the late luteal phase. Overcommitting significantly worsens PMS. This is biology, not a character flaw." },
      { tip: "Prioritise 7–9 hours of sleep with a consistent bedtime", why: "Progesterone has a sedating effect but sleep quality often drops. A consistent routine helps more than anything else." },
      { tip: "Gentle movement — yoga, walking, swimming", why: "Lower-intensity exercise is better now. Yoga specifically has strong evidence for reducing both physical and emotional PMS symptoms." },
      { tip: "Eat every 3–4 hours with protein at each meal", why: "Blood sugar swings worsen mood, cravings and fatigue. Frequent small meals with protein are highly effective." },
      { tip: "Name what's happening — 'this is my luteal phase'", why: "Reminding yourself there is a biological reason you feel this way is clinically shown to reduce emotional reactivity and distress." },
      { tip: "Warmth and comfort, intentionally", why: "Hot water bottle, warm bath, cosy environment — these are not indulgent. They actively lower cortisol." },
      { tip: "Reduce caffeine and alcohol", why: "Both worsen anxiety, disrupt sleep and increase breast tenderness in the luteal phase" },
    ],
  },
};

const AVG_CYCLE = 28;

// ─── AGE & LIFE STAGE INFO ─────────────────────────────────────────────────
// Sources: Harvard Health, ACOG, Cleveland Clinic, UNC Health, Franciscan Health
const AGE_INFO = {
  "20s": {
    label: "In your 20s",
    emoji: "🌱",
    content: "Cycles are often still settling into a regular rhythm in your 20s. Dysmenorrhea (painful periods) is actually most common in young women — you're not imagining it, and it often improves naturally with age. Cycles can range from 21–35 days and still be completely normal. Only 10–15% of people have a cycle that's exactly 28 days. If pain is severe enough to disrupt work, school or daily life, see a doctor — this can sometimes indicate endometriosis or fibroids, which respond well to early treatment.",
  },
  "30s": {
    label: "In your 30s",
    emoji: "🌿",
    content: "Cycles are often at their most predictable in your 30s. PMS symptoms can feel more intense as life pressures increase — stress significantly amplifies cycle symptoms through cortisol. Iron stores become more important if you experience heavy periods. Fertility begins a gradual decline after 35 but cycles usually remain regular. Any significant change in flow, cycle length or pain that's new or worsening is worth mentioning to your GP.",
  },
  perimenopause: {
    label: "Perimenopause (typically 40s–early 50s)",
    emoji: "🍂",
    content: "Perimenopause typically begins in the mid-40s (though it can start from the mid-30s) and lasts 4–8 years before menopause. The first sign is usually irregular periods — they may come closer together or further apart, become heavier, lighter, longer or shorter. Other signs include hot flashes and night sweats, mood changes, sleep disruption, brain fog, vaginal dryness and changes in libido. These are caused by declining and fluctuating oestrogen — not anything wrong with you. Tracking your cycle during perimenopause is especially useful: it helps you spot patterns and have informed conversations with your doctor. You can still get pregnant during perimenopause. Menopause is officially confirmed after 12 consecutive months without a period.",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getPhase(d) {
  if (d >= 1 && d <= 5) return "menstrual";
  if (d >= 6 && d <= 13) return "follicular";
  if (d >= 14 && d <= 16) return "ovulatory";
  return "luteal";
}

function getDayOfCycle(start) {
  if (!start) return null;
  const s = new Date(start), t = new Date();
  [s, t].forEach(x => x.setHours(0, 0, 0, 0));
  const diff = Math.floor((t - s) / 86400000) + 1;
  return diff > 0 ? ((diff - 1) % AVG_CYCLE) + 1 : null;
}

function fmtDate(str) {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
}

// ─── WHEEL ────────────────────────────────────────────────────────────────────
function CycleWheel({ currentPhase, dayOfCycle }) {
  const segs = [
    { key: "menstrual", s: 0, e: 64, c: "#B85C63" },
    { key: "follicular", s: 64, e: 167, c: "#3D8BA3" },
    { key: "ovulatory", s: 167, e: 206, c: "#C47B2B" },
    { key: "luteal", s: 206, e: 360, c: "#6B5B9E" },
  ];
  const cx = 100, cy = 100, R = 88, r = 56;
  const p = (deg, rad) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) };
  };
  const arc = (s, e, R1, R2) => {
    const a = p(s, R1), b = p(e, R1), c2 = p(e, R2), d = p(s, R2), lg = e - s > 180 ? 1 : 0;
    return `M${a.x} ${a.y} A${R1} ${R1} 0 ${lg} 1 ${b.x} ${b.y} L${c2.x} ${c2.y} A${R2} ${R2} 0 ${lg} 0 ${d.x} ${d.y}Z`;
  };
  const da = dayOfCycle ? ((dayOfCycle - 1) / AVG_CYCLE) * 360 : null;
  const dp = da !== null ? p(da, (R + r) / 2) : null;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {segs.map(sg => (
        <path key={sg.key} d={arc(sg.s, sg.e, R, r)} fill={sg.c} opacity={currentPhase === sg.key ? 1 : 0.2} style={{ transition: "opacity 0.5s" }} />
      ))}
      <circle cx={cx} cy={cy} r={r - 3} fill="white" opacity={0.96} />
      {dp && <><circle cx={dp.x} cy={dp.y} r={7} fill="white" /><circle cx={dp.x} cy={dp.y} r={5} fill={PHASES[currentPhase]?.color || "#888"} /></>}
      <text x={cx} y={cy - 10} textAnchor="middle" fontSize="22">{PHASES[currentPhase]?.emoji}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#777" fontFamily="Georgia,serif">Day {dayOfCycle}</text>
    </svg>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CycleTracker() {
  const [cycles, setCycles] = useState(() => { try { return JSON.parse(localStorage.getItem("cycles") || "[]"); } catch { return []; } });
  const [view, setView] = useState("home");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [phaseTab, setPhaseTab] = useState("care");
  const [ageView, setAgeView] = useState(null);

  useEffect(() => { try { localStorage.setItem("cycles", JSON.stringify(cycles)); } catch {} }, [cycles]);

  const lastCycle = cycles.at(-1) || null;
  const dayOfCycle = getDayOfCycle(lastCycle?.start);
  const curKey = dayOfCycle ? getPhase(dayOfCycle) : null;
  const curPhase = curKey ? PHASES[curKey] : null;

  const nextPeriod = lastCycle ? (() => { const d = new Date(lastCycle.start); d.setDate(d.getDate() + AVG_CYCLE); return d; })() : null;
  const daysUntil = nextPeriod ? Math.max(0, Math.ceil((nextPeriod - new Date()) / 86400000)) : null;

  const dispKey = activePhaseKey || curKey;
  const dispPhase = dispKey ? PHASES[dispKey] : null;
  const TC = curPhase?.color || "#B85C63";
  const TA = curPhase?.accent || "#E8A0A5";

  const S = {
    app: { minHeight: "100vh", background: view === "phase" ? (dispPhase?.bg || curPhase?.bg || "#FDF5F7") : (curPhase?.bg || "#FDF5F7"), fontFamily: "Georgia,'Times New Roman',serif", transition: "background 0.6s", maxWidth: 430, margin: "0 auto" },
    hdr: { padding: "28px 22px 14px", borderBottom: `1px solid ${TA}66` },
    overline: { fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: TC, margin: 0 },
    h1: { fontSize: 24, fontWeight: "normal", margin: "4px 0 0", color: "#1E1520", letterSpacing: -0.3 },
    nav: { display: "flex", gap: 4, padding: "10px 22px", borderBottom: `1px solid ${TA}33` },
    nb: a => ({ flex: 1, padding: "8px 4px", border: "none", borderRadius: 8, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer", background: a ? TC : "transparent", color: a ? "white" : TC, fontFamily: "Georgia,serif", transition: "all 0.2s" }),
    body: { padding: "18px 22px 100px" },
    card: c => ({ background: "white", borderRadius: 18, padding: "18px", marginBottom: 14, boxShadow: `0 2px 18px ${c || TC}18`, border: `1px solid ${c || TA}33` }),
    sl: { fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "#bbb", marginBottom: 10, display: "block" },
    row: c => ({ display: "flex", gap: 10, padding: "9px 0", borderBottom: `1px solid ${c || TA}33`, alignItems: "flex-start" }),
    dot: c => ({ width: 7, height: 7, borderRadius: "50%", background: c || TC, marginTop: 6, flexShrink: 0 }),
    chip: k => ({ display: "inline-flex", alignItems: "center", gap: 5, background: PHASES[k].color + "18", color: PHASES[k].color, border: `1px solid ${PHASES[k].color}44`, borderRadius: 100, padding: "5px 13px", fontSize: 11.5, cursor: "pointer", fontFamily: "Georgia,serif", margin: "3px 3px 3px 0" }),
    tab: (a, c) => ({ flex: 1, padding: "8px 4px", border: `1.5px solid ${a ? c : c + "44"}`, borderRadius: 10, fontSize: 10.5, letterSpacing: 0.8, textTransform: "uppercase", cursor: "pointer", background: a ? c + "18" : "transparent", color: a ? c : "#aaa", fontFamily: "Georgia,serif", transition: "all 0.2s" }),
    inp: { width: "100%", padding: "11px 14px", borderRadius: 11, border: `1.5px solid ${TA}`, fontSize: 15, fontFamily: "Georgia,serif", background: "white", color: "#1E1520", outline: "none", boxSizing: "border-box", marginTop: 5 },
    pbtn: { width: "100%", padding: "13px", borderRadius: 13, border: "none", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia,serif", background: TC, color: "white", marginTop: 8 },
    gbtn: { width: "100%", padding: "11px", borderRadius: 13, border: "none", fontSize: 12, cursor: "pointer", fontFamily: "Georgia,serif", background: "transparent", color: TC, marginTop: 6 },
    fab: { position: "fixed", bottom: 26, right: 22, width: 54, height: 54, borderRadius: "50%", background: TC, color: "white", border: "none", fontSize: 24, cursor: "pointer", boxShadow: `0 4px 18px ${TC}55`, display: "flex", alignItems: "center", justifyContent: "center" },
  };

  function HomeView() {
    return (
      <div style={S.body}>
        {!curPhase ? (
          <div style={{ ...S.card(), textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🌸</div>
            <p style={{ color: "#999", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>Log your first period to start tracking your cycle and receive personalised guidance for each phase.</p>
            <button style={{ ...S.pbtn, width: "auto", padding: "12px 26px" }} onClick={() => setView("log")}>Log Period</button>
          </div>
        ) : (
          <>
            <div style={{ ...S.card(), display: "flex", alignItems: "center", gap: 14 }}>
              <CycleWheel currentPhase={curKey} dayOfCycle={dayOfCycle} />
              <div style={{ flex: 1 }}>
                <p style={{ ...S.overline, fontSize: 10 }}>Current phase</p>
                <h2 style={{ margin: "3px 0 2px", fontSize: 20, fontWeight: "normal", color: "#1E1520" }}>{curPhase.name}</h2>
                <p style={{ margin: 0, fontSize: 12, color: "#999", fontStyle: "italic" }}>{curPhase.tagline}</p>
                <p style={{ margin: "8px 0 0", fontSize: 12, color: "#666" }}>Day <strong style={{ color: TC }}>{dayOfCycle}</strong> of ~{AVG_CYCLE}</p>
              </div>
            </div>

            {nextPeriod && (
              <div style={{ ...S.card(), display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={S.sl}>Next period expected</span>
                  <p style={{ margin: 0, fontSize: 16, color: "#1E1520" }}>{fmtDate(nextPeriod)}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#ccc" }}>Based on a ~28 day cycle</p>
                </div>
                <div style={{ background: TC + "18", borderRadius: 12, padding: "10px 16px", textAlign: "center", minWidth: 58 }}>
                  <p style={{ margin: 0, fontSize: 24, color: TC }}>{daysUntil}</p>
                  <p style={{ margin: 0, fontSize: 9, color: TC, letterSpacing: 1, textTransform: "uppercase" }}>days</p>
                </div>
              </div>
            )}

            <div style={S.card()}>
              <span style={S.sl}>What's happening in your body</span>
              <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#555", lineHeight: 1.8 }}>{curPhase.description}</p>
              <button style={{ background: "none", border: `1px solid ${TC}55`, borderRadius: 20, padding: "6px 16px", color: TC, fontSize: 11.5, cursor: "pointer", fontFamily: "Georgia,serif" }}
                onClick={() => { setActivePhaseKey(curKey); setPhaseTab("care"); setView("phase"); }}>
                Full phase guide →
              </button>
            </div>

            <div style={S.card()}>
              <span style={S.sl}>💛 Self-care for right now</span>
              {curPhase.selfCare.slice(0, 3).map((t, i) => (
                <div key={i} style={S.row()}>
                  <div style={S.dot()} />
                  <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.5 }}>{t.tip}</p>
                </div>
              ))}
              <button style={{ background: "none", border: "none", color: TC, fontSize: 11.5, cursor: "pointer", padding: "8px 0 0", fontFamily: "Georgia,serif" }}
                onClick={() => { setActivePhaseKey(curKey); setPhaseTab("care"); setView("phase"); }}>
                See all tips + food & supplements →
              </button>
            </div>

            <div style={S.card()}>
              <span style={S.sl}>Explore all phases</span>
              {Object.entries(PHASES).map(([k, p]) => (
                <button key={k} style={S.chip(k)} onClick={() => { setActivePhaseKey(k); setPhaseTab("care"); setView("phase"); }}>
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>

            <div style={S.card()}>
              <span style={S.sl}>🌸 Age & life stage</span>
              <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#888", lineHeight: 1.5 }}>Your cycle changes as you age. Tap to learn what to expect.</p>
              {Object.entries(AGE_INFO).map(([k, a]) => (
                <button key={k}
                  style={{ display: "block", width: "100%", textAlign: "left", background: ageView === k ? TC + "12" : "none", border: `1px solid ${ageView === k ? TC : TA}66`, borderRadius: 10, padding: "10px 14px", marginBottom: 6, cursor: "pointer", fontFamily: "Georgia,serif", color: ageView === k ? TC : "#555", fontSize: 13 }}
                  onClick={() => setAgeView(ageView === k ? null : k)}>
                  {a.emoji} {a.label}
                </button>
              ))}
              {ageView && (
                <div style={{ background: TC + "0C", borderRadius: 12, padding: "14px", marginTop: 4 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.8 }}>{AGE_INFO[ageView].content}</p>
                  <p style={{ margin: "12px 0 0", fontSize: 11, color: "#ccc", lineHeight: 1.5 }}>Always speak with your GP or gynaecologist about significant changes in your cycle.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  function LogView() {
    return (
      <div style={S.body}>
        <div style={S.card()}>
          <h3 style={{ margin: "0 0 16px", fontWeight: "normal", fontSize: 17, color: "#1E1520" }}>Log a period</h3>
          <label style={S.sl}>Period start date *</label>
          <input type="date" style={S.inp} value={newStart} onChange={e => setNewStart(e.target.value)} />
          <div style={{ height: 14 }} />
          <label style={S.sl}>Period end date (optional)</label>
          <input type="date" style={S.inp} value={newEnd} onChange={e => setNewEnd(e.target.value)} />
          <button style={S.pbtn} onClick={() => { if (!newStart) return; setCycles(p => [...p, { start: newStart, end: newEnd || null, id: Date.now() }]); setNewStart(""); setNewEnd(""); setView("home"); }} disabled={!newStart}>Save</button>
          <button style={S.gbtn} onClick={() => setView("home")}>Cancel</button>
        </div>
        {cycles.length > 0 && (
          <div style={S.card()}>
            <span style={S.sl}>Recent entries</span>
            {[...cycles].reverse().slice(0, 5).map(c => (
              <div key={c.id} style={S.row()}>
                <div style={S.dot()} />
                <div>
                  <p style={{ margin: 0, fontSize: 13.5, color: "#333" }}>Started {fmtDate(c.start)}</p>
                  {c.end && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#aaa" }}>Ended {fmtDate(c.end)}</p>}
                </div>
              </div>
            ))}
            <button style={{ ...S.gbtn, fontSize: 11, marginTop: 10 }} onClick={() => { if (window.confirm("Remove the last logged cycle?")) setCycles(p => p.slice(0, -1)); }}>
              Remove last entry
            </button>
          </div>
        )}
      </div>
    );
  }

  function PhaseView() {
    const ph = dispPhase; if (!ph) return null;
    const c = ph.color;
    return (
      <div style={{ background: ph.bg, minHeight: "100vh" }}>
        <div style={{ padding: "18px 22px 100px" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: c, fontSize: 12, letterSpacing: 1, padding: 0, marginBottom: 14, textTransform: "uppercase", fontFamily: "Georgia,serif" }}
            onClick={() => { setActivePhaseKey(null); setView("home"); }}>← Back</button>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 44 }}>{ph.emoji}</div>
            <h2 style={{ margin: "8px 0 2px", fontWeight: "normal", fontSize: 26, color: "#1E1520" }}>{ph.name} Phase</h2>
            <p style={{ margin: 0, color: c, fontStyle: "italic", fontSize: 14 }}>{ph.tagline}</p>
          </div>

          <div style={{ ...S.card(c), border: `1px solid ${c}33` }}>
            <p style={{ margin: 0, fontSize: 13.5, color: "#555", lineHeight: 1.85 }}>{ph.description}</p>
          </div>

          <div style={S.card(c)}>
            <span style={S.sl}>What to expect</span>
            {ph.symptoms.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < ph.symptoms.length - 1 ? `1px solid ${c}22` : "none", alignItems: "flex-start" }}>
                <div style={S.dot(c)} />
                <p style={{ margin: 0, fontSize: 13, color: "#444", lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[["care", "💛 Self-care"], ["food", "🥗 Food"], ["supplements", "💊 Supplements"]].map(([t, label]) => (
              <button key={t} style={S.tab(phaseTab === t, c)} onClick={() => setPhaseTab(t)}>{label}</button>
            ))}
          </div>

          {phaseTab === "care" && (
            <div style={S.card(c)}>
              <span style={S.sl}>Self-care tips</span>
              {ph.selfCare.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < ph.selfCare.length - 1 ? `1px solid ${c}22` : "none", alignItems: "flex-start" }}>
                  <div style={S.dot(c)} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#333", lineHeight: 1.4 }}>{item.tip}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888", lineHeight: 1.6 }}>{item.why}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {phaseTab === "food" && (
            <div style={S.card(c)}>
              <span style={S.sl}>Foods to nourish you</span>
              {ph.foods.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < ph.foods.length - 1 ? `1px solid ${c}22` : "none", alignItems: "flex-start" }}>
                  <div style={S.dot(c)} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#333", lineHeight: 1.4 }}>{f.item}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888", lineHeight: 1.5 }}>{f.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {phaseTab === "supplements" && (
            <div style={S.card(c)}>
              <span style={S.sl}>Supplements to consider</span>
              {ph.supplements.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < ph.supplements.length - 1 ? `1px solid ${c}22` : "none", alignItems: "flex-start" }}>
                  <div style={S.dot(ph.accent)} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#333", lineHeight: 1.4 }}>{s.item}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888", lineHeight: 1.5 }}>{s.reason}</p>
                  </div>
                </div>
              ))}
              <div style={{ background: c + "0C", borderRadius: 10, padding: "12px", marginTop: 14 }}>
                <p style={{ margin: 0, fontSize: 11.5, color: "#999", lineHeight: 1.7 }}>
                  Always consult a GP or pharmacist before starting new supplements, especially with existing medications. Supplements support — not replace — a balanced diet.
                </p>
              </div>
            </div>
          )}

          <div style={S.card(c)}>
            <span style={S.sl}>Other phases</span>
            {Object.entries(PHASES).filter(([k]) => k !== dispKey).map(([k, p]) => (
              <button key={k} style={S.chip(k)} onClick={() => { setActivePhaseKey(k); setPhaseTab("care"); }}>
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <p style={S.overline}>Cycle Tracker</p>
        <h1 style={S.h1}>{curPhase ? `${curPhase.name} Phase` : "Your cycle"}</h1>
      </div>
      {view !== "phase" && (
        <div style={S.nav}>
          <button style={S.nb(view === "home")} onClick={() => setView("home")}>Today</button>
          <button style={S.nb(view === "log")} onClick={() => setView("log")}>Log period</button>
        </div>
      )}
      {view === "home" && <HomeView />}
      {view === "log" && <LogView />}
      {view === "phase" && <PhaseView />}
      {view === "home" && <button style={S.fab} onClick={() => setView("log")}>+</button>}
    </div>
  );
}
