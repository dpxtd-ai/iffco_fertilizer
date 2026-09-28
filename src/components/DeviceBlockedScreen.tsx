import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  PhoneCall, 
  RefreshCw 
} from 'lucide-react';

interface DeviceBlockedScreenProps {
  detectedMac: string;
  onAuthorizeDevice: (deviceName: string) => void;
  onResetToDefaultMac: () => void;
}

export const DeviceBlockedScreen: React.FC<DeviceBlockedScreenProps> = ({
  detectedMac,
  onAuthorizeDevice,
  onResetToDefaultMac,
}) => {
  const [adminUser, setAdminUser] = useState('admin@iffco.gov.in');
  const [adminPassword, setAdminPassword] = useState('');
  const [deviceName, setDeviceName] = useState('Authorized Workstation');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAuthorizing(true);

    setTimeout(() => {
      setIsAuthorizing(false);
      // Validate admin credentials
      if (
        (adminUser.toLowerCase() === 'admin@iffco.gov.in' ||
         adminUser.toLowerCase() === 'nodal104@iffco.gov.in' ||
         adminUser.toLowerCase() === 'admin') &&
        (adminPassword === 'Admin@Kendra2025#' ||
         adminPassword === 'KendraAdmin@2025' ||
         adminPassword === 'admin')
      ) {
        onAuthorizeDevice(deviceName);
      } else {
        setErrorMsg('Invalid administrative credentials. Only authorized Kendra Nodal Officers can whitelist hardware MAC addresses.');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#18201a] text-stone-200 flex flex-col justify-between select-none">
      {/* Top Govt Security Ribbon */}
      <div className="bg-[#0f1712] border-b border-red-900/60 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-red-400 font-bold tracking-wide">
          <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
          <span>NIC FERTILIZER DBT SECURITY GATEWAY • HARDWARE POLICY ENFORCEMENT</span>
        </div>
        <div className="text-stone-400 flex items-center gap-2">
          <span>Security Protocol: Layer-2 IEEE 802.3 MAC Filter</span>
          <span>|</span>
          <span className="text-red-400 font-mono font-bold">NODE #402 STATUS: BLOCKED</span>
        </div>
      </div>

      {/* Main Locked Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-[#1e2820] border-2 border-red-600/80 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-red-950/80 border-b border-red-800/80 p-5 text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-red-900/90 text-red-200 flex items-center justify-center mx-auto mb-2 border border-red-500 shadow-md">
              <Lock className="w-6 h-6 text-red-300" />
            </div>
            <h1 className="text-xl font-black text-red-100 tracking-tight">
              HARDWARE DEVICE ACCESS RESTRICTED
            </h1>
            <p className="text-xs text-red-300/90 font-medium">
              403 Forbidden: System Network Interface Card (MAC) Not Whitelisted
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Detected MAC details */}
            <div className="bg-black/40 border border-stone-700/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 font-bold uppercase tracking-wider">
                <span>Detected Client Hardware MAC Address</span>
                <span className="text-red-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  Unregistered Hardware
                </span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black tracking-widest text-amber-300 text-center py-1 bg-black/60 rounded border border-stone-800">
                {detectedMac}
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                Under PM-PRANAM Cyber Standards, access to subsidized fertilizer registers is strictly bound to approved physical MAC addresses. Even if this workstation possesses valid IP addresses or URLs, access is blocked until registered.
              </p>
            </div>

            {/* Admin Override & Authorization Form */}
            <div className="bg-[#243328] border border-emerald-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  Admin Master Override: Whitelist This Device
                </h3>
              </div>

              <p className="text-[11px] text-stone-300">
                If you are a Kendra Administrator, enter your administrative credentials below to whitelist this MAC address immediately.
              </p>

              {errorMsg && (
                <div className="bg-red-950 border border-red-700 text-red-200 px-3 py-2 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleAuthorize} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">
                      Admin Email / ID
                    </label>
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      required
                      placeholder="admin@iffco.gov.in"
                      className="w-full bg-black/40 border border-stone-600 rounded px-2.5 py-1.5 text-stone-100 font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-bold mb-1">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      placeholder="Admin@Kendra2025#"
                      className="w-full bg-black/40 border border-stone-600 rounded px-2.5 py-1.5 text-stone-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Label This Hardware Device
                  </label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    required
                    placeholder="e.g. Meerut Nodal Terminal #1"
                    className="w-full bg-black/40 border border-stone-600 rounded px-2.5 py-1.5 text-stone-100 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isAuthorizing}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{isAuthorizing ? 'Authenticating...' : 'Authorize & Whitelist System MAC'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onResetToDefaultMac}
                    className="bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold py-2 px-3 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Switch to previously registered primary MAC address"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset MAC</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Assistance */}
          <div className="bg-[#141b16] px-6 py-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              IFFCO Nodal Tech Support: 1800 180 1551 (ext. 8831)
            </span>
            <span className="font-mono text-[10px] text-stone-500">
              Auth Rule: NIC-MAC-WL-2025
            </span>
          </div>
        </div>
      </div>

      <div className="py-2 text-center text-[10.5px] text-stone-500">
        Department of Fertilizers, Ministry of Chemicals & Fertilizers, Govt. of India.
      </div>
    </div>
  );
};
