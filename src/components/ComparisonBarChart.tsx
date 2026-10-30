import React, { useState } from 'react';
import { BarChart3, Info } from 'lucide-react';
import { ComparisonGroup } from '../types/finance';
import { formatRupiah } from '../utils/finance';

interface ComparisonBarChartProps {
  groups: ComparisonGroup[];
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ groups }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Find max value to calibrate 100% width scale
  const maxVal = Math.max(
    ...groups.map((g) => Math.max(g.expected, g.actual)),
    1000000
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Perbandingan Alokasi: Expected vs Actual
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi kepatuhan anggaran (Target yang direncanakan vs Realisasi riil)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-300 border border-slate-400/30"></span>
            <span className="text-slate-600 font-medium">Expected (Anggaran)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600"></span>
            <span className="text-slate-600 font-medium">Actual (Realisasi)</span>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart Rows */}
      <div className="mt-5 space-y-5">
        {groups.map((group, index) => {
          const expectedWidth = (group.expected / maxVal) * 100;
          const actualWidth = (group.actual / maxVal) * 100;
          const diff = group.actual - group.expected;
          const isOver = group.type === 'income' ? diff < 0 : diff > 0;
          const percentOfTarget =
            group.expected > 0 ? Math.round((group.actual / group.expected) * 100) : 0;

          return (
            <div
              key={group.type}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-3 rounded-xl transition border ${
                hoveredIndex === index
                  ? 'bg-slate-50/80 border-slate-300 shadow-xs'
                  : 'bg-white border-transparent'
              }`}
            >
              {/* Row title & values */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2 gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="font-bold text-slate-800 text-sm">
                    {group.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      group.type === 'income'
                        ? group.actual >= group.expected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                        : isOver
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {group.type === 'income'
                      ? group.actual >= group.expected
                        ? 'Target Tercapai'
                        : 'Belum Tercapai'
                      : isOver
                      ? 'Over Budget'
                      : 'Under Budget'}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-500">
                    Exp:{' '}
                    <span className="text-slate-700 font-semibold">
                      {formatRupiah(group.expected)}
                    </span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">
                    Act:{' '}
                    <span
                      className="font-bold"
                      style={{ color: group.color }}
                    >
                      {formatRupiah(group.actual)}
                    </span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span
                    className={`font-semibold ${
                      isOver ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {percentOfTarget}%
                  </span>
                </div>
              </div>

              {/* Dual Horizontal Bars */}
              <div className="space-y-1.5 pt-1">
                {/* Expected Bar */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="w-16 font-medium text-slate-400 shrink-0">Expected</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                    <div
                      className="bg-slate-300 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(1, expectedWidth))}%` }}
                    />
                  </div>
                  <span className="w-24 text-right font-mono text-slate-600 tabular-nums">
                    {formatRupiah(group.expected)}
                  </span>
                </div>

                {/* Actual Bar */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="w-16 font-medium text-slate-500 shrink-0">Actual</span>
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: group.color,
                        width: `${Math.min(100, Math.max(1, actualWidth))}%`
                      }}
                    />
                  </div>
                  <span
                    className="w-24 text-right font-mono font-bold tabular-nums"
                    style={{ color: group.color }}
                  >
                    {formatRupiah(group.actual)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
