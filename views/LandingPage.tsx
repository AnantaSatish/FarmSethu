
import React from 'react';
import { UserRole } from '../types';
import { Leaf, Users, ShieldCheck, Map, ArrowRight, ShoppingCart as CartIcon } from 'lucide-react';

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
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover grayscale" 
            alt="Farming Background" 
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl px-4 text-center space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30 text-emerald-300 text-sm font-bold tracking-widest uppercase animate-bounce">
             <Leaf size={16}/> Reimagining Farm-to-Table
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
             FarmSethu <br/> <span className="text-emerald-400 italic font-medium">Local Farmers, Local Futures</span>
           </h1>
           <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto font-light leading-relaxed">
             A hyper-local ecosystem where farmers thrive, waste is minimized, and your food is harvested only after you order it.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <button 
              onClick={() => onLogin(UserRole.CUSTOMER)}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               Start Ordering <ArrowRight size={20}/>
             </button>
             <button 
               onClick={() => onLogin(UserRole.FARMER)}
               className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl text-lg border border-white/20 transition-all flex items-center justify-center gap-2"
             >
               For Farmers
             </button>
           </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <Pillar 
          icon={<ShieldCheck className="w-12 h-12 text-emerald-600"/>} 
          title="Verified Trust" 
          desc="Every farmer on FarmSethu undergoes strict ID and farm verification to ensure the highest standards." 
        />
        <Pillar 
          icon={<Map className="w-12 h-12 text-emerald-600"/>} 
          title="Hyper-Local" 
          desc="We connect you with farms within a 10km radius, reducing carbon footprint and supporting your village." 
        />
        <Pillar 
          icon={<Users className="w-12 h-12 text-emerald-600"/>} 
          title="Circular Economy" 
          desc="Unsold produce is converted into organic fertilizer, creating a zero-waste ecosystem for sustainable growth." 
        />
      </section>

      {/* User Roles Preview */}
      <section className="bg-emerald-50 py-24 rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-emerald-950 mb-4">Empowering the Entire Ecosystem</h2>
          <p className="text-emerald-800/60 mb-16 max-w-xl mx-auto">Different roles working together for a healthier, more sustainable community.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <RoleCard role={UserRole.FARMER} icon={<Leaf />} desc="Direct-to-consumer sales, AI advisory, and fertilizer credits." onLogin={onLogin}/>
            <RoleCard role={UserRole.CUSTOMER} icon={<CartIcon />} desc="Fresh harvests, subscriptions, and local discovery." onLogin={onLogin}/>
            <RoleCard role={UserRole.AGENT} icon={<Users />} desc="Village-level logistics and farmer coordination." onLogin={onLogin}/>
            <RoleCard role={UserRole.ADMIN} icon={<ShieldCheck />} desc="Platform governance and data-driven sustainability." onLogin={onLogin}/>
          </div>
        </div>
      </section>
    </div>
  );
};

const Pillar: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="space-y-4 p-8 rounded-3xl hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all group">
    <div className="flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold text-emerald-950">{title}</h3>
    <p className="text-emerald-800/60 leading-relaxed text-sm">{desc}</p>
  </div>
);

const RoleCard: React.FC<{ role: UserRole; icon: React.ReactNode; desc: string; onLogin: (r: UserRole) => void }> = ({ role, icon, desc, onLogin }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-100 hover:border-emerald-500 transition-all text-left flex flex-col h-full group">
    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 mb-6 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-emerald-950 mb-2">{role}</h4>
    <p className="text-emerald-800/60 text-sm flex-grow mb-6">{desc}</p>
    <button 
      onClick={() => onLogin(role)}
      className="text-emerald-600 font-bold text-sm hover:translate-x-1 transition-transform flex items-center gap-2"
    >
      Log in as {role} <ArrowRight size={14}/>
    </button>
  </div>
);

export default LandingPage;
