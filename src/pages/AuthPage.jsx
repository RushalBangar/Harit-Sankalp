import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, User, Key, Mail, Building2, TreePine } from 'lucide-react';

export default function AuthPage({ setActiveTab }) {
  const { login, signup } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('citizen'); // 'citizen' | 'business' | 'government'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Business specific fields
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [discountDesc, setDiscountDesc] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);

    try {
      let user;
      if (isRegister) {
        let extraDetails = {};
        if (role === 'business') {
          extraDetails = {
            businessName,
            address: businessAddress,
            discount: discountDesc || '10% OFF'
          };
        }
        user = await signup(email, password, role, name, extraDetails);
      } else {
        user = await login(email, password);
      }

      // Redirect based on actual user role
      const redirectRole = user?.role;
      if (redirectRole === 'citizen') setActiveTab('dashboard');
      else if (redirectRole === 'business') setActiveTab('business-dashboard');
      else if (redirectRole === 'government') setActiveTab('gov-dashboard');
      
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl shadow-xl border border-white/60">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight flex items-center justify-center gap-2">
            {isRegister ? 'Join Harit Sankalp' : 'Welcome Back'}
            <Sparkles className="w-5 h-5 text-forest-500" />
          </h2>
          <p className="mt-2 text-xs text-earth-500">
            {isRegister ? 'Create an account to protect nature and earn rewards.' : 'Log in to manage your saplings or verify QR codes.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register-only Name field */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 pr-3 py-2 block w-full rounded-lg border border-earth-300 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-earth-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 pr-3 py-2 block w-full rounded-lg border border-earth-300 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-earth-700 uppercase mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-earth-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-3 py-2 block w-full rounded-lg border border-earth-300 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm font-medium"
              />
            </div>
          </div>

          {/* Role selector */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase mb-1">Account Role</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'citizen'
                      ? 'bg-forest-100 border-forest-500 text-forest-800'
                      : 'border-earth-300 text-earth-500 hover:bg-earth-100'
                  }`}
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setRole('business')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'business'
                      ? 'bg-blue-100 border-blue-500 text-blue-800'
                      : 'border-earth-300 text-earth-500 hover:bg-earth-100'
                  }`}
                >
                  Business
                </button>
                <button
                  type="button"
                  onClick={() => setRole('government')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'government'
                      ? 'bg-amber-100 border-accent-amber text-amber-800'
                      : 'border-earth-300 text-earth-500 hover:bg-earth-100'
                  }`}
                >
                  Government
                </button>
              </div>
            </div>
          )}

          {/* Business-specific Fields */}
          {isRegister && role === 'business' && (
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Partner Business Details
              </h4>
              
              <div>
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-0.5">Business / Outlet Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evergreen Restaurant"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="px-3 py-1.5 block w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-0.5">Outlet Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shop 24, Green Boulevard"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="px-3 py-1.5 block w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-blue-700 uppercase mb-0.5">Discount Deal Details</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% OFF on total bill"
                  value={discountDesc}
                  onChange={(e) => setDiscountDesc(e.target.value)}
                  className="px-3 py-1.5 block w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-forest-600 hover:bg-forest-700 transition-all cursor-pointer mt-4"
          >
            {submitting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Working...
              </span>
            ) : isRegister ? (
              'Register Account'
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Toggle signup/signin */}
        <div className="text-center mt-6 border-t border-earth-200 pt-4">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-forest-600 hover:text-forest-700 font-bold transition-colors cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
