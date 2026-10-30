import React from 'react';
import { formatRupiahCompact } from '../utils/finance';

interface DonutRowSectionProps {
  totalExpense: number; // 950000
  totalSavings: number; // 100000
  totalIncome: number; // 1250000
}

export const DonutRowSection: React.FC<DonutRowSectionProps> = ({
  totalExpense = 950000,
  totalSavings = 100000,
  totalIncome = 1250000
}) => {
  const size = 120;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Donut 1: Total Expense Slices
  // Belanja bulanan (10.5%), Kost (31.5%), Fashion (57.9%)
  const expSlices = [
    { label: 'Belanja', color: '#f97316', pct: 10.5 },
    { label: 'Kost', color: '#10b981', pct: 31.5 },
    { label: 'Fashion', color: '#1e3a8a', pct: 58.0 }
  ];

  let acc1 = 0;
  const expArcs = expSlices.map((s) => {
    const dash = (s.pct / 100) * circumference;
    const offset = -((acc1 / 100) * circumference);
    acc1 += s.pct;
    return { ...s, dash, offset };
  });

  // Donut 3: Total Income Slices
  // Gaji bulanan (20%), Side hustle (80%)
  const incSlices = [
    { label: 'Gaji', color: '#f97316', pct: 20 },
    { label: 'Side hustle', color: '#c084fc', pct: 80 }
  ];

  let acc3 = 0;
  const incArcs = incSlices.map((s) => {
    const dash = (s.pct / 100) * circumference;
    const offset = -((acc3 / 100) * circumference);
    acc3 += s.pct;
    return { ...s, dash, offset };
  });

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-2.5 sm:p-4 md:p-5 shadow-2xs">
      {/* 3 Donut Charts placed in a single horizontal row on mobile (grid-cols-3) without slider */}
      <div className="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6 items-start">
        {/* 1. Total Expense Donut */}
        <div className="flex flex-col items-center justify-center min-w-0">
          <div className="relative w-18 h-18 sm:w-26 sm:h-26 md:w-34 md:h-34 flex items-center justify-center">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 w-full h-full"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {expArcs.map((arc) => (
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-0.5">
              <span className="text-[7px] sm:text-[9px] md:text-[10px] text-slate-500 font-medium leading-tight truncate">
                Expense
              </span>
              <span className="text-[9px] sm:text-xs md:text-xs font-black text-slate-900 font-mono leading-tight whitespace-nowrap">
                {formatRupiahCompact(totalExpense)}
              </span>
            </div>
          </div>

          {/* Compact Legend on Mobile */}
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 mt-1 sm:mt-2 text-[7px] sm:text-[9px] md:text-[10px] text-slate-600 font-medium">
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f97316] shrink-0"></span>
              <span className="truncate max-w-[42px] sm:max-w-none">Belanja</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#10b981] shrink-0"></span>
              <span>Kost</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#1e3a8a] shrink-0"></span>
              <span>Fashion</span>
            </div>
          </div>
        </div>

        {/* 2. Total Savings Donut */}
        <div className="flex flex-col items-center justify-center min-w-0">
          <div className="relative w-18 h-18 sm:w-26 sm:h-26 md:w-34 md:h-34 flex items-center justify-center">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 w-full h-full"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#f97316"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={0}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-0.5">
              <span className="text-[7px] sm:text-[9px] md:text-[10px] text-slate-500 font-medium leading-tight truncate">
                Savings
              </span>
              <span className="text-[9px] sm:text-xs md:text-xs font-black text-slate-900 font-mono leading-tight whitespace-nowrap">
                {formatRupiahCompact(totalSavings)}
              </span>
            </div>
          </div>

          {/* Compact Legend on Mobile */}
          <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-[7px] sm:text-[9px] md:text-[10px] text-slate-600 font-medium">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f97316] shrink-0"></span>
            <span>Dana darurat</span>
          </div>
        </div>

        {/* 3. Total Income Donut */}
        <div className="flex flex-col items-center justify-center min-w-0">
          <div className="relative w-18 h-18 sm:w-26 sm:h-26 md:w-34 md:h-34 flex items-center justify-center">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 w-full h-full"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {incArcs.map((arc) => (
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-0.5">
              <span className="text-[7px] sm:text-[9px] md:text-[10px] text-slate-500 font-medium leading-tight truncate">
                Income
              </span>
              <span className="text-[9px] sm:text-xs md:text-xs font-black text-slate-900 font-mono leading-tight whitespace-nowrap">
                {formatRupiahCompact(totalIncome)}
              </span>
            </div>
          </div>

          {/* Compact Legend on Mobile */}
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 mt-1 sm:mt-2 text-[7px] sm:text-[9px] md:text-[10px] text-slate-600 font-medium">
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f97316] shrink-0"></span>
              <span>Gaji</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#c084fc] shrink-0"></span>
              <span>Side hustle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
