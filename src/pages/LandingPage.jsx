import React, { useState, useEffect, useRef } from 'react';
import {
  Leaf, Users, Building2, ShieldCheck, ChevronRight,
  TreePine, Gift, Camera, Award, ArrowRight,
  CheckCircle2, Shield, TrendingUp, Zap, MapPin, Globe,
  Activity, ArrowUpRight, Terminal, BarChart3, Database
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   MOCK DATA FOR BENTO WIDGETS
──────────────────────────────────────────────────────────────────*/
const RECENT_ACTIVITIES = [
  { citizen: 'Aarav S.', tree: 'Neem (Azadirachta indica)', loc: 'Mumbai East', time: 'Just now', points: 100 },
  { citizen: 'Priya K.', tree: 'Peepal (Ficus religiosa)', loc: 'Pune Central', time: '2 mins ago', points: 100 },
  { citizen: 'Rohan D.', tree: 'Banyan (Ficus benghalensis)', loc: 'Thane West', time: '12 mins ago', points: 100 },
  { citizen: 'Neha P.', tree: 'Mango (Mangifera indica)', loc: 'Navi Mumbai', time: '40 mins ago', points: 100 },
];

const STAKEHOLDER_CONSOLE = {
  citizen: {
    title: 'Citizen Protocol',
    subtitle: 'Plant & Claim Incentives',
    code: `// Initialization of plantation check
nursery.claimSapling("Ficus benghalensis")
  .then(sapling => sapling.plant())
  .then(photo => camera.capture(photo.gps))
  .then(verified => {
    profile.addPoints(100);
    rewards.generateVoucher();
  });`,
    logs: [
      'Sapling claimed at Andheri Govt Nursery',
      'EXIF headers matched: 18.9220 N, 72.8347 E',
      'Tamper-proof plantation photo uploaded',
      'Verification approved: +100 Points'
    ]
  },
  business: {
    title: 'Business Provider Registry',
    subtitle: 'Voucher Redemption Loop',
    code: `// Voucher redemption logic
business.scanQRCode(citizenVoucher)
  .verifySignature()
  .then(valid => {
    discount.apply(15); // 15% discount
    business.recordSale();
    marketing.boostFootfall();
  });`,
    logs: [
      'Cafe Mocha Mumbai joined partner network',
      'Voucher scan requested: HS-VOUCH-9821',
      'Cryptographic signature verified: Valid',
      '15% discount applied at billing terminal'
    ]
  },
  government: {
    title: 'Government Ledger',
    subtitle: 'Audit & Decentralized Ledger',
    code: `// Municipal dashboard audit
municipal.auditLedger()
  .fetchActiveNurseries()
  .then(nurseries => nurseries.syncInventory())
  .then(status => {
    ledger.publishAfforestationReport();
  });`,
    logs: [
      'Inventory synced: 4,500 saplings available',
      'Verification request queue polled: 12 pending',
      'Tamper-proof coordinates published to ledger',
      'Total city-wide active survival index: 98.4%'
    ]
  }
};

/* ─────────────────────────────────────────────────────────────────
   MARQUEE TICKER STRIP
──────────────────────────────────────────────────────────────────*/
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
    <div className="overflow-hidden border-y border-earth-150 bg-earth-50 py-3.5 select-none">
      <div className="animate-marquee flex gap-0 w-max">
        {doubled.map((item, i) => (
          <div key={i} className="inline-flex items-center gap-2.5 px-6 text-earth-450 shrink-0">
            <item.icon className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
            <span className="text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
              {item.text}
            </span>
            <span className="text-earth-200 pl-4">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATED STAT WIDGET
──────────────────────────────────────────────────────────────────*/
function AnimatedStat({ target, suffix = '', label, delay = 0 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const n = parseInt(target.replace(/\D/g, ''));
        let c = 0;
        const inc = n / 80;
        const timer = setInterval(() => {
          c += inc;
          if (c >= n) { setValue(n); clearInterval(timer); }
          else setValue(Math.floor(c));
        }, 20);
      }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="p-5 bg-white border border-earth-150 rounded-2xl flex flex-col justify-between" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-xs uppercase tracking-wider text-earth-400 font-bold mb-3">{label}</div>
      <div className="text-3xl sm:text-4xl font-extrabold text-forest-700 tracking-tight tabular-nums">
        {value.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN LANDING PAGE
──────────────────────────────────────────────────────────────────*/
export default function LandingPage({ setActiveTab, onGetStarted }) {
  const [activeTabConsole, setActiveTabConsole] = useState('citizen');
  const [logs, setLogs] = useState([]);

  // Slowly reveal logs in the terminal console mock
  useEffect(() => {
    setLogs([]);
    const selectedLogs = STAKEHOLDER_CONSOLE[activeTabConsole].logs;
    let i = 0;
    const interval = setInterval(() => {
      if (i < selectedLogs.length) {
        setLogs(prev => [...prev, selectedLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 450);
    return () => clearInterval(interval);
  }, [activeTabConsole]);

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">

      {/* ══════════════════════════════════════════════════
          HERO HEADER — Minimal & Authoritative
      ══════════════════════════════════════════════════ */}
      <header className="relative bg-white border-b border-earth-150 py-16 sm:py-24 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Top govt badge */}
          <div className="animate-hero-text flex items-center gap-2 mb-6">
            <span className="px-2.5 py-1 rounded bg-forest-50 border border-forest-150 text-[10px] font-bold text-forest-700 uppercase tracking-widest">
              Initiative of BMC & Ministry of Environment
            </span>
            <div className="h-px w-8 bg-earth-200" />
          </div>

          {/* Main title */}
          <h1 className="animate-hero-text-2 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-forest-900 leading-[1.08] mb-6 max-w-3xl">
            A decentralised ledger <br />
            for city-wide afforestation.
          </h1>

          {/* Subtitle */}
          <p className="animate-hero-text-3 text-base sm:text-lg text-earth-450 mb-8 max-w-xl font-light leading-relaxed">
            Harit Sankalp bridges the gap between citizens, local businesses, and government bodies. Claim free saplings, verify plantation via EXIF data, and earn redeemable QR vouchers.
          </p>

          {/* CTA actions */}
          <div className="animate-hero-text-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-forest-600 hover:bg-forest-650 transition-colors duration-250 cursor-pointer shadow-sm"
            >
              Get Started Protocol
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#console"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-earth-500 hover:text-earth-700 border border-earth-200 hover:border-earth-300 transition-colors duration-200"
            >
              Explore Bento Console
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          TICKER STRIP
      ══════════════════════════════════════════════════ */}
      <TickerStrip />

      {/* ══════════════════════════════════════════════════
          BENTO GRID SYSTEM
      ══════════════════════════════════════════════════ */}
      <main id="console" className="max-w-5xl mx-auto px-6 py-16 flex-grow w-full">
        
        <div className="mb-10">
          <span className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Bento Console</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-900 mt-1">Tamper-Proof Ledger Dashboard</h2>
          <p className="text-xs text-earth-450 mt-1.5 max-w-md">
            Click on the widgets to see active protocol audits, statistics, and system logs.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ─── WIDGET 1: Interactive Console tab switcher (2 cols wide) ─── */}
          <div className="md:col-span-2 bg-white border border-earth-150 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-earth-100 pb-5 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-forest-600" />
                  <h3 className="text-sm font-bold text-earth-900">Active Stakeholder Protocols</h3>
                </div>
                <p className="text-xs text-earth-400 mt-1">Verify logic and system events in real-time.</p>
              </div>

              {/* Tabs */}
              <div className="flex rounded-lg bg-earth-100 p-0.5 border border-earth-200">
                {Object.keys(STAKEHOLDER_CONSOLE).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabConsole(tab)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      activeTabConsole === tab
                        ? 'bg-white text-forest-700 shadow-sm border border-earth-200'
                        : 'text-earth-500 hover:text-earth-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle row: Code preview + log terminal side-by-side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
              
              {/* Code viewer */}
              <div className="rounded-xl bg-earth-950 p-4 border border-earth-850 font-mono text-[10px] text-earth-300 leading-relaxed overflow-x-auto min-h-[140px] flex flex-col justify-between">
                <div className="text-earth-500 text-[9px] border-b border-earth-850 pb-2 mb-2 flex items-center justify-between uppercase font-sans font-bold tracking-wider">
                  <span>Logic Script</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <pre className="flex-grow select-all cursor-pointer">{STAKEHOLDER_CONSOLE[activeTabConsole].code}</pre>
              </div>

              {/* Real-time system logs */}
              <div className="rounded-xl bg-earth-900 p-4 border border-earth-800 font-mono text-[10px] text-emerald-400 flex flex-col justify-between min-h-[140px]">
                <div>
                  <div className="text-earth-500 text-[9px] border-b border-earth-800 pb-2 mb-2 flex items-center justify-between uppercase font-sans font-bold tracking-wider">
                    <span>Active Audit Logs</span>
                    <span className="text-[8px] text-earth-500">LIVE</span>
                  </div>
                  <div className="space-y-1.5">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 shrink-0">&gt;</span>
                        <span className="leading-tight">{log}</span>
                      </div>
                    ))}
                    {logs.length < STAKEHOLDER_CONSOLE[activeTabConsole].logs.length && (
                      <div className="w-1 h-3.5 bg-emerald-500 animate-pulse inline-block" />
                    )}
                  </div>
                </div>
                <div className="text-[8px] text-earth-500 text-right mt-2 uppercase font-sans tracking-wide">
                  State: Operational
                </div>
              </div>

            </div>

            {/* Info details */}
            <div className="mt-5 pt-4 border-t border-earth-100 flex items-center justify-between text-xs text-earth-450">
              <span className="font-semibold text-earth-900">
                {STAKEHOLDER_CONSOLE[activeTabConsole].title}
              </span>
              <span className="font-medium text-earth-400">
                {STAKEHOLDER_CONSOLE[activeTabConsole].subtitle}
              </span>
            </div>
          </div>

          {/* ─── WIDGET 2: Recent plantation ledger ─── */}
          <div className="bg-white border border-earth-150 rounded-3xl p-6 flex flex-col justify-between shadow-sm overflow-hidden relative">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-forest-600" />
                <h3 className="text-sm font-bold text-earth-900">Afforestation Ledger</h3>
              </div>
              <p className="text-xs text-earth-400 mb-4 leading-relaxed">Recent ledger updates verified by local municipal bodies.</p>

              {/* Feed items */}
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((act, i) => (
                  <div key={i} className="text-[11px] p-2.5 rounded-xl border border-earth-100 bg-earth-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-earth-800">{act.citizen}</div>
                      <div className="text-[10px] text-earth-450 truncate max-w-[170px] mt-0.5">{act.tree}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-forest-600">+{act.points} pts</span>
                      <div className="text-[8px] text-earth-400 mt-0.5">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-5 pt-3 border-t border-earth-100 flex items-center justify-between text-[10px] text-earth-400">
              <span>Auto-refreshing</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-forest-600">SYNCED</span>
              </div>
            </div>
          </div>

          {/* ─── WIDGET 3, 4, 5: Quick Stats columns ─── */}
          <AnimatedStat target="1250" suffix="+" label="Verified Tree Saplings" delay={0} />
          <AnimatedStat target="45"   suffix="+" label="Establishments Registered" delay={100} />
          <AnimatedStat target="98"   suffix="%" label="Plantation Survival Rate" delay={200} />

          {/* ─── WIDGET 6: Verification Flow (Horizontal Slider / Steps) ─── */}
          <div className="md:col-span-3 bg-white border border-earth-150 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-earth-100 pb-5 mb-6">
              <div>
                <h3 className="text-sm font-bold text-earth-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-forest-600" />
                  The Verification Loop
                </h3>
                <p className="text-xs text-earth-400 mt-1">Four structured phases of transparent verification.</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-earth-400 font-bold border border-earth-200 px-2.5 py-1 rounded bg-earth-50">
                Tamper-Resistant
              </span>
            </div>

            {/* Horizontal timeline grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map(step => (
                <div key={step.num} className="relative p-4 rounded-xl border border-earth-100 bg-earth-50/50 hover:bg-white hover:border-earth-200 transition-colors duration-200 group">
                  {/* Phase number badge */}
                  <div className="w-6 h-6 rounded-md bg-forest-50 border border-forest-150 flex items-center justify-center text-[10px] font-bold text-forest-700 mb-4 group-hover:bg-forest-100 transition-colors">
                    0{step.num}
                  </div>
                  <h4 className="font-bold text-earth-900 mb-1 text-xs">{step.title}</h4>
                  <p className="text-[11px] text-earth-450 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* ══════════════════════════════════════════════════
          MUNICIPAL INTEGRITY PROTOCOL
      ══════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-earth-150 py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          
          <div className="flex-1">
            <span className="text-[10px] font-bold text-forest-600 uppercase tracking-widest">Security &amp; Integrity</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-900 mt-1 mb-4 leading-tight">
              Cryptographically secure <br />
              location hashing.
            </h2>
            <p className="text-sm text-earth-450 leading-relaxed font-light mb-6">
              To prevent fraudulent claims, Harit Sankalp checks each uploaded photograph against real-time camera metadata, matching exact GPS coordinates, date, and hardware signatures with state nursery ledger entries.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-650" />
                <span className="text-xs font-semibold text-earth-850">EXIF Coordinate Checker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-650" />
                <span className="text-xs font-semibold text-earth-850">Nursery ledger check</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 shrink-0 bg-earth-50 border border-earth-150 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-earth-400 font-bold mb-3">Ledger Security</div>
              <h4 className="font-bold text-earth-900 text-sm mb-2">Audit Compliance</h4>
              <p className="text-xs text-earth-450 leading-relaxed">
                Municipal inspectors can instantly audit the decentralized ledger to reconcile claimed saplings with active, coordinates-checked trees.
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="mt-6 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-forest-750 bg-forest-100 hover:bg-forest-150 transition-colors duration-200 cursor-pointer border border-forest-200/50"
            >
              Verify Ledger Entry
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="border-t border-earth-150 bg-white py-8 px-6 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-earth-450">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-forest-600" />
            <span className="font-bold text-earth-900">Harit Sankalp</span>
            <span className="text-earth-200">·</span>
            <span>Civic Afforestation Platform</span>
          </div>
          <p>© {new Date().getFullYear()} All Rights Reserved. Municipal Environmental Initiative.</p>
        </div>
      </footer>
    </div>
  );
}
