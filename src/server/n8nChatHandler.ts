import { GoogleGenAI, ThinkingLevel } from '@google/genai';

export interface ChatSummaryContextItem {
  title: string;
  priceOrNote: string;
  category: string;
}

export interface ChatHistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatRequestPayload {
  message: string;
  sessionId?: string;
  history?: ChatHistoryTurn[];
  customer?: {
    name?: string;
    location?: string;
  };
  summaryItems?: ChatSummaryContextItem[];
}

export interface ChatHandlerResult {
  status: number;
  body: {
    reply?: string;
    source?: 'n8n' | 'gemini-fallback';
    configured?: boolean;
    error?: string;
  };
}

const DEFAULT_N8N_WEBHOOK_URL =
  'https://n8n-n8n.cea37q.easypanel.host/webhook/chatbot-toko-akmal';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 25;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const NON_REPLY_N8N_DEFAULTS = new Set([
  'workflow was started',
  'workflow got started',
  'ok',
  'success',
]);

const TOKO_AKMAL_SYSTEM_INSTRUCTION = `Kamu adalah Asisten Resmi Toko Akmal Accessories Laptop & HP di Kota Banda Aceh.
Motto toko: "Murah, Lengkap, Terjangkau, dan Terpercaya".

Gaya komunikasi:
- Jawab dalam Bahasa Indonesia yang ramah, natural, spesifik, dan langsung menjawab inti pertanyaan pengguna (JANGAN memakai format template kaku atau mengulang daftar katalog lengkap jika pengguna hanya menanyakan 1 hal spesifik).
- Panggil pengguna dengan sopan ("Kak" atau sebut namanya jika tersedia).
- Berikan penjelasan teknis yang jujur dan praktis (misalnya voltase/wattase charger, pin barrel vs USB-C PD, layar 2.5D/curved untuk tempered glass, port Type-C untuk USB Hub/mouse).
- Jika perlu informasi lanjutan (misalnya seri laptop/HP atau daya adaptor bawaan), tanyakan singkat dan relevan.
- Jaga jawaban ringkas (sekitar 2–5 kalimat atau poin singkat seperlunya), mudah dibaca di jendela chat, tanpa markdown rumit seperti tabel.

Data resmi Toko Akmal Banda Aceh:
- Lokasi & Area Layanan: Kota Banda Aceh, Aceh (dekat koridor kampus USK, UIN, Unida & perkantoran; melayani Syiah Kuala, Kuta Alam, Baiturrahman & sekitarnya).
- Jam Operasional: Setiap hari, 09.00 – 21.30 WIB.
- WhatsApp Konsultasi: +62 822-7798-xxxx.
- Layanan Konter Unggulan: Konsultasi & uji coba fisik kompatibilitas port/watt/fitting tas GRATIS di meja gerai; garansi uji fungsi di konter; transparansi biaya disepakati sebelum pengerjaan.

Katalog 12 Produk Acuan (tersedia tier Ekonomis, Reguler, Premium):
1. Kabel Data HP (Type-C / Lightning, fast charge braided): Rp15.000 – Rp100.000
2. Charger HP (Batok Fast Charge QC 3.0 / PD 20W–65W GaN): Rp30.000 – Rp250.000
3. Mouse Laptop (Kabel / Wireless / Bluetooth Silent Click): Rp35.000 – Rp250.000
4. Keyboard (Compact / Tenkeyless, membran & mechanical): Rp25.000 – Rp300.000
5. Headset / Earphone / TWS (mic jernih kuliah/meeting): Rp25.000 – Rp350.000
6. USB Hub & Multiport Adapter (Type-C ke USB 3.0 / HDMI 4K / card reader): Rp25.000 – Rp250.000
7. Stand Laptop Alumunium Lipat Ergonomis: Rp20.000 – Rp100.000
8. Powerbank Fast Charge (aman penerbangan, dual output): Rp15.000 – Rp80.000
9. Casing HP (Silikon hingga Shockproof / Military-grade): Rp130.000 – Rp700.000+
10. Tempered Glass (Layar & Lensa 9H, clear / matte / anti-spy): Rp70.000 – Rp400.000
11. Tas / Sleeve Laptop (Busa tebal & waterproof 13"–15.6"): Rp80.000 – Rp350.000
12. Charger Laptop (Adaptor Multi-Pin & USB-C PD 45W/65W/100W): Rp75.000 – Rp350.000

Tarif Jasa Teknis Konter:
- Pemasangan Tempered Glass HP & Tablet (anti-gelembung): Rp5.000 – Rp20.000
- Setup Perangkat Dasar (akun, driver, printer thermal kasir UMKM): Rp15.000 – Rp50.000
- Pembersihan Ringan Luar (port Type-C, sela keyboard, layar, kipas luar): Rp20.000 – Rp50.000
- Pemasangan Aksesori Laptop (skin keyboard/screen/stand): Rp10.000 – Rp25.000
- Bantuan Instalasi Software Legal (Microsoft 365, antivirus resmi, utilitas): Rp25.000 – Rp50.000
- Konsultasi Pemilihan Aksesori di Toko: Gratis.

Kebijakan Titip Stok / Pre-Order:
- Jika tipe aksesori langka atau spesifikasi khusus belum tersedia di rak, pelanggan bisa mengisi formulir Titip Stok / Pre-Order di website (pilih kategori, tier Ekonomis/Reguler/Premium, seri perangkat, dan urgensi). Toko Akmal membandingkan 2–3 supplier distributor tanpa mark-up sepihak.`;

function checkRateLimit(clientKey: string): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(clientKey);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(clientKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (rateBuckets.size > 500) {
      for (const [k, v] of rateBuckets.entries()) {
        if (now > v.resetAt) rateBuckets.delete(k);
      }
    }
    return true;
  }
  if (entry.count >= RATE_MAX_REQUESTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

function validateWebhookUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    const host = parsed.hostname.toLowerCase();
    if (
      host === '169.254.169.254' ||
      host === 'metadata.google.internal' ||
      host === 'metadata' ||
      host.startsWith('169.254.')
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function extractReplyFromN8n(data: unknown): string | null {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed) return null;
    if (NON_REPLY_N8N_DEFAULTS.has(trimmed.toLowerCase())) {
      return null;
    }
    return trimmed;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const extracted = extractReplyFromN8n(item);
      if (extracted) return extracted;
    }
    return null;
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;

    // Standard n8n / AI Agent / Respond to Webhook fields
    const candidateKeys = [
      'output',
      'reply',
      'response',
      'message',
      'text',
      'answer',
      'content',
      'parts',
      'choices',
      'candidates',
      'data',
    ];
    for (const key of candidateKeys) {
      if (key in record) {
        const extracted = extractReplyFromN8n(record[key]);
        if (extracted) return extracted;
      }
    }
  }

  return null;
}

async function generateContextualGeminiReply(
  message: string,
  history: ChatHistoryTurn[],
  customer: { name: string; location: string },
  summaryItems: ChatSummaryContextItem[]
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const contextLines: string[] = [];
  if (customer.name) contextLines.push(`Nama pelanggan: ${customer.name}`);
  if (customer.location) contextLines.push(`Lokasi pelanggan: ${customer.location}`);
  if (summaryItems.length > 0) {
    const itemsText = summaryItems
      .map((item, idx) => `${idx + 1}. [${item.category}] ${item.title} (${item.priceOrNote})`)
      .join('; ');
    contextLines.push(`Item di ringkasan konsultasi pelanggan saat ini: ${itemsText}`);
  }

  const fullSystemInstruction =
    contextLines.length > 0
      ? `${TOKO_AKMAL_SYSTEM_INSTRUCTION}\n\nKonteks sesi pelanggan saat ini:\n${contextLines.join('\n')}`
      : TOKO_AKMAL_SYSTEM_INSTRUCTION;

  const contents = [
    ...history.map((turn) => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.text }],
    })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents,
    config: {
      systemInstruction: fullSystemInstruction,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
    },
  });

  const replyText = response.text?.trim();
  return replyText && replyText.length > 0 ? replyText : null;
}

export async function handleN8nChat(
  rawBody: unknown,
  clientIp = 'unknown'
): Promise<ChatHandlerResult> {
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        error: 'Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu sebentar lalu coba lagi.',
      },
    };
  }

  if (!rawBody || typeof rawBody !== 'object') {
    return {
      status: 400,
      body: { error: 'Format payload pesan tidak valid.' },
    };
  }

  const input = rawBody as Partial<ChatRequestPayload>;
  if (typeof input.message !== 'string') {
    return {
      status: 400,
      body: { error: 'Pesan tidak boleh kosong.' },
    };
  }

  const trimmedMessage = input.message.trim();
  if (!trimmedMessage) {
    return {
      status: 400,
      body: { error: 'Pesan tidak boleh kosong.' },
    };
  }

  if (trimmedMessage.length > 2000) {
    return {
      status: 400,
      body: { error: 'Pesan terlalu panjang (maksimal 2.000 karakter).' },
    };
  }

  const safeSessionId =
    typeof input.sessionId === 'string' && /^[a-zA-Z0-9_-]{4,100}$/.test(input.sessionId)
      ? input.sessionId
      : 'session_default';

  const safeCustomer = {
    name:
      typeof input.customer?.name === 'string'
        ? input.customer.name.trim().slice(0, 100)
        : '',
    location:
      typeof input.customer?.location === 'string'
        ? input.customer.location.trim().slice(0, 120)
        : '',
  };

  const safeSummaryItems: ChatSummaryContextItem[] = Array.isArray(input.summaryItems)
    ? input.summaryItems
        .slice(0, 20)
        .filter(
          (item): item is ChatSummaryContextItem =>
            Boolean(item) &&
            typeof item === 'object' &&
            typeof item.title === 'string' &&
            typeof item.priceOrNote === 'string' &&
            typeof item.category === 'string'
        )
        .map((item) => ({
          title: item.title.slice(0, 160),
          priceOrNote: item.priceOrNote.slice(0, 160),
          category: item.category.slice(0, 80),
        }))
    : [];

  const safeHistory: ChatHistoryTurn[] = Array.isArray(input.history)
    ? input.history
        .slice(-10)
        .filter(
          (turn): turn is ChatHistoryTurn =>
            Boolean(turn) &&
            typeof turn === 'object' &&
            (turn.role === 'user' || turn.role === 'assistant') &&
            typeof turn.text === 'string' &&
            turn.text.trim().length > 0
        )
        .map((turn) => ({
          role: turn.role,
          text: turn.text.trim().slice(0, 1000),
        }))
    : [];

  const configuredWebhook =
    process.env.N8N_WEBHOOK_URL?.trim() || DEFAULT_N8N_WEBHOOK_URL;

  const validatedUrl = validateWebhookUrl(configuredWebhook);
  if (!validatedUrl) {
    return {
      status: 500,
      body: {
        error: 'Konfigurasi N8N_WEBHOOK_URL pada server tidak valid. Pastikan menggunakan URL http/https yang benar.',
      },
    };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain;q=0.9',
  };

  const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();
  if (webhookSecret) {
    headers['X-Webhook-Secret'] = webhookSecret;
  }

  const outboundPayload = {
    chatInput: trimmedMessage,
    message: trimmedMessage,
    text: trimmedMessage,
    sessionId: safeSessionId,
    source: 'web-toko-akmal',
    timestamp: new Date().toISOString(),
    customer: safeCustomer,
    summaryItems: safeSummaryItems,
    history: safeHistory,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const upstream = await fetch(validatedUrl.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(outboundPayload),
      signal: controller.signal,
    });

    const contentType = upstream.headers.get('content-type') || '';
    const rawText = await upstream.text();

    if (!upstream.ok) {
      return {
        status: 502,
        body: {
          error: `Webhook n8n mengembalikan status ${upstream.status}. Pastikan workflow aktif dan node Respond to Webhook dikonfigurasi.`,
        },
      };
    }

    let parsedData: unknown = rawText;
    if (contentType.includes('application/json')) {
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        parsedData = rawText;
      }
    } else if (rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        parsedData = rawText;
      }
    }

    const n8nReply = extractReplyFromN8n(parsedData);
    if (n8nReply) {
      return {
        status: 200,
        body: {
          reply: n8nReply,
          source: 'n8n',
          configured: true,
        },
      };
    }

    // n8n accepted the webhook (HTTP 200) but returned an empty reply field.
    // Generate a genuine contextual answer via server-side Gemini instead of any static template.
    try {
      const dynamicReply = await generateContextualGeminiReply(
        trimmedMessage,
        safeHistory,
        safeCustomer,
        safeSummaryItems
      );
      if (dynamicReply) {
        return {
          status: 200,
          body: {
            reply: dynamicReply,
            source: 'gemini-fallback',
            configured: true,
          },
        };
      }
    } catch {
      // Fall through to explicit error below so empty n8n responses are never masked by templates
    }

    return {
      status: 502,
      body: {
        error:
          'Webhook n8n terhubung (HTTP 200), namun field "reply" yang dikembalikan kosong. Periksa mapping output pada node Respond to Webhook di n8n Anda (misalnya gunakan {{ $json.output }}).',
      },
    };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return {
      status: 504,
      body: {
        error: isAbort
          ? 'Permintaan ke webhook n8n melewati batas waktu (25 detik). Silakan coba lagi.'
          : 'Gagal terhubung ke webhook n8n. Periksa kembali status workflow atau koneksi server n8n Anda.',
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
