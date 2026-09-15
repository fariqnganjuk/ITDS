import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  DollarSign,
  Clock,
  Sparkles,
  Save
} from 'lucide-react';
import { getServices, getEstimatorRules, setEstimatorRules, logActivity } from '../../lib/storage';
import { EstimatorRule } from '../../types';

export const EstimatorRulesManagerView: React.FC = () => {
  const services = getServices();
  const [rules, setRules] = useState<EstimatorRule[]>(getEstimatorRules());
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New Rule Form State
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriceMod, setNewPriceMod] = useState(5000000);
  const [newDaysMod, setNewDaysMod] = useState(3);
  const [newIsDefault, setNewIsDefault] = useState(false);

  const currentRules = rules.filter(r => r.serviceId === selectedServiceId);

  const handleToggleDefault = (ruleId: string) => {
    const updated = rules.map(r => r.id === ruleId ? { ...r, isDefault: !r.isDefault } : r);
    setRules(updated);
    setEstimatorRules(updated);
    logActivity({
      action: 'ESTIMATOR_RULE_UPDATED',
      entityType: 'system',
      entityId: ruleId,
      meta: { field: 'isDefault' }
    });
    setSavedNotice('Aturan kalkulasi berhasil disimpan.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleDeleteRule = (ruleId: string) => {
    const updated = rules.filter(r => r.id !== ruleId);
    setRules(updated);
    setEstimatorRules(updated);
    logActivity({
      action: 'ESTIMATOR_RULE_DELETED',
      entityType: 'system',
      entityId: ruleId,
      meta: { ruleId }
    });
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newRule: EstimatorRule = {
      id: `rule_${Date.now()}`,
      serviceId: selectedServiceId,
      category: 'security',
      optionLabel: newLabel.trim(),
      description: newDesc.trim(),
      priceModifier: Number(newPriceMod),
      deliveryDaysModifier: Number(newDaysMod),
      isDefault: newIsDefault
    };

    const updated = [...rules, newRule];
    setRules(updated);
    setEstimatorRules(updated);
    logActivity({
      action: 'ESTIMATOR_RULE_CREATED',
      entityType: 'system',
      entityId: newRule.id,
      meta: { label: newRule.optionLabel, price: newRule.priceModifier }
    });

    setIsAddingRule(false);
    setNewLabel('');
    setNewDesc('');
    setSavedNotice(`Aturan baru "${newRule.optionLabel}" berhasil disinkronkan ke publik estimator.`);
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Dynamic Rule Formula Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white">Kelola Aturan & Modifiers Estimator</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Formula harga: <code className="font-mono text-sky-400">harga = base_price + sum(modifiers)</code>. Dikelola tanpa hardcode dan langsung aktif di kalkulator publik.
          </p>
        </div>

        <button
          onClick={() => setIsAddingRule(!isAddingRule)}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddingRule ? 'Tutup Form' : 'Tambah Opsi / Fitur'}</span>
        </button>
      </div>

      {/* Service Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {services.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedServiceId(s.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedServiceId === s.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {s.name} (Base: Rp {(s.basePrice / 1000000).toFixed(0)} Jt)
          </button>
        ))}
      </div>

      {/* Add New Rule Form */}
      {isAddingRule && (
        <form onSubmit={handleCreateRule} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs animate-in fade-in">
          <h3 className="text-sm font-bold text-white">Tambah Opsi Baru untuk Layanan Terpilih</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1">Label Opsi *</label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Contoh: Modul AI Recommendation Engine"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Penjelasan fitur yang didapat klien..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 block mb-1">Modifier Harga (IDR) *</label>
              <input
                type="number"
                step="500000"
                required
                value={newPriceMod}
                onChange={e => setNewPriceMod(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">Tambahan Hari Pengerjaan</label>
              <input
                type="number"
                min="0"
                value={newDaysMod}
                onChange={e => setNewDaysMod(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sky-400 font-mono outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="check-default"
                checked={newIsDefault}
                onChange={e => setNewIsDefault(e.target.checked)}
                className="rounded text-sky-600 focus:ring-0"
              />
              <label htmlFor="check-default" className="text-slate-300">Pilih secara default</label>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs shadow-lg shadow-emerald-600/30"
          >
            Simpan Aturan Opsi
          </button>
        </form>
      )}

      {/* Rules Table */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/60">
          {currentRules.map(rule => (
            <div key={rule.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{rule.optionLabel}</span>
                  {rule.isDefault && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                      DEFAULT ON
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs">{rule.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="font-mono text-slate-400">kategori: {rule.category}</span>
                  <span>&bull;</span>
                  <span className="text-sky-400">+{rule.deliveryDaysModifier} hari kerja</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Harga Modifier</div>
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    +Rp {rule.priceModifier.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleDefault(rule.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    {rule.isDefault ? 'Matikan Default' : 'Jadikan Default'}
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    title="Hapus Aturan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
