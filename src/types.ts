export interface FarmerRegistration {
  id: string;
  tokenNumber: string;
  nameAsPerAadhaar: string;
  nameHindi: string;
  aadhaarNumber: string; // raw 12 digits
  aadhaarMasked: string; // formatted e.g. XXXX - XXXX - 4829
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  fatherOrHusbandName: string;
  contactNumber: string;
  pmKisanId: string;
  quantityBags: number; // 45kg bags
  nanoUreaBottles: number; // 500ml bottles (1:4 ratio)
  cropType: 'Sugarcane' | 'Wheat / Cereal' | 'Paddy' | 'Mustard / Oilseeds' | 'Vegetables';
  landAcres: number;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  pinCode: string;
  khasraNumber: string;
  status: 'Approved' | 'Pending Verification' | 'Issued' | 'Flagged';
  createdAt: string;
  subsidyGovtShare: number; // approx ₹2,150 per bag
  farmerPayable: number; // ₹266.50 per bag
  biometricVerified: boolean;
  otpVerified: boolean;
  photoUrl?: string;
  counterRef?: string;
}

export interface KendraKPIs {
  preRegistrationsToday: number;
  ureaIssuedBags: number;
  pendingApprovals: number;
  bufferStockBags: number;
  targetQuotaBags: number;
  consumedQuotaBags: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameHindi: string;
  sku: string;
  packSize: string;
  mrpRate: number;
  subsidizedRate: number;
  govtSubsidy: number;
  stockInHand: number;
  bufferStock: number;
  allocatedToday: number;
  unit: string;
  warehouseLocation: string;
  reorderLevel: number;
}

export interface DBTTransaction {
  id: string;
  transactionRef: string;
  timestamp: string;
  farmerName: string;
  aadhaarMasked: string;
  bagsIssued: number;
  nanoUreaIssued: number;
  subsidyAmount: number;
  farmerPaidAmount: number;
  posTerminalId: string;
  operatorName: string;
  status: 'Success' | 'Settled' | 'Audit Pending';
}

export interface WhitelistedDevice {
  id: string;
  deviceName: string;
  macAddress: string; // standard format e.g. 74:D4:35:E2:81:09
  ipAddress?: string;
  authorizedBy: string;
  addedAt: string;
  status: 'Active' | 'Blocked';
  lastSeen?: string;
  deviceType: 'POS Kiosk' | 'Biometric Counter' | 'Admin Terminal' | 'Mobile Dispenser';
  notes?: string;
}

export type UserRole = 'admin' | 'operator';

export interface OperatorAccount {
  id: string;
  name: string;
  userId: string;
  password?: string;
  contactNumber: string;
  macAddress: string;
  counterId: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
}

export type ActiveTab = 
  | 'farmer-registration' 
  | 'status-approvals' 
  | 'issuance-counter' 
  | 'inventory-depot' 
  | 'reports-logs'
  | 'operator-management';
