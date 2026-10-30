import {
  Transaction,
  BudgetItem,
  TransactionType,
  CategorySummary,
  CashFlowSummary,
  ComparisonGroup,
  DonutSlice
} from '../types/finance';

/**
 * Format number as Indonesian Rupiah (IDR)
 * e.g. 1500000 -> "Rp 1.500.000"
 */
export function formatRupiah(value: number, includePrefix = true): string {
  const isNegative = value < 0;
  const absValue = Math.abs(Math.round(value));
  const formatted = absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const prefix = includePrefix ? 'Rp ' : '';
  return isNegative ? `-${prefix}${formatted}` : `${prefix}${formatted}`;
}

/**
 * Parse formatted Rupiah string or raw number string to pure number
 */
export function parseRupiahInput(input: string): number {
  const clean = input.replace(/[^0-9-]/g, '');
  if (!clean) return 0;
  const num = parseInt(clean, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Filter transactions by month string (YYYY-MM)
 */
export function filterTransactionsByMonth(
  transactions: Transaction[],
  month: string
): Transaction[] {
  return transactions.filter(t => t.date.startsWith(month));
}

/**
 * Calculate totals for each group in Expected vs Actual comparison
 */
export function calculateComparisonGroups(
  transactions: Transaction[],
  budgetItems: BudgetItem[],
  month: string
): ComparisonGroup[] {
  const monthTransactions = filterTransactionsByMonth(transactions, month);
  const monthBudgetItems = budgetItems.filter(b => b.month === month);

  const types: Array<{ type: TransactionType; name: string; color: string }> = [
    { type: 'income', name: 'Income', color: '#8b5cf6' }, // Purple
    { type: 'needs', name: 'Needs (Kebutuhan)', color: '#f97316' }, // Orange
    { type: 'wants', name: 'Wants (Keinginan)', color: '#ec4899' }, // Pink/Rose
    { type: 'savings', name: 'Savings (Tabungan)', color: '#10b981' }, // Emerald Green
    { type: 'debt', name: 'Debt (Cicilan/Hutang)', color: '#ef4444' } // Red
  ];

  return types.map(t => {
    const expected = monthBudgetItems
      .filter(item => item.type === t.type)
      .reduce((sum, item) => sum + (item.expected || 0), 0);

    const actual = monthTransactions
      .filter(item => item.type === t.type)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    return {
      name: t.name,
      type: t.type,
      expected,
      actual,
      color: t.color
    };
  });
}

/**
 * Calculate Category summaries (Expected, Actual, Diff, Status)
 */
export function calculateCategorySummaries(
  transactions: Transaction[],
  budgetItems: BudgetItem[],
  month: string,
  type: TransactionType
): CategorySummary[] {
  const monthTransactions = filterTransactionsByMonth(transactions, month).filter(
    t => t.type === type
  );
  const monthBudgetItems = budgetItems.filter(
    b => b.month === month && b.type === type
  );

  // Gather unique category names
  const categoryMap = new Map<
    string,
    { expected: number; actual: number }
  >();

  monthBudgetItems.forEach(b => {
    categoryMap.set(b.category, { expected: b.expected, actual: 0 });
  });

  monthTransactions.forEach(t => {
    const existing = categoryMap.get(t.category) || { expected: 0, actual: 0 };
    existing.actual += t.amount;
    categoryMap.set(t.category, existing);
  });

  const summaries: CategorySummary[] = [];

  categoryMap.forEach((val, category) => {
    const expected = val.expected;
    const actual = val.actual;
    let diff = expected - actual;
    let status: 'under' | 'over' | 'exact' = 'exact';

    if (type === 'income') {
      // For income, actual >= expected is good (under budget doesn't apply, it's reached)
      diff = actual - expected;
      status = actual >= expected ? 'under' : 'over';
    } else {
      // For expenses (needs, wants, debt) & savings
      if (actual > expected) {
        status = 'over';
      } else if (actual < expected) {
        status = 'under';
      } else {
        status = 'exact';
      }
    }

    const percentage = expected > 0 ? Math.round((actual / expected) * 100) : (actual > 0 ? 100 : 0);

    summaries.push({
      category,
      type,
      expected,
      actual,
      diff,
      status,
      percentage
    });
  });

  // Sort by actual descending
  return summaries.sort((a, b) => b.actual - a.actual);
}

/**
 * Format number as Indonesian Rupiah with decimal points for tables
 * e.g. 3000000 -> "Rp 3,000,000.00"
 */
export function formatRupiahTable(value: number): string {
  if (value === 0) return '-';
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = absValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

/**
 * Format number as compact Rupiah without decimals for titles and badges
 * e.g. 1250000 -> "Rp 1250000"
 */
export function formatRupiahCompact(value: number): string {
  return `Rp ${Math.round(value)}`;
}

/**
 * Calculate Cash Flow Summary matching reference spreadsheet
 */
export function calculateCashFlow(
  transactions: Transaction[],
  month: string,
  totalBudget: number,
  startBalance = 3000000
): CashFlowSummary {
  const monthTransactions = filterTransactionsByMonth(transactions, month);

  let totalIncomeActual = 0;
  let totalNeedsActual = 0;
  let totalWantsActual = 0;
  let totalSavingsActual = 0;
  let totalDebtActual = 0;

  for (const t of monthTransactions) {
    if (t.type === 'income') totalIncomeActual += t.amount;
    else if (t.type === 'needs') totalNeedsActual += t.amount;
    else if (t.type === 'wants') totalWantsActual += t.amount;
    else if (t.type === 'savings') totalSavingsActual += t.amount;
    else if (t.type === 'debt') totalDebtActual += t.amount;
  }

  const totalExpenseActual = totalNeedsActual + totalWantsActual + totalDebtActual;
  const netCashFlow = totalIncomeActual - totalExpenseActual - totalSavingsActual;
  const totalLeftover = (startBalance + totalIncomeActual) - (totalExpenseActual + totalSavingsActual);
  const actualAmountLeftToSpend = Math.max(0, totalBudget - totalExpenseActual);
  const isUnderBudget = totalExpenseActual <= totalBudget;
  const spendPercentage = totalBudget > 0 ? Math.round((totalExpenseActual / totalBudget) * 100) : 0;

  return {
    startBalance,
    totalIncomeActual,
    totalNeedsActual,
    totalWantsActual,
    totalSavingsActual,
    totalDebtActual,
    totalExpenseActual,
    netCashFlow,
    actualAmountLeftToSpend: actualAmountLeftToSpend || startBalance,
    totalLeftover,
    isUnderBudget,
    spendPercentage
  };
}

/**
 * Top 20 Transaction Categories (by actual expense amounts)
 */
export function calculateTopCategories(
  transactions: Transaction[],
  month: string,
  limit = 20
): Array<{ category: string; type: TransactionType; amount: number; percentage: number }> {
  const monthTransactions = filterTransactionsByMonth(transactions, month).filter(
    t => t.type !== 'income'
  );

  const categoryMap = new Map<string, { type: TransactionType; amount: number }>();

  monthTransactions.forEach(t => {
    const existing = categoryMap.get(t.category) || { type: t.type, amount: 0 };
    existing.amount += t.amount;
    categoryMap.set(t.category, existing);
  });

  const totalSpend = Array.from(categoryMap.values()).reduce((sum, item) => sum + item.amount, 0);

  const list = Array.from(categoryMap.entries()).map(([category, val]) => ({
    category,
    type: val.type,
    amount: val.amount,
    percentage: totalSpend > 0 ? Math.round((val.amount / totalSpend) * 100) : 0
  }));

  list.sort((a, b) => b.amount - a.amount);
  return list.slice(0, limit);
}

const PALETTE = [
  '#f97316', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981',
  '#3b82f6', '#f59e0b', '#14b8a6', '#6366f1', '#e11d48',
  '#84cc16', '#a855f7', '#0ea5e9', '#d97706', '#64748b'
];

/**
 * Calculate Donut Slices for Expenses (Needs, Wants, Debt)
 */
export function calculateExpensesDonut(
  transactions: Transaction[],
  month: string
): DonutSlice[] {
  const monthTransactions = filterTransactionsByMonth(transactions, month).filter(
    t => t.type === 'needs' || t.type === 'wants' || t.type === 'debt'
  );

  const categoryMap = new Map<string, number>();
  monthTransactions.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
  if (total === 0) return [];

  const sorted = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, 6).map(([label, value], idx) => ({
    label,
    value,
    color: PALETTE[idx % PALETTE.length],
    percentage: Math.round((value / total) * 100)
  }));
}

/**
 * Calculate Donut Slices for Savings
 */
export function calculateSavingsDonut(
  transactions: Transaction[],
  month: string
): DonutSlice[] {
  const monthTransactions = filterTransactionsByMonth(transactions, month).filter(
    t => t.type === 'savings'
  );

  const categoryMap = new Map<string, number>();
  monthTransactions.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
  if (total === 0) return [];

  const sorted = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);

  return sorted.map(([label, value], idx) => ({
    label,
    value,
    color: ['#10b981', '#06b6d4', '#3b82f6', '#14b8a6', '#84cc16'][idx % 5],
    percentage: Math.round((value / total) * 100)
  }));
}

/**
 * Calculate Donut Slices for Income
 */
export function calculateIncomeDonut(
  transactions: Transaction[],
  month: string
): DonutSlice[] {
  const monthTransactions = filterTransactionsByMonth(transactions, month).filter(
    t => t.type === 'income'
  );

  const categoryMap = new Map<string, number>();
  monthTransactions.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
  if (total === 0) return [];

  const sorted = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);

  return sorted.map(([label, value], idx) => ({
    label,
    value,
    color: ['#8b5cf6', '#6366f1', '#a855f7', '#3b82f6', '#ec4899'][idx % 5],
    percentage: Math.round((value / total) * 100)
  }));
}

export const MONTH_NAMES_ID: Record<string, string> = {
  '01': 'Januari',
  '02': 'Februari',
  '03': 'Maret',
  '04': 'April',
  '05': 'Mei',
  '06': 'Juni',
  '07': 'Juli',
  '08': 'Agustus',
  '09': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Desember'
};

export function formatMonthYear(monthStr: string): string {
  // input: "2026-02"
  const [year, month] = monthStr.split('-');
  const monthName = MONTH_NAMES_ID[month] || month;
  return `${monthName} ${year}`;
}
