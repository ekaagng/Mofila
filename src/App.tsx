/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Wallet,
  Plus
} from 'lucide-react';

import { SpreadsheetHeader } from './components/SpreadsheetHeader';
import { DonutRowSection } from './components/DonutRowSection';
import { SpreadsheetTables } from './components/SpreadsheetTables';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetPlanModal } from './components/BudgetPlanModal';
import { FinancialHelpModal } from './components/FinancialHelpModal';

import { Transaction, BudgetItem, TransactionType } from './types/finance';
import {
  INITIAL_TRANSACTIONS,
  DEFAULT_BUDGET_ITEMS,
  INITIAL_TOTAL_BUDGET,
  INITIAL_START_BALANCE,
  INITIAL_BUDGET_PERIOD
} from './data/seedData';
import {
  calculateComparisonGroups,
  calculateCategorySummaries,
  calculateCashFlow,
  calculateTopCategories,
  formatRupiahCompact
} from './utils/finance';

const STORAGE_KEY_TX = 'mofila_tx_v2';
const STORAGE_KEY_BUDGET = 'mofila_budget_v2';
const STORAGE_KEY_TOTAL = 'mofila_total_v2';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TX);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUDGET);
      return saved ? JSON.parse(saved) : DEFAULT_BUDGET_ITEMS;
    } catch {
      return DEFAULT_BUDGET_ITEMS;
    }
  });

  const [totalBudget, setTotalBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TOTAL);
      return saved ? JSON.parse(saved) : INITIAL_TOTAL_BUDGET;
    } catch {
      return INITIAL_TOTAL_BUDGET;
    }
  });

  const [currentMonth, setCurrentMonth] = useState<string>('2026-02');
  const [startBalance, setStartBalance] = useState<number>(INITIAL_START_BALANCE);
  const [budgetPeriod, setBudgetPeriod] = useState<string>(INITIAL_BUDGET_PERIOD);

  // Tab: 'dashboard' (Planner/Spreadsheet view like screenshot) vs 'transactions' (Ledger list)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');
  const [mobileSection, setMobileSection] = useState<string>('all');

  // Mobile quick access navigation scroll tracking
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [navScrollProgress, setNavScrollProgress] = useState<number>(0);

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;

    const updateScrollProgress = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        setNavScrollProgress((el.scrollLeft / maxScroll) * 100);
      } else {
        setNavScrollProgress(0);
      }
    };

    updateScrollProgress();
    el.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    return () => {
      el.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  const handleNavSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value);
    setNavScrollProgress(pct);
    if (navScrollRef.current) {
      const maxScroll = navScrollRef.current.scrollWidth - navScrollRef.current.clientWidth;
      if (maxScroll > 0) {
        navScrollRef.current.scrollLeft = (pct / 100) * maxScroll;
      }
    }
  };

  const handleMobileNavButtonClick = (
    btn: { id: string; label: string; isTab: boolean }
  ) => {
    if (btn.isTab) {
      setActiveTab('transactions');
    } else {
      setActiveTab('dashboard');
      setMobileSection(btn.id);
    }
    // Buttons do not scroll or shift on click; shifting is controlled exclusively via the slider
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<TransactionType>('needs');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleOpenAddForType = (type: TransactionType = 'needs') => {
    setEditingTransaction(null);
    setModalDefaultType(type);
    setIsAddModalOpen(true);
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGET, JSON.stringify(budgetItems));
    } catch (e) {
      console.error(e);
    }
  }, [budgetItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TOTAL, JSON.stringify(totalBudget));
    } catch (e) {
      console.error(e);
    }
  }, [totalBudget]);

  // Derived financial computations
  const comparisonGroups = useMemo(
    () => calculateComparisonGroups(transactions, budgetItems, currentMonth),
    [transactions, budgetItems, currentMonth]
  );

  const cashFlow = useMemo(
    () => calculateCashFlow(transactions, currentMonth, totalBudget, startBalance),
    [transactions, currentMonth, totalBudget, startBalance]
  );

  const needsSummaries = useMemo(
    () => calculateCategorySummaries(transactions, budgetItems, currentMonth, 'needs'),
    [transactions, budgetItems, currentMonth]
  );

  const wantsSummaries = useMemo(
    () => calculateCategorySummaries(transactions, budgetItems, currentMonth, 'wants'),
    [transactions, budgetItems, currentMonth]
  );

  const savingsSummaries = useMemo(
    () => calculateCategorySummaries(transactions, budgetItems, currentMonth, 'savings'),
    [transactions, budgetItems, currentMonth]
  );

  const debtSummaries = useMemo(
    () => calculateCategorySummaries(transactions, budgetItems, currentMonth, 'debt'),
    [transactions, budgetItems, currentMonth]
  );

  const incomeSummaries = useMemo(
    () => calculateCategorySummaries(transactions, budgetItems, currentMonth, 'income'),
    [transactions, budgetItems, currentMonth]
  );

  const topCategories = useMemo(
    () => calculateTopCategories(transactions, currentMonth, 20),
    [transactions, currentMonth]
  );

  const monthTransactionCount = useMemo(
    () => transactions.filter((t) => t.date.startsWith(currentMonth)).length,
    [transactions, currentMonth]
  );

  // CRUD Handlers
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id'>,
    editId?: string
  ) => {
    if (editId) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editId ? { ...txData, id: editId } : t))
      );
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx_${Date.now()}`
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleResetToExactReference = () => {
    if (window.confirm('Muat ulang data persis seperti referensi awal?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgetItems(DEFAULT_BUDGET_ITEMS);
      setTotalBudget(INITIAL_TOTAL_BUDGET);
      setStartBalance(INITIAL_START_BALANCE);
      setBudgetPeriod(INITIAL_BUDGET_PERIOD);
      setCurrentMonth('2026-02');
      localStorage.removeItem(STORAGE_KEY_TX);
      localStorage.removeItem(STORAGE_KEY_BUDGET);
      localStorage.removeItem(STORAGE_KEY_TOTAL);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans antialiased flex flex-col selection:bg-black selection:text-white pb-12">
      {/* Top Application Bar */}
      <header className="bg-white border-b border-slate-300 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 gap-2.5">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-sm shadow-xs">
                M
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-black tracking-tight text-slate-900">
                    Mofila
                  </h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-300">
                    50/30/20 Planner
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Financial Dashboard &amp; Ledger
                </p>
              </div>
            </div>


          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-4 sm:space-y-6">
        {/* Mobile Quick-Access Horizontal Toggle Bar with Slider */}
        <div className="lg:hidden sticky top-[49px] z-20 -mx-3 px-3 py-2 bg-[#f8f9fa]/95 backdrop-blur-xs border-b border-slate-300">
          {/* Horizontal Button Bar */}
          <div
            ref={navScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5"
          >
            {[
              { id: 'all', label: '📄 Semua', isTab: false },
              { id: 'cashflow', label: '📊 Cash Flow', isTab: false },
              { id: 'needs', label: '🛍️ Needs', isTab: false },
              { id: 'wants', label: '✨ Wants', isTab: false },
              { id: 'savings', label: '💰 Savings', isTab: false },
              { id: 'debt', label: '💳 Debt', isTab: false },
              { id: 'income', label: '📈 Income', isTab: false },
              { id: 'top20', label: '🔥 Top 20', isTab: false },
              { id: 'tx', label: `📝 Transaksi (${monthTransactionCount})`, isTab: true },
            ].map((btn) => {
              const isActive = btn.isTab
                ? activeTab === 'transactions'
                : activeTab === 'dashboard' && mobileSection === btn.id;

              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleMobileNavButtonClick(btn)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shadow-2xs shrink-0 select-none ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 hover:text-black active:bg-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          {/* Slider tepat dibawah button */}
          <div className="pt-2 px-1">
            <div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={Math.round(navScrollProgress)}
                onChange={handleNavSliderChange}
                className="w-full h-1.5 bg-slate-300 hover:bg-slate-400 rounded-lg appearance-none cursor-ew-resize accent-black transition-all"
                aria-label="Slider Penggeser Tombol Navigasi"
              />
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1 px-0.5 select-none">
                <span className="flex items-center gap-0.5">◀ Geser tombol</span>
                <span className="flex items-center gap-0.5">Geser ▶</span>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <div key={`dashboard-${mobileSection}`} className="space-y-4 sm:space-y-6 animate-slide-up">
            {/* 1. Header: 50/30/20 Budgeting + Expected vs Actual + Status Overview + Total Spend Donut */}
            {/* Pada mobile, jika memilih section spesifik (misal Needs/Wants/Top20), langsung tampilkan section tersebut tanpa harus scroll */}
            <div className={mobileSection === 'all' ? 'block' : 'hidden lg:block'}>
              <SpreadsheetHeader
                currentMonth={currentMonth}
                totalBudget={totalBudget}
                startBalance={startBalance}
                budgetPeriod={budgetPeriod}
                groups={comparisonGroups}
                cashFlow={cashFlow}
                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              />
            </div>

            {/* 2. Three Circular Donut Charts (Total Expense, Total Savings, Total Income) */}
            <div className={mobileSection === 'all' ? 'block' : 'hidden lg:block'}>
              <DonutRowSection
                totalExpense={950000}
                totalSavings={100000}
                totalIncome={1250000}
              />
            </div>

            {/* 3. 3-Column Spreadsheet Tables with Black Headers, Dotted Lines, Status Dots, Top 20 Red Bars & Left to Spend */}
            <SpreadsheetTables
              cashFlow={cashFlow}
              startBalance={startBalance}
              needsSummaries={needsSummaries}
              wantsSummaries={wantsSummaries}
              savingsSummaries={savingsSummaries}
              debtSummaries={debtSummaries}
              incomeSummaries={incomeSummaries}
              topCategories={topCategories}
              mobileSection={mobileSection}
              onMobileSectionChange={setMobileSection}
              onOpenTransactions={() => setActiveTab('transactions')}
              onOpenAddTransaction={handleOpenAddForType}
            />
          </div>
        ) : (
          /* Layar Buku Besar Transaksi (Ledger) */
          <div key="transactions-ledger" className="animate-slide-up">
            <TransactionList
              transactions={transactions}
              currentMonth={currentMonth}
              onOpenAddModal={() => handleOpenAddForType('needs')}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editTransaction={editingTransaction}
        defaultMonth={currentMonth}
        defaultType={modalDefaultType}
      />

      <BudgetPlanModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        totalBudget={totalBudget}
        onUpdateTotalBudget={setTotalBudget}
        budgetItems={budgetItems}
        onUpdateBudgetItems={setBudgetItems}
        currentMonth={currentMonth}
      />

      <FinancialHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Floating Action Button (FAB) Quick Access: Tambah Transaksi */}
      <button
        type="button"
        onClick={() => handleOpenAddForType('needs')}
        className="fixed bottom-6 right-6 z-50 bg-black hover:bg-slate-800 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/80 group focus:outline-hidden focus:ring-4 focus:ring-black/20"
        aria-label="Tambah Transaksi"
        title="Tambah Transaksi Baru"
      >
        <Plus className="w-7 h-7 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
      </button>
    </div>
  );
}
