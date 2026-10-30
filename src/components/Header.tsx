import React, { useState } from 'react';
import {
  Wallet,
  Calendar,
  PlusCircle,
  SlidersHorizontal,
  Download,
  Upload,
  RotateCcw,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { formatRupiah, formatMonthYear } from '../utils/finance';

interface HeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  totalBudget: number;
  activeTab: 'dashboard' | 'transactions';
  onTabChange: (tab: 'dashboard' | 'transactions') => void;
  transactionCount: number;
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenHelpModal: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  onMonthChange,
  availableMonths,
  totalBudget,
  activeTab,
  onTabChange,
  transactionCount,
  onOpenAddModal,
  onOpenBudgetModal,
  onOpenHelpModal,
  onExportData,
  onImportData,
  onResetData
}) => {
  const [showDataMenu, setShowDataMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand & controls bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mofila</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Money &amp; Financial Planner</p>
            </div>
          </div>

          {/* Quick Stats: Month picker & Total Budget */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Periode:</span>
              <select
                aria-label="Pilih Periode Bulan"
                value={currentMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 cursor-pointer focus:outline-hidden"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthYear(m)}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Budget pill */}
            <button
              onClick={onOpenBudgetModal}
              title="Klik untuk mengubah total budget & alokasi"
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer"
            >
              <span className="text-emerald-700 font-normal">Total Budget:</span>
              <span className="font-bold text-emerald-950 font-mono tabular-nums">
                {formatRupiah(totalBudget)}
              </span>
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 ml-1" />
            </button>

            {/* Actions & Help */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenHelpModal}
                title="Panduan Istilah Finansial & 50/30/20"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
                aria-label="Bantuan & Panduan Finansial"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Data menu dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDataMenu(!showDataMenu)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition cursor-pointer"
                  aria-label="Menu Opsi Data"
                >
                  <span>Data</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showDataMenu && (
                  <div
                    className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 text-xs"
                    onMouseLeave={() => setShowDataMenu(false)}
                  >
                    <button
                      onClick={() => {
                        setShowDataMenu(false);
                        onExportData();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ekspor Data (JSON)</span>
                    </button>
                    <label className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Impor Data (JSON)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          setShowDataMenu(false);
                          onImportData(e);
                        }}
                        className="hidden"
                      />
                    </label>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowDataMenu(false);
                        onResetData();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reset Data Awal</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Add Transaction Button */}
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Transaksi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Dashboard & Planner vs Transaction List) */}
        <div className="flex border-t border-slate-100 gap-1 pt-1 -mb-px">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>Dasbor &amp; Planner</span>
          </button>
          <button
            onClick={() => onTabChange('transactions')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'transactions'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>Daftar Transaksi</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'transactions'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {transactionCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
