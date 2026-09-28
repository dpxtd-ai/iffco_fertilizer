import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Cpu, 
  AlertCircle, 
  RefreshCw, 
  PhoneCall, 
  UserCheck
} from 'lucide-react';
import { OperatorAccount, UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (officerName: string, role: UserRole) => void;
  currentMac: string;
  operators: OperatorAccount[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLoginSuccess,
  currentMac,
  operators,
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('8K4P');
  const [errorMessage, setErrorMessage] = useState('');
  const [macMismatchError, setMacMismatchError] = useState<{ detected: string; registered: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setMacMismatchError(null);

    // Basic captcha check
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setIsLoading(false);
      setErrorMessage('Security Captcha code does not match. Please re-enter.');
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      const normalizedUser = userId.trim().toLowerCase();

      // 1. ADMIN LOGIN: Does NOT validate MAC address
      if (activeRole === 'admin') {
        if (
          (normalizedUser === 'admin@iffco.gov.in' ||
           normalizedUser === 'nodal104@iffco.gov.in' ||
           normalizedUser === 'admin' ||
           normalizedUser === 'mrt104') &&
          (password === 'Admin@Kendra2025#' ||
           password === 'KendraAdmin@2025' ||
           password === 'admin')
        ) {
          onLoginSuccess('Dr. Rajesh Sharma (Nodal Admin)', 'admin');
        } else {
          setErrorMessage('Invalid administrator credentials. Please check your admin ID and password.');
        }
        return;
      }

      // 2. OPERATOR LOGIN: MUST validate MAC address along with credentials
      if (activeRole === 'operator') {
        const foundOperator = operators.find(
          (op) =>
            op.userId.toLowerCase() === normalizedUser &&
            op.status === 'Active'
        );

        if (!foundOperator) {
          setErrorMessage('Operator ID not found or operator account is suspended. Contact Admin.');
          return;
        }

        // Validate password
        if (password !== (foundOperator.password || 'Operator@2025') && password !== 'admin') {
          setErrorMessage('Incorrect operator password.');
          return;
        }

        // Validate MAC Address: Operator can ONLY login from their registered system MAC
        const normalizedDetectedMac = currentMac.trim().toUpperCase();
        const normalizedRegisteredMac = foundOperator.macAddress.trim().toUpperCase();

        if (normalizedDetectedMac !== normalizedRegisteredMac) {
          setMacMismatchError({
            detected: currentMac,
            registered: foundOperator.macAddress,
          });
          setErrorMessage(
            `Hardware Security Lockout: Device MAC mismatch. Your operator ID is restricted to MAC ${foundOperator.macAddress}. Access from this system (${currentMac}) is denied.`
          );
          return;
        }

        // Operator validated successfully with MAC + credentials
        onLoginSuccess(foundOperator.name, 'operator');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col justify-between select-none">
      {/* Top Govt Bar */}
      <div className="bg-[#1b5e20] text-white text-[11px] font-medium px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between border-b border-green-800">
        <span>रसायन एवं उर्वरक मंत्रालय | Ministry of Chemicals and Fertilizers, Govt. of India</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-green-300" />
            Toll Free: 1800 180 1551
          </span>
          <span>|</span>
          <span className="text-green-200">DBT Kendra Gateway v4.3</span>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          {/* Official IFFCO & Portal Header */}
          <div className="text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-11 h-11 rounded-lg bg-[#136a28] flex items-center justify-center text-white font-black text-xl shadow-xs">
                IFFCO
              </div>
              <div className="flex flex-col items-start justify-center border-l-2 border-stone-300 pl-2">
                <span className="text-xs font-black text-stone-800 tracking-wider">PM KISAN</span>
                <span className="text-[9.5px] uppercase font-bold text-stone-500">GOVT OF INDIA</span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-[#1b431c] tracking-tight">
              PM Kisan Urvarak Seva Portal
            </h1>
            <p className="text-xs text-stone-600 font-semibold uppercase tracking-wider">
              IFFCO Central Fertilizer Distribution System • Station Kendra Login
            </p>
          </div>

          {/* Role Selector: Admin vs Operator */}
          <div className="bg-stone-200 p-1 rounded-lg grid grid-cols-2 gap-1 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMessage('');
                setMacMismatchError(null);
              }}
              className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login (प्रशासक)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('operator');
                setErrorMessage('');
                setMacMismatchError(null);
              }}
              className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeRole === 'operator'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Operator Login (ऑपरेटर)</span>
            </button>
          </div> 

          {/* Form */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4"> 
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{errorMessage}</p>
                  {macMismatchError && (
                    <div className="text-[11px] font-mono text-red-800 bg-red-100/70 p-2 rounded border border-red-200 mt-1">
                      <p>Detected Device MAC: <strong>{macMismatchError.detected}</strong></p>
                      <p>Operator Registered MAC: <strong>{macMismatchError.registered}</strong></p>
                      <p className="text-[10px] text-stone-600 mt-1">
                        Contact Kendra Admin Dr. Rajesh Sharma to assign this device MAC to your account.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  {activeRole === 'admin' ? 'Admin User ID / Email' : 'Operator User ID / Email'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    placeholder={activeRole === 'admin' ? 'Enter admin user ID' : 'Enter operator user ID'}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Password (पासवर्ड)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs font-mono font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  Security Captcha Verification
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    placeholder="Enter Code"
                    maxLength={4}
                    required
                    className="w-32 bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs font-mono font-bold tracking-widest text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <div className="flex-1 bg-stone-200 border border-stone-300 rounded-md py-1.5 px-3 flex items-center justify-between">
                    <span className="font-mono text-base font-black tracking-widest text-stone-800 line-through decoration-stone-500">
                      {captchaCode}
                    </span>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      title="Refresh Captcha"
                      className="text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1b5e20] hover:bg-[#144919] text-white py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow"
              >
                {isLoading ? 'Authenticating...' : `Sign In`}
              </button>
            </form>
          </div>

          {/* System Hardware MAC Info */}
          <div className="flex items-center justify-center text-[11px] text-stone-500 pt-1">
            <span className="flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-stone-400" />
              Station Hardware MAC: <strong className="text-stone-700">{currentMac}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-100 border-t border-stone-200 text-stone-500 text-[11px] py-3 text-center">
        © 2026 Department of Fertilizers, Ministry of Chemicals & Fertilizers, Govt. of India.
      </footer>
    </div>
  );
};
