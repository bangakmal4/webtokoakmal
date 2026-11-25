import {
  CatalogProduct,
  CompatEntry,
  NeedCategory,
  ServiceItem,
  UserProfile,
} from '../types';

export const WHATSAPP_NUMBER = '6282277980000';
export const WHATSAPP_DISPLAY = '+62 822-7798-xxxx';

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'p1',
    name: 'Kabel Data HP (Type-C / Lightning)',
    range: 'Rp15.000 – Rp100.000',
    note: 'Fast charge support, braided tahan tekuk',
    deviceGroup: 'hp',
  },
  {
    id: 'p2',
    name: 'Charger HP (Batok Fast Charge)',
    range: 'Rp30.000 – Rp250.000',
    note: 'Support QC 3.0, PD 20W–65W GaN',
    deviceGroup: 'hp',
  },
  {
    id: 'p3',
    name: 'Mouse Laptop (Kabel / Wireless)',
    range: 'Rp35.000 – Rp250.000',
    note: 'Silent click, DPI adjustable, ergonomis',
    deviceGroup: 'laptop',
  },
  {
    id: 'p4',
    name: 'Keyboard (Compact / Tenkeyless)',
    range: 'Rp25.000 – Rp300.000',
    note: 'Tahan tumpahan air, membran & mechanical',
    deviceGroup: 'laptop',
  },
  {
    id: 'p5',
    name: 'Headset / Earphone / TWS',
    range: 'Rp25.000 – Rp350.000',
    note: 'Bass jernih, mic meeting kuliah/zoom',
    deviceGroup: 'umum',
  },
  {
    id: 'p6',
    name: 'USB Hub & Multiport Adapter',
    range: 'Rp25.000 – Rp250.000',
    note: 'Type-C ke USB 3.0, HDMI 4K, card reader',
    deviceGroup: 'laptop',
  },
  {
    id: 'p7',
    name: 'Stand Laptop Alumunium',
    range: 'Rp20.000 – Rp100.000',
    note: 'Mencegah overheating & leher bungkuk',
    deviceGroup: 'laptop',
  },
  {
    id: 'p8',
    name: 'Powerbank Fast Charge',
    range: 'Rp15.000 – Rp80.000',
    note: 'Kapasitas aman penerbangan, dual output',
    deviceGroup: 'hp',
  },
  {
    id: 'p9',
    name: 'Casing HP (Shockproof / Silikon)',
    range: 'Rp130.000 – Rp700.000+',
    note: 'Varian standar hingga military-grade drop',
    deviceGroup: 'hp',
  },
  {
    id: 'p10',
    name: 'Tempered Glass (Layar & Lensa)',
    range: 'Rp70.000 – Rp400.000',
    note: '9H hardness, anti-spy privacy, matte anti-oil',
    deviceGroup: 'hp',
  },
  {
    id: 'p11',
    name: 'Tas / Sleeve Laptop',
    range: 'Rp80.000 – Rp350.000',
    note: 'Busa pelindung tebal & material waterproof',
    deviceGroup: 'laptop',
  },
  {
    id: 'p12',
    name: 'Charger Laptop (Adaptor & PD)',
    range: 'Rp75.000 – Rp350.000',
    note: 'Tersedia ujung pin colokan berbagai tipe laptop',
    deviceGroup: 'laptop',
  },
];

export const COMPAT_MATRIX: Record<string, CompatEntry> = {
  'laptop-power': {
    title: 'Checklist Kompatibilitas Charger & Daya Laptop',
    checks: [
      {
        id: 'lp-1',
        item: 'Cek Jenis Colokan',
        desc: 'Apakah menggunakan Port USB-C (Power Delivery) atau Adaptor Barrel Pin (4.5mm, 5.5mm, square Lenovo)?',
      },
      {
        id: 'lp-2',
        item: 'Verifikasi Wattase Output',
        desc: 'Cek bagian bawah laptop: 45W, 65W, atau 90W. Wattase charger pengganti minimal sama dengan aslinya.',
      },
      {
        id: 'lp-3',
        item: 'Stabilitas Voltase',
        desc: 'Voltase (V) harus persis sama (umumnya 19V / 19.5V / 20V) agar motherboard tidak rusak.',
      },
    ],
    recomms: [
      { name: 'Charger Laptop Universal / Original Multi-Pin', price: 'Rp75.000 – Rp350.000' },
      { name: 'Charger GaN 65W USB-C PD Compact', price: 'Rp180.000 – Rp280.000' },
    ],
  },
  'laptop-input': {
    title: 'Checklist Kompatibilitas Input & Meja Kerja Laptop',
    checks: [
      {
        id: 'li-1',
        item: 'Ketersediaan Port USB',
        desc: 'Jika laptop tipis hanya punya port Type-C, pilih mouse/keyboard Bluetooth atau siapkan converter OTG/USB Hub.',
      },
      {
        id: 'li-2',
        item: 'Kenyamanan Silent Click',
        desc: 'Bagi mahasiswa USK/UIN yang sering di perpustakaan atau kos, mouse silent click sangat disarankan agar tidak berisik.',
      },
      {
        id: 'li-3',
        item: 'Stand Laptop Ergonomis',
        desc: 'Pastikan lebar stand muat untuk ukuran laptop Anda (13" hingga 16") dengan sirkulasi udara bawah bebas.',
      },
    ],
    recomms: [
      { name: 'Mouse Wireless Silent 2.4GHz + Bluetooth', price: 'Rp45.000 – Rp120.000' },
      { name: 'Stand Laptop Alumunium Lipat', price: 'Rp35.000 – Rp85.000' },
    ],
  },
  'laptop-protection': {
    title: 'Checklist Perlindungan Bodi & Tas Laptop',
    checks: [
      {
        id: 'lpr-1',
        item: 'Ketebalan Busa Tas',
        desc: 'Ukur diagonal laptop (misal 14 inci tipis vs 14 inci tebal). Jangan beli tas yang terlalu sempit pada bagian resleting.',
      },
      {
        id: 'lpr-2',
        item: 'Ketahanan Air (Water-Repellent)',
        desc: 'Penting untuk cuaca Banda Aceh saat berkendara motor melintasi Jembatan Lamnyong/Darussalam.',
      },
      {
        id: 'lpr-3',
        item: 'Skin Keyboard Pelindung',
        desc: 'Cek layout tombol (Enter lurus US layout vs Enter siku UK layout).',
      },
    ],
    recomms: [
      { name: 'Sleeve Case Laptop Busa Anti-Bentur', price: 'Rp80.000 – Rp160.000' },
      { name: 'Pelindung Keyboard Silikon Transparan', price: 'Rp15.000 – Rp35.000' },
    ],
  },
  'laptop-audio': {
    title: 'Checklist Audio & Port Dongle Laptop',
    checks: [
      {
        id: 'la-1',
        item: 'Jenis Jack Audio',
        desc: 'Periksa apakah laptop Anda memiliki Combo Audio Jack 3.5mm tunggal atau port terpisah mic & speaker.',
      },
      {
        id: 'la-2',
        item: 'Kebutuhan USB Hub Multiport',
        desc: 'Jika butuh proyektor kampus (port HDMI / VGA), pastikan USB Hub mendukung output video resolusi native.',
      },
    ],
    recomms: [
      { name: 'USB Hub 4-in-1 / 6-in-1 Type-C with HDMI', price: 'Rp95.000 – Rp240.000' },
      { name: 'Headset Kabel Jack 3.5mm + Mic Jernih', price: 'Rp45.000 – Rp135.000' },
    ],
  },
  'hp-power': {
    title: 'Checklist Kompatibilitas Charger & Kabel HP',
    checks: [
      {
        id: 'hp-1',
        item: 'Tipe Protokol Fast Charging',
        desc: 'Apakah HP Anda mendukung Quick Charge (Qualcomm), VOOC/Dart, SuperCharge, atau Power Delivery (iPhone & Samsung)?',
      },
      {
        id: 'hp-2',
        item: 'Kesesuaian Ujung Kabel',
        desc: 'Type-C to Type-C, USB-A to Type-C, atau USB-A/Type-C ke Lightning untuk iPhone generasi lama.',
      },
      {
        id: 'hp-3',
        item: 'Daya Output Aman',
        desc: 'Gunakan charger bersertifikasi dengan auto-cut off untuk menjaga baterai HP tidak cepat kembung.',
      },
    ],
    recomms: [
      { name: 'Charger Fast Charging 20W/33W Smart IC', price: 'Rp45.000 – Rp120.000' },
      { name: 'Kabel Data Type-C Braided 100W 1 Meter', price: 'Rp25.000 – Rp55.000' },
    ],
  },
  'hp-protection': {
    title: 'Checklist Tempered Glass & Casing HP',
    checks: [
      {
        id: 'hpr-1',
        item: 'Bentuk Lengkung Layar (2.5D / Curved)',
        desc: 'Layar melengkung butuh tempered glass UV atau flexible ceramic agar tidak mudah terangkat di pinggiran.',
      },
      {
        id: 'hpr-2',
        item: 'Toleransi Lubang Speaker & Kamera',
        desc: 'Pastikan casing tidak menekan pinggiran tempered glass yang baru dipasang.',
      },
      {
        id: 'hpr-3',
        item: 'Bahan Anti-Benturan Sudut',
        desc: 'Pilih casing dengan bantalan airbag di keempat sudut untuk perlindungan jatuh maksimal.',
      },
    ],
    recomms: [
      { name: 'Tempered Glass 9H Full Cover Anti-Spy', price: 'Rp35.000 – Rp90.000' },
      { name: 'Casing Hybrid Shockproof Bening Anti-Kuning', price: 'Rp30.000 – Rp85.000' },
    ],
  },
  'hp-input': {
    title: 'Checklist Aksesori Input & Stand HP',
    checks: [
      {
        id: 'hi-1',
        item: 'Support OTG (On-The-Go)',
        desc: 'Untuk mencolokkan flashdisk atau mouse ke HP, pastikan pengaturan OTG di HP sudah aktif.',
      },
      {
        id: 'hi-2',
        item: 'Holder Meja Kerja Kokoh',
        desc: 'Stand HP dengan bantalan silikon agar bodi tidak lecet saat video call atau kuliah online.',
      },
    ],
    recomms: [
      { name: 'Adapter OTG Mini Type-C Metal', price: 'Rp15.000 – Rp30.000' },
      { name: 'Stand Holder HP Meja Lipat Rotasi', price: 'Rp20.000 – Rp45.000' },
    ],
  },
  'hp-audio': {
    title: 'Checklist Audio HP & Bluetooth Wireless',
    checks: [
      {
        id: 'ha-1',
        item: 'Ketiadaan Lubang Jack 3.5mm',
        desc: 'HP keluaran baru umumnya hanya punya port Type-C; wajib menggunakan dongle Type-C DAC atau earphone TWS Bluetooth.',
      },
      {
        id: 'ha-2',
        item: 'Latensi Suara Rendah',
        desc: 'Pilih TWS dengan chip Bluetooth 5.3 agar audio tidak delay saat menonton video materi kuliah atau meeting.',
      },
    ],
    recomms: [
      { name: 'Dongle Converter Type-C ke Audio 3.5mm DAC', price: 'Rp25.000 – Rp60.000' },
      { name: 'TWS Bluetooth 5.3 Earphone Low-Latency', price: 'Rp85.000 – Rp210.000' },
    ],
  },
};

export const PROFILE_NOTES: Record<UserProfile, Record<NeedCategory, string>> = {
  mahasiswa: {
    power: 'Tips Mahasiswa (USK/UIN/Unida): Pilih charger GaN dual-port atau kabel braided 1,5m agar praktis dipakai di colokan sudut ruang kelas maupun kos.',
    input: 'Tips Mahasiswa: Mouse silent click + stand alumunium lipat ringan memudahkan kerja tugas di perpustakaan atau kafe Darussalam.',
    protection: 'Tips Mahasiswa: Prioritaskan sleeve/tas anti-air saat berkendara motor ke kampus saat musim hujan Aceh.',
    audio: 'Tips Mahasiswa: Pastikan USB Hub sudah memiliki port HDMI untuk presentasi proyektor kelas dan jack mic stabil untuk Zoom.',
  },
  kantoran: {
    power: 'Tips Pekerja & Freelancer: Gunakan adaptor berdaya stabil dengan proteksi lonjakan arus agar laptop kerja dan HP aman saat diisi bersamaan.',
    input: 'Tips Pekerja & Freelancer: Keyboard TKL atau mouse ergonomis DPI adjustable menjaga pergelangan tangan nyaman untuk kerja 8+ jam.',
    protection: 'Tips Pekerja & Freelancer: Tempered glass anti-spy menjaga kerahasiaan layar kerja saat meeting di ruang publik.',
    audio: 'Tips Pekerja & Freelancer: Headset dengan noise-cancelling mic atau TWS multipoint memudahkan perpindahan panggilan laptop ke HP.',
  },
  umkm: {
    power: 'Tips Pelaku UMKM: Pastikan kabel data dan adaptor kasir/tablet memiliki sertifikasi arus stabil untuk pemakaian operasional nonstop seharian.',
    input: 'Tips Pelaku UMKM: Cek dukungan OTG atau USB Hub stabil untuk menghubungkan printer thermal kasir & barcode scanner.',
    protection: 'Tips Pelaku UMKM: Wajib pakai casing shockproof sudut tebal dan tempered glass 9H untuk HP kasir/operasional toko.',
    audio: 'Tips Pelaku UMKM: Gunakan dongle/splitter berkualitas jika perangkat dipakai untuk live jualan atau pemantauan order suara.',
  },
  harian: {
    power: 'Tips Penggunaan Harian: Pilih paket charger + kabel braided bergaransi toko agar lebih awet dan tidak merusak kesehatan baterai.',
    input: 'Tips Penggunaan Harian: Stand holder meja lipat membuat nonton dan video call keluarga lebih nyaman tanpa pegal.',
    protection: 'Tips Penggunaan Harian: Casing anti-kuning + tempered glass bening menjaga tampilan perangkat tetap bersih dan aman.',
    audio: 'Tips Penggunaan Harian: Earphone jack 3.5mm atau TWS Bluetooth 5.3 siap langsung diuji kualitas suaranya di meja konter.',
  },
};

export const PROFILE_LABELS: Record<UserProfile, string> = {
  mahasiswa: 'Pelajar / Mahasiswa',
  kantoran: 'Pekerja / Freelancer',
  umkm: 'Pelaku UMKM',
  harian: 'Penggunaan Harian',
};

export const CATEGORY_LABELS: Record<NeedCategory, string> = {
  power: 'DAYA & CHARGER/KABEL',
  input: 'INPUT & MEJA KERJA',
  protection: 'PERLINDUNGAN & TAS',
  audio: 'AUDIO & KONEKSI',
};

export const PAID_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Pemasangan Tempered Glass (HP & Tablet)',
    tag: 'Presisi & Rapi',
    tagTone: 'emerald',
    description:
      'Pemasangan anti-gelembung, pembersihan debu mikro, dan penyelarasan sudut layar.',
    priceRange: 'Rp5.000 – Rp20.000',
    priceNote: 'Tergantung kelengkungan layar',
    whenNeeded: 'Saat beli tempered glass baru atau ganti yang retak.',
    summaryTitle: 'Jasa Pasang Tempered Glass',
    kind: 'paid',
  },
  {
    id: 'srv-2',
    title: 'Setup Perangkat Dasar (Laptop / HP)',
    tag: 'Siap Pakai',
    tagTone: 'amber',
    description:
      'Konfigurasi akun awal, install driver mouse/keyboard/printer, setup printer thermal kasir UMKM.',
    priceRange: 'Rp15.000 – Rp50.000',
    priceNote: 'Sesuai tingkat konfigurasi',
    whenNeeded: 'HP/laptop baru beli, reset sistem, atau setup periferal kasir.',
    summaryTitle: 'Setup Perangkat Dasar',
    kind: 'paid',
  },
  {
    id: 'srv-3',
    title: 'Pembersihan Ringan Perangkat Luar',
    tag: 'Bebas Korosi Debu',
    tagTone: 'neutral',
    description:
      'Pembersihan sela keyboard mekanik/laptop, port charger Type-C berdebu, speaker grill & layar.',
    priceRange: 'Rp20.000 – Rp50.000',
    priceNote: 'Termasuk cairan pembersih khusus',
    whenNeeded: 'Charger sering longgar karena debu port, atau keyboard berpasir.',
    summaryTitle: 'Pembersihan Ringan Luar',
    kind: 'paid',
  },
];

export const SUPPORT_SERVICES: ServiceItem[] = [
  {
    id: 'sup-1',
    title: '1. Konsultasi Pemilihan Aksesori Sesuai Perangkat',
    tag: 'Gratis di Toko',
    tagTone: 'emerald',
    description:
      'Analisis spesifikasi voltase adaptor, ketahanan kabel braided vs silikon, dan rasio ergonomi mouse/keyboard untuk jam kerja panjang.',
    priceRange: 'Gratis (Konsultasi)',
    priceNote: 'Konsultasi konter gratis',
    whenNeeded: '',
    summaryTitle: 'Konsultasi Pemilihan Aksesori',
    kind: 'support',
  },
  {
    id: 'sup-2',
    title: '2. Pemasangan Aksesori Laptop',
    tag: 'Pendampingan',
    tagTone: 'neutral',
    description:
      'Pemasangan pelindung keyboard (silicone skin), screen protector anti-glare laptop, skin bodi, hingga perakitan stand pendingin alumunium.',
    priceRange: 'Rp10.000 – Rp25.000',
    priceNote: 'Pendampingan pasang',
    whenNeeded: '',
    summaryTitle: 'Pemasangan Aksesori Laptop',
    kind: 'support',
  },
  {
    id: 'sup-3',
    title: '3. Bantuan Instalasi Perangkat Lunak Legal',
    tag: 'Bantuan Teknis',
    tagTone: 'neutral',
    description:
      'Bantuan aktivasi lisensi resmi Microsoft 365, antivirus resmi, browser produktivitas, serta utilitas kompresi file untuk keperluan kuliah/kerja.',
    priceRange: 'Rp25.000 – Rp50.000',
    priceNote: 'Bantuan teknis',
    whenNeeded: '',
    summaryTitle: 'Bantuan Software Legal',
    kind: 'support',
  },
];

export const PREORDER_PRODUCT_OPTIONS: { value: string; label: string }[] = [
  { value: 'Charger HP (Type-C / Lightning / Micro)', label: 'Charger HP (Fast Charge 20W - 65W)' },
  { value: 'Kabel Data HP (Type-C to C / Lightning)', label: 'Kabel Data HP (Silicone / Braided)' },
  { value: 'Charger Laptop (Type-C PD / Pin Adapter)', label: 'Charger Laptop (45W / 65W / 100W PD / Barrel Pin)' },
  { value: 'Mouse Laptop (Silent / Bluetooth / Gaming)', label: 'Mouse Laptop (Wireless / Bluetooth Silent)' },
  { value: 'Keyboard (Compact 60% / TKL / Full Size)', label: 'Keyboard (Wireless / Tenkeyless / Kantor)' },
  { value: 'USB Hub & Adapter (Multi-port HDMI/LAN)', label: 'USB Hub & Converter (Type-C ke HDMI / USB 3.0 / LAN)' },
  { value: 'Stand Laptop (Alumunium Lipat / Ergonomis)', label: 'Stand Laptop (Alumunium Kokoh / Portable)' },
  { value: 'Tempered Glass HP / Tablet (Presisi Khusus)', label: 'Tempered Glass Tipe Tertentu (Matte / Privacy / Clear)' },
  { value: 'Tas Laptop (Waterproof Sleeve / Ransel)', label: 'Tas / Sleeve Laptop (Ukuran 13", 14", atau 15.6")' },
  { value: 'Casing HP (Shockproof / MagSafe / Slim)', label: 'Casing HP Varian Spesifik' },
  { value: 'Headset / TWS Earphone (ANC / Low Latency)', label: 'Headset / Earphone / TWS' },
  { value: 'Powerbank (10.000mAh / 20.000mAh Flight Safe)', label: 'Powerbank Fast Charging' },
  { value: 'Lainnya (Tuliskan di catatan)', label: 'Aksesori Khusus Lainnya' },
];
