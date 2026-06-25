import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../firebase/dbService';
import { QrCode, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

export default function BusinessDashboard({ setActiveTab }) {
  const { currentUser } = useApp();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRedemptions = async () => {
    if (!currentUser) return;
    try {
      const data = await dbService.getQRCodes(currentUser.uid, 'business');
      setRedemptions(data.sort((a, b) => new Date(b.redeemedAt || b.createdAt) - new Date(a.redeemedAt || a.createdAt)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60svh]">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
      </div>
    );
  }

  const redeemedOnly = redemptions.filter(r => r.status === 'redeemed');
  const activeOnly = redemptions.filter(r => r.status === 'active');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Business Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-750 text-white rounded-3xl p-6 md:p-8 shadow-md mb-8">
        <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">Business Dashboard</span>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-1">{currentUser?.businessName}</h2>
        <p className="text-xs text-blue-200 font-light mt-1.5 flex items-center gap-1">
          <span>Address: {currentUser?.address}</span>
          <span className="mx-2">|</span>
          <span className="font-semibold text-emerald-300">Active Offer: {currentUser?.discount}</span>
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-earth-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] text-earth-400 uppercase font-bold block">New Customers</span>
            <span className="text-2xl font-extrabold text-earth-900">{redeemedOnly.length}</span>
          </div>
        </div>

        <div className="bg-white border border-earth-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-earth-400 uppercase font-bold block">Vouchers Claimed</span>
            <span className="text-2xl font-extrabold text-earth-900">{redemptions.length}</span>
          </div>
        </div>

        <div className="bg-white border border-earth-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <TrendingUp className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <span className="text-[10px] text-earth-400 uppercase font-bold block">Voucher Conversion</span>
            <span className="text-2xl font-extrabold text-earth-900 font-sans">
              {redemptions.length > 0 
                ? `${Math.round((redeemedOnly.length / redemptions.length) * 100)}%` 
                : '0%'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-earth-900">Voucher Log</h3>
          <button
            onClick={() => setActiveTab('scan-qr')}
            className="inline-flex items-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4 mr-1.5" />
            Scan New QR Code
          </button>
        </div>

        {redemptions.length === 0 ? (
          <div className="glass-panel text-center p-12 rounded-3xl border border-dashed border-earth-300">
            <QrCode className="w-12 h-12 text-earth-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-earth-700">No Vouchers Generated Yet</h4>
            <p className="text-xs text-earth-500 mt-1 max-w-sm mx-auto">
              Your business offer is active! Citizens will start seeing your discount once they earn planting points.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-earth-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-earth-200">
              <thead className="bg-earth-50 text-[10px] font-bold text-earth-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Redeemed/Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-200 text-xs text-earth-700">
                {redemptions.map((red) => (
                  <tr key={red.code} className="hover:bg-earth-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-650">{red.code}</td>
                    <td className="px-6 py-4">{red.userEmail}</td>
                    <td className="px-6 py-4">
                      {red.status === 'redeemed' ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          Redeemed
                        </span>
                      ) : red.status === 'expired' ? (
                        <span className="text-red-700 font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-earth-500 font-sans">
                      {new Date(red.redeemedAt || red.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
