import React, { useEffect, useMemo, useState } from 'react';
import {
  BatteryCharging,
  Briefcase,
  CheckCircle2,
  Circle,
  GraduationCap,
  Headphones,
  Home,
  Laptop,
  Lightbulb,
  MessageSquare,
  Mouse,
  Plus,
  Shield,
  Smartphone,
  Store,
  Zap,
} from 'lucide-react';
import {
  CATEGORY_LABELS,
  COMPAT_MATRIX,
  PROFILE_LABELS,
  PROFILE_NOTES,
} from '../data/storeData';
import { DeviceType, NeedCategory, UserProfile } from '../types';

interface CompatibilityCheckerProps {
  onAddToSummary: (title: string, priceOrNote: string, category: string) => void;
  onSelectionChange?: (selection: {
    device: DeviceType;
    category: NeedCategory;
    profile: UserProfile;
  }) => void;
  onAskInChat?: (promptText: string) => void;
}

export const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({
  onAddToSummary,
  onSelectionChange,
  onAskInChat,
}) => {
  const [device, setDevice] = useState<DeviceType>('laptop');
  const [category, setCategory] = useState<NeedCategory>('power');
  const [profile, setProfile] = useState<UserProfile>('mahasiswa');
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  useEffect(() => {
    onSelectionChange?.({ device, category, profile });
  }, [device, category, profile, onSelectionChange]);

  const compatResult = useMemo(() => {
    if (device === 'keduanya') {
      const laptopData = COMPAT_MATRIX[`laptop-${category}`];
      const hpData = COMPAT_MATRIX[`hp-${category}`];
      return {
        title: `Checklist Gabungan Laptop & HP (${CATEGORY_LABELS[category].toLowerCase()})`,
        checks: [...laptopData.checks.slice(0, 2), ...hpData.checks.slice(0, 2)],
        recomms: [laptopData.recomms[0], hpData.recomms[0]],
      };
    }
    return COMPAT_MATRIX[`${device}-${category}`] || COMPAT_MATRIX['laptop-power'];
  }, [device, category]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddChecklist = () => {
    const devLabel = device === 'keduanya' ? 'LAPTOP & HP' : device.toUpperCase();
    const catLabel = CATEGORY_LABELS[category];
    onAddToSummary(
      `Konsultasi Fisik: ${devLabel} (${catLabel})`,
      `Profil: ${PROFILE_LABELS[profile]} · Gratis (Pemeriksaan Toko)`,
      'Checklist Kompatibilitas'
    );
    setRecentlyAdded('checklist');
    setTimeout(() => setRecentlyAdded(null), 1200);
  };

  const handleAskCompatibilityInChat = () => {
    if (!onAskInChat) return;
    const devLabel = device === 'keduanya' ? 'Laptop & HP' : device.toUpperCase();
    const catLabel = CATEGORY_LABELS[category];
    const profLabel = PROFILE_LABELS[profile];
    const checkSummary = compatResult.checks.map((c) => c.item).join(', ');
    onAskInChat(
      `Saya butuh konsultasi kompatibilitas untuk ${devLabel} kategori ${catLabel} (profil: ${profLabel}). Poin yang ingin saya pastikan: ${checkSummary}. Rekomendasi aksesori ekonomis s.d. premium apa yang cocok di Toko Akmal?`
    );
  };

  const handleAddRecomm = (name: string, price: string) => {
    onAddToSummary(name, price, 'Rekomendasi Kompatibilitas');
    setRecentlyAdded(name);
    setTimeout(() => setRecentlyAdded(null), 1200);
  };

  const deviceOptions: { value: DeviceType; label: string; icon: React.ReactNode }[] = [
    { value: 'laptop', label: 'Laptop', icon: <Laptop className="w-3.5 h-3.5 shrink-0" /> },
    { value: 'hp', label: 'HP / Ponsel', icon: <Smartphone className="w-3.5 h-3.5 shrink-0" /> },
    { value: 'keduanya', label: 'Keduanya', icon: <Zap className="w-3.5 h-3.5 shrink-0" /> },
  ];

  const categoryOptions: { value: NeedCategory; label: string; icon: React.ReactNode }[] = [
    {
      value: 'power',
      label: 'Daya & Charger/Kabel',
      icon: <BatteryCharging className="w-4 h-4 shrink-0" />,
    },
    {
      value: 'input',
      label: 'Input & Meja Kerja',
      icon: <Mouse className="w-4 h-4 shrink-0" />,
    },
    {
      value: 'protection',
      label: 'Perlindungan & Tas',
      icon: <Shield className="w-4 h-4 shrink-0" />,
    },
    {
      value: 'audio',
      label: 'Audio & Koneksi',
      icon: <Headphones className="w-4 h-4 shrink-0" />,
    },
  ];

  const profileOptions: { value: UserProfile; label: string; icon: React.ReactNode }[] = [
    {
      value: 'mahasiswa',
      label: 'Pelajar / Mahasiswa',
      icon: <GraduationCap className="w-4 h-4 shrink-0" />,
    },
    {
      value: 'kantoran',
      label: 'Pekerja / Freelancer',
      icon: <Briefcase className="w-4 h-4 shrink-0" />,
    },
    {
      value: 'umkm',
      label: 'Pelaku UMKM',
      icon: <Store className="w-4 h-4 shrink-0" />,
    },
    {
      value: 'harian',
      label: 'Penggunaan Harian',
      icon: <Home className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <section id="kompatibilitas" className="py-14 border-b border-borderSubtle bg-stoneSurface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold text-emeraldDeep tracking-wide mb-2">
            <span>Fitur Utama 01</span>
            <span className="mx-2 text-zinc-400" aria-hidden="true">
              ·
            </span>
            <span>Interaktif &amp; Praktis</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-inkCharcoal tracking-tight text-balance">
            Cek Kompatibilitas Perangkat &amp; Rekomendasi Aksesori
          </h2>
          <p className="text-sm sm:text-base text-textMuted mt-2 leading-relaxed">
            Pilih jenis perangkat, kebutuhan utama, dan profil penggunaan Anda di Banda Aceh. Sistem
            menyusun checklist teknis yang harus diverifikasi sebelum transaksi, serta produk
            katalog yang relevan.
          </p>
        </div>

        {/* Interactive Tool Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-stoneCard p-6 rounded-xl border border-borderSubtle space-y-6">
            <div className="border-b border-borderSubtle pb-3">
              <h3 className="font-heading font-bold text-base text-inkCharcoal">
                1. Konfigurasi Kebutuhan
              </h3>
              <p className="text-xs text-textMuted mt-0.5">
                Tentukan parameter perangkat untuk mendapatkan checklist yang presisi.
              </p>
            </div>

            {/* Parameter 1: Device Type */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-textMuted block">Jenis Perangkat</span>
              <div className="grid grid-cols-3 gap-2">
                {deviceOptions.map((opt) => {
                  const active = device === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDevice(opt.value)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-emeraldDeep text-white border-emeraldDeep shadow-sm'
                          : 'bg-stoneSurface text-inkCharcoal border-borderSubtle hover:bg-stoneMuted'
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameter 2: Need Category */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-textMuted block">
                Kategori Aksesori / Kebutuhan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoryOptions.map((opt) => {
                  const active = category === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold inline-flex items-center gap-2 text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-emeraldDeep text-white border-emeraldDeep shadow-sm'
                          : 'bg-stoneSurface text-inkCharcoal border-borderSubtle hover:bg-stoneMuted'
                      }`}
                    >
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameter 3: User Profile */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-textMuted block">Profil Pengguna</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {profileOptions.map((opt) => {
                  const active = profile === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setProfile(opt.value)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-medium inline-flex items-center gap-2 text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-emeraldDeep text-white border-emeraldDeep shadow-sm'
                          : 'bg-stoneSurface text-inkCharcoal border-borderSubtle hover:bg-stoneMuted'
                      }`}
                    >
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tip Box */}
            <div className="p-3.5 bg-amberSoft rounded-lg border border-amber-200 text-xs text-amberMuted flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amberMuted" />
              <div>
                <span className="font-semibold text-inkCharcoal block">
                  Bawa Perangkat Fisik ke Gerai
                </span>
                <p className="mt-0.5 text-textMuted leading-relaxed">
                  Ragu tipe port charger atau tebal bodi laptop? Staf Toko Akmal di Banda Aceh siap
                  melakukan pengetesan fisik gratis di meja layanan.
                </p>
              </div>
            </div>
          </div>

          {/* Result Checklist & Recommendations Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-stoneSurface p-6 rounded-xl border border-borderSubtle shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderSubtle pb-4">
                <div>
                  <span className="text-xs font-semibold text-emeraldDeep block">
                    {device === 'keduanya' ? 'Laptop & HP' : device.toUpperCase()}
                    <span className="mx-1.5 text-zinc-400">·</span>
                    {CATEGORY_LABELS[category]}
                    <span className="mx-1.5 text-zinc-400">·</span>
                    {PROFILE_LABELS[profile]}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-inkCharcoal mt-0.5">
                    {compatResult.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {onAskInChat && (
                    <button
                      type="button"
                      onClick={handleAskCompatibilityInChat}
                      className="inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-lg bg-emeraldDeep text-white hover:bg-emeraldAccent transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      <span>Tanya di Chatbot</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddChecklist}
                    className="inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-lg bg-stoneCard border border-borderSubtle text-inkCharcoal hover:bg-emeraldDeep hover:text-white hover:border-emeraldDeep transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {recentlyAdded === 'checklist' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        <span>Ditambahkan</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        <span>Tambah ke Ringkasan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Checklist */}
              <div className="space-y-3">
                {compatResult.checks.map((c, i) => {
                  const isChecked = !!checkedIds[c.id];
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCheck(c.id)}
                      className={`w-full text-left p-3.5 rounded-lg border flex items-start gap-3 transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-stoneCard/70 border-borderSubtle hover:bg-stoneCard'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded font-bold text-xs font-tabular flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked ? 'bg-emeraldAccent text-white' : 'bg-emeraldDeep text-white'
                        }`}
                      >
                        0{i + 1}
                      </div>
                      <div className="text-xs flex-1">
                        <span className="font-bold text-inkCharcoal block">{c.item}</span>
                        <p className="text-textMuted mt-0.5 leading-relaxed">{c.desc}</p>
                      </div>
                      <span className="shrink-0 mt-0.5 text-emeraldDeep" aria-hidden="true">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-400" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Contextual Profile Advice */}
              <div className="p-3.5 rounded-lg bg-stoneCard border border-borderSubtle text-xs text-textMuted leading-relaxed">
                <strong className="text-inkCharcoal">Catatan Konteks:</strong>{' '}
                {PROFILE_NOTES[profile][category]}
              </div>

              {/* Recommendation Cards */}
              <div className="pt-4 border-t border-borderSubtle">
                <span className="text-xs font-semibold text-textMuted block mb-3">
                  Rekomendasi Produk Acuan di Toko Akmal:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {compatResult.recomms.map((r) => {
                    const isAdded = recentlyAdded === r.name;
                    return (
                      <div
                        key={r.name}
                        className="bg-stoneSurface p-3.5 rounded-lg border border-borderSubtle flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span className="font-heading font-semibold text-xs text-inkCharcoal block leading-snug">
                            {r.name}
                          </span>
                          <span className="text-xs font-bold text-emeraldDeep font-tabular mt-0.5 block">
                            {r.price}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddRecomm(r.name, r.price)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stoneCard hover:bg-emeraldDeep hover:text-white border border-borderSubtle transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                        >
                          {isAdded ? 'Ditambah' : '+ Tambah'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
