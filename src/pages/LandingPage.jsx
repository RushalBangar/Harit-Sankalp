import React, { useState, useRef, useEffect } from 'react';
import {
  Leaf, Users, Building2, ShieldCheck, ChevronRight,
  TreePine, Gift, Camera, Award, ArrowRight,
  CheckCircle2, Shield, TrendingUp, Zap, MapPin, Globe,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   GREEN CYCLE — Animated SVG Ring Diagram
   An Apple-Watch-style circular flow diagram showing the 4
   programme steps. A glowing dot travels the ring continuously.
═══════════════════════════════════════════════════════════════ */
const CYCLE_NODES = [
  { id: 'top',    cx: 190, cy: 80,  icon: TreePine, label: 'Claim',   sub: 'Free sapling'  },
  { id: 'right',  cx: 300, cy: 190, icon: Camera,   label: 'Verify',  sub: 'GPS + photo'   },
  { id: 'bottom', cx: 190, cy: 300, icon: Award,    label: 'Earn',    sub: '100 pts/tree'  },
  { id: 'left',   cx: 80,  cy: 190, icon: Gift,     label: 'Redeem',  sub: 'QR vouchers'   },
];

function GreenCycleVisual() {
  return (
    <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] flex items-center justify-center overflow-visible my-6 lg:my-0">
      <div
        className="animate-slide-up-delay-2 relative select-none scale-[0.78] sm:scale-100 origin-center shrink-0"
        style={{ width: 380, height: 380 }}
      >
        {/* SVG — ring, dots, labels */}
        <svg
          width="380" height="380" viewBox="0 0 380 380"
          className="absolute inset-0"
          aria-label="The Green Cycle — four programme steps"
        >
          <defs>
            {/* Glow filter for travelling dot */}
            <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Radial gradient for centre backdrop */}
            <radialGradient id="centreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(16,185,129,0.10)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </radialGradient>
            {/* Full-circle motion path starting at top node (190,80) */}
            <path id="ringPath" d="M190,80 A110,110 0 1,1 189.9999,80" fill="none" />
          </defs>

          {/* Ambient centre glow */}
          <circle cx="190" cy="190" r="160" fill="url(#centreGrad)" />

          {/* Outermost decorative dashed ring */}
          <circle cx="190" cy="190" r="148"
            fill="none" stroke="rgba(16,185,129,0.05)"
            strokeWidth="1" strokeDasharray="5 14" />

          {/* Main ring track */}
          <circle cx="190" cy="190" r="110"
            fill="none" stroke="rgba(16,185,129,0.20)"
            strokeWidth="1.5" />

          {/* Inner guide ring */}
          <circle cx="190" cy="190" r="68"
            fill="none" stroke="rgba(16,185,129,0.07)"
            strokeWidth="1" strokeDasharray="3 10" />

          {/* Centre backdrop */}
          <circle cx="190" cy="190" r="48"
            fill="rgba(1,24,16,0.95)"
            stroke="rgba(16,185,129,0.22)" strokeWidth="1" />

          {/* Centre text */}
          <text x="190" y="183" textAnchor="middle"
            fontSize="7.5" fontWeight="700"
            fill="rgba(52,211,153,0.75)" letterSpacing="2.5">THE</text>
          <text x="190" y="193" textAnchor="middle"
            fontSize="7.5" fontWeight="700"
            fill="rgba(52,211,153,0.75)" letterSpacing="2.5">GREEN</text>
          <text x="190" y="203" textAnchor="middle"
            fontSize="7.5" fontWeight="700"
            fill="rgba(52,211,153,0.75)" letterSpacing="2.5">CYCLE</text>

          {/* Spoke lines (from inner ring to node junction) */}
          <line x1="190" y1="142" x2="190" y2="84"  stroke="rgba(16,185,129,0.08)" strokeWidth="1" />
          <line x1="238" y1="190" x2="296" y2="190" stroke="rgba(16,185,129,0.08)" strokeWidth="1" />
          <line x1="190" y1="238" x2="190" y2="296" stroke="rgba(16,185,129,0.08)" strokeWidth="1" />
          <line x1="142" y1="190" x2="84"  y2="190" stroke="rgba(16,185,129,0.08)" strokeWidth="1" />

          {/* Node junction circles on ring */}
          {CYCLE_NODES.map(n => (
            <circle key={n.id}
              cx={n.cx} cy={n.cy} r="6"
              fill="#011810" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" />
          ))}

          {/* Node labels — formal, short */}
          {/* Top */}
          <text x="190" y="57" textAnchor="middle"
            fontSize="11.5" fontWeight="700" fill="rgba(255,255,255,0.85)">Claim</text>
          <text x="190" y="69" textAnchor="middle"
            fontSize="9" fill="rgba(52,211,153,0.55)">Free sapling</text>

          {/* Right */}
          <text x="318" y="186" textAnchor="start"
            fontSize="11.5" fontWeight="700" fill="rgba(255,255,255,0.85)">Verify</text>
          <text x="318" y="198" textAnchor="start"
            fontSize="9" fill="rgba(52,211,153,0.55)">GPS + photo</text>

          {/* Bottom */}
          <text x="190" y="325" textAnchor="middle"
            fontSize="11.5" fontWeight="700" fill="rgba(255,255,255,0.85)">Earn</text>
          <text x="190" y="337" textAnchor="middle"
            fontSize="9" fill="rgba(52,211,153,0.55)">100 pts / tree</text>

          {/* Left */}
          <text x="62" y="186" textAnchor="end"
            fontSize="11.5" fontWeight="700" fill="rgba(255,255,255,0.85)">Redeem</text>
          <text x="62" y="198" textAnchor="end"
            fontSize="9" fill="rgba(52,211,153,0.55)">QR voucher</text>

          {/* Primary animated dot (bright, glowing) */}
          <circle r="6" fill="#34d399" filter="url(#dotGlow)">
            <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
              <mpath href="#ringPath" />
            </animateMotion>
          </circle>

          {/* Secondary trailing dot */}
          <circle r="3.5" fill="rgba(52,211,153,0.40)">
            <animateMotion dur="9s" begin="-3s" repeatCount="indefinite" rotate="auto">
              <mpath href="#ringPath" />
            </animateMotion>
          </circle>

          {/* Tertiary trailing dot (very dim) */}
          <circle r="2" fill="rgba(52,211,153,0.15)">
            <animateMotion dur="9s" begin="-6s" repeatCount="indefinite" rotate="auto">
              <mpath href="#ringPath" />
            </animateMotion>
          </circle>
        </svg>

        {/* Icon overlays — React components positioned on ring nodes */}
        {CYCLE_NODES.map(n => (
          <div
            key={n.id}
            className="absolute flex items-center justify-center rounded-xl"
            style={{
              width: 34, height: 34,
              left: n.cx - 17, top: n.cy - 17,
              background: 'rgba(1,18,12,0.97)',
              border: '1.5px solid rgba(52,211,153,0.40)',
            }}
          >
            <n.icon style={{ width: 16, height: 16 }} className="text-emerald-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARQUEE TICKER STRIP
═══════════════════════════════════════════════════════════════ */
const TICKER_ITEMS = [
  { icon: Leaf,         text: 'GPS-Verified Plantation'        },
  { icon: Shield,       text: 'Government-Backed Initiative'   },
  { icon: TrendingUp,   text: '98% Plantation Survival Rate'   },
  { icon: Zap,          text: 'Instant Reward Points'          },
  { icon: MapPin,       text: 'Live Pickup Point Locator'      },
  { icon: Globe,        text: 'City-Wide Partner Network'      },
  { icon: CheckCircle2, text: 'Tamper-Proof Verification'      },
  { icon: Award,        text: '100 Points Per Verified Tree'   },
];

function TickerStrip() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-y border-earth-200 bg-earth-50 py-3.5 select-none">
      <div className="animate-marquee flex gap-0 w-max">
        {doubled.map((item, i) => (
          <div key={i} className="inline-flex items-center gap-2.5 px-6 text-earth-600 shrink-0">
            <item.icon className="w-3.5 h-3.5 text-forest-500 flex-shrink-0" />
            <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">
              {item.text}
            </span>
            <span className="text-earth-300 pl-4">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED STAT COUNTER
═══════════════════════════════════════════════════════════════ */
function AnimatedStat({ target, suffix = '', label, delay = 0, isDarkBg = false }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const n = parseInt(target.replace(/\D/g, ''));
        let c = 0;
        const inc = n / (1600 / 20);
        const timer = setInterval(() => {
          c += inc;
          if (c >= n) { setValue(n); clearInterval(timer); }
          else setValue(Math.floor(c));
        }, 20);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center py-2 md:py-4 px-1" style={{ animationDelay: `${delay}ms` }}>
      <div className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-1 tabular-nums ${isDarkBg ? 'text-white' : 'text-forest-800'}`}>
        {value.toLocaleString()}{suffix}
      </div>
      <div className={`text-[8px] sm:text-[10px] uppercase tracking-wider md:tracking-[0.2em] font-semibold ${isDarkBg ? 'text-forest-400' : 'text-earth-500'}`}>
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STAKEHOLDER CARD — information-dense, left-border accent
═══════════════════════════════════════════════════════════════ */
const STAKEHOLDERS = [
  {
    icon: Users, title: 'For Citizens',
    description: 'Earn rewards while contributing to India\'s afforestation mission — one verified tree at a time.',
    benefits: [
      'Claim free indigenous saplings from registered nurseries',
      'Upload GPS-tagged live photo for instant verification',
      'Earn 100 reward points per approved plantation',
      'Redeem points for QR codes at local partner businesses',
    ],
    accentHex: '#059669',
    iconBg: 'bg-forest-50', iconColor: 'text-forest-700',
    delay: 0,
  },
  {
    icon: Building2, title: 'For Local Businesses',
    description: 'Partner as a reward point and attract verified eco-citizens to your establishment at zero cost.',
    benefits: [
      'Register as a QR voucher redemption establishment',
      'Receive targeted footfall from verified planters',
      'Publicly display your environmental commitment',
      'Manage active offers via your business dashboard',
    ],
    accentHex: '#2563eb',
    iconBg: 'bg-blue-50', iconColor: 'text-blue-700',
    delay: 80,
  },
  {
    icon: ShieldCheck, title: 'For Government',
    description: 'Oversee nursery inventory, verify citizen submissions, and access city-wide plantation data.',
    benefits: [
      'Configure nurseries and Pickup Point locations',
      'Review GPS photo submissions for approval or rejection',
      'Access real-time plantation and citizen dashboards',
      'Maintain a tamper-resistant afforestation record',
    ],
    accentHex: '#d97706',
    iconBg: 'bg-amber-50', iconColor: 'text-amber-700',
    delay: 160,
  },
];

function StakeholderCard({ icon: Icon, title, description, benefits, accentHex, iconBg, iconColor, delay }) {
  return (
    <div
      className="animate-slide-up bg-white rounded-2xl overflow-hidden border border-earth-200 shadow-sm hover:shadow-md transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms`, borderLeft: `3px solid ${accentHex}` }}
    >
      <div className="p-7">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200`}>
          <Icon style={{ width: 22, height: 22 }} className={iconColor} />
        </div>
        <h3 className="text-base font-bold text-earth-900 mb-2">{title}</h3>
        <p className="text-sm text-earth-500 leading-relaxed mb-5">{description}</p>
        <ul className="space-y-2.5">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-earth-600">
              <CheckCircle2
                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                style={{ color: accentHex }}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCESS STEPS
═══════════════════════════════════════════════════════════════ */
const STEPS = [
  { num: 1, icon: TreePine, title: 'Claim Sapling',   desc: 'Select an indigenous species and request pickup at your nearest registered government nursery.', delay: 0 },
  { num: 2, icon: Camera,   title: 'Plant & Capture', desc: 'Plant the sapling and photograph it using our live camera. GPS coordinates are validated automatically.', delay: 100 },
  { num: 3, icon: Award,    title: 'Earn Points',     desc: 'Upon officer approval, 100 green reward points are instantly credited to your citizen profile.', delay: 200 },
  { num: 4, icon: Gift,     title: 'Redeem Vouchers', desc: 'Exchange earned points for dynamic QR codes redeemable at any registered partner establishment.', delay: 300 },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage({ setActiveTab, onGetStarted }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ══════════════════════════════════════════════════
          HERO  —  Split layout: text + cycle diagram
      ══════════════════════════════════════════════════ */}
      <header
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, #010f09 0%, #01180f 20%, #022c22 55%, #033a2c 80%, #041f14 100%)',
          minHeight: '93vh',
        }}
      >
        {/* Fine dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
          aria-hidden="true"
        />

        {/* Soft radial glow — top right */}
        <div
          className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        {/* Soft radial glow — bottom left */}
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(4,78,59,0.15) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Thin vertical separator line (desktop) */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none hidden lg:block"
          style={{
            left: '52%',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent 5%, rgba(16,185,129,0.10) 30%, rgba(16,185,129,0.10) 70%, transparent 95%)',
          }}
          aria-hidden="true"
        />

        {/* Content grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-0 min-h-[93vh]">

          {/* ─── LEFT: Text content ─── */}
          <div className="flex-1 text-white lg:pr-16 lg:max-w-[54%]">

            {/* Ministry badge */}
            <div className="animate-hero-text mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded border border-forest-700/60 bg-forest-900/50 text-[11px] font-semibold text-forest-200 tracking-[0.12em] uppercase">
                <Leaf className="w-3 h-3 text-forest-400" />
                Ministry of Environment &nbsp;·&nbsp; Civic Initiative
              </div>
            </div>

            {/* Main headline */}
            <h1 className="animate-hero-text-2 font-extrabold tracking-tight leading-[1.06] mb-6">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
                Every Tree
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-emerald-400">
                Planted.
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-light text-forest-300 mt-2">
                Every Pledge Honoured.
              </span>
            </h1>

            {/* Ruled divider */}
            <div className="animate-hero-text-2 flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-forest-600" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-forest-500 font-semibold">
                Verified Afforestation Platform
              </span>
            </div>

            {/* Description */}
            <p className="animate-hero-text-3 text-sm sm:text-base text-forest-300 leading-relaxed mb-8 max-w-[480px] font-light">
              A government-backed platform where citizens plant verified trees, earn rewards, and local businesses participate — all GPS-confirmed and transparently recorded.
            </p>

            {/* Feature checklist */}
            <ul className="animate-hero-text-3 flex flex-col gap-3.5 mb-10">
              {[
                'Free indigenous saplings from government nurseries',
                'GPS + live camera — tamper-proof, EXIF-verified',
                'Reward points redeemable at certified partner businesses',
              ].map(pt => (
                <li key={pt} className="flex items-start gap-3 text-sm text-forest-200">
                  <div className="mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full bg-forest-800/80 border border-forest-700 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="leading-normal">{pt}</span>
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="animate-hero-text-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-start mb-10">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95 w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  boxShadow: '0 4px 24px rgba(5,150,105,0.38)',
                }}
              >
                Register / Sign In
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium text-forest-300 border border-forest-700/60 hover:border-forest-500 hover:text-white transition-all duration-200 w-full sm:w-auto"
              >
                How It Works <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Inline quick stats */}
            <div className="animate-hero-text-4 flex items-center justify-between sm:justify-start gap-4 sm:gap-6 pt-6 border-t border-forest-800/50">
              {[
                { val: '1,250+', lbl: 'Trees Planted' },
                { val: '45+',   lbl: 'Partners' },
                { val: '98%',   lbl: 'Survival Rate' },
              ].map((s, i) => (
                <React.Fragment key={s.lbl}>
                  {i > 0 && <div className="w-px h-7 bg-forest-800 shrink-0" />}
                  <div>
                    <div className="text-base sm:text-lg font-extrabold text-emerald-400 tabular-nums">{s.val}</div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-forest-500 font-semibold leading-tight mt-0.5">
                      {s.lbl}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: Green Cycle Diagram ─── */}
          <div className="flex-1 flex items-center justify-center lg:justify-end lg:pl-8">
            <GreenCycleVisual />
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-14 fill-white">
            <path d="M0,56 C480,0 960,0 1440,56 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          MARQUEE TICKER
      ══════════════════════════════════════════════════ */}
      <TickerStrip />

      {/* ══════════════════════════════════════════════════
          STAKEHOLDERS — Three Pillars
      ══════════════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-2">Stakeholders</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-earth-900 mb-2">
              Three Pillars of the Programme
            </h2>
            <p className="text-sm text-earth-500 max-w-lg">
              Each stakeholder has a defined role and a clear set of benefits within the Harit Sankalp ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STAKEHOLDERS.map(s => <StakeholderCard key={s.title} {...s} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS — Process Steps
      ══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-earth-50 py-20 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-2">Process</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-earth-900 mb-2">
              The Verification Cycle
            </h2>
            <p className="text-sm text-earth-500 max-w-lg">
              A transparent, four-stage workflow ensuring every planted tree is accountably recorded.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-6 h-px bg-earth-200"
              style={{ left: '12.5%', right: '12.5%' }}
              aria-hidden="true"
            />

            {STEPS.map(step => (
              <div
                key={step.num}
                className="animate-slide-up text-center relative group"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div className="relative mx-auto mb-5 w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-earth-200 group-hover:border-forest-500 group-hover:bg-forest-50 flex items-center justify-center transition-all duration-200 shadow-sm">
                    <step.icon className="w-5 h-5 text-forest-700" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-forest-700 flex items-center justify-center text-[9px] font-bold text-white">
                    {step.num}
                  </div>
                </div>
                <h4 className="font-bold text-earth-900 mb-2 text-sm">{step.title}</h4>
                <p className="text-xs text-earth-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          IMPACT — Animated Stats
      ══════════════════════════════════════════════════ */}
      <section
        className="py-18 px-6"
        style={{
          background: 'linear-gradient(150deg, #011810 0%, #022c22 50%, #033a2c 100%)',
          padding: '5rem 1.5rem',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-400 mb-3">Impact</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Programme at a Glance
            </h2>
            <p className="text-sm text-forest-400 max-w-sm mx-auto">
              Real numbers from our active citizen network across the city.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-0 md:divide-x divide-forest-800">
            <AnimatedStat target="1250" suffix="+" label="Trees Planted"           delay={0}   isDarkBg={true} />
            <AnimatedStat target="45"   suffix="+" label="Business Partners"       delay={150} isDarkBg={true} />
            <AnimatedStat target="98"   suffix="%" label="Plantation Survival Rate" delay={300} isDarkBg={true} />
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-forest-950 bg-emerald-400 hover:bg-emerald-300 transition-colors duration-200 cursor-pointer"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-forest-300 border border-forest-700 hover:border-forest-500 hover:text-white transition-all duration-200"
            >
              View Process <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="border-t border-earth-200 bg-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-earth-450">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-forest-500" />
            <span className="font-semibold text-earth-700">Harit Sankalp</span>
            <span className="text-earth-300">·</span>
            <span>Environmental Initiative</span>
          </div>
          <p>
            © {new Date().getFullYear()} All Rights Reserved. Developed for grassroots afforestation &amp; civic partnership.
          </p>
        </div>
      </footer>
    </div>
  );
}
