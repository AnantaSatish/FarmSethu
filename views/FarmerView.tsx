
import React, { useState, useEffect } from 'react';
import { Language, FactoryExport, Produce } from '../types';
import { getCropAdvisory, getDemandForecast } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { 
  TrendingUp, 
  Leaf, 
  Plus, 
  Info, 
  Star, 
  Clock, 
  RefreshCcw,
  MessageCircle,
  QrCode,
  Building2,
  ArrowRight
} from 'lucide-react';

const FarmerView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [advisory, setAdvisory] = useState<string>('');
  const [produce, setProduce] = useState<Produce[]>([]);
  const [exports, setExports] = useState<FactoryExport[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock farmer ID for demo
  const farmerId = "farmer_rajesh_001";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load AI recommendations
        const adv = await getCropAdvisory('Tomato', 'Andhra Pradesh');
        setAdvisory(adv || '');
        
        // Load Real Data from Supabase
        const [dbProduce, dbExports] = await Promise.all([
          dbService.getProduce(farmerId),
          dbService.getFactoryExports(farmerId)
        ]);
        
        setProduce(dbProduce || []);
        setExports(dbExports || []);
      } catch (err) {
        console.error("Failed to load backend data", err);
        // Fallback to empty if DB fails
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleWasteConversion = async (id: string) => {
    const item = produce.find(p => p.id === id);
    if (!item) return;

    try {
      const newExport: Partial<FactoryExport> = {
        produceName: item.name,
        weight: item.quantity,
        factoryName: 'Partner Eco-Factory',
        status: 'Scheduled',
        creditsEarned: Math.floor(item.quantity * 2.5)
      };

      const savedExport = await dbService.createFactoryExport({ ...newExport, farmerId } as any);
      await dbService.updateProduceStatus(id, 'sold_out');

      setExports(prev => [savedExport, ...prev]);
      setProduce(prev => prev.map(p => p.id === id ? { ...p, status: 'sold_out' } : p));
      alert("Export Request Created & Persisted to Backend!");
    } catch (err) {
      alert("Backend error during export creation.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-emerald-600 font-bold">
      <RefreshCcw className="animate-spin mr-2" /> Connecting to FarmSethu Cloud...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display">Welcome, Farmer Rajesh</h1>
              <p className="text-sm text-gray-500">Connected to Real-time Backend</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm">
                <Star size={16} className="fill-current" />
                Trust: 4.8
              </div>
              <button className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
                <QrCode size={16} /> My QR
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Income" value="₹12,450" icon={<TrendingUp className="text-emerald-600"/>} trend="+12%" />
            <StatCard label="Waste Exported" value={`${exports.reduce((acc, curr) => acc + curr.weight, 0)} kg`} icon={<Building2 className="text-orange-600"/>} trend="Lifetime" />
            <StatCard label="Factory Credits" value={`${exports.reduce((acc, curr) => acc + curr.creditsEarned, 0)}`} icon={<RefreshCcw className="text-emerald-600"/>} trend="Redeemable" />
            <StatCard label="Messages" value="5 New" icon={<MessageCircle className="text-blue-600"/>} trend="Active" />
          </div>
        </div>

        <div className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Leaf size={100} />
          </div>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Info className="text-emerald-400" />
            Agri-AI Advisory
          </h3>
          <p className="text-sm leading-relaxed text-emerald-200 line-clamp-6">
            {advisory || "Fetching latest weather and soil data for your crops..."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-6 border-b border-emerald-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Inventory from Cloud</h2>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-md shadow-emerald-200">
                <Plus size={20} /> Add Harvest
              </button>
            </div>
            <div className="divide-y divide-emerald-50">
              {produce.length === 0 ? (
                <div className="p-12 text-center text-gray-400">No produce found in backend. Add your first harvest!</div>
              ) : produce.map((item) => (
                <div key={item.id} className="p-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> Harvested: {item.harvestDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
                      <p className="font-bold text-emerald-600">₹{item.price}/{item.unit}</p>
                    </div>
                    {item.status === 'unsold' ? (
                      <button 
                        onClick={() => handleWasteConversion(item.id)}
                        className="bg-orange-50 text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-orange-100"
                      >
                        <Building2 size={16} /> Export to Factory
                      </button>
                    ) : (
                      <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold capitalize">
                        {item.status === 'sold_out' ? 'Dispatched' : item.status}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-6 border-b border-emerald-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="text-emerald-600" /> Factory Export History
              </h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Produce</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {exports.map((ex) => (
                    <tr key={ex.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-700">{ex.produceName} ({ex.weight}kg)</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ex.factoryName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          ex.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ex.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">+{ex.creditsEarned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; trend?: string }> = ({ label, value, icon, trend }) => (
  <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-emerald-50 rounded-xl">{icon}</div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline justify-between">
      <h4 className="text-xl font-bold text-gray-900">{value}</h4>
      {trend && <span className="text-[10px] text-emerald-600 font-bold">{trend}</span>}
    </div>
  </div>
);

export default FarmerView;
