import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import {
  CategorySummary,
  CashFlowSummary,
  TransactionType
} from '../types/finance';
import { formatRupiahTable, formatRupiahCompact } from '../utils/finance';

interface SpreadsheetTablesProps {
  cashFlow: CashFlowSummary;
  startBalance: number;
  needsSummaries: CategorySummary[];
  wantsSummaries: CategorySummary[];
  savingsSummaries: CategorySummary[];
  debtSummaries: CategorySummary[];
  incomeSummaries: CategorySummary[];
  topCategories: Array<{
    category: string;
    type: TransactionType;
    amount: number;
    percentage: number;
  }>;
  mobileSection?: string;
  onMobileSectionChange?: (section: string) => void;
  onOpenTransactions?: () => void;
  onOpenAddTransaction?: (type: TransactionType) => void;
}

export const SpreadsheetTables: React.FC<SpreadsheetTablesProps> = ({
  cashFlow,
  startBalance = 3000000,
  needsSummaries,
  wantsSummaries,
  savingsSummaries,
  debtSummaries,
  incomeSummaries,
  topCategories,
  mobileSection: propMobileSection,
  onMobileSectionChange,
  onOpenTransactions,
  onOpenAddTransaction
}) => {
  // Mobile section filter state (supports internal and controlled prop)
  const [internalSection, setInternalSection] = useState<'all' | 'cashflow' | 'needs' | 'wants' | 'debt' | 'savings' | 'income' | 'top20'>('all');
  const mobileSection = propMobileSection || internalSection;

  const [debtChecked, setDebtChecked] = useState<{ [key: string]: boolean }>({
    'Cicilan Gadget / Paylater': true
  });

  const toggleDebt = (cat: string) => {
    setDebtChecked((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter active categories that have recorded transactions (no visibility if data is empty)
  const activeNeeds = needsSummaries.filter((i) => i.actual > 0);
  const activeWants = wantsSummaries.filter((i) => i.actual > 0);
  const activeSavings = savingsSummaries.filter((i) => i.actual > 0);
  const activeDebt = debtSummaries.filter((i) => i.actual > 0);
  const activeIncome = incomeSummaries.filter((i) => i.actual > 0);
  const activeTop = topCategories.filter((i) => i.amount > 0);

  // Totals for footers
  const needsExpected = needsSummaries.reduce((sum, i) => sum + i.expected, 0);
  const needsActual = needsSummaries.reduce((sum, i) => sum + i.actual, 0);

  const wantsExpected = wantsSummaries.reduce((sum, i) => sum + i.expected, 0);
  const wantsActual = wantsSummaries.reduce((sum, i) => sum + i.actual, 0);

  const debtExpected = debtSummaries.reduce((sum, i) => sum + i.expected, 0);
  const debtActual = debtSummaries.reduce((sum, i) => sum + i.actual, 0);

  const savingsExpected = savingsSummaries.reduce((sum, i) => sum + i.expected, 0);
  const savingsActual = savingsSummaries.reduce((sum, i) => sum + i.actual, 0);

  const incomeExpected = incomeSummaries.reduce((sum, i) => sum + i.expected, 0);
  const incomeActual = incomeSummaries.reduce((sum, i) => sum + i.actual, 0);

  const maxTopAmount = activeTop.length > 0 ? activeTop[0].amount : 1;

  return (
    <div className="space-y-4">
      {/* 3-Column Spreadsheet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* ================= COLUMN 1 ================= */}
        <div
          className={`space-y-5 ${
            mobileSection !== 'all' &&
            mobileSection !== 'cashflow' &&
            mobileSection !== 'debt' &&
            mobileSection !== 'top20'
              ? 'hidden lg:block'
              : ''
          }`}
        >
          {/* 1. Cash Flow Summary Table */}
          {(mobileSection === 'all' || mobileSection === 'cashflow') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-black text-white px-3 py-2 text-center text-xs font-bold uppercase tracking-wider">
                Cash Flow Summary
              </div>
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-[9.5px] sm:text-[11px] font-sans">
                  <thead className="bg-white border-b border-black font-bold text-slate-800">
                    <tr>
                      <th className="py-1 px-1.5 sm:px-3 whitespace-nowrap">Category</th>
                      <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Expected</th>
                      <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Actual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dotted divide-slate-300">
                    <tr>
                      <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 whitespace-nowrap">+ Start Balance</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">{formatRupiahTable(startBalance)}</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">{formatRupiahTable(startBalance)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 whitespace-nowrap">+ Income This Month</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">{formatRupiahTable(incomeExpected)}</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">{formatRupiahTable(incomeActual)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 whitespace-nowrap">- Needs</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">{formatRupiahTable(needsExpected)}</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">{formatRupiahTable(needsActual)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 whitespace-nowrap">- Wants</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">{formatRupiahTable(wantsExpected)}</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">{formatRupiahTable(wantsActual)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 whitespace-nowrap">- Savings</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">{formatRupiahTable(savingsExpected)}</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">{formatRupiahTable(savingsActual)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 whitespace-nowrap">- Debt</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">{formatRupiahTable(debtExpected)}</td>
                      <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">{formatRupiahTable(debtActual)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-black text-white font-black text-[9.5px] sm:text-[11px]">
                      <td className="py-1.5 px-1.5 sm:px-3 uppercase tracking-wider whitespace-nowrap">TOTAL LEFTOVER</td>
                      <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                        {formatRupiahTable(startBalance + incomeExpected - needsExpected - wantsExpected - savingsExpected - debtExpected)}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                        {formatRupiahTable(startBalance + incomeActual - needsActual - wantsActual - savingsActual - debtActual)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 2. Debt Payment Tracker with Checkboxes */}
          {(mobileSection === 'all' || mobileSection === 'debt') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-black text-white px-3 py-2 text-center text-xs font-bold uppercase tracking-wider">
                Debt Payment Tracker
              </div>

              {activeDebt.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum ada pembayaran hutang atau cicilan yang tercatat bulan ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-[9.5px] sm:text-[11px] font-sans">
                    <thead className="bg-white border-b border-black font-bold text-slate-800">
                      <tr>
                        <th className="py-1 px-1 sm:px-2 w-5 sm:w-6 text-center"></th>
                        <th className="py-1 px-1 sm:px-2 whitespace-nowrap">Category</th>
                        <th className="py-1 px-1 sm:px-2 text-right whitespace-nowrap">Expected</th>
                        <th className="py-1 px-1 sm:px-2 text-right whitespace-nowrap">Actual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dotted divide-slate-300">
                      {activeDebt.map((item) => (
                        <tr key={item.category} className="hover:bg-slate-50">
                          <td className="py-1 px-1 sm:px-2 text-center">
                            <button
                              type="button"
                              onClick={() => toggleDebt(item.category)}
                              className="text-slate-700 hover:text-black cursor-pointer"
                              aria-label={`Toggle status ${item.category}`}
                            >
                              {debtChecked[item.category] ? (
                                <CheckSquare className="w-3.5 h-3.5 text-black" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className="py-1 px-1 sm:px-2 font-medium text-slate-800 truncate max-w-[85px] sm:max-w-[120px] whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">
                            {formatRupiahTable(item.expected)}
                          </td>
                          <td className="py-1 px-1 sm:px-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                            {formatRupiahTable(item.actual)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-black text-white font-black text-[9.5px] sm:text-[11px]">
                        <td colSpan={2} className="py-1.5 px-1 sm:px-2 uppercase tracking-wider whitespace-nowrap">
                          TOTAL DEBT
                        </td>
                        <td className="py-1.5 px-1 sm:px-2 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(debtExpected)}
                        </td>
                        <td className="py-1.5 px-1 sm:px-2 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(debtActual)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. Top 20 Transaction Categories with Horizontal Red Bars */}
          {(mobileSection === 'all' || mobileSection === 'top20') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-black text-white px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span>Top Transaction Categories</span>
                {activeTop.length > 0 && (
                  <span className="text-[10px] text-slate-300 font-normal">
                    {activeTop.length} Kategori
                  </span>
                )}
              </div>

              {activeTop.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum ada pengeluaran yang tercatat untuk peringkat kategori.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-[9.5px] sm:text-[11px] font-sans">
                    <thead className="bg-white border-b border-black font-bold text-slate-800">
                      <tr>
                        <th className="py-1 px-1 sm:px-2 w-5 sm:w-6 text-center"></th>
                        <th className="py-1 px-1 sm:px-2 whitespace-nowrap">Category</th>
                        <th className="py-1 px-1 sm:px-2 text-right whitespace-nowrap">Actual</th>
                        <th className="py-1 px-1 sm:px-2 w-20 sm:w-28"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dotted divide-slate-300">
                      {activeTop.slice(0, 20).map((item, idx) => {
                        const barWidth =
                          item.amount > 0 ? Math.round((item.amount / maxTopAmount) * 100) : 0;

                        return (
                          <tr key={item.category} className="h-6 hover:bg-slate-50">
                            <td className="py-1 px-1 sm:px-2 text-center font-mono text-[9px] sm:text-[10px] text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-1 px-1 sm:px-2 font-medium text-slate-800 truncate max-w-[85px] sm:max-w-[110px] whitespace-nowrap">
                              {item.category}
                            </td>
                            <td className="py-1 px-1 sm:px-2 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                              {formatRupiahTable(item.amount)}
                            </td>
                            <td className="py-1 px-1 sm:px-2">
                              <div className="w-full bg-transparent h-3.5 flex items-center">
                                <div
                                  className="bg-[#dc2626] h-2.5 rounded-xs transition-all duration-500"
                                  style={{ width: `${Math.max(6, barWidth)}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. Actual Amount Left to Spend Banner */}
          {(mobileSection === 'all' || mobileSection === 'cashflow' || mobileSection === 'top20') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="border-b-2 border-black p-3 text-center">
                <div className="text-xs font-black text-slate-900 tracking-wider">
                  Actual Amount Left to Spend
                </div>
              </div>

              <div className="py-5 text-center">
                <span className="text-3xl font-black font-mono text-[#15803d] tracking-tight">
                  Rp {cashFlow.actualAmountLeftToSpend || 3000000}
                </span>
              </div>

              {/* Mint green pill bar with status */}
              <div className="bg-[#c8e6c9] py-2 px-3 text-center text-xs font-black text-[#1b5e20] tracking-wider uppercase border-t border-emerald-300 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]"></span>
                <span>UNDER BUDGET</span>
              </div>
            </div>
          )}
        </div>

        {/* ================= COLUMN 2: Needs Summary & Savings Goal ================= */}
        <div
          className={`space-y-5 ${
            mobileSection !== 'all' &&
            mobileSection !== 'needs' &&
            mobileSection !== 'savings'
              ? 'hidden lg:block'
              : ''
          }`}
        >
          {/* Needs Summary Table */}
          {(mobileSection === 'all' || mobileSection === 'needs') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-black text-white px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span>Needs Summary</span>
                  {activeNeeds.length > 0 && (
                    <span className="text-[10px] text-slate-300 font-normal">
                      ({activeNeeds.length})
                    </span>
                  )}
                </div>
                <span className="font-mono">{formatRupiahCompact(needsActual)}</span>
              </div>

              {activeNeeds.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum ada transaksi Kebutuhan Pokok (Needs) yang tercatat bulan ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-[9.5px] sm:text-[11px] font-sans">
                    <thead className="bg-white border-b border-black font-bold text-slate-800">
                      <tr>
                        <th className="py-1 px-1.5 sm:px-3 whitespace-nowrap">Category</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Expected</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Actual</th>
                        <th className="py-1 px-1.5 sm:px-3 text-center whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dotted divide-slate-300">
                      {activeNeeds.map((item) => {
                        const isOver = item.actual > item.expected && item.expected > 0;
                        return (
                          <tr key={item.category} className="h-6 hover:bg-slate-50">
                            <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 truncate max-w-[85px] sm:max-w-[120px] whitespace-nowrap">
                              {item.category}
                            </td>
                            <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">
                              {item.expected > 0 ? formatRupiahTable(item.expected) : '-'}
                            </td>
                            <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                              {formatRupiahTable(item.actual)}
                            </td>
                            <td className="py-1 px-1.5 sm:px-3 text-center whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 text-[8.5px] sm:text-[10px] font-semibold whitespace-nowrap ${
                                  isOver ? 'text-rose-600' : 'text-emerald-700'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                                    isOver ? 'bg-rose-500' : 'bg-emerald-500'
                                  }`}
                                />
                                <span>{isOver ? 'Over Budget' : 'Under Budget'}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-black text-white font-black text-[9.5px] sm:text-[11px]">
                        <td className="py-1.5 px-1.5 sm:px-3 uppercase tracking-wider whitespace-nowrap">TOTAL</td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(needsExpected)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(needsActual)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-center whitespace-nowrap">
                          <span className={`text-[8.5px] sm:text-[10px] font-bold whitespace-nowrap ${
                            needsActual > needsExpected && needsExpected > 0 ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {needsActual > needsExpected && needsExpected > 0 ? '🔴 Over Budget' : '🟢 Under Budget'}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Savings Goal Table */}
          {(mobileSection === 'all' || mobileSection === 'savings') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-black text-white px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span>Savings Goal</span>
                  {activeSavings.length > 0 && (
                    <span className="text-[10px] text-slate-300 font-normal">
                      ({activeSavings.length})
                    </span>
                  )}
                </div>
                <span className="font-mono">{formatRupiahCompact(savingsActual)}</span>
              </div>

              {activeSavings.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum ada alokasi tabungan atau investasi yang tercatat bulan ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-[9.5px] sm:text-[11px] font-sans">
                    <thead className="bg-white border-b border-black font-bold text-slate-800">
                      <tr>
                        <th className="py-1 px-1.5 sm:px-3 whitespace-nowrap">Category</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Expected</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Actual</th>
                        <th className="py-1 px-1.5 sm:px-3 text-center whitespace-nowrap">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dotted divide-slate-300">
                      {activeSavings.map((item) => (
                        <tr key={item.category} className="h-6 hover:bg-slate-50">
                          <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 truncate max-w-[85px] sm:max-w-[120px] whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">
                            {item.expected > 0 ? formatRupiahTable(item.expected) : '-'}
                          </td>
                          <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                            {formatRupiahTable(item.actual)}
                          </td>
                          <td className="py-1 px-1.5 sm:px-3 text-center font-mono text-[8.5px] sm:text-[10px] text-slate-600 whitespace-nowrap tabular-nums">
                            {item.expected > 0 ? `${Math.round((item.actual / item.expected) * 100)}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-black text-white font-black text-[9.5px] sm:text-[11px]">
                        <td className="py-1.5 px-1.5 sm:px-3 uppercase tracking-wider whitespace-nowrap">TOTAL</td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(savingsExpected)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(savingsActual)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-center font-mono text-[8.5px] sm:text-[10px] whitespace-nowrap tabular-nums">
                          {savingsExpected > 0 ? `${((savingsActual / savingsExpected) * 100).toFixed(1)}%` : '-'}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= COLUMN 3: Wants Summary & Income Summary ================= */}
        <div
          className={`space-y-5 ${
            mobileSection !== 'all' &&
            mobileSection !== 'wants' &&
            mobileSection !== 'income'
              ? 'hidden lg:block'
              : ''
          }`}
        >
          {/* Wants Summary Table */}
          {(mobileSection === 'all' || mobileSection === 'wants') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-black text-white px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span>Wants Summary</span>
                  {activeWants.length > 0 && (
                    <span className="text-[10px] text-slate-300 font-normal">
                      ({activeWants.length})
                    </span>
                  )}
                </div>
                <span className="font-mono">{formatRupiahCompact(wantsActual)}</span>
              </div>

              {activeWants.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum ada transaksi Keinginan &amp; Gaya Hidup (Wants) yang tercatat bulan ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-[9.5px] sm:text-[11px] font-sans">
                    <thead className="bg-white border-b border-black font-bold text-slate-800">
                      <tr>
                        <th className="py-1 px-1.5 sm:px-3 whitespace-nowrap">Category</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Expected</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Actual</th>
                        <th className="py-1 px-1.5 sm:px-3 text-center whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dotted divide-slate-300">
                      {activeWants.map((item) => {
                        const isOver = item.actual > item.expected && item.expected > 0;
                        return (
                          <tr key={item.category} className="h-6 hover:bg-slate-50">
                            <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 truncate max-w-[85px] sm:max-w-[120px] whitespace-nowrap">
                              {item.category}
                            </td>
                            <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">
                              {item.expected > 0 ? formatRupiahTable(item.expected) : '-'}
                            </td>
                            <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                              {formatRupiahTable(item.actual)}
                            </td>
                            <td className="py-1 px-1.5 sm:px-3 text-center whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 text-[8.5px] sm:text-[10px] font-semibold whitespace-nowrap ${
                                  isOver ? 'text-rose-600' : 'text-emerald-700'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                                    isOver ? 'bg-rose-500' : 'bg-emerald-500'
                                  }`}
                                />
                                <span>{isOver ? 'Over Budget' : 'Under Budget'}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-black text-white font-black text-[9.5px] sm:text-[11px]">
                        <td className="py-1.5 px-1.5 sm:px-3 uppercase tracking-wider whitespace-nowrap">TOTAL</td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(wantsExpected)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(wantsActual)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-center whitespace-nowrap">
                          <span className={`text-[8.5px] sm:text-[10px] font-bold whitespace-nowrap ${
                            wantsActual > wantsExpected && wantsExpected > 0 ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {wantsActual > wantsExpected && wantsExpected > 0 ? '🔴 Over Budget' : '🟢 Under Budget'}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Income Summary Table */}
          {(mobileSection === 'all' || mobileSection === 'income') && (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-black text-white px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span>Income Summary</span>
                  {activeIncome.length > 0 && (
                    <span className="text-[10px] text-slate-300 font-normal">
                      ({activeIncome.length})
                    </span>
                  )}
                </div>
                <span className="font-mono">{formatRupiahCompact(incomeActual)}</span>
              </div>

              {activeIncome.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum ada pemasukan yang tercatat bulan ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left text-[9.5px] sm:text-[11px] font-sans">
                    <thead className="bg-white border-b border-black font-bold text-slate-800">
                      <tr>
                        <th className="py-1 px-1.5 sm:px-3 whitespace-nowrap">Category</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Expected</th>
                        <th className="py-1 px-1.5 sm:px-3 text-right whitespace-nowrap">Actual</th>
                        <th className="py-1 px-1.5 sm:px-3 text-center whitespace-nowrap">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dotted divide-slate-300">
                      {activeIncome.map((item) => (
                        <tr key={item.category} className="h-6 hover:bg-slate-50">
                          <td className="py-1 px-1.5 sm:px-3 font-medium text-slate-800 truncate max-w-[85px] sm:max-w-[120px] whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="py-1 px-1.5 sm:px-3 text-right font-mono text-slate-600 whitespace-nowrap tabular-nums">
                            {item.expected > 0 ? formatRupiahTable(item.expected) : '-'}
                          </td>
                          <td className="py-1 px-1.5 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums">
                            {formatRupiahTable(item.actual)}
                          </td>
                          <td className="py-1 px-1.5 sm:px-3 text-center font-mono text-[8.5px] sm:text-[10px] text-slate-600 whitespace-nowrap tabular-nums">
                            {item.expected > 0 ? `${((item.actual / item.expected) * 100).toFixed(1)}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-black text-white font-black text-[9.5px] sm:text-[11px]">
                        <td className="py-1.5 px-1.5 sm:px-3 uppercase tracking-wider whitespace-nowrap">TOTAL</td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(incomeExpected)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-right font-mono whitespace-nowrap tabular-nums">
                          {formatRupiahTable(incomeActual)}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-3 text-center font-mono text-[8.5px] sm:text-[10px] whitespace-nowrap tabular-nums">
                          {incomeExpected > 0 ? `${((incomeActual / incomeExpected) * 100).toFixed(1)}%` : '-'}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
