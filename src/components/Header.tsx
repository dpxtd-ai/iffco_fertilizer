import React from 'react';
import { ShieldCheck, PhoneCall, Radio, CheckCircle2 } from 'lucide-react';
import { KendraKPIs } from '../types';

interface HeaderProps {
  kpis: KendraKPIs;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onLogout: () => void;
  officerName?: string;
  userRole?: 'admin' | 'operator';
}

export const Header: React.FC<HeaderProps> = ({
  kpis,
  language,
  onToggleLanguage,
  onLogout,
  officerName = 'Dr. Rajesh Sharma',
  userRole = 'admin',
}) => {
  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-30 select-none shadow-xs">
      {/* Top Green Bar */}
      <div className="bg-[#1b5e20] text-white text-[11px] font-medium px-4 sm:px-6 py-1 flex flex-wrap items-center justify-between border-b border-green-800">
        <div className="flex items-center gap-4">
          <span className="tracking-wide">
            रसायन एवं उर्वरक मंत्रालय | Ministry of Chemicals and Fertilizers, Govt. of India
          </span>
          <span className="hidden md:inline text-green-300">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-green-100">
            <PhoneCall className="w-3 h-3 text-green-300" />
            <span>हेल्पलाइन / Toll Free: 1800 180 1551</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-green-200">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>DBT Gateway Sync: Live (0.42s)</span>
          </div>
          <span className="text-green-400">|</span>
          <button
            onClick={onToggleLanguage}
            className="text-white hover:text-green-200 cursor-pointer font-semibold underline decoration-dotted transition-colors"
            title="Toggle Language / भाषा बदलें"
          >
            {language === 'en' ? 'English | हिन्दी' : 'हिन्दी | English'}
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between bg-[#fbfdfa]">
        {/* Left Branding */}
        <div className="flex items-center gap-3.5">
          {/* Official Emblem + IFFCO Logos */}
          <div className="flex items-center gap-2">
            {/* IFFCO Green Badge Logo */}
            <div className="w-9 h-9 rounded-md bg-[#136a28] flex items-center justify-center text-white font-extrabold text-[15px] shadow-xs tracking-tighter">
              IFFCO
            </div>
            {/* Govt of India Emblem Icon */}
            <div className="flex flex-col items-center justify-center pl-1 border-l border-stone-300">
              <div className="w-6 h-7 flex items-center justify-center">
                <svg viewBox="0 0 24 28" className="w-5 h-6 text-amber-700 fill-current" aria-label="Govt of India emblem">
                  <path d="M12 2L14 7H10L12 2Z" />
                  <circle cx="12" cy="11" r="3.5" />
                  <path d="M7 16H17V18H7V16Z" />
                  <path d="M8 19H16V21H8V19Z" />
                  <path d="M6 22H18V24H6V22Z" />
                </svg>
              </div>
              <span className="text-[7.5px] uppercase font-bold text-stone-600 leading-none">GOVT OF INDIA</span>
            </div>
          </div>

          <div>
            <h1 className="text-[19px] sm:text-[21px] font-bold text-[#1b431c] tracking-tight leading-tight">
              PM Kisan Urvarak Seva Portal
            </h1>
            <p className="text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              IFFCO CENTRAL FERTILIZER DISTRIBUTION SYSTEM
            </p>
          </div>
        </div>

        {/* Right Officer Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200/80 rounded-lg px-3 py-1.5 shadow-2xs">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Dr. Rajesh Sharma"
                className="w-9 h-9 rounded-full object-cover border border-emerald-600"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-stone-800">{officerName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[10.5px] text-stone-500 font-medium">
                {userRole === 'admin' ? 'Kendra Nodal Admin (Master)' : 'Counter Dispense Operator'} • Meerut #104
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log out of session"
            className="hidden sm:inline-flex text-[11px] font-semibold text-stone-600 hover:text-red-700 bg-white hover:bg-red-50 border border-stone-300 hover:border-red-300 px-2.5 py-1.5 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Ticker / Sub-header bar for Live Kendra KPIs */}
      <div className="bg-[#f0f4ee] border-t border-b border-stone-200/80 px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-[#1b5e20] font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span className="tracking-wide text-[11px] uppercase">LIVE KENDRA KPIS:</span>
          </div>

          <div className="flex items-center gap-3 text-[11.5px] text-stone-700 font-medium">
            <span>
              Pre-Registrations Today: <strong className="text-stone-900 font-bold">{kpis.preRegistrationsToday.toLocaleString()}</strong>
            </span>
            <span className="text-stone-300">|</span>
            <span>
              Urea Issued: <strong className="text-[#b43403] font-bold">{kpis.ureaIssuedBags.toLocaleString()} Bags</strong>
            </span>
            <span className="text-stone-300">|</span>
            <span>
              Pending Approvals: <strong className="text-amber-700 font-bold">{kpis.pendingApprovals}</strong>
            </span>
            <span className="text-stone-300">|</span>
            <span>
              Buffer Stock: <strong className="text-emerald-800 font-bold">{kpis.bufferStockBags.toLocaleString()} Bags</strong>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-stone-600 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>NIC Server Secure Node #402</span>
        </div>
      </div>
    </header>
  );
};
