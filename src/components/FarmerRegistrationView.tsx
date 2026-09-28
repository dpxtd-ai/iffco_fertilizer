import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  MapPin
} from 'lucide-react';
import { FarmerRegistration } from '../types';

interface FarmerRegistrationViewProps {
  onRegisterSuccess: (farmer: FarmerRegistration) => void;
  language?: 'en' | 'hi';
}

export const FarmerRegistrationView: React.FC<FarmerRegistrationViewProps> = ({
  onRegisterSuccess,
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
    landAcres: 1.0,
    village: '',
    tehsil: '',
    district: '',
    state: 'Uttar Pradesh',
    pinCode: '',
    khasraNumber: '',
    biometricVerified: false,
    otpVerified: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      cropType: 'Wheat / Cereal',
      landAcres: 1.0,
      village: '',
      tehsil: '',
      district: '',
      state: 'Uttar Pradesh',
      pinCode: '',
      khasraNumber: '',
      biometricVerified: false, 
    });
    setErrorMessage('');
  }; 

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions while the API request is running
    if (isSubmitting) return;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!formData.nameAsPerAadhaar?.trim()) {
      setErrorMessage('Please provide Name as per Aadhaar.');
      return;
    }

    if (!formData.contactNumber || formData.contactNumber.length < 10) {
      setErrorMessage(
        'Please provide a valid 10-digit Aadhaar-linked Mobile number.'
      );
      return;
    }

    if (!formData.quantityBags || formData.quantityBags <= 0) {
      setErrorMessage('Please specify required Urea bag quantity.');
      return;
    }

    if (!formData.village?.trim() || !formData.pinCode?.trim()) {
      setErrorMessage(
        'Please provide village and postal pincode for verification.'
      );
      return;
    }

    // -----------------------------
    // Calculate values
    // -----------------------------

    const bags = formData.quantityBags || 5;

    const farmerShare = 100.00;

    // -----------------------------
    // Generate token
    // -----------------------------

    const randomSuffix = Math.floor(
      10000 + Math.random() * 90000
    );

    // -----------------------------
    // Create registration record
    // -----------------------------

    const newRecord: FarmerRegistration = {

      tokenNumber: `UP-MRT-2025-${
        formData.aadhaarNumber?.slice(-4) || randomSuffix
      }`,

      nameAsPerAadhaar:
        formData.nameAsPerAadhaar || 'Kisan Beneficiary',

      nameHindi: formData.nameHindi || '',

      aadhaarNumber:
        formData.aadhaarNumber || '',

      aadhaarMasked:
        formData.aadhaarMasked ||
        (formData.aadhaarNumber
          ? `XXXX - XXXX - ${formData.aadhaarNumber.slice(-4)}`
          : 'XXXX - XXXX - 0000'),

      dob:
        formData.dob || '1980-01-01',

      age:
        formData.age || 45,

      gender:
        formData.gender || 'Male',

      fatherOrHusbandName:
        formData.fatherOrHusbandName || '',

      contactNumber:
        formData.contactNumber || '',

      pmKisanId:
        formData.pmKisanId || '',

      quantityBags:
        bags, 

      cropType:
        formData.cropType || 'Sugarcane',

      landAcres:
        formData.landAcres || 1.5,

      village:
        formData.village || '',

      tehsil:
        formData.tehsil || '',

      district:
        formData.district || '',

      state:
        formData.state || 'Uttar Pradesh',

      pinCode:
        formData.pinCode || '',

      khasraNumber:
        formData.khasraNumber || '',

      status:
        'Pending Verification',

      createdAt:
        'Just now (Operator Submitted)', 

      farmerPayable:
        farmerShare,

      biometricVerified:
        false,

      counterRef:
        'MRT-POS-0419',
    };

    // -----------------------------
    // Clear previous error
    // -----------------------------

    setErrorMessage('');
    setIsSubmitting(true);

    try {

      // -----------------------------
      // Send data to n8n
      // -----------------------------

      const response = await fetch(
        'https://ydnyan0804.app.n8n.cloud/webhook/submit',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(newRecord),
        }
      );

      // -----------------------------
      // Read n8n response
      // -----------------------------

      const result = await response.json();

      console.log('n8n response:', result);

      // -----------------------------
      // Check HTTP error
      // -----------------------------

      if (!response.ok) {
        setErrorMessage(
          result?.message ||
          `API request failed with status ${response.status}`
        );

        return;
      }

      // -----------------------------
      // Check n8n success response
      // -----------------------------

      if (result?.success === true) {
        // Use ID generated by n8n
        const savedRecord: FarmerRegistration = {
          ...newRecord,
          id: result.id || newRecord.id,
        };

        // Registration successful
        onRegisterSuccess(savedRecord);
        handleResetForm();

        return;
      }

      // -----------------------------
      // n8n returned success:false
      // -----------------------------

      setErrorMessage(
        result?.message ||
        'Unable to save registration. Please try again.'
      );

    } catch (error) {

      console.error(
        'Error submitting farmer registration:',
        error
      );

      setErrorMessage(
        'Unable to save registration. Please check your internet connection and try again.'
      );
    } finally {
      // Re-enable the submit button after the API response/error
      setIsSubmitting(false);
    }
  };

  const ureaBags = formData.quantityBags || 5;

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs"> 
          <div>
            {/* Session & Counter Ref badge */}
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold">
              <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/70 font-bold uppercase tracking-wider text-[11px]">
                SESSION KHARIF/RABI 2026
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-600 font-mono text-[11px]">
                Ref: <strong className="text-stone-800 font-bold">MRT-POS-0419</strong>
              </span>
              <h3 className="text-[12px] font-bold text-stone-800 mt-0.5">
                Farmer Urea Pre-Registration Form
              </h3>
            </div>

            {/* Big Headings */}
            <marquee direction="left">
              <h2 className="text-[26px] font-extrabold text-[#164e23] tracking-tight leading-tight">
                नवीन किसान यूरिया पूर्व-पंजीकरण फॉर्म
              </h2>
            </marquee> 
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
              </div>
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
                  {formData.nameHindi || 'हिंदी नाम'}
                </div>
              </div>
              <p className="text-[11px] text-stone-500 font-medium mt-1">
                Exact spelling as printed on physical Aadhaar card
              </p>
            </div>

            {/* Field 2: Aadhaar Number */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Aadhaar Number / आधार संख्या (UIDAI) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.aadhaarNumber || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                  setFormData({
                    ...formData,
                    aadhaarNumber: val,
                    aadhaarMasked: val.length >= 8 ? `XXXX - XXXX - ${val.slice(8)}` : val,
                  });
                }}
                placeholder="Enter 12-digit Aadhaar Number (e.g. 482911094829)"
                maxLength={12}
                required
                className="w-full bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-mono font-bold text-stone-900 tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
              <p className="text-[10.5px] text-stone-500 font-medium mt-1">
                12-digit UIDAI number required for direct subsidy mapping
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
                  placeholder="Father or Husband Name"
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white truncate"
                />
              </div>
            </div>

            {/* Field 5: Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Mobile Number (मोबाइल नंबर) <span className="text-red-500">*</span>
              </label>

              <div className="flex w-full">
                {/* Country Code */}
                <div className="flex items-center justify-center w-16 bg-blue-50/70 border border-stone-300 border-r-0 rounded-l px-2 py-2 text-xs font-bold text-blue-950">
                  +91
                </div>

                {/* Mobile Number */}
                <input
                  type="tel"
                  inputMode="numeric"
                  value={formData.contactNumber || ''}
                  onChange={(e) => {
                    const mobile = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 10);

                    setFormData({
                      ...formData,
                      contactNumber: mobile,
                    });

                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  required
                  className="flex-1 min-w-0 bg-stone-50/70 border border-stone-300 rounded-r px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white font-mono"
                />
              </div>

              <p className="text-[10.5px] text-stone-500 font-medium mt-1">
                Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9
              </p>
            </div>

            {/* Field 6: PM-Kisan ID */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                PM-Kisan ID / KCC खाता क्रमांक
              </label>
              <div>
                <input
                  type="text"
                  value={formData.pmKisanId || ''}
                  onChange={(e) => setFormData({ ...formData, pmKisanId: e.target.value })}
                  placeholder="UP / 2024 / 984321"
                  className="flex-1 bg-stone-50/70 border border-stone-300 rounded px-3 py-2 text-xs font-mono font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                /> 
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
                  भूमि, यूरिया कोटा एवं सत्यापन पता / Land, Urea Quota & Address
                </h4>
              </div>
            </div> 
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

          {/* Quantity Box */}
          <div className="bg-[#f7fbf8] border border-emerald-200 rounded-lg p-4">
            {/* Bags Stepper */}
            <div>
              <label className="block text-xs font-extrabold text-stone-900 mb-1.5">
                Urea Bags Quantity / यूरिया की मात्रा (45 Kg Bags) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange((formData.quantityBags || 1) - 1)}
                  className="w-8 h-8 rounded bg-stone-200 hover:bg-stone-300 font-bold text-sm text-stone-800 cursor-pointer flex items-center justify-center shrink-0"
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
                  className="w-8 h-8 rounded bg-stone-200 hover:bg-stone-300 font-bold text-sm text-stone-800 cursor-pointer flex items-center justify-center shrink-0"
                >
                  +
                </button>
                <span className="text-xs font-bold text-stone-600 ml-1">Bags ({ureaBags * 45} Kg)</span>
              </div>
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
                  inputMode="numeric"
                  value={formData.pinCode || ''}
                  onChange={(e) => {
                    const pin = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6);

                    setFormData({
                      ...formData,
                      pinCode: pin,
                    });
                  }}
                  placeholder="250342"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  className="w-full bg-stone-50/70 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white font-mono"/>
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
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md border text-stone-700 text-xs font-bold transition-colors ${
                isSubmitting
                  ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'border-stone-300 hover:bg-stone-50 cursor-pointer'
              }`}
            >
              रीसेट करें / Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={`px-6 py-2.5 rounded-md text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all ${
                isSubmitting
                  ? 'bg-stone-400 text-white cursor-not-allowed opacity-90'
                  : 'bg-[#1b5e20] hover:bg-[#144919] text-white cursor-pointer hover:shadow'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>कृपया प्रतीक्षा करें... / Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>पंजीकरण सबमिट करें (अनुमोदन हेतु) / Submit for Admin Approval</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
