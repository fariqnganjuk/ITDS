import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, CheckCircle, ShieldCheck, X, Share2, Layers } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>APK / App Aktif</span>
      </div>
    );
  }

  const handleAction = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) setShowModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleAction}
        id="btn-pwa-install"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install APK / PWA</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pasang Aplikasi NEXA</h3>
                <p className="text-xs text-slate-400">PWA / Standalone Mobile APK</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Keamanan Perbankan Standar</span>
                  Terenkripsi AES-256 lokal, mendukung notifikasi push, dan berjalan offline tanpa browser bar.
                </div>
              </div>

              {isIOS ? (
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 text-blue-200">
                  <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    Panduan Pemasangan iPhone & iPad:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Tekan ikon <strong>Share</strong> (Bagikan) di bilah navigasi Safari.</li>
                    <li>Geser ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Layar Utama).</li>
                    <li>Tekan <strong>Add</strong> di sudut kanan atas.</li>
                  </ol>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-900/40 text-sky-200">
                  <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-sky-400" />
                    Panduan Android & Desktop Chrome:
                  </div>
                  <p className="text-slate-300">
                    Klik tombol <strong>"Instal Sekarang"</strong> di bawah. Jika prompt tidak otomatis muncul, buka menu browser (titik 3) lalu pilih <strong>"Install app"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-semibold text-white text-xs shadow-lg shadow-sky-600/30 transition active:scale-95"
                >
                  Instal Sekarang
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-slate-300 text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-white shadow-xl shadow-amber-950/40 border border-amber-400/30 animate-pulse">
      <span className="h-2 w-2 rounded-full bg-white" />
      <span>Mode Offline — Data tersinkron dari cache lokal.</span>
    </div>
  );
};
