import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Loader2,
  MessageCircle,
  MessageSquare,
  RotateCcw,
  SendHorizontal,
  X,
} from 'lucide-react';
import { DeviceType, NeedCategory, PreorderItem, SummaryItem, UserProfile } from '../types';

import { ChatMessageContent } from './ChatMessageContent';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ChatContextState {
  selectedDevice: DeviceType;
  selectedCategory: NeedCategory;
  selectedProfile: UserProfile;
  activeTab?: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingPrompt: { id: number; text: string; activeTab?: string } | null;
  onConsumePendingPrompt: () => void;
  custName: string;
  custLoc: string;
  summaryItems: SummaryItem[];
  preorderQueue: PreorderItem[];
  contextState: ChatContextState;
  formattedSummaryText: string;
  onOpenWhatsAppModal: () => void;
}

const STORAGE_MESSAGES_KEY = 'toko_akmal_chat_messages_v1';
const STORAGE_SESSION_KEY = 'toko_akmal_chat_session_v1';

const QUICK_PROMPTS = [
  'Cek kecocokan charger / USB hub laptop & HP',
  'Rekomendasi paket ekonomis s.d. premium',
  'Info tarif pasang tempered glass & setup dasar',
  'Titip catatan stok / pre-order barang',
];

function getTimeLabel(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function generateSessionId(): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 12)
      : Math.random().toString(36).slice(2, 12);
  return `akmal-session-${Date.now()}-${randomPart}`;
}

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_SESSION_KEY);
    if (existing && /^akmal-session-[a-zA-Z0-9_-]{4,80}$/.test(existing)) {
      return existing;
    }
    const created = generateSessionId();
    localStorage.setItem(STORAGE_SESSION_KEY, created);
    return created;
  } catch {
    return generateSessionId();
  }
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    text: 'Halo! Saya Asisten Toko Akmal Banda Aceh. Silakan tanyakan kecocokan port & watt aksesori laptop/HP, paket ekonomis sampai premium, tarif jasa konter, atau titip stok pre-order.',
    timestamp: getTimeLabel(),
  };
}

function readStoredMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_MESSAGES_KEY);
    if (!raw) return [createWelcomeMessage()];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createWelcomeMessage()];
    }
    return parsed;
  } catch {
    return [createWelcomeMessage()];
  }
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onOpenChange,
  pendingPrompt,
  onConsumePendingPrompt,
  custName,
  custLoc,
  summaryItems,
  preorderQueue,
  contextState,
  formattedSummaryText,
  onOpenWhatsAppModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(readStoredMessages);
  const [sessionId, setSessionId] = useState<string>(getOrCreateSessionId);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const isSendingRef = useRef<boolean>(isSending);

  messagesRef.current = messages;
  isSendingRef.current = isSending;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, isSending]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpenChange]);

  const sendMessage = useCallback(
    async (rawText: string, appendUserMessage = true, activeTabOverride?: string) => {
      const text = rawText.trim();
      if (!text || isSendingRef.current) return;

      setErrorMsg(null);
      setLastFailedText(null);

      const recentHistory = messagesRef.current
        .filter((m) => m.id !== 'welcome')
        .slice(-10)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      if (appendUserMessage) {
        const userMsg: ChatMessage = {
          id: `u_${Date.now()}`,
          role: 'user',
          text,
          timestamp: getTimeLabel(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
        }
      }

      setIsSending(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            message: text,
            history: recentHistory,
            customer: {
              name: custName,
              location: custLoc,
            },
            context: {
              selectedDevice: contextState.selectedDevice,
              selectedCategory: contextState.selectedCategory,
              selectedProfile: contextState.selectedProfile,
              activeTab: activeTabOverride || contextState.activeTab || 'chat',
            },
            summaryItems: summaryItems.map((item) => ({
              title: item.title,
              priceOrNote: item.priceOrNote,
              category: item.category,
            })),
            preorderItems: preorderQueue.map((po) => ({
              product: po.product,
              tier: po.tier,
              device: po.device,
              urgency: po.urgency,
              notes: po.notes,
            })),
          }),
        });

        const data = (await response.json().catch(() => ({}))) as {
          reply?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(
            data.error ||
              'Asisten otomatis sedang belum dapat merespons. Silakan lanjutkan lewat WhatsApp atau salin ringkasan konsultasi Anda.'
          );
        }

        const replyText =
          typeof data.reply === 'string' && data.reply.trim().length > 0
            ? data.reply.trim()
            : 'Pesan Anda sudah diterima. Silakan lanjutkan pertanyaan Anda.';

        const botMsg: ChatMessage = {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: replyText,
          timestamp: getTimeLabel(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        const fallbackNotice =
          err instanceof Error
            ? err.message
            : 'Koneksi ke asisten sedang terganggu. Anda tetap bisa menyalin ringkasan atau melanjutkan konsultasi melalui WhatsApp Toko Akmal.';
        setErrorMsg(fallbackNotice);
        setLastFailedText(text);
      } finally {
        setIsSending(false);
      }
    },
    [
      sessionId,
      custName,
      custLoc,
      contextState.selectedDevice,
      contextState.selectedCategory,
      contextState.selectedProfile,
      contextState.activeTab,
      summaryItems,
      preorderQueue,
    ]
  );

  // Consume external prompts sent from Compatibility, Pre-Order, or Summary sections
  useEffect(() => {
    if (pendingPrompt && isOpen && !isSending) {
      const { text, activeTab } = pendingPrompt;
      onConsumePendingPrompt();
      void sendMessage(text, true, activeTab);
    }
  }, [pendingPrompt, isOpen, isSending, onConsumePendingPrompt, sendMessage]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputValue, true);
  };

  const handleResetChat = () => {
    const nextSession = generateSessionId();
    setSessionId(nextSession);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, nextSession);
    } catch {
      // Ignore storage errors
    }
    setMessages([createWelcomeMessage()]);
    setErrorMsg(null);
    setLastFailedText(null);
  };

  const handleSendActiveSummary = () => {
    if (summaryItems.length === 0 || isSending) return;
    const summaryLines = summaryItems
      .map((item, i) => `${i + 1}. [${item.category}] ${item.title} (${item.priceOrNote})`)
      .join('\n');
    const prompt = `Halo Toko Akmal, mohon bantu cek kecocokan & ketersediaan untuk daftar ringkasan saya berikut:\n${summaryLines}`;
    void sendMessage(prompt, true, 'ringkasan');
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => {
        setCopiedMsgId((curr) => (curr === msgId ? null : curr));
      }, 1800);
    } catch {
      setCopiedMsgId(null);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && inputValue.trim()) {
        void sendMessage(inputValue, true);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 108)}px`;
  };

  const handleCopyFallbackSummary = async () => {
    const textToCopy = lastFailedText
      ? `${formattedSummaryText}\n\nPertanyaan tambahan:\n${lastFailedText}`
      : formattedSummaryText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      setCopiedSummary(false);
    }
  };

  const showQuickPrompts = messages.length <= 1 && !isSending;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Chat Drawer Panel */}
      {isOpen && (
        <section
          aria-label="Asisten Obrolan Toko Akmal Banda Aceh"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[76vh] bg-stoneSurface border border-borderSubtle rounded-xl shadow-xl flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-stoneCard border-b border-borderSubtle px-4 py-3.5 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emeraldDeep text-white flex items-center justify-center font-heading font-bold text-xs shrink-0">
                AK
              </div>
              <div className="min-w-0">
                <h2 className="font-heading font-bold text-sm text-inkCharcoal truncate">
                  Asisten Toko Akmal
                </h2>
                <p className="text-[11px] text-textMuted truncate">
                  Banda Aceh · Cek kompatibilitas, tarif jasa &amp; stok
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                title="Mulai sesi obrolan baru"
                aria-label="Mulai sesi obrolan baru"
                className="p-2 rounded-lg text-textMuted hover:text-inkCharcoal hover:bg-stoneMuted transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                title="Tutup obrolan"
                aria-label="Tutup obrolan"
                className="p-2 rounded-lg text-textMuted hover:text-inkCharcoal hover:bg-stoneMuted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-stoneSurface"
            aria-live="polite"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isCopied = copiedMsgId === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed break-words ${
                      isUser
                        ? 'bg-emeraldDeep text-white rounded-br-sm whitespace-pre-wrap'
                        : 'bg-stoneCard text-inkCharcoal border border-borderSubtle rounded-bl-sm'
                    }`}
                  >
                    {isUser ? msg.text : <ChatMessageContent text={msg.text} />}
                  </div>
                  <div className="mt-1 flex items-center gap-2 px-1">
                    <span className="text-[10px] text-textMuted font-tabular">
                      {isUser ? 'Anda' : 'Asisten'} · {msg.timestamp}
                    </span>
                    {!isUser && msg.id !== 'welcome' && (
                      <button
                        type="button"
                        onClick={() => void handleCopyMessage(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 text-[10px] text-textMuted hover:text-emeraldDeep transition-colors cursor-pointer"
                        title="Salin balasan ini"
                        aria-label="Salin balasan asisten"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emeraldDeep" />
                            <span className="text-emeraldDeep">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Starter Prompts */}
            {showQuickPrompts && (
              <div className="pt-1 space-y-1.5">
                <span className="text-[11px] font-semibold text-textMuted block">
                  Topik cepat Toko Akmal:
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt, true, 'quick-prompt')}
                      className="text-left text-xs px-3 py-2 rounded-lg bg-stoneCard hover:bg-stoneMuted border border-borderSubtle text-inkCharcoal transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing / Loading Indicator */}
            {isSending && (
              <div className="flex items-start" role="status" aria-label="Menunggu balasan asisten">
                <div className="bg-stoneCard border border-borderSubtle rounded-xl rounded-bl-sm px-3.5 py-2.5 text-xs text-textMuted inline-flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emeraldDeep shrink-0" />
                  <span>Asisten sedang menyiapkan jawaban...</span>
                </div>
              </div>
            )}

            {/* Calm, Honest Fallback Card with WhatsApp & Copy Options */}
            {errorMsg && (
              <div
                role="alert"
                className="p-3.5 rounded-lg bg-amberSoft border border-amber-200 text-xs text-inkCharcoal space-y-2.5"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amberMuted shrink-0 mt-0.5" />
                  <p className="text-textMuted leading-relaxed">{errorMsg}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={onOpenWhatsAppModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emeraldDeep text-white font-semibold hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Lanjut via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleCopyFallbackSummary()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-stoneSurface border border-borderSubtle text-inkCharcoal font-medium hover:bg-stoneMuted transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emeraldDeep" />
                        <span className="text-emeraldDeep">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Ringkasan</span>
                      </>
                    )}
                  </button>

                  {lastFailedText && (
                    <button
                      type="button"
                      onClick={() => void sendMessage(lastFailedText, false)}
                      className="text-xs font-semibold text-amberMuted hover:underline px-1 cursor-pointer whitespace-nowrap"
                    >
                      Coba Lagi
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Active Summary Quick Bridge Bar */}
          {summaryItems.length > 0 && (
            <div className="px-4 py-2 bg-stoneCard/80 border-t border-borderSubtle text-[11px] text-textMuted flex items-center justify-between gap-2">
              <span className="truncate">
                Ringkasan aktif: <strong className="text-inkCharcoal font-tabular">{summaryItems.length} item</strong>
              </span>
              <button
                type="button"
                onClick={handleSendActiveSummary}
                disabled={isSending}
                className="text-[11px] font-semibold text-emeraldDeep hover:underline disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Kirim ke Obrolan →
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="bg-stoneCard border-t border-borderSubtle p-3 flex items-end gap-2 shrink-0"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Tulis pertanyaan aksesori, jasa, atau stok... (Enter untuk kirim)"
              aria-label="Tulis pesan untuk Asisten Toko Akmal"
              maxLength={2000}
              disabled={isSending}
              className="flex-1 min-w-0 resize-none bg-stoneSurface border border-borderSubtle rounded-lg px-3 py-2 text-xs sm:text-sm text-inkCharcoal placeholder:text-zinc-400 focus:outline-none focus:border-emeraldDeep disabled:opacity-60 max-h-[108px] leading-snug"
            />
            <button
              type="submit"
              disabled={isSending || !inputValue.trim()}
              aria-label="Kirim pesan"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emeraldDeep text-white hover:bg-emerald-800 transition-colors disabled:opacity-45 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup Asisten Toko Akmal' : 'Buka Asisten Toko Akmal'}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emeraldDeep text-white hover:bg-emerald-800 transition-colors shadow-lg border border-emerald-900 font-heading font-semibold text-xs sm:text-sm whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emeraldDeep"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 shrink-0" />
            <span>Tutup Obrolan</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Tanya Asisten</span>
          </>
        )}
      </button>
    </div>
  );
};
