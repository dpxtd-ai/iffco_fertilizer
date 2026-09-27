import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (officerName: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('nodal104@iffco.gov.in');
  const [password, setPassword] = useState('KendraAdmin@2025');
  const [captchaInput, setCaptchaInput] = useState('7K9M');
  const [captchaCode, setCaptchaCode] = useState('7K9M');
  const [errorMessage, setErrorMessage] = useState('');
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

    setTimeout(() => {
      setIsLoading(false);
      // Validate credentials
      if (
        (userId.toLowerCase() === 'nodal104@iffco.gov.in' || userId.toLowerCase() === 'mrt104' || userId.toLowerCase() === 'admin') &&
        (password === 'KendraAdmin@2025' || password === 'admin')
      ) {
        onLoginSuccess('Dr. Rajesh Sharma');
      } else {
        setErrorMessage('Invalid credentials. Please use the official demo login details provided below.');
      }
    }, 400);
  };

  const handleQuickLogin = () => {
    setUserId('nodal104@iffco.gov.in');
    setPassword('KendraAdmin@2025');
    setCaptchaInput(captchaCode);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('Dr. Rajesh Sharma');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col justify-between select-none">
      {/* Top Govt Bar */}
      <div className="bg-[#1b5e20] text-white text-[11px] font-medium px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between border-b border-green-800">
        <span>रसायन एवं उर्वरक मंत्रालय | Ministry of Chemicals and Fertilizers, Govt. of India</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-green-300" />
            Toll Free Helpline: 1800 180 1551
          </span>
          <span>|</span>
          <span className="text-green-200">DBT POS Secure Gateway v4.2</span>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          {/* Official IFFCO & Portal Header */}
          <div className="text-center space-y-2">
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
              IFFCO Central Fertilizer Distribution System • POS Kendra Login
            </p>
          </div>

          {/* Credentials Card (Requested by user) */}
          <div className="bg-amber-50/90 border border-amber-300/90 rounded-xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-800" />
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  Authorized Admin Credentials (प्रशासनिक क्रेडेंशियल्स)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                Official Demo Access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-white/90 p-3 rounded-lg border border-amber-200">
              <div>
                <p className="text-[10.5px] text-stone-500 font-medium">User ID / Officer Email:</p>
                <p className="font-mono font-black text-stone-900 text-[11.5px] select-all">
                  nodal104@iffco.gov.in
                </p>
                <p className="text-[9.5px] text-stone-400 font-mono">(or User ID: <strong>MRT104</strong>)</p>
              </div>
              <div>
                <p className="text-[10.5px] text-stone-500 font-medium">Password:</p>
                <p className="font-mono font-black text-stone-900 text-[11.5px] select-all">
                  KendraAdmin@2025
                </p>
                <p className="text-[9.5px] text-stone-400 font-mono">(or: <strong>admin</strong>)</p>
              </div>
              <div className="col-span-2 pt-1 border-t border-amber-100 flex justify-between text-[11px] text-stone-600">
                <span><strong>Role:</strong> Nodal Officer (Dr. Rajesh Sharma)</span>
                <span><strong>Station:</strong> Meerut Depot #104</span>
              </div>
            </div>

            {/* Quick 1-click button */}
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full bg-[#1b5e20] hover:bg-[#144919] text-white py-2 px-3 rounded-md text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ 1-Click Instant Login as Dr. Rajesh Sharma</span>
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-stone-900 border-b border-stone-100 pb-2">
              Kendra Official Sign In / केंद्र अधिकारी लॉगिन
            </h2>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  User ID / Officer Email (अधिकारी ईमेल / आईडी)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    placeholder="nodal104@iffco.gov.in"
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
                  Security Captcha Verification (सुरक्षा कोड)
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
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Kendra Portal / पोर्टल में प्रवेश करें'}
              </button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>NIC Secure Node #402 • UIDAI e-KYC Vault Protected</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-100 border-t border-stone-200 text-stone-500 text-[11px] py-3 text-center">
        © 2024 Department of Fertilizers, Ministry of Chemicals & Fertilizers, Govt. of India.
      </footer>
    </div>
  );
};
