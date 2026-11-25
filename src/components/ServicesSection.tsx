import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { PAID_SERVICES, SUPPORT_SERVICES } from '../data/storeData';

interface ServicesSectionProps {
  onAddServiceToSummary: (name: string, price: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onAddServiceToSummary,
}) => {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (id: string, summaryTitle: string, priceRange: string) => {
    onAddServiceToSummary(summaryTitle, priceRange);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section id="jasa-teknis" className="py-14 border-b border-borderSubtle bg-stoneCard/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold text-emeraldDeep tracking-wide mb-2">
            <span>Fitur Utama 02</span>
            <span className="mx-2 text-zinc-400" aria-hidden="true">
              ·
            </span>
            <span>Tarif Transparan Sesuai Rencana Bisnis</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-inkCharcoal tracking-tight text-balance">
            Jasa Pasang, Setup Perangkat &amp; Bantuan Teknis
          </h2>
          <p className="text-sm sm:text-base text-textMuted mt-2 leading-relaxed">
            Toko Akmal menyediakan jasa teknis langsung di konter untuk memastikan aksesori
            terpasang rapi, berfungsi optimal, dan perangkat Anda tetap bersih serta siap pakai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Priced Core Services */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-borderSubtle">
              <h3 className="font-heading font-bold text-base text-inkCharcoal">
                Jasa Teknis Berbayar (Tarif Standar Banda Aceh)
              </h3>
              <span className="text-xs text-textMuted">Rentang Resmi</span>
            </div>

            {PAID_SERVICES.map((srv) => {
              const isAdded = addedId === srv.id;
              return (
                <div
                  key={srv.id}
                  className="bg-stoneSurface p-5 rounded-xl border border-borderSubtle hover:border-zinc-400 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-heading font-bold text-base text-inkCharcoal">
                          {srv.title}
                        </h4>
                        <span className="text-xs text-textMuted font-medium">· {srv.tag}</span>
                      </div>
                      <p className="text-xs text-textMuted mt-1 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="font-heading font-bold text-emeraldDeep text-sm sm:text-base font-tabular block whitespace-nowrap">
                        {srv.priceRange}
                      </span>
                      <span className="block text-[11px] text-textMuted">{srv.priceNote}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-xs">
                    <span className="text-textMuted">Kapan dibutuhkan: {srv.whenNeeded}</span>
                    <button
                      type="button"
                      onClick={() => handleAdd(srv.id, srv.summaryTitle, srv.priceRange)}
                      className="px-3.5 py-1.5 rounded-md bg-stoneCard hover:bg-emeraldDeep hover:text-white font-semibold text-inkCharcoal border border-borderSubtle transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ditambahkan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah ke Antrean</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Planned Support Services & Guidance */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-borderSubtle">
              <h3 className="font-heading font-bold text-base text-inkCharcoal">
                Layanan Pendukung &amp; Konsultasi
              </h3>
              <span className="text-xs text-textMuted">Toko Akmal Plan</span>
            </div>

            <div className="bg-stoneSurface p-5 rounded-xl border border-borderSubtle space-y-4">
              {SUPPORT_SERVICES.map((sup, idx) => {
                const isAdded = addedId === sup.id;
                const isLast = idx === SUPPORT_SERVICES.length - 1;
                return (
                  <div
                    key={sup.id}
                    className={`space-y-1.5 ${
                      isLast ? '' : 'border-b border-borderSubtle pb-4'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-inkCharcoal">
                        {sup.title}
                      </h4>
                      <span
                        className={`text-xs font-semibold shrink-0 whitespace-nowrap ${
                          sup.tagTone === 'emerald' ? 'text-emeraldDeep' : 'text-textMuted'
                        }`}
                      >
                        {sup.tag}
                      </span>
                    </div>
                    <p className="text-xs text-textMuted leading-relaxed">{sup.description}</p>
                    <button
                      type="button"
                      onClick={() => handleAdd(sup.id, sup.summaryTitle, sup.priceRange)}
                      className="mt-1.5 text-xs font-semibold text-emeraldDeep hover:underline inline-flex items-center cursor-pointer"
                    >
                      {isAdded
                        ? '✓ Masuk ke Ringkasan Konsultasi'
                        : '+ Masukkan ke Rencana Konsultasi →'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Counter Policy Guarantee Note */}
            <div className="p-4 bg-stoneCard rounded-xl border border-borderSubtle text-xs text-textMuted space-y-1.5">
              <span className="font-bold text-inkCharcoal block">
                Prinsip Layanan Konter Toko Akmal:
              </span>
              <p>1. Transparansi biaya: dicek dulu kerumitannya, baru disepakati sebelum pengerjaan.</p>
              <p>2. Uji fungsi bersama pelanggan sebelum meninggalkan meja gerai.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
