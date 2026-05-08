import { useState, useEffect } from "react";

// ─── REAL MOON PHASE ──────────────────────────────────────────────────────────
function getMoonPhase(date = new Date()) {
  const known = new Date(2000, 0, 6, 18, 14, 0);
  const synodic = 29.53058867;
  const diff = (date - known) / (1000 * 60 * 60 * 24);
  const pct = ((diff % synodic) + synodic) % synodic / synodic;
  if (pct < 0.025 || pct >= 0.975) return { name: "New Moon", description: "A time of new beginnings. The sky is dark, the veil is thin.", svg: "new" };
  if (pct < 0.25) return { name: "Waxing Crescent", description: "Intentions set under the new moon begin to stir and grow.", svg: "waxing-crescent" };
  if (pct < 0.275) return { name: "First Quarter", description: "Half-lit — a moment of decision and forward motion.", svg: "first-quarter" };
  if (pct < 0.5) return { name: "Waxing Gibbous", description: "Energy builds. Refine, adjust, prepare for fullness.", svg: "waxing-gibbous" };
  if (pct < 0.525) return { name: "Full Moon", description: "Peak power. Heightened intuition, emotion and luminous clarity.", svg: "full" };
  if (pct < 0.75) return { name: "Waning Gibbous", description: "The harvest phase. Gratitude, sharing, gentle release.", svg: "waning-gibbous" };
  if (pct < 0.775) return { name: "Last Quarter", description: "Release what no longer serves. Let go with grace.", svg: "last-quarter" };
  return { name: "Waning Crescent", description: "Rest. Surrender. The cycle nears its beautiful completion.", svg: "waning-crescent" };
}

function MoonSVG({ phase, size = 72 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 3;
  const lit = "#F0E6C8", dark = "#0f0a1a";
  const p = (deg, rad) => { const a = ((deg - 90) * Math.PI) / 180; return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]; };
  const arc = (s, e, R1, R2) => { const [ax, ay] = p(s, R1), [bx, by] = p(e, R1), [cx2, cy2] = p(e, R2), [dx, dy] = p(s, R2); const lg = e - s > 180 ? 1 : 0; return `M${ax} ${ay} A${R1} ${R1} 0 ${lg} 1 ${bx} ${by} L${cx2} ${cy2} A${R2} ${R2} 0 ${lg} 0 ${dx} ${dy}Z`; };

  const shapes = {
    new: <circle cx={cx} cy={cy} r={r} fill={dark} />,
    "waxing-crescent": <><circle cx={cx} cy={cy} r={r} fill={lit} /><ellipse cx={cx - r * 0.12} cy={cy} rx={r * 0.88} ry={r} fill={dark} /></>,
    "first-quarter": <><circle cx={cx} cy={cy} r={r} fill={dark} /><path d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} L${cx},${cy - r}`} fill={lit} /></>,
    "waxing-gibbous": <><circle cx={cx} cy={cy} r={r} fill={lit} /><ellipse cx={cx - r * 0.15} cy={cy} rx={r * 0.6} ry={r} fill={dark} /></>,
    full: <circle cx={cx} cy={cy} r={r} fill="url(#mg)" />,
    "waning-gibbous": <><circle cx={cx} cy={cy} r={r} fill={lit} /><ellipse cx={cx + r * 0.15} cy={cy} rx={r * 0.6} ry={r} fill={dark} /></>,
    "last-quarter": <><circle cx={cx} cy={cy} r={r} fill={dark} /><path d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} L${cx},${cy - r}`} fill={lit} /></>,
    "waning-crescent": <><circle cx={cx} cy={cy} r={r} fill={lit} /><ellipse cx={cx + r * 0.12} cy={cy} rx={r * 0.88} ry={r} fill={dark} /></>,
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: `drop-shadow(0 0 ${size * 0.18}px #F0E6C866)` }}>
      <defs>
        <radialGradient id="mg" cx="38%" cy="33%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="55%" stopColor="#F0E6C8" />
          <stop offset="100%" stopColor="#C8B890" />
        </radialGradient>
      </defs>
      {shapes[phase] || shapes.full}
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#F0E6C8" strokeWidth="0.4" opacity="0.15" />
    </svg>
  );
}

// ─── DAY GUIDE (all 28 days) ──────────────────────────────────────────────────
const DAY_GUIDE = {
  1: { title: "The Bleeding Begins", note: "Your body releases what it no longer needs. Allow yourself to be still — this is sacred shedding, not something to push through.", energy: "Very low — rest is required", mood: "Introspective, tender, possibly emotional", body: "Cramping may be strongest today. Heat and warmth.", ritual: "Hot water bottle, dark chocolate, a slow morning" },
  2: { title: "Deep Rest", note: "Flow is often heaviest now. Your body is working hard beneath the surface. Cancel what you can and honour the quiet.", energy: "Low — conserve everything", mood: "Withdrawn, sensitive, raw", body: "Heavy flow, possible back pain and deep fatigue", ritual: "Epsom salt bath, iron-rich foods, no obligations" },
  3: { title: "The Turning", note: "The sharpest discomfort often eases around day three. A subtle shift — still slow, but the worst may be behind you.", energy: "Low but slightly steadier", mood: "Quieter, more accepting", body: "Flow beginning to ease, cramping reducing", ritual: "Gentle stretching, ginger tea, journalling" },
  4: { title: "Soft Emergence", note: "A thread of energy begins to return. You may feel more like yourself — but don't rush. Let the return be gentle.", energy: "Slowly returning", mood: "Clearer, more present", body: "Lighter flow, body feels less heavy", ritual: "Short walk, nourishing warm food, early sleep" },
  5: { title: "Closing the Gate", note: "The menstrual phase draws to a close. Notice what clarity has emerged from the stillness of these days.", energy: "Moderate — beginning to rebuild", mood: "Reflective, ready for more", body: "Flow ending or very light", ritual: "Set one small intention for the week ahead" },
  6: { title: "First Light", note: "Oestrogen begins its gentle rise. The heaviness lifts. You may wake feeling lighter — almost surprised by it.", energy: "Building steadily", mood: "Optimistic, curious", body: "Body feels lighter, skin begins to clear", ritual: "Try something new — a recipe, a walk, a podcast" },
  7: { title: "The Rising", note: "Creative energy and motivation return. Your mind feels sharper. A wonderful day to begin something you've been putting off.", energy: "Good and building", mood: "Motivated, clear-headed", body: "Energy increasing, digestion often improves", ritual: "Start a new project or revisit an old goal" },
  8: { title: "Opening Up", note: "Social energy returns. You may feel more talkative, warmer, more willing to reach out. Lean into connection.", energy: "Strong", mood: "Warm, sociable, expressive", body: "Skin glowing, body feels capable", ritual: "Call a friend, make a plan, say yes to something" },
  9: { title: "Sharpening", note: "Focus and cognitive clarity are heightened. Your brain is genuinely running differently — use it for anything requiring deep thought.", energy: "High and focused", mood: "Confident, articulate", body: "Strong, capable, well-rested", ritual: "Tackle the hard task, write, strategise" },
  10: { title: "Full Bloom", note: "Energy, mood and confidence are all rising together. Notice how different this feels from last week.", energy: "Excellent", mood: "Positive, self-assured", body: "Peak physical readiness building", ritual: "Exercise, create, connect — you're thriving" },
  11: { title: "Creative Fire", note: "Oestrogen boosts dopamine. Ideas flow easily today. This is a wonderful day for creative work of any kind.", energy: "High and inspired", mood: "Playful, imaginative", body: "Body responds well to movement and challenge", ritual: "Make art, cook something beautiful, move your body" },
  12: { title: "Pre-Ovulation Glow", note: "The body prepares for ovulation. You may notice your presence feels magnetic, your skin luminous.", energy: "Very high", mood: "Radiant, confident, magnetic", body: "Cervical fluid increasing, libido rising", ritual: "Schedule important conversations for this window" },
  13: { title: "The Eve of Ovulation", note: "LH is about to surge. Energy and confidence peak. You are at your most outwardly powerful — this is not coincidence.", energy: "Peak", mood: "Bold, expressive, persuasive", body: "High libido, cervical fluid clear and stretchy", ritual: "Show up fully — this is your moment" },
  14: { title: "Ovulation ✦", note: "The egg is released. This is the apex of your cycle — biologically, emotionally, energetically. You are in full flower.", energy: "Peak — radiant", mood: "Magnetic, open, deeply alive", body: "Possible mild mid-cycle cramp — completely normal", ritual: "Celebrate your body. Connect. Be seen." },
  15: { title: "The Day After", note: "Ovulation has passed. Energy remains high but begins its gradual arc toward stillness. Savour the brightness.", energy: "High, beginning to shift", mood: "Warm, satisfied, present", body: "Temperature slightly elevated post-ovulation", ritual: "Nourish yourself well — you've just done something remarkable" },
  16: { title: "The Threshold", note: "You stand between the two halves of your cycle. The outward phase ends; the inward phase begins. There is beauty in both.", energy: "Moderate-high", mood: "Reflective, transitioning", body: "Body shifting toward progesterone dominance", ritual: "Notice the transition — journal, sit quietly, be present" },
  17: { title: "Into the Luteal", note: "Progesterone rises to support a potential pregnancy. Energy remains good for now — the shift is gradual.", energy: "Good", mood: "Steady, grounded", body: "Slight bloating may begin, breasts may feel fuller", ritual: "Strength training, nourishing meals, good sleep" },
  18: { title: "Inner Work", note: "The luteal phase invites you inward. Your attention naturally moves from the external world to your inner landscape.", energy: "Moderate", mood: "Thoughtful, less social", body: "Body temperature slightly higher than usual", ritual: "Yoga, meditation, slow evening rituals" },
  19: { title: "Nesting", note: "You may feel drawn to your home and your inner circle. This is the progesterone speaking — it is not you shrinking.", energy: "Moderate", mood: "Homebody, comfort-seeking", body: "Appetite increasing, especially for carbs", ritual: "Cook something nourishing, organise your space, cosy evening" },
  20: { title: "Deep Knowing", note: "Intuition sharpens in the luteal phase. The noise of the outward world quiets and something deeper becomes audible.", energy: "Moderate, more internal", mood: "Intuitive, perceptive", body: "Body wisdom is heightened", ritual: "Listen to your gut today — it knows things" },
  21: { title: "The Slowdown", note: "Energy begins its final descent. This is not failure — it is the natural exhale of a cycle that has given much.", energy: "Lowering", mood: "Quieter, less patient", body: "Fatigue possible, sleep may deepen", ritual: "Reduce commitments, prioritise rest" },
  22: { title: "Tender Days", note: "PMS may begin to arrive. Be gentle with yourself and others. What feels sharp today is largely hormonal — it will pass.", energy: "Low-moderate", mood: "Sensitive, easily irritated", body: "Bloating, breast tenderness, possible headaches", ritual: "Magnesium, chamomile tea, say no to extra obligations" },
  23: { title: "The Inner Storm", note: "Serotonin is dropping. The feelings are real but amplified. Name them without being ruled by them.", energy: "Low", mood: "Emotionally heightened, tearful possible", body: "PMS symptoms at their most noticeable", ritual: "Name what you feel — 'I'm in my luteal phase, this will pass'" },
  24: { title: "Craving Comfort", note: "Your body craves carbohydrates because they support serotonin. This is biology, not weakness. Feed yourself kindly.", energy: "Low", mood: "Comfort-seeking, vulnerable", body: "Strong food cravings, possible brain fog", ritual: "Sweet potato, oats, dark chocolate — nourish the need" },
  25: { title: "Releasing", note: "Something in you is ready to let go — an emotion, a thought pattern, something that no longer fits.", energy: "Very low", mood: "Cathartic, reflective", body: "Body feels heavy and full", ritual: "Write what you want to release. Burn it if that feels right." },
  26: { title: "The Veil Thins", note: "The days before menstruation are considered the most spiritually perceptive. Your intuition is at its sharpest.", energy: "Low but vivid", mood: "Psychic, dreamy, heightened", body: "Dreams may be intense, sleep may be disrupted", ritual: "Pay attention to dreams. Write them down." },
  27: { title: "Almost", note: "The cycle draws to its close. Your body knows what comes next. Rest as much as you can — prepare to begin again.", energy: "Very low", mood: "Withdrawn, anticipatory", body: "Period may arrive soon", ritual: "Prepare your comfort kit — heat pack, iron-rich food, rest" },
  28: { title: "The Last Night", note: "The final day of the cycle. Whatever this month held — grief, joy, difficulty, beauty — it is complete. Tomorrow, the wheel turns.", energy: "Lowest point", mood: "Inward, complete", body: "Period imminent", ritual: "Rest. Acknowledge the full cycle. You did it." },
};

// ─── PHASES ───────────────────────────────────────────────────────────────────
const PHASES = {
  menstrual: {
    name: "Menstrual", days: "Days 1–5", emoji: "🌑", tagline: "The dark moon within",
    color: "#C4899A", bg: "#150E18", cardBg: "#1E1424", textColor: "#F0E4EA", mutedColor: "#9B8290",
    description: "Your body sheds what it no longer needs. Oestrogen and progesterone are at their lowest. A time of deep rest, inward wisdom and sacred release.",
    symptoms: ["Cramping & lower back pain", "Deep fatigue", "Bloating & heaviness", "Headaches from hormone drop", "Deep introspection", "Heightened emotional sensitivity"],
    foods: [
      { item: "Dark leafy greens — spinach, kale", reason: "Replenish iron lost through bleeding" },
      { item: "Red meat, lentils & beans", reason: "Iron-rich foods prevent anaemia and fatigue" },
      { item: "Dark chocolate 70%+", reason: "Magnesium eases cramps and genuinely lifts mood" },
      { item: "Oily fish — salmon, sardines", reason: "Omega-3s reduce the prostaglandins that cause cramping" },
      { item: "Warming soups & broths", reason: "Easy to digest, comforting and deeply hydrating" },
      { item: "Ginger & turmeric tea", reason: "Anti-inflammatory — reduces cramping severity" },
    ],
    supplements: [
      { item: "Magnesium glycinate 300–400mg", reason: "Reduces cramps, bloating and improves sleep quality" },
      { item: "Omega-3 / fish oil", reason: "Reduces prostaglandins that drive cramping pain" },
      { item: "Iron + Vitamin C", reason: "Replenish iron lost — Vit C doubles absorption" },
      { item: "Vitamin B1 (Thiamine)", reason: "Clinical studies show significant reduction in period pain" },
    ],
    selfCare: [
      { tip: "Heat pack on lower abdomen or back", why: "Relaxes uterine muscles and triggers endorphins — as effective as ibuprofen for mild cramps (Mayo Clinic)" },
      { tip: "Warm bath with Epsom salts", why: "Magnesium absorbs through skin while warmth eases full-body tension" },
      { tip: "Gentle yoga, stretching or slow walking", why: "Releases endorphins naturally. Even 15 minutes shifts pain." },
      { tip: "Ibuprofen — start at the first sign", why: "Most effective before pain peaks, not after (ACOG)" },
      { tip: "Rest without guilt", why: "Your body is doing significant work. This is maintenance, not laziness." },
      { tip: "Reduce caffeine & alcohol", why: "Both worsen bloating, sleep and cramping sensitivity" },
    ],
  },
  follicular: {
    name: "Follicular", days: "Days 6–13", emoji: "🌒", tagline: "Seeds stir beneath the soil",
    color: "#8DB89E", bg: "#0E1612", cardBg: "#141E18", textColor: "#E4F0EA", mutedColor: "#809080",
    description: "Oestrogen rises as follicles develop. Energy, mood and creativity return. Your mind is sharp and your body capable. The world opens again.",
    symptoms: ["Rising energy and motivation", "Improved mood and optimism", "Sharper focus and thinking", "Greater desire to socialise", "Skin clearing and brightening", "Physical stamina increasing"],
    foods: [
      { item: "Eggs & quality protein", reason: "Support follicle development and sustained energy" },
      { item: "Fermented foods — yoghurt, kefir, kimchi", reason: "Gut health regulates oestrogen metabolism" },
      { item: "Broccoli & cruciferous vegetables", reason: "Support liver clearance of used oestrogen" },
      { item: "Flaxseeds & pumpkin seeds", reason: "Phytoestrogens gently support rising oestrogen" },
      { item: "Berries & citrus", reason: "Antioxidants protect developing follicles" },
      { item: "Whole grains — oats, quinoa", reason: "Steady energy as vitality builds" },
    ],
    supplements: [
      { item: "Vitamin D3 1000–2000 IU", reason: "Supports follicle development, hormone signalling and mood" },
      { item: "B-vitamin complex (esp. B6)", reason: "Energy metabolism and mood neurotransmitter production" },
      { item: "Zinc 15–25mg", reason: "Supports follicular development and skin clarity" },
      { item: "Probiotic", reason: "Gut bacteria that regulate oestrogen levels" },
    ],
    selfCare: [
      { tip: "Begin something new", why: "Oestrogen boosts dopamine — your brain is wired for novelty right now" },
      { tip: "Increase exercise intensity", why: "Energy is building — great phase for strength training or a new class" },
      { tip: "Schedule social plans", why: "You're naturally more outgoing and articulate this week" },
      { tip: "Spend time in natural light", why: "Amplifies the natural serotonin lift of this phase" },
      { tip: "Strategic and creative work", why: "Cognitive flexibility is measurably higher in the follicular phase" },
    ],
  },
  ovulatory: {
    name: "Ovulatory", days: "Days 14–16", emoji: "🌕", tagline: "Full moon rising",
    color: "#C4B06A", bg: "#181410", cardBg: "#221C0E", textColor: "#F0EAD4", mutedColor: "#9B9070",
    description: "A surge in LH releases the egg. Oestrogen peaks and testosterone rises. You are at your most radiant, magnetic and alive. The full moon of your cycle.",
    symptoms: ["Peak energy and confidence", "Heightened libido", "Possible mid-cycle cramping (mittelschmerz)", "Cervical fluid clear and stretchy", "Heightened senses", "Magnetic social presence"],
    foods: [
      { item: "Leafy greens & raw salads", reason: "Support liver clearance of declining oestrogen" },
      { item: "High-fibre foods", reason: "Bind and eliminate used hormones efficiently" },
      { item: "Light proteins — fish, tofu, chicken", reason: "Sustain peak energy without heaviness" },
      { item: "Avocado & olive oil", reason: "Healthy fats support continued hormone production" },
      { item: "Tomatoes & red peppers", reason: "Lycopene and Vit C support egg quality" },
      { item: "Coconut water", reason: "Electrolytes for peak physical performance" },
    ],
    supplements: [
      { item: "CoQ10 100–200mg", reason: "Supports egg quality and cellular energy" },
      { item: "Vitamin C 500–1000mg", reason: "Antioxidant protection, supports luteal transition" },
      { item: "Selenium 55–100mcg", reason: "Antioxidant shown to protect egg quality" },
      { item: "Continue Vitamin D3 & Zinc", reason: "Ongoing hormone and reproductive health support" },
    ],
    selfCare: [
      { tip: "Schedule important conversations", why: "Verbal fluency and confidence peak at ovulation — use this window" },
      { tip: "High-intensity exercise", why: "Peak energy and pain tolerance — your best week for challenge" },
      { tip: "Prioritise intimacy and connection", why: "Libido and oxytocin are elevated — lean in" },
      { tip: "Hydrate generously", why: "High energy expenditure — hydration supports mood and performance" },
      { tip: "Don't overcommit", why: "The luteal phase is coming — balance now protects you later" },
    ],
  },
  luteal: {
    name: "Luteal", days: "Days 17–28", emoji: "🌖", tagline: "The moon draws inward",
    color: "#A896C4", bg: "#120E1A", cardBg: "#1A1424", textColor: "#EAE4F0", mutedColor: "#8A8095",
    description: "Progesterone rises then falls. Serotonin drops. Your body and mind turn inward. This is not malfunction — it is the necessary counterweight to the brightness that came before.",
    symptoms: ["Bloating & water retention", "Breast tenderness", "Mood changes — irritability or tearfulness", "Food cravings, especially carbs", "Fatigue & disrupted sleep", "Brain fog & reduced focus"],
    foods: [
      { item: "Complex carbohydrates — sweet potato, oats", reason: "Stabilise blood sugar and support serotonin" },
      { item: "Turkey, chicken & salmon", reason: "Tryptophan supports serotonin production" },
      { item: "Sesame & sunflower seeds", reason: "Support progesterone production" },
      { item: "Calcium-rich foods — dairy, almonds, sardines", reason: "RCTs show calcium reduces PMS symptoms significantly" },
      { item: "Dark chocolate & nuts", reason: "Magnesium reduces PMS bloating, cramps and anxiety" },
      { item: "Chamomile or passionflower tea", reason: "Natural support for sleep disruption and anxiety" },
    ],
    supplements: [
      { item: "Magnesium glycinate 400mg", reason: "Most evidenced PMS supplement — reduces mood swings, cramps and bloating" },
      { item: "Calcium carbonate 1000–1200mg", reason: "RCTs show ~50% reduction in overall PMS severity" },
      { item: "Vitamin B6 50mg", reason: "Supports serotonin and progesterone — reduces mood symptoms" },
      { item: "Chasteberry / Vitex agnus-castus", reason: "Evidence for reducing PMS and breast pain — consult doctor first" },
    ],
    selfCare: [
      { tip: "Reduce your schedule in the final 5 days", why: "Cortisol is measurably higher in late luteal. Overcommitting significantly worsens PMS." },
      { tip: "Consistent sleep routine", why: "Progesterone sedates but sleep quality drops — a consistent bedtime helps most" },
      { tip: "Gentle yoga and walking", why: "Yoga has strong evidence for reducing both physical and emotional PMS symptoms" },
      { tip: "Eat every 3–4 hours with protein", why: "Blood sugar swings worsen mood, cravings and fatigue" },
      { tip: "Name what's happening", why: "'I'm in my luteal phase — there is a biological reason I feel this way' reduces emotional reactivity" },
      { tip: "Warmth and intentional comfort", why: "Hot water bottle, warm bath — these actively lower cortisol" },
    ],
  },
};

const AGE_INFO = {
  "20s": { label: "In your 20s", emoji: "🌱", content: "Cycles are often still settling. Period pain is most common in your 20s and often improves with age. Cycles between 21–35 days are completely normal. If pain disrupts daily life, see a GP to rule out endometriosis or fibroids." },
  "30s": { label: "In your 30s", emoji: "🌿", content: "Often the most predictable decade. PMS can feel more intense as life pressures increase — stress amplifies cycle symptoms through cortisol. Iron stores become more important with heavy periods." },
  perimenopause: { label: "Perimenopause (40s–early 50s)", emoji: "🍂", content: "Begins typically in the mid-40s, lasting 4–8 years before menopause. First sign is usually irregular periods — shorter, longer, heavier or lighter. Also: hot flashes, night sweats, mood changes, sleep disruption, brain fog, vaginal dryness. These are caused by declining oestrogen, not anything wrong with you. You can still get pregnant during perimenopause." },
};

const AVG_CYCLE = 28;
function getPhaseKey(d) { if (d <= 5) return "menstrual"; if (d <= 13) return "follicular"; if (d <= 16) return "ovulatory"; return "luteal"; }
function getDOC(start) { if (!start) return null; const s = new Date(start), t = new Date(); [s,t].forEach(x=>x.setHours(0,0,0,0)); const diff = Math.floor((t-s)/86400000)+1; return diff>0 ? ((diff-1)%AVG_CYCLE)+1 : null; }
function fmt(d, opts) { return new Date(d).toLocaleDateString("en-NZ", opts); }

// ─── STARS ────────────────────────────────────────────────────────────────────
const STARS = Array.from({length:45},(_,i)=>({ x:(i*137.5)%100, y:(i*97.3)%100, s:(i%3)*0.5+0.4, o:(i%5)*0.1+0.06 }));

export default function App() {
  const [cycles, setCycles] = useState(()=>{ try{return JSON.parse(localStorage.getItem("ct3")||"[]")}catch{return[]} });
  const [view, setView] = useState("home");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [activePhase, setActivePhase] = useState(null);
  const [phaseTab, setPhaseTab] = useState("care");
  const [ageView, setAgeView] = useState(null);

  useEffect(()=>{ try{localStorage.setItem("ct3",JSON.stringify(cycles))}catch{} },[cycles]);

  const last = cycles.at(-1)||null;
  const doc = getDOC(last?.start);
  const curKey = doc ? getPhaseKey(doc) : null;
  const cur = curKey ? PHASES[curKey] : null;
  const guide = doc ? DAY_GUIDE[Math.min(doc,28)] : null;
  const moon = getMoonPhase(new Date());
  const next = last ? (()=>{ const d=new Date(last.start); d.setDate(d.getDate()+AVG_CYCLE); return d; })() : null;
  const daysUntil = next ? Math.max(0,Math.ceil((next-new Date())/86400000)) : null;
  const dispKey = activePhase||curKey;
  const disp = dispKey ? PHASES[dispKey] : null;
  const T = cur||PHASES.menstrual;

  const card = (extra={}) => ({ background: T.cardBg, borderRadius: 16, padding: "18px", marginBottom: 12, border: `1px solid ${T.color}1A`, ...extra });
  const sl = { fontFamily:"'Raleway',sans-serif", fontSize:9, letterSpacing:2.8, textTransform:"uppercase", color:T.color, opacity:0.65, marginBottom:12, display:"block" };
  const row = (i,len,c) => ({ display:"flex", gap:12, padding:"9px 0", borderBottom: i<len-1?`1px solid ${c||T.color}18`:"none", alignItems:"flex-start" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} body{background:${T.bg}}
        ::-webkit-scrollbar{width:0}
        .fi{animation:fi 0.5s ease forwards} @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .pulse{animation:pulse 4s ease-in-out infinite} @keyframes pulse{0%,100%{opacity:0.7}50%{opacity:1}}
        input[type=date]{color-scheme:dark}
      `}</style>
      <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Cormorant Garamond',Georgia,serif", color:T.textColor, maxWidth:430, margin:"0 auto", position:"relative", transition:"background 1s" }}>
        {/* Stars */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
          {STARS.map((s,i)=><div key={i} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.s,height:s.s,borderRadius:"50%",background:"#F0E6C8",opacity:s.o}} />)}
        </div>

        {/* Header */}
        <div style={{position:"relative",zIndex:1,padding:"30px 22px 14px",borderBottom:`1px solid ${T.color}1A`}}>
          <p style={{fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:3.5,textTransform:"uppercase",color:T.color,opacity:0.7}}>
            {fmt(new Date(),{weekday:"long",day:"numeric",month:"long"})}
          </p>
          <h1 style={{fontSize:28,fontWeight:300,fontStyle:"italic",color:T.textColor,marginTop:4,letterSpacing:0.3}}>
            {cur ? cur.name : "Cycle Tracker"}
          </h1>
          {cur && <p style={{fontFamily:"'Raleway',sans-serif",fontSize:10,color:T.color,letterSpacing:2.5,textTransform:"uppercase",marginTop:5,opacity:0.65}}>{cur.tagline}</p>}
        </div>

        {/* Nav */}
        {view!=="phase" && (
          <div style={{position:"relative",zIndex:1,display:"flex",borderBottom:`1px solid ${T.color}1A`}}>
            {[["home","Today"],["log","Log"]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"11px",border:"none",background:"transparent",fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:3,textTransform:"uppercase",color:view===v?T.color:T.mutedColor,borderBottom:view===v?`1px solid ${T.color}`:"1px solid transparent",cursor:"pointer",transition:"all 0.3s"}}>{l}</button>
            ))}
          </div>
        )}

        {/* Views */}
        <div style={{position:"relative",zIndex:1}}>

          {/* ── HOME ── */}
          {view==="home" && (
            <div style={{padding:"18px 20px 100px"}} className="fi">
              {!cur ? (
                <div style={{...card(),textAlign:"center",padding:"50px 20px"}}>
                  <div className="pulse" style={{fontSize:52,marginBottom:16}}>🌑</div>
                  <p style={{fontFamily:"'Raleway',sans-serif",fontSize:13,color:T.mutedColor,lineHeight:1.8,marginBottom:24}}>Log your first period to begin<br/>tracking your sacred cycle</p>
                  <button onClick={()=>setView("log")} style={{background:T.color,color:T.bg,border:"none",borderRadius:100,padding:"10px 28px",fontFamily:"'Raleway',sans-serif",fontSize:10,letterSpacing:2.5,textTransform:"uppercase",cursor:"pointer"}}>Begin</button>
                </div>
              ) : (<>

                {/* Moon + Day card */}
                <div style={{...card(),display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:78}}>
                    <MoonSVG phase={moon.svg} size={68} />
                    <p style={{fontFamily:"'Raleway',sans-serif",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:T.color,textAlign:"center",opacity:0.75,lineHeight:1.4}}>{moon.name}</p>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:3}}>
                      <span style={{fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:T.color,opacity:0.6}}>Day</span>
                      <span style={{fontSize:26,color:T.color,fontWeight:300,lineHeight:1}}>{doc}</span>
                      <span style={{fontFamily:"'Raleway',sans-serif",fontSize:9,color:T.mutedColor,opacity:0.6}}>of ~28</span>
                    </div>
                    <h3 style={{fontSize:18,fontWeight:400,fontStyle:"italic",color:T.textColor,marginBottom:6}}>{guide?.title}</h3>
                    <p style={{fontFamily:"'Raleway',sans-serif",fontSize:12,color:T.mutedColor,lineHeight:1.7}}>{guide?.note}</p>
                  </div>
                </div>

                {/* Moon description */}
                <div style={{...card(),padding:"13px 18px"}}>
                  <span style={sl}>Tonight's Moon</span>
                  <p style={{fontSize:14,fontStyle:"italic",color:T.mutedColor,lineHeight:1.7}}>{moon.description}</p>
                </div>

                {/* Today's energy */}
                {guide && (
                  <div style={card()}>
                    <span style={sl}>Today's energy</span>
                    {[["✦ Energy",guide.energy],["✦ Mood",guide.mood],["✦ Body",guide.body]].map(([label,val])=>(
                      <div key={label} style={{display:"flex",gap:12,marginBottom:9,alignItems:"flex-start"}}>
                        <span style={{fontFamily:"'Raleway',sans-serif",fontSize:10,color:T.color,minWidth:62,opacity:0.75,marginTop:2,letterSpacing:0.3}}>{label}</span>
                        <span style={{fontFamily:"'Raleway',sans-serif",fontSize:12,color:T.mutedColor,lineHeight:1.6,flex:1}}>{val}</span>
                      </div>
                    ))}
                    <div style={{marginTop:14,padding:"12px 14px",background:T.color+"12",borderRadius:10,borderLeft:`2px solid ${T.color}44`}}>
                      <p style={{fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:T.color,opacity:0.7,marginBottom:5}}>Today's ritual</p>
                      <p style={{fontSize:14,fontStyle:"italic",color:T.textColor,lineHeight:1.5}}>{guide.ritual}</p>
                    </div>
                  </div>
                )}

                {/* Phase overview */}
                <div style={card()}>
                  <span style={sl}>{cur.name} phase · {cur.days}</span>
                  <p style={{fontSize:14,fontStyle:"italic",color:T.mutedColor,lineHeight:1.8,marginBottom:14}}>{cur.description}</p>
                  <button onClick={()=>{setActivePhase(curKey);setPhaseTab("care");setView("phase")}} style={{background:"none",border:`1px solid ${T.color}44`,borderRadius:100,padding:"7px 18px",color:T.color,fontFamily:"'Raleway',sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Full phase guide →</button>
                </div>

                {/* Next period */}
                {next && (
                  <div style={{...card(),display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <span style={sl}>Next moon blood</span>
                      <p style={{fontSize:15,color:T.textColor}}>{fmt(next,{day:"numeric",month:"short",year:"numeric"})}</p>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <p style={{fontSize:30,color:T.color,fontWeight:300,lineHeight:1}}>{daysUntil}</p>
                      <p style={{fontFamily:"'Raleway',sans-serif",fontSize:9,color:T.color,letterSpacing:1.5,textTransform:"uppercase",opacity:0.7}}>days</p>
                    </div>
                  </div>
                )}

                {/* Explore phases */}
                <div style={card()}>
                  <span style={sl}>The wheel of the cycle</span>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {Object.entries(PHASES).map(([k,p])=>(
                      <button key={k} onClick={()=>{setActivePhase(k);setPhaseTab("care");setView("phase")}} style={{background:curKey===k?p.color+"22":"transparent",color:p.color,border:`1px solid ${p.color}44`,borderRadius:100,padding:"5px 14px",fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer"}}>
                        {p.emoji} {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age info */}
                <div style={card()}>
                  <span style={sl}>Life stage wisdom</span>
                  {Object.entries(AGE_INFO).map(([k,a])=>(
                    <button key={k} onClick={()=>setAgeView(ageView===k?null:k)} style={{display:"block",width:"100%",textAlign:"left",background:ageView===k?T.color+"14":"transparent",border:`1px solid ${ageView===k?T.color:T.color+"33"}`,borderRadius:10,padding:"10px 14px",marginBottom:6,cursor:"pointer",fontFamily:"'Raleway',sans-serif",color:ageView===k?T.color:T.mutedColor,fontSize:12}}>
                      {a.emoji} {a.label}
                    </button>
                  ))}
                  {ageView && (
                    <div style={{background:T.color+"0C",borderRadius:10,padding:"14px",marginTop:4,border:`1px solid ${T.color}22`}}>
                      <p style={{fontFamily:"'Raleway',sans-serif",fontSize:12,color:T.mutedColor,lineHeight:1.8}}>{AGE_INFO[ageView].content}</p>
                      <p style={{fontFamily:"'Raleway',sans-serif",fontSize:10,color:T.color,opacity:0.45,marginTop:10}}>Always speak with your GP about significant cycle changes.</p>
                    </div>
                  )}
                </div>
              </>)}
            </div>
          )}

          {/* ── LOG ── */}
          {view==="log" && (
            <div style={{padding:"18px 20px 100px"}} className="fi">
              <div style={card()}>
                <h3 style={{fontSize:20,fontWeight:300,fontStyle:"italic",color:T.textColor,marginBottom:20}}>Record your bleeding</h3>
                <label style={sl}>First day of blood *</label>
                <input type="date" value={newStart} onChange={e=>setNewStart(e.target.value)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${T.color}33`,background:T.bg,color:T.textColor,fontFamily:"'Raleway',sans-serif",fontSize:14,outline:"none",marginTop:5,boxSizing:"border-box"}} />
                <div style={{height:14}} />
                <label style={sl}>Last day (optional)</label>
                <input type="date" value={newEnd} onChange={e=>setNewEnd(e.target.value)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${T.color}33`,background:T.bg,color:T.textColor,fontFamily:"'Raleway',sans-serif",fontSize:14,outline:"none",marginTop:5,boxSizing:"border-box"}} />
                <button onClick={()=>{if(!newStart)return;setCycles(p=>[...p,{start:newStart,end:newEnd||null,id:Date.now()}]);setNewStart("");setNewEnd("");setView("home")}} disabled={!newStart}
                  style={{width:"100%",marginTop:18,padding:"13px",borderRadius:100,border:"none",background:newStart?T.color:T.color+"44",color:T.bg,fontFamily:"'Raleway',sans-serif",fontSize:10,letterSpacing:2.5,textTransform:"uppercase",cursor:newStart?"pointer":"not-allowed"}}>Save</button>
                <button onClick={()=>setView("home")} style={{width:"100%",marginTop:8,padding:"11px",borderRadius:100,border:`1px solid ${T.color}33`,background:"transparent",color:T.mutedColor,fontFamily:"'Raleway',sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Cancel</button>
              </div>
              {cycles.length>0 && (
                <div style={card()}>
                  <span style={sl}>Past cycles</span>
                  {[...cycles].reverse().slice(0,5).map(c=>(
                    <div key={c.id} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.color}18`,alignItems:"flex-start"}}>
                      <span style={{color:T.color,fontSize:10,marginTop:4,opacity:0.7}}>✦</span>
                      <div>
                        <p style={{fontFamily:"'Raleway',sans-serif",fontSize:13,color:T.textColor}}>Began {fmt(c.start,{day:"numeric",month:"short",year:"numeric"})}</p>
                        {c.end && <p style={{fontFamily:"'Raleway',sans-serif",fontSize:11,color:T.mutedColor,marginTop:2}}>Ended {fmt(c.end,{day:"numeric",month:"short",year:"numeric"})}</p>}
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>{if(window.confirm("Remove the last logged cycle?"))setCycles(p=>p.slice(0,-1))}} style={{marginTop:12,background:"none",border:"none",color:T.mutedColor,fontFamily:"'Raleway',sans-serif",fontSize:10,letterSpacing:1.5,cursor:"pointer",textTransform:"uppercase"}}>Remove last entry</button>
                </div>
              )}
            </div>
          )}

          {/* ── PHASE DETAIL ── */}
          {view==="phase" && disp && (
            <div style={{background:disp.bg,minHeight:"100vh",transition:"background 0.6s"}}>
              <div style={{padding:"18px 20px 100px"}} className="fi">
                <button onClick={()=>{setActivePhase(null);setView("home")}} style={{background:"none",border:"none",cursor:"pointer",color:disp.color,fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:2.5,padding:0,marginBottom:16,textTransform:"uppercase"}}>← Back</button>
                <div style={{textAlign:"center",marginBottom:22}}>
                  <div className="pulse" style={{fontSize:46,marginBottom:8}}>{disp.emoji}</div>
                  <h2 style={{fontSize:30,fontWeight:300,fontStyle:"italic",color:disp.textColor}}>{disp.name}</h2>
                  <p style={{fontFamily:"'Raleway',sans-serif",fontSize:9,color:disp.color,letterSpacing:3,textTransform:"uppercase",marginTop:6,opacity:0.8}}>{disp.tagline}</p>
                  <p style={{fontFamily:"'Raleway',sans-serif",fontSize:9,color:disp.mutedColor,letterSpacing:1.5,marginTop:4}}>{disp.days}</p>
                </div>

                {/* Description */}
                <div style={{background:disp.cardBg,borderRadius:16,padding:"18px",marginBottom:12,border:`1px solid ${disp.color}1A`}}>
                  <p style={{fontSize:15,fontStyle:"italic",color:disp.mutedColor,lineHeight:1.85}}>{disp.description}</p>
                </div>

                {/* Symptoms */}
                <div style={{background:disp.cardBg,borderRadius:16,padding:"18px",marginBottom:12,border:`1px solid ${disp.color}1A`}}>
                  <span style={{fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:2.8,textTransform:"uppercase",color:disp.color,opacity:0.65,marginBottom:12,display:"block"}}>What to expect</span>
                  {disp.symptoms.map((s,i)=>(
                    <div key={i} style={row(i,disp.symptoms.length,disp.color)}>
                      <span style={{color:disp.color,fontSize:10,marginTop:3,opacity:0.7}}>✦</span>
                      <p style={{fontFamily:"'Raleway',sans-serif",fontSize:12,color:disp.mutedColor,lineHeight:1.5}}>{s}</p>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{display:"flex",gap:6,marginBottom:12}}>
                  {[["care","Self-care"],["food","Food"],["supplements","Supplements"]].map(([t,l])=>(
                    <button key={t} onClick={()=>setPhaseTab(t)} style={{flex:1,padding:"9px 4px",border:`1px solid ${phaseTab===t?disp.color:disp.color+"33"}`,borderRadius:8,fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer",background:phaseTab===t?disp.color+"18":"transparent",color:phaseTab===t?disp.color:disp.mutedColor,transition:"all 0.2s"}}>{l}</button>
                  ))}
                </div>

                {/* Tab content */}
                {["care","food","supplements"].map(tab => tab===phaseTab && (
                  <div key={tab} style={{background:disp.cardBg,borderRadius:16,padding:"18px",marginBottom:12,border:`1px solid ${disp.color}1A`}}>
                    <span style={{fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:2.8,textTransform:"uppercase",color:disp.color,opacity:0.65,marginBottom:12,display:"block"}}>
                      {tab==="care"?"Rituals & self-care":tab==="food"?"Nourishment for this phase":"Supplements to consider"}
                    </span>
                    {(tab==="care"?disp.selfCare:tab==="food"?disp.foods:disp.supplements).map((item,i,arr)=>(
                      <div key={i} style={row(i,arr.length,disp.color)}>
                        <span style={{color:disp.color,fontSize:10,marginTop:4,opacity:0.7}}>✦</span>
                        <div>
                          <p style={{fontSize:14,color:disp.textColor,lineHeight:1.4,marginBottom:4}}>{tab==="care"?item.tip:item.item}</p>
                          <p style={{fontFamily:"'Raleway',sans-serif",fontSize:11,color:disp.mutedColor,lineHeight:1.6}}>{tab==="care"?item.why:item.reason}</p>
                        </div>
                      </div>
                    ))}
                    {tab==="supplements" && (
                      <div style={{marginTop:14,padding:"12px",background:disp.color+"0C",borderRadius:10,border:`1px solid ${disp.color}22`}}>
                        <p style={{fontFamily:"'Raleway',sans-serif",fontSize:11,color:disp.mutedColor,lineHeight:1.7}}>Consult a GP or pharmacist before starting new supplements, especially with existing medications.</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Other phases */}
                <div style={{background:disp.cardBg,borderRadius:16,padding:"18px",marginBottom:12,border:`1px solid ${disp.color}1A`}}>
                  <span style={{fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:2.8,textTransform:"uppercase",color:disp.color,opacity:0.65,marginBottom:12,display:"block"}}>Other phases</span>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {Object.entries(PHASES).filter(([k])=>k!==dispKey).map(([k,p])=>(
                      <button key={k} onClick={()=>{setActivePhase(k);setPhaseTab("care")}} style={{background:"transparent",color:p.color,border:`1px solid ${p.color}44`,borderRadius:100,padding:"5px 14px",fontFamily:"'Raleway',sans-serif",fontSize:9,letterSpacing:1.5,textTransform:"uppercase",cursor:"pointer"}}>
                        {p.emoji} {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAB */}
        {view==="home" && (
          <button onClick={()=>setView("log")} style={{position:"fixed",bottom:26,right:20,width:52,height:52,borderRadius:"50%",background:T.color,color:T.bg,border:"none",fontSize:22,cursor:"pointer",boxShadow:`0 0 28px ${T.color}66`,zIndex:100,fontFamily:"'Cormorant Garamond',serif"}}>+</button>
        )}
      </div>
    </>
  );
}
