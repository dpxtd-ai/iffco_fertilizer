import { WhitelistedDevice } from '../types';

const STORAGE_KEY_CURRENT_MAC = 'pm_kendra_client_mac';
const STORAGE_KEY_WHITELIST = 'pm_kendra_mac_whitelist';

// Generate a deterministic or persistent realistic MAC address for this system
export function getOrCreateSystemMacAddress(): string {
  // Check if session has a generated MAC
  let existing = sessionStorage.getItem(STORAGE_KEY_CURRENT_MAC);
  if (!existing) {
    // Generate realistic MAC format: XX:XX:XX:XX:XX:XX
    const hex = '0123456789ABCDEF';
    const randByte = () => hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
    // Common NIC vendor prefixes (Intel, Realtek, Dell)
    existing = `74:D4:35:${randByte()}:${randByte()}:${randByte()}`;
    sessionStorage.setItem(STORAGE_KEY_CURRENT_MAC, existing);
  }
  return existing;
}

// Initial authorized devices list - includes the default workstation
export function getInitialWhitelistedDevices(): WhitelistedDevice[] {
  const currentMac = getOrCreateSystemMacAddress();

  const stored = localStorage.getItem(STORAGE_KEY_WHITELIST);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored MAC whitelist', e);
    }
  }

  // Default clean seed: Current Authorized Admin Workstation + Meerut Counter POS #104
  const defaultList: WhitelistedDevice[] = [
    {
      id: 'DEV-001',
      deviceName: 'Primary Nodal Admin Terminal (This System)',
      macAddress: currentMac,
      ipAddress: '10.24.112.45 (Local NIC Gateway)',
      authorizedBy: 'Kendra Master Administrator',
      addedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastSeen: 'Just now',
      deviceType: 'Admin Terminal',
      notes: 'Authorized Primary Kendra Station with Biometric Vault Access',
    },
    {
      id: 'DEV-002',
      deviceName: 'Meerut Kendra POS Counter Terminal #1',
      macAddress: '00:1A:2B:3C:4D:5E',
      ipAddress: '10.24.112.50',
      authorizedBy: 'Dr. Rajesh Sharma',
      addedAt: '2025-01-15',
      status: 'Active',
      lastSeen: '24 Feb 2025',
      deviceType: 'POS Kiosk',
      notes: 'Point of sale counter terminal with thumbprint scanner',
    }
  ];

  localStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(defaultList));
  return defaultList;
}

export function saveWhitelistedDevices(devices: WhitelistedDevice[]): void {
  localStorage.setItem(STORAGE_KEY_WHITELIST, JSON.stringify(devices));
}

export function isMacAddressWhitelisted(mac: string, devices: WhitelistedDevice[]): boolean {
  if (!mac) return false;
  const normalized = mac.trim().toUpperCase();
  return devices.some(
    (d) => d.macAddress.toUpperCase() === normalized && d.status === 'Active'
  );
}

// Clear all local app cache as requested
export function clearAllApplicationCache(): void {
  sessionStorage.clear();
  localStorage.removeItem('kendra_auth');
  localStorage.removeItem('pm_kendra_registrations');
  localStorage.removeItem('pm_kendra_transactions');
  localStorage.removeItem('kendra_officer');
}
