import React from 'react';
import { ArrowDown, Check, ClipboardCheck, Wrench } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="top" className="border-b border-borderSubtle bg-stoneSurface py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Copy & Mission */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold text-textMuted tracking-wide">
              <span>Banda Aceh</span>
              <span className="mx-2 text-zinc-300" aria-hidden="true">
                ·
              </span>
              <span>Konsultasi Kompatibilitas, Jasa Pasang &amp; Request Stok</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-inkCharcoal tracking-tight leading-[1.15] text-balance">
              Pastikan Cocok Dulu Sebelum Beli,{' '}
              <span className="text-emeraldDeep underline decoration-emerald-200 decoration-4 underline-offset-4">
                Baru Tentukan Pilihan.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-textMuted leading-relaxed max-w-2xl">
              Menghindari risiko salah beli colokan charger, port USB Hub tidak sinkron, atau ukuran
              tas laptop tidak pas. <strong className="text-inkCharcoal">Toko Akmal</strong> melayani
              pelajar, mahasiswa perguruan tinggi (USK, UIN, Unida), pekerja kantoran, freelancer,
              dan UMKM di Banda Aceh dengan panduan kecocokan teknis jujur, jasa pasang rapi, dan
              pilihan varian hemat hingga premium.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-stoneCard p-4 rounded-xl border border-borderSubtle">
                <span className="text-xs font-bold text-emeraldDeep tracking-wide block mb-1.5">
                  01. Cek Port &amp; Watt
                </span>
                <p className="text-xs text-textMuted leading-relaxed">
                  Konfirmasi Type-C PD, pin barrel, port HDMI/USB 3.0, hingga kapasitas output aman.
                </p>
              </div>
              <div className="bg-stoneCard p-4 rounded-xl border border-borderSubtle">
                <span className="text-xs font-bold text-emeraldDeep tracking-wide block mb-1.5">
                  02. Jasa Langsung Pasang
                </span>
                <p className="text-xs text-textMuted leading-relaxed">
                  Pemasangan tempered glass bebas gelembung, setup driver dasar &amp; pembersihan
                  fisik.
                </p>
              </div>
              <div className="bg-stoneCard p-4 rounded-xl border border-borderSubtle">
                <span className="text-xs font-bold text-emeraldDeep tracking-wide block mb-1.5">
                  03. Titip Stok Khusus
                </span>
                <p className="text-xs text-textMuted leading-relaxed">
                  Tipe aksesori langka? Kami catat dan carikan dengan sistem pre-order transparan.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#kompatibilitas"
                className="px-5 py-3 rounded-lg bg-emeraldDeep text-white text-sm font-semibold hover:bg-emerald-800 transition-colors shadow-sm inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emeraldDeep"
              >
                <span>Mulai Cek Kompatibilitas</span>
                <ArrowDown className="w-4 h-4 ml-2" />
              </a>
              <a
                href="#jasa-teknis"
                className="px-5 py-3 rounded-lg bg-stoneCard text-inkCharcoal border border-borderSubtle text-sm font-semibold hover:bg-stoneMuted transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emeraldDeep"
              >
                Lihat Tarif Jasa &amp; Pasang
              </a>
              <a
                href="#katalog"
                className="px-4 py-3 rounded-lg text-textMuted hover:text-inkCharcoal text-sm font-medium underline underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emeraldDeep"
              >
                Katalog 12 Produk Acuan
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Service Counter Board */}
          <div className="lg:col-span-5 bg-stoneCard p-6 rounded-xl border border-borderSubtle shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-borderSubtle pb-4 gap-3">
              <div>
                <span className="text-xs text-textMuted font-semibold block">
                  Meja Konsultasi Fisik
                </span>
                <h2 className="font-heading font-bold text-lg text-inkCharcoal">
                  Layanan Konter Toko Akmal
                </h2>
              </div>
              <span className="text-xs font-semibold text-emeraldDeep whitespace-nowrap shrink-0">
                Siap Melayani
              </span>
            </div>

            {/* Service Counter Highlights */}
            <div className="space-y-3">
              <div className="bg-stoneSurface p-3.5 rounded-lg border border-borderSubtle flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-emerald-50 text-emeraldDeep flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-inkCharcoal block">
                    Konsultasi Sebelum Beli (Gratis)
                  </span>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    Bawa laptop atau HP Anda ke gerai, kami bantu uji coba port charger, mouse,
                    kabel, atau fitting ukuran tas di tempat.
                  </p>
                </div>
              </div>

              <div className="bg-stoneSurface p-3.5 rounded-lg border border-borderSubtle flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-amberSoft text-amberMuted flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-inkCharcoal block">
                    Jasa Pemasangan &amp; Setup Ringan
                  </span>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    Tarif jelas mulai Rp5.000 (tempered glass) hingga Rp50.000 untuk setup
                    perangkat/pembersihan port &amp; kipas luar.
                  </p>
                </div>
              </div>

              <div className="bg-stoneSurface p-3.5 rounded-lg border border-borderSubtle flex items-start gap-3">
                <div className="w-7 h-7 rounded bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-inkCharcoal block">
                    Pencatatan Permintaan Stok (SWOT Strategy)
                  </span>
                  <p className="text-textMuted mt-0.5 leading-relaxed">
                    Strategi mengatasi stok awal terbatas di Banda Aceh: titip tipe spesifik tanpa
                    biaya komitmen berlebih.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-borderSubtle text-xs text-textMuted flex flex-wrap items-center justify-between gap-2">
              <span>Area Layanan: Syiah Kuala, Kuta Alam, Baiturrahman, &amp; sekitarnya</span>
              <span className="font-semibold text-inkCharcoal">100% Bergaransi Toko</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
