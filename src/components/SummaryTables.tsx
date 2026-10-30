import React, { useState } from 'react';
import {
  Table,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  ShoppingBag,
  PiggyBank,
  Receipt,
  Wallet
} from 'lucide-react';
import { CategorySummary, CashFlowSummary } from '../types/finance';
import { formatRupiah } from '../utils/finance';

interface SummaryTablesProps {
  cashFlow: CashFlowSummary;
  needsSummaries: CategorySummary[];
  wantsSummaries: CategorySummary[];
  savingsSummaries: CategorySummary[];
  debtSummaries: CategorySummary[];
  incomeSummaries: CategorySummary[];
  onOpenBudgetModal: () => void;
}

export const SummaryTables: React.FC<SummaryTablesProps> = ({
  cashFlow,
  needsSummaries,
  wantsSummaries,
  savingsSummaries,
  debtSummaries,
  incomeSummaries,
  onOpenBudgetModal
}) => {
  const [activeTableTab, setActiveTableTab] = useState<
    'needs' | 'wants' | 'savings' | 'debt' | 'income'
  >('needs');

  return (
    <div className="space-y-5">
      {/* 1. Cash Flow Summary Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Cash Flow Summary (Arus Kas Bersih)
              </h3>
              <p className="text-xs text-slate-500">
                Pemasukan riil dikurangi seluruh pengeluaran dan alokasi tabungan
              </p>
            </div>
          </div>

          <div
            className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto ${
              cashFlow.netCashFlow >= 0
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {cashFlow.netCashFlow >= 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>
              {cashFlow.netCashFlow >= 0 ? 'Surplus Finansial (Positif)' : 'Defisit Arus Kas (Negatif)'}
            </span>
          </div>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Pemasukan</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-base font-bold text-purple-700 font-mono tabular-nums">
              {formatRupiah(cashFlow.totalIncomeActual)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Realisasi bulan ini</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Pengeluaran</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <div className="text-base font-bold text-orange-700 font-mono tabular-nums">
              {formatRupiah(cashFlow.totalExpenseActual)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Needs + Wants + Debt</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Tabungan</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-base font-bold text-emerald-700 font-mono tabular-nums">
              {formatRupiah(cashFlow.totalSavingsActual)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Dana Darurat & Investasi</div>
          </div>

          <div
            className={`border rounded-xl p-3.5 ${
              cashFlow.netCashFlow >= 0
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-rose-50/60 border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-semibold">Sisa Saldo Bersih</span>
              <span className="text-[10px] font-mono">Net Balance</span>
            </div>
            <div
              className={`text-base font-extrabold font-mono tabular-nums ${
                cashFlow.netCashFlow >= 0 ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              {formatRupiah(cashFlow.netCashFlow)}
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              {cashFlow.netCashFlow >= 0 ? 'Bebas dialokasikan / cadangan' : 'Perlu evaluasi pengeluaran'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tracking Tables with Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        {/* Table Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Tabel Rincian &amp; Pelacakan Kategori (Tracking Tables)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi mendalam Expected vs Actual per kategori pengeluaran dan target tabungan
            </p>
          </div>

          <button
            onClick={onOpenBudgetModal}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-1.5 transition self-start sm:self-auto cursor-pointer"
          >
            Sesuaikan Anggaran (Budget Planner)
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-3 pb-2 border-b border-slate-100 text-xs">
          <button
            onClick={() => setActiveTableTab('needs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTableTab === 'needs'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Needs Summary ({needsSummaries.length})</span>
          </button>

          <button
            onClick={() => setActiveTableTab('wants')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTableTab === 'wants'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wants Summary ({wantsSummaries.length})</span>
          </button>

          <button
            onClick={() => setActiveTableTab('debt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTableTab === 'debt'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Debt Payment Tracker ({debtSummaries.length})</span>
          </button>

          <button
            onClick={() => setActiveTableTab('savings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTableTab === 'savings'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Savings Goal Tracker ({savingsSummaries.length})</span>
          </button>

          <button
            onClick={() => setActiveTableTab('income')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTableTab === 'income'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Income Summary ({incomeSummaries.length})</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="mt-4 overflow-x-auto">
          {/* Active view renderer */}
          {activeTableTab === 'needs' && (
            <ExpenseCategoryTable
              title="Needs Summary (Pengeluaran Kebutuhan Pokok)"
              data={needsSummaries}
              badgeColor="orange"
            />
          )}

          {activeTableTab === 'wants' && (
            <ExpenseCategoryTable
              title="Wants Summary (Pengeluaran Keinginan & Gaya Hidup)"
              data={wantsSummaries}
              badgeColor="pink"
            />
          )}

          {activeTableTab === 'debt' && (
            <DebtTrackerTable
              title="Debt Payment Tracker (Pelacakan Pembayaran Hutang / Cicilan)"
              data={debtSummaries}
            />
          )}

          {activeTableTab === 'savings' && (
            <SavingsGoalTable
              title="Savings Goal Tracker (Pelacakan Target Tabungan & Investasi)"
              data={savingsSummaries}
            />
          )}

          {activeTableTab === 'income' && (
            <IncomeSummaryTable
              title="Income Summary (Rincian Sumber Pendapatan Bulanan)"
              data={incomeSummaries}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* Sub-component: Expense Table (Zebra-striped) */
interface ExpenseTableProps {
  title: string;
  data: CategorySummary[];
  badgeColor: 'orange' | 'pink';
}

const ExpenseCategoryTable: React.FC<ExpenseTableProps> = ({ title, data }) => {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-xs">
        Tidak ada kategori pengeluaran yang terdaftar.
      </div>
    );
  }

  const totalExpected = data.reduce((sum, item) => sum + item.expected, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
  const totalDiff = totalExpected - totalActual;

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-700">{title}</div>
      <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Kategori</th>
            <th className="py-2.5 px-3 text-right">Expected (Anggaran)</th>
            <th className="py-2.5 px-3 text-right">Actual (Realisasi)</th>
            <th className="py-2.5 px-3 text-right">Details (Selisih Sisa)</th>
            <th className="py-2.5 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-slate-200">
          {data.map((item, idx) => (
            <tr
              key={item.category}
              className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/60 hover:bg-slate-100/70'}
            >
              <td className="py-2.5 px-3 font-medium text-slate-800">
                {item.category}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                {formatRupiah(item.expected)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                {formatRupiah(item.actual)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                <span
                  className={
                    item.diff >= 0
                      ? 'text-emerald-700 font-semibold'
                      : 'text-rose-600 font-bold'
                  }
                >
                  {item.diff >= 0 ? `+${formatRupiah(item.diff)}` : formatRupiah(item.diff)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1.5">
                  ({item.percentage}%)
                </span>
              </td>
              <td className="py-2.5 px-3 text-center">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'under' || item.diff >= 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {item.status === 'under' || item.diff >= 0 ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Under Budget</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      <span>Over Budget</span>
                    </>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-100/80 border-t-2 border-slate-300 font-bold text-slate-900">
          <tr>
            <td className="py-2.5 px-3">Total</td>
            <td className="py-2.5 px-3 text-right font-mono">
              {formatRupiah(totalExpected)}
            </td>
            <td className="py-2.5 px-3 text-right font-mono">
              {formatRupiah(totalActual)}
            </td>
            <td className="py-2.5 px-3 text-right font-mono">
              <span className={totalDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {totalDiff >= 0 ? `+${formatRupiah(totalDiff)}` : formatRupiah(totalDiff)}
              </span>
            </td>
            <td className="py-2.5 px-3 text-center">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  totalDiff >= 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {totalDiff >= 0 ? 'AMAN' : 'OVER BUDGET'}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

/* Sub-component: Debt Payment Tracker */
const DebtTrackerTable: React.FC<{ title: string; data: CategorySummary[] }> = ({
  title,
  data
}) => {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-700">{title}</div>
      <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Nama Cicilan / Hutang</th>
            <th className="py-2.5 px-3 text-right">Target Cicilan Bulanan</th>
            <th className="py-2.5 px-3 text-right">Realisasi Pembayaran</th>
            <th className="py-2.5 px-3 text-center">Progress Bulanan</th>
            <th className="py-2.5 px-3 text-center">Status Pembayaran</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-slate-200">
          {data.map((item, idx) => {
            const isPaid = item.actual >= item.expected && item.expected > 0;
            return (
              <tr
                key={item.category}
                className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}
              >
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  {item.category}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                  {formatRupiah(item.expected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatRupiah(item.actual)}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2 justify-center max-w-[140px] mx-auto">
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 w-8">
                      {item.percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isPaid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Lunas Bulan Ini</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Belum Selesai</span>
                      </>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* Sub-component: Savings Goal Tracker with Progress Bar */
const SavingsGoalTable: React.FC<{ title: string; data: CategorySummary[] }> = ({
  title,
  data
}) => {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-700">{title}</div>
      <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Target Pos Tabungan</th>
            <th className="py-2.5 px-3 text-right">Target Bulanan</th>
            <th className="py-2.5 px-3 text-right">Terkumpul Aktual</th>
            <th className="py-2.5 px-3 text-center min-w-[160px]">Progress Bar Capaian</th>
            <th className="py-2.5 px-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-slate-200">
          {data.map((item, idx) => {
            const isTargetMet = item.actual >= item.expected && item.expected > 0;
            return (
              <tr
                key={item.category}
                className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}
              >
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  {item.category}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                  {formatRupiah(item.expected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                  {formatRupiah(item.actual)}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2 max-w-[200px] mx-auto">
                    <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isTargetMet
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {isTargetMet ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Target Tercapai</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>Sedang Berjalan</span>
                      </>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* Sub-component: Income Summary Table */
const IncomeSummaryTable: React.FC<{ title: string; data: CategorySummary[] }> = ({
  title,
  data
}) => {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-700">{title}</div>
      <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Sumber Pendapatan</th>
            <th className="py-2.5 px-3 text-right">Target Estimasi</th>
            <th className="py-2.5 px-3 text-right">Realisasi Pemasukan</th>
            <th className="py-2.5 px-3 text-right">Selisih (+/-)</th>
            <th className="py-2.5 px-3 text-center">Status Capaian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-slate-200">
          {data.map((item, idx) => {
            const isMet = item.actual >= item.expected;
            return (
              <tr
                key={item.category}
                className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-100'}
              >
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  {item.category}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                  {formatRupiah(item.expected)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-purple-700">
                  {formatRupiah(item.actual)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span
                    className={
                      item.diff >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-semibold'
                    }
                  >
                    {item.diff >= 0 ? `+${formatRupiah(item.diff)}` : formatRupiah(item.diff)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isMet
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isMet ? 'Tercapai 100%+' : `${item.percentage}% dari target`}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
