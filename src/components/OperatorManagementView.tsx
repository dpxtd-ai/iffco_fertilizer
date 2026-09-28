import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  Trash2, 
  Copy, 
  Check,
  AlertCircle
} from 'lucide-react';
import { OperatorAccount } from '../types';

interface OperatorManagementViewProps {
  currentMac: string;
  operators: OperatorAccount[];
  onAddOperator: (operator: Omit<OperatorAccount, 'id' | 'createdAt'>) => void;
  onToggleStatus: (id: string) => void;
  onDeleteOperator: (id: string) => void;
  onUpdateOperatorMac: (id: string, newMac: string) => void;
}

export const OperatorManagementView: React.FC<OperatorManagementViewProps> = ({
  currentMac,
  operators,
  onAddOperator,
  onToggleStatus,
  onDeleteOperator,
  onUpdateOperatorMac,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('Operator@2025');
  const [contactNumber, setContactNumber] = useState('');
  const [counterId, setCounterId] = useState('MRT-POS-0419');
  const [macAddress, setMacAddress] = useState(currentMac);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedMac, setCopiedMac] = useState(false);

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

  const handleUseCurrentMac = () => {
    setMacAddress(currentMac);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const formattedMac = macAddress.trim().toUpperCase().replace(/-/g, ':');

    if (!name.trim()) {
      setFormError('Please enter operator name.');
      return;
    }
    if (!userId.trim()) {
      setFormError('Please enter operator login user ID.');
      return;
    }
    if (!isValidMac(formattedMac)) {
      setFormError('Invalid MAC Address format. Required: XX:XX:XX:XX:XX:XX.');
      return;
    }

    // Check duplicate userId
    if (operators.some((op) => op.userId.toLowerCase() === userId.trim().toLowerCase())) {
      setFormError('An operator with this User ID / Email already exists.');
      return;
    }

    onAddOperator({
      name: name.trim(),
      userId: userId.trim().toLowerCase(),
      password: password.trim() || 'Operator@2025',
      contactNumber: contactNumber.trim() || '+91 9721682369',
      counterId: counterId.trim() || '#104',
      macAddress: formattedMac,
      status: 'Active',
      lastLogin: 'Never',
    });

    setSuccessMsg(`Operator "${name}" added successfully and bound to Hardware MAC ${formattedMac}.`);
    setTimeout(() => setSuccessMsg(''), 4000);

    setName('');
    setUserId('');
    setContactNumber('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase border border-emerald-200">
                ADMINISTRATIVE SECURITY CONSOLE
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-xs text-stone-600 font-mono">Operator & Hardware Device Management</span>
            </div>
            <h2 className="text-2xl font-black text-[#1b431c] tracking-tight">
              ऑपरेटर एवं डिवाइस प्रबंधन / Operator & MAC Device Management
            </h2>
            <p className="text-xs text-stone-600 font-medium max-w-2xl">
              As Kendra Administrator, register authorized counter operators, set credentials, and bind each operator account to a physical system MAC address. Operators can only register farmers and dispense urea from their authorized device.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#1b5e20] hover:bg-[#144919] text-white px-3.5 py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Operator & Device MAC</span>
            </button>
          </div>
        </div>

        {/* Current Station Hardware Quick View */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-emerald-700" />
            <div>
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Current Terminal Hardware MAC</span>
              <span className="font-mono font-bold text-stone-900 text-sm">{currentMac}</span>
            </div>
          </div>

          <button
            onClick={handleCopyCurrentMac}
            className="text-stone-600 hover:text-stone-900 font-semibold bg-white border border-stone-300 hover:bg-stone-100 px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copiedMac ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMac ? 'Copied MAC' : 'Copy MAC'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add Operator Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border-2 border-emerald-600/70 p-5 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#1b5e20]" />
              <h3 className="text-sm font-extrabold text-stone-900">
                Register New Kendra Operator (नया ऑपरेटर एवं डिवाइस जोड़ें)
              </h3>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-700 font-bold text-sm">
              ×
            </button>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Operator Full Name (ऑपरेटर का नाम) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sudhir Kumar"
                required
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Operator User ID / Email *
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. operator id"
                required
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Password (पासवर्ड) *
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                required
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Contact Mobile Number
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 94120 44552"
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Assigned Counter / Station
              </label>
              <input
                type="text"
                value={counterId}
                onChange={(e) => setCounterId(e.target.value)}
                placeholder="e.g. MRT-POS-0419"
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700">
                  Hardware Device MAC *
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentMac}
                  className="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                >
                  Use Current System MAC
                </button>
              </div>
              <input
                type="text"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                placeholder="XX:XX:XX:XX:XX:XX"
                maxLength={17}
                required
                className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white uppercase"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3 flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 py-1.5 px-3 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#1b5e20] hover:bg-[#144919] text-white py-1.5 px-4 rounded text-xs font-extrabold transition-colors cursor-pointer"
              >
                Save & Whitelist Operator
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Operators List Table */}
      <div className="bg-white rounded-lg border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
              Authorized Kendra Operators Roster ({operators.length} Operators)
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            Policy: MAC Address Verified on Login
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10.5px]">
                <th className="py-3 px-4">Operator Name & ID</th>
                <th className="py-3 px-4">Contact & Counter</th>
                <th className="py-3 px-4">Hardware MAC Binding</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {operators.map((op) => {
                const isMatchingCurrentMac =
                  op.macAddress.toUpperCase() === currentMac.toUpperCase();

                return (
                  <tr
                    key={op.id}
                    className={`hover:bg-stone-50/70 transition-colors ${
                      isMatchingCurrentMac ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    {/* Operator Name & ID */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900 text-xs">{op.name}</p>
                      <p className="text-[10.5px] font-mono text-stone-500">{op.userId}</p>
                      <p className="text-[10px] text-stone-400">Password: {op.password || '••••••••'}</p>
                    </td>

                    {/* Contact & Counter */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-800">{op.counterId}</p>
                      <p className="text-[10.5px] font-mono text-stone-500">{op.contactNumber}</p>
                    </td>

                    {/* Bound MAC Address */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-xs border border-stone-200 select-all block w-fit">
                        {op.macAddress}
                      </span>
                      {isMatchingCurrentMac ? (
                        <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 rounded uppercase mt-0.5 inline-block">
                          ✓ Matches This Workstation
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdateOperatorMac(op.id, currentMac)}
                          className="text-[9.5px] text-blue-700 hover:underline font-bold mt-0.5 inline-block cursor-pointer"
                          title="Assign this workstation's MAC to this operator"
                        >
                          Bind to This System MAC
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {op.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3 text-red-600" />
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-stone-500 font-medium">
                      {op.createdAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleStatus(op.id)}
                          className={`text-[11px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                            op.status === 'Active'
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {op.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          onClick={() => onDeleteOperator(op.id)}
                          className="text-stone-400 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Operator"
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
