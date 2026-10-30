import React, { useState, useEffect } from 'react';
import { X, Sliders, Calculator, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { BudgetItem, TransactionType } from '../types/finance';
import { formatRupiah, parseRupiahInput } from '../utils/finance';

interface BudgetPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalBudget: number;
  onUpdateTotalBudget: (amount: number) => void;
  budgetItems: BudgetItem[];
  onUpdateBudgetItems: (items: BudgetItem[]) => void;
  currentMonth: string;
}

export const BudgetPlanModal: React.FC<BudgetPlanModalProps> = ({
  isOpen,
  onClose,
  totalBudget,
  onUpdateTotalBudget,
  budgetItems,
  onUpdateBudgetItems,
  currentMonth
}) => {
  const [tempBudget, setTempBudget] = useState<string>(totalBudget.toString());
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [activeTab, setActiveTab] = useState<TransactionType>('needs');
  const [newCategory, setNewCategory] = useState<string>('');
  const [newExpected, setNewExpected] = useState<string>('');

  useEffect(() => {
    setTempBudget(totalBudget.toString());
    const monthItems = budgetItems.filter((b) => b.month === currentMonth);
    setItems(monthItems);
  }, [totalBudget, budgetItems, currentMonth, isOpen]);

  if (!isOpen) return null;

  const handleExpectedChange = (id: string, value: string) => {
    const num = parseRupiahInput(value);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expected: num } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const num = parseRupiahInput(newExpected);

    const newItem: BudgetItem = {
      id: `b_custom_${Date.now()}`,
      category: newCategory.trim(),
      type: activeTab,
      expected: num,
      month: currentMonth
    };

    setItems((prev) => [...prev, newItem]);
    setNewCategory('');
    setNewExpected('');
  };

  // 50/30/20 Rule Auto Calculator
  const handleApply503020 = () => {
    const budget = parseRupiahInput(tempBudget) || totalBudget;
    const needsBudget = Math.round(budget * 0.5);
    const wantsBudget = Math.round(budget * 0.3);
    const savingsBudget = Math.round(budget * 0.2);

    // Distribute proportionally across existing categories in each group
    const updated = items.map((item) => {
      if (item.type === 'needs') {
        const needsCount = items.filter((i) => i.type === 'needs').length || 1;
        return { ...item, expected: Math.round(needsBudget / needsCount) };
      }
      if (item.type === 'wants') {
        const wantsCount = items.filter((i) => i.type === 'wants').length || 1;
        return { ...item, expected: Math.round(wantsBudget / wantsCount) };
      }
      if (item.type === 'savings') {
        const savingsCount = items.filter((i) => i.type === 'savings').length || 1;
        return { ...item, expected: Math.round(savingsBudget / savingsCount) };
      }
      return item;
    });

    setItems(updated);
  };

  const handleSaveAll = () => {
    const finalTotal = parseRupiahInput(tempBudget);
    if (finalTotal > 0) {
      onUpdateTotalBudget(finalTotal);
    }

    // Merge updated month items with other months
    const otherMonthsItems = budgetItems.filter((b) => b.month !== currentMonth);
    onUpdateBudgetItems([...otherMonthsItems, ...items]);
    onClose();
  };

  const activeItems = items.filter((i) => i.type === activeTab);
  const activeGroupTotal = activeItems.reduce((sum, i) => sum + i.expected, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Budget Planner &amp; Alokasi Anggaran
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan batas anggaran total dan target pos pengeluaran bulanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Total Monthly Budget Setting */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
                  Total Budget Keseluruhan Bulanan
                </label>
                <p className="text-xs text-emerald-800">
                  Batas atas pengeluaran yang dijadikan patokan dashboard donat &amp; indikator sisa belanja.
                </p>
              </div>

              <div className="sm:w-60">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700 font-mono">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold bg-white border border-emerald-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="text-[11px] text-right font-mono text-emerald-700 mt-1">
                  {formatRupiah(parseRupiahInput(tempBudget))}
                </div>
              </div>
            </div>

            {/* Quick 50/30/20 Recommendation Button */}
            <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rekomendasi 50/30/20: Needs 50%, Wants 30%, Savings 20%</span>
              </span>
              <button
                type="button"
                onClick={handleApply503020}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold rounded-lg shadow-2xs transition cursor-pointer"
              >
                Terapkan Otomatis
              </button>
            </div>
          </div>

          {/* 2. Category Allocations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Alokasi Target Pos Per Kategori
              </span>
              <span className="text-xs font-mono font-bold text-slate-800">
                Total Pos {activeTab.toUpperCase()}: {formatRupiah(activeGroupTotal)}
              </span>
            </div>

            {/* Tabs for Category Types */}
            <div className="flex gap-1.5 border-b border-slate-200 pb-2 text-xs">
              {(['needs', 'wants', 'savings', 'debt', 'income'] as TransactionType[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition cursor-pointer ${
                      activeTab === tab
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Items List */}
            <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs gap-3"
                >
                  <span className="font-semibold text-slate-800 flex-1 truncate">
                    {item.category}
                  </span>
                  <div className="w-40 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={item.expected}
                      onChange={(e) => handleExpectedChange(item.id, e.target.value)}
                      className="w-full pl-8 pr-2 py-1 text-xs font-mono font-medium bg-white border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                    aria-label={`Hapus ${item.category}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {activeItems.length === 0 && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Belum ada kategori untuk tipe {activeTab}. Tambahkan di bawah.
                </div>
              )}
            </div>

            {/* Add Custom Budget Category */}
            <form onSubmit={handleAddNewItem} className="mt-3 flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder={`Tambah kategori ${activeTab} baru...`}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="Target Rp"
                value={newExpected}
                onChange={(e) => setNewExpected(e.target.value)}
                className="w-28 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer"
          >
            Simpan Anggaran
          </button>
        </div>
      </div>
    </div>
  );
};
