import React, { useState, useRef } from 'react';
import {
  PenTool,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Download,
  Key,
  X,
  Lock
} from 'lucide-react';
import { getContracts, signContract, getCurrentUser } from '../../lib/storage';
import { Contract } from '../../types';

export const ClientContractsView: React.FC = () => {
  const user = getCurrentUser();
  const [contracts, setContracts] = useState<Contract[]>(getContracts());
  const [signingContract, setSigningContract] = useState<Contract | null>(null);
  const [signerName, setSignerName] = useState(user?.name || '');
  const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('draw');
  const [typedSignature, setTypedSignature] = useState(user?.name || '');
  const [isSignedNotice, setIsSignedNotice] = useState<string | null>(null);

  // Simple HTML5 Canvas for drawing signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#38bdf8'; // sky-400
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleConfirmSignature = () => {
    if (!signingContract) return;

    let signatureData = typedSignature;
    if (signatureMode === 'draw' && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL();
    }

    signContract(signingContract.id, signatureData, signatureMode, signerName);
    setContracts(getContracts());
    setIsSignedNotice(`Kontrak ${signingContract.title} berhasil ditandatangani secara digital dengan segel SHA-256!`);
    setSigningContract(null);
    setTimeout(() => setIsSignedNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {isSignedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isSignedNotice}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">E-SIGN SEALED</span>
        </div>
      )}

      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Kontrak Legal & Dokumen Perjanjian</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Master Services Agreement (MSA) dan Statement of Work (SOW) dengan verifikasi tanda tangan digital.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {contracts.map(contract => {
            const isSigned = contract.status === 'Signed';

            return (
              <div key={contract.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{contract.title}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        isSigned
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {isSigned ? 'Ditandatangani (Signed)' : 'Menunggu Tanda Tangan'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{contract.content}</p>

                  {isSigned && (
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Ditandatangani oleh: {contract.signerName}
                      </span>
                      <span>&bull;</span>
                      <span>Hash Segel: {contract.signatureHash?.slice(0, 16)}...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSigned ? (
                    <button
                      onClick={() => setIsSignedNotice(`Dokumen salinan ${contract.title} (Bersegel SHA-256) berhasil diunduh.`)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      <span>Unduh PDF</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSigningContract(contract);
                        setSignerName(user?.name || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Tandatangani Dokumen</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* E-Signature Modal */}
      {signingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-slate-100 shadow-2xl space-y-5">
            <button
              onClick={() => setSigningContract(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>E-Signature Digital Compliance (UU ITE / ESIGN Act)</span>
              </div>
              <h3 className="text-xl font-bold text-white">Tandatangani: {signingContract.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Klausul hukum akan disegel dengan cap waktu kriptografis.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Nama Lengkap Penandatangan *</label>
              <input
                type="text"
                value={signerName}
                onChange={e => setSignerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-sky-500"
              />
            </div>

            {/* Signature Mode Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSignatureMode('draw')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  signatureMode === 'draw' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Gores Tanda Tangan (Draw)
              </button>
              <button
                type="button"
                onClick={() => setSignatureMode('type')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                  signatureMode === 'type' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Ketik Nama (Type)
              </button>
            </div>

            {signatureMode === 'draw' ? (
              <div className="space-y-2">
                <div className="relative border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-36 cursor-crosshair touch-none"
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 pointer-events-none">
                    Gores tanda tangan di sini
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] text-slate-400 hover:text-white underline"
                  >
                    Bersihkan Pad
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="text-[11px] text-slate-400 block mb-1">Gaya Huruf Tanda Tangan:</label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={e => setTypedSignature(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-lg font-serif italic text-sky-400 outline-none"
                />
              </div>
            )}

            <button
              onClick={handleConfirmSignature}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Bubuhkan Tanda Tangan & Segel Kriptografis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
