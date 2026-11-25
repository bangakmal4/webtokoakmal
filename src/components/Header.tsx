import React, { useState } from 'react';
import { ClipboardList, Menu, MessageCircle, X } from 'lucide-react';
import { WHATSAPP_DISPLAY } from '../data/storeData';

interface HeaderProps {
  summaryCount: number;
  onScrollToSummary: () => void;
  onOpenWhatsAppModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  summaryCount,
  onScrollToSummary,
  onOpenWhatsAppModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#kompatibilitas', label: 'Cek Kompatibilitas' },
    { href: '#jasa-teknis', label: 'Jasa & Teknis' },
    { href: '#preorder', label: 'Titip Stok' },
    { href: '#katalog', label: 'Katalog Acuan' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-stoneCard border-b border-borderSubtle text-xs text-textMuted py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-inkCharcoal">Lokasi Gerai: Banda Aceh, Aceh</span>
            <span className="text-zinc-300" aria-hidden="true">
              |
            </span>
            <span>Layanan Konsultasi Kompatibilitas Fisik &amp; Port Aksesori Laptop/HP</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline">
              WhatsApp Konsultasi: <strong className="text-inkCharcoal">{WHATSAPP_DISPLAY}</strong>
            </span>
            <span className="text-emeraldDeep font-semibold">
              Buka Setiap Hari · 09.00 – 21.30 WIB
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-stoneSurface/95 backdrop-blur-sm border-b border-borderSubtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand Lockup */}
          <a
            href="#top"
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emeraldDeep rounded-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-emeraldDeep flex items-center justify-center text-white font-heading font-bold text-base shadow-sm border border-emerald-900 shrink-0">
              AK
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-inkCharcoal whitespace-nowrap">
                  Toko Akmal
                </span>
                <span className="hidden sm:inline text-xs font-medium text-textMuted whitespace-nowrap">
                  · Banda Aceh
                </span>
              </div>
              <p className="hidden lg:block text-[11px] text-textMuted leading-tight whitespace-nowrap">
                Accessories Laptop &amp; HP ·{' '}
                <span className="text-emeraldDeep font-medium">
                  Murah, Lengkap, Terjangkau &amp; Terpercaya
                </span>
              </p>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-textMuted"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md hover:text-inkCharcoal hover:bg-stoneCard transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emeraldDeep"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onScrollToSummary}
              className="relative inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-emeraldDeep bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emeraldDeep"
            >
              <ClipboardList className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Ringkasan</span>
              <span className="ml-1.5 font-bold font-tabular">({summaryCount})</span>
            </button>
            <button
              type="button"
              onClick={onOpenWhatsAppModal}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-emeraldDeep hover:bg-emerald-800 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emeraldDeep"
            >
              <MessageCircle className="w-4 h-4 mr-1.5 shrink-0" />
              <span>Kirim WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-borderSubtle bg-stoneCard text-inkCharcoal hover:bg-stoneMuted transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-borderSubtle bg-stoneSurface px-4 py-3 space-y-2">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-inkCharcoal hover:bg-stoneCard transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhatsAppModal();
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-emeraldDeep hover:bg-emerald-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Kirim Ringkasan via WhatsApp
            </button>
          </div>
        )}
      </header>
    </>
  );
};
