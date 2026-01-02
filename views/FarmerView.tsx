
import React, { useState, useEffect } from 'react';
import { Language, FactoryExport, Produce, Farmer } from '../types';
import { getCropAdvisory } from '../services/geminiService';
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
  AlertTriangle,
  ArrowRight,
  Truck,
  Recycle,
  CheckCircle2,
  Activity,
  CloudRain,
  BarChart3,
  Waves
} from 'lucide-react';

const FarmerView: React.FC<{ lang: Language }> = ({ lang }) => {
  const [advisory, setAdvisory] = useState<string>('');
  const [produce, setProduce] = useState<Produce[]>([]);
  const [exports, setExports] = useState<FactoryExport[]>([]);
  const [profile, setProfile] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'waste' | 'impact'>('inventory');

  const farmerId = "farmer_001";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [adv, dbProduce, dbExports, dbProfile] = await Promise.all([
          getCropAdvisory('Tomato', 'Andhra Pradesh'),
          dbService.getProduce(farmerId),
          dbService.getFactoryExports(farmerId),
          dbService.getFarmerProfile(farmerId)
        ]);
        
        setAdvisory(adv || '');
        setProduce(dbProduce || []);
        setExports(dbExports || []);
        setProfile(dbProfile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const markStatus = async (id: string, status: Produce['status']) => {
    try {
      await dbService.updateProduceStatus(id, status);
      setProduce(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (err) {
      alert("Error / లోపం");
    }
  };

  const scheduleExport = async (item: Produce) => {
    try {
      const co2Factor = 1.5;
      const compostFactor = 0.3;
      const newExport: Partial<FactoryExport> = {
        farmerId,
        produceName: item.name,
        produceNameTe: item.nameTe,
        weight: item.quantity,
        factoryName: 'Village Compost Hub',
        status: 'Scheduled',
        creditsEarned: Math.floor(item.quantity * 3.5),
        category: 'Fertilizer',
        pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        co2OffsetKg: item.quantity * co2Factor,
        compostYieldKg: item.quantity * compostFactor
      };

      await dbService.createFactoryExport(newExport);
      await dbService.updateProduceStatus(item.id, 'sold_out');

      setProduce(prev => prev.map(p => p.id === item.id ? { ...p, status: 'sold_out' } : p));
      
      if (profile) {
        setProfile({
          ...profile,
          wasteReducedKg: profile.wasteReducedKg + item.quantity,
          co2SavedKg: profile.co2SavedKg + (item.quantity * co2Factor),
          compostGeneratedKg: (profile.compostGeneratedKg || 0) + (item.quantity * compostFactor),
          fertilizerCredits: profile.fertilizerCredits + (item.quantity * 3.5)
        });
      }
      alert(`Pickup scheduled! Credits earned: ${Math.floor(item.quantity * 3.5)} / పికప్ షెడ్యూల్ చేయబడింది!`);
    } catch (err) {
      alert("Error / లోపం");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-emerald-600 font-bold">
      <RefreshCcw className="animate-spin mr-2" /> Syncing Farm... / ఫామ్ సింక్ అవుతోంది...
    </div>
  );

  const spoiledOrUnsold = produce.filter(p => p.status === 'spoiled' || p.status === 'unsold');
  const availableHarvests = produce.filter(p => p.status === 'available');

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display">Namaste, {profile?.name} / నమస్తే, {profile?.nameTe}</h1>
              <p className="text-sm text-gray-500 font-medium">Managing: {profile?.farmName} / {profile?.farmNameTe}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs">
                <Star size={14} className="fill-current" /> Trust: {profile?.trustScore} / నమ్మకం
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Income / ఆదాయం" value="₹12.4k" icon={<TrendingUp className="text-emerald-600"/>} />
            <StatCard label="Credits / క్రెడిట్స్" value={`${Math.floor(profile?.fertilizerCredits || 0)}`} icon={<RefreshCcw className="text-emerald-600"/>} />
            <StatCard label="Waste Saved / వృధా నివారణ" value={`${profile?.wasteReducedKg} kg`} icon={<Recycle className="text-orange-600"/>} />
            <StatCard label="Impact / ప్రభావం" value={`${Math.round(profile?.co2SavedKg || 0)} CO₂`} icon={<CloudRain className="text-blue-600"/>} />
          </div>
        </div>

        <div className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Leaf size={100} />
          </div>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Info className="text-emerald-400" /> AI Advisory / ఏఐ సలహా
          </h3>
          <p className="text-sm leading-relaxed text-emerald-200 line-clamp-6 italic">
            {advisory || "Loading recommendations... / సిఫార్సులు లోడ్ అవుతున్నాయి..."}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100">
        <TabButton id="inventory" label="Inventory / నిల్వ" icon={<Leaf size={18}/>} active={activeTab} onClick={setActiveTab} />
        <TabButton id="waste" label="Waste Loop / వృధా నిర్వహణ" icon={<Recycle size={18}/>} active={activeTab} onClick={setActiveTab} badge={spoiledOrUnsold.length} />
        <TabButton id="impact" label="Impact / ప్రభావం" icon={<Activity size={18}/>} active={activeTab} onClick={setActiveTab} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Inventory */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden animate-in slide-in-from-left-4">
              <div className="p-6 border-b border-emerald-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Live Harvests / తాజా పంటలు</h2>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex flex-col items-center shadow-md">
                  <span className="flex items-center gap-2 text-sm font-bold"><Plus size={18} /> Add New</span>
                  <span className="text-[9px] opacity-70">కొత్తది చేర్చండి</span>
                </button>
              </div>
              <div className="divide-y divide-emerald-50">
                {availableHarvests.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold overflow-hidden border border-emerald-100">
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name} / {item.nameTe}</h4>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest"><Clock size={12} /> Harvested {item.harvestDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
                        <p className="font-bold text-emerald-600">₹{item.price}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => markStatus(item.id, 'unsold')} className="p-2 text-orange-400 hover:text-orange-600" title="Flag Unsold">
                           <AlertTriangle size={18} />
                        </button>
                        <button onClick={() => markStatus(item.id, 'spoiled')} className="p-2 text-red-400 hover:text-red-600" title="Flag Spoiled">
                           <Recycle size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waste Loop */}
          {activeTab === 'waste' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-orange-50 p-6 rounded-3xl border border-orange-200 flex items-center gap-6">
                <div className="p-4 bg-orange-600 text-white rounded-2xl"><Recycle size={32} /></div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-orange-900">Green Loop: Waste to Credits / వ్యర్థాల నుండి క్రెడిట్స్</h3>
                  <p className="text-sm text-orange-800/70">Convert spoiled produce into fertilizer and earn credits for your next sowing season.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="p-6 border-b border-orange-50 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">End-of-Day Roundup / రోజువారీ సమీక్ష</h2>
                  <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">Surplus Buffer</div>
                </div>
                <div className="divide-y divide-orange-50">
                  {spoiledOrUnsold.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 italic">No waste in buffer! / వ్యర్థాలు ఏమీ లేవు!</div>
                  ) : spoiledOrUnsold.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${item.status === 'spoiled' ? 'bg-red-500' : 'bg-orange-500'}`}>
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <span className="text-[10px] font-bold uppercase text-orange-600">{item.status}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => scheduleExport(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex flex-col items-center"
                      >
                        <span>Convert to Fertilizer</span>
                        <span className="text-[9px] opacity-70">ఎరువుగా మార్చండి</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Impact Dashboard */}
          {activeTab === 'impact' && (
            <div className="space-y-6 animate-in zoom-in duration-300">
               <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <CloudRain className="absolute top-[-20px] right-[-20px] w-64 h-64 opacity-10" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-display font-bold">Green Impact / పర్యావరణ ప్రభావం</h2>
                        <p className="text-blue-100 text-sm max-w-sm">Diverting methane from landfills and restoring soil health. / మీ వల్ల గ్రామంలో పర్యావరణం మెరుగుపడుతోంది.</p>
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="text-center">
                           <p className="text-5xl font-bold">{Math.round(profile?.co2SavedKg || 0)}</p>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-2">kg CO₂ Offset</p>
                        </div>
                        <div className="text-center">
                           <p className="text-5xl font-bold">{profile?.compostGeneratedKg}</p>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-2">kg Compost / ఎరువు</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-[2rem] text-white shadow-xl">
            <Recycle className="mb-4 opacity-50" size={40} />
            <h3 className="text-xl font-bold mb-2">Redeem Credits / క్రెడిట్స్ వాడండి</h3>
            <p className="text-sm text-orange-50/80 mb-6 italic font-medium">Use your credits to buy premium organic fertilizer from the factory. / మీ క్రెడిట్స్‌తో ఎరువులు కొనుక్కోండి.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span>Available Credits</span>
                <span className="font-bold text-lg">{Math.floor(profile?.fertilizerCredits || 0)}</span>
              </div>
              <button className="w-full py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors">
                Order Fertilizer / ఎరువులు ఆర్డర్ చేయండి
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-emerald-50 rounded-xl">{icon}</div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
    <h4 className="text-xl font-bold text-gray-900">{value}</h4>
  </div>
);

const TabButton: React.FC<{ id: string; label: string; icon: React.ReactNode; active: string; onClick: (id: any) => void; badge?: number }> = ({ id, label, icon, active, onClick, badge }) => (
  <button 
    onClick={() => onClick(id)}
    className={`pb-4 px-2 font-bold transition-all flex items-center gap-2 ${active === id ? 'text-emerald-700 border-b-4 border-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon} 
    <span className="text-sm">{label}</span>
    {badge ? <span className="px-1.5 py-0.5 bg-orange-500 text-white rounded-full text-[10px] animate-pulse">{badge}</span> : null}
  </button>
);

export default FarmerView;
