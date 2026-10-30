import React from 'react';
import { X, HelpCircle, CheckCircle2, AlertCircle, PieChart, ShieldCheck } from 'lucide-react';

interface FinancialHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialHelpModal: React.FC<FinancialHelpModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Panduan Istilah Finansial Mofila
              </h3>
              <p className="text-xs text-slate-500">
                Konsep dasar budgeting dan pembacaan metrik dashboard
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

        {/* Glossary Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 flex-1">
          {/* 1. Expected vs Actual */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>Expected vs Actual</span>
            </h4>
            <p>
              <strong className="text-slate-800">Expected (Anggaran)</strong> adalah batas
              dana yang Anda rencanakan sebelum bulan berjalan dimulai.
            </p>
            <p>
              <strong className="text-slate-800">Actual (Realisasi)</strong> adalah jumlah riil
              uang yang sudah Anda belanjakan atau terima dari pencatatan transaksi buku besar.
            </p>
          </div>

          {/* 2. Under Budget vs Over Budget */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              Status Indikator Anggaran
            </h4>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-emerald-700">UNDER BUDGET (Hijau):</strong>{' '}
                Pengeluaran riil masih berada di bawah target anggaran. Ini adalah kondisi sehat.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-rose-700">OVER BUDGET (Merah):</strong>{' '}
                Pengeluaran riil melampaui alokasi yang direncanakan. Evaluasi kembali pos pengeluaran terkait.
              </div>
            </div>
          </div>

          {/* 3. Metode Budgeting 50/30/20 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Metode Budgeting 50/30/20</span>
            </h4>
            <p>
              Prinsip alokasi pendapatan ideal yang dipopulerkan oleh pakar finansial:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong className="text-orange-700">50% Needs (Kebutuhan):</strong> Sewa tempat,
                makanan pokok, listrik, air, transportasi, dan asuransi.
              </li>
              <li>
                <strong className="text-pink-700">30% Wants (Keinginan):</strong> Hiburan, makan di luar,
                shopping, liburan, dan hobi.
              </li>
              <li>
                <strong className="text-emerald-700">20% Savings (Tabungan &amp; Investasi):</strong> Dana darurat,
                reksadana, saham, dan pelunasan hutang (Debt).
              </li>
            </ul>
          </div>

          {/* 4. Cash Flow & Sisa Saldo Bersih */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">
              Cash Flow Summary &amp; Net Balance
            </h4>
            <p>
              Menunjukkan arus kas riil Anda. Formula:{' '}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                Pemasukan - Pengeluaran - Tabungan = Sisa Bersih
              </span>
              . Nilai positif berarti Anda surplus finansial.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
