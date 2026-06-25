import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, ScanLine, AlertCircle } from 'lucide-react';

export default function QRScanner({ onScan, onCancel }) {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make sure DOM node exists
    const qrReader = document.getElementById('qr-reader');
    if (!qrReader) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0
      },
      false
    );

    const onScanSuccess = (decodedText) => {
      scanner.clear()
        .then(() => {
          onScan(decodedText);
        })
        .catch((err) => {
          console.error("Failed to clear scanner:", err);
          onScan(decodedText);
        });
    };

    const onScanError = (errorMessage) => {
      // Usually noisy, skip logging unless debugging
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear().catch((err) => {
        // Suppress error if already cleared
      });
    };
  }, [onScan]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      setError("Please enter a valid discount code.");
      return;
    }
    setError(null);
    onScan(manualCode.trim().toUpperCase());
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-forest-100 max-w-md mx-auto">
      <h3 className="text-lg font-bold text-earth-900 mb-2 flex items-center gap-2">
        <QrCode className="w-5 h-5 text-forest-600 animate-pulse" />
        Scan Reward QR Code
      </h3>
      <p className="text-xs text-earth-500 mb-4">
        Hold the customer's QR code in front of the camera to automatically verify and redeem their discount voucher.
      </p>

      {/* QR scanner viewport */}
      <div className="relative rounded-xl overflow-hidden bg-earth-900 border border-earth-850 p-2 mb-4">
        <div id="qr-reader" className="w-full overflow-hidden rounded-lg" style={{ border: 'none' }} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-semibold bg-black/60 text-white py-1 px-3 rounded-full backdrop-blur-sm pointer-events-none">
          <span className="flex items-center gap-1">
            <ScanLine className="w-3.5 h-3.5 text-forest-400 animate-bounce" />
            Scanner Active
          </span>
        </div>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-earth-200"></div>
        <span className="flex-shrink mx-4 text-xs text-earth-400 font-bold uppercase">Or Enter Code Manually</span>
        <div className="flex-grow border-t border-earth-200"></div>
      </div>

      {/* Manual text form fallback */}
      <form onSubmit={handleManualSubmit} className="mt-2 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. HS-ABC123XYZ"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-lg border border-earth-300 placeholder-earth-450 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 text-sm font-semibold uppercase"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-forest-600 hover:bg-forest-700 shadow-sm cursor-pointer"
          >
            Redeem
          </button>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </form>

      <button
        onClick={onCancel}
        className="w-full text-center px-4 py-2 border border-earth-300 rounded-lg text-sm font-semibold text-earth-700 hover:bg-earth-50 transition-colors cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
