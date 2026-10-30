import { Transaction, BudgetItem, MonthBudgetPlan, TransactionType } from '../types/finance';

export const INITIAL_TOTAL_BUDGET = 3000000; // Rp 3.000.000 (Matches Reference Screenshot)
export const INITIAL_START_BALANCE = 3000000; // Rp 3.000.000
export const INITIAL_BUDGET_PERIOD = '21-Feb - 21-Mar';

export const DEFAULT_BUDGET_ITEMS: BudgetItem[] = [
  // --- FEBRUARI 2026 (EXACT MATCH TO REFERENCE SCREENSHOT) ---
  // Income
  { id: 'b_inc_1', month: '2026-02', type: 'income', category: 'Gaji bulanan', expected: 3000000 },
  { id: 'b_inc_2', month: '2026-02', type: 'income', category: 'Side hustle', expected: 0 },
  { id: 'b_inc_3', month: '2026-02', type: 'income', category: 'Freelance', expected: 0 },

  // Needs (Total Expected: Rp 1.500.000)
  { id: 'b_nd_1', month: '2026-02', type: 'needs', category: 'Belanja bulanan', expected: 300000 },
  { id: 'b_nd_2', month: '2026-02', type: 'needs', category: 'Makan', expected: 300000 },
  { id: 'b_nd_3', month: '2026-02', type: 'needs', category: 'Listrik', expected: 50000 },
  { id: 'b_nd_4', month: '2026-02', type: 'needs', category: 'Wifi', expected: 50000 },
  { id: 'b_nd_5', month: '2026-02', type: 'needs', category: 'Kost', expected: 300000 },
  { id: 'b_nd_6', month: '2026-02', type: 'needs', category: 'Rawat kucing', expected: 100000 },
  { id: 'b_nd_7', month: '2026-02', type: 'needs', category: 'Bensin/Transport', expected: 0 },
  { id: 'b_nd_8', month: '2026-02', type: 'needs', category: 'Uang kuliah', expected: 0 },
  { id: 'b_nd_9', month: '2026-02', type: 'needs', category: 'Alat rumah tangga', expected: 0 },
  { id: 'b_nd_10', month: '2026-02', type: 'needs', category: 'Unforeseen Needs', expected: 400000 },

  // Wants (Total Expected: Rp 900.000)
  { id: 'b_wn_1', month: '2026-02', type: 'wants', category: 'Snack', expected: 100000 },
  { id: 'b_wn_2', month: '2026-02', type: 'wants', category: 'Fashion', expected: 120000 },
  { id: 'b_wn_3', month: '2026-02', type: 'wants', category: 'Hadiah ulang tahun', expected: 60000 },
  { id: 'b_wn_4', month: '2026-02', type: 'wants', category: 'Skincare', expected: 30000 },
  { id: 'b_wn_5', month: '2026-02', type: 'wants', category: 'Unforeseen Wants', expected: 590000 },

  // Savings (Total Expected: Rp 600.000)
  { id: 'b_sv_1', month: '2026-02', type: 'savings', category: 'Dana darurat', expected: 200000 },
  { id: 'b_sv_2', month: '2026-02', type: 'savings', category: 'Tabungan umroh', expected: 0 },
  { id: 'b_sv_3', month: '2026-02', type: 'savings', category: 'Mobil baru', expected: 0 },
  { id: 'b_sv_4', month: '2026-02', type: 'savings', category: 'Umrah', expected: 0 },
  { id: 'b_sv_5', month: '2026-02', type: 'savings', category: 'Unforeseen Goal', expected: 400000 },

  // Debt (Total Expected: Rp 200.000)
  { id: 'b_db_1', month: '2026-02', type: 'debt', category: 'Cicilan Gadget / Paylater', expected: 200000 }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // --- INCOME (Total: Rp 1.250.000) ---
  {
    id: 'tx_inc_1',
    date: '2026-02-01',
    type: 'income',
    category: 'Gaji bulanan',
    amount: 250000,
    notes: 'Sebagian gaji masuk'
  },
  {
    id: 'tx_inc_2',
    date: '2026-02-15',
    type: 'income',
    category: 'Side hustle',
    amount: 1000000,
    notes: 'Pendapatan project sampingan'
  },

  // --- NEEDS (Total: Rp 400.000) ---
  {
    id: 'tx_nd_1',
    date: '2026-02-02',
    type: 'needs',
    category: 'Kost',
    amount: 300000,
    notes: 'Bayar sewa kost bulanan'
  },
  {
    id: 'tx_nd_2',
    date: '2026-02-08',
    type: 'needs',
    category: 'Belanja bulanan',
    amount: 100000,
    notes: 'Kebutuhan pokok dapur'
  },

  // --- WANTS (Total: Rp 550.000) ---
  {
    id: 'tx_wn_1',
    date: '2026-02-10',
    type: 'wants',
    category: 'Fashion',
    amount: 300000,
    notes: 'Beli pakaian kerja baru'
  },
  {
    id: 'tx_wn_2',
    date: '2026-02-14',
    type: 'wants',
    category: 'Baju lebaran',
    amount: 250000,
    notes: 'Baju lebaran diskon'
  },

  // --- DEBT (Total: Rp 200.000) ---
  {
    id: 'tx_db_1',
    date: '2026-02-05',
    type: 'debt',
    category: 'Cicilan Gadget / Paylater',
    amount: 200000,
    notes: 'Cicilan bulanan terbayar'
  },

  // --- SAVINGS (Total: Rp 100.000) ---
  {
    id: 'tx_sv_1',
    date: '2026-02-04',
    type: 'savings',
    category: 'Dana darurat',
    amount: 100000,
    notes: 'Setor dana darurat'
  }
];

export const CATEGORY_PRESETS: Record<TransactionType, string[]> = {
  income: [
    'Gaji bulanan',
    'Side hustle',
    'Freelance',
    'Dividen & Investasi',
    'Bonus / Hadiah'
  ],
  needs: [
    'Belanja bulanan',
    'Makan',
    'Listrik',
    'Wifi',
    'Kost',
    'Rawat kucing',
    'Bensin/Transport',
    'Uang kuliah',
    'Alat rumah tangga',
    'Unforeseen Needs'
  ],
  wants: [
    'Snack',
    'Fashion',
    'Hadiah ulang tahun',
    'Skincare',
    'Baju lebaran',
    'Nongkrong & Kopi',
    'Unforeseen Wants'
  ],
  savings: [
    'Dana darurat',
    'Tabungan umroh',
    'Mobil baru',
    'Umrah',
    'Investasi Reksa Dana',
    'Unforeseen Goal'
  ],
  debt: [
    'Cicilan Gadget / Paylater',
    'Cicilan Motor',
    'Pinjaman Pribadi',
    'Kartu Kredit'
  ]
};
