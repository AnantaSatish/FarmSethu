
import React from 'react';
import { Language } from '../types';
import { 
  BarChart, 
  Users, 
  Map, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Farmers', value: 450 },
  { name: 'Agents', value: 85 },
  { name: 'Customers', value: 2400 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

const AdminView: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 font-display">Global Admin Dashboard</h1>
        <div className="flex gap-2">
           <button className="p-2 bg-white rounded-xl border border-gray-100 text-gray-500 hover:text-emerald-600"><Settings size={20}/></button>
           <button className="p-2 bg-white rounded-xl border border-gray-100 text-gray-500 hover:text-emerald-600"><FileText size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total GMV" value="₹1.2M" trend="+14%" icon={<TrendingUp className="text-emerald-500"/>} />
        <MetricCard label="Active Users" value="2,935" trend="+204" icon={<Users className="text-blue-500"/>} />
        <MetricCard label="Waste Reduction" value="4.2 Tons" trend="+0.5T" icon={<Activity className="text-orange-500"/>} />
        <MetricCard label="Platform Earnings" value="₹85,200" trend="+8%" icon={<IndianRupee className="text-purple-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-lg mb-6">User Distribution</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-8">
              {data.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-xs text-gray-500 font-medium">{d.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Verification Queue */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Verification Queue</h3>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold">12 PENDING</span>
           </div>
           <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">F</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Farmer Application #{i}82</p>
                      <p className="text-[10px] text-gray-400">Received 2 hours ago</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg">Approve</button>
                    <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold rounded-lg">Review</button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode }> = ({ label, value, trend, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
      <span className="text-xs font-bold text-emerald-600">{trend}</span>
    </div>
    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const IndianRupee = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>
);

export default AdminView;
