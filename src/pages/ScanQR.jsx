import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../firebase/dbService';
import { CheckCircle, AlertCircle, ArrowLeft, Building, BadgePercent } from 'lucide-react';
import QRScanner from '../components/QRScanner';

export default function ScanQR({ setActiveTab }) {
  const { currentUser, showNotification } = useApp();
  const [scanResult, setScanResult] = useState(null); // The redeemed QR code object
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);

  const handleScan = async (code) => {
    if (!currentUser) return;
    setScanning(false);
    setError(null);
    try {
      // Redeem code for this business outlet
      const redeemedVoucher = await dbService.redeemQR(code, currentUser.uid);
      setScanResult(redeemedVoucher);
      showNotification(`Voucher ${code} redeemed successfully!`, "success");
    } catch (err) {
      setError(err.message || "Invalid or expired QR code.");
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
    setScanning(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => setActiveTab('business-dashboard')}
        className="inline-flex items-center text-xs font-bold text-earth-500 hover:text-earth-700 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>

      {scanning ? (
        <div className="animate-fadeIn">
          <QRScanner 
            onScan={handleScan}
            onCancel={() => setActiveTab('business-dashboard')}
          />
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {scanResult && (
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-150 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle className="w-10 h-10 text-emerald-600 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-earth-900">Voucher Redeemed!</h3>
              <p className="text-xs text-earth-500 mt-1">Please apply the discount on the customer's bill.</p>
              
              {/* Discount details */}
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="flex justify-center items-center gap-1.5 text-emerald-800 font-extrabold text-lg">
                  <BadgePercent className="w-5 h-5 text-emerald-600" />
                  {scanResult.discountValue}
                </div>
                <p className="text-[10px] text-earth-450 mt-1 font-mono uppercase tracking-wide">
                  Code: {scanResult.code}
                </p>
                <div className="border-t border-emerald-100/50 mt-3 pt-3 text-[10px] text-left text-earth-600 space-y-1">
                  <p><span className="font-semibold text-earth-700">Customer Email:</span> {scanResult.userEmail}</p>
                  <p><span className="font-semibold text-earth-700">Redeemed At:</span> {new Date(scanResult.redeemedAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Scan Another Code
                </button>
                <button
                  onClick={() => setActiveTab('business-dashboard')}
                  className="px-4 py-2 border border-earth-300 rounded-xl text-xs font-semibold text-earth-700 hover:bg-earth-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-red-100 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-red-700">Redemption Failed</h3>
              <p className="text-xs text-earth-500 mt-2 max-w-xs mx-auto leading-relaxed">{error}</p>
              
              <div className="mt-6 flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Try Scanning Again
                </button>
                <button
                  onClick={() => setActiveTab('business-dashboard')}
                  className="px-4 py-2 border border-earth-300 rounded-xl text-xs font-semibold text-earth-700 hover:bg-earth-50 cursor-pointer"
                >
                  Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
