import React, { useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, X } from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../data/storeData';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  formattedText: string;
  itemCount: number;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  formattedText,
  itemCount,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
    >
      <div className="bg-stoneSurface border border-borderSubtle rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-stoneCard border-b border-borderSubtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emeraldDeep text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 id="wa-modal-title" className="font-heading font-bold text-sm text-inkCharcoal">
                Pratinjau Pesan WhatsApp Toko Akmal
              </h3>
              <p className="text-[11px] text-textMuted">
                Tujuan: Konter Banda Aceh ({WHATSAPP_DISPLAY}) · {itemCount} Item
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau WhatsApp"
            className="p-1.5 rounded-lg text-textMuted hover:text-inkCharcoal hover:bg-stoneMuted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <pre className="whitespace-pre-wrap font-mono text-xs bg-stoneCard border border-borderSubtle rounded-lg p-4 text-inkCharcoal max-h-72 overflow-y-auto leading-relaxed">
            {formattedText}
          </pre>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-lg bg-emeraldDeep text-white font-heading font-semibold text-xs sm:text-sm hover:bg-emerald-800 transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Buka WhatsApp Sekarang</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-lg bg-stoneCard text-inkCharcoal border border-borderSubtle hover:bg-stoneMuted font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emeraldDeep" />
                  <span className="text-emeraldDeep">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Pesan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
