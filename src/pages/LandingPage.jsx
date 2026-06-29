import React, { useState, useRef, useCallback } from 'react';
import {
  Leaf, Users, Building2, ShieldCheck, ChevronRight,
  TreePine, Gift, Camera, Award, ArrowRight,
  MapPin, CheckCircle2, Clock, Sparkles, QrCode, Star
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   3D HERO CARD STACK  (right-side visual)
   Three perspective-layered mini UI cards from the app.
   Mouse parallax adds ±4° tilt on top of the base pose.
──────────────────────────────────────────────────────────────────*/
function HeroCardStack({ tilt }) {
  const baseX = 10;
  const baseY = -18;
  const stackTransform = `perspective(1000px) rotateX(${baseX + tilt.x}deg) rotateY(${baseY + tilt.y}deg)`;

  return (
    <div className="animate-card-entrance w-full max-w-[400px] mx-auto lg:mx-0">
      <div
        className="card-stack-3d relative"
        style={{ height: 380, transform: stackTransform }}
      >

        {/* ── Card 3 — Back: Nursery Pickup ── */}
        <div
          className="animate-gentle-float-3 absolute w-full rounded-2xl px-5 py-4 border border-forest-700/50"
          style={{
            top: 40, right: -20,
            transform: 'translateZ(-60px)',
            background: 'rgba(6,50,36,0.75)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-lg bg-forest-800 border border-forest-600 flex items-center justify-center">
              <TreePine className="w-3.5 h-3.5 text-forest-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-forest-200">Sapling Pickup Ready</p>
              <p className="text-[10px] text-forest-500">Govt. Nursery · Andheri</p>
            </div>
            <div className="ml-auto px-2 py-0.5 rounded-full bg-forest-700/60 text-[9px] font-bold text-forest-300 border border-forest-600/40">
              PENDING
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-forest-400">Pickup Code:</span>
            <span className="text-[11px] font-bold text-forest-200 tracking-widest font-mono">HS-4827</span>
          </div>
        </div>

        {/* ── Card 2 — Middle: GPS Capture ── */}
        <div
          className="animate-gentle-float-2 absolute w-full rounded-2xl px-5 py-4 border border-forest-600/40"
          style={{
            top: 20, right: -10,
            transform: 'translateZ(-28px)',
            background: 'rgba(3,40,28,0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-900/60 border border-blue-700/50 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">Live Photo Captured</p>
              <p className="text-[10px] text-forest-400">EXIF verification complete</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8">
              <p className="text-[9px] text-forest-500 mb-0.5 uppercase tracking-wider">Latitude</p>
              <p className="text-[10px] font-semibold text-forest-200 font-mono">18.9220° N</p>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8">
              <p className="text-[9px] text-forest-500 mb-0.5 uppercase tracking-wider">Longitude</p>
              <p className="text-[10px] font-semibold text-forest-200 font-mono">72.8347° E</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Clock className="w-3 h-3 text-forest-500" />
            <span className="text-[10px] text-forest-400">29 Jun 2025 · 10:42 AM</span>
          </div>
        </div>

        {/* ── Card 1 — Front: Verification Badge ── */}
        <div
          className="animate-gentle-float absolute w-full rounded-2xl overflow-hidden border border-forest-500/30"
          style={{
            top: 0, right: 0,
            transform: 'translateZ(0px)',
            background: 'rgba(2,30,20,0.95)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(16,185,129,0.1)',
          }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #059669, #10b981, #34d399)' }} />
          <div className="px-5 py-4">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest-800 border border-forest-600/60 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white">Plantation Verified</p>
                  <p className="text-[10px] text-forest-400">by Ward Officer, BMC</p>
                </div>
              </div>
              <div className="px-2 py-1 rounded-full border border-emerald-700/60 bg-emerald-900/40 text-[9px] font-bold text-emerald-400 tracking-wider">
                APPROVED
              </div>
            </div>

            {/* Tree detail */}
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-lg bg-forest-700/50 flex items-center justify-center flex-shrink-0">
                <TreePine className="w-4 h-4 text-forest-300" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-forest-100">Ficus benghalensis</p>
                <p className="text-[9px] text-forest-500">Indigenous · National Tree of India</p>
              </div>
            </div>

            {/* Points earned */}
            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.2), rgba(16,185,129,0.1))', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div>
                <p className="text-[9px] text-forest-400 uppercase tracking-wider mb-0.5">Reward Points Credited</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-emerald-400">+100</span>
                  <span className="text-[10px] text-forest-400 font-medium">pts</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[9px] text-forest-500">Total: 450 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle drop shadow below stack */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl opacity-40 pointer-events-none"
          style={{ background: 'rgba(16,185,129,0.3)', bottom: -16 }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATED STAT COUNTER
──────────────────────────────────────────────────────────────────*/
import { useEffect } from 'react';
function AnimatedStat({ target, suffix = '', label, delay = 0 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const n = parseInt(target.replace(/\D/g, ''));
        const stepTime = 20;
        const steps = 1600 / stepTime;
        let cur = 0;
        const inc = n / steps;
        const timer = setInterval(() => {
          cur += inc;
          if (cur >= n) { setValue(n); clearInterval(timer); }
          else setValue(Math.floor(cur));
        }, stepTime);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="text-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-4xl md:text-5xl font-extrabold text-forest-700 tracking-tight mb-1 tabular-nums">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-xs uppercase tracking-widest text-earth-500 font-semibold mt-1">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STAKEHOLDER CARD
──────────────────────────────────────────────────────────────────*/
function StakeholderCard({ icon: Icon, iconBg, iconColor, title, description, borderColor, delay }) {
  return (
    <div
      className="animate-slide-up bg-white rounded-2xl p-8 border border-earth-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5 border ${borderColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-earth-900 mb-3">{title}</h3>
      <p className="text-sm text-earth-500 leading-relaxed">{description}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PROCESS STEPS
──────────────────────────────────────────────────────────────────*/
const STEPS = [
  { num: 1, icon: TreePine, title: 'Claim Sapling',   desc: 'Select an indigenous species and request pickup at your nearest government nursery.', delay: 0 },
  { num: 2, icon: Camera,   title: 'Plant & Capture', desc: 'Plant the sapling and photograph it via live camera. GPS coordinates are captured automatically.', delay: 100 },
  { num: 3, icon: Award,    title: 'Earn Points',     desc: 'Upon government verification, 100 green reward points are credited to your citizen profile.', delay: 200 },
  { num: 4, icon: Gift,     title: 'Redeem Vouchers', desc: 'Exchange points for dynamic QR vouchers redeemable at registered partner establishments.', delay: 300 },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN LANDING PAGE
──────────────────────────────────────────────────────────────────*/
export default function LandingPage({ setActiveTab, onGetStarted }) {
  const heroRef = useRef(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  /* Gentle mouse parallax — affects only the card stack tilt */
  const handleMouseMove = useCallback((e) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setCardTilt({
      x: (py - 0.5) * -8,   // ±4 deg vertical
      y: (px - 0.5) *  8,   // ±4 deg horizontal
    });
  }, []);
  const handleMouseLeave = useCallback(() => setCardTilt({ x: 0, y: 0 }), []);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ══════════════════════════════════════════════════════════
          HERO — split layout, 3D card stack right
      ══════════════════════════════════════════════════════════ */}
      <header
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(150deg, #011810 0%, #022c22 35%, #033a2c 65%, #053020 100%)',
          minHeight: '92vh',
        }}
      >
        {/* ── Background Elements ── */}

        {/* Fine dot matrix overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />

        {/* Perspective grid floor */}
        <div className="perspective-grid pointer-events-none" aria-hidden="true" />

        {/* Ambient top-right glow */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.09) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        {/* Thin diagonal accent line (decorative) */}
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            top: '8%', right: '48%',
            width: '1px', height: '80%',
            background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.15) 30%, rgba(16,185,129,0.15) 70%, transparent)',
          }}
          aria-hidden="true"
        />

        {/* ── Two-column hero content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-[92vh]">

          {/* ── LEFT — Text Content ── */}
          <div className="flex-1 text-white lg:max-w-[52%]">

            {/* Ministry badge */}
            <div className="animate-hero-text flex items-center gap-3 mb-7">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-forest-700/70 bg-forest-900/60 text-xs font-semibold text-forest-200 tracking-wide">
                <Leaf className="w-3 h-3 text-forest-400" />
                Ministry of Environment · Civic Initiative
              </div>
            </div>

            {/* Headline */}
            <h1 className="animate-hero-text-2 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-4">
              Harit Sankalp
            </h1>
            <p className="animate-hero-text-2 text-xl md:text-2xl font-light text-forest-300 mb-5 tracking-wide">
              A Citizens' Green Pledge Programme
            </p>

            {/* Divider */}
            <div className="animate-hero-text-2 flex items-center gap-3 mb-7">
              <div className="w-10 h-0.5 bg-forest-500" />
              <span className="text-xs text-forest-500 uppercase tracking-widest font-semibold">Verified Afforestation Platform</span>
            </div>

            {/* Description */}
            <p className="animate-hero-text-3 text-sm md:text-base text-forest-300 leading-relaxed mb-8 max-w-lg font-light">
              A structured initiative connecting citizens, local businesses, and government bodies to facilitate GPS-verified afforestation and incentivise community participation through a transparent reward system.
            </p>

            {/* Key points */}
            <ul className="animate-hero-text-3 flex flex-col gap-3 mb-10">
              {[
                'Free indigenous saplings from government nurseries',
                'GPS-verified plantation with live camera proof',
                'Earn reward points redeemable at partner businesses',
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-forest-200">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-forest-800 border border-forest-600 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  {pt}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="animate-hero-text-4 flex flex-col sm:flex-row gap-3 items-start">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white border border-forest-500 transition-all duration-200 cursor-pointer hover:bg-forest-500/20"
                style={{ background: 'rgba(5,150,105,0.25)', backdropFilter: 'blur(8px)' }}
              >
                Register / Sign In
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-forest-400 hover:text-forest-200 border border-forest-800 hover:border-forest-600 transition-all duration-200"
              >
                How It Works
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Inline trust stats */}
            <div className="animate-hero-text-4 mt-10 pt-8 border-t border-forest-800/60 grid grid-cols-3 gap-4">
              {[
                { val: '1,250+', lbl: 'Trees Planted' },
                { val: '45+',   lbl: 'Partners' },
                { val: '98%',   lbl: 'Survival Rate' },
              ].map((s) => (
                <div key={s.lbl}>
                  <div className="text-xl font-extrabold text-emerald-400 tabular-nums">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-forest-500 font-semibold mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — 3D Card Stack ── */}
          <div className="flex-1 flex items-center justify-center lg:justify-end w-full lg:max-w-[48%]">
            <HeroCardStack tilt={cardTilt} />
          </div>

        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-14 fill-white">
            <path d="M0,56 C480,0 960,0 1440,56 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          QUICK STATS STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-earth-200">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-8 divide-x divide-earth-200">
          <AnimatedStat target="1250" suffix="+" label="Trees Planted"          delay={0}   />
          <AnimatedStat target="45"   suffix="+" label="Business Partners"      delay={150} />
          <AnimatedStat target="98"   suffix="%" label="Plantation Survival Rate" delay={300} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHO BENEFITS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-earth-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-2">Stakeholders</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-earth-900">Who Does This Serve?</h2>
            <p className="text-sm text-earth-500 mt-2 max-w-lg">
              Three distinct groups, each with clearly defined roles and benefits.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StakeholderCard
              icon={Users}    iconBg="bg-forest-50"  iconColor="text-forest-700" borderColor="border-forest-200"
              title="For Citizens"
              description="Claim free indigenous saplings, plant with GPS-verified photo evidence, and earn reward points redeemable at partner establishments."
              delay={0}
            />
            <StakeholderCard
              icon={Building2} iconBg="bg-blue-50"   iconColor="text-blue-700"   borderColor="border-blue-200"
              title="For Local Businesses"
              description="Partner as a discount provider for verified planters. Attract eco-conscious footfall and strengthen your community standing at no cost."
              delay={80}
            />
            <StakeholderCard
              icon={ShieldCheck} iconBg="bg-amber-50" iconColor="text-amber-700" borderColor="border-amber-200"
              title="For Government Bodies"
              description="Manage nursery inventory, configure Pickup Points, and track plantation progress through a verified, tamper-resistant digital record."
              delay={160}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-white py-20 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-2">Process</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-earth-900">The Verification Cycle</h2>
            <p className="text-sm text-earth-500 mt-2 max-w-lg">
              A transparent, four-stage workflow ensuring every planted tree is accountably recorded.
            </p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-px bg-earth-200" aria-hidden="true" />
            {STEPS.map((step) => (
              <div key={step.num} className="animate-slide-up text-center relative group" style={{ animationDelay: `${step.delay}ms` }}>
                <div className="relative mx-auto mb-5 w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-forest-50 border-2 border-forest-200 group-hover:border-forest-500 group-hover:bg-forest-100 flex items-center justify-center transition-all duration-200">
                    <step.icon className="w-5 h-5 text-forest-700" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-forest-700 flex items-center justify-center text-[9px] font-bold text-white">
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

      {/* ══════════════════════════════════════════════════════════
          IMPACT BANNER
      ══════════════════════════════════════════════════════════ */}
      <section
        className="py-16 px-6"
        style={{ background: 'linear-gradient(160deg, #022c22 0%, #033a2c 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-forest-400 mb-3">Programme Mission</p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            Building a Verifiable Green Record for India
          </h2>
          <p className="text-sm text-forest-300 max-w-2xl mx-auto leading-relaxed">
            Every tree planted is GPS-pinned, timestamped, and linked to a verified citizen identity — creating a transparent, community-driven afforestation record.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-forest-950 bg-emerald-400 hover:bg-emerald-300 transition-colors duration-200 cursor-pointer"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-forest-300 hover:text-white border border-forest-700 hover:border-forest-500 transition-all duration-200"
            >
              View Process
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-earth-200 bg-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-earth-450">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-forest-500" />
            <span className="font-semibold text-earth-700">Harit Sankalp</span>
            <span className="text-earth-300">·</span>
            <span>Environmental Initiative</span>
          </div>
          <p>© {new Date().getFullYear()} All Rights Reserved. Developed for grassroots afforestation &amp; civic partnership.</p>
        </div>
      </footer>
    </div>
  );
}
