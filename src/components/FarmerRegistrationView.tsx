import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Fingerprint, 
  ShieldCheck, 
  FileCheck, 
  RefreshCw, 
  Truck, 
  MapPin, 
  Sparkles,
  Info
} from 'lucide-react';
import { FarmerRegistration } from '../types';

interface FarmerRegistrationViewProps {
  onRegisterSuccess: (farmer: FarmerRegistration) => void;
  language: 'en' | 'hi';
}

export const FarmerRegistrationView: React.FC<FarmerRegistrationViewProps> = ({
  onRegisterSuccess,
  language,
}) => {
  // Clean initial state for new farmer registration
  const [formData, setFormData] = useState<Partial<FarmerRegistration>>({
    nameAsPerAadhaar: '',
    nameHindi: '',
    aadhaarNumber: '',
    aadhaarMasked: '',
    dob: '',
    age: 0,
    gender: 'Male',
    fatherOrHusbandName: '',
    contactNumber: '',
    pmKisanId: '',
    quantityBags: 4,
    nanoUreaBottles: 1,
    cropType: 'Sugarcane',
    landAcres: 1.5,
    village: '',
    tehsil: 'Meerut',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    pinCode: '',
    khasraNumber: '',
    biometricVerified: false,
    otpVerified: false,
  });

  const [isVerifyingUid, setIsVerifyingUid] = useState(false);
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate age automatically when DOB changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobVal = e.target.value;
    let calculatedAge = formData.age || 48;
    if (dobVal) {
      const birthDate = new Date(dobVal);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = Math.max(18, age);
    }
    setFormData((prev) => ({
      ...prev,
      dob: dobVal,
      age: calculatedAge,
    }));
  };

  // Calculate Nano Urea requirement automatically based on PM-PRANAM 1:4 ratio
  const handleQuantityChange = (bags: number) => {
    const validBags = Math.max(1, Math.min(20, bags));
    const nanoBottles = Math.ceil(validBags / 4);
    setFormData((prev) => ({
      ...prev,
      quantityBags: validBags,
      nanoUreaBottles: nanoBottles,
    }));
  };

  // Format and mask Aadhaar input
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    let masked = '';
    if (raw.length <= 4) {
      masked = raw;
    } else if (raw.length <= 8) {
      masked = `XXXX - ${raw.slice(4)}`;
    } else {
      masked = `XXXX - XXXX - ${raw.slice(8)}`;
    }
    setFormData((prev) => ({
      ...prev,
      aadhaarNumber: raw,
      aadhaarMasked: masked || 'XXXX - XXXX - 4829',
    }));
  };

  // Mock Aadhaar UID verification
  const handleVerifyAadhaar = () => {
    setIsVerifyingUid(true);
    setTimeout(() => {
      setIsVerifyingUid(false);
      setFormData((prev) => ({
        ...prev,
        biometricVerified: true,
      }));
    }, 600);
  };

  // Mock OTP verification
  const handleVerifyOtp = () => {
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setFormData((prev) => ({
        ...prev,
        otpVerified: true,
      }));
    }, 500);
  };

  // Biometric scanner trigger
  const handleScanBiometrics = () => {
    setIsScanningBiometric(true);
    setTimeout(() => {
      setIsScanningBiometric(false);
      setFormData((prev) => ({
        ...prev,
        biometricVerified: true,
      }));
    }, 700);
  };

  // Reset to empty / new registration
  const handleResetForm = () => {
    setFormData({
      nameAsPerAadhaar: '',
      nameHindi: '',
      aadhaarNumber: '',
      aadhaarMasked: '',
      dob: '',
      age: 25,
      gender: 'Male',
      fatherOrHusbandName: '',
      contactNumber: '+91 ',
      pmKisanId: '',
      quantityBags: 2,
      nanoUreaBottles: 1,
      cropType: 'Wheat / Cereal',
      landAcres: 1.0,
      village: '',
      tehsil: 'Meerut',
      district: 'Meerut',
      state: 'Uttar Pradesh',
      pinCode: '250001',
      khasraNumber: '',
      biometricVerified: false,
      otpVerified: false,
    });
    setErrorMessage('');
  };

  // Preload Rameshwar Dayal Yadav sample
  const handleLoadSample = () => {
    setFormData({
      nameAsPerAadhaar: 'Rameshwar Dayal Yadav',
      nameHindi: 'रामेश्वर दयाल यादव',
      aadhaarNumber: '482911094829',
      aadhaarMasked: 'XXXX - XXXX - 4829',
      dob: '1976-08-14',
      age: 48,
      gender: 'Male',
      fatherOrHusbandName: 'Late Shri Hariram Yadav',
      contactNumber: '+91 98372 45812',
      pmKisanId: 'UP / 2024 / 984321',
      quantityBags: 5,
      nanoUreaBottles: 2,
      cropType: 'Sugarcane',
      landAcres: 2.0,
      village: 'Sardhana Dehat',
      tehsil: 'Sardhana',
      district: 'Meerut',
      state: 'Uttar Pradesh',
      pinCode: '250342',
      khasraNumber: '142/3-B',
      biometricVerified: true,
      otpVerified: true,
    });
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameAsPerAadhaar?.trim()) {
      setErrorMessage('Please provide Name as per Aadhaar.');
      return;
    }
    if (!formData.contactNumber || formData.contactNumber.length < 10) {
      setErrorMessage('Please provide a valid 10-digit Aadhaar-linked Mobile number.');
      return;
    }
    if (!formData.quantityBags || formData.quantityBags <= 0) {
      setErrorMessage('Please specify required Urea bag quantity.');
      return;
    }
    if (!formData.village?.trim() || !formData.pinCode?.trim()) {
      setErrorMessage('Please provide village and postal pincode for verification.');
      return;
    }

    const bags = formData.quantityBags || 5;
    const govtShare = bags * 2150;
    const farmerShare = bags * 266.5;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newRecord: FarmerRegistration = {
      id: `FR-${Date.now()}`,
      tokenNumber: `UP-MRT-2025-${formData.aadhaarNumber?.slice(-4) || randomSuffix}`,
      nameAsPerAadhaar: formData.nameAsPerAadhaar || 'Kisan Beneficiary',
      nameHindi: formData.nameHindi || 'किसान लाभार्थी',
      aadhaarNumber: formData.aadhaarNumber || '482911094829',
      aadhaarMasked: formData.aadhaarMasked || 'XXXX - XXXX - 4829',
      dob: formData.dob || '1976-08-14',
      age: formData.age || 48,
      gender: formData.gender || 'Male',
      fatherOrHusbandName: formData.fatherOrHusbandName || 'Late Shri Hariram Yadav',
      contactNumber: formData.contactNumber || '+91 98372 45812',
      pmKisanId: formData.pmKisanId || 'UP / 2024 / 984321',
      quantityBags: bags,
      nanoUreaBottles: formData.nanoUreaBottles || Math.ceil(bags / 4),
      cropType: formData.cropType || 'Sugarcane',
      landAcres: formData.landAcres || 2.0,
      village: formData.village || 'Sardhana Dehat',
      tehsil: formData.tehsil || 'Sardhana',
      district: formData.district || 'Meerut',
      state: formData.state || 'Uttar Pradesh',
      pinCode: formData.pinCode || '250342',
      khasraNumber: formData.khasraNumber || '142/3-B',
      status: 'Approved',
      createdAt: 'Just now (Live Verified)',
      subsidyGovtShare: govtShare,
      farmerPayable: farmerShare,
      biometricVerified: true,
      otpVerified: true,
      counterRef: 'MRT-POS-0419',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    };

    setErrorMessage('');
    onRegisterSuccess(newRecord);
  };

  const ureaBags = formData.quantityBags || 5;
  const govtSubsidyTotal = (ureaBags * 2150).toLocaleString();
  const farmerPayableTotal = (ureaBags * 266.5).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {/* Session & Counter Ref badge */}
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
              <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/70 font-bold uppercase tracking-wider text-[11px]">
                SESSION KHARIF/RABI 2025
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-600 font-mono text-[11px]">
                Counter Ref: <strong className="text-stone-800 font-bold">MRT-POS-0419</strong>
              </span>
            </div>

            {/* Big Headings */}
            <h2 className="text-[26px] font-extrabold text-[#164e23] tracking-tight leading-tight">
              नवीन किसान यूरिया पूर्व-पंजीकरण फॉर्म
            </h2>
            <h3 className="text-[15px] font-bold text-stone-800 mt-0.5">
              Farmer Urea Pre-Registration Form (Subsidized Distribution Counter)
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl font-medium leading-relaxed">
              Direct Benefit Transfer (DBT) integrated subsidized fertilizer allocation for verified landholder & tenant farmers under PM-PRANAM guidelines.
            </p>
          </div>

          {/* Right Kendra Assignment Box */}
          <div className="bg-[#f0f7f1] border border-emerald-300/80 rounded-lg p-3 flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-md bg-[#1b5e20] flex items-center justify-center text-white shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                KENDRA ASSIGNMENT
              </p>
              <p className="text-sm font-extrabold text-stone-900 leading-tight">
                Meerut Depot #104
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Biometric Scanner: Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            UIDAI Aadhaar Vault API: Mode 2.1 (Demographic & Biometric eKYC)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Pre-Fill Sample (Rameshwar Yadav)
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-[11px] text-stone-600 hover:text-stone-900 font-semibold hover:bg-stone-100 border border-stone-200 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-stone-400" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-red-900 font-bold">×</button>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 01: Farmer Identity Details */}
        <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs space-y-4">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-[#1b5e20] text-white font-bold text-xs flex items-center justify-center">
                01
              </span>
              <div>
                <h4 className="text-[14.5px] font-extrabold text-stone-900">
                  कृषक विवरण / Farmer Identity Details
                </h4>
                <p className="text-[11px] text-stone-500 font-medium">
                  Validated through UIDAI Aadhaar Vault & PM-Kisan Database
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11.5px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>UIDAI e-KYC Verified</span>
            </div>
          </div>

          {/* Identity Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Name as per Aadhaar */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Name as per Aadhaar (आधार अनुसार नाम) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.nameAsPerAadhaar || ''}
                  onChange={(e) => setFormData({ ...formData, nameAsPerAadhaar: e.target.value })}
                  placeholder="e.g. Rameshwar Dayal Yadav"
                  required
                  className="flex-1 bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all"
                />
                <div className="w-36 bg-blue-50/70 border border-blue-200/70 rounded px-2.5 py-2 text-xs font-semibold text-blue-950 truncate">
                  {formData.nameHindi || 'रामेश्वर दयाल यादव'}
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Demographic match 99.4%
              </p>
            </div>

            {/* Field 2: Aadhaar Number */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Aadhaar Number / आधार संख्या (UIDAI) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={formData.aadhaarMasked || ''}
                    onChange={handleAadhaarChange}
                    placeholder="XXXX - XXXX - 4829"
                    maxLength={19}
                    required
                    className="w-full bg-stone-50/70 border border-stone-300 rounded pl-3 pr-8 py-2 text-xs font-mono font-bold text-stone-900 tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleScanBiometrics}
                    title="Scan Fingerprint"
                    className="absolute right-2 top-2 text-stone-500 hover:text-emerald-700 cursor-pointer"
                  >
                    <Fingerprint className={`w-4 h-4 ${isScanningBiometric ? 'animate-pulse text-emerald-600' : ''}`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyAadhaar}
                  className="bg-[#1b5e20] hover:bg-[#154a19] text-white px-3 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVerifyingUid ? 'Checking...' : 'Verified UID'}</span>
                </button>
              </div>
              <p className="text-[10.5px] text-stone-500 font-medium mt-1">
                Last verified via Iris/Biometric on 24 Feb 2025
              </p>
            </div>

            {/* Field 3: DOB & Age */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Date of Birth / जन्म तिथि (DOB) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={formData.dob || '1976-08-14'}
                  onChange={handleDobChange}
                  required
                  className="flex-1 bg-stone-50/70 border border-stone-300 rounded px-3 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
                <div className="bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap">
                  Age: {formData.age || 48} Yrs (वयस्क)
                </div>
              </div>
            </div>

            {/* Field 4: Gender & Father/Husband Name */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Gender / लिंग
                </label>
                <select
                  value={formData.gender || 'Male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 truncate">
                  Father / Husband Name
                </label>
                <input
                  type="text"
                  value={formData.fatherOrHusbandName || ''}
                  onChange={(e) => setFormData({ ...formData, fatherOrHusbandName: e.target.value })}
                  placeholder="Late Shri Hariram Yadav"
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white truncate"
                />
              </div>
            </div>

            {/* Field 5: Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Mobile No. (आधार लिंक मोबाइल) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.contactNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+91 98372 •••••"
                  required
                  className="flex-1 bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-2 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isSendingOtp ? 'Validating...' : 'OTP OK'}</span>
                </button>
              </div>
              <p className="text-[10.5px] text-stone-500 mt-1">
                e-Sign OTP dispatched & authenticated via UIDAI Gateway
              </p>
            </div>

            {/* Field 6: PM-Kisan ID */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                PM-Kisan ID / KCC खाता क्रमांक
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.pmKisanId || ''}
                  onChange={(e) => setFormData({ ...formData, pmKisanId: e.target.value })}
                  placeholder="UP / 2024 / 984321"
                  className="flex-1 bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-mono font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-2 rounded whitespace-nowrap">
                  Linked DBT Active 16th Tranche
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 02: Land, Quantity & Delivery Address */}
        <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs space-y-4">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-[#1b5e20] text-white font-bold text-xs flex items-center justify-center">
                02
              </span>
              <div>
                <h4 className="text-[14.5px] font-extrabold text-stone-900">
                  भूमि, यूरिया कोटा एवं सत्यापन पता / Land, Urea Quota & Verification Address
                </h4>
                <p className="text-[11px] text-stone-500 font-medium">
                  Calculated based on crop acreage & PM-PRANAM balanced fertilization policy
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded">
              Subsidized Cap: 20 Bags / Season
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Crop Type */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Crop Type / फसल का प्रकार <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cropType || 'Sugarcane'}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value as any })}
                className="w-full bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              >
                <option value="Sugarcane">Sugarcane / गन्ना (Quota: 2.5 Bags/Acre)</option>
                <option value="Wheat / Cereal">Wheat / Cereal / गेहूं (Quota: 2.0 Bags/Acre)</option>
                <option value="Paddy">Paddy / धान (Quota: 2.0 Bags/Acre)</option>
                <option value="Mustard / Oilseeds">Mustard / Oilseeds / सरसों</option>
                <option value="Vegetables">Vegetables / सब्जियां</option>
              </select>
            </div>

            {/* Land Area in Acres */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Land Area / कृषि भूमि (एकड़ / Acres) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="25"
                value={formData.landAcres || 2.0}
                onChange={(e) => setFormData({ ...formData, landAcres: parseFloat(e.target.value) || 1 })}
                required
                className="w-full bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {/* Khasra / Khatauni Number */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Khasra / Khatauni No. (खसरा संख्या)
              </label>
              <input
                type="text"
                value={formData.khasraNumber || ''}
                onChange={(e) => setFormData({ ...formData, khasraNumber: e.target.value })}
                placeholder="e.g. 142/3-B"
                className="w-full bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Quantity & Subsidy Box */}
          <div className="bg-[#f7fbf8] border border-emerald-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Bags Stepper */}
            <div>
              <label className="block text-xs font-extrabold text-stone-900 mb-1">
                Urea Bags Quantity / यूरिया की मात्रा (45 Kg Bags) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange((formData.quantityBags || 1) - 1)}
                  className="w-8 h-8 rounded bg-stone-200 hover:bg-stone-300 font-bold text-sm text-stone-800 cursor-pointer flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.quantityBags || 5}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  required
                  className="w-20 text-center font-extrabold text-stone-900 text-sm py-1.5 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange((formData.quantityBags || 1) + 1)}
                  className="w-8 h-8 rounded bg-stone-200 hover:bg-stone-300 font-bold text-sm text-stone-800 cursor-pointer flex items-center justify-center"
                >
                  +
                </button>
                <span className="text-xs font-bold text-stone-600">Bags ({ureaBags * 45} Kg)</span>
              </div>
            </div>

            {/* Mandatory Nano Urea Ratio */}
            <div className="border-l border-emerald-200/80 pl-3">
              <p className="text-[11px] font-bold text-emerald-950 uppercase tracking-wide">
                Nano Urea Spray (1:4 PM-PRANAM Ratio)
              </p>
              <p className="text-base font-extrabold text-emerald-900 mt-0.5">
                {formData.nanoUreaBottles || 2} Bottles <span className="text-xs font-normal text-stone-500">(500 ml each)</span>
              </p>
              <p className="text-[10.5px] text-emerald-800 font-medium">
                Saves soil health & boosts yield
              </p>
            </div>

            {/* Subsidized Price Summary */}
            <div className="border-l border-emerald-200/80 pl-3 bg-white p-2.5 rounded border border-emerald-100">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Govt DBT Subsidy:</span>
                <span className="font-extrabold text-emerald-700">₹{govtSubsidyTotal}</span>
              </div>
              <div className="flex justify-between text-xs mt-1 border-t border-stone-100 pt-1">
                <span className="font-bold text-stone-800">Farmer Payable:</span>
                <span className="font-extrabold text-stone-900 text-sm">₹{farmerPayableTotal}</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5 text-right font-medium">
                @ ₹266.50 per 45kg bag
              </p>
            </div>
          </div>

          {/* Address Fields */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-stone-800">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Full Address for Physical Verification & Land Registry Link (पता)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Village / Gram (ग्राम) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.village || ''}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Sardhana Dehat"
                  required
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Tehsil (तहसील) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tehsil || ''}
                  onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                  placeholder="Sardhana"
                  required
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  District (जिला) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Meerut"
                  required
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  PIN Code (पिन कोड) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pinCode || ''}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  placeholder="250342"
                  maxLength={6}
                  required
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="bg-white rounded-lg border border-stone-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-600 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Encrypted with SHA-256 HSM Digital Signatures for DBT Comptroller Audit</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2 rounded-md border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              रीसेट करें / Reset
            </button>

            <button
              type="submit"
              className="bg-[#1b5e20] hover:bg-[#144919] text-white px-6 py-2.5 rounded-md text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>सत्यापन पूर्ण करें एवं टोकन जारी करें / Verify & Issue DBT Token</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
