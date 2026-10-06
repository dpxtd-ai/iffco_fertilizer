import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Notification"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-200 border border-amber-500"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-amber-100" />
      <div>
        <span className="font-bold">Offline Mode / ऑफ़लाइन मोड:</span>{' '}
        <span className="text-amber-100 font-normal">Working from local cached storage.</span>
      </div>
      <span className="h-2 w-2 rounded-full bg-white animate-pulse shrink-0 ml-1" />
    </aside>
  );
};
