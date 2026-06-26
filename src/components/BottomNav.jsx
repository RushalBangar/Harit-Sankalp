import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Leaf, Gift, QrCode, Shield, ClipboardList } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const citizenTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'order', label: 'Order', icon: Leaf },
    { id: 'rewards', label: 'Rewards', icon: Gift },
  ];

  const businessTabs = [
    { id: 'business-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan-qr', label: 'Scan QR', icon: QrCode },
  ];

  const govTabs = [
    { id: 'gov-dashboard', label: 'Registry', icon: Shield },
    { id: 'manage-inventory', label: 'Inventory', icon: ClipboardList },
  ];

  const tabs =
    currentUser.role === 'citizen'
      ? citizenTabs
      : currentUser.role === 'business'
      ? businessTabs
      : govTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-forest-100 shadow-lg">
      <div className="flex items-stretch justify-around">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors cursor-pointer ${
                isActive
                  ? 'text-forest-600'
                  : 'text-earth-400 hover:text-forest-500'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-forest-700' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-forest-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
