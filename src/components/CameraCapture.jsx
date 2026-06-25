import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { verifyImageMetadata } from '../utils/verification';

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Initialize camera stream
  const startCamera = async () => {
    setError(null);
    setPhoto(null);
    setVerificationData(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please upload an image file instead.");
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Capture frame from video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions matching video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob/file
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `plantation_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setPhoto(URL.createObjectURL(blob));
        stopCamera();
        await processVerification(file);
      }, 'image/jpeg');
    }
  };

  // Handle manual file upload fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(URL.createObjectURL(file));
    stopCamera();
    await processVerification(file);
  };

  // Run the EXIF check
  const processVerification = async (file) => {
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const result = await verifyImageMetadata(file);
      if (result.isValid) {
        setVerificationData(result);
        if (result.warning) {
          setWarning(result.warning);
        }
      } else {
        setError(result.error || "Image verification failed. Ensure GPS is enabled on your phone and take a fresh picture.");
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Complete capture flow and return verified data
  const handleConfirm = () => {
    if (verificationData && photo) {
      // Create a Blob from base64/blob URL if necessary, but we can pass the photo URL or data
      // For database saving, dbService.verifyPlantation expects a File/Blob, so we fetch it:
      fetch(photo)
        .then(res => res.blob())
        .then(blob => {
          const fileObj = new File([blob], "verified_plant.jpg", { type: "image/jpeg" });
          onCapture(fileObj, verificationData.gps);
        });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-forest-100 max-w-md mx-auto">
      <h3 className="text-lg font-bold text-earth-900 mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-forest-600" />
        Verify Your Plantation
      </h3>

      <p className="text-xs text-earth-500 mb-4">
        To prevent fraudulent claims, our system scans EXIF data for GPS coordinates and live timestamps. Please ensure location services are enabled on your device.
      </p>

      {/* Viewfinder/Preview Container */}
      <div className="relative aspect-video rounded-xl bg-earth-900 overflow-hidden mb-4 border border-earth-800">
        {cameraActive && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover transform -scale-x-100" 
          />
        )}
        
        {photo && (
          <img src={photo} alt="Plantation preview" className="w-full h-full object-cover" />
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <RefreshCw className="w-8 h-8 text-forest-500 animate-spin mb-2" />
            <span className="text-sm font-semibold">Validating Metadata & GPS...</span>
          </div>
        )}

        {!cameraActive && !photo && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-earth-400 p-4 text-center">
            <AlertCircle className="w-8 h-8 mb-2 text-earth-500" />
            <span className="text-xs mb-3">Camera access inactive or blocked.</span>
            <label className="inline-flex items-center justify-center px-4 py-2 border border-earth-300 rounded-lg text-xs font-semibold text-earth-700 bg-white hover:bg-earth-50 cursor-pointer shadow-sm">
              <Upload className="w-4 h-4 mr-2 text-earth-500" />
              Upload Image File
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {warning && (
        <div className="mb-4 p-3 bg-accent-gold/10 border border-accent-gold/30 rounded-lg text-xs text-accent-amber flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-accent-amber mt-0.5" />
          <span>{warning}</span>
        </div>
      )}

      {verificationData && !error && (
        <div className="mb-4 p-3 bg-forest-50 border border-forest-200 rounded-lg text-xs text-forest-800 flex items-start gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-forest-600 mt-0.5" />
          <div>
            <p className="font-bold">Plantation Verified!</p>
            <p className="text-earth-500 mt-1">Coordinates: {verificationData.gps.lat.toFixed(6)}, {verificationData.gps.lng.toFixed(6)}</p>
            {verificationData.simulated && <p className="text-accent-amber font-semibold mt-0.5">(Demo Simulated GPS)</p>}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex gap-2">
        {cameraActive ? (
          <>
            <button
              onClick={capturePhoto}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-sm font-semibold shadow-md cursor-pointer"
            >
              Take Photo
            </button>
            <button
              onClick={() => {
                stopCamera();
                setPhoto(null);
                setVerificationData(null);
              }}
              className="px-4 py-2 border border-earth-300 rounded-lg text-sm font-semibold text-earth-700 hover:bg-earth-50 cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {!verificationData && (
              <button
                onClick={startCamera}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer"
              >
                Restart Camera
              </button>
            )}

            {verificationData && (
              <button
                onClick={handleConfirm}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-sm font-semibold shadow-md cursor-pointer"
              >
                Submit Plantation
              </button>
            )}

            <button
              onClick={onCancel}
              className="px-4 py-2 border border-earth-300 rounded-lg text-sm font-semibold text-earth-700 hover:bg-earth-50 cursor-pointer"
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
