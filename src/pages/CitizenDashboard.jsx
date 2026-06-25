import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../firebase/dbService';
import { Camera, MapPin, Calendar, Clock, Award, Leaf, ChevronRight } from 'lucide-react';
import CameraCapture from '../components/CameraCapture';

export default function CitizenDashboard({ setActiveTab }) {
  const { currentUser, showNotification, refreshUser } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVerifyOrder, setActiveVerifyOrder] = useState(null);

  const fetchOrders = async () => {
    if (!currentUser) return;
    try {
      const data = await dbService.getOrders(currentUser.uid, 'citizen');
      setOrders(data.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  // Capture callback from custom CameraCapture
  const handleVerifyPlantation = async (imageFile, gpsCoordinates) => {
    if (!activeVerifyOrder) return;
    try {
      setLoading(true);
      await dbService.verifyPlantation(activeVerifyOrder.id, imageFile, gpsCoordinates);
      showNotification("Plantation verified! 100 Reward Points added.", "success");
      
      // Update local state
      setActiveVerifyOrder(null);
      refreshUser();
      fetchOrders();
    } catch (error) {
      showNotification("Failed to upload verification: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'planted':
        return <span className="bg-forest-100 text-forest-800 text-xs px-2.5 py-1 rounded-full font-bold">Planted & Verified</span>;
      case 'picked_up':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">Picked Up (Needs Planting)</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold font-sans">Awaiting Pickup</span>;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60svh]">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Overview Banner */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-750 text-white rounded-3xl p-6 md:p-8 shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-forest-300 text-xs font-bold uppercase tracking-wider">Welcome back</span>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-1">{currentUser?.name}</h2>
          <p className="text-xs text-forest-200 font-light mt-1">Thank you for contributing to a greener tomorrow.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-forest-300 block">Total Planted</span>
            <span className="text-2xl font-extrabold mt-0.5 block flex items-center justify-center gap-1.5">
              <Leaf className="w-5 h-5 text-emerald-300" />
              {orders.filter(o => o.status === 'planted').length}
            </span>
          </div>
          <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-bold text-forest-300 block">Reward Balance</span>
            <span className="text-2xl font-extrabold mt-0.5 block flex items-center justify-center gap-1.5">
              <Award className="w-5 h-5 text-accent-gold" />
              {currentUser?.points ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      {activeVerifyOrder ? (
        <div className="animate-fadeIn">
          <CameraCapture 
            onCapture={handleVerifyPlantation}
            onCancel={() => setActiveVerifyOrder(null)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-earth-900">Your Sapling Orders</h3>
            <button
              onClick={() => setActiveTab('order')}
              className="inline-flex items-center text-xs font-bold text-forest-600 hover:text-forest-700 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Order New Sapling
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="glass-panel text-center p-12 rounded-3xl border border-dashed border-earth-300">
              <TreePine className="w-12 h-12 text-earth-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-earth-700">No Sapling Orders Yet</h4>
              <p className="text-xs text-earth-500 mt-1 max-w-sm mx-auto">
                Start your green pledge today! Order a tree sapling from your nearest nursery.
              </p>
              <button
                onClick={() => setActiveTab('order')}
                className="mt-4 px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
              >
                Explore Sapling Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="glass-panel p-5 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {order.image ? (
                        <img src={order.image} alt={order.plantName} className="w-full h-full object-cover" />
                      ) : (
                        <TreePine className="w-7 h-7 text-forest-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-earth-900">{order.plantName}</h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-earth-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-earth-400" />
                        Nursery: {order.pickupPointName}
                      </p>
                      
                      {order.status === 'ordered' && (
                        <p className="text-[10px] text-accent-amber font-semibold mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Nursery manager must confirm pickup.
                        </p>
                      )}
                      
                      {order.status === 'planted' && order.gpsCoordinates && (
                        <p className="text-[10px] text-forest-600 font-bold mt-1 flex items-center gap-1 bg-forest-50 border border-forest-100 px-2 py-0.5 rounded-md w-fit">
                          <MapPin className="w-3 h-3" />
                          Planted at: {order.gpsCoordinates.lat.toFixed(5)}, {order.gpsCoordinates.lng.toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto text-right">
                    {order.status === 'picked_up' && (
                      <button
                        onClick={() => setActiveVerifyOrder(order)}
                        className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-xs font-semibold text-white bg-forest-600 hover:bg-forest-700 shadow-sm cursor-pointer"
                      >
                        <Camera className="w-4 h-4 mr-1.5" />
                        Verify Plantation
                      </button>
                    )}
                    
                    {order.status === 'planted' && (
                      <div className="text-right">
                        <span className="text-[10px] text-earth-400 block">Planted Date</span>
                        <span className="text-xs text-earth-700 font-medium flex items-center gap-1 justify-end mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-earth-450" />
                          {new Date(order.plantedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {order.status === 'ordered' && (
                      <div className="text-right">
                        <span className="text-[10px] text-earth-400 block">Ordered Date</span>
                        <span className="text-xs text-earth-700 font-medium flex items-center gap-1 justify-end mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-earth-450" />
                          {new Date(order.orderedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
