import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { FarmerRegistration } from '../types';

interface PaymentModalProps {
  farmer: FarmerRegistration;
  amount?: number;
  onProceed: (txnReference: string) => void;
  onCancel: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  farmer,
  amount = 100,
  onProceed,
  onCancel,
}) => {
  const [txnReference, setTxnReference] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnReference.trim()) {
      setErrorMsg('Please enter a valid Transaction Reference Number.');
      return;
    }
    onProceed(txnReference.trim());
  };

  const isProceedDisabled = !txnReference.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-[#1b5e20] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold leading-tight">
                किसान पंजीकरण शुल्क भुगतान / Registration Fee Payment
              </h3>
              <p className="text-[11px] text-green-200">
                DBT POS Counter Collection Gateway • Ref: {farmer.tokenNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-green-800 transition-colors cursor-pointer"
            title="Close / बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Farmer Summary Strip */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs grid grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">Beneficiary Farmer</span>
              <p className="font-extrabold text-stone-900 truncate">{farmer.nameAsPerAadhaar}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">Aadhaar (UIDAI)</span>
              <p className="font-mono font-bold text-stone-800">{farmer.aadhaarMasked}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">Allocated Quota</span>
              <p className="font-bold text-[#1b5e20]">{farmer.quantityBags} Bags (Neem Urea)</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">Village / Tehsil</span>
              <p className="font-semibold text-stone-700 truncate">{farmer.village || 'Meerut'}</p>
            </div>
          </div>

          {/* Payment Card with Barcode & Amount */}
          <div className="border-2 border-emerald-300/80 bg-emerald-50/40 rounded-xl p-4 text-center space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                FEE PAYABLE / कुल देय राशि
              </span>
              <div className="text-3xl font-black text-[#1b5e20] tracking-tight mt-0.5">
                ₹{amount}.00
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold">
                Kisan DBT E-Registration & Verification Processing Charge
              </p>
            </div>

            {/* Dummy Payment Barcode / QR Code Graphic */}
            <div className="bg-white border border-stone-300 rounded-lg p-3 max-w-xs mx-auto shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider pb-1 border-b border-dashed border-stone-200">
                <span className="flex items-center gap-1 text-emerald-800">
                  <QrCode className="w-3.5 h-3.5" />
                  BHIM UPI / POS BHARATQR
                </span>
                <span>INSTANT PAY</span>
              </div>

              {/* Dummy QR Code Vector Pattern */}
              <div className="flex items-center justify-center p-2 bg-stone-50 rounded border border-stone-200">
                <svg
                  viewBox="0 0 100 100"
                  className="w-32 h-32 text-stone-900 fill-current"
                  aria-label="Payment Barcode QR"
                >
                  {/* Outer corner top-left */}
                  <rect x="5" y="5" width="28" height="28" fill="#1b5e20" rx="3" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#1b5e20" rx="1" />

                  {/* Outer corner top-right */}
                  <rect x="67" y="5" width="28" height="28" fill="#1b5e20" rx="3" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#1b5e20" rx="1" />

                  {/* Outer corner bottom-left */}
                  <rect x="5" y="67" width="28" height="28" fill="#1b5e20" rx="3" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#1b5e20" rx="1" />

                  {/* Dummy QR Data modules */}
                  <rect x="38" y="10" width="6" height="6" fill="#1b5e20" />
                  <rect x="48" y="10" width="6" height="6" fill="#1b5e20" />
                  <rect x="58" y="10" width="6" height="6" fill="#1b5e20" />
                  <rect x="38" y="20" width="6" height="6" fill="#1b5e20" />
                  <rect x="48" y="26" width="6" height="6" fill="#1b5e20" />
                  <rect x="58" y="20" width="6" height="6" fill="#1b5e20" />

                  {/* Center branding square */}
                  <rect x="40" y="40" width="20" height="20" fill="#1b5e20" rx="2" />
                  <text x="50" y="54" fontSize="10" fontWeight="900" fill="white" textAnchor="middle" fontFamily="sans-serif">₹</text>

                  {/* Lower data blocks */}
                  <rect x="38" y="67" width="6" height="6" fill="#1b5e20" />
                  <rect x="48" y="73" width="6" height="6" fill="#1b5e20" />
                  <rect x="58" y="67" width="6" height="6" fill="#1b5e20" />
                  <rect x="67" y="48" width="6" height="6" fill="#1b5e20" />
                  <rect x="77" y="48" width="6" height="6" fill="#1b5e20" />
                  <rect x="87" y="48" width="6" height="6" fill="#1b5e20" />
                  <rect x="67" y="67" width="6" height="6" fill="#1b5e20" />
                  <rect x="77" y="77" width="6" height="6" fill="#1b5e20" />
                  <rect x="87" y="67" width="6" height="6" fill="#1b5e20" />
                  <rect x="87" y="87" width="6" height="6" fill="#1b5e20" />
                </svg>
              </div>

              {/* Dummy POS Linear Barcode */}
              <div className="pt-1">
                <div className="flex justify-center items-center gap-0.5 py-0.5 text-stone-900">
                  {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-stone-900 h-6"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <p className="text-[9.5px] font-mono text-stone-500 tracking-wider">
                  *PAY-100-{farmer.tokenNumber?.slice(-4) || '2026'}*
                </p>
              </div>
            </div>

            <p className="text-[10.5px] text-stone-500 font-medium">
              Scan with any UPI App (BHIM, PhonePe, Google Pay, Paytm) or Swipe at POS Counter
            </p>
          </div>

          {/* Transaction Reference Input Form */}
          <form onSubmit={handleProceed} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Enter Transaction Reference Number (लेनदेन संदर्भ संख्या) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={txnReference}
                onChange={(e) => {
                  setTxnReference(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="e.g. UPI/2026/8947239482 or POS-TXN-7482"
                required
                className="w-full bg-stone-50/80 border border-stone-300 rounded px-3 py-2 text-xs font-mono font-bold text-stone-900 tracking-wide focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
              <p className="text-[10.5px] text-stone-500 mt-1">
                Please enter the 10-18 digit transaction reference / UTR from payment receipt to proceed.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[10.5px] text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Payment validated via DBT Real-time Settlement Gateway</span>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel / रद्द करें
              </button>

              <button
                type="submit"
                disabled={isProceedDisabled}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-xs font-extrabold transition-all shadow-xs ${
                  isProceedDisabled
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'
                    : 'bg-[#1b5e20] hover:bg-[#144919] text-white cursor-pointer hover:shadow'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Proceed to Token Slip (आगे बढ़ें)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
