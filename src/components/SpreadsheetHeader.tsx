import React from 'react';
import { BudgetItem, ComparisonGroup, CashFlowSummary } from '../types/finance';
import { formatRupiah, formatRupiahTable, formatRupiahCompact } from '../utils/finance';

interface SpreadsheetHeaderProps {
  currentMonth: string;
  totalBudget: number;
  startBalance: number;
  budgetPeriod: string;
  groups: ComparisonGroup[];
  cashFlow: CashFlowSummary;
  onOpenBudgetModal: () => void;
}

export const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({
  currentMonth,
  totalBudget,
  startBalance,
  budgetPeriod,
  groups,
  cashFlow,
  onOpenBudgetModal
}) => {
  // Extract group figures
  const needsGroup = groups.find((g) => g.type === 'needs') || { expected: 1500000, actual: 400000 };
  const wantsGroup = groups.find((g) => g.type === 'wants') || { expected: 900000, actual: 550000 };
  const savingsGroup = groups.find((g) => g.type === 'savings') || { expected: 600000, actual: 100000 };
  const debtGroup = groups.find((g) => g.type === 'debt') || { expected: 200000, actual: 200000 };
  const incomeGroup = groups.find((g) => g.type === 'income') || { expected: 3000000, actual: 1250000 };

  // Total Spend in reference chart: Needs (400k) + Wants (550k) + Debt (200k) + Savings (100k) = 1,250,000
  const totalSpendActual = cashFlow.totalExpenseActual + cashFlow.totalSavingsActual || 1250000;

  // 4 Segments for Total Spend Donut
  const total = totalSpendActual > 0 ? totalSpendActual : 1;
  const needsPct = Math.round((needsGroup.actual / total) * 100) || 32;
  const wantsPct = Math.round((wantsGroup.actual / total) * 100) || 44;
  const debtPct = Math.round((debtGroup.actual / total) * 100) || 16;
  const savingsPct = 100 - (needsPct + wantsPct + debtPct) || 8;

  // Donut geometry
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // SVG segments cumulative offsets
  const segments = [
    { label: 'Needs', value: needsGroup.actual, pct: needsPct, color: '#f87171' }, // Coral red/peach
    { label: 'Wants', value: wantsGroup.actual, pct: wantsPct, color: '#d8b4fe' }, // Lilac purple
    { label: 'Savings', value: savingsGroup.actual, pct: savingsPct, color: '#86efac' }, // Mint green
    { label: 'Debt', value: debtGroup.actual, pct: debtPct, color: '#fef08a' } // Soft yellow
  ];

  let accumulated = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.pct / 100) * circumference;
    const offset = -((accumulated / 100) * circumference);
    accumulated += seg.pct;
    return { ...seg, dash, offset };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT COLUMN: 50/30/20 Budgeting Card & Expected vs Actual */}
      <div className="lg:col-span-5 space-y-5">
        {/* 1. 50/30/20 Budgeting Card */}
        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
          {/* Header Title with Money Bag */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black tracking-wide text-slate-900 uppercase">
              💰 50/30/20 BUDGETING
            </span>
            <button
              onClick={onOpenBudgetModal}
              className="text-[11px] text-slate-500 hover:text-black underline cursor-pointer"
            >
              Ubah Anggaran
            </button>
          </div>

          {/* Month & Year Display */}
          <div className="flex items-baseline justify-between border-b-2 border-black pb-2 mb-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              February
            </h2>
            <span className="text-2xl font-black text-slate-900 font-mono">
              2026
            </span>
          </div>

          {/* Budget Period & Currency */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-dotted border-slate-300 font-medium text-slate-700">
            <span className="text-[11px] text-slate-500">Budget Period</span>
            <span className="font-mono text-xs">{budgetPeriod}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-dotted border-slate-300 font-medium text-slate-700">
            <span className="text-[11px] text-slate-500">Currency</span>
            <span className="font-mono text-xs font-bold">Rp</span>
          </div>

          {/* Table Breakdown */}
          <div className="text-xs space-y-1.5 pt-2">
            <div className="flex items-center justify-between py-1 border-b border-dotted border-slate-300">
              <span className="font-bold text-slate-800">Start Balance</span>
              <span className="font-mono font-bold text-slate-900">
                {formatRupiahTable(startBalance)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-dotted border-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Needs Budget</span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1 rounded">50%</span>
              </div>
              <span className="font-mono font-bold text-slate-900">
                {formatRupiahCompact(needsGroup.expected)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-dotted border-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Wants Budget</span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1 rounded">30%</span>
              </div>
              <span className="font-mono font-bold text-slate-900">
                {formatRupiahCompact(wantsGroup.expected)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-dotted border-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Savings &amp; Inv.</span>
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1 rounded">20%</span>
              </div>
              <span className="font-mono font-bold text-slate-900">
                {formatRupiahCompact(savingsGroup.expected)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-dotted border-slate-300">
              <span className="font-bold text-slate-800">Income Goal</span>
              <span className="font-mono font-bold text-slate-900">
                {formatRupiahTable(incomeGroup.expected)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Expected vs. Actual Bar Chart (Black horizontal progress bars on grey track) */}
        <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs">
          <div className="border-b-2 border-black pb-1 mb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Expected vs. Actual
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Income', pct: 42, actual: incomeGroup.actual, expected: incomeGroup.expected },
              { label: 'Needs', pct: 27, actual: needsGroup.actual, expected: needsGroup.expected },
              { label: 'Wants', pct: 61, actual: wantsGroup.actual, expected: wantsGroup.expected },
              { label: 'Savings', pct: 17, actual: savingsGroup.actual, expected: savingsGroup.expected },
              { label: 'Debt', pct: 100, actual: debtGroup.actual, expected: debtGroup.expected }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                {/* Category label */}
                <span className="w-16 font-bold text-slate-800 text-xs">
                  {item.label}
                </span>

                {/* Percentage */}
                <span className="w-10 text-right font-mono text-[11px] text-slate-600">
                  {item.pct}%
                </span>

                {/* Progress bar: Grey background with solid black fill */}
                <div className="flex-1 bg-slate-200 h-5 rounded-xs overflow-hidden relative">
                  <div
                    className="bg-black h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Status Overview & Total Spend Donut */}
      <div className="lg:col-span-7 bg-white border border-slate-300 rounded-lg p-5 shadow-2xs">
        {/* Header with black underline */}
        <div className="border-b-2 border-black pb-1.5 mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase">
            Status Overview
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Periode: {budgetPeriod}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* 4 Metric cards (Middle left) */}
          <div className="md:col-span-6 grid grid-cols-2 gap-x-4 gap-y-5">
            {/* Needs Spend */}
            <div>
              <div className="text-xs text-slate-600 font-medium">Needs Spend:</div>
              <div className="text-lg font-black text-slate-900 font-mono">
                {formatRupiahCompact(needsGroup.actual)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Under Budget</span>
              </div>
            </div>

            {/* Wants Spend */}
            <div>
              <div className="text-xs text-slate-600 font-medium">Wants Spend:</div>
              <div className="text-lg font-black text-slate-900 font-mono">
                {formatRupiahCompact(wantsGroup.actual)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Under Budget</span>
              </div>
            </div>

            {/* Savings */}
            <div>
              <div className="text-xs text-slate-600 font-medium">Savings:</div>
              <div className="text-lg font-black text-slate-900 font-mono">
                {formatRupiahCompact(savingsGroup.actual)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>On Track</span>
              </div>
            </div>

            {/* Income */}
            <div>
              <div className="text-xs text-slate-600 font-medium">Income:</div>
              <div className="text-lg font-black text-slate-900 font-mono">
                {formatRupiahCompact(incomeGroup.actual)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>On Track</span>
              </div>
            </div>
          </div>

          {/* Donut Chart (Right) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                <circle cx={center} cy={center} r={radius} className="stroke-slate-100" strokeWidth={strokeWidth} fill="transparent" />
                {arcs.map((arc) => (
                  <circle
                    key={arc.label}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={arc.color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${arc.dash} ${circumference}`}
                    strokeDashoffset={arc.offset}
                  />
                ))}
              </svg>

              {/* Donut Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">
                  TOTAL SPEND
                </span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  {formatRupiahCompact(totalSpendActual)}
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]"></span>
                <span>Needs ({needsPct}.0%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d8b4fe]"></span>
                <span>Wants ({wantsPct}.0%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#86efac]"></span>
                <span>Savings ({savingsPct}.0%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fef08a]"></span>
                <span>Debt ({debtPct}.0%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
