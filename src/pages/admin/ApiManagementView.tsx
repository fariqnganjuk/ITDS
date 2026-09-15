import React, { useState } from 'react';
import {
  Code2,
  Key,
  Copy,
  CheckCircle2,
  Terminal,
  Play,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { getApiKeys, addApiKey, revokeApiKey } from '../../lib/storage';
import { getServices, getEstimatorRules, getProjects } from '../../lib/storage';
import { ApiKeyItem } from '../../types';

export const ApiManagementView: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(getApiKeys());
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // API Tester State
  const [selectedEndpoint, setSelectedEndpoint] = useState<'services' | 'calculate' | 'projects'>('services');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    addApiKey(newKeyName.trim(), ['read:services', 'read:projects', 'write:leads']);
    setApiKeys(getApiKeys());
    setNewKeyName('');
  };

  const handleRevokeKey = (id: string) => {
    revokeApiKey(id);
    setApiKeys(getApiKeys());
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleTestEndpoint = () => {
    setIsCallingApi(true);
    setTimeout(() => {
      let data: any = {};
      if (selectedEndpoint === 'services') {
        data = {
          status: 'success',
          version: 'v1.2.0',
          data: getServices().map(s => ({
            id: s.id,
            name: s.name,
            category: s.category,
            basePrice: s.basePrice,
            estimatedWeeks: s.estimatedWeeks
          }))
        };
      } else if (selectedEndpoint === 'calculate') {
        data = {
          status: 'success',
          calculation: {
            serviceId: 'srv_web_app',
            basePrice: 45000000,
            selectedAddons: ['opt_2fa_e2e', 'opt_audit_logs'],
            addonsTotal: 18500000,
            finalEstimatedPrice: 63500000,
            currency: 'IDR',
            estimatedDays: 35
          }
        };
      } else {
        data = {
          status: 'success',
          projects: getProjects().map(p => ({
            id: p.id,
            name: p.name,
            progress: p.progressPercent,
            status: p.status
          }))
        };
      }

      setTestResponse(JSON.stringify(data, null, 2));
      setIsCallingApi(false);
    }, 450);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Gateway API & Integrasi Pihak Ke-3</h2>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  REST v1 + OPENAPI 3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hubungkan sistem CRM luar, Zapier, Webhook transaksi, atau mobile app pihak ketiga dengan autentikasi Bearer Token.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const spec = {
                openapi: '3.0.0',
                info: { title: 'NEXA Digital Agency API', version: '1.2.0' },
                paths: {
                  '/api/v1/services': { get: { summary: 'List services & base prices' } },
                  '/api/v1/estimator/calculate': { post: { summary: 'Calculate rule-based estimate' } },
                  '/api/v1/leads': { post: { summary: 'Create new lead proposal' } }
                }
              };
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(spec, null, 2));
              const a = document.createElement('a');
              a.href = dataStr;
              a.download = 'nexa_openapi_spec.json';
              a.click();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Unduh OpenAPI Specification</span>
          </button>
        </div>
      </div>

      {/* 1. API Keys Management Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-sky-400" />
          <span>Kunci API Aktif (Bearer Secret Tokens)</span>
        </h3>

        {/* Generate Key Input */}
        <form onSubmit={handleGenerateKey} className="flex gap-2">
          <input
            type="text"
            required
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            placeholder="Label nama integrasi (contoh: Zapier Sync, Mobile Flutter Client)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white shadow-lg shadow-sky-600/30 flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat API Key Baru</span>
          </button>
        </form>

        {/* Keys List */}
        <div className="space-y-3">
          {apiKeys.map(k => (
            <div
              key={k.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{k.name}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
                    ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-sky-400 text-[11px]">
                  <span>{k.rawKeyMasked}</span>
                  <button
                    onClick={() => handleCopyKey(k.rawKeyMasked, k.id)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKeyId === k.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[10px] text-slate-500">
                  Cakupan: {k.scopes.join(', ')} &bull; Dibuat: {new Date(k.createdAt).toLocaleDateString('id-ID')}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleRevokeKey(k.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cabut Akses</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive REST API Console Tester */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Interactive REST Console & Mock Sandbox</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedEndpoint('services')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedEndpoint === 'services' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400'
            }`}
          >
            GET /api/v1/services
          </button>
          <button
            onClick={() => setSelectedEndpoint('calculate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedEndpoint === 'calculate' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400'
            }`}
          >
            POST /api/v1/estimator/calculate
          </button>
          <button
            onClick={() => setSelectedEndpoint('projects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedEndpoint === 'projects' ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400'
            }`}
          >
            GET /api/v1/projects
          </button>
        </div>

        {/* cURL Example */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
          <div className="text-slate-500 mb-1"># Format cURL Request:</div>
          <span className="text-sky-400">curl</span> -X GET https://nexa.agency/api/v1/{selectedEndpoint} \<br />
          &nbsp;&nbsp;-H <span className="text-amber-300">"Authorization: Bearer {apiKeys[0]?.rawKeyMasked || 'pk_live_sec_key...'}"</span> \<br />
          &nbsp;&nbsp;-H <span className="text-amber-300">"Content-Type: application/json"</span>
        </div>

        <button
          onClick={handleTestEndpoint}
          disabled={isCallingApi}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isCallingApi ? 'Mengirim Request...' : 'Jalankan Uji Request (Test Call)'}</span>
        </button>

        {testResponse && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
            <div className="text-[10px] text-slate-500 mb-1 pb-1 border-b border-slate-800">
              HTTP/2 200 OK &bull; application/json &bull; response_time: 21ms
            </div>
            <pre>{testResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
