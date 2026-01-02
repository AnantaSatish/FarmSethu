
import React, { useState } from 'react';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { 
  Leaf, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Loader2, 
  AlertCircle, 
  Phone, 
  Smartphone, 
  Key, 
  Hash, 
  ShieldCheck, 
  MapPin, 
  Home,
  Map as MapIcon
} from 'lucide-react';

interface AuthViewProps {
  role: UserRole;
  onBack: () => void;
  onSuccess: (role: UserRole, user: any) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ role, onBack, onSuccess }) => {
  const isPhoneAuth = role === UserRole.FARMER || role === UserRole.CUSTOMER;
  
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'input' | 'otp'>('input'); // For phone auth
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (step === 'input') {
        // Validation for phone (basic)
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        const { error: otpError } = await authService.signInWithPhone(formattedPhone);
        if (otpError) throw otpError;
        setStep('otp');
      } else {
        // Verify OTP
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        
        const metadata: Record<string, any> = {};
        if (!isLogin) {
          metadata.role = role;
          metadata.full_name = name;
          metadata.district = district;
          metadata.state = stateName;
          metadata.pincode = pincode;
          
          if (role === UserRole.FARMER) {
            metadata.aadhar_number = aadharNumber;
            metadata.survey_number = surveyNumber;
            metadata.village = village;
          } else if (role === UserRole.CUSTOMER) {
            metadata.address = address;
          }
        }

        const { data, error: verifyError } = await authService.verifyPhoneOtp(
          formattedPhone, 
          otp, 
          !isLogin ? metadata : undefined
        );
        if (verifyError) throw verifyError;
        
        const userRole = data.user?.user_metadata?.role || role;
        onSuccess(userRole, data.user);
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: signInError } = await authService.signIn(email, password);
        if (signInError) throw signInError;
        const userRole = data.user?.user_metadata?.role || role;
        onSuccess(userRole, data.user);
      } else {
        const { data, error: signUpError } = await authService.signUp(email, password, role, name);
        if (signUpError) throw signUpError;
        onSuccess(role, data.user);
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (role) {
      case UserRole.FARMER: return 'emerald';
      case UserRole.AGENT: return 'blue';
      case UserRole.ADMIN: return 'purple';
      default: return 'emerald';
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className={`absolute -top-24 -left-24 w-96 h-96 bg-${theme}-200/30 rounded-full blur-3xl animate-pulse`}></div>
      <div className={`absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl animate-pulse delay-700`}></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-10 relative z-10 max-h-[95vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={step === 'otp' ? () => setStep('input') : onBack}
          className="absolute left-6 top-8 p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-50"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-8 space-y-4">
          <div className={`mx-auto w-16 h-16 bg-${theme}-600 rounded-2xl flex items-center justify-center shadow-lg shadow-${theme}-200 animate-in zoom-in duration-500`}>
            {step === 'otp' ? <Key className="text-white" size={32} /> : <Leaf className="text-white" size={32} />}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-display">
              {step === 'otp' ? 'Verify OTP' : `${role} ${isLogin ? 'Login' : 'Join'}`}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {step === 'otp' 
                ? `Enter the 6-digit code sent to ${phone}` 
                : isPhoneAuth ? 'Access your account via Phone' : 'Access your account via Email'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-2">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={isPhoneAuth ? handlePhoneSubmit : handleEmailSubmit} className="space-y-4">
          {/* Registration Fields */}
          {!isLogin && step === 'input' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="E.g. Rajesh Kumar"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {role === UserRole.FARMER && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Village Name</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="E.g. Kuppam"
                      required
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {role === UserRole.CUSTOMER && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Home Address</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-3 text-slate-400" size={18} />
                    <textarea 
                      placeholder="Street, House No, Landmark"
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Shared District, State and Pincode fields for both roles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">District</label>
                  <div className="relative">
                    <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="E.g. Chittoor"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">State</label>
                  <div className="relative">
                    <GlobeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="E.g. AP"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Pincode</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="E.g. 517425"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {role === UserRole.FARMER && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Aadhar Number</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="12-digit number"
                        required
                        maxLength={12}
                        value={aadharNumber}
                        onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Survey No.</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="E.g. 102/A-1"
                        required
                        value={surveyNumber}
                        onChange={(e) => setSurveyNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {isPhoneAuth ? (
            /* Phone + OTP Flow */
            step === 'input' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    placeholder="98765 43210"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">OTP Code</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="123456"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium tracking-[0.5em] text-center text-xl"
                  />
                </div>
                <div className="text-right px-1">
                  <button type="button" onClick={() => setStep('input')} className="text-xs font-bold text-emerald-600 hover:underline">Change Number?</button>
                </div>
              </div>
            )
          ) : (
            /* Email + Password Flow (Admin/Agent) */
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@farmsethu.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  {isLogin && <button type="button" className="text-[10px] font-bold text-emerald-600 hover:underline uppercase">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 mt-4`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              step === 'otp' ? 'Verify & Continue' : (isLogin ? 'Sign In' : 'Create Account')
            )}
          </button>
        </form>

        {step === 'input' && (
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="ml-2 font-bold text-emerald-600 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple globe icon replacement for consistency, updated to accept size prop
const GlobeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

export default AuthView;
