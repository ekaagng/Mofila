export type TransactionType = 'income' | 'needs' | 'wants' | 'savings' | 'debt';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string;
  amount: number;
  notes: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  type: TransactionType;
  expected: number;
  month: string; // YYYY-MM
}

export interface MonthBudgetPlan {
  month: string; // YYYY-MM
  totalBudget: number; // e.g. Rp 3.000.000
  startBalance: number; // e.g. Rp 3.000.000
  budgetPeriod: string; // e.g. "21-Feb - 21-Mar"
  categoryPlans: BudgetItem[];
}

export interface CategorySummary {
  category: string;
  type: TransactionType;
  expected: number;
  actual: number;
  diff: number; // expected - actual (for expenses: positive = under budget)
  status: 'under' | 'over' | 'exact';
  percentage: number; // actual / expected * 100
  isPaid?: boolean;
}

export interface CashFlowSummary {
  startBalance: number;
  totalIncomeActual: number;
  totalNeedsActual: number;
  totalWantsActual: number;
  totalSavingsActual: number;
  totalDebtActual: number;
  totalExpenseActual: number; // needs + wants + debt
  netCashFlow: number; // income - expense - savings
  actualAmountLeftToSpend: number; // startBalance + income - expenses
  totalLeftover: number;
  isUnderBudget: boolean;
  spendPercentage: number;
}

export interface ComparisonGroup {
  name: string;
  type: TransactionType;
  expected: number;
  actual: number;
  color: string;
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
  percentage: number;
}
