
import React, { useState, useEffect } from 'react';
import { UserRole, Language } from './types';
import Navbar from './components/Navbar';
import FarmerView from './views/FarmerView';
import CustomerView from './views/CustomerView';
import AgentView from './views/AgentView';
import AdminView from './views/AdminView';
import LandingPage from './views/LandingPage';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulation of auth state
  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setRole(null);
    setIsLoggedIn(false);
  };

  const renderView = () => {
    switch (role) {
      case UserRole.FARMER: return <FarmerView lang={lang} />;
      case UserRole.CUSTOMER: return <CustomerView lang={lang} />;
      case UserRole.AGENT: return <AgentView lang={lang} />;
      case UserRole.ADMIN: return <AdminView lang={lang} />;
      default: return <LandingPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      <Navbar 
        role={role} 
        lang={lang} 
        setLang={setLang} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      <main className="flex-grow pb-20 md:pb-0">
        {renderView()}
      </main>
      
      {/* Mobile Role Switcher (Demo Only) */}
      {!isLoggedIn && (
        <div className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md shadow-xl border border-emerald-100 rounded-2xl p-4 flex flex-col items-center gap-2 z-50 md:hidden">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Demo: Choose Your View</p>
          <div className="flex gap-2 w-full">
            {(Object.values(UserRole)).map((r) => (
              <button
                key={r}
                onClick={() => handleLogin(r)}
                className="flex-1 py-2 rounded-lg text-[10px] font-bold bg-emerald-600 text-white active:scale-95 transition-transform"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
