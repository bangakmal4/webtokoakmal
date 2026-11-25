import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { PREORDER_PRODUCT_OPTIONS } from '../data/storeData';
import { PreorderItem, PriceTier } from '../types';

interface PreorderSectionProps {
  preorderQueue: PreorderItem[];
  onSubmitPreorder: (item: Omit<PreorderItem, 'id' | 'date'>) => void;
  onRemovePreorder: (id: string) => void;
}

export const PreorderSection: React.FC<PreorderSectionProps> = ({
  preorderQueue,
  onSubmitPreorder,
  onRemovePreorder,
}) => {
  const [product, setProduct] = useState(PREORDER_PRODUCT_OPTIONS[0].value);
  const [tier, setTier] = useState<PriceTier>('Ekonomis');
  const [device, setDevice] = useState('');
  const [urgency, setUrgency] = useState('Biasa (1-3 hari)');
  const [notes, setNotes] = useState('');
  const [submitNotice, setSubmitNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!device.trim()) return;

    onSubmitPreorder({
      product,
      tier,
      device: device.trim(),
      urgency,
      notes: notes.trim() || 'Tidak ada catatan tambahan',
    });

    setDevice('');
    setNotes('');
    setSubmitNotice(true);
    setTimeout(() => setSubmitNotice(false), 3500);
  };

  const tiers: { value: PriceTier; subtitle: string }[] = [
    { value: 'Ekonomis', subtitle: 'Hemat & Fungsional' },
    { value: 'Reguler', subtitle: 'Keseimbangan Terbaik' },
    { value: 'Premium', subtitle: 'Daya Tahan Tinggi / Brand' },
  ];

  return (
    <section id="preorder" className="py-14 border-b border-borderSubtle bg-stoneSurface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold text-emeraldDeep tracking-wide mb-2">
            <span>Fitur Utama 03</span>
            <span className="mx-2 text-zinc-400" aria-hidden="true">
              ·
            </span>
            <span>Solusi SWOT Kelemahan &amp; Peluang</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-inkCharcoal tracking-tight text-balance">
            Titip Stok &amp; Permintaan Pre-Order (Log Kebutuhan)
          </h2>
          <p className="text-sm sm:text-base text-textMuted mt-2 leading-relaxed">
            Sebagai wujud strategi SWOT Toko Akmal (mengatasi keterbatasan modal stok awal &amp;
            mencatat kebutuhan nyata pelanggan di Banda Aceh), gunakan formulir ini untuk memesan
            tipe/varian khusus dengan perbandingan supplier terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-6 bg-stoneCard p-6 rounded-xl border border-borderSubtle space-y-5">
            <div className="border-b border-borderSubtle pb-3">
              <h3 className="font-heading font-bold text-base text-inkCharcoal">
                Formulir Permintaan / Titip Stok
              </h3>
              <p className="text-xs text-textMuted mt-0.5">
                Catat spesifikasi varian yang Anda butuhkan untuk kami verifikasi stok distributor.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product selection */}
              <div>
                <label
                  htmlFor="poProductSelect"
                  className="text-xs font-semibold text-textMuted block mb-1.5"
                >
                  Pilih Kategori Produk Acuan
                </label>
                <select
                  id="poProductSelect"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-stoneSurface border border-borderSubtle rounded-lg px-3.5 py-2.5 text-inkCharcoal focus:outline-none focus:border-emeraldDeep"
                >
                  {PREORDER_PRODUCT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier Selection */}
              <div>
                <span className="text-xs font-semibold text-textMuted block mb-1.5">
                  Preferensi Tingkatan / Kualitas (Tier Harga)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {tiers.map((t) => {
                    const checked = tier === t.value;
                    return (
                      <label
                        key={t.value}
                        className={`border rounded-lg p-2.5 text-center cursor-pointer transition-colors ${
                          checked
                            ? 'bg-emeraldDeep text-white border-emeraldDeep'
                            : 'bg-stoneSurface text-inkCharcoal border-borderSubtle hover:bg-stoneMuted'
                        }`}
                      >
                        <input
                          type="radio"
                          name="poTier"
                          value={t.value}
                          checked={checked}
                          onChange={() => setTier(t.value)}
                          className="sr-only"
                        />
                        <span className="text-xs font-bold block">{t.value}</span>
                        <span className="text-[11px] opacity-85 block mt-0.5">{t.subtitle}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Detail model / device specs */}
              <div>
                <label
                  htmlFor="poDeviceDetail"
                  className="text-xs font-semibold text-textMuted block mb-1.5"
                >
                  Merek &amp; Seri Perangkat Anda
                </label>
                <input
                  type="text"
                  id="poDeviceDetail"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  placeholder="Contoh: Asus Vivobook 14 A1404 / Samsung A54 5G"
                  required
                  className="w-full text-xs sm:text-sm bg-stoneSurface border border-borderSubtle rounded-lg px-3.5 py-2.5 text-inkCharcoal focus:outline-none focus:border-emeraldDeep"
                />
              </div>

              {/* Specific Requirements & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="poUrgency"
                    className="text-xs font-semibold text-textMuted block mb-1.5"
                  >
                    Tingkat Urgensi
                  </label>
                  <select
                    id="poUrgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-stoneSurface border border-borderSubtle rounded-lg px-3 py-2.5 text-inkCharcoal focus:outline-none focus:border-emeraldDeep"
                  >
                    <option value="Biasa (1-3 hari)">Biasa (1-3 hari)</option>
                    <option value="Urgen / Segera (Hari ini / Besok)">
                      Urgen (Hari ini / Besok)
                    </option>
                    <option value="Terserah bila ada stok">Santai (Bila ada stok)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="poNotes"
                    className="text-xs font-semibold text-textMuted block mb-1.5"
                  >
                    Catatan Spesifik (Port/Warna/Watt)
                  </label>
                  <input
                    type="text"
                    id="poNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Misal: Kepala jarum 4.5mm atau kabel hitam"
                    className="w-full text-xs sm:text-sm bg-stoneSurface border border-borderSubtle rounded-lg px-3.5 py-2.5 text-inkCharcoal focus:outline-none focus:border-emeraldDeep"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emeraldDeep text-white rounded-lg font-heading font-semibold text-sm hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Masukkan ke Daftar Titip Stok &amp; Ringkasan</span>
              </button>

              {submitNotice && (
                <div
                  role="status"
                  className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emeraldDeep text-xs font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Permintaan titip stok berhasil dicatat ke antrean dan ringkasan konsultasi Anda.
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Strategy Context & Live Demand Queue */}
          <div className="lg:col-span-6 space-y-5">
            {/* SWOT Explanation Card */}
            <div className="bg-amberSoft p-5 rounded-xl border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amberMuted font-bold">
                <Bookmark className="w-4 h-4 shrink-0" />
                <span>Strategi SWOT Toko Akmal (WO &amp; WT)</span>
              </div>
              <p className="text-inkCharcoal leading-relaxed font-semibold">
                Bagaimana Toko Akmal menangani keterbatasan variasi stok awal di Banda Aceh?
              </p>
              <p className="text-textMuted leading-relaxed">
                Kami mencatat riwayat permintaan pelanggan nyata, membandingkan minimal 2–3
                supplier distributor untuk mendapatkan harga termurah dengan garansi jelas, lalu
                menyediakan skema titip order tanpa mark-up sepihak.
              </p>
            </div>

            {/* Current Demand Log Board */}
            <div className="bg-stoneCard p-5 rounded-xl border border-borderSubtle space-y-4">
              <div className="flex items-center justify-between border-b border-borderSubtle pb-3">
                <div>
                  <h4 className="font-heading font-bold text-sm text-inkCharcoal">
                    Daftar Titipan Stok Aktif Anda
                  </h4>
                  <p className="text-xs text-textMuted">
                    Tersimpan otomatis di peramban Anda
                  </p>
                </div>
                <span className="text-xs font-bold text-inkCharcoal font-tabular">
                  {preorderQueue.length} Item
                </span>
              </div>

              <div className="space-y-2.5">
                {preorderQueue.length === 0 ? (
                  <div className="text-center py-8 text-textMuted text-xs bg-stoneSurface rounded-lg border border-dashed border-borderSubtle px-4">
                    Belum ada permintaan titip stok. Gunakan formulir di sebelah kiri untuk
                    menambahkan.
                  </div>
                ) : (
                  preorderQueue.map((po) => (
                    <div
                      key={po.id}
                      className="bg-stoneSurface p-3.5 rounded-lg border border-borderSubtle text-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-heading font-bold text-inkCharcoal">
                          {po.product}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-xs font-bold ${
                              po.tier === 'Premium' ? 'text-amberMuted' : 'text-emeraldDeep'
                            }`}
                          >
                            {po.tier}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemovePreorder(po.id)}
                            aria-label={`Hapus titipan ${po.product}`}
                            className="text-zinc-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-textMuted">
                        <span>
                          Perangkat: <strong className="text-inkCharcoal">{po.device}</strong>
                        </span>
                        <span className="mx-1.5 text-zinc-300" aria-hidden="true">
                          ·
                        </span>
                        <span>Urgensi: {po.urgency}</span>
                        <span className="mx-1.5 text-zinc-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-tabular">{po.date}</span>
                      </div>
                      <div className="text-xs text-zinc-500">Catatan: &ldquo;{po.notes}&rdquo;</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
