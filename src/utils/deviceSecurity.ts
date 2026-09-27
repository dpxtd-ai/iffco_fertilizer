import { WhitelistedDevice, OperatorAccount } from '../types';

const STORAGE_KEY_CURRENT_MAC = 'pm_kendra_client_mac';
const STORAGE_KEY_OPERATORS = 'pm_kendra_operators_list';

// Get or generate realistic MAC address for this system's NIC
export function getOrCreateSystemMacAddress(): string {
  let existing = sessionStorage.getItem(STORAGE_KEY_CURRENT_MAC);
  if (!existing) {
    // Generate realistic MAC format: XX:XX:XX:XX:XX:XX
    const hex = '0123456789ABCDEF';
    const randByte = () => hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
    existing = `74:D4:35:${randByte()}:${randByte()}:${randByte()}`;
    sessionStorage.setItem(STORAGE_KEY_CURRENT_MAC, existing);
  }
  return existing;
}

// Initial operators list managed by admin
export function getInitialOperators(): OperatorAccount[] {
  const currentMac = getOrCreateSystemMacAddress();
  const stored = localStorage.getItem(STORAGE_KEY_OPERATORS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored operators', e);
    }
  }

  // Default initial operator assigned to this system's MAC
  const defaultList: OperatorAccount[] = [
    {
      id: 'OP-101',
      name: 'Sunil Kumar (Kendra Operator)',
      userId: 'operator104@iffco.gov.in',
      password: 'Operator@2025',
      contactNumber: '+91 94120 44552',
      macAddress: currentMac,
      counterId: 'Meerut Counter #1 (MRT-POS-0419)',
      status: 'Active',
      createdAt: '2025-01-10',
      lastLogin: 'Active Today',
    } 
  ];

  localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(defaultList));
  return defaultList;
}

export function saveOperators(operators: OperatorAccount[]): void {
  localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(operators));
}

// Clear all local app cache as requested
export function clearAllApplicationCache(): void {
  sessionStorage.clear();
  localStorage.removeItem('kendra_auth');
  localStorage.removeItem('kendra_role');
  localStorage.removeItem('kendra_user_name');
  localStorage.removeItem('pm_kendra_registrations');
  localStorage.removeItem('pm_kendra_transactions');
  localStorage.removeItem('kendra_officer');
}
