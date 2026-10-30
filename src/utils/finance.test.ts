import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  parseRupiahInput,
  calculateCashFlow,
  calculateCategorySummaries,
  calculateTopCategories,
  calculateComparisonGroups
} from './finance';
import { Transaction, BudgetItem } from '../types/finance';

test('formatRupiah properly formats positive and negative amounts', () => {
  assert.equal(formatRupiah(1500000), 'Rp 1.500.000');
  assert.equal(formatRupiah(0), 'Rp 0');
  assert.equal(formatRupiah(-350000), '-Rp 350.000');
  assert.equal(formatRupiah(25000000, false), '25.000.000');
});

test('parseRupiahInput extracts correct numeric value', () => {
  assert.equal(parseRupiahInput('Rp 1.500.000'), 1500000);
  assert.equal(parseRupiahInput('30000000'), 30000000);
  assert.equal(parseRupiahInput(''), 0);
  assert.equal(parseRupiahInput('Rp -250.000'), -250000);
});

test('calculateCashFlow correctly computes expenses, net balance, and left to spend', () => {
  const transactions: Transaction[] = [
    { id: '1', date: '2026-02-01', type: 'income', category: 'Gaji Pokok', amount: 35000000, notes: '' },
    { id: '2', date: '2026-02-05', type: 'needs', category: 'Makanan & Minuman', amount: 5000000, notes: '' },
    { id: '3', date: '2026-02-10', type: 'wants', category: 'Belanja & Hobi', amount: 2000000, notes: '' },
    { id: '4', date: '2026-02-12', type: 'debt', category: 'Cicilan KPR', amount: 3000000, notes: '' },
    { id: '5', date: '2026-02-15', type: 'savings', category: 'Dana Darurat', amount: 4000000, notes: '' }
  ];

  const totalBudget = 30000000;
  const summary = calculateCashFlow(transactions, '2026-02', totalBudget);

  // Total expense actual = needs (5m) + wants (2m) + debt (3m) = 10m
  assert.equal(summary.totalExpenseActual, 10000000);
  assert.equal(summary.totalIncomeActual, 35000000);
  assert.equal(summary.totalSavingsActual, 4000000);

  // Net Cash Flow = income (35m) - expense (10m) - savings (4m) = 21m
  assert.equal(summary.netCashFlow, 21000000);

  // actualAmountLeftToSpend = totalBudget (30m) - totalExpenseActual (10m) = 20m
  assert.equal(summary.actualAmountLeftToSpend, 20000000);
  assert.equal(summary.isUnderBudget, true);
});

test('calculateCategorySummaries detects under and over budget items', () => {
  const transactions: Transaction[] = [
    { id: '1', date: '2026-02-02', type: 'needs', category: 'Makanan & Minuman', amount: 6500000, notes: '' },
    { id: '2', date: '2026-02-04', type: 'needs', category: 'Listrik & Air', amount: 900000, notes: '' }
  ];

  const budgetItems: BudgetItem[] = [
    { id: 'b1', month: '2026-02', type: 'needs', category: 'Makanan & Minuman', expected: 5000000 },
    { id: 'b2', month: '2026-02', type: 'needs', category: 'Listrik & Air', expected: 1200000 }
  ];

  const summaries = calculateCategorySummaries(transactions, budgetItems, '2026-02', 'needs');

  const food = summaries.find(s => s.category === 'Makanan & Minuman');
  assert.ok(food);
  assert.equal(food.actual, 6500000);
  assert.equal(food.expected, 5000000);
  assert.equal(food.status, 'over'); // 6.5m > 5m

  const util = summaries.find(s => s.category === 'Listrik & Air');
  assert.ok(util);
  assert.equal(util.actual, 900000);
  assert.equal(util.expected, 1200000);
  assert.equal(util.status, 'under'); // 0.9m < 1.2m
});

test('calculateTopCategories returns sorted top expense categories', () => {
  const transactions: Transaction[] = [
    { id: '1', date: '2026-02-01', type: 'needs', category: 'Makanan', amount: 2000000, notes: '' },
    { id: '2', date: '2026-02-02', type: 'wants', category: 'Kopi', amount: 500000, notes: '' },
    { id: '3', date: '2026-02-03', type: 'needs', category: 'Sewa', amount: 8000000, notes: '' },
    { id: '4', date: '2026-02-04', type: 'income', category: 'Gaji', amount: 20000000, notes: '' }
  ];

  const top = calculateTopCategories(transactions, '2026-02', 2);
  assert.equal(top.length, 2);
  assert.equal(top[0].category, 'Sewa');
  assert.equal(top[0].amount, 8000000);
  assert.equal(top[1].category, 'Makanan');
  assert.equal(top[1].amount, 2000000);
});
