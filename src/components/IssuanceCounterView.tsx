import React, { useState } from 'react';
import { 
  Search, 
  AlertCircle
} from 'lucide-react';
import { FarmerRegistration, DBTTransaction } from '../types';

interface IssuanceCounterViewProps {
  initialFarmer?: FarmerRegistration | null; 
  availableRegistrations: FarmerRegistration[];
  onCompleteIssuance?: (farmer: FarmerRegistration, transaction: DBTTransaction) => void;
}

export const IssuanceCounterView: React.FC<IssuanceCounterViewProps> = ({
  initialFarmer, 
  availableRegistrations,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRegistration | null>(
    initialFarmer || availableRegistrations[0] || null
  ); 

  // Search by token or Aadhaar
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = availableRegistrations.find(
      (r) =>
        r.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.aadhaarNumber.includes(searchQuery) ||
        r.aadhaarMasked.includes(searchQuery) ||
        r.nameAsPerAadhaar.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found) {
      setSelectedFarmer(found);
    } else {
      alert('No matching pre-registration found with that Token or Aadhaar number.');
    }
  }; 

  const bags = selectedFarmer?.quantityBags || 5;

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase border border-emerald-200">
                POINT OF SALE (POS) COUNTER
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-xs text-stone-600 font-mono">Terminal: MRT-POS-0419</span>
            </div>
            <h2 className="text-2xl font-black text-[#1b431c] tracking-tight">
              उर्वरक वितरण काउंटर / Issuance Counter
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Real-time physical urea bag dispatch, weighing sensor validation, and DBT cash memo generation.
            </p>
          </div>

          {/* Token Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Token # (e.g. 04829) or Aadhaar..."
                className="bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1b5e20] hover:bg-[#144919] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer"
            >
              Lookup
            </button>
          </form>
        </div>
      </div>

      {/* Main Counter Dispensing Panel */}
      {selectedFarmer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Column 1: Beneficiary Identity & Address Check */}
          <div className="bg-white rounded-lg border border-stone-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                1. BENEFICIARY DETAILS
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {selectedFarmer.tokenNumber}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 font-bold uppercase">Farmer Name</span>
                <p className="font-extrabold text-stone-900 text-sm">{selectedFarmer.nameAsPerAadhaar}</p>
                <p className="text-blue-900 font-bold">{selectedFarmer.nameHindi}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-500 font-bold uppercase">Aadhaar (UIDAI)</span>
                  <p className="font-mono font-bold text-stone-800">{selectedFarmer.aadhaarMasked}</p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-bold uppercase">DOB / Age</span>
                  <p className="font-semibold text-stone-800">{selectedFarmer.dob} ({selectedFarmer.age} Yrs)</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase">Contact Number</span>
                <p className="font-mono font-semibold text-stone-800">{selectedFarmer.contactNumber}</p>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase">Address & Land</span>
                <p className="font-medium text-stone-800">
                  {selectedFarmer.village}, Tehsil {selectedFarmer.tehsil}, {selectedFarmer.district} - {selectedFarmer.pinCode}
                </p>
                <p className="text-[10.5px] text-stone-500 mt-0.5 font-semibold">
                  Crop: {selectedFarmer.cropType} • Land: {selectedFarmer.landAcres} Acres
                </p>
              </div>
            </div> 
             
          </div>

          {/* Column 2: Bag Allocation & Weighing Sensor */}
          <div className="bg-white rounded-lg border border-stone-200/90 p-4 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider border-b border-stone-100 pb-2">
              2. FERTILIZER DISPATCH LOT
            </h3>

            {/* Neem Coated Urea Bag */}
            <div className="bg-[#fcfdfa] border border-stone-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-stone-900 text-xs">IFFCO Neem Coated Urea</span>
                <span className="text-sm font-black text-[#1b5e20]">{bags} Bags (225 Kg)</span>
              </div>
              <p className="text-[10.5px] text-stone-500">
                Specification: 46% N, 45 kg net moisture-proof HDPE bag with tamper seal
              </p> 
            </div> 
          </div>  
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-stone-200 p-8 text-center text-stone-500">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="font-bold text-stone-800">No Pre-Registration Selected</p>
          <p className="text-xs mt-1">Please enter a Token number or Aadhaar above to begin issuing bags.</p>
        </div>
      )} 
    </div>
  );
};
