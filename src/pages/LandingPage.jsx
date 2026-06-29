import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Leaf, Users, Building2, ShieldCheck, ChevronRight,
  TreePine, Gift, Camera, Award, ArrowRight, MapPin, CheckCircle2
} from 'lucide-react';

/* ── Animated stat counter ────────────────────────────────────── */
function AnimatedStat({ target, suffix = '', label, delay = 0 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const numTarget = parseInt(target.replace(/\D/g, ''));
          const duration = 1600;
          const stepTime = 20;
          const steps = duration / stepTime;
          let current = 0;
          const increment = numTarget / steps;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numTarget) {
              setValue(numTarget);
              clearInterval(timer);
            } else {
              setValue(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );
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

/* ── Stakeholder Card ─────────────────────────────────────────── */
function StakeholderCard({ icon: Icon, iconBg, iconColor, title, description, borderColor, delay }) {
  return (
    <div
      className="animate-slide-up bg-white rounded-2xl p-8 border border-earth-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
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

/* ── Process Step ─────────────────────────────────────────────── */
const STEPS = [
  {
    num: 1,
    icon: TreePine,
    title: 'Claim Sapling',
    desc: 'Select an indigenous tree species and request it for pickup at your nearest government nursery.',
    delay: 0,
  },
  {
    num: 2,
    icon: Camera,
    title: 'Plant & Capture',
    desc: 'Plant the sapling and photograph it using our live camera. GPS coordinates are captured automatically.',
    delay: 100,
  },
  {
    num: 3,
    icon: Award,
    title: 'Earn Points',
    desc: 'Upon government verification, 100 green reward points are credited to your citizen profile.',
    delay: 200,
  },
  {
    num: 4,
    icon: Gift,
    title: 'Redeem Vouchers',
    desc: 'Exchange points for dynamic QR vouchers redeemable at registered partner establishments.',
    delay: 300,
  },
];

/* ── Main LandingPage ─────────────────────────────────────────── */
export default function LandingPage({ setActiveTab, onGetStarted }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ═══════════════ HERO ═══════════════ */}
      <header
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #022c22 0%, #033a2c 45%, #064e3b 100%)',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Subtle geometric background pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        {/* Soft radial accent — top right */}
        <div
          className="absolute top-0 right-0 w-[520px] h-[520px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.10) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        {/* Soft radial accent — bottom left */}
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(6,95,70,0.12) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-white">

          {/* Government badge */}
          <div className="animate-slide-up flex items-center gap-2.5 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-forest-700/60 bg-forest-900/50 text-xs font-semibold text-forest-200 tracking-wide">
              <Leaf className="w-3.5 h-3.5 text-forest-400" />
              Ministry of Environment Initiative
            </div>
            <div className="h-px flex-1 max-w-[60px] bg-forest-700/40" />
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up-delay-1 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 max-w-3xl">
            Harit Sankalp
            <span className="block text-2xl md:text-3xl font-light text-forest-300 mt-2 tracking-normal">
              A Citizens' Green Pledge Programme
            </span>
          </h1>

          {/* Divider */}
          <div className="animate-slide-up-delay-1 w-16 h-0.5 bg-forest-500 mb-6" />

          {/* Sub-headline */}
          <p className="animate-slide-up-delay-2 max-w-xl text-base md:text-lg text-forest-200 mb-10 leading-relaxed font-light">
            A structured initiative bridging citizens, local businesses, and government bodies to facilitate verifiable afforestation and incentivise community participation.
          </p>

          {/* Key points */}
          <ul className="animate-slide-up-delay-2 flex flex-col gap-2.5 mb-10">
            {[
              'Free saplings from government nurseries',
              'GPS-verified plantation with live photo proof',
              'Earn reward points redeemable at local businesses',
            ].map((pt) => (
              <li key={pt} className="flex items-start gap-2.5 text-sm text-forest-200">
                <CheckCircle2 className="w-4 h-4 text-forest-400 flex-shrink-0 mt-0.5" />
                {pt}
              </li>
            ))}
          </ul>

          {/* CTA row */}
          <div className="animate-slide-up-delay-3 flex flex-col sm:flex-row gap-4 items-start">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-forest-600 hover:bg-forest-500 border border-forest-500 transition-colors duration-200 cursor-pointer"
            >
              Register / Sign In
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-forest-300 hover:text-white border border-forest-700/60 hover:border-forest-500 transition-all duration-200"
            >
              How It Works
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-12 fill-white">
            <path d="M0,48 C480,0 960,0 1440,48 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </header>

      {/* ═══════════════ QUICK STATS STRIP ═══════════════ */}
      <section className="bg-white border-b border-earth-200">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-8 divide-x divide-earth-200">
          <AnimatedStat target="1250" suffix="+" label="Trees Planted" delay={0} />
          <AnimatedStat target="45"   suffix="+" label="Business Partners" delay={150} />
          <AnimatedStat target="98"   suffix="%" label="Plantation Survival Rate" delay={300} />
        </div>
      </section>

      {/* ═══════════════ WHO BENEFITS ═══════════════ */}
      <section className="bg-earth-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-600 mb-2">Stakeholders</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-earth-900">Who Does This Serve?</h2>
            <p className="text-sm text-earth-500 mt-2 max-w-lg">
              The programme is designed for three distinct groups, each with clearly defined roles and benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StakeholderCard
              icon={Users}
              iconBg="bg-forest-50"
              iconColor="text-forest-700"
              title="For Citizens"
              description="Claim free indigenous saplings, plant with GPS-verified photo evidence, and earn green reward points redeemable at partner establishments."
              borderColor="border-forest-200"
              delay={0}
            />
            <StakeholderCard
              icon={Building2}
              iconBg="bg-blue-50"
              iconColor="text-blue-700"
              title="For Local Businesses"
              description="Partner as a discount provider for verified planters. Attract eco-conscious footfall and strengthen your community standing at no cost."
              borderColor="border-blue-200"
              delay={80}
            />
            <StakeholderCard
              icon={ShieldCheck}
              iconBg="bg-amber-50"
              iconColor="text-amber-700"
              title="For Government Bodies"
              description="Manage nursery inventory, configure Pickup Points, and track plantation progress through a verified, tamper-resistant digital record."
              borderColor="border-amber-200"
              delay={160}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
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
            {/* Connector line (desktop) */}
            <div
              className="hidden md:block absolute top-6 left-[12%] right-[12%] h-px bg-earth-200"
              aria-hidden="true"
            />

            {STEPS.map((step) => (
              <div
                key={step.num}
                className="animate-slide-up text-center relative group"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                {/* Step circle */}
                <div className="relative mx-auto mb-5 w-12 h-12">
                  <div className="w-12 h-12 rounded-full bg-forest-50 border-2 border-forest-200 group-hover:border-forest-500 group-hover:bg-forest-100 flex items-center justify-center transition-all duration-200">
                    <step.icon className="w-5 h-5 text-forest-700" />
                  </div>
                  {/* Number */}
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

      {/* ═══════════════ IMPACT BANNER ═══════════════ */}
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
            Harit Sankalp creates a transparent, community-driven afforestation ecosystem — where every tree planted is cryptographically timestamped, GPS-pinned, and linked to a verified citizen identity.
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

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-earth-200 bg-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-earth-450">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-forest-500" />
            <span className="font-medium text-earth-700">Harit Sankalp</span>
            <span>— Environmental Initiative</span>
          </div>
          <p>© {new Date().getFullYear()} All Rights Reserved. Developed for grassroots afforestation &amp; civic partnership.</p>
        </div>
      </footer>
    </div>
  );
}
