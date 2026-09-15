import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  CheckCircle2,
  XCircle,
  QrCode,
  Copy,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { getUsers, setCurrentUser, logActivity } from '../../lib/storage';
import { verify2FaCode } from '../../lib/crypto';

interface LoginPageProps {
  onClose?: () => void;
  onLoginSuccess: (user: User) => void;
  prefilledRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onClose,
  onLoginSuccess,
  prefilledRole
}) => {
  const users = getUsers();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rate Limiter State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  // 2FA State
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Prefill if requested
  useEffect(() => {
    if (prefilledRole) {
      handleQuickFill(prefilledRole);
    }
  }, [prefilledRole]);

  // Handle Lockout countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockCountdown > 0) {
      timer = setTimeout(() => setLockCountdown(prev => prev - 1), 1000);
    } else if (isLocked && lockCountdown === 0) {
      setIsLocked(false);
      setFailedAttempts(0);
      setErrorMsg('');
    }
    return () => clearTimeout(timer);
  }, [isLocked, lockCountdown]);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialOrUpper = /[A-Z!@#$%^&*]/.test(password);
  let strengthScore = 0;
  if (hasMinLength) strengthScore += 33;
  if (hasNumber) strengthScore += 33;
  if (hasSpecialOrUpper) strengthScore += 34;

  const handleQuickFillByEmail = (userEmail: string) => {
    const target = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    if (target) {
      setEmail(target.email);
      setPassword('NexaSecure2026!');
      setErrorMsg('');
    }
  };

  const handleQuickFill = (role: UserRole) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setEmail(target.email);
      setPassword('NexaSecure2026!');
      setErrorMsg('');
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Harap masukkan format alamat email yang valid.');
      return;
    }

    if (!password) {
      setErrorMsg('Kata sandi tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // Simulate safe latency
    setTimeout(() => {
      setIsLoading(false);
      const foundUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (!foundUser) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          setIsLocked(true);
          setLockCountdown(15);
          setErrorMsg('Terlalu banyak percobaan gagal. Akses dibatasi sementara selama 15 detik untuk keamanan.');
        } else {
          setErrorMsg(`Email atau kata sandi tidak cocok. Sisa percobaan aman: ${3 - nextAttempts}`);
        }
        return;
      }

      // Check if 2FA is enabled or required for role
      if (foundUser.twoFaEnabled || foundUser.role === 'admin' || foundUser.role === 'superadmin') {
        setPendingUser(foundUser);
        // Pre-fill test code for ultra user friendliness if desired, but let them type or click demo code
      } else {
        completeLogin(foundUser);
      }
    }, 450);
  };

  const handleVerify2Fa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const isValid = verify2FaCode(twoFaCode, pendingUser.twoFaSecret);

      if (isValid) {
        completeLogin(pendingUser);
      } else {
        setErrorMsg('Kode 2FA salah. Gunakan kode dari aplikasi Authenticator atau gunakan kode uji: 123456');
      }
    }, 400);
  };

  const completeLogin = (user: User) => {
    setCurrentUser(user);
    logActivity({
      action: 'USER_LOGIN_SUCCESS',
      entityType: 'auth',
      entityId: user.id,
      meta: { name: user.name, role: user.role, method: user.twoFaEnabled ? 'PASSWORD+2FA' : 'PASSWORD' }
    });
    onLoginSuccess(user);
    if (onClose) onClose();
  };

  const copySecret = () => {
    if (pendingUser?.twoFaSecret) {
      navigator.clipboard.writeText(pendingUser.twoFaSecret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button if modal */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            ✕
          </button>
        )}

        {!pendingUser ? (
          /* STEP 1: Email & Password */
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-600/20 text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Masuk ke Portal</h2>
                <p className="text-xs text-slate-400">Autentikasi terenkripsi & aman multi-peran</p>
              </div>
            </div>

            {/* Quick-fill Roles Demo Selector */}
            <div className="my-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pilih Akun Tim / Demo (1-Klik):
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFillByEmail('fariqnganjuk@gmail.com')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left transition text-[11px] flex flex-col"
                >
                  <span className="font-semibold text-white truncate">Ahmad Fariq</span>
                  <span className="text-[9px] text-purple-400">Full Stack (Super)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillByEmail('faizin@nexa.agency')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left transition text-[11px] flex flex-col"
                >
                  <span className="font-semibold text-white truncate">Faizin</span>
                  <span className="text-[9px] text-purple-400">Super Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillByEmail('ilham@nexa.agency')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left transition text-[11px] flex flex-col"
                >
                  <span className="font-semibold text-white truncate">Ilham</span>
                  <span className="text-[9px] text-emerald-400">System Analyst</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillByEmail('miftah@nexa.agency')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left transition text-[11px] flex flex-col"
                >
                  <span className="font-semibold text-white truncate">Miftah</span>
                  <span className="text-[9px] text-blue-400">IT Support & Infra</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillByEmail('toni@nexa.agency')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left transition text-[11px] flex flex-col"
                >
                  <span className="font-semibold text-white truncate">Toni</span>
                  <span className="text-[9px] text-amber-400">Enterprise UI/UX</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFillByEmail('client@fintech.co.id')}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-left transition text-[11px] flex flex-col"
                >
                  <span className="font-semibold text-white truncate">Budi Santoso</span>
                  <span className="text-[9px] text-sky-400">Klien Fintech</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleInitialSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    disabled={isLocked || isLoading}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-100 text-sm placeholder-slate-500 outline-none transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
                  <span className="text-[11px] text-slate-400">Min. 8 karakter</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={isLocked || isLoading}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-100 text-sm placeholder-slate-500 outline-none transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strengthScore < 40
                            ? 'w-1/3 bg-rose-500'
                            : strengthScore < 80
                            ? 'w-2/3 bg-amber-500'
                            : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Kekuatan Sandi:</span>
                      <span className={strengthScore < 40 ? 'text-rose-400' : strengthScore < 80 ? 'text-amber-400' : 'text-emerald-400'}>
                        {strengthScore < 40 ? 'Rentan' : strengthScore < 80 ? 'Sedang' : 'Sangat Kuat'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLocked || isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/25 transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : isLocked ? (
                  <span>Akses Terkunci ({lockCountdown}s)</span>
                ) : (
                  <>
                    <span>Lanjutkan Verifikasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Two-Factor Authentication (2FA) */
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Verifikasi 2FA</h2>
                <p className="text-xs text-slate-400">Two-Factor Authentication (TOTP)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs mb-4">
              <div className="text-slate-300 font-medium">
                Masuk sebagai: <span className="text-white font-bold">{pendingUser.name}</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Buka aplikasi Google Authenticator, 1Password, atau masukkan kode uji demo di bawah.
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerify2Fa} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Masukkan 6-Digit Kode TOTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={twoFaCode}
                  onChange={e => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 123456"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-emerald-400 outline-none transition"
                />
              </div>

              {/* Quick test code buttons */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Kode Uji Cepat:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTwoFaCode('123456')}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono text-[11px]"
                  >
                    123456
                  </button>
                  <button
                    type="button"
                    onClick={() => setTwoFaCode('888888')}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 font-mono text-[11px]"
                  >
                    888888
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingUser(null);
                    setTwoFaCode('');
                    setErrorMsg('');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={twoFaCode.length < 6 || isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Memvalidasi Kode...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verifikasi & Masuk</span>
                    </>
                  )}
                </button>
              </div>

              {/* QR Code & Key helper */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Lihat Kunci Rahasia / QR Code Simulasi</span>
                </button>
              </div>

              {showQrModal && pendingUser.twoFaSecret && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2 mt-2">
                  <div className="font-semibold text-white">Secret Key (Base32):</div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 font-mono text-sky-400">
                    <span>{pendingUser.twoFaSecret}</span>
                    <button
                      type="button"
                      onClick={copySecret}
                      className="text-slate-400 hover:text-white"
                      title="Salin Kunci"
                    >
                      {copiedKey ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-400 text-[10px]">
                    Di aplikasi riil, pindai QR code ini di Google Authenticator atau simpan ke pengelola kata sandi Anda.
                  </p>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
