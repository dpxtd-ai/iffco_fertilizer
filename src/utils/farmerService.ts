import { FarmerRegistration, KendraKPIs } from '../types';
import defaultFarmersData from '../data/farmers.json';

const WEBHOOK_GET_URL = 'https://ydnyan0804.app.n8n.cloud/webhook/farmer';
const STORAGE_KEY_FARMERS = 'pm_kendra_farmers_json';

/**
 * Get all current farmers from local JSON cache (fallback to repo's farmers.json)
 */
export function getStoredFarmers(): FarmerRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FARMERS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored farmers from cache:', err);
  }

  // Fallback to repo's farmers.json
  const initial = defaultFarmersData as FarmerRegistration[];
  try {
    localStorage.setItem(STORAGE_KEY_FARMERS, JSON.stringify(initial));
  } catch {
    // Ignore storage quota errors
  }
  return initial;
}

/**
 * Save updated farmers list into local storage / JSON cache
 */
export function saveStoredFarmers(farmers: FarmerRegistration[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FARMERS, JSON.stringify(farmers));
  } catch (err) {
    console.warn('Error saving farmers into cache:', err);
  }
}

/**
 * Add a new farmer registration row to the local JSON cache (avoids extra GET API calls)
 */
export function appendStoredFarmer(newFarmer: FarmerRegistration): FarmerRegistration[] {
  const current = getStoredFarmers();
  // Avoid duplicate by ID
  const filtered = current.filter((f) => f.id !== newFarmer.id);
  const updated = [newFarmer, ...filtered];
  saveStoredFarmers(updated);
  return updated;
}

/**
 * Update an existing farmer's status (e.g. Approved, Flagged, Issued)
 */
export function updateFarmerInStorage(id: string, updates: Partial<FarmerRegistration>): FarmerRegistration[] {
  const current = getStoredFarmers();
  const updated = current.map((f) => (f.id === id ? { ...f, ...updates } : f));
  saveStoredFarmers(updated);
  return updated;
}

/**
 * Calculate dynamic status KPIs based on current farmer records
 */
export function computeFarmersKPIs(records: FarmerRegistration[]): Pick<KendraKPIs, 'preRegistrationsToday' | 'pendingApprovals' | 'approvedCount' | 'ureaIssuedBags' | 'consumedQuotaBags'> {
  const pendingApprovals = records.filter((r) => r.status === 'Pending Verification').length;
  const approvedCount = records.filter((r) => r.status === 'Approved').length;
  const ureaIssuedBags = records
    .filter((r) => r.status === 'Issued')
    .reduce((acc, r) => acc + (r.quantityBags || 0), 0);

  return {
    preRegistrationsToday: records.length,
    pendingApprovals,
    approvedCount,
    ureaIssuedBags,
    consumedQuotaBags: ureaIssuedBags,
  };
}

/**
 * Normalize an external object from webhook into a strict FarmerRegistration
 */
function normalizeFarmerRecord(item: Record<string, unknown>, index: number): FarmerRegistration {
  const rawId = String(item.registrationId || item.id || item._id || item.farmerId );
  const rawToken = String(item.tokenNumber || item.token || item.token_number );
  const rawName = String(item.nameAsPerAadhaar || item.name || item.farmerName || item.farmer_name );
  const rawHindi = String(item.nameHindi || item.name_hindi || '');
  const rawAadhaar = String(item.aadhaarNumber || item.aadhaar || item.aadhaar_number );
  const cleanAadhaar = rawAadhaar.replace(/\s+/g, '');
  const last4 = cleanAadhaar.length >= 4 ? cleanAadhaar.slice(-4) : '0000';
  const rawMasked = String(item.aadhaarMasked || item.aadhaar_masked || `XXXX - XXXX - ${last4}`);
  
  const rawDob = String(item.dob || '1980-01-01');
  const rawAge = Number(item.age);
  const rawGender = (['Male', 'Female', 'Other'].includes(String(item.gender)) ? item.gender : 'Male') as 'Male' | 'Female' | 'Other';
  const rawFather = String(item.fatherOrHusbandName || item.father_name || '');
  const rawContact = String(item.contactNumber || item.mobile || item.phone || '');
  const rawPmKisan = String(item.pmKisanId || item.pm_kisan_id || '');
  const rawBags = Number(item.quantityBags || item.bags || item.quantity); 
  const rawCrop = (['Sugarcane', 'Wheat / Cereal', 'Paddy', 'Mustard / Oilseeds', 'Vegetables'].includes(String(item.cropType)) ? item.cropType : 'Sugarcane') as FarmerRegistration['cropType'];
  const rawLand = Number(item.landAcres || item.land );
  const rawVillage = String(item.village );
  const rawTehsil = String(item.tehsil);
  const rawDistrict = String(item.district);
  const rawState = String(item.state || 'Uttar Pradesh');
  const rawPin = String(item.pinCode || item.pincode );
  const rawKhasra = String(item.khasraNumber || item.khasra);
  
  let rawStatus: FarmerRegistration['status'] = 'Pending Verification';
  const incomingStatus = String(item.status || '').trim().toLowerCase();
  if (incomingStatus.includes('approv')) {
    rawStatus = 'Approved';
  } else if (incomingStatus.includes('issue')) {
    rawStatus = 'Issued';
  } else if (incomingStatus.includes('flag')) {
    rawStatus = 'Flagged';
  } else {
    rawStatus = 'Pending Verification';
  }

  const rawCreatedAt = String(item.createdAt || item.created_at || 'Recently Saved');
  const rawBio = Boolean(item.biometricVerified ?? false);

  return {
    id: rawId,
    tokenNumber: rawToken,
    nameAsPerAadhaar: rawName,
    nameHindi: rawHindi,
    aadhaarNumber: rawAadhaar,
    aadhaarMasked: rawMasked,
    dob: rawDob,
    age: rawAge,
    gender: rawGender,
    fatherOrHusbandName: rawFather,
    contactNumber: rawContact,
    pmKisanId: rawPmKisan,
    quantityBags: rawBags,
    cropType: rawCrop,
    landAcres: rawLand,
    village: rawVillage,
    tehsil: rawTehsil,
    district: rawDistrict,
    state: rawState,
    pinCode: rawPin,
    khasraNumber: rawKhasra,
    status: rawStatus,
    createdAt: rawCreatedAt,
    biometricVerified: rawBio,
    counterRef: String(item.counterRef ),
  };
}

/**
 * Fetch all updated farmer records from n8n webhook:
 * https://ydnyan0804.app.n8n.cloud/webhook/farmer
 *
 * Runs once every login (Admin or Operator).
 * Clears old cached data and maps ONLY with the API response data.
 */
export async function fetchFarmersFromWebhook(): Promise<{ success: boolean; records: FarmerRegistration[]; source: 'webhook' | 'cache' }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(WEBHOOK_GET_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      let rawList: unknown[] = [];

      if (Array.isArray(data)) {
        rawList = data;
      } else if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.data)) {
          rawList = obj.data;
        } else if (Array.isArray(obj.farmers)) {
          rawList = obj.farmers;
        } else if (Array.isArray(obj.records)) {
          rawList = obj.records;
        } else if (Array.isArray(obj.result)) {
          rawList = obj.result;
        } else if (obj.registrationId || obj.tokenNumber || obj.nameAsPerAadhaar || obj.id || obj.aadhaarNumber) {
          // Single farmer record returned
          rawList = [obj];
        }
      }

      // Clear all old cache and map ONLY with API response data
      localStorage.removeItem(STORAGE_KEY_FARMERS);

      const normalized = rawList.map((item, idx) =>
        normalizeFarmerRecord((item || {}) as Record<string, unknown>, idx)
      );

      // Save only the API response data into local storage / JSON cache
      saveStoredFarmers(normalized);
      return { success: true, records: normalized, source: 'webhook' };
    }
  } catch (err) {
    console.info('Webhook fetch notice:', err);
  }

  // Fallback to locally cached JSON data
  const cached = getStoredFarmers();
  return { success: false, records: cached, source: 'cache' };
}
