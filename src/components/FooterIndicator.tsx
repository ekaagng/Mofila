import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { formatRupiah } from '../utils/finance';
import { CashFlowSummary } from '../types/finance';

interface FooterIndicatorProps {
  cashFlow: CashFlowSummary;
  totalBudget: number;
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
}

export const FooterIndicator: React.FC<FooterIndicatorProps> = ({
  cashFlow,
  totalBudget,
  onOpenAddModal,
  onOpenBudgetModal
}) => {
  const isPositive = cashFlow.actualAmountLeftToSpend >= 0;

  return (
    <footer className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Status & Remaining amount */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isPositive
                ? 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50'
                : 'bg-rose-100 text-rose-700 ring-4 ring-rose-50'
            }`}
          >
            {isPositive ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actual Amount Left to Spend
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isPositive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-rose-600 text-white shadow-xs'
                }`}
              >
                {isPositive ? 'UNDER BUDGET' : 'OVER BUDGET'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums ${
                  isPositive ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {formatRupiah(cashFlow.actualAmountLeftToSpend)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                dari Total Budget{' '}
                <strong className="text-slate-800 font-mono">
                  {formatRupiah(totalBudget)}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Contextual summary note */}
        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-md">
          {isPositive ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Selamat! Anda masih memiliki sisa dana belanja sebesar{' '}
                <strong className="text-slate-900 font-mono">
                  {formatRupiah(cashFlow.actualAmountLeftToSpend)}
                </strong>{' '}
                sebelum batas anggaran bulanan tercapai.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Peringatan: Pengeluaran aktual telah melampaui anggaran sebesar{' '}
                <strong className="text-rose-700 font-mono">
                  {formatRupiah(Math.abs(cashFlow.actualAmountLeftToSpend))}
                </strong>
                . Tinjau kembali pos pengeluaran Wants untuk menyeimbangkan arus kas.
              </span>
            </div>
          )}
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBudgetModal}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition cursor-pointer"
          >
            Review Budget
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Transaksi</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
