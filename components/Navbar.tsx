
import React from 'react';
import { UserRole, Language } from '../types';
import { Leaf, User, Globe, LogOut, LayoutDashboard, Search, ShoppingBag, Settings } from 'lucide-react';

interface NavbarProps {
  role: UserRole | null;
  lang: Language;
  setLang: (l: Language) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: (r: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ role, lang, setLang, isLoggedIn, onLogout, onLogin }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onLogout()}>
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-900 tracking-tight font-display hidden sm:block">FarmSethu</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn && (
              <div className="flex gap-4 mr-6 border-r border-emerald-100 pr-6">
                 {role === UserRole.CUSTOMER && (
                   <>
                    <button className="text-gray-600 hover:text-emerald-700 flex items-center gap-1 font-medium"><Search size={18}/> Browse</button>
                    <button className="text-gray-600 hover:text-emerald-700 flex items-center gap-1 font-medium"><ShoppingBag size={18}/> Baskets</button>
                   </>
                 )}
                 {role === UserRole.FARMER && (
                   <>
                    <button className="text-gray-600 hover:text-emerald-700 flex items-center gap-1 font-medium"><LayoutDashboard size={18}/> Dashboard</button>
                    <button className="text-gray-600 hover:text-emerald-700 flex items-center gap-1 font-medium"><Leaf size={18}/> My Produce</button>
                   </>
                 )}
              </div>
            )}

            <button 
              onClick={() => setLang(lang === Language.EN ? Language.TE : Language.EN)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">M. Rajesh</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded">{role}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                 {(Object.values(UserRole)).map((r) => (
                  <button
                    key={r}
                    onClick={() => onLogin(r)}
                    className="text-xs font-bold text-emerald-600 px-3 py-1 hover:bg-emerald-50 rounded"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Right */}
          <div className="md:hidden flex items-center gap-4">
             <button 
                onClick={() => setLang(lang === Language.EN ? Language.TE : Language.EN)}
                className="p-2 text-emerald-700"
              >
                <Globe className="w-5 h-5" />
              </button>
              {isLoggedIn && (
                <button onClick={onLogout} className="p-2 text-gray-500">
                  <LogOut className="w-5 h-5" />
                </button>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
