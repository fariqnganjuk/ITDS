import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Check,
  Plus,
  ShieldCheck,
  Clock,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LanguageCode, ServiceItem, EstimatorRule } from '../../types';
import { DICTIONARY } from '../../lib/i18n';
import { getServices, getEstimatorRules, addLead } from '../../lib/storage';

interface EstimatorPageProps {
  onNavigate: (path: string) => void;
  currentLang: LanguageCode;
}

export const EstimatorPage: React.FC<EstimatorPageProps> = ({ onNavigate, currentLang }) => {
  const t = DICTIONARY[currentLang].estimator;
  const services = getServices();
  const allRules = getEstimatorRules();

  // Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  // Available rules for this service
  const serviceRules = useMemo(() => {
    return allRules.filter(r => r.serviceId === selectedServiceId);
  }, [allRules, selectedServiceId]);

  // Selected options (set of rule IDs)
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>(() => {
    return allRules.filter(r => r.serviceId === services[0]?.id && r.isDefault).map(r => r.id);
  });

  // Proposal lead form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  // Switch service and reset rules to its defaults
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const defaults = allRules.filter(r => r.serviceId === serviceId && r.isDefault).map(r => r.id);
    setSelectedRuleIds(defaults);
  };

  const toggleRule = (ruleId: string) => {
    setSelectedRuleIds(prev => {
      if (prev.includes(ruleId)) {
        return prev.filter(id => id !== ruleId);
      } else {
        return [...prev, ruleId];
      }
    });
  };

  // Rule-based formula calculation:
  // total = basePrice + sum(rule modifiers)
  const selectedRules = useMemo(() => {
    return serviceRules.filter(r => selectedRuleIds.includes(r.id));
  }, [serviceRules, selectedRuleIds]);

  const totalCalculatedPrice = useMemo(() => {
    const base = selectedService ? selectedService.basePrice : 0;
    const modifiersTotal = selectedRules.reduce((sum, r) => sum + r.priceModifier, 0);
    return base + modifiersTotal;
  }, [selectedService, selectedRules]);

  const totalEstimatedDays = useMemo(() => {
    const baseDays = selectedService ? selectedService.estimatedWeeks * 7 : 21;
    const addDays = selectedRules.reduce((sum, r) => sum + r.deliveryDaysModifier, 0);
    return baseDays + addDays;
  }, [selectedService, selectedRules]);

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newLead = addLead({
        name,
        email,
        phone,
        companyName,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        selectedOptionIds: selectedRuleIds,
        estimatedPrice: totalCalculatedPrice,
        currency: 'IDR',
        status: 'New',
        source: 'Estimator',
        notes
      });
      setIsSubmitting(false);
      setSubmittedLeadId(newLead.id);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {submittedLeadId ? (
        /* SUCCESS CONFIRMATION */
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Estimasi Berhasil Terkirim!</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {t.successMessage}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">ID Referensi:</span>
              <span className="font-mono text-sky-400 font-bold">#{submittedLeadId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Layanan:</span>
              <span className="text-white font-medium">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimasi Biaya:</span>
              <span className="text-emerald-400 font-bold">Rp {totalCalculatedPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimasi Durasi:</span>
              <span className="text-slate-200">{Math.ceil(totalEstimatedDays / 7)} Minggu ({totalEstimatedDays} Hari)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('/kontak')}
              className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Pilih Jadwal Konsultasi</span>
            </button>
            <button
              onClick={() => {
                setSubmittedLeadId(null);
                setName('');
                setEmail('');
                setPhone('');
                setCompanyName('');
                setNotes('');
              }}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
            >
              Hitung Ulang
            </button>
          </div>
        </div>
      ) : (
        /* MULTI-STEP ESTIMATOR INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: STEP 1 & STEP 2 */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Select Service */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center">1</span>
                <span>{t.step1}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map(s => {
                  const isSelected = s.id === selectedServiceId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectService(s.id)}
                      className={`p-4 rounded-xl cursor-pointer border transition text-left flex flex-col justify-between ${
                        isSelected
                          ? 'bg-sky-950/40 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                            {s.category}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">{s.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.shortDesc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Base:</span>
                        <span className="font-bold text-white">Rp {s.basePrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Custom Modifiers & Add-ons */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center">2</span>
                  <span>{t.step2}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {selectedRules.length} Opsi Dipilih
                </span>
              </div>

              <div className="space-y-2.5">
                {serviceRules.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950 text-center text-xs text-slate-400">
                    Tidak ada aturan opsi kustom untuk layanan ini. Harga mengacu pada paket base.
                  </div>
                ) : (
                  serviceRules.map(rule => {
                    const isChecked = selectedRuleIds.includes(rule.id);
                    return (
                      <div
                        key={rule.id}
                        onClick={() => toggleRule(rule.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-4 ${
                          isChecked
                            ? 'bg-sky-950/30 border-sky-500/80 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition ${
                              isChecked ? 'bg-sky-600 text-white' : 'border border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{rule.optionLabel}</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{rule.description}</p>
                            {rule.deliveryDaysModifier > 0 && (
                              <div className="flex items-center gap-1 text-[10px] text-sky-400 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>+{rule.deliveryDaysModifier} hari pengerjaan</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-sky-400">
                            +Rp {rule.priceModifier.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: REAL-TIME CALCULATION & SUBMIT FORM */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Calculation Summary Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.step3}</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Formula Real-Time
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{selectedService.name} (Base)</span>
                  <span className="font-semibold text-white">Rp {selectedService.basePrice.toLocaleString('id-ID')}</span>
                </div>

                {selectedRules.map(r => (
                  <div key={r.id} className="flex justify-between text-slate-400 pl-2 border-l border-slate-800 text-[11px]">
                    <span className="truncate max-w-[200px]">{r.optionLabel}</span>
                    <span className="text-sky-400 font-mono">+Rp {r.priceModifier.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              {/* Total Price */}
              <div className="pt-4 border-t border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">{t.estimatedTotal}</div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                    Rp {totalCalculatedPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Estimasi Pengerjaan: <strong className="text-white">{Math.ceil(totalEstimatedDays / 7)} Minggu ({totalEstimatedDays} Hari Kerja)</strong></span>
                </div>
              </div>

              {/* Lead Request Form */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.requestProposal}</span>
                </h4>

                <form onSubmit={handleSubmitLead} className="space-y-3 text-xs">
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t.name + ' *'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t.email + ' *'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-slate-200 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder={t.phone}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-slate-200 outline-none"
                    />
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder={t.company}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder={t.notes}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-slate-200 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Menyimpan Pengajuan...</span>
                    ) : (
                      <>
                        <span>{t.submitLead}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
