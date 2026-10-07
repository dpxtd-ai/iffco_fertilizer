import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  X, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Wifi, 
  ShieldCheck 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'login-header' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, browserType, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside standalone PWA window, suppress install prompt
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  // Render button based on variant
  const renderTriggerButton = () => {
    if (variant === 'sidebar') {
      return (
        <button
          type="button"
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-emerald-800 to-green-900 hover:from-emerald-900 hover:to-green-950 text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer border border-emerald-600/40"
        >
          <Download className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
          <span>ऐप डाउनलोड करें / Install PWA</span>
        </button>
      );
    }

    if (variant === 'login-header') {
      return (
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-2.5 py-1 rounded text-xs font-bold transition-all border border-emerald-500/40 shadow-xs cursor-pointer"
          title="Install / Download App on this device"
        >
          <Download className="w-3 h-3 text-emerald-300" />
          <span>Download App / ऐप इंस्टॉल</span>
        </button>
      );
    } 

    // Default: 'header' variant
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 bg-[#14532d] hover:bg-[#0f4022] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer border border-emerald-500/30"
        title="Install PM Kisan Portal as a desktop or mobile application"
      >
        <Download className="w-3.5 h-3.5 text-emerald-300" />
        <span className="hidden sm:inline">Download App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  };

  return (
    <>
      {renderTriggerButton()}

      {/* Interactive PWA Install Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#14532d] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                  IFFCO
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900 leading-tight">
                    Install PM Kisan Urvarak App
                  </h3>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    प्रोग्रेसिव वेब ऐप (PWA) • Desktop & Mobile Kiosk
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If 1-Click install is immediately ready in the browser */}
            {isInstallable && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <p className="font-extrabold text-emerald-950">1-Click Direct Install Ready</p>
                  <p className="text-[11px] text-emerald-800">Your browser supports instant installation.</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowGuide(false);
                  }}
                  className="bg-[#1b5e20] hover:bg-[#144919] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  Install Now
                </button>
              </div>
            )}

            {/* Step-by-step instructions based on device / browser */}
            <div className="py-4 space-y-3.5 text-xs text-stone-700">
              <p className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>How to Install on your Device (चरण-दर-चरण निर्देश):</span>
              </p>

              {/* iOS Safari Instructions */}
              {isIOS ? (
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      1
                    </span>
                    <p>
                      Tap the <strong>Share button (शेयर)</strong> (
                      <span className="inline-block px-1 bg-stone-200 rounded text-[11px] font-mono">⎋</span>
                      ) at the bottom toolbar in Safari.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      2
                    </span>
                    <p>
                      Scroll down and tap <strong>Add to Home Screen (होम स्क्रीन में जोड़ें)</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      3
                    </span>
                    <p>
                      Tap <strong>Add</strong> at top right. The portal will appear directly on your home screen!
                    </p>
                  </div>
                </div>
              ) : isAndroid ? (
                /* Android Chrome Instructions */
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      1
                    </span>
                    <p>
                      Tap the <strong>three dots menu (⋮)</strong> at the top right of your Chrome browser.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      2
                    </span>
                    <p>
                      Select <strong>"Install app"</strong> or <strong>"Add to Home screen" (ऐप इंस्टॉल करें)</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      3
                    </span>
                    <p>
                      Confirm by tapping <strong>Install</strong>. The app launches full-screen like a native app.
                    </p>
                  </div>
                </div>
              ) : (
                /* Desktop Chrome / Edge Instructions */
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      1
                    </span>
                    <p>
                      Look at the <strong>top URL address bar</strong> of your browser (on the right side).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      2
                    </span>
                    <p>
                      Click the <strong>Install icon (⤓ or ⊕)</strong> in the address bar, or click browser menu (<strong>⋮</strong> / <strong>⋯</strong>) → <strong>"Save and share"</strong> → <strong>"Install PM Kisan Urvarak..."</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                      3
                    </span>
                    <p>
                      Click <strong>Install</strong> on the confirmation popup to run as an independent desktop window.
                    </p>
                  </div>
                </div>
              )}

              {/* Key Features of PWA */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-600 bg-stone-100/70 p-2 rounded-lg">
                  <Wifi className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Works 100% Offline (ऑफ़लाइन कार्य)</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 bg-stone-100/70 p-2 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Zero App Store Needed</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="w-full rounded-xl bg-[#1b5e20] hover:bg-[#144919] py-2.5 text-xs font-extrabold text-white shadow-xs transition cursor-pointer"
              >
                Got It / ठीक है
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
