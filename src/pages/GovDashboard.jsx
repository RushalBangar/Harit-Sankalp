import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../firebase/dbService';
import { Calendar, ClipboardList, TreePine, MapPin, Award, Check } from 'lucide-react';

export default function GovDashboard({ setActiveTab }) {
  const { currentUser, showNotification } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const data = await dbService.getOrders(null, 'government');
      // Sort orders: show pending/ordered first, then picked_up, then planted. Then sort by date.
      const statusOrder = { 'ordered': 0, 'picked_up': 1, 'planted': 2 };
      setOrders(data.sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.orderedAt) - new Date(a.orderedAt);
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmPickup = async (orderId, plantName, userName) => {
    try {
      setLoading(true);
      await dbService.updateOrderStatus(orderId, 'picked_up');
      showNotification(`Sapling (${plantName}) pickup confirmed for ${userName}.`, "success");
      await fetchOrders();
    } catch (err) {
      showNotification("Pickup confirmation failed: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="skeleton h-32 w-full rounded-3xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-earth-200 flex gap-4 items-center">
              <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-2/3" />
              </div>
              <div className="skeleton h-9 w-36 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pendingCount = orders.filter(o => o.status === 'ordered').length;
  const pickedUpCount = orders.filter(o => o.status === 'picked_up').length;
  const plantedCount = orders.filter(o => o.status === 'planted').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Gov Header */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-800 text-white rounded-3xl p-6 md:p-8 shadow-md mb-8">
        <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">Government Coordinator Panel</span>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Nursery & Afforestation Registry</h2>
        <p className="text-xs text-amber-200 font-light mt-1">Review orders, authorize pickups, and monitor grassroots environmental compliance.</p>
      </div>

      {/* Registry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => setStatusFilter(statusFilter === 'ordered' ? 'all' : 'ordered')}
          className={`text-left w-full bg-white border p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-102 hover:shadow-md cursor-pointer ${
            statusFilter === 'ordered' ? 'border-accent-amber ring-2 ring-accent-amber/20' : 'border-earth-200 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 flex-shrink-0">
            <ClipboardList className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <span className="text-[10px] text-earth-400 uppercase font-bold block">Awaiting Collection</span>
            <span className="text-2xl font-extrabold text-earth-900">{pendingCount}</span>
          </div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'picked_up' ? 'all' : 'picked_up')}
          className={`text-left w-full bg-white border p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-102 hover:shadow-md cursor-pointer ${
            statusFilter === 'picked_up' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-earth-200 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] text-earth-400 uppercase font-bold block">Distributed & In-transit</span>
            <span className="text-2xl font-extrabold text-earth-900">{pickedUpCount}</span>
          </div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'planted' ? 'all' : 'planted')}
          className={`text-left w-full bg-white border p-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-102 hover:shadow-md cursor-pointer ${
            statusFilter === 'planted' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-earth-200 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0">
            <TreePine className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-earth-400 uppercase font-bold block">Verified Planted</span>
            <span className="text-2xl font-extrabold text-forest-750">{plantedCount}</span>
          </div>
        </button>
      </div>

      {/* Sapling Orders Log */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-earth-900">Sapling Pickup Authorization</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('manage-inventory')}
              className="inline-flex items-center text-xs font-bold text-amber-900 hover:text-white bg-amber-50 hover:bg-amber-700 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm border border-amber-200"
            >
              Manage Nursery Stocks
            </button>
          </div>
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex flex-wrap gap-2 pb-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-amber-100 border-accent-amber text-amber-950'
                : 'bg-white border-earth-200 text-earth-500 hover:bg-earth-50'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('ordered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'ordered'
                ? 'bg-amber-100 border-accent-amber text-amber-950'
                : 'bg-white border-earth-200 text-earth-500 hover:bg-earth-50'
            }`}
          >
            Awaiting Pickup ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('picked_up')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'picked_up'
                ? 'bg-blue-100 border-blue-500 text-blue-900'
                : 'bg-white border-earth-200 text-earth-500 hover:bg-earth-50'
            }`}
          >
            In-Transit ({pickedUpCount})
          </button>
          <button
            onClick={() => setStatusFilter('planted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              statusFilter === 'planted'
                ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                : 'bg-white border-earth-200 text-earth-500 hover:bg-earth-50'
            }`}
          >
            Verified Planted ({plantedCount})
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="glass-panel text-center p-12 rounded-3xl border border-dashed border-earth-300">
            <TreePine className="w-12 h-12 text-earth-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-earth-700">No Orders in System</h4>
            <p className="text-xs text-earth-500 mt-1 max-w-sm mx-auto">
              Once citizens submit sapling orders, they will appear here for pickup verification.
            </p>
          </div>
        ) : orders.filter(o => statusFilter === 'all' || o.status === statusFilter).length === 0 ? (
          <div className="glass-panel text-center p-12 rounded-3xl border border-dashed border-earth-300">
            <TreePine className="w-12 h-12 text-earth-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-earth-700">No Matching Orders</h4>
            <p className="text-xs text-earth-500 mt-1 max-w-sm mx-auto">
              There are no orders matching the "{statusFilter === 'ordered' ? 'Awaiting Pickup' : statusFilter === 'picked_up' ? 'In-transit' : 'Planted'}" status.
            </p>
            <button
              onClick={() => setStatusFilter('all')}
              className="mt-4 px-3 py-1.5 bg-earth-200 hover:bg-earth-300 text-earth-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders
              .filter(o => statusFilter === 'all' || o.status === statusFilter)
              .map((order) => (
              <div 
                key={order.id} 
                className="bg-white p-5 rounded-2xl border border-earth-200 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-earth-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-earth-200">
                    {order.image ? (
                      <img src={order.image} alt={order.plantName} className="w-full h-full object-cover" />
                    ) : (
                      <TreePine className="w-6 h-6 text-earth-450" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-earth-900">{order.plantName}</h4>
                      {order.status === 'ordered' && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Awaiting Pickup</span>
                      )}
                      {order.status === 'picked_up' && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Awaiting Planting</span>
                      )}
                      {order.status === 'planted' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Verified Planted</span>
                      )}
                    </div>
                    
                    <p className="text-xs text-earth-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>Ordered by: <strong className="text-earth-700">{order.userName}</strong></span>
                      <span className="text-earth-300">•</span>
                      <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {order.pickupPointName}</span>
                    </p>

                    {order.status === 'planted' && order.gpsCoordinates && (
                      <p className="text-[10px] text-forest-700 font-bold mt-1 bg-forest-50 px-2 py-0.5 rounded border border-forest-100 w-fit">
                        Coordinates: {order.gpsCoordinates.lat.toFixed(5)}, {order.gpsCoordinates.lng.toFixed(5)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-auto text-right">
                  {order.status === 'ordered' ? (
                    <button
                      onClick={() => handleConfirmPickup(order.id, order.plantName, order.userName)}
                      className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Confirm Sapling Collected
                    </button>
                  ) : (
                    <div className="text-right text-[10px] text-earth-450 space-y-0.5 font-medium">
                      <p>Ordered: {new Date(order.orderedAt).toLocaleDateString()}</p>
                      {order.pickedUpAt && <p>Picked Up: {new Date(order.pickedUpAt).toLocaleDateString()}</p>}
                      {order.plantedAt && <p>Planted: {new Date(order.plantedAt).toLocaleDateString()}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
