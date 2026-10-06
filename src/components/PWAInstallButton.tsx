import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside standalone PWA window, suppress install prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'sidebar') {
      return (
        <button
          type="button"
          onClick={install}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-800 hover:to-green-900 text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ऐप इंस्टॉल करें / Install PWA</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 bg-[#14532d] hover:bg-[#0f4022] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer border border-emerald-500/30"
        title="Install PM Kisan Portal as a desktop or mobile application"
      >
        <Download className="w-3.5 h-3.5 text-emerald-300" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported on WebKit, so provide guided guide)
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            variant === 'sidebar'
              ? 'w-full justify-center py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1.5 border border-stone-300 shadow-2xs'
          }`}
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
                    IFFCO
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Install on iPhone / iPad</h3>
                    <p className="text-[10px] text-stone-500">PM Kisan Urvarak Seva Portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    1
                  </span>
                  <p>
                    Tap the <strong>Share</strong> button (
                    <span className="inline-block px-1 bg-stone-100 rounded text-[11px] font-mono">⎋</span>
                    ) in the Safari toolbar at the bottom of your screen.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    2
                  </span>
                  <p>
                    Scroll down and tap <strong>Add to Home Screen (होम स्क्रीन में जोड़ें)</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    3
                  </span>
                  <p>
                    Tap <strong>Add</strong> in the top-right corner to launch directly from your home screen with offline caching.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-lg bg-[#1b5e20] hover:bg-[#144919] py-2 text-xs font-bold text-white shadow-xs transition"
              >
                Got it / समझ गए
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
