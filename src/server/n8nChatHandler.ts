export interface ChatSummaryContextItem {
  title: string;
  priceOrNote: string;
  category: string;
}

export interface ChatPreorderContextItem {
  product: string;
  tier: string;
  device: string;
  urgency: string;
  notes: string;
}

export interface ChatHistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatContextMetadata {
  selectedDevice?: string;
  selectedCategory?: string;
  selectedProfile?: string;
  activeTab?: string;
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
  preorderItems?: ChatPreorderContextItem[];
  context?: ChatContextMetadata;
}

export interface ChatHandlerResult {
  status: number;
  body: {
    reply?: string;
    source?: 'n8n';
    error?: string;
    reason?: 'empty_output' | 'timeout' | 'upstream_error' | 'network_error' | 'invalid_input';
  };
}

const DEFAULT_N8N_WEBHOOK_URL =
  'https://n8n-n8n.cea37q.easypanel.host/webhook/tokoakmal-chat';

const UPSTREAM_TIMEOUT_MS = 45_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 25;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const NON_REPLY_N8N_DEFAULTS = new Set([
  'workflow was started',
  'workflow got started',
  'ok',
  'success',
]);

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

const METADATA_KEYS_TO_IGNORE = new Set([
  'sessionid',
  'session_id',
  'action',
  'status',
  'source',
  'timestamp',
  'id',
  'executionid',
  'workflowid',
  'ok',
  'success',
  'code',
  'role',
  'type',
  'model',
]);

function normalizeReplyText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .trim();
}

export function extractReplyFromN8n(data: unknown, depth = 0): string | null {
  if (depth > 8 || data === null || data === undefined) {
    return null;
  }

  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (!trimmed) return null;

    // Unwrap stringified JSON objects/arrays/strings (common in n8n Respond to Webhook Text mode)
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed !== data) {
          const unwrapped = extractReplyFromN8n(parsed, depth + 1);
          if (unwrapped) return unwrapped;
          if (parsed && typeof parsed === 'object') {
            return null;
          }
        }
      } catch {
        // Not valid JSON; treat as plain reply text below
      }
    }

    const cleaned = normalizeReplyText(trimmed);
    if (!cleaned) return null;
    if (NON_REPLY_N8N_DEFAULTS.has(cleaned.toLowerCase())) {
      return null;
    }
    return cleaned;
  }

  if (Array.isArray(data)) {
    const collected: string[] = [];
    for (const item of data) {
      const extracted = extractReplyFromN8n(item, depth + 1);
      if (extracted) collected.push(extracted);
    }
    return collected.length > 0 ? collected.join('\n\n') : null;
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidateKeys = [
      'reply',
      'output',
      'response',
      'text',
      'message',
      'balasan',
      'jawaban',
      'pesan',
      'hasil',
      'chatOutput',
      'replyText',
      'botReply',
      'aiResponse',
      'output_text',
      'generated_text',
      'answer',
      'result',
      'content',
      'parts',
      'choices',
      'candidates',
      'json',
      'body',
      'data',
      'item',
      'items',
    ];
    for (const key of candidateKeys) {
      if (key in record) {
        const extracted = extractReplyFromN8n(record[key], depth + 1);
        if (extracted) return extracted;
      }
    }

    // Fallback: inspect remaining non-metadata keys if workflow uses a custom field name
    for (const [key, value] of Object.entries(record)) {
      if (METADATA_KEYS_TO_IGNORE.has(key.toLowerCase())) continue;
      if (typeof value === 'string' || (value && typeof value === 'object')) {
        const extracted = extractReplyFromN8n(value, depth + 1);
        if (extracted) return extracted;
      }
    }
  }

  return null;
}

function sanitizeShortString(val: unknown, maxLen: number): string {
  return typeof val === 'string' ? val.trim().slice(0, maxLen) : '';
}

export async function handleN8nChat(
  rawBody: unknown,
  clientIp = 'unknown'
): Promise<ChatHandlerResult> {
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        error:
          'Permintaan terlalu cepat dalam waktu singkat. Mohon tunggu beberapa detik lalu coba kembali.',
        reason: 'upstream_error',
      },
    };
  }

  if (!rawBody || typeof rawBody !== 'object') {
    return {
      status: 400,
      body: { error: 'Format pesan tidak valid.', reason: 'invalid_input' },
    };
  }

  const input = rawBody as Partial<ChatRequestPayload>;
  if (typeof input.message !== 'string') {
    return {
      status: 400,
      body: { error: 'Pesan tidak boleh kosong.', reason: 'invalid_input' },
    };
  }

  const trimmedMessage = input.message.trim();
  if (!trimmedMessage) {
    return {
      status: 400,
      body: { error: 'Pesan tidak boleh kosong.', reason: 'invalid_input' },
    };
  }

  if (trimmedMessage.length > 2000) {
    return {
      status: 400,
      body: {
        error: 'Pesan terlalu panjang (maksimal 2.000 karakter).',
        reason: 'invalid_input',
      },
    };
  }

  const safeSessionId =
    typeof input.sessionId === 'string' && /^[a-zA-Z0-9_-]{4,100}$/.test(input.sessionId)
      ? input.sessionId
      : 'akmal-session-default';

  const safeCustomer = {
    name: sanitizeShortString(input.customer?.name, 100),
    location: sanitizeShortString(input.customer?.location, 120),
  };

  const safeContext: ChatContextMetadata = {
    selectedDevice: sanitizeShortString(input.context?.selectedDevice, 40),
    selectedCategory: sanitizeShortString(input.context?.selectedCategory, 40),
    selectedProfile: sanitizeShortString(input.context?.selectedProfile, 40),
    activeTab: sanitizeShortString(input.context?.activeTab, 60),
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

  const safePreorderItems: ChatPreorderContextItem[] = Array.isArray(input.preorderItems)
    ? input.preorderItems
        .slice(0, 10)
        .filter(
          (item): item is ChatPreorderContextItem =>
            Boolean(item) &&
            typeof item === 'object' &&
            typeof item.product === 'string' &&
            typeof item.tier === 'string' &&
            typeof item.device === 'string'
        )
        .map((item) => ({
          product: item.product.slice(0, 140),
          tier: item.tier.slice(0, 40),
          device: item.device.slice(0, 140),
          urgency: sanitizeShortString(item.urgency, 80),
          notes: sanitizeShortString(item.notes, 200),
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
    process.env.WEBHOOK_URL?.trim() ||
    process.env.N8N_WEBHOOK_URL?.trim() ||
    DEFAULT_N8N_WEBHOOK_URL;

  const validatedUrl = validateWebhookUrl(configuredWebhook);
  if (!validatedUrl) {
    return {
      status: 500,
      body: {
        error: 'Konfigurasi alamat webhook asisten belum valid.',
        reason: 'upstream_error',
      },
    };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain;q=0.9',
  };

  const contextParts: string[] = [];
  if (safeCustomer.name) contextParts.push(`Nama: ${safeCustomer.name}`);
  if (safeCustomer.location) contextParts.push(`Lokasi: ${safeCustomer.location}`);
  if (safeContext.selectedDevice) contextParts.push(`Perangkat: ${safeContext.selectedDevice}`);
  if (safeContext.selectedCategory) contextParts.push(`Kategori: ${safeContext.selectedCategory}`);
  if (safeContext.selectedProfile) contextParts.push(`Profil: ${safeContext.selectedProfile}`);
  if (safeSummaryItems.length > 0) {
    contextParts.push(
      `Ringkasan (${safeSummaryItems.length} item): ${safeSummaryItems
        .map((i) => `${i.title} [${i.priceOrNote}]`)
        .join('; ')}`
    );
  }
  if (safePreorderItems.length > 0) {
    contextParts.push(
      `Pre-Order (${safePreorderItems.length} item): ${safePreorderItems
        .map((p) => `${p.product} (${p.tier}) u/ ${p.device}`)
        .join('; ')}`
    );
  }

  const outboundPayload = {
    sessionId: safeSessionId,
    message: trimmedMessage,
    source: 'web-toko-akmal-banda-aceh',
    timestamp: new Date().toISOString(),
    customer: safeCustomer,
    context: safeContext,
    contextSummary: contextParts.join(' | '),
    summaryItems: safeSummaryItems,
    preorderItems: safePreorderItems,
    history: safeHistory,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

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
      const errorText =
        upstream.status === 404
          ? 'Webhook asisten n8n belum aktif (404). Silakan aktifkan workflow di n8n atau lanjutkan konsultasi langsung via WhatsApp Toko Akmal Banda Aceh.'
          : 'Asisten otomatis Toko Akmal sedang tidak dapat merespons saat ini. Anda bisa langsung melanjutkan konsultasi lewat WhatsApp atau menyalin ringkasan kebutuhan Anda.';
      return {
        status: 502,
        body: {
          error: errorText,
          reason: 'upstream_error',
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
        },
      };
    }

    return {
      status: 502,
      body: {
        error:
          'Pesan sudah diterima server n8n, tetapi respons yang dikirim kembali masih kosong (belum ada teks balasan). Silakan cek node Respond to Webhook di n8n atau lanjutkan langsung via WhatsApp Toko Akmal.',
        reason: 'empty_output',
      },
    };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return {
      status: 504,
      body: {
        error: isAbort
          ? 'Waktu tunggu balasan asisten habis. Silakan coba lagi atau lanjutkan langsung ke WhatsApp konter Toko Akmal.'
          : 'Koneksi ke layanan asisten sedang terganggu. Anda tetap bisa menyalin ringkasan atau menghubungi konter via WhatsApp.',
        reason: isAbort ? 'timeout' : 'network_error',
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
