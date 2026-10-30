import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, Check } from 'lucide-react';
import { Transaction, TransactionType } from '../types/finance';
import { CATEGORY_PRESETS } from '../data/seedData';
import { formatRupiah, parseRupiahInput } from '../utils/finance';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id'>, editId?: string) => void;
  editTransaction: Transaction | null;
  defaultMonth: string;
  defaultType?: TransactionType;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editTransaction,
  defaultMonth,
  defaultType = 'needs'
}) => {
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<TransactionType>('needs');
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [amountStr, setAmountStr] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editTransaction) {
      setDate(editTransaction.date);
      setType(editTransaction.type);
      setAmountStr(editTransaction.amount.toString());
      setNotes(editTransaction.notes || '');

      const presets = CATEGORY_PRESETS[editTransaction.type] || [];
      if (presets.includes(editTransaction.category)) {
        setCategory(editTransaction.category);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('custom');
        setIsCustomCategory(true);
        setCustomCategory(editTransaction.category);
      }
    } else {
      // Default new transaction date in current month
      const today = new Date().toISOString().slice(0, 10);
      const initialDate = today.startsWith(defaultMonth)
        ? today
        : `${defaultMonth}-15`;

      const targetType = defaultType || 'needs';
      setDate(initialDate);
      setType(targetType);
      const presets = CATEGORY_PRESETS[targetType] || [];
      setCategory(presets[0] || '');
      setIsCustomCategory(false);
      setCustomCategory('');
      setAmountStr('');
      setNotes('');
    }
    setErrors({});
  }, [editTransaction, defaultMonth, isOpen, defaultType]);

  if (!isOpen) return null;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const presets = CATEGORY_PRESETS[newType] || [];
    setCategory(presets[0] || '');
    setIsCustomCategory(false);
    setCustomCategory('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomCategory(true);
      setCategory('');
    } else {
      setIsCustomCategory(false);
      setCategory(val);
      setCustomCategory('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!date) {
      newErrors.date = 'Tanggal wajib diisi';
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category.trim();
    if (!finalCategory) {
      newErrors.category = 'Kategori transaksi wajib ditentukan';
    }

    const numericAmount = parseRupiahInput(amountStr);
    if (!numericAmount || numericAmount <= 0) {
      newErrors.amount = 'Nominal harus lebih besar dari Rp 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        date,
        type,
        category: finalCategory,
        amount: numericAmount,
        notes: notes.trim()
      },
      editTransaction ? editTransaction.id : undefined
    );
    onClose();
  };

  const parsedAmount = parseRupiahInput(amountStr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {editTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              {editTransaction
                ? 'Perbarui rincian transaksi buku besar'
                : 'Catat pemasukan atau pengeluaran finansial'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipe Transaksi
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
              {[
                { type: 'income', label: 'Income', color: 'hover:border-purple-300 peer-checked:bg-purple-600 peer-checked:text-white' },
                { type: 'needs', label: 'Needs', color: 'hover:border-orange-300 peer-checked:bg-orange-600 peer-checked:text-white' },
                { type: 'wants', label: 'Wants', color: 'hover:border-pink-300 peer-checked:bg-pink-600 peer-checked:text-white' },
                { type: 'savings', label: 'Savings', color: 'hover:border-emerald-300 peer-checked:bg-emerald-600 peer-checked:text-white' },
                { type: 'debt', label: 'Debt', color: 'hover:border-rose-300 peer-checked:bg-rose-600 peer-checked:text-white' }
              ].map((item) => (
                <label key={item.type} className="cursor-pointer">
                  <input
                    type="radio"
                    name="transaction-type"
                    value={item.type}
                    checked={type === item.type}
                    onChange={() => handleTypeChange(item.type as TransactionType)}
                    className="sr-only peer"
                  />
                  <div className={`py-2 px-1 text-center font-semibold rounded-lg border border-slate-200 bg-slate-50 transition text-slate-600 ${item.color}`}>
                    {item.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="tx-date" className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Transaksi
            </label>
            <div className="relative">
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
            </div>
            {errors.date && <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>}
          </div>

          {/* Category Dropdown & Custom Category */}
          <div>
            <label htmlFor="tx-category" className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori
            </label>
            {!isCustomCategory ? (
              <select
                id="tx-category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              >
                {(CATEGORY_PRESETS[type] || []).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ Tambah Kategori Kustom...</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik nama kategori kustom..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomCategory(false);
                    setCategory((CATEGORY_PRESETS[type] || [])[0] || '');
                  }}
                  className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                >
                  Batal
                </button>
              </div>
            )}
            {errors.category && <p className="text-[11px] text-rose-600 mt-1">{errors.category}</p>}
          </div>

          {/* Amount input with formatted preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-700">
                Jumlah / Nominal (IDR)
              </label>
              {parsedAmount > 0 && (
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {formatRupiah(parsedAmount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                Rp
              </span>
              <input
                id="tx-amount"
                type="text"
                placeholder="Contoh: 500000"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
              />
            </div>
            {errors.amount && <p className="text-[11px] text-rose-600 mt-1">{errors.amount}</p>}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="tx-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Transaksi (Opsional)
            </label>
            <input
              id="tx-notes"
              type="text"
              placeholder="Contoh: Makan siang dengan klien / Belanja mingguan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer"
            >
              {editTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
