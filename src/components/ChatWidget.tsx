import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  RotateCcw,
  SendHorizontal,
  X,
} from 'lucide-react';
import { SummaryItem } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatWidgetProps {
  custName: string;
  custLoc: string;
  summaryItems: SummaryItem[];
}

const STORAGE_MESSAGES_KEY = 'toko_akmal_chat_messages_v1';
const STORAGE_SESSION_KEY = 'toko_akmal_chat_session_v1';

const QUICK_PROMPTS = [
  'Cek charger cocok untuk laptop Asus 65W',
  'Berapa tarif pasang tempered glass di konter?',
  'Bagaimana cara titip stok aksesori langka?',
  'Jam operasional & lokasi Toko Akmal Banda Aceh',
];

function getTimeLabel(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getOrCreateSessionId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_SESSION_KEY);
    if (existing && /^[a-zA-Z0-9_-]{8,100}$/.test(existing)) {
      return existing;
    }
    const created = `akmal_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_SESSION_KEY, created);
    return created;
  } catch {
    return `akmal_${Date.now()}`;
  }
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    text: 'Halo! Saya Asisten Toko Akmal Banda Aceh. Tanyakan kecocokan port/watt aksesori laptop & HP, tarif jasa pasang, atau ketersediaan stok yang Anda butuhkan.',
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
  custName,
  custLoc,
  summaryItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(readStoredMessages);
  const [sessionId, setSessionId] = useState<string>(getOrCreateSessionId);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (rawText: string, appendUserMessage = true) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    setErrorMsg(null);
    setLastFailedText(null);

    const recentHistory = messages
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
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          history: recentHistory,
          customer: {
            name: custName,
            location: custLoc,
          },
          summaryItems: summaryItems.map((item) => ({
            title: item.title,
            priceOrNote: item.priceOrNote,
            category: item.category,
          })),
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || 'Tidak dapat memproses pesan ke layanan chatbot saat ini.'
        );
      }

      const replyText =
        typeof data.reply === 'string' && data.reply.trim().length > 0
          ? data.reply.trim()
          : 'Pesan diterima. Silakan lanjutkan pertanyaan Anda.';

      const botMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: getTimeLabel(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Terjadi gangguan jaringan saat menghubungi asisten.';
      setErrorMsg(message);
      setLastFailedText(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputValue, true);
  };

  const handleResetChat = () => {
    const nextSession = `akmal_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
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

  const showQuickPrompts = messages.length <= 1 && !isSending;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Chat Drawer Panel */}
      {isOpen && (
        <section
          aria-label="Chatbot Asisten Toko Akmal"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] h-[520px] max-h-[75vh] bg-stoneSurface border border-borderSubtle rounded-xl shadow-xl flex flex-col overflow-hidden"
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
                  Konsultasi kompatibilitas, stok &amp; jasa konter
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                title="Mulai percakapan baru"
                aria-label="Mulai percakapan baru"
                className="p-2 rounded-lg text-textMuted hover:text-inkCharcoal hover:bg-stoneMuted transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Tutup obrolan"
                aria-label="Tutup obrolan"
                className="p-2 rounded-lg text-textMuted hover:text-inkCharcoal hover:bg-stoneMuted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-stoneSurface">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-emeraldDeep text-white rounded-br-sm'
                        : 'bg-stoneCard text-inkCharcoal border border-borderSubtle rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 text-[10px] text-textMuted font-tabular px-1">
                    {isUser ? 'Anda' : 'Asisten'} · {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Quick Prompt Buttons */}
            {showQuickPrompts && (
              <div className="pt-1 space-y-1.5">
                <span className="text-[11px] font-semibold text-textMuted block">
                  Pertanyaan cepat:
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt, true)}
                      className="text-left text-xs px-3 py-2 rounded-lg bg-stoneCard hover:bg-stoneMuted border border-borderSubtle text-inkCharcoal transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isSending && (
              <div className="flex items-start">
                <div className="bg-stoneCard border border-borderSubtle rounded-xl rounded-bl-sm px-3.5 py-2.5 text-xs text-textMuted inline-flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emeraldDeep" />
                  <span>Memproses jawaban...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-amberSoft border border-amber-200 text-xs text-inkCharcoal space-y-2"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amberMuted shrink-0 mt-0.5" />
                  <p className="text-textMuted leading-relaxed">{errorMsg}</p>
                </div>
                {lastFailedText && (
                  <button
                    type="button"
                    onClick={() => void sendMessage(lastFailedText, false)}
                    className="text-xs font-semibold text-emeraldDeep hover:underline cursor-pointer"
                  >
                    Coba kirim ulang
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Context Hint when items exist in summary */}
          {summaryItems.length > 0 && (
            <div className="px-4 py-1.5 bg-stoneCard/70 border-t border-borderSubtle text-[11px] text-textMuted flex items-center justify-between">
              <span>Konteks ringkasan aktif dikirim bersama pesan</span>
              <span className="font-semibold text-emeraldDeep font-tabular">
                {summaryItems.length} item
              </span>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="bg-stoneCard border-t border-borderSubtle p-3 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tulis pertanyaan aksesori atau jasa..."
              aria-label="Tulis pesan untuk Asisten Toko Akmal"
              maxLength={2000}
              disabled={isSending}
              className="flex-1 min-w-0 bg-stoneSurface border border-borderSubtle rounded-lg px-3 py-2 text-xs sm:text-sm text-inkCharcoal placeholder:text-zinc-400 focus:outline-none focus:border-emeraldDeep disabled:opacity-60"
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
        onClick={() => setIsOpen((prev) => !prev)}
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
