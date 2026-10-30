import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction, TransactionType } from '../types/finance';
import { formatRupiah, formatMonthYear } from '../utils/finance';

interface TransactionListProps {
  transactions: Transaction[];
  currentMonth: string;
  onOpenAddModal: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onBackToDashboard?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currentMonth,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  onBackToDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'category'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter & Search
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Month filter (match current month or allow toggle)
      const matchesMonth = currentMonth ? tx.date.startsWith(currentMonth) : true;
      if (!matchesMonth) return false;

      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCategory = tx.category.toLowerCase().includes(q);
        const matchesNotes = tx.notes.toLowerCase().includes(q);
        const matchesAmount = tx.amount.toString().includes(q);
        if (!matchesCategory && !matchesNotes && !matchesAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, currentMonth, selectedType, selectedCategory, searchQuery]);

  // Sorting
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [filteredTransactions, sortBy]);

  // Available categories in the filtered month for dropdown
  const availableCategories = useMemo(() => {
    const monthTx = transactions.filter((tx) => tx.date.startsWith(currentMonth));
    const set = new Set<string>();
    monthTx.forEach((tx) => set.add(tx.category));
    return Array.from(set).sort();
  }, [transactions, currentMonth]);

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <ArrowDownRight className="w-3 h-3 text-purple-600" />
            <span>Income</span>
          </span>
        );
      case 'needs':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            <ArrowUpRight className="w-3 h-3 text-orange-600" />
            <span>Needs</span>
          </span>
        );
      case 'wants':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
            <ArrowUpRight className="w-3 h-3 text-pink-600" />
            <span>Wants</span>
          </span>
        );
      case 'savings':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ArrowDownRight className="w-3 h-3 text-emerald-600" />
            <span>Savings</span>
          </span>
        );
      case 'debt':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <ArrowUpRight className="w-3 h-3 text-rose-600" />
            <span>Debt</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-4 animate-slide-up">
      {/* Back to Dashboard if opened as dedicated ledger */}
      {onBackToDashboard && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 transition shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Dasbor Planner</span>
          </button>
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi berdasarkan kategori, catatan, nominal..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Type */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium">Tipe:</span>
              <select
                aria-label="Filter Tipe Transaksi"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">Semua Tipe</option>
                <option value="income">Income (Pemasukan)</option>
                <option value="needs">Needs (Kebutuhan)</option>
                <option value="wants">Wants (Keinginan)</option>
                <option value="savings">Savings (Tabungan)</option>
                <option value="debt">Debt (Cicilan/Hutang)</option>
              </select>
            </div>

            {/* Filter by Category */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium">Kategori:</span>
              <select
                aria-label="Filter Kategori Transaksi"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden max-w-[150px] truncate"
              >
                <option value="all">Semua Kategori</option>
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Urutkan Transaksi"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="date-desc">Tanggal (Terbaru)</option>
                <option value="date-asc">Tanggal (Terlama)</option>
                <option value="amount-desc">Nominal (Terbesar)</option>
                <option value="amount-asc">Nominal (Terkecil)</option>
                <option value="category">Kategori (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Header Summary */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="font-semibold text-slate-700">
            Riwayat Buku Besar:{' '}
            <span className="text-emerald-700 font-bold">
              {formatMonthYear(currentMonth)}
            </span>{' '}
            <span className="text-slate-500 font-normal">
              ({sortedTransactions.length} transaksi)
            </span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/80 px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Transaksi</span>
          </button>
        </div>

        {/* Empty State */}
        {sortedTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Mulai catat transaksi pertamamu
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Tidak ada catatan transaksi yang sesuai dengan filter atau periode ini.
              Klik tombol di bawah untuk menambahkan transaksi baru.
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Transaksi Baru</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Zebra-Striped Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-28">Date (Tanggal)</th>
                    <th className="py-3 px-4 w-28">Type (Tipe)</th>
                    <th className="py-3 px-4">Category (Kategori)</th>
                    <th className="py-3 px-4 text-right w-36">Amount (Jumlah)</th>
                    <th className="py-3 px-4">Notes (Catatan)</th>
                    <th className="py-3 px-4 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-slate-200">
                  {paginatedTransactions.map((tx, idx) => {
                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                    const isIncome = tx.type === 'income';

                    return (
                      <tr
                        key={tx.id}
                        className={
                          idx % 2 === 0
                            ? 'bg-white hover:bg-slate-50/90 transition-colors'
                            : 'bg-slate-50/50 hover:bg-slate-100/80 transition-colors'
                        }
                      >
                        <td className="py-3 px-4 text-center font-mono text-slate-400">
                          {rowNumber}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4">{getTypeBadge(tx.type)}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {tx.category}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap tabular-nums ${
                            isIncome ? 'text-purple-700' : 'text-slate-900'
                          }`}
                        >
                          {isIncome ? `+${formatRupiah(tx.amount)}` : formatRupiah(tx.amount)}
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={tx.notes}>
                          {tx.notes || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onEditTransaction(tx)}
                              title="Edit Transaksi"
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition cursor-pointer"
                              aria-label={`Edit ${tx.category}`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus transaksi "${tx.category}" sebesar ${formatRupiah(tx.amount)}?`)) {
                                  onDeleteTransaction(tx.id);
                                }
                              }}
                              title="Hapus Transaksi"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                              aria-label={`Hapus ${tx.category}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (PRD Requirement Section 4: Vertical Cards for Mobile) */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedTransactions.map((tx, idx) => {
                const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                const isIncome = tx.type === 'income';

                return (
                  <div key={tx.id} className="p-3.5 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          #{rowNumber}
                        </span>
                        <span className="font-semibold text-slate-900 text-xs">
                          {tx.category}
                        </span>
                      </div>
                      <div
                        className={`text-xs font-bold font-mono tabular-nums ${
                          isIncome ? 'text-purple-700' : 'text-slate-900'
                        }`}
                      >
                        {isIncome ? `+${formatRupiah(tx.amount)}` : formatRupiah(tx.amount)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <div className="flex items-center gap-2">
                        {getTypeBadge(tx.type)}
                        <span className="font-mono text-[10px]">{tx.date}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                          aria-label={`Edit ${tx.category}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus transaksi "${tx.category}"?`)) {
                              onDeleteTransaction(tx.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          aria-label={`Hapus ${tx.category}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {tx.notes && (
                      <div className="mt-1.5 text-[11px] text-slate-500 bg-slate-50 rounded px-2 py-1">
                        {tx.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Halaman <strong className="text-slate-800">{currentPage}</strong> dari{' '}
                  <strong className="text-slate-800">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Halaman Berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
