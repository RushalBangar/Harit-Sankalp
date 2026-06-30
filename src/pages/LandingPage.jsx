import React, { useState, useRef, useEffect } from 'react';
import {
  Leaf, TreePine, Gift, Camera, Award,
  ChevronRight, ArrowRight, CheckCircle,
  Users, Building2, ShieldCheck, Star, Sprout
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────────────────*/
const STEPS = [
  {
    num: '01',
    icon: TreePine,
    title: 'Claim a Free Sapling',
    desc: 'Pick any tree species and collect your free sapling from a nearby government nursery.',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    num: '02',
    icon: Camera,
    title: 'Plant & Take a Photo',
    desc: 'Plant the sapling at home, on your terrace, or in your neighbourhood and click a photo.',
    color: '#0891b2',
    bg: '#ecfeff',
  },
  {
    num: '03',
    icon: Award,
    title: 'Get 100 Green Points',
    desc: 'A government officer reviews your photo and rewards you with 100 green points instantly.',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    num: '04',
    icon: Gift,
    title: 'Redeem at Local Shops',
    desc: 'Use your points to get discounts and vouchers at restaurants, cafes, and stores near you.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
];

const STATS = [
  { value: '1,250+', label: 'Trees Planted', icon: Sprout, color: '#16a34a' },
  { value: '45+',    label: 'Partner Shops', icon: Building2, color: '#0891b2' },
  { value: '98%',    label: 'Trees Survived', icon: Star, color: '#d97706' },
  { value: '3,200+', label: 'Happy Citizens', icon: Users, color: '#7c3aed' },
];

const RECENT = [
  { name: 'Aarav S.', tree: 'Neem tree', city: 'Mumbai', pts: 100 },
  { name: 'Priya K.', tree: 'Peepal tree', city: 'Pune', pts: 100 },
  { name: 'Rohan D.', tree: 'Banyan tree', city: 'Thane', pts: 100 },
  { name: 'Neha P.', tree: 'Mango tree', city: 'Navi Mumbai', pts: 100 },
];

const ROLES = [
  {
    icon: Users,
    title: 'For Citizens',
    desc: 'Claim free saplings, plant them, earn reward points and redeem them at local shops.',
    cta: 'Join as Citizen',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    icon: Building2,
    title: 'For Businesses',
    desc: 'Join our partner network and attract eco-conscious customers to your shop.',
    cta: 'Register Business',
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
  },
  {
    icon: ShieldCheck,
    title: 'For Government',
    desc: 'Track city-wide plantation, verify reports, and manage nursery inventory.',
    cta: 'Government Login',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
];

/* ─────────────────────────────────────────────────────────────────
   ANIMATED COUNTER
──────────────────────────────────────────────────────────────────*/
function Counter({ value }) {
  const num = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[\d,]/g, '');
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let c = 0;
        const inc = num / 60;
        const t = setInterval(() => {
          c += inc;
          if (c >= num) { setCount(num); clearInterval(t); }
          else setCount(Math.floor(c));
        }, 20);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [num]);
  return (
    <span ref={ref}>
      {count >= 1000 ? count.toLocaleString() : count}{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
──────────────────────────────────────────────────────────────────*/
export default function LandingPage({ onGetStarted }) {
  return (
    <div className="lp-root">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="lp-hero">
        {/* Leaf decorations */}
        <div className="lp-leaf lp-leaf-1" aria-hidden>🌿</div>
        <div className="lp-leaf lp-leaf-2" aria-hidden>🍃</div>
        <div className="lp-leaf lp-leaf-3" aria-hidden>🌱</div>

        <div className="lp-hero-inner">
          {/* Badge */}
          <div className="lp-badge animate-hero-text">
            🏛️ Initiative by BMC &amp; Ministry of Environment
          </div>

          {/* Title */}
          <h1 className="lp-hero-title animate-hero-text-2">
            Plant a Tree.<br />
            <span className="lp-green-text">Earn Rewards.</span><br />
            Help Your City Breathe.
          </h1>

          {/* Subtitle */}
          <p className="lp-hero-sub animate-hero-text-3">
            Get a <strong>free sapling</strong> from your local government nursery, plant it at home,
            and earn <strong>green reward points</strong> redeemable at shops near you.
            Simple. Free. For everyone.
          </p>

          {/* CTA */}
          <div className="lp-hero-cta animate-hero-text-4">
            <button id="hero-get-started-btn" onClick={onGetStarted} className="lp-btn-primary">
              🌱 Get Started — It's Free
            </button>
            <a href="#how" className="lp-btn-ghost">
              How it works <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick trust line */}
          <div className="lp-trust-row animate-hero-text-4">
            <span className="lp-trust-item"><CheckCircle className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="lp-trust-item"><CheckCircle className="w-3.5 h-3.5" /> Government Backed</span>
            <span className="lp-trust-item"><CheckCircle className="w-3.5 h-3.5" /> Real Rewards</span>
          </div>
        </div>

        {/* Hero illustration card */}
        <div className="lp-hero-card animate-gentle-float">
          <div className="lp-hero-card-top">
            <span className="text-3xl">🌳</span>
            <div>
              <div className="font-bold text-gray-800 text-sm">Plantation Verified!</div>
              <div className="text-xs text-gray-500">Aarav S. — Mumbai</div>
            </div>
            <span className="lp-points-badge">+100 pts</span>
          </div>
          <div className="lp-hero-card-divider" />
          <div className="lp-hero-card-stats">
            <div className="lp-mini-stat">
              <span className="text-2xl font-black text-green-600">1,250+</span>
              <span className="text-xs text-gray-500">Trees planted</span>
            </div>
            <div className="lp-mini-stat-divider" />
            <div className="lp-mini-stat">
              <span className="text-2xl font-black text-green-600">45+</span>
              <span className="text-xs text-gray-500">Partner shops</span>
            </div>
          </div>
          <div className="lp-hero-card-bar">
            <span className="text-[10px] font-semibold text-gray-500">Mumbai survival rate</span>
            <span className="text-[10px] font-bold text-green-600">98%</span>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: '98%' }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════ */}
      <div className="lp-stats-strip">
        {STATS.map(s => (
          <div key={s.label} className="lp-stat-item">
            <s.icon className="w-5 h-5 mb-1" style={{ color: s.color }} />
            <div className="lp-stat-value" style={{ color: s.color }}>
              <Counter value={s.value} />
            </div>
            <div className="lp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section id="how" className="lp-section">
        <div className="lp-section-header">
          <div className="lp-eyebrow">How it works</div>
          <h2 className="lp-section-title">4 Simple Steps</h2>
          <p className="lp-section-sub">Anyone can do it — no technical knowledge needed.</p>
        </div>

        <div className="lp-steps-grid">
          {STEPS.map((step, i) => (
            <div key={step.num} className="lp-step-card" style={{ '--step-color': step.color, '--step-bg': step.bg }}>
              {/* Connector line */}
              {i < STEPS.length - 1 && <div className="lp-step-line" aria-hidden />}

              <div className="lp-step-icon-wrap" style={{ background: step.bg }}>
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>
              <div className="lp-step-num">{step.num}</div>
              <h3 className="lp-step-title">{step.title}</h3>
              <p className="lp-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHO IS IT FOR
      ══════════════════════════════════════════════════ */}
      <section className="lp-section lp-alt-bg">
        <div className="lp-section-header">
          <div className="lp-eyebrow">For everyone</div>
          <h2 className="lp-section-title">Who can join?</h2>
        </div>

        <div className="lp-roles-grid">
          {ROLES.map(role => (
            <div key={role.title} className="lp-role-card" style={{ '--role-color': role.color, '--role-bg': role.bg, '--role-border': role.border }}>
              <div className="lp-role-icon" style={{ background: role.bg, borderColor: role.border }}>
                <role.icon className="w-6 h-6" style={{ color: role.color }} />
              </div>
              <h3 className="lp-role-title" style={{ color: role.color }}>{role.title}</h3>
              <p className="lp-role-desc">{role.desc}</p>
              <button
                id={`role-cta-${role.title.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={onGetStarted}
                className="lp-role-btn"
                style={{ color: role.color, borderColor: role.border, background: role.bg }}
              >
                {role.cta} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          RECENT ACTIVITY
      ══════════════════════════════════════════════════ */}
      <section className="lp-section">
        <div className="lp-section-header">
          <div className="lp-eyebrow">Live activity</div>
          <h2 className="lp-section-title">People planting right now 🌿</h2>
        </div>

        <div className="lp-activity-list">
          {RECENT.map((r, i) => (
            <div key={i} className="lp-activity-row">
              <div className="lp-activity-avatar">{r.name.charAt(0)}</div>
              <div className="flex-grow min-w-0">
                <div className="font-semibold text-gray-800 text-sm">{r.name}</div>
                <div className="text-xs text-gray-500">Planted a <span className="font-medium text-green-700">{r.tree}</span> in {r.city}</div>
              </div>
              <div className="lp-activity-pts">+{r.pts} pts ✅</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════ */}
      <section className="lp-cta-banner">
        <div className="lp-cta-inner">
          <div className="text-4xl mb-4">🌳</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to plant your first tree?
          </h2>
          <p className="text-green-100 text-sm mb-6 max-w-md">
            Join thousands of Mumbai citizens who are making their city greener — one tree at a time.
          </p>
          <button
            id="bottom-get-started-btn"
            onClick={onGetStarted}
            className="lp-cta-btn"
          >
            🌱 Get Started Free
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="font-bold text-gray-800">Harit Sankalp</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 text-xs">Civic Afforestation Platform</span>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Municipal Environmental Initiative</p>
        </div>
      </footer>
    </div>
  );
}
