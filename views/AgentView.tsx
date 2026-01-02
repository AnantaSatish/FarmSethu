
import React from 'react';
import { Language } from '../types';
import { 
  Users, 
  Truck, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Building2,
  MapPin,
  ArrowUpRight
} from 'lucide-react';

const AgentView: React.FC<{ lang: Language }> = ({ lang }) => {
  const farmers = [
    { id: '1', name: 'Raju G.', village: 'Kuppam', status: 'verified', items: 12 },
    { id: '2', name: 'Srinivas M.', village: 'Kuppam', status: 'pending', items: 0 },
    { id: '3', name: 'Lakshmi K.', village: 'V.Kota', status: 'verified', items: 8 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Village Coordinator Panel</h1>
          <p className="text-gray-500">Managing <span className="font-bold text-emerald-700">Kuppam Cluster</span></p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
            <p className="text-[10px] text-emerald-600 font-bold uppercase">Total Commission</p>
            <p className="text-xl font-bold text-emerald-900">₹4,200</p>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors">
            Register Farmer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Operations */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <AgentStat label="Active Deliveries" value="14" icon={<Truck className="text-blue-600"/>} color="blue" />
             <AgentStat label="Pending Verification" value="03" icon={<ShieldCheck className="text-orange-600"/>} color="orange" />
             <AgentStat label="Factory Exports" value="480kg" icon={<Building2 className="text-purple-600"/>} color="purple" />
          </div>

          {/* Logistics Route Map Mockup */}
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
             <div className="p-6 border-b border-emerald-50 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><MapPin size={20} className="text-emerald-600" /> Active Route: Factory Dispatch</h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase">Truck: AP-32-X-992</span>
             </div>
             <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 relative">
                   <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold z-10">1</div>
                   <div className="flex-grow pb-4 border-b border-gray-100">
                      <p className="font-bold text-sm">Collection Point: Hub A (Kuppam)</p>
                      <p className="text-xs text-gray-500">Completed at 10:00 AM • 120kg Loaded</p>
                   </div>
                   <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-emerald-100 -z-0"></div>
                </div>
                <div className="flex items-center gap-4 relative">
                   <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold z-10">2</div>
                   <div className="flex-grow pb-4 border-b border-gray-100">
                      <p className="font-bold text-sm">Current Status: In-Transit</p>
                      <p className="text-xs text-gray-500">ETA Factory: 4:30 PM</p>
                   </div>
                   <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-dashed bg-gray-100 -z-0"></div>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                   <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">3</div>
                   <div>
                      <p className="font-bold text-sm">Destination: GreenCycle Factory</p>
                      <p className="text-xs text-gray-500">Final Verification & Credit Disbursement</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100">
            <div className="p-6 border-b border-emerald-50 flex justify-between items-center">
               <h3 className="font-bold text-lg">My Farmers</h3>
               <button className="text-emerald-600 text-sm font-bold hover:underline">View Detailed Directory</button>
            </div>
            <div className="divide-y divide-emerald-50">
              {farmers.map(f => (
                <div key={f.id} className="p-4 flex items-center justify-between hover:bg-emerald-50/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center font-bold text-emerald-700">
                      {f.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{f.name}</h4>
                      <p className="text-xs text-gray-500">{f.village} • {f.items} Products listed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${f.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {f.status}
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Waste Management Logistics */}
        <div className="space-y-6">
           <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 space-y-4">
              <h3 className="font-bold text-orange-900 flex items-center gap-2">
                <Clock size={20} /> Daily Waste Roundup
              </h3>
              <p className="text-sm text-orange-800/80">
                Hub A currently has <span className="font-bold text-orange-900">142kg</span> of unsold produce waiting for factory export.
              </p>
              <div className="bg-white p-4 rounded-2xl border border-orange-200 space-y-4">
                <div className="flex justify-between items-center">
                   <p className="text-xs font-bold text-gray-400 uppercase">Selected Factory</p>
                   <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold">GREENCYCLE CO.</span>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-xs font-bold text-gray-400 uppercase">Estimated Credits</p>
                   <span className="text-[10px] text-emerald-600 font-bold">₹3,550 Platform Credits</span>
                </div>
                <button className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95 hover:bg-orange-700">
                  Confirm Factory Dispatch
                </button>
              </div>
           </div>

           <div className="bg-emerald-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-xl mb-4">Circular Economy Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <p className="text-xs text-emerald-300">Total Waste Saved (Monthly)</p>
                    <p className="text-xl font-bold">1.2 Tons</p>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <p className="text-xs text-emerald-300">Farmer Credits Issued</p>
                    <p className="text-xl font-bold">₹12,400</p>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium italic">"FarmSethu is saving over 40% of local produce from landfill."</p>
                </div>
              </div>
              <Building2 className="absolute -bottom-4 -right-4 text-emerald-800 opacity-20" size={100} />
           </div>

           <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-4">Logistics Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-gray-500 font-medium">Collection On-Time Rate</span>
                   <span className="text-xs font-bold text-emerald-600">98%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full w-[98%]"></div>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-gray-500 font-medium">Export Efficiency</span>
                   <span className="text-xs font-bold text-blue-600">92%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-blue-500 h-full w-[92%]"></div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AgentStat: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className={`p-4 rounded-3xl bg-white border border-${color}-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow`}>
     <div className={`p-3 bg-${color}-50 rounded-2xl`}>{icon}</div>
     <div>
       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
       <p className="text-xl font-bold text-gray-900">{value}</p>
     </div>
  </div>
);

export default AgentView;
