import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Leaf, Users, Building2, ShieldCheck, ChevronRight, TreePine, Gift, QrCode, Camera, Award, ArrowRight, Sparkles } from 'lucide-react';

/* ── Floating leaf particles ──────────────────────────────────── */
const LEAF_CONFIGS = [
  { left: '8%',  delay: '0s',    duration: '9s',  size: 18, opacity: 0.18 },
  { left: '18%', delay: '2.5s',  duration: '13s', size: 12, opacity: 0.12 },
  { left: '32%', delay: '1s',    duration: '11s', size: 22, opacity: 0.15 },
  { left: '48%', delay: '4s',    duration: '8s',  size: 10, opacity: 0.10 },
  { left: '60%', delay: '0.5s',  duration: '14s', size: 16, opacity: 0.14 },
  { left: '74%', delay: '3s',    duration: '10s', size: 20, opacity: 0.16 },
  { left: '88%', delay: '1.8s',  duration: '12s', size: 14, opacity: 0.13 },
  { left: '95%', delay: '5s',    duration: '9s',  size: 8,  opacity: 0.09 },
];

function LeafParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {LEAF_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          className="animate-leaf-fall absolute top-0"
          style={{
            left: cfg.left,
            animationDelay: cfg.delay,
            animationDuration: cfg.duration,
            opacity: cfg.opacity,
          }}
        >
          <Leaf
            style={{ width: cfg.size, height: cfg.size }}
            className="text-emerald-300"
          />
        </div>
      ))}
    </div>
  );
}

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
          const duration = 1800;
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
    <div
      ref={ref}
      className="text-center animate-count-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-5xl md:text-6xl font-extrabold text-emerald-400 tracking-tight mb-2 tabular-nums">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-xs uppercase tracking-widest text-forest-300 font-bold">{label}</div>
    </div>
  );
}

/* ── 3D Stakeholder Card ──────────────────────────────────────── */
function StakeholderCard({ icon: Icon, iconBg, iconColor, title, description, accentColor, delay }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) scale(1.03)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="animate-slide-up glass-panel p-8 rounded-3xl shadow-lg border border-white/60 cursor-default"
      style={{
        transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Icon with glow ring */}
      <div className="relative w-14 h-14 mb-6">
        <div
          className="absolute inset-0 rounded-2xl opacity-40 blur-sm"
          style={{ background: accentColor }}
        />
        <div
          className={`relative w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center border border-white/20`}
        >
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-earth-900 mb-3">{title}</h3>
      <p className="text-sm text-earth-500 leading-relaxed">{description}</p>

      {/* Decorative bottom accent line */}
      <div
        className="mt-6 h-0.5 w-12 rounded-full opacity-50"
        style={{ background: accentColor }}
      />
    </div>
  );
}

/* ── How it Works step ────────────────────────────────────────── */
const STEPS = [
  {
    num: 1,
    icon: TreePine,
    title: 'Claim Sapling',
    desc: 'Select an indigenous tree and request it for pickup at your nearest government nursery.',
    color: 'from-emerald-500 to-forest-600',
    glow: 'rgba(16,185,129,0.4)',
    delay: 0,
  },
  {
    num: 2,
    icon: Camera,
    title: 'Plant & Capture',
    desc: 'Plant the tree and take a live photo using our web camera. EXIF coordinates are validated.',
    color: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.4)',
    delay: 150,
  },
  {
    num: 3,
    icon: Award,
    title: 'Earn Points',
    desc: 'Once verified, earn 100 green reward points instantly credited to your profile.',
    color: 'from-amber-400 to-orange-500',
    glow: 'rgba(245,158,11,0.4)',
    delay: 300,
  },
  {
    num: 4,
    icon: Gift,
    title: 'Redeem Vouchers',
    desc: 'Spend points to generate dynamic QR codes. Show them at partner restaurants for discounts.',
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(168,85,247,0.4)',
    delay: 450,
  },
];

/* ── Main LandingPage component ───────────────────────────────── */
export default function LandingPage({ setActiveTab, onGetStarted }) {
  const heroRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse-tracking parallax / tilt on hero section
  const handleHeroMouseMove = useCallback((e) => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * 5, y: dx * -5 });
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  }, []);

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <header
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden rounded-b-[3rem] shadow-2xl"
        style={{ minHeight: '92vh', display: 'flex', alignItems: 'center' }}
      >
        {/* Aurora animated background */}
        <div
          className="absolute inset-0 animate-aurora"
          style={{
            background: 'linear-gradient(135deg, #011a10, #022c1a, #033a22, #041f14, #012010, #053020, #022c1a)',
          }}
          aria-hidden="true"
        />

        {/* Dynamic radial spotlight that follows mouse */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(ellipse 60% 50% at ${mousePos.x}% ${mousePos.y}%, rgba(16,185,129,0.18) 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* 3D Orbit rings */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)', width: 560, height: 560 }}
          aria-hidden="true"
        >
          <div
            className="animate-orbit absolute inset-0 rounded-full border border-emerald-500/10"
            style={{ boxShadow: 'inset 0 0 40px rgba(16,185,129,0.05)' }}
          />
          <div
            className="animate-orbit-reverse absolute rounded-full border border-forest-400/10"
            style={{ inset: 50, boxShadow: 'inset 0 0 30px rgba(16,185,129,0.04)' }}
          />
        </div>

        {/* Floating orbs / glows */}
        <div className="absolute top-16 right-24 w-72 h-72 rounded-full pointer-events-none animate-orb"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)' }}
          aria-hidden="true" />
        <div className="absolute -bottom-10 left-10 w-96 h-96 rounded-full pointer-events-none animate-orb2"
          style={{ background: 'radial-gradient(circle, rgba(6,95,70,0.18) 0%, transparent 70%)' }}
          aria-hidden="true" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full pointer-events-none animate-orb3"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)' }}
          aria-hidden="true" />

        {/* Falling leaf particles */}
        <LeafParticles />

        {/* Hero content with 3D tilt */}
        <div
          className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 text-white"
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.2s ease-out',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge with shimmer overlay */}
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-forest-600/60 mb-8 overflow-hidden animate-slide-up animate-glow-pulse"
              style={{ background: 'rgba(6,95,70,0.55)', backdropFilter: 'blur(10px)' }}
            >
              <Sparkles className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span className="text-sm font-semibold text-forest-100 tracking-wide">Empowering Green Initiatives</span>
              <Leaf className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {/* Shimmer sweep */}
              <span className="animate-badge-shimmer absolute inset-0" aria-hidden="true" />
            </div>

            {/* Headline */}
            <h1 className="animate-slide-up-delay-1 text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6"
              style={{ textShadow: '0 4px 40px rgba(16,185,129,0.2)' }}
            >
              Make a Pledge,
              <br />
              <span
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #6ee7b7, #34d399, #10b981, #6ee7b7)',
                  backgroundSize: '200% auto',
                  animation: 'aurora 6s ease infinite',
                }}
              >
                Plant &amp; Get Rewarded
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="animate-slide-up-delay-2 max-w-2xl mx-auto text-base md:text-xl text-forest-200 mb-10 leading-relaxed font-light">
              We bridge citizens, local businesses, and government. Plant a tree, verify with live photo + GPS, and earn exclusive discount vouchers for cafes and hotels.
            </p>

            {/* CTA row */}
            <div className="animate-slide-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-2xl text-forest-950 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #6ee7b7, #34d399)',
                  boxShadow: '0 8px 32px rgba(52,211,153,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {/* Hover shimmer on button */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)' }}
                  aria-hidden="true"
                />
                <span className="relative flex items-center gap-2">
                  Get Started Today
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest-200 hover:text-white transition-all duration-200 py-2 px-4 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
              >
                Learn How It Works
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust indicators */}
            <div className="animate-slide-up-delay-4 mt-14 flex flex-wrap items-center justify-center gap-6">
              {[
                { value: '1,250+', label: 'Trees Planted' },
                { value: '45+',    label: 'Partners' },
                { value: '98%',    label: 'Survival Rate' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
                >
                  <span className="text-lg font-extrabold text-emerald-300">{item.value}</span>
                  <span className="text-xs text-forest-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Floating feature pills — positioned around hero */}
          <div className="hidden lg:block pointer-events-none" aria-hidden="true">
            {/* Left floating card */}
            <div
              className="animate-float absolute left-4 top-1/3 px-4 py-3 rounded-2xl border border-forest-600/40 text-xs font-semibold text-emerald-200"
              style={{ background: 'rgba(6,95,70,0.5)', backdropFilter: 'blur(12px)', transform: 'translateZ(40px)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live GPS Verification
              </div>
            </div>

            {/* Right floating card */}
            <div
              className="animate-float2 absolute right-4 top-1/3 px-4 py-3 rounded-2xl border border-forest-600/40 text-xs font-semibold text-emerald-200"
              style={{ background: 'rgba(6,95,70,0.5)', backdropFilter: 'blur(12px)', transform: 'translateZ(40px)' }}
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-3.5 h-3.5 text-emerald-300" />
                Instant QR Vouchers
              </div>
            </div>

            {/* Bottom floating card */}
            <div
              className="animate-float3 absolute left-1/2 -translate-x-1/2 bottom-8 px-4 py-3 rounded-2xl border border-forest-600/40 text-xs font-semibold text-emerald-200"
              style={{ background: 'rgba(6,95,70,0.5)', backdropFilter: 'blur(12px)', transform: 'translateZ(40px)' }}
            >
              <div className="flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                100 pts per verified tree
              </div>
            </div>
          </div>
        </div>

        {/* Bottom curved divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-16 fill-earth-50">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </header>

      {/* ═══════════════ STAKEHOLDER CARDS ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 relative z-20">
        {/* Section heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 border border-forest-200 text-xs font-bold text-forest-700 mb-4">
            <Users className="w-3.5 h-3.5" />
            Three Pillars of Impact
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-earth-900">Who Benefits?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StakeholderCard
            icon={Users}
            iconBg="bg-forest-100"
            iconColor="text-forest-600"
            title="For Citizens"
            description="Claim free tree saplings from government nurseries. Plant them, snap a live photo, and unlock discount QR codes at your favourite local spots."
            accentColor="linear-gradient(135deg, #10b981, #059669)"
            delay={0}
          />
          <StakeholderCard
            icon={Building2}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            title="For Businesses"
            description="Attract eco-conscious customers by joining as a discount provider. Gain free local marketing, boost footfall, and show your green commitment."
            accentColor="linear-gradient(135deg, #3b82f6, #0284c7)"
            delay={100}
          />
          <StakeholderCard
            icon={ShieldCheck}
            iconBg="bg-amber-50"
            iconColor="text-accent-amber"
            title="For Government"
            description="Manage nurseries and distribute saplings through structured Pickup Points. Track plantings with automated coordinates and live photo verification."
            accentColor="linear-gradient(135deg, #f59e0b, #d97706)"
            delay={200}
          />
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 border border-forest-200 text-xs font-bold text-forest-700 mb-4">
            <TreePine className="w-3.5 h-3.5" />
            The Process
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-earth-900">
            The Plantation Verification Loop
          </h2>
          <p className="text-sm text-earth-500 mt-3 max-w-lg mx-auto">
            From claim to reward — a seamless, verified green journey in four steps.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Animated connector lines between steps (desktop only) */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="hidden md:block absolute top-7 animate-connector"
              style={{
                left: `${(i + 1) * 25 - 6}%`,
                width: '13%',
                height: '2px',
                background: 'linear-gradient(90deg, rgba(16,185,129,0.5), rgba(16,185,129,0.2))',
                borderRadius: 2,
                animationDelay: `${i * 0.4}s`,
              }}
              aria-hidden="true"
            />
          ))}

          {STEPS.map((step) => (
            <div
              key={step.num}
              className="animate-slide-up text-center relative group"
              style={{ animationDelay: `${step.delay}ms` }}
            >
              {/* Step icon button */}
              <div className="relative mx-auto mb-5 w-16 h-16">
                {/* Outer glow ring on hover */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                  style={{ background: step.glow }}
                  aria-hidden="true"
                />
                <div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg border border-white/30 bg-gradient-to-br ${step.color}`}
                >
                  <step.icon className="w-7 h-7 text-white drop-shadow" />
                </div>
                {/* Step number badge */}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-earth-200 flex items-center justify-center text-[9px] font-extrabold text-earth-700 shadow-sm">
                  {step.num}
                </div>
              </div>

              <h4 className="font-bold text-earth-950 mb-2 text-base">{step.title}</h4>
              <p className="text-xs text-earth-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ STATS BANNER ═══════════════ */}
      <section className="max-w-6xl mx-auto w-full px-4 my-12">
        <div
          className="relative overflow-hidden rounded-[2.5rem] px-8 py-14 text-white shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #022c22, #033a2c, #041a10, #022c1a)' }}
        >
          {/* Animated background sheen */}
          <div
            className="absolute inset-0 animate-aurora opacity-60"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), transparent, rgba(6,95,70,0.12), transparent)' }}
            aria-hidden="true"
          />
          {/* Floating blob decorations */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full animate-orb opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)' }}
            aria-hidden="true"
          />
          <div className="absolute -bottom-10 left-0 w-56 h-56 rounded-full animate-orb2 opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white">Impact in Numbers</h2>
            <p className="text-forest-300 text-sm mt-2">Our community is making a difference</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <AnimatedStat target="1250" suffix="+" label="Trees Planted" delay={0} />
            <AnimatedStat target="45"   suffix="+" label="Business Partners" delay={200} />
            <AnimatedStat target="98"   suffix="%" label="Plantation Survival Rate" delay={400} />
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div
          className="relative overflow-hidden rounded-3xl p-12"
          style={{
            background: 'linear-gradient(135deg, #f0fdf6, #ecfdf5)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)' }}
            aria-hidden="true" />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-forest-100 border border-forest-200 flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-forest-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-earth-900 mb-4">
              Ready to Make Your<br />
              <span className="bg-gradient-to-r from-forest-600 to-emerald-500 bg-clip-text text-transparent">
                Green Pledge?
              </span>
            </h2>
            <p className="text-earth-500 text-sm mb-8 max-w-md mx-auto">
              Join hundreds of citizens who are actively planting trees, earning rewards, and building a greener India.
            </p>
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-2xl text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: '0 8px 32px rgba(5,150,105,0.35)',
              }}
            >
              Start Planting Today
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-earth-200 bg-white mt-auto py-8 text-center text-xs text-earth-450">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="w-3.5 h-3.5 text-forest-500" />
          <p>© {new Date().getFullYear()} Harit Sankalp Environmental Initiative. All Rights Reserved.</p>
        </div>
        <p className="font-light">Developed to encourage grassroots afforestation, local commerce, and civic partnerships.</p>
      </footer>
    </div>
  );
}
