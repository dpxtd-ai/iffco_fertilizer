import React from 'react';
import { ShieldCheck, PhoneCall, CheckCircle } from 'lucide-react';

interface RightSidebarProps {
  currentFarmerPhoto?: string;
  currentFarmerName?: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentFarmerPhoto,
  currentFarmerName = 'Rameshwar Dayal Yadav',
}) => {
  return (
    <aside className="w-80 shrink-0 space-y-4 select-none">
      {/* 1. Biometric Snapshot Card */}
      <div className="bg-white rounded-lg border border-stone-200/90 overflow-hidden shadow-2xs">
        <div className="relative h-44 w-full bg-stone-100">
          <img
            src={
              currentFarmerPhoto ||
              'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
            }
            alt="Verified Farmer Biometric Snapshot"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Biometric Snapshot: Verified Today</span>
          </div>
        </div>

        <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
          <div>
            <p className="text-[11px] font-bold text-stone-700">Kisan Aadhaar UID Match: <span className="text-emerald-700">100%</span></p>
            <p className="text-[10px] text-stone-500 font-medium truncate max-w-[140px]">{currentFarmerName}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-stone-800">Meerut Division</p>
            <p className="text-[10px] text-stone-500 font-semibold text-emerald-800">#UP-AGRI-DBT</p>
          </div>
        </div>
      </div>

      {/* 2. PM PRANAM Quota Rules Card */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-[#1b431c]">पीएम-प्रणाम दिशानिर्देश / Quota Rules</h3>
          </div>
        </div>

        <p className="text-[11.5px] text-stone-600 leading-snug font-medium">
          Strict bag allocation rules apply to maintain sovereign fertilizer equilibrium and avoid artificial shortages:
        </p>

        <div className="space-y-2 text-xs">
          {/* Rule 1 */}
          <div className="bg-[#fcfdfa] border border-stone-200/80 rounded-md p-2.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-stone-800">Sugarcane Cultivation</span>
              <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">2.5 Bags / Acre</span>
            </div>
            <p className="text-[10.5px] text-stone-500 mt-1 leading-tight">
              Recommended 1 bag split at basal application and 1.5 bags before monsoon.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-[#fcfdfa] border border-stone-200/80 rounded-md p-2.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-stone-800">Wheat / Cereal Crops</span>
              <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">2.0 Bags / Acre</span>
            </div>
            <p className="text-[10.5px] text-stone-500 mt-1 leading-tight">
              Maximum cap strictly enforced against satellite survey verified area.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-[#f0f9f3] border border-emerald-200/90 rounded-md p-2.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-emerald-950">Nano Urea Mandatory Ratio</span>
              <span className="text-emerald-800 bg-white font-extrabold px-1.5 py-0.5 rounded text-[11px] border border-emerald-300">
                1 : 4 Ratio
              </span>
            </div>
            <p className="text-[10.5px] text-emerald-800 mt-1 leading-tight">
              Every 4 bags of granular urea requires minimum 1 bottle Nano Urea spray adoption.
            </p>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-3 flex items-center gap-3.5">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-stone-200 stroke-current"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-600 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="4"
                strokeDasharray="77.5, 100"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] font-black text-emerald-800">77%</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              KENDRA QUOTA UTILIZATION
            </p>
            <p className="text-sm font-extrabold text-stone-900 leading-tight">
              77% Consumed
            </p>
            <p className="text-[11px] text-stone-500 font-medium">
              3,100 of 4,000 bags distributed today
            </p>
          </div>
        </div>
      </div>

      {/* 3. Live Depot Stacks Photo */}
      <div className="bg-white rounded-lg border border-stone-200/90 overflow-hidden shadow-2xs">
        <div className="relative h-32 w-full bg-stone-100">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
            alt="Sardhana Warehouse #104 Live Stacks"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Sardhana Warehouse #104 Live Stacks</span>
          </div>
        </div>
      </div>

      {/* 4. Toll Free Helpline Card */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-4 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-stone-800">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-800">किसान हेल्पलाइन / Toll Free Help</h4>
            <p className="text-base font-extrabold text-[#c0392b] tracking-wide">1800 180 1551</p>
          </div>
        </div>

        <p className="text-[10.5px] text-stone-600 leading-relaxed font-medium">
          For DBT verification discrepancies, Khasra mapping mismatch, or unauthorized price markups, report immediately to District Fertilizer Grievance Officer.
        </p>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
          <span className="text-stone-500 font-medium">IFFCO Nodal Cell: ext. 408</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">24x7 Available</span>
        </div>
      </div>
    </aside>
  );
};
