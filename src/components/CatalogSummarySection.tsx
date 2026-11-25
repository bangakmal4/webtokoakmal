import React, { useMemo, useState } from 'react';
import { Check, Copy, MessageCircle, Plus, Search, X } from 'lucide-react';
import { CATALOG_PRODUCTS } from '../data/storeData';
import { SummaryItem } from '../types';

interface CatalogSummarySectionProps {
  summaryItems: SummaryItem[];
  custName: string;
  custLoc: string;
  onCustNameChange: (val: string) => void;
  onCustLocChange: (val: string) => void;
  onAddToSummary: (title: string, priceOrNote: string, category: string) => void;
  onRemoveFromSummary: (id: string) => void;
  onClearSummary: () => void;
  onOpenWhatsAppModal: () => void;
  formattedSummaryText: string;
}

export const CatalogSummarySection: React.FC<CatalogSummarySectionProps> = ({
  summaryItems,
  custName,
  custLoc,
  onCustNameChange,
  onCustLocChange,
  onAddToSummary,
  onRemoveFromSummary,
  onClearSummary,
  onOpenWhatsAppModal,
  formattedSummaryText,
}) => {
  const [filterGroup, setFilterGroup] = useState<'semua' | 'laptop' | 'hp'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((p) => {
      const matchesGroup =
        filterGroup === 'semua' ||
        p.deviceGroup === filterGroup ||
        p.deviceGroup === 'umum';
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.range.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [filterGroup, searchQuery]);

  const handleAddCatalogProduct = (id: string, name: string, range: string) => {
    onAddToSummary(name, range, 'Katalog Produk Acuan');
    setJustAddedId(id);
    setTimeout(() => setJustAddedId(null), 1000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="katalog" className="py-14 border-b border-borderSubtle bg-stoneSurface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold text-emeraldDeep tracking-wide mb-2">
            <span>Fitur Utama 04</span>
            <span className="mx-2 text-zinc-400" aria-hidden="true">
              ·
            </span>
            <span>12 Produk Acuan Dokumen Bisnis</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-inkCharcoal tracking-tight text-balance">
            Katalog Referensi &amp; Ringkasan Konsultasi
          </h2>
          <p className="text-sm sm:text-base text-textMuted mt-2 leading-relaxed">
            Daftar harga acuan 12 kategori produk Toko Akmal Banda Aceh (dari kelas ekonomis hingga
            premium). Klik <em>&ldquo;+ Tambah&rdquo;</em> pada produk yang ingin dikonsultasikan
            atau dibeli.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 12 Catalog Products */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-borderSubtle">
              <div>
                <span className="text-xs font-bold text-textMuted block">
                  Daftar 12 Produk Acuan Toko Akmal
                </span>
                <span className="text-xs text-textMuted font-tabular">
                  Rentang Harga Resmi ({filteredProducts.length} produk)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center p-1 bg-stoneCard rounded-lg border border-borderSubtle">
                  {(
                    [
                      { key: 'semua', label: 'Semua' },
                      { key: 'laptop', label: 'Laptop' },
                      { key: 'hp', label: 'HP' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFilterGroup(tab.key)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        filterGroup === tab.key
                          ? 'bg-stoneSurface text-inkCharcoal shadow-xs'
                          : 'text-textMuted hover:text-inkCharcoal'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk acuan (misal: charger, mouse, USB hub, tas)..."
                aria-label="Cari produk acuan"
                className="w-full bg-stoneCard border border-borderSubtle rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-inkCharcoal focus:outline-none focus:border-emeraldDeep"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Bersihkan pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-inkCharcoal p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 bg-stoneCard rounded-xl border border-dashed border-borderSubtle text-xs text-textMuted">
                Tidak ada produk yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => {
                  const isAdded = justAddedId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="bg-stoneSurface p-4 rounded-xl border border-borderSubtle hover:border-zinc-400 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-inkCharcoal leading-snug mb-1">
                          {p.name}
                        </h4>
                        <span className="text-xs font-bold text-emeraldDeep font-tabular block">
                          {p.range}
                        </span>
                        <p className="text-xs text-textMuted mt-1.5 leading-relaxed">{p.note}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                        <span className="text-xs text-textMuted">Tersedia di Konter</span>
                        <button
                          type="button"
                          onClick={() => handleAddCatalogProduct(p.id, p.name, p.range)}
                          className="text-xs font-semibold text-emeraldDeep hover:text-white bg-emerald-50 hover:bg-emeraldDeep px-3 py-1.5 rounded-md border border-emerald-200 hover:border-emeraldDeep transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Ditambah</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Live Consultation & Order Summary Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24" id="ringkasan-panel">
            <div className="bg-stoneCard p-6 rounded-xl border border-emeraldDeep/30 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-borderSubtle pb-4">
                <div>
                  <span className="text-xs font-bold text-emeraldDeep block">
                    Meja Layanan Terbuka
                  </span>
                  <h3 className="font-heading font-bold text-lg text-inkCharcoal">
                    Ringkasan Konsultasi &amp; Order
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClearSummary}
                  disabled={summaryItems.length === 0}
                  className="text-xs text-red-700 hover:text-red-800 underline font-medium disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                >
                  Reset Semua
                </button>
              </div>

              {/* Customer Details Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label
                    htmlFor="custName"
                    className="text-xs font-semibold text-textMuted block mb-1"
                  >
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    id="custName"
                    value={custName}
                    onChange={(e) => onCustNameChange(e.target.value)}
                    placeholder="Contoh: Rahmat USK"
                    className="w-full bg-stoneSurface border border-borderSubtle rounded-lg px-3 py-2 text-xs text-inkCharcoal focus:outline-none focus:border-emeraldDeep"
                  />
                </div>
                <div>
                  <label
                    htmlFor="custLoc"
                    className="text-xs font-semibold text-textMuted block mb-1"
                  >
                    Lokasi di Banda Aceh
                  </label>
                  <input
                    type="text"
                    id="custLoc"
                    value={custLoc}
                    onChange={(e) => onCustLocChange(e.target.value)}
                    placeholder="Contoh: Darussalam / Lampriek"
                    className="w-full bg-stoneSurface border border-borderSubtle rounded-lg px-3 py-2 text-xs text-inkCharcoal focus:outline-none focus:border-emeraldDeep"
                  />
                </div>
              </div>

              {/* Summary List Items */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {summaryItems.length === 0 ? (
                  <div className="text-center py-8 text-textMuted text-xs bg-stoneSurface rounded-lg border border-dashed border-borderSubtle px-4">
                    Belum ada item konsultasi atau jasa yang dipilih.
                    <br />
                    Pilih dari checklist, jasa, atau katalog acuan.
                  </div>
                ) : (
                  summaryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-stoneSurface p-3 rounded-lg border border-borderSubtle flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[11px] font-bold text-emeraldDeep block">
                          {item.category}
                        </span>
                        <span className="font-semibold text-inkCharcoal block leading-snug">
                          {item.title}
                        </span>
                        <span className="text-textMuted font-tabular text-[11px] block">
                          {item.priceOrNote}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFromSummary(item.id)}
                        aria-label={`Hapus ${item.title}`}
                        className="text-zinc-400 hover:text-red-600 p-1 rounded shrink-0 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Summary Footer Actions */}
              <div className="pt-4 border-t border-borderSubtle space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-textMuted">Total Item Terdaftar:</span>
                  <span className="font-bold text-inkCharcoal font-tabular">
                    {summaryItems.length} Item
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={onOpenWhatsAppModal}
                    className="w-full py-3 bg-emeraldDeep text-white font-heading font-bold text-xs sm:text-sm rounded-lg hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Kirim Ringkasan via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="w-full py-2.5 bg-stoneSurface text-inkCharcoal font-medium text-xs rounded-lg border border-borderSubtle hover:bg-stoneMuted transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emeraldDeep" />
                        <span className="text-emeraldDeep font-semibold">Berhasil Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks Ringkasan</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-textMuted text-center leading-relaxed">
                  Pesan akan langsung diformat rapi untuk dikirimkan ke konter Toko Akmal di Banda
                  Aceh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
