import React from 'react';
import { CheckCircle, Printer, X, ShieldCheck, PlusCircle } from 'lucide-react';
import { FarmerRegistration } from '../types';

interface TokenModalProps {
  farmer: FarmerRegistration;
  onClose: () => void;
  onProceedToIssue?: (farmer: FarmerRegistration) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  farmer,
  onClose,
  onProceedToIssue,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-[#1b5e20] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold leading-tight">
                सत्यापन सफल / Verification Completed Successfully
              </h3>
              <p className="text-[11px] text-green-200">
                DBT Fertilizer Allocation Token Issued
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-green-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Official Receipt Slip Body */}
        <div id="printable-slip" className="p-5 space-y-4">
          {/* Slip Header */}
          <div className="text-center border-b border-dashed border-stone-300 pb-3">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              DEPARTMENT OF FERTILIZERS • MINISTRY OF CHEMICALS & FERTILIZERS
            </p>
            <h4 className="text-base font-extrabold text-[#1b5e20] mt-0.5">
              IFFCO KENDRA E-TOKEN SLIP
            </h4>
            <p className="text-xs text-stone-600 font-semibold">
              Kendra: Meerut Depot #104 | Counter: MRT-POS-0419
            </p>
          </div>

          {/* Token Box with Barcode Visual */}
          <div className="bg-stone-50 border-2 border-stone-300 rounded-lg p-3 text-center space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              OFFICIAL ALLOCATION TOKEN NUMBER
            </span>
            <div className="text-2xl font-black font-mono tracking-widest text-stone-900">
              {farmer.tokenNumber}
            </div>

            {/* Fake SVG Barcode */}
            <div className="flex justify-center items-center gap-0.5 py-1 text-stone-800">
              {[4, 2, 6, 2, 4, 1, 5, 3, 2, 6, 3, 2, 5, 2, 4, 1, 6, 3, 2, 5, 4, 2, 6, 2].map((w, i) => (
                <div
                  key={i}
                  className="bg-stone-900 h-8"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <p className="text-[9.5px] text-stone-500 font-mono">
              VALID FOR 48 HOURS AT ALL MEERUT COOPERATIVE DISTRIBUTION POINTS
            </p>
          </div>

          {/* Farmer & Quota Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50/70 p-3 rounded-md border border-stone-200">
            <div>
              <p className="text-[10.5px] text-stone-500 font-medium">Beneficiary Farmer:</p>
              <p className="font-extrabold text-stone-900">{farmer.nameAsPerAadhaar}</p>
              <p className="text-[11px] text-blue-900 font-semibold">{farmer.nameHindi}</p>
            </div>
            <div>
              <p className="text-[10.5px] text-stone-500 font-medium">Aadhaar (UIDAI):</p>
              <p className="font-mono font-bold text-stone-900">{farmer.aadhaarMasked}</p> 
            </div>

            <div>
              <p className="text-[10.5px] text-stone-500 font-medium">Mobile Contact:</p>
              <p className="font-mono font-bold text-stone-800">{farmer.contactNumber}</p>
            </div>
            <div>
              <p className="text-[10.5px] text-stone-500 font-medium">Address / Village:</p>
              <p className="font-semibold text-stone-800 truncate">
                {farmer.village}, {farmer.tehsil}
              </p>
            </div>
          </div>

          {/* Allocation & Subsidy Breakdown */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-md p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-stone-800">Neem Coated Urea (45 Kg Bags):</span>
              <span className="text-sm font-extrabold text-[#1b5e20]">{farmer.quantityBags} Bags</span>
            </div>  
          </div> 
        </div>

        {/* Add block where shows the barcode for payment and that image read from repo location */}

        {/* Modal Footer Actions */}
        <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between gap-3"> 
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1b5e20] hover:bg-[#154919] text-white rounded-md text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Next Kisan Registration (नया पंजीकरण)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
