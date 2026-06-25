import React from 'react';
import { Leaf, Users, Building2, ShieldCheck, TreePine, Gift, ChevronRight, HelpCircle } from 'lucide-react';

export default function LandingPage({ setActiveTab, onGetStarted }) {
  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-between">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white py-20 px-6 overflow-hidden rounded-b-[2.5rem] shadow-xl">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-forest-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-forest-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-800/60 border border-forest-700/50 text-xs font-semibold text-forest-200 mb-6 animate-pulse">
            <Leaf className="w-3.5 h-3.5 text-forest-400" />
            Empowering Green Initiatives
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Harit Sankalp: Make a Pledge, <br />
            <span className="bg-gradient-to-r from-forest-400 to-emerald-300 bg-clip-text text-transparent">
              Plant & Get Rewarded
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-forest-200 mb-8 leading-relaxed font-light">
            We bridge the gap between citizens, local businesses, and government. Plant a tree, verify its location using our live EXIF checker, and receive exclusive discount vouchers for local cafes and hotels.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-forest-950 bg-emerald-400 hover:bg-emerald-300 transition-all hover:scale-102 hover:shadow-lg shadow-md cursor-pointer"
            >
              Get Started Today
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
            <a
              href="#how-it-works"
              className="text-sm font-semibold text-forest-200 hover:text-white transition-colors py-2"
            >
              Learn How It Works &rarr;
            </a>
          </div>
        </div>
      </header>

      {/* Stakeholders Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Citizens */}
          <div className="glass-panel p-8 rounded-3xl shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-forest-600" />
            </div>
            <h3 className="text-xl font-bold text-earth-900 mb-3">For Citizens</h3>
            <p className="text-sm text-earth-500 leading-relaxed">
              Claim free tree saplings from government nurseries. Plant them, snap a live photo, and unlock discount QR codes at your favorite local spots. Enjoy nature and saving money!
            </p>
          </div>

          {/* Card 2: Businesses */}
          <div className="glass-panel p-8 rounded-3xl shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-earth-900 mb-3">For Businesses</h3>
            <p className="text-sm text-earth-500 leading-relaxed">
              Attract eco-conscious customers by participating as a discount provider. Gain free local marketing, boost restaurant or hotel footfall, and show your green commitment.
            </p>
          </div>

          {/* Card 3: Government */}
          <div className="glass-panel p-8 rounded-3xl shadow-lg border border-white/60 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-accent-amber" />
            </div>
            <h3 className="text-xl font-bold text-earth-900 mb-3">For Government</h3>
            <p className="text-sm text-earth-500 leading-relaxed">
              Manage nurseries and distribute saplings through structured decentralized Pickup Points. Securely track active tree plantings with automated coordinates and live photo verification.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-12 scroll-mt-20">
        <h2 className="text-3xl font-extrabold text-earth-900 text-center mb-12">
          The Plantation Verification Loop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-bold text-lg mx-auto mb-4">
              1
            </div>
            <h4 className="font-bold text-earth-950 mb-1">Claim Sapling</h4>
            <p className="text-xs text-earth-500">
              Select an indigenous tree and request it for pickup at your nearest government nursery.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-bold text-lg mx-auto mb-4">
              2
            </div>
            <h4 className="font-bold text-earth-950 mb-1">Plant and Capture</h4>
            <p className="text-xs text-earth-500">
              Plant the tree and take a live photo using our web camera integration. EXIF headers are validated.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-bold text-lg mx-auto mb-4">
              3
            </div>
            <h4 className="font-bold text-earth-950 mb-1">Earn Points</h4>
            <p className="text-xs text-earth-500">
              Once verified, earn green reward points instantly in your profile dashboard.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-700 font-bold text-lg mx-auto mb-4">
              4
            </div>
            <h4 className="font-bold text-earth-950 mb-1">Redeem Vouchers</h4>
            <p className="text-xs text-earth-500">
              Spend points to generate dynamic QR codes. Show them at partner restaurants for discounts.
            </p>
          </div>
        </div>
      </section>

      {/* Info Stats Banner */}
      <section className="bg-forest-900 text-white py-12 px-6 rounded-[2rem] max-w-6xl mx-auto my-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center shadow-lg">
        <div>
          <div className="text-4xl font-extrabold text-emerald-400 mb-1">1,250+</div>
          <div className="text-xs uppercase tracking-wider text-forest-200 font-bold">Trees Planted</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-emerald-400 mb-1">45+</div>
          <div className="text-xs uppercase tracking-wider text-forest-200 font-bold">Business Partners</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-emerald-400 mb-1">98%</div>
          <div className="text-xs uppercase tracking-wider text-forest-200 font-bold">Plantation Survival Rate</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-earth-200 bg-white py-8 text-center text-xs text-earth-450">
        <p className="mb-2">&copy; {new Date().getFullYear()} Harit Sankalp Environmental Initiative. All Rights Reserved.</p>
        <p className="font-light">Developed to encourage grassroots afforestation, local commerce, and civic partnerships.</p>
      </footer>
    </div>
  );
}
