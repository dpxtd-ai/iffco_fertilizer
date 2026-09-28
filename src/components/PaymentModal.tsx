import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

import { QRCodeCanvas } from 'qrcode.react';

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

  // --------------------------------------------------
  // UPI PAYMENT DETAILS
  // --------------------------------------------------

  const upiId = '8185810817@upi';
  const merchantName = 'Farmer Registration';

  // Dynamic UPI payment URL
  // Amount comes from the existing "amount" prop
  const upiUrl =
    `upi://pay?pa=${encodeURIComponent(upiId)}` +
    `&pn=${encodeURIComponent(merchantName)}` +
    `&am=${Number(amount).toFixed(2)}` +
    `&cu=INR`;

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
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                Beneficiary Farmer
              </span>

              <p className="font-extrabold text-stone-900 truncate">
                {farmer.nameAsPerAadhaar}
              </p>
            </div>


            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                Aadhaar (UIDAI)
              </span>

              <p className="font-mono font-bold text-stone-800">
                {farmer.aadhaarMasked}
              </p>
            </div>


            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                Allocated Quota
              </span>

              <p className="font-bold text-[#1b5e20]">
                {farmer.quantityBags} Bags (Neem Urea)
              </p>
            </div>


            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                Village / Tehsil
              </span>

              <p className="font-semibold text-stone-700 truncate">
                {farmer.village || 'Meerut'}
              </p>
            </div>


            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                FEE PAYABLE / कुल देय राशि
              </span>

              <p className="font-semibold text-stone-700 truncate">
                ₹{Number(amount).toFixed(2)}
              </p>
            </div>

          </div>


          {/* --------------------------------------------------
              PAYMENT CARD WITH REAL UPI QR
          -------------------------------------------------- */}

          <div className="border-2 border-emerald-300/80 bg-emerald-50/40 rounded-xl p-4 text-center space-y-3">

            // {/* UPI QR Container */}
            // <div className="max-w-xs mx-auto shadow-sm rounded-xl overflow-hidden bg-white border border-stone-200 p-4">

              
              {/* REAL DYNAMIC UPI QR CODE */}
              <div className="flex justify-center bg-white p-2 rounded-lg">

                <QRCodeCanvas
                  value={upiUrl}
                  size={220}
                  level="H"
                  includeMargin={true}
                />

              </div>  

            // </div>


            {/* QR Instructions */}
            <p className="text-[10.5px] text-stone-500 font-medium">
              Scan with any UPI App (BHIM, PhonePe, Google Pay, Paytm)
            </p>

          </div>


          {/* Transaction Reference Input Form */}
          <form onSubmit={handleProceed} className="space-y-3">

            <div>

              <label className="block text-xs font-bold text-stone-800 mb-1">
                Enter Transaction Reference Number (लेनदेन संदर्भ संख्या)
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={txnReference}
                onChange={(e) => {
                  setTxnReference(e.target.value);

                  if (errorMsg) {
                    setErrorMsg('');
                  }
                }}
                placeholder="e.g. UPI/2026/8947239482 or POS-TXN-7482"
                required
                className="w-full bg-stone-50/80 border border-stone-300 rounded px-3 py-2 text-xs font-mono font-bold text-stone-900 tracking-wide focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />

            </div>


            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5">

                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />

                <span>{errorMsg}</span>

              </div>
            )}


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

                <span>
                  Proceed to Token Slip (आगे बढ़ें)
                </span>

              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
};