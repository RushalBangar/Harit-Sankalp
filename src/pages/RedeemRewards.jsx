import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../firebase/dbService';
import { Award, QrCode, Building, Check, Clock, ShieldAlert } from 'lucide-react';

export default function RedeemRewards({ setActiveTab }) {
  const { currentUser, showNotification, refreshUser } = useApp();
  const [businesses, setBusinesses] = useState([]);
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeQR, setActiveQR] = useState(null); // For viewing details of a clicked QR code

  const loadData = async () => {
    if (!currentUser) return;
    try {
      const bizData = await dbService.getBusinesses();
      const qrData = await dbService.getQRCodes(currentUser.uid, 'citizen');
      setBusinesses(bizData);
      setQrs(qrData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleGenerateVoucher = async (biz) => {
    if (!currentUser) return;
    
    // Check points
    if ((currentUser.points ?? 0) < 100) {
      showNotification("Insufficient balance. You need at least 100 points (1 verified planting) to redeem a discount.", "error");
      return;
    }

    setGenerating(true);
    try {
      const newQR = await dbService.generateDiscountQR(
        currentUser.uid,
        currentUser.email,
        biz.discount,
        biz.id,
        biz.name
      );
      showNotification(`Voucher for ${biz.name} generated successfully!`, "success");
      setActiveQR(newQR);
      refreshUser();
      loadData();
    } catch (err) {
      showNotification("Failed to generate voucher: " + err.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  const getQRStatusBadge = (status) => {
    switch (status) {
      case 'redeemed':
        return <span className="bg-earth-200 text-earth-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Redeemed</span>;
      case 'expired':
        return <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Expired</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Active</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60svh]">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header and Point Balance */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-earth-900">Green Rewards</h2>
          <p className="text-xs text-earth-500 mt-1">
            Exchange your plantation reward points for exclusive vouchers at partner outlets.
          </p>
        </div>

        <div className="bg-white border border-forest-200 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center border border-forest-150">
            <Award className="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <span className="text-[10px] text-earth-400 uppercase font-bold block">Available Balance</span>
            <span className="text-xl font-extrabold text-forest-700">{currentUser?.points ?? 0} Points</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vouchers Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-earth-900 flex items-center gap-1.5">
            <Building className="w-5 h-5 text-forest-600" />
            Partner Businesses & Deals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businesses.map(biz => (
              <div 
                key={biz.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-forest-100/60 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-earth-100 overflow-hidden relative">
                    <img src={biz.image} alt={biz.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-forest-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {biz.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-earth-900">{biz.name}</h4>
                    <p className="text-xs text-earth-500 mt-1">{biz.address}</p>
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-bold text-center">
                      {biz.discount}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleGenerateVoucher(biz)}
                    disabled={generating || (currentUser?.points ?? 0) < 100}
                    className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                      (currentUser?.points ?? 0) >= 100
                        ? 'bg-forest-600 hover:bg-forest-700 text-white hover:shadow-md'
                        : 'bg-earth-100 text-earth-400 border border-earth-200 cursor-not-allowed'
                    }`}
                  >
                    Generate Voucher (100 pts)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Active Vouchers List */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-md sticky top-24">
            <h3 className="text-lg font-bold text-earth-900 mb-4 pb-2 border-b border-earth-150 flex items-center gap-1.5">
              <QrCode className="w-5 h-5 text-forest-600" />
              Your Vouchers
            </h3>

            {activeQR ? (
              <div className="text-center space-y-4 animate-fadeIn">
                <div className="p-3 bg-white border border-earth-200 rounded-2xl inline-block shadow-sm">
                  {/* Dynamic QR Loader from qrserver */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${activeQR.code}`} 
                    alt="Voucher QR Code" 
                    className="w-48 h-48 mx-auto" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-earth-900">{activeQR.businessName}</h4>
                  <p className="text-xs text-forest-700 font-bold mt-1 bg-forest-50 border border-forest-100 py-1 px-3 rounded-full w-fit mx-auto">
                    {activeQR.discountValue}
                  </p>
                  <p className="text-[10px] text-earth-450 mt-2 font-mono uppercase tracking-wide">
                    Code: {activeQR.code}
                  </p>
                </div>

                <div className="p-3 bg-earth-100 border border-earth-200 rounded-xl text-[10px] text-earth-600 space-y-1 text-left leading-normal">
                  <p className="font-bold text-earth-800">Instructions:</p>
                  <p>1. Present this QR code to the store manager.</p>
                  <p>2. Once verified, the discount will apply.</p>
                  <p className="font-semibold text-accent-amber mt-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Expires: {new Date(activeQR.expiresAt).toLocaleTimeString()} ({new Date(activeQR.expiresAt).toLocaleDateString()})
                  </p>
                </div>

                <button
                  onClick={() => setActiveQR(null)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-earth-300 rounded-xl text-xs font-semibold text-earth-700 hover:bg-earth-50 cursor-pointer"
                >
                  Back to List
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {qrs.length === 0 ? (
                  <div className="text-center py-12 text-earth-400">
                    <QrCode className="w-8 h-8 text-earth-300 mx-auto mb-2" />
                    <p className="text-xs max-w-[200px] mx-auto leading-normal">
                      No vouchers generated yet. Click "Generate Voucher" once you earn 100 points.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto pr-1 space-y-2">
                    {qrs.map(qr => (
                      <div 
                        key={qr.code}
                        onClick={() => qr.status === 'active' && setActiveQR(qr)}
                        className={`p-3 border rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                          qr.status === 'active' 
                            ? 'bg-white border-forest-100 hover:border-forest-400 hover:bg-forest-50/20' 
                            : 'bg-earth-100/50 border-earth-200 opacity-60 pointer-events-none'
                        }`}
                      >
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-earth-900">{qr.businessName}</h4>
                          <span className="text-[10px] text-earth-500 font-mono">{qr.code}</span>
                          <p className="text-[10px] font-bold text-forest-650 mt-1">{qr.discountValue}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          {getQRStatusBadge(qr.status)}
                          {qr.status === 'active' && (
                            <span className="text-[9px] text-earth-400 flex items-center gap-0.5">
                              Click to view
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
