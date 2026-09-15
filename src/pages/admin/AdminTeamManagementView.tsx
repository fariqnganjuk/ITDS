import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Code2,
  Cpu,
  Palette,
  Terminal,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  Edit2,
  Trash2,
  Lock,
  KeyRound,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { User, UserRole, Project } from '../../types';
import { getUsers, saveUsers, getCurrentUser, getProjects } from '../../lib/storage';

export const AdminTeamManagementView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [projects] = useState<Project[]>(getProjects());
  const [currentUser] = useState<User | null>(getCurrentUser());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setUsers(getUsers());
    };
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  const staffAndAdmins = users.filter(u => u.role === 'staff' || u.role === 'admin' || u.role === 'superadmin');
  const clients = users.filter(u => u.role === 'client');

  const handleOpenCreate = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('staff');
    setTitle('Full Stack Developer');
    setPhone('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setTitle(user.title || '');
    setPhone(user.phone || '');
    setShowAddModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    let updatedList: User[];
    if (editingUser) {
      updatedList = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            name,
            email,
            role,
            title,
            phone
          };
        }
        return u;
      });
      setSuccessMsg(`Data profil ${name} berhasil diperbarui.`);
    } else {
      const newUser: User = {
        id: 'usr_' + Date.now().toString(36),
        name,
        email,
        role,
        title: title || 'Staff Member',
        phone: phone || '+62 812-0000-0000',
        companyName: 'NEXA Digital Agency',
        twoFaEnabled: role === 'superadmin' || role === 'admin',
        twoFaSecret: 'JBSWY3DPEHPK3PXP',
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      updatedList = [newUser, ...users];
      setSuccessMsg(`Anggota tim ${name} (${title}) berhasil ditambahkan oleh Super Admin.`);
    }

    saveUsers(updatedList);
    setUsers(updatedList);
    setShowAddModal(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const getSpecialtyBadge = (role: UserRole, title?: string) => {
    const text = title || role;
    if (text.toLowerCase().includes('full stack') || text.toLowerCase().includes('developer')) {
      return {
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        icon: <Code2 className="w-3.5 h-3.5" />
      };
    }
    if (text.toLowerCase().includes('analyst')) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: <Terminal className="w-3.5 h-3.5" />
      };
    }
    if (text.toLowerCase().includes('support') || text.toLowerCase().includes('infra')) {
      return {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        icon: <Cpu className="w-3.5 h-3.5" />
      };
    }
    if (text.toLowerCase().includes('ui/ux') || text.toLowerCase().includes('design')) {
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: <Palette className="w-3.5 h-3.5" />
      };
    }
    return {
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      icon: <ShieldCheck className="w-3.5 h-3.5" />
    };
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Manajemen Tim & Hak Akses
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
              SUPER ADMIN CONTROL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Struktur Tim Inti (4 Spesialisasi) & User Klien
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin (Ahmad Fariq & Faizin) memiliki wewenang membuat akun staf, mengubah peranan, dan menetapkan penugasan proyek.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          id="btn-add-team-member"
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center gap-2 shrink-0 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Anggota Tim Baru</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 4 Core Team Highlights */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-slate-300">
          <span>Daftar Tim Internal NEXA Agency ({staffAndAdmins.length} Anggota)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffAndAdmins.map(member => {
            const badge = getSpecialtyBadge(member.role, member.title);
            const isFariq = member.name.toLowerCase().includes('fariq');
            const isFaizin = member.name.toLowerCase().includes('faizin');

            return (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Header card */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm">{member.name}</h4>
                          {(isFariq || isFaizin) && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold">
                              Owner
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{member.email}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Edit Anggota"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Specialty badge */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${badge.bg}`}>
                      {badge.icon}
                      <span>{member.title || member.role}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-mono uppercase">
                      Role: {member.role}
                    </span>
                  </div>
                </div>

                {/* Footer card info */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>2FA: {member.twoFaEnabled ? 'Aktif' : 'Standby'}</span>
                  </div>
                  <div className="text-slate-500">
                    ID: <span className="font-mono">{member.id.substring(0, 10)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Accounts Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Akun Klien Terdaftar ({clients.length} Klien)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Status Akses: Aktif</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Nama Klien</th>
                <th className="py-2.5 px-3">Email & Kontak</th>
                <th className="py-2.5 px-3">Perusahaan</th>
                <th className="py-2.5 px-3">Status 2FA</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3 font-semibold text-white">
                    {client.name}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-slate-300">{client.email}</div>
                    <div className="text-[10px] text-slate-500">{client.phone || '-'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300 font-medium">{client.companyName || 'Perorangan'}</span>
                  </td>
                  <td className="py-3 px-3">
                    {client.twoFaEnabled ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                        Standar
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium text-xs transition"
                    >
                      Kelola
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingUser ? 'Edit Profil Anggota' : 'Tambah Anggota Tim Baru'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Toni Wijaya"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alamat Email Resmi</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="toni@nexa.agency"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Peran (Role Akses)</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white outline-none"
                  >
                    <option value="staff">Staff (Developer / Tim)</option>
                    <option value="admin">Admin (Manager)</option>
                    <option value="superadmin">Super Admin (Owner)</option>
                    <option value="client">Client (Klien)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Spesialisasi / Jabatan</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Full Stack Dev, UI/UX, dsb."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp / Kontak</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+62 812-xxxx-xxxx"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/30"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
