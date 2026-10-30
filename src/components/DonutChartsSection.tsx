import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { DonutSlice } from '../types/finance';
import { formatRupiah } from '../utils/finance';

interface DonutChartsSectionProps {
  expensesSlices: DonutSlice[];
  savingsSlices: DonutSlice[];
  incomeSlices: DonutSlice[];
  totalExpenses: number;
  totalSavings: number;
  totalIncome: number;
}

interface SingleDonutProps {
  title: string;
  subtitle: string;
  slices: DonutSlice[];
  total: number;
  centerLabel: string;
  colorTheme: string;
}

const SingleDonut: React.FC<SingleDonutProps> = ({
  title,
  subtitle,
  slices,
  total,
  centerLabel,
  colorTheme
}) => {
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  // SVG Geometry
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative offsets for slices
  let accumulatedPercent = 0;
  const arcs = slices.map((slice, idx) => {
    const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += slice.percentage;

    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
      index: idx
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorTheme}`}
          >
            {centerLabel}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      {slices.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Belum ada data transaksi untuk kategori ini.
        </div>
      ) : (
        <>
          {/* Donut Visualization */}
          <div className="relative flex items-center justify-center my-2">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {arcs.map((arc) => (
                <circle
                  key={arc.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={arc.color}
                  strokeWidth={activeSlice === arc.index ? strokeWidth + 4 : strokeWidth}
                  fill="transparent"
                  strokeDasharray={arc.strokeDasharray}
                  strokeDashoffset={arc.strokeDashoffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setActiveSlice(arc.index)}
                  onMouseLeave={() => setActiveSlice(null)}
                  className="transition-all duration-300 cursor-pointer"
                />
              ))}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                {activeSlice !== null ? slices[activeSlice]?.label : 'Total'}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums leading-tight mt-0.5">
                {formatRupiah(activeSlice !== null ? slices[activeSlice]?.value : total)}
              </span>
              <span className="text-[11px] font-bold text-slate-500 font-mono mt-0.5">
                {activeSlice !== null ? `${slices[activeSlice]?.percentage}%` : '100%'}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="mt-4 space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
            {slices.map((slice, idx) => (
              <div
                key={slice.label}
                onMouseEnter={() => setActiveSlice(idx)}
                onMouseLeave={() => setActiveSlice(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg transition cursor-pointer ${
                  activeSlice === idx ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="truncate text-slate-700 font-medium">{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(slice.value)}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {slice.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const DonutChartsSection: React.FC<DonutChartsSectionProps> = ({
  expensesSlices,
  savingsSlices,
  incomeSlices,
  totalExpenses,
  totalSavings,
  totalIncome
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <PieChart className="w-4 h-4 text-slate-700" />
        <h3 className="text-sm font-bold text-slate-900">
          Komposisi Finansial (Donut Breakdown)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Total Expenses Donut */}
        <SingleDonut
          title="Komposisi Total Expenses"
          subtitle="Distribusi pengeluaran kebutuhan, keinginan & hutang"
          slices={expensesSlices}
          total={totalExpenses}
          centerLabel="Expenses"
          colorTheme="bg-orange-50 text-orange-700 border border-orange-200"
        />

        {/* 2. Total Savings Donut */}
        <SingleDonut
          title="Komposisi Total Savings"
          subtitle="Distribusi alokasi tabungan & investasi"
          slices={savingsSlices}
          total={totalSavings}
          centerLabel="Savings"
          colorTheme="bg-emerald-50 text-emerald-700 border border-emerald-200"
        />

        {/* 3. Total Income Donut */}
        <SingleDonut
          title="Komposisi Total Income"
          subtitle="Rincian sumber pendapatan bulanan"
          slices={incomeSlices}
          total={totalIncome}
          centerLabel="Income"
          colorTheme="bg-purple-50 text-purple-700 border border-purple-200"
        />
      </div>
    </div>
  );
};
