import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, LogOut, Menu, X, User, TreePine, QrCode, Shield } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleIcon = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'government':
        return <Shield className="w-4 h-4 text-accent-amber" />;
      case 'business':
        return <QrCode className="w-4 h-4 text-blue-500" />;
      default:
        return <TreePine className="w-4 h-4 text-forest-500" />;
    }
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    switch (currentUser.role) {
      case 'government':
        return 'Gov Authority';
      case 'business':
        return 'Business Partner';
      default:
        return 'Citizen';
    }
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 shadow-sm border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('landing')}>
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center border border-forest-200">
                <Leaf className="w-6 h-6 text-forest-600 transition-transform group-hover:rotate-12 duration-200" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-forest-700 to-forest-500 bg-clip-text text-transparent">
                Harit Sankalp
              </span>
            </div>

            {/* Navigation links based on auth role */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {currentUser && (
                <>
                  {currentUser.role === 'citizen' && (
                    <>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'dashboard'
                            ? 'bg-forest-100 text-forest-800'
                            : 'text-earth-500 hover:text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => setActiveTab('order')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'order'
                            ? 'bg-forest-100 text-forest-800'
                            : 'text-earth-500 hover:text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        Order Saplings
                      </button>
                      <button
                        onClick={() => setActiveTab('rewards')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'rewards'
                            ? 'bg-forest-100 text-forest-800'
                            : 'text-earth-500 hover:text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        Redeem Rewards
                      </button>
                    </>
                  )}

                  {currentUser.role === 'business' && (
                    <>
                      <button
                        onClick={() => setActiveTab('business-dashboard')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'business-dashboard'
                            ? 'bg-forest-100 text-forest-800'
                            : 'text-earth-500 hover:text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        Business Dashboard
                      </button>
                      <button
                        onClick={() => setActiveTab('scan-qr')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'scan-qr'
                            ? 'bg-forest-100 text-forest-800'
                            : 'text-earth-500 hover:text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        Scan QR Code
                      </button>
                    </>
                  )}

                  {currentUser.role === 'government' && (
                    <>
                      <button
                        onClick={() => setActiveTab('gov-dashboard')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'gov-dashboard'
                            ? 'bg-forest-100 text-forest-800'
                            : 'text-earth-500 hover:text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        Gov Dashboard
                      </button>
                      <button
                        onClick={() => setActiveTab('manage-inventory')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'manage-inventory'
                            ? 'bg-forest-100 text-forest-800'
                            : 'text-earth-500 hover:text-forest-600 hover:bg-forest-50'
                        }`}
                      >
                        Nursery Inventory
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side user menu */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold text-earth-900">{currentUser.name}</span>
                  <span className="text-xs text-earth-500 flex items-center gap-1 justify-end">
                    {getRoleIcon()}
                    {getRoleLabel()}
                  </span>
                </div>
                
                {currentUser.role === 'citizen' && (
                  <div className="bg-forest-50 border border-forest-200 px-3 py-1 rounded-full text-sm font-bold text-forest-700">
                    {currentUser.points ?? 0} pts
                  </div>
                )}

                <button
                  onClick={() => {
                    logout();
                    setActiveTab('landing');
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 text-earth-500 hover:text-red-600 transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 transition-all hover:shadow-md cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {currentUser && currentUser.role === 'citizen' && (
              <div className="bg-forest-50 border border-forest-200 px-2 py-0.5 rounded-full text-xs font-bold text-forest-700 mr-2">
                {currentUser.points ?? 0}p
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-earth-500 hover:text-forest-600 hover:bg-forest-50 focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-forest-100 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser ? (
              <>
                <div className="px-3 py-2 border-b border-earth-100 mb-2 flex items-center justify-between">
                  <div>
                    <div className="text-base font-medium text-earth-900">{currentUser.name}</div>
                    <div className="text-xs text-earth-500">{currentUser.email} ({getRoleLabel()})</div>
                  </div>
                </div>

                {currentUser.role === 'citizen' && (
                  <>
                    <button
                      onClick={() => { setActiveTab('dashboard'); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-earth-700 hover:bg-forest-50 hover:text-forest-600"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { setActiveTab('order'); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-earth-700 hover:bg-forest-50 hover:text-forest-600"
                    >
                      Order Saplings
                    </button>
                    <button
                      onClick={() => { setActiveTab('rewards'); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-earth-700 hover:bg-forest-50 hover:text-forest-600"
                    >
                      Redeem Rewards
                    </button>
                  </>
                )}

                {currentUser.role === 'business' && (
                  <>
                    <button
                      onClick={() => { setActiveTab('business-dashboard'); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-earth-700 hover:bg-forest-50 hover:text-forest-600"
                    >
                      Business Dashboard
                    </button>
                    <button
                      onClick={() => { setActiveTab('scan-qr'); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-earth-700 hover:bg-forest-50 hover:text-forest-600"
                    >
                      Scan QR Code
                    </button>
                  </>
                )}

                {currentUser.role === 'government' && (
                  <>
                    <button
                      onClick={() => { setActiveTab('gov-dashboard'); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-earth-700 hover:bg-forest-50 hover:text-forest-600"
                    >
                      Gov Dashboard
                    </button>
                    <button
                      onClick={() => { setActiveTab('manage-inventory'); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-earth-700 hover:bg-forest-50 hover:text-forest-600"
                    >
                      Nursery Inventory
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    setActiveTab('landing');
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setActiveTab('auth'); setIsOpen(false); }}
                className="w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-forest-600 hover:bg-forest-700"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
