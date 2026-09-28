import React, { useState } from 'react';
import { 
  Search, 
  Fingerprint, 
  CheckCircle2, 
  Printer, 
  Package, 
  QrCode, 
  AlertCircle
} from 'lucide-react';
import { FarmerRegistration, DBTTransaction } from '../types';

interface IssuanceCounterViewProps {
  initialFarmer?: FarmerRegistration | null;
  onCompleteIssuance: (farmer: FarmerRegistration, transaction: DBTTransaction) => void;
  availableRegistrations: FarmerRegistration[];
}

export const IssuanceCounterView: React.FC<IssuanceCounterViewProps> = ({
  initialFarmer,
  onCompleteIssuance,
  availableRegistrations,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRegistration | null>(
    initialFarmer || availableRegistrations[0] || null
  );

  const [isFingerprintScanned, setIsFingerprintScanned] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'KCC'>('Cash');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [issuedTransaction, setIssuedTransaction] = useState<DBTTransaction | null>(null);

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
      setIsFingerprintScanned(false);
    } else {
      alert('No matching pre-registration found with that Token or Aadhaar number.');
    }
  };

  const handleScanFingerprint = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsFingerprintScanned(true);
    }, 700);
  };

  const handleIssueBags = () => {
    if (!selectedFarmer) return;

    const txn: DBTTransaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      transactionRef: `DBT-MRT-2025-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      farmerName: selectedFarmer.nameAsPerAadhaar,
      aadhaarMasked: selectedFarmer.aadhaarMasked,
      bagsIssued: selectedFarmer.quantityBags,
      nanoUreaIssued: selectedFarmer.nanoUreaBottles,
      subsidyAmount: selectedFarmer.subsidyGovtShare,
      farmerPaidAmount: selectedFarmer.farmerPayable,
      posTerminalId: 'MRT-POS-0419',
      operatorName: 'Dr. Rajesh Sharma',
      status: 'Settled',
    };

    setIssuedTransaction(txn);
    setShowReceiptModal(true);
    onCompleteIssuance(selectedFarmer, txn);
  };

  const bags = selectedFarmer?.quantityBags || 5;
  const nanoBags = selectedFarmer?.nanoUreaBottles || 2;
  const govtSubsidy = selectedFarmer?.subsidyGovtShare || 10750;

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

            {/* Biometric Verification Box */}
            <div className="pt-2 border-t border-stone-200">
              <span className="text-[10px] text-stone-500 font-bold uppercase block mb-1.5">
                Physical Kiosk Biometric Check
              </span>
              {isFingerprintScanned ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-900">Biometric Match: 100%</p>
                      <p className="text-[10px] text-emerald-700">Authenticated with UIDAI Server</p>
                    </div>
                  </div>
                  <button
                    onClick={handleScanFingerprint}
                    className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                  >
                    Re-scan
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleScanFingerprint}
                  disabled={isScanning}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
                >
                  <Fingerprint className={`w-4 h-4 ${isScanning ? 'animate-bounce' : ''}`} />
                  <span>{isScanning ? 'Scanning Thumb on Sensor...' : 'Scan Thumb to Authorize Dispensing'}</span>
                </button>
              )}
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
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-800 font-bold">
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>Warehouse Bay #104 Stacks A1-B4 (Barcodes Loaded)</span>
              </div>
            </div>

            {/* Nano Urea Bottle */}
            <div className="bg-[#f0f9f3] border border-emerald-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 text-xs">IFFCO Nano Urea Liquid (500ml)</span>
                <span className="text-sm font-black text-emerald-900">{nanoBags} Bottles</span>
              </div>
              <p className="text-[10.5px] text-emerald-800">
                Mandatory adoption under PM-PRANAM scheme (1 bottle per 4 bags)
              </p>
            </div>

            {/* Weight Calibration Sensor Check */}
            <div className="bg-stone-50 border border-stone-200 rounded p-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase">Automated Weighbridge</span>
                <p className="font-extrabold text-stone-900">Gross Weight: {bags * 45.1} kg</p>
              </div>
              <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Weight OK
              </span>
            </div>
          </div>

          {/* Column 3: Payment & Issuance Action */}
          <div className="bg-white rounded-lg border border-stone-200/90 p-4 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider border-b border-stone-100 pb-2">
                3. SUBSIDY & POS BILLING
              </h3>

              {/* Price Calculation Box */}
              <div className="space-y-1.5 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="flex justify-between text-stone-500">
                  <span>Gross Market Value (MRP):</span>
                  <span className="font-mono line-through">₹{(bags * 2416.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Central Govt Direct Subsidy:</span>
                  <span className="font-mono">- ₹{govtSubsidy.toLocaleString()}</span>
                </div> 
              </div>

              {/* Payment Method Selector */}
              <div>
                <span className="text-[10.5px] font-bold text-stone-700 uppercase block mb-1.5">
                  Select Settlement Method
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {(['Cash', 'UPI', 'KCC'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-2 rounded border text-center transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Complete Issuance Button */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <button
                type="button"
                onClick={handleIssueBags}
                disabled={!isFingerprintScanned}
                className={`w-full py-3 rounded-md text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  isFingerprintScanned
                    ? 'bg-[#1b5e20] hover:bg-[#144919] text-white shadow-emerald-700/20'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Issuance & Print Cash Memo</span>
              </button>
              <p className="text-[10px] text-center text-stone-400">
                Dispatches instant SMS receipt to {selectedFarmer.contactNumber}
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

      {/* Cash Memo & Receipt Modal */}
      {showReceiptModal && issuedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden animate-in fade-in">
            <div className="bg-[#1b5e20] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <div>
                  <h4 className="text-sm font-bold">Fertilizer Dispensed Successfully</h4>
                  <p className="text-[10px] text-emerald-200">DBT Tax Invoice & Receipt Generated</p>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-white/80 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="text-center border-b border-dashed border-stone-300 pb-2.5">
                <p className="font-extrabold text-stone-900 text-sm">IFFCO KENDRA DISTRIBUTION RECEIPT</p>
                <p className="text-[10.5px] text-stone-500">Meerut Depot #104 • POS MRT-POS-0419</p>
                <p className="font-mono text-[11px] font-bold text-stone-800 mt-1">
                  Txn Ref: {issuedTransaction.transactionRef}
                </p>
              </div>

              <div className="space-y-1 bg-stone-50 p-2.5 rounded border border-stone-200">
                <p><strong>Beneficiary:</strong> {issuedTransaction.farmerName}</p>
                <p><strong>Aadhaar:</strong> {issuedTransaction.aadhaarMasked}</p>
                <p><strong>Timestamp:</strong> {issuedTransaction.timestamp}</p>
                <p><strong>Operator:</strong> {issuedTransaction.operatorName}</p>
              </div>

              <div className="border border-stone-200 rounded p-2.5 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Neem Coated Urea (45kg):</span>
                  <span>{issuedTransaction.bagsIssued} Bags</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Nano Urea Spray (500ml):</span>
                  <span>{issuedTransaction.nanoUreaIssued} Bottles</span>
                </div>
                <div className="flex justify-between text-emerald-800 border-t border-stone-100 pt-1 font-semibold">
                  <span>Govt Subsidy Borne:</span>
                  <span>₹{issuedTransaction.subsidyAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-extrabold text-sm border-t border-stone-200 pt-1">
                  <span>Paid by Farmer ({paymentMethod}):</span>
                  <span>₹{issuedTransaction.farmerPaidAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center py-2">
                <QrCode className="w-14 h-14 text-stone-800" />
              </div>
              <p className="text-[9.5px] text-center text-stone-400 font-mono">
                E-INVOICE GENERATED UNDER PM-PRANAM DBT GUIDELINES
              </p>
            </div>

            <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex justify-between">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-1.5 bg-[#1b5e20] text-white rounded text-xs font-bold hover:bg-[#154919]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
