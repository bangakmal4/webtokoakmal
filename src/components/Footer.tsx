import React from 'react';
import { WHATSAPP_DISPLAY } from '../data/storeData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stoneCard border-t border-borderSubtle py-12 text-inkCharcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-borderSubtle">
          <div className="md:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-bold text-lg text-inkCharcoal">Toko Akmal</span>
              <span className="text-xs text-emeraldDeep font-semibold">
                · Accessories Laptop &amp; HP
              </span>
            </div>
            <p className="text-xs text-textMuted leading-relaxed max-w-md">
              Usaha ritel aksesori teknologi lokal yang berorientasi pada kejujuran fungsi dan
              kecocokan teknis di Kota Banda Aceh. Kami membantu pelanggan memilih solusi tepat
              tanpa buang anggaran akibat salah spesifikasi.
            </p>
            <div className="text-xs text-textMuted pt-1">
              <strong className="text-inkCharcoal">Motto:</strong>{' '}
              <em>&ldquo;Murah, Lengkap, Terjangkau, dan Terpercaya&rdquo;</em>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-heading font-bold text-inkCharcoal block">Layanan Gerai</span>
            <ul className="space-y-1.5 text-textMuted">
              <li>Cek Port &amp; Watt Charger Gratis</li>
              <li>Pasang Tempered Glass Anti-Gelembung</li>
              <li>Setup Driver &amp; Periferal Kasir UMKM</li>
              <li>Pembersihan Port &amp; Kipas Luar</li>
              <li>Pre-Order Aksesori Langka</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-heading font-bold text-inkCharcoal block">
              Kontak &amp; Lokasi
            </span>
            <p className="text-textMuted">
              Kota Banda Aceh, Aceh (Dekat koridor kampus &amp; perkantoran)
            </p>
            <p className="text-textMuted">
              WhatsApp: <strong className="text-inkCharcoal">{WHATSAPP_DISPLAY}</strong>
            </p>
            <p className="text-textMuted">
              Jam Operasional: <strong className="text-inkCharcoal">09.00 – 21.30 WIB</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-textMuted gap-2">
          <p>
            © 2025 Toko Akmal Accessories Laptop dan HP. Konsultasi Terpadu Banda Aceh.
          </p>
          <div className="flex items-center gap-3">
            <span>Standar Transparansi Harga</span>
            <span aria-hidden="true">·</span>
            <span>Garansi Uji Fungsi di Konter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
