
import React, { useState, useEffect } from 'react';
import { UserRole, Language } from './types';
import Navbar from './components/Navbar';
import FarmerView from './views/FarmerView';
import CustomerView from './views/CustomerView';
import AgentView from './views/AgentView';
import AdminView from './views/AdminView';
import LandingPage from './views/LandingPage';
import AuthView from './views/AuthView';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setRole(currentUser.user_metadata?.role as UserRole);
        setIsLoggedIn(true);
      }
    };
    checkSession();
  }, []);

  const handleRoleSelection = (r: UserRole) => {
    setSelectedRole(r);
    setShowAuth(true);
  };

  const handleAuthSuccess = (r: UserRole, userData: any) => {
    setUser(userData);
    setRole(r);
    setIsLoggedIn(true);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setRole(null);
    setUser(null);
    setIsLoggedIn(false);
    setShowAuth(false);
  };

  const renderView = () => {
    if (showAuth && selectedRole) {
      return (
        <AuthView 
          role={selectedRole} 
          onBack={() => setShowAuth(false)} 
          onSuccess={handleAuthSuccess} 
        />
      );
    }

    if (!isLoggedIn) {
      return <LandingPage onLogin={handleRoleSelection} />;
    }

    switch (role) {
      case UserRole.FARMER: return <FarmerView lang={lang} />;
      case UserRole.CUSTOMER: return <CustomerView lang={lang} />;
      case UserRole.AGENT: return <AgentView lang={lang} />;
      case UserRole.ADMIN: return <AdminView lang={lang} />;
      default: return <LandingPage onLogin={handleRoleSelection} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      {!showAuth && (
        <Navbar 
          role={role} 
          lang={lang} 
          setLang={setLang} 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onLogin={handleRoleSelection}
        />
      )}
      <main className="flex-grow">
        {renderView()}
      </main>
      
      {/* Mobile Quick Role Selector - for demo debugging */}
      {!isLoggedIn && !showAuth && (
        <div className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md shadow-xl border border-emerald-100 rounded-2xl p-4 flex flex-col items-center gap-2 z-50 md:hidden">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Select Role To Log In</p>
          <div className="flex gap-2 w-full">
            {(Object.values(UserRole)).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSelection(r)}
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
