import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../firebase/dbService';
import { MapPin, Info, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export default function OrderSapling({ setActiveTab }) {
  const { currentUser, showNotification } = useApp();
  const [plants, setPlants] = useState([]);
  const [nurseries, setNurseries] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedNurseryId, setSelectedNurseryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const plantsData = await dbService.getPlants();
        const nurseriesData = await dbService.getPickupPoints();
        setPlants(plantsData);
        setNurseries(nurseriesData);
        if (nurseriesData.length > 0) {
          setSelectedNurseryId(nurseriesData[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOrder = async () => {
    if (!currentUser) {
      showNotification("Please login to order saplings.", "error");
      setActiveTab('auth');
      return;
    }
    if (!selectedPlant || !selectedNurseryId) return;

    // Check stock
    const nursery = nurseries.find(n => n.id === selectedNurseryId);
    const stock = nursery?.stock?.[selectedPlant.id] || 0;
    
    if (stock <= 0) {
      showNotification("This sapling is currently out of stock at the selected nursery.", "error");
      return;
    }

    setOrdering(true);
    try {
      await dbService.createOrder(
        currentUser.uid,
        currentUser.name,
        selectedPlant.id,
        selectedPlant.name,
        nursery.id,
        nursery.name
      );
      showNotification(`Successfully ordered ${selectedPlant.name}! Collect it from ${nursery.name}.`, "success");
      setSelectedPlant(null);
      setActiveTab('dashboard');
    } catch (err) {
      showNotification("Order creation failed: " + err.message, "error");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60svh]">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
      </div>
    );
  }

  const activeNursery = nurseries.find(n => n.id === selectedNurseryId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-earth-900">Choose Your Sapling</h2>
        <p className="text-xs text-earth-500 mt-2 max-w-md mx-auto">
          Help increase our local green cover. Request a sapling and pick it up from a nearby government nursery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Catalog */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {plants.map((plant) => (
            <div 
              key={plant.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-forest-100/60 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative bg-earth-100">
                  <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-forest-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {plant.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-earth-900">{plant.name}</h3>
                  <p className="text-xs text-earth-500 mt-2 leading-relaxed font-light">{plant.description}</p>
                  
                  {/* Plant Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-earth-100 text-[10px] font-bold text-earth-700">
                    <div>
                      <span className="text-earth-400 block font-normal uppercase">Difficulty</span>
                      {plant.difficulty}
                    </div>
                    <div>
                      <span className="text-earth-400 block font-normal uppercase">Water</span>
                      {plant.waterNeeded}
                    </div>
                    <div>
                      <span className="text-earth-400 block font-normal uppercase">Absorption</span>
                      <span className="text-forest-600">{plant.co2Absorption.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={() => setSelectedPlant(plant)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-forest-200 hover:border-forest-500 rounded-xl text-xs font-semibold text-forest-700 hover:text-forest-900 hover:bg-forest-50/50 transition-all cursor-pointer"
                >
                  Select for Plantation
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Nursery & Order Summary panel */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl border border-white/60 shadow-md sticky top-24">
            <h3 className="text-lg font-bold text-earth-900 mb-4 pb-2 border-b border-earth-150">Order Summary</h3>

            {selectedPlant ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Plant details */}
                <div className="flex gap-3 items-center bg-forest-50/50 border border-forest-100 p-3 rounded-2xl">
                  <img src={selectedPlant.image} alt={selectedPlant.name} className="w-12 h-12 object-cover rounded-xl" />
                  <div>
                    <h4 className="text-sm font-bold text-earth-900">{selectedPlant.name}</h4>
                    <span className="text-[10px] text-forest-600 font-bold flex items-center gap-1 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-accent-gold" />
                      Worth 100 Reward Points
                    </span>
                  </div>
                </div>

                {/* Nursery Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-earth-700 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-earth-455" />
                    Select Pickup Nursery
                  </label>
                  <select
                    value={selectedNurseryId}
                    onChange={(e) => setSelectedNurseryId(e.target.value)}
                    className="block w-full px-3 py-2 rounded-xl border border-earth-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm font-medium"
                  >
                    {nurseries.map(nur => (
                      <option key={nur.id} value={nur.id}>{nur.name}</option>
                    ))}
                  </select>
                </div>

                {/* Selected Nursery Details */}
                {activeNursery && (
                  <div className="p-3.5 bg-earth-100 rounded-2xl border border-earth-200 text-xs space-y-1.5">
                    <p className="font-bold text-earth-850">Collection Address:</p>
                    <p className="text-earth-600 leading-normal">{activeNursery.address}</p>
                    <p className="text-earth-650 font-medium">Contact: {activeNursery.contact}</p>
                    
                    <div className="pt-2 border-t border-earth-200 mt-2 flex justify-between items-center text-[10px] font-bold">
                      <span className="text-earth-500">Available Stock:</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        (activeNursery.stock?.[selectedPlant.id] || 0) > 0 
                          ? 'bg-forest-100 text-forest-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activeNursery.stock?.[selectedPlant.id] || 0} left
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-sm font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    {ordering ? 'Confirming Order...' : 'Confirm Order & Claim'}
                  </button>
                  <button
                    onClick={() => setSelectedPlant(null)}
                    className="w-full text-center px-4 py-2 text-xs font-semibold text-earth-500 hover:text-earth-700 cursor-pointer"
                  >
                    Reset Selection
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-earth-400">
                <Info className="w-8 h-8 text-earth-300 mx-auto mb-2" />
                <p className="text-xs max-w-[200px] mx-auto leading-normal">
                  Select a tree sapling from the catalog to see order options and pickup nurseries.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
