import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  PiggyBank,
  Receipt,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatRupiah } from '../utils/finance';
import { ComparisonGroup, CashFlowSummary } from '../types/finance';

interface SummaryCardsProps {
  groups: ComparisonGroup[];
  cashFlow: CashFlowSummary;
  totalBudget: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  groups,
  cashFlow,
  totalBudget
}) => {
  const needsGroup = groups.find((g) => g.type === 'needs') || {
    expected: 0,
    actual: 0
  };
  const wantsGroup = groups.find((g) => g.type === 'wants') || {
    expected: 0,
    actual: 0
  };
  const savingsGroup = groups.find((g) => g.type === 'savings') || {
    expected: 0,
    actual: 0
  };
  const debtGroup = groups.find((g) => g.type === 'debt') || {
    expected: 0,
    actual: 0
  };

  // SVG Radial Donut Chart for Total Spend
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const spendPctClamped = Math.min(100, Math.max(0, cashFlow.spendPercentage));
  const strokeDashoffset = circumference - (spendPctClamped / 100) * circumference;

  const spendColor =
    spendPctClamped > 100
      ? '#ef4444' // Red
      : spendPctClamped > 80
      ? '#f59e0b' // Amber
      : '#10b981'; // Green

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Main Donut Card: Total Spend */}
      <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Spend (Pengeluaran)
          </span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              cashFlow.isUnderBudget
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {cashFlow.isUnderBudget ? 'Under Budget' : 'Over Budget'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 my-2">
          {/* Radial SVG Donut */}
          <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
            <svg className="w-22 h-22 transform -rotate-90">
              <circle
                cx="44"
                cy="44"
                r={36}
                className="stroke-slate-100"
                strokeWidth="9"
                fill="transparent"
              />
              <circle
                cx="44"
                cy="44"
                r={36}
                stroke={spendColor}
                strokeWidth="9"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={2 * Math.PI * 36 - (spendPctClamped / 100) * (2 * Math.PI * 36)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                {cashFlow.spendPercentage}%
              </span>
              <span className="text-[9px] text-slate-500 font-medium">Budget</span>
            </div>
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="text-sm sm:text-[15px] font-bold text-slate-900 font-mono tabular-nums leading-tight whitespace-nowrap">
              {formatRupiah(cashFlow.totalExpenseActual)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
              Alokasi:{' '}
              <span className="text-slate-700 font-semibold font-mono">
                {formatRupiah(totalBudget)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 whitespace-nowrap">
              Sisa:{' '}
              <span
                className={`font-semibold font-mono ${
                  cashFlow.actualAmountLeftToSpend >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {formatRupiah(cashFlow.actualAmountLeftToSpend)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center gap-1.5">
          {cashFlow.isUnderBudget ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          )}
          <span className="truncate">
            {cashFlow.isUnderBudget
              ? 'Arus kas terjaga dalam batas aman'
              : 'Perhatian: pengeluaran melebihi total budget'}
          </span>
        </div>
      </div>

      {/* 2. Needs (Kebutuhan) Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Needs (Kebutuhan)</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
              50% Target
            </span>
          </div>

          <div className="mt-2">
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {formatRupiah(needsGroup.actual)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Anggaran: <span className="font-mono text-slate-700">{formatRupiah(needsGroup.expected)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-500">
              Sisa:{' '}
              <span className="font-semibold text-slate-700 font-mono">
                {formatRupiah(needsGroup.expected - needsGroup.actual)}
              </span>
            </span>
            <span className="font-mono text-slate-600">
              {needsGroup.expected > 0
                ? Math.round((needsGroup.actual / needsGroup.expected) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                needsGroup.actual > needsGroup.expected
                  ? 'bg-rose-500'
                  : 'bg-orange-500'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  needsGroup.expected > 0
                    ? (needsGroup.actual / needsGroup.expected) * 100
                    : 0
                )}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Wants (Keinginan) Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Wants (Keinginan)</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-100 text-pink-800">
              30% Target
            </span>
          </div>

          <div className="mt-2">
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {formatRupiah(wantsGroup.actual)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Anggaran: <span className="font-mono text-slate-700">{formatRupiah(wantsGroup.expected)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-500">
              Sisa:{' '}
              <span className="font-semibold text-slate-700 font-mono">
                {formatRupiah(wantsGroup.expected - wantsGroup.actual)}
              </span>
            </span>
            <span className="font-mono text-slate-600">
              {wantsGroup.expected > 0
                ? Math.round((wantsGroup.actual / wantsGroup.expected) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                wantsGroup.actual > wantsGroup.expected
                  ? 'bg-rose-500'
                  : 'bg-pink-500'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  wantsGroup.expected > 0
                    ? (wantsGroup.actual / wantsGroup.expected) * 100
                    : 0
                )}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* 4. Savings (Tabungan) Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <PiggyBank className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Savings (Tabungan)</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              20% Target
            </span>
          </div>

          <div className="mt-2">
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {formatRupiah(savingsGroup.actual)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Target: <span className="font-mono text-slate-700">{formatRupiah(savingsGroup.expected)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-500">
              Tercapai:{' '}
              <span className="font-semibold text-emerald-600 font-mono">
                {savingsGroup.expected > 0
                  ? Math.round((savingsGroup.actual / savingsGroup.expected) * 100)
                  : 0}
                %
              </span>
            </span>
            <span className="font-mono text-slate-500 text-[10px]">
              {savingsGroup.actual >= savingsGroup.expected ? 'Tercapai 🎉' : 'On Track'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  savingsGroup.expected > 0
                    ? (savingsGroup.actual / savingsGroup.expected) * 100
                    : 0
                )}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* 5. Debt (Hutang/Cicilan) Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Debt (Cicilan/Hutang)</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
              Cicilan
            </span>
          </div>

          <div className="mt-2">
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {formatRupiah(debtGroup.actual)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Target Terbayar: <span className="font-mono text-slate-700">{formatRupiah(debtGroup.expected)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-500">
              Realisasi:{' '}
              <span className="font-semibold text-slate-700 font-mono">
                {debtGroup.expected > 0
                  ? Math.round((debtGroup.actual / debtGroup.expected) * 100)
                  : 0}
                %
              </span>
            </span>
            <span
              className={`text-[10px] font-semibold ${
                debtGroup.actual >= debtGroup.expected
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}
            >
              {debtGroup.actual >= debtGroup.expected ? 'Lunas Bulan Ini' : 'Sebagian'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  debtGroup.expected > 0
                    ? (debtGroup.actual / debtGroup.expected) * 100
                    : 0
                )}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
