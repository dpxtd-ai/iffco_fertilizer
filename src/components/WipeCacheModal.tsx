import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface WipeCacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmWipe: (resetOperators: boolean) => void;
  officerName: string;
}

export const WipeCacheModal: React.FC<WipeCacheModalProps> = ({
  isOpen,
  onClose,
  onConfirmWipe,
  officerName,
}) => {
  const [includeOperators, setIncludeOperators] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [wipedSuccess, setWipedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWipe = () => {
    setIsWiping(true);
    setTimeout(() => {
      onConfirmWipe(includeOperators);
      setIsWiping(false);
      setWipedSuccess(true);
      setTimeout(() => {
        setWipedSuccess(false);
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-red-700 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-200" />
            <div>
              <h3 className="text-sm font-bold leading-tight">
                Wipe Temporary Cache & Application Data
              </h3>
              <p className="text-[11px] text-red-200">
                Admin Exclusive Operation • {officerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-red-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {wipedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">
                Temporary Cache & Data Successfully Wiped!
              </h4>
              <p className="text-xs text-emerald-700 font-medium">
                All temporary cached files, form drafts, and session queues have been purged.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Admin Cache Wipe Warning</p>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    This action will purge all temporary cached data, registration queue drafts, 
                    session storage caches, and reset application state to clean status.
                  </p>
                </div>
              </div>

              <div className="text-xs text-stone-700 space-y-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <p className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  What will be purged:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600">
                  <li>Temporary browser and session storage cache</li>
                  <li>Pending/unapproved Kisan registration temporary cache</li>
                  <li>Temporary DBT transaction audit logs</li>
                  <li>Form inputs and validation draft buffers</li>
                </ul>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-stone-800 font-medium cursor-pointer p-2 rounded hover:bg-stone-50 border border-stone-200">
                <input
                  type="checkbox"
                  checked={includeOperators}
                  onChange={(e) => setIncludeOperators(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>Also reset Operator Accounts to initial defaults</span>
              </label>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!wipedSuccess && (
          <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isWiping}
              onClick={handleWipe}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isWiping ? 'Purging Cache...' : 'Confirm & Wipe Cache'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
