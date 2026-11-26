import { useCallback, useEffect, useMemo, useState } from 'react';
import { CatalogSummarySection } from './components/CatalogSummarySection';
import { ChatContextState, ChatWidget } from './components/ChatWidget';
import { CompatibilityChecker } from './components/CompatibilityChecker';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PreorderSection } from './components/PreorderSection';
import { ServicesSection } from './components/ServicesSection';
import { WhatsAppModal } from './components/WhatsAppModal';
import { DeviceType, NeedCategory, PreorderItem, SummaryItem, UserProfile } from './types';

const STORAGE_KEYS = {
  SUMMARY: 'toko_akmal_summary_v1',
  PREORDER: 'toko_akmal_preorder_v1',
  CUST_NAME: 'toko_akmal_cust_name_v1',
  CUST_LOC: 'toko_akmal_cust_loc_v1',
};

function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [summaryItems, setSummaryItems] = useState<SummaryItem[]>(() =>
    readJsonStorage<SummaryItem[]>(STORAGE_KEYS.SUMMARY, [])
  );
  const [preorderQueue, setPreorderQueue] = useState<PreorderItem[]>(() =>
    readJsonStorage<PreorderItem[]>(STORAGE_KEYS.PREORDER, [])
  );
  const [custName, setCustName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CUST_NAME) || '';
    } catch {
      return '';
    }
  });
  const [custLoc, setCustLoc] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CUST_LOC) || '';
    } catch {
      return '';
    }
  });
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<{
    id: number;
    text: string;
    activeTab?: string;
  } | null>(null);
  const [compatSelection, setCompatSelection] = useState<{
    device: DeviceType;
    category: NeedCategory;
    profile: UserProfile;
  }>({
    device: 'laptop',
    category: 'power',
    profile: 'mahasiswa',
  });
  const [activeTab, setActiveTab] = useState<string>('beranda');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summaryItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [summaryItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREORDER, JSON.stringify(preorderQueue));
    } catch {
      // Ignore storage quota errors
    }
  }, [preorderQueue]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUST_NAME, custName);
    } catch {
      // Ignore storage quota errors
    }
  }, [custName]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUST_LOC, custLoc);
    } catch {
      // Ignore storage quota errors
    }
  }, [custLoc]);

  const addToSummary = (title: string, priceOrNote: string, category: string) => {
    const id = `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setSummaryItems((prev) => [...prev, { id, title, priceOrNote, category }]);
  };

  const removeFromSummary = (id: string) => {
    setSummaryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearSummary = () => {
    setSummaryItems([]);
  };

  const handleAddServiceToSummary = (name: string, price: string) => {
    addToSummary(name, price, 'Jasa Teknis Konter');
  };

  const handlePreorderSubmit = (item: Omit<PreorderItem, 'id' | 'date'>) => {
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const newPreorder: PreorderItem = {
      ...item,
      id: `po_${Date.now()}`,
      date: nowTime,
    };
    setPreorderQueue((prev) => [...prev, newPreorder]);
    addToSummary(
      `Pre-Order: ${item.product} (${item.tier})`,
      `Untuk: ${item.device} | Urgensi: ${item.urgency}`,
      'Titip Stok / Pre-Order'
    );
  };

  const handleRemovePreorder = (id: string) => {
    setPreorderQueue((prev) => prev.filter((po) => po.id !== id));
  };

  const scrollToSummary = () => {
    const el = document.getElementById('ringkasan-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectionChange = useCallback(
    (selection: { device: DeviceType; category: NeedCategory; profile: UserProfile }) => {
      setCompatSelection(selection);
    },
    []
  );

  const handleOpenChatWithPrompt = useCallback((text: string, sourceTab?: string) => {
    if (sourceTab) {
      setActiveTab(sourceTab);
    }
    setChatOpen(true);
    setPendingChatPrompt({
      id: Date.now(),
      text,
      activeTab: sourceTab,
    });
  }, []);

  const handleConsumePendingPrompt = useCallback(() => {
    setPendingChatPrompt(null);
  }, []);

  const handleAskCompatibilityInChat = useCallback(
    (promptText: string) => {
      handleOpenChatWithPrompt(promptText, 'kompatibilitas');
    },
    [handleOpenChatWithPrompt]
  );

  const handleSendPreorderToChat = useCallback(() => {
    if (preorderQueue.length === 0) return;
    const lines = preorderQueue.map(
      (po, idx) =>
        `${idx + 1}. ${po.product} (kelas ${po.tier}) untuk ${po.device} — urgensi: ${po.urgency}${po.notes ? `, catatan: ${po.notes}` : ''}`
    );
    const prompt = `Halo Toko Akmal, saya ingin menanyakan ketersediaan stok / titip pre-order untuk daftar berikut:\n${lines.join('\n')}\nMohon info estimasi harga dan ketersediaannya di gerai Banda Aceh.`;
    handleOpenChatWithPrompt(prompt, 'preorder');
  }, [preorderQueue, handleOpenChatWithPrompt]);

  const handleSendSummaryToChat = useCallback(() => {
    if (summaryItems.length === 0) {
      handleOpenChatWithPrompt(
        'Halo Toko Akmal, saya ingin konsultasi rekomendasi aksesori laptop/HP dan ketersediaan stok di Banda Aceh.',
        'ringkasan'
      );
      return;
    }
    const lines = summaryItems.map(
      (item, idx) => `${idx + 1}. [${item.category}] ${item.title} (${item.priceOrNote})`
    );
    const prompt = `Halo Toko Akmal, ini ringkasan kebutuhan saya:\n${lines.join('\n')}\nMohon cek kecocokan, estimasi harga, dan ketersediaan di gerai Banda Aceh.`;
    handleOpenChatWithPrompt(prompt, 'ringkasan');
  }, [summaryItems, handleOpenChatWithPrompt]);

  const chatContextState = useMemo<ChatContextState>(
    () => ({
      selectedDevice: compatSelection.device,
      selectedCategory: compatSelection.category,
      selectedProfile: compatSelection.profile,
      activeTab,
    }),
    [compatSelection, activeTab]
  );

  const formattedSummaryText = useMemo(() => {
    const name = custName.trim() || 'Pelanggan Toko Akmal';
    const loc = custLoc.trim() || 'Banda Aceh';

    let msg = `Halo Toko Akmal Banda Aceh,\nSaya ingin konsultasi / konfirmasi aksesori dan layanan teknis:\n\n`;
    msg += `Nama: ${name}\n`;
    msg += `Lokasi: ${loc}\n`;
    msg += `------------------------------------\n`;

    if (summaryItems.length === 0) {
      msg += `(Belum ada item dipilih, ingin bertanya langsung ketersediaan aksesori).\n`;
    } else {
      msg += `DAFTAR KEBUTUHAN / JASA:\n`;
      summaryItems.forEach((item, index) => {
        msg += `${index + 1}. [${item.category}] ${item.title} (${item.priceOrNote})\n`;
      });
    }

    msg += `------------------------------------\n`;
    msg += `Mohon info ketersediaan stok di gerai Banda Aceh atau waktu yang tepat untuk datang konsultasi fisik. Terima kasih!`;
    return msg;
  }, [custName, custLoc, summaryItems]);

  return (
    <div className="min-h-screen flex flex-col bg-stoneSurface text-inkCharcoal">
      <Header
        summaryCount={summaryItems.length}
        onScrollToSummary={scrollToSummary}
        onOpenWhatsAppModal={() => setWaModalOpen(true)}
      />

      <main className="flex-1">
        <HeroSection />
        <CompatibilityChecker
          onAddToSummary={addToSummary}
          onSelectionChange={handleSelectionChange}
          onAskInChat={handleAskCompatibilityInChat}
        />
        <ServicesSection onAddServiceToSummary={handleAddServiceToSummary} />
        <PreorderSection
          preorderQueue={preorderQueue}
          onSubmitPreorder={handlePreorderSubmit}
          onRemovePreorder={handleRemovePreorder}
          onSendPreorderToChat={handleSendPreorderToChat}
        />
        <CatalogSummarySection
          summaryItems={summaryItems}
          custName={custName}
          custLoc={custLoc}
          onCustNameChange={setCustName}
          onCustLocChange={setCustLoc}
          onAddToSummary={addToSummary}
          onRemoveFromSummary={removeFromSummary}
          onClearSummary={clearSummary}
          onOpenWhatsAppModal={() => setWaModalOpen(true)}
          onSendSummaryToChat={handleSendSummaryToChat}
          formattedSummaryText={formattedSummaryText}
        />
      </main>

      <Footer />

      <WhatsAppModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        formattedText={formattedSummaryText}
        itemCount={summaryItems.length}
      />

      <ErrorBoundary compact fallbackTitle="Panel obrolan sedang dimuat ulang">
        <ChatWidget
          isOpen={chatOpen}
          onOpenChange={setChatOpen}
          pendingPrompt={pendingChatPrompt}
          onConsumePendingPrompt={handleConsumePendingPrompt}
          custName={custName}
          custLoc={custLoc}
          summaryItems={summaryItems}
          preorderQueue={preorderQueue}
          contextState={chatContextState}
          formattedSummaryText={formattedSummaryText}
          onOpenWhatsAppModal={() => setWaModalOpen(true)}
        />
      </ErrorBoundary>
    </div>
  );
}
