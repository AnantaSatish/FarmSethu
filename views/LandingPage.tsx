
import React from 'react';
import { UserRole } from '../types';
import { Leaf, Users, ShieldCheck, Map, ArrowRight, ShoppingCart as CartIcon, Recycle, CloudRain, BarChart3, TrendingUp } from 'lucide-react';

interface LandingProps {
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="space-y-20 pb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover grayscale" 
            alt="Farming Background" 
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl px-4 text-center space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30 text-emerald-300 text-sm font-bold tracking-widest uppercase animate-bounce">
             <Leaf size={16}/> Reimagining Farm-to-Table / వ్యవసాయాభివృద్ధి కొత్త పద్ధతి
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
             FarmSethu <br/> <span className="text-emerald-400 italic font-medium underline decoration-emerald-500/30">Local Farmers, Local Futures</span>
           </h1>
           <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto font-light leading-relaxed">
             Direct marketplace connecting you to fresh village harvests. / మీరు నేరుగా గ్రామ రైతులతో అనుసంధానం అయ్యే తాజా కూరగాయల మార్కెట్.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <button 
              onClick={() => onLogin(UserRole.CUSTOMER)}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex flex-col items-center"
             >
               <span>Order Now <ArrowRight size={20} className="inline ml-1"/></span>
               <span className="text-[10px] opacity-70">ఇప్పుడే ఆర్డర్ చేయండి</span>
             </button>
             <button 
               onClick={() => onLogin(UserRole.FARMER)}
               className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl text-lg border border-white/20 transition-all flex flex-col items-center"
             >
               <span>For Farmers</span>
               <span className="text-[10px] opacity-70">రైతుల కోసం</span>
             </button>
           </div>
        </div>
      </section>

      {/* NEW: Green Loop Waste Management Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-emerald-900 rounded-[3rem] overflow-hidden shadow-2xl relative border border-emerald-800">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Recycle size={300} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 md:p-16 space-y-8 relative z-10">
              <div className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                Circular Waste Hub / వ్యర్థాల నిర్వహణ కేంద్రం
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                Green Loop: Nothing Goes to Waste <br/> <span className="text-emerald-400 italic">గ్రీన్ లూప్: ఏదీ వృధా కాదు</span>
              </h2>
              <p className="text-emerald-100/70 text-lg leading-relaxed italic">
                Our ecosystem converts unsold harvests into organic fertilizer, closing the loop of village agriculture. / మా వ్యవస్థ అమ్ముడుపోని పంటను సేంద్రియ ఎరువుగా మారుస్తుంది.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-800 rounded-2xl text-emerald-400">
                    <Recycle size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Unsold Conversion</h4>
                    <p className="text-emerald-200/60 text-[10px] font-bold uppercase">వృధా నుండి ఎరువుగా మార్పు</p>
                    <p className="text-emerald-200/60 text-sm">Automated routing to compost centers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-800 rounded-2xl text-emerald-400">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Farmer Credits</h4>
                    <p className="text-emerald-200/60 text-[10px] font-bold uppercase">రైతులకు క్రెడిట్స్</p>
                    <p className="text-emerald-200/60 text-sm">Earn fertilizer credits for every kg saved.</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => onLogin(UserRole.AGENT)}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center gap-2"
                >
                  View Impact Dashboard / ఇంపాక్ట్ డాష్‌బోర్డ్ <BarChart3 size={20} />
                </button>
              </div>
            </div>

            <div className="bg-emerald-800/50 backdrop-blur-sm p-10 md:p-16 flex flex-col justify-center space-y-12">
              <div className="space-y-4">
                <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Community Impact / సమాజంపై ప్రభావం</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-emerald-900/50 p-6 rounded-3xl border border-emerald-700/50 text-center space-y-2">
                    <p className="text-4xl font-bold text-white">4.2T</p>
                    <p className="text-emerald-300 text-[10px] font-bold uppercase">Waste Saved / వృధా నివారణ</p>
                  </div>
                  <div className="bg-emerald-900/50 p-6 rounded-3xl border border-emerald-700/50 text-center space-y-2">
                    <p className="text-4xl font-bold text-white">1,200kg</p>
                    <p className="text-emerald-300 text-[10px] font-bold uppercase">Compost / ఎరువు తయారీ</p>
                  </div>
                  <div className="bg-emerald-900/50 p-6 rounded-3xl border border-emerald-700/50 text-center space-y-2">
                    <p className="text-4xl font-bold text-white">6.8k kg</p>
                    <p className="text-emerald-300 text-[10px] font-bold uppercase">CO₂ Saved / కార్బన్ తగ్గింపు</p>
                  </div>
                  <div className="bg-emerald-900/50 p-6 rounded-3xl border border-emerald-700/50 text-center space-y-2">
                    <p className="text-4xl font-bold text-white">₹85k</p>
                    <p className="text-emerald-300 text-[10px] font-bold uppercase">Credits / క్రెడిట్స్ విలువ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold text-emerald-950 mb-16">Ecosystem Roles / వ్యవస్థలోని పాత్రలు</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <RoleCard role={UserRole.FARMER} title="Farmer / రైతు" icon={<Leaf/>} desc="Sell fresh crops & manage waste." onLogin={onLogin} />
            <RoleCard role={UserRole.CUSTOMER} title="Consumer / వినియోగదారుడు" icon={<CartIcon/>} desc="Buy fresh & local produce." onLogin={onLogin} />
            <RoleCard role={UserRole.AGENT} title="Coordinator / ప్రతినిధి" icon={<Users/>} desc="Manage cluster logistics." onLogin={onLogin} />
            <RoleCard role={UserRole.ADMIN} title="Admin / అడ్మిన్" icon={<ShieldCheck/>} desc="Global platform governance." onLogin={onLogin} />
          </div>
        </div>
      </section>
    </div>
  );
};

const RoleCard: React.FC<{ role: UserRole; title: string; icon: React.ReactNode; desc: string; onLogin: (r: UserRole) => void }> = ({ role, title, icon, desc, onLogin }) => (
  <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 hover:shadow-xl transition-all cursor-pointer group" onClick={() => onLogin(role)}>
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-6 mx-auto group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-emerald-900 mb-2">{title}</h3>
    <p className="text-sm text-emerald-800/60 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
