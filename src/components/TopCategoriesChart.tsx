import React, { useState } from 'react';
import { Flame, TrendingUp, Filter } from 'lucide-react';
import { TransactionType } from '../types/finance';
import { formatRupiah } from '../utils/finance';

interface TopCategoriesChartProps {
  categories: Array<{
    category: string;
    type: TransactionType;
    amount: number;
    percentage: number;
  }>;
}

export const TopCategoriesChart: React.FC<TopCategoriesChartProps> = ({ categories }) => {
  const [viewCount, setViewCount] = useState<number>(20);

  const displayedCategories = categories.slice(0, viewCount);
  const maxAmount = displayedCategories.length > 0 ? displayedCategories[0].amount : 1;

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'needs':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">Needs</span>;
      case 'wants':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-100 text-pink-800">Wants</span>;
      case 'debt':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Debt</span>;
      case 'savings':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Savings</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Top 20 Transaction Categories (Analisis Spending Habit)
            </h3>
            <p className="text-xs text-slate-500">
              Peringkat pengeluaran terbesar untuk mendeteksi kebiasaan belanja yang mendominasi arus kas
            </p>
          </div>
        </div>

        {/* View Count Switcher */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewCount(10)}
            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
              viewCount === 10
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Top 10
          </button>
          <button
            onClick={() => setViewCount(20)}
            className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
              viewCount === 20
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Top 20
          </button>
        </div>
      </div>

      {displayedCategories.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Belum ada transaksi pengeluaran tercatat pada periode ini.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
          {displayedCategories.map((item, idx) => {
            const barWidth = Math.max(2, Math.round((item.amount / maxAmount) * 100));

            return (
              <div
                key={item.category}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
              >
                {/* Rank Badge */}
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                    idx < 3
                      ? 'bg-rose-600 text-white shadow-xs'
                      : idx < 5
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </span>

                {/* Category & Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <span className="font-semibold text-slate-800 truncate">
                        {item.category}
                      </span>
                      {getTypeBadge(item.type)}
                    </div>
                    <div className="flex items-center gap-2 font-mono shrink-0">
                      <span className="font-bold text-slate-900">
                        {formatRupiah(item.amount)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar (Red / Orange Coral Accent) */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx < 3
                          ? 'bg-rose-500'
                          : idx < 7
                          ? 'bg-orange-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
