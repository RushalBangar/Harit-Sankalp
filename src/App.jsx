import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CitizenDashboard from './pages/CitizenDashboard';
import OrderSapling from './pages/OrderSapling';
import RedeemRewards from './pages/RedeemRewards';
import BusinessDashboard from './pages/BusinessDashboard';
import ScanQR from './pages/ScanQR';
import GovDashboard from './pages/GovDashboard';
import ManageInventory from './pages/ManageInventory';
import { AlertCircle, CheckCircle, Info, Leaf } from 'lucide-react';

function AppContent() {
  const { currentUser, loading, notification } = useApp();
  const [activeTab, setActiveTab] = useState('landing');

  // Sync active page tab when user logs in or out
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'citizen') {
        setActiveTab('dashboard');
      } else if (currentUser.role === 'business') {
        setActiveTab('business-dashboard');
      } else if (currentUser.role === 'government') {
        setActiveTab('gov-dashboard');
      }
    } else {
      setActiveTab('landing');
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-forest-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" />
          <Leaf className="w-6 h-6 text-forest-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-forest-800">Harit Sankalp is loading...</p>
      </div>
    );
  }

  // Router dispatcher
  const renderPage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage 
            setActiveTab={setActiveTab} 
            onGetStarted={() => currentUser ? setActiveTab(currentUser.role === 'citizen' ? 'dashboard' : currentUser.role === 'business' ? 'business-dashboard' : 'gov-dashboard') : setActiveTab('auth')} 
          />
        );
      case 'auth':
        return <AuthPage setActiveTab={setActiveTab} />;
      
      // Citizen tabs
      case 'dashboard':
        return currentUser?.role === 'citizen' ? <CitizenDashboard setActiveTab={setActiveTab} /> : <AuthPage setActiveTab={setActiveTab} />;
      case 'order':
        return currentUser?.role === 'citizen' ? <OrderSapling setActiveTab={setActiveTab} /> : <AuthPage setActiveTab={setActiveTab} />;
      case 'rewards':
        return currentUser?.role === 'citizen' ? <RedeemRewards setActiveTab={setActiveTab} /> : <AuthPage setActiveTab={setActiveTab} />;
      
      // Business tabs
      case 'business-dashboard':
        return currentUser?.role === 'business' ? <BusinessDashboard setActiveTab={setActiveTab} /> : <AuthPage setActiveTab={setActiveTab} />;
      case 'scan-qr':
        return currentUser?.role === 'business' ? <ScanQR setActiveTab={setActiveTab} /> : <AuthPage setActiveTab={setActiveTab} />;
      
      // Government tabs
      case 'gov-dashboard':
        return currentUser?.role === 'government' ? <GovDashboard setActiveTab={setActiveTab} /> : <AuthPage setActiveTab={setActiveTab} />;
      case 'manage-inventory':
        return currentUser?.role === 'government' ? <ManageInventory setActiveTab={setActiveTab} /> : <AuthPage setActiveTab={setActiveTab} />;
      
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const showBottomNav = !!currentUser;

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-between">
      {/* Floating Notification — bottom on mobile (above bottom nav), top-right on desktop */}
      {notification && (
        <div className={`fixed z-[9999] max-w-sm w-[calc(100%-2rem)] p-4 border rounded-2xl shadow-xl flex gap-3 items-center animate-fadeIn
          bottom-24 left-4 md:bottom-auto md:top-5 md:right-5 md:left-auto md:w-full
          ${getNotificationStyles(notification.type)}`}>
          {getNotificationIcon(notification.type)}
          <span className="text-xs font-semibold leading-relaxed">{notification.message}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Page view container — extra bottom padding on mobile for bottom nav */}
      <main className={`flex-grow ${showBottomNav ? 'pb-20 md:pb-0' : ''}`}>
        <div className="animate-fadeIn">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {showBottomNav && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
