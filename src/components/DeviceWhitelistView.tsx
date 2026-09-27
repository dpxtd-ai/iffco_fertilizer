import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Monitor, 
  Copy, 
  Check, 
  HelpCircle,
  Database
} from 'lucide-react';
import { WhitelistedDevice } from '../types';

interface DeviceWhitelistViewProps {
  currentMac: string;
  devices: WhitelistedDevice[];
  onAddDevice: (device: Omit<WhitelistedDevice, 'id' | 'addedAt'>) => void;
  onToggleStatus: (id: string) => void;
  onRemoveDevice: (id: string) => void;
  onClearCache: () => void;
  onSimulateUnauthorizedMac: () => void;
  isSimulatingUnauthorized: boolean;
}

export const DeviceWhitelistView: React.FC<DeviceWhitelistViewProps> = ({
  currentMac,
  devices,
  onAddDevice,
  onToggleStatus,
  onRemoveDevice,
  onClearCache,
  onSimulateUnauthorizedMac,
  isSimulatingUnauthorized,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [deviceType, setDeviceType] = useState<WhitelistedDevice['deviceType']>('POS Kiosk');
  const [ipAddress, setIpAddress] = useState('10.24.112.55');
  const [notes, setNotes] = useState('');
  const [copiedMac, setCopiedMac] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validate MAC format XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
  const isValidMac = (mac: string) => {
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac.trim());
  };

  const handleCopyCurrentMac = () => {
    navigator.clipboard.writeText(currentMac);
    setCopiedMac(true);
    setTimeout(() => setCopiedMac(false), 2000);
  };

  const handleQuickAddCurrentDevice = () => {
    setDeviceName('Workstation Admin Terminal');
    setMacAddress(currentMac);
    setDeviceType('Admin Terminal');
    setNotes('Local workstation primary NIC');
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const formattedMac = macAddress.trim().toUpperCase().replace(/-/g, ':');

    if (!deviceName.trim()) {
      setFormError('Please enter a descriptive device name.');
      return;
    }

    if (!isValidMac(formattedMac)) {
      setFormError('Invalid MAC Address format. Standard format: XX:XX:XX:XX:XX:XX (Hexadecimal).');
      return;
    }

    // Check duplicate
    if (devices.some((d) => d.macAddress.toUpperCase() === formattedMac)) {
      setFormError('This MAC Address is already registered in the whitelist.');
      return;
    }

    onAddDevice({
      deviceName: deviceName.trim(),
      macAddress: formattedMac,
      deviceType,
      ipAddress: ipAddress.trim() || 'Dynamic DHCP',
      authorizedBy: 'Dr. Rajesh Sharma (Nodal Officer)',
      status: 'Active',
      lastSeen: 'Registered',
      notes: notes.trim() || 'Whitelisted by Administrator',
    });

    setSuccessMsg(`Device "${deviceName}" with MAC ${formattedMac} successfully whitelisted.`);
    setTimeout(() => setSuccessMsg(''), 4000);

    setDeviceName('');
    setMacAddress('');
    setNotes('');
    setShowAddForm(false);
  };

  const activeCount = devices.filter((d) => d.status === 'Active').length;
  const isCurrentDeviceWhitelisted = devices.some(
    (d) => d.macAddress.toUpperCase() === currentMac.toUpperCase() && d.status === 'Active'
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase border border-emerald-200">
                HARDWARE ACCESS CONTROL
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-xs text-stone-600 font-mono">Layer-2 MAC Whitelisting Policy</span>
            </div>
            <h2 className="text-2xl font-black text-[#1b431c] tracking-tight">
              सिस्टम मैक एड्रेस प्रबंधन / Device MAC Address Whitelist
            </h2>
            <p className="text-xs text-stone-600 font-medium max-w-2xl">
              Strict hardware-level enforcement: Only physical network adapters with approved MAC addresses can connect to this portal. Connection attempts from unregistered devices are denied regardless of IP routing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#1b5e20] hover:bg-[#144919] text-white px-3.5 py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Whitelist New Device MAC</span>
            </button>
          </div>
        </div>

        {/* Current Device Detection Status Card */}
        <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-stone-500 uppercase">
                Detected System MAC (This Machine)
              </span>
              <button
                onClick={handleCopyCurrentMac}
                className="text-stone-500 hover:text-stone-800 text-[10.5px] flex items-center gap-1 cursor-pointer"
                title="Copy MAC Address"
              >
                {copiedMac ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMac ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="font-mono text-sm font-black text-stone-900 tracking-wider">
              {currentMac}
            </p>
            <p className="text-[10px] text-stone-500 font-medium">
              NIC Adapter: Intel I219-LM Gigabit Ethernet
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-1">
            <span className="text-[10.5px] font-bold text-stone-500 uppercase">
              Hardware Access Status
            </span>
            <div className="flex items-center gap-2">
              {isCurrentDeviceWhitelisted ? (
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  AUTHENTICATED & WHITELISTED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-black text-red-800 bg-red-100 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                  UNAUTHORIZED / BLOCKED
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-500 font-medium">
              Hardware signature verified by NIC security vault
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-600">Active Devices:</span>
              <span className="font-black text-emerald-800 text-sm">{activeCount} / {devices.length}</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onClearCache}
                className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold py-1 px-2 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                title="Wipe session storage, dummy data, and local cache"
              >
                <Database className="w-3 h-3 text-stone-600" />
                <span>Flush App Cache</span>
              </button>
              <button
                type="button"
                onClick={onSimulateUnauthorizedMac}
                className={`flex-1 text-[11px] font-bold py-1 px-2 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                  isSimulatingUnauthorized
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                }`}
                title="Simulate connecting from an unauthorized MAC address"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>{isSimulatingUnauthorized ? 'Exit Test' : 'Test Block'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add Device Form (Drawer/Modal-like) */}
      {showAddForm && (
        <div className="bg-white rounded-lg border-2 border-emerald-600/60 p-5 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#1b5e20]" />
              <h3 className="text-sm font-extrabold text-stone-900">
                Register New Authorized Device (प्रशासनिक डिवाइस पंजीकरण)
              </h3>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-700 font-bold text-sm"
            >
              ×
            </button>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-semibold">
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Device Name (उपकरण नाम) *
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g. Meerut Kiosk Counter #2"
                required
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Hardware MAC Address *
              </label>
              <input
                type="text"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                placeholder="e.g. 74:D4:35:E2:81:09"
                maxLength={17}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Device Classification
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              >
                <option value="POS Kiosk">POS Kiosk (वितरण काउंटर)</option>
                <option value="Biometric Counter">Biometric Scanner Station</option>
                <option value="Admin Terminal">Admin Terminal (नोडल स्टेशन)</option>
                <option value="Mobile Dispenser">Mobile Dispenser (वैन पीओएस)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Static IP / Subnet
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="10.24.112.55"
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-stone-700 mb-1">
                Security Notes / Physical Kendra Location
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Meerut Main Depot, Gate Counter #2, Serial #SN-8921"
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#1b5e20] hover:bg-[#144919] text-white py-1.5 px-3 rounded text-xs font-extrabold transition-colors cursor-pointer"
              >
                Authorize MAC
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 py-1.5 px-2.5 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Whitelisted Hardware Table */}
      <div className="bg-white rounded-lg border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
              Registered Whitelisted Hardware Roster ({devices.length} Devices)
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            NIC MAC-Filter Hash: SHA-256 Validated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-3 px-4">Device Identity</th>
                <th className="py-3 px-4">Hardware MAC Address</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Network IP / Node</th>
                <th className="py-3 px-4">Authorized By</th>
                <th className="py-3 px-4">Access Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {devices.map((device) => {
                const isThisCurrentDevice =
                  device.macAddress.toUpperCase() === currentMac.toUpperCase();

                return (
                  <tr
                    key={device.id}
                    className={`hover:bg-stone-50/70 transition-colors ${
                      isThisCurrentDevice ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    {/* Device Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-stone-500 shrink-0" />
                        <div>
                          <p className="font-bold text-stone-900 text-xs">
                            {device.deviceName}
                          </p>
                          {isThisCurrentDevice && (
                            <span className="inline-block mt-0.5 text-[9.5px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 rounded uppercase">
                              ★ Current Connected System
                            </span>
                          )}
                          {device.notes && (
                            <p className="text-[10px] text-stone-500 mt-0.5 truncate max-w-xs">
                              {device.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* MAC Address */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded text-xs border border-stone-200 select-all">
                        {device.macAddress}
                      </span>
                    </td>

                    {/* Classification */}
                    <td className="py-3 px-4 font-medium text-stone-700">
                      {device.deviceType}
                    </td>

                    {/* Network IP */}
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                      {device.ipAddress || 'DHCP'}
                    </td>

                    {/* Authorized By */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-stone-800">{device.authorizedBy}</p>
                      <p className="text-[10px] text-stone-400">{device.addedAt}</p>
                    </td>

                    {/* Access Status */}
                    <td className="py-3 px-4">
                      {device.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Whitelisted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3 text-red-600" />
                          Blocked
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleStatus(device.id)}
                          className={`text-[11px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                            device.status === 'Active'
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          }`}
                          title={device.status === 'Active' ? 'Block MAC' : 'Unblock MAC'}
                        >
                          {device.status === 'Active' ? 'Revoke' : 'Activate'}
                        </button>

                        <button
                          onClick={() => onRemoveDevice(device.id)}
                          className="text-stone-400 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Device from Whitelist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
