export type DeviceType = 'laptop' | 'hp' | 'keduanya';
export type NeedCategory = 'power' | 'input' | 'protection' | 'audio';
export type UserProfile = 'mahasiswa' | 'kantoran' | 'umkm' | 'harian';
export type PriceTier = 'Ekonomis' | 'Reguler' | 'Premium';

export interface CatalogProduct {
  id: string;
  name: string;
  range: string;
  note: string;
  deviceGroup: 'laptop' | 'hp' | 'umum';
}

export interface CompatCheckItem {
  id: string;
  item: string;
  desc: string;
}

export interface CompatRecommendation {
  name: string;
  price: string;
}

export interface CompatEntry {
  title: string;
  checks: CompatCheckItem[];
  recomms: CompatRecommendation[];
}

export interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  tagTone: 'emerald' | 'amber' | 'neutral';
  description: string;
  priceRange: string;
  priceNote: string;
  whenNeeded: string;
  summaryTitle: string;
  kind: 'paid' | 'support';
}

export interface PreorderItem {
  id: string;
  product: string;
  tier: PriceTier;
  device: string;
  urgency: string;
  notes: string;
  date: string;
}

export interface SummaryItem {
  id: string;
  title: string;
  priceOrNote: string;
  category: string;
}
