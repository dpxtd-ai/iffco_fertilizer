import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Check, 
  X, 
  MapPin
} from 'lucide-react';
import { FarmerRegistration } from '../types';

interface StatusApprovalsViewProps {
  registrations: FarmerRegistration[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSelectForIssuance: (farmer: FarmerRegistration) => void;
}

export const StatusApprovalsView: React.FC<StatusApprovalsViewProps> = ({
  registrations,
  onApprove,
  onReject,
  onSelectForIssuance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending Verification' | 'Flagged'>('All');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRegistration | null>(null);

  const filtered = registrations.filter((item) => {
    const matchesSearch =
      item.nameAsPerAadhaar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aadhaarMasked.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactNumber.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = registrations.filter((r) => r.status === 'Pending Verification').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div> 
            <h2 className="text-2xl font-black text-[#1b431c] tracking-tight">
              स्थिति एवं अनुमोदन / Status & Approvals
            </h2> 
          </div>

          {/* Quick Counter Pills */}
          <div className="flex items-center gap-2">
            <div className="bg-stone-50 border border-stone-200 rounded-md px-3 py-1.5 text-center">
              <p className="text-[10px] text-stone-500 font-bold uppercase">Total</p>
              <p className="text-base font-black text-stone-900">{registrations.length}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5 text-center">
              <p className="text-[10px] text-amber-800 font-bold uppercase">Pending</p>
              <p className="text-base font-black text-amber-900">{pendingCount}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5 text-center">
              <p className="text-[10px] text-emerald-800 font-bold uppercase">Approved</p>
              <p className="text-base font-black text-emerald-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Aadhaar, Name, Token #, Village or Mobile..."
              className="w-full bg-stone-50/70 border border-stone-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-md text-xs">
            {(['All', 'Pending Verification', 'Approved', 'Flagged'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of Registrations */}
      <div className="bg-white rounded-lg border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-3 px-4">Token & Timestamp</th>
                <th className="py-3 px-4">Farmer Details (Aadhaar)</th>
                <th className="py-3 px-4">DOB / Age</th>
                <th className="py-3 px-4">Allocated Bags & Nano Urea</th>
                <th className="py-3 px-4">Village & Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* Token & Time */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded text-[11px] block w-fit">
                      {item.tokenNumber}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-0.5">{item.createdAt}</span>
                  </td>

                  {/* Farmer Details */}
                  <td className="py-3 px-4">
                    <p className="font-bold text-stone-900 text-xs">{item.nameAsPerAadhaar}</p>
                    <p className="text-[11px] text-blue-900 font-medium">{item.nameHindi}</p>
                    <p className="text-[10.5px] font-mono text-stone-500 mt-0.5">{item.aadhaarMasked}</p>
                  </td>

                  {/* DOB / Age */}
                  <td className="py-3 px-4">
                    <p className="font-medium text-stone-800">{item.dob}</p>
                    <p className="text-[10.5px] text-stone-500 font-bold">{item.age} Yrs ({item.gender})</p>
                  </td>

                  {/* Quantity & Subsidy */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-[#1b5e20] text-sm">{item.quantityBags} Bags</span>
                      <span className="text-[10.5px] text-stone-400">•</span>
                      <span className="text-emerald-700 font-bold text-[11px]">{item.nanoUreaBottles} Nano</span>
                    </div> 
                  </td>

                  {/* Address */}
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-1 text-stone-700">
                      <MapPin className="w-3 h-3 text-stone-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold truncate max-w-[130px]">{item.village}</p>
                        <p className="text-[10px] text-stone-500">{item.tehsil}, {item.pinCode}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {item.status === 'Approved' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {item.status === 'Pending Verification' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        Pending e-KYC
                      </span>
                    )}
                    {item.status === 'Flagged' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Flagged
                      </span>
                    )}
                    {item.status === 'Issued' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        Issued at Counter
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === 'Pending Verification' && (
                        <>
                          <button
                            onClick={() => onApprove(item.id)}
                            title="Approve Beneficiary"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onReject(item.id)}
                            title="Flag / Reject Beneficiary"
                            className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {item.status === 'Approved' && (
                        <button
                          onClick={() => onSelectForIssuance(item)}
                          className="bg-[#1b5e20] hover:bg-[#144919] text-white px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Dispense
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedFarmer(item)}
                        title="View Full Record"
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 p-1.5 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500 font-medium">
                    No farmer pre-registrations match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-stone-200 overflow-hidden">
            <div className="bg-[#1b5e20] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Kisan DBT Pre-Registration Dossier</h3>
              <button onClick={() => setSelectedFarmer(null)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500">Token ID:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{selectedFarmer.tokenNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded">
                <div>
                  <span className="text-stone-500">Name as per Aadhaar:</span>
                  <p className="font-bold text-stone-900">{selectedFarmer.nameAsPerAadhaar}</p>
                  <p className="text-blue-900 font-semibold">{selectedFarmer.nameHindi}</p>
                </div>
                <div>
                  <span className="text-stone-500">Aadhaar UIDAI:</span>
                  <p className="font-mono font-bold text-stone-900">{selectedFarmer.aadhaarMasked}</p>
                  <p className="text-emerald-700 font-bold text-[10.5px]">Biometric Iris Match 100%</p>
                </div>
              </div>

              <div className="space-y-1">
                <p><strong>Mobile:</strong> {selectedFarmer.contactNumber}</p>
                <p><strong>DOB / Age:</strong> {selectedFarmer.dob} ({selectedFarmer.age} Years)</p>
                <p><strong>Father/Husband:</strong> {selectedFarmer.fatherOrHusbandName}</p>
                <p><strong>PM-Kisan ID:</strong> {selectedFarmer.pmKisanId}</p>
                <p><strong>Address:</strong> {selectedFarmer.village}, Tehsil {selectedFarmer.tehsil}, {selectedFarmer.district}, {selectedFarmer.pinCode}</p>
                <p><strong>Land Acreage:</strong> {selectedFarmer.landAcres} Acres ({selectedFarmer.cropType})</p>
                <p><strong>Khasra No:</strong> {selectedFarmer.khasraNumber || 'N/A'}</p>
              </div> 
            </div> 
          </div>
        </div>
      )}
    </div>
  );
};
