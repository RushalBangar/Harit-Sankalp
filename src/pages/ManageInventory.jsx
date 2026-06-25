import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../firebase/dbService';
import { Home, Save, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ManageInventory({ setActiveTab }) {
  const { showNotification } = useApp();
  const [nurseries, setNurseries] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStocks, setEditingStocks] = useState({}); // { "nurseryId_plantId": quantity }
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      const nurseriesData = await dbService.getPickupPoints();
      const plantsData = await dbService.getPlants();
      setNurseries(nurseriesData);
      setPlants(plantsData);
      
      // Initialize edit states
      const stockState = {};
      nurseriesData.forEach(nur => {
        plantsData.forEach(plant => {
          stockState[`${nur.id}_${plant.id}`] = nur.stock?.[plant.id] ?? 0;
        });
      });
      setEditingStocks(stockState);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockChange = (nurseryId, plantId, val) => {
    const key = `${nurseryId}_${plantId}`;
    const intVal = parseInt(val) || 0;
    setEditingStocks(prev => ({
      ...prev,
      [key]: Math.max(0, intVal)
    }));
  };

  const handleSaveStock = async (nurseryId, plantId) => {
    const key = `${nurseryId}_${plantId}`;
    const quantity = editingStocks[key] ?? 0;
    
    setUpdating(true);
    try {
      await dbService.updateNurseryStock(nurseryId, plantId, quantity);
      showNotification("Stock levels updated successfully.", "success");
      loadData();
    } catch (err) {
      showNotification("Failed to update stock: " + err.message, "error");
    } finally {
      setUpdating(false);
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
      {/* Back to dashboard */}
      <button
        onClick={() => setActiveTab('gov-dashboard')}
        className="inline-flex items-center text-xs font-bold text-earth-500 hover:text-earth-700 mb-6 cursor-pointer"
      >
        <Home className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-extrabold text-earth-900 mb-2">Government Nursery Inventory</h2>
      <p className="text-xs text-earth-500 mb-6">Adjust stock quantities for saplings currently available at physical pickup zones.</p>

      <div className="space-y-8">
        {nurseries.map(nursery => (
          <div 
            key={nursery.id}
            className="bg-white rounded-3xl border border-earth-200 shadow-sm overflow-hidden"
          >
            {/* Nursery Head */}
            <div className="bg-earth-50 px-6 py-4 border-b border-earth-200 flex flex-col md:flex-row justify-between md:items-center gap-2">
              <div>
                <h3 className="font-bold text-earth-900 text-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  {nursery.name}
                </h3>
                <p className="text-xs text-earth-500 mt-0.5">{nursery.address}</p>
              </div>
              <div className="text-xs text-earth-650 font-medium font-sans">
                Contact: {nursery.contact}
              </div>
            </div>

            {/* Stocks Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-earth-200">
                <thead className="bg-earth-50/50 text-[10px] font-bold text-earth-500 uppercase tracking-wider text-left">
                  <tr>
                    <th className="px-6 py-3">Sapling Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 w-32">Nursery Stock</th>
                    <th className="px-6 py-3 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-200 text-xs text-earth-700">
                  {plants.map(plant => {
                    const editKey = `${nursery.id}_${plant.id}`;
                    const currentQuantity = nursery.stock?.[plant.id] ?? 0;
                    const editingQuantity = editingStocks[editKey] ?? 0;
                    const hasChanged = currentQuantity !== editingQuantity;

                    return (
                      <tr key={plant.id} className="hover:bg-earth-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-earth-850">{plant.name}</td>
                        <td className="px-6 py-4 text-earth-500">{plant.category}</td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            value={editingQuantity}
                            onChange={(e) => handleStockChange(nursery.id, plant.id, e.target.value)}
                            className="w-20 px-2 py-1 rounded-lg border border-earth-300 focus:outline-none focus:ring-1 focus:ring-forest-500 text-xs font-bold text-center"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleSaveStock(nursery.id, plant.id)}
                            disabled={!hasChanged || updating}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              hasChanged 
                                ? 'bg-forest-600 hover:bg-forest-700 text-white shadow-sm cursor-pointer' 
                                : 'bg-earth-100 text-earth-400 cursor-not-allowed border border-earth-200'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
