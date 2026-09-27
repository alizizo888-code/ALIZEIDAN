import React from 'react';
import { X, CheckCircle2, QrCode, Download, Printer, Shield, FileText } from 'lucide-react';
import { WorkOrder } from '../../types';

interface ZatcaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: WorkOrder;
}

export const ZatcaInvoiceModal: React.FC<ZatcaInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  const invoiceNo = order?.zatcaInvoiceNo || 'INV-2025-09082';
  const totalWithVat = order?.totalCost || 310.0;
  const subtotal = totalWithVat / 1.15;
  const vatAmount = totalWithVat - subtotal;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 border border-[#bccac0]/30 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#bccac0]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#0b1c30]">
                  فاتورة ضريبية مبسطة (ZATCA Phase 2)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold">
                  مشفرة ومختومة
                </span>
              </div>
              <p className="text-xs text-[#565e74]">
                مؤسسة أكسجين للصيانة والمقاولات العامة • الرقم الضريبي: 310123456700003
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#565e74] flex items-center justify-center hover:bg-[#e5eeff] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#eff4ff] p-4 rounded-2xl border border-[#bccac0]/20">
          <div>
            <span className="text-[#565e74] block">رقم الفاتورة:</span>
            <span className="font-bold text-[#0b1c30] font-mono">{invoiceNo}</span>
          </div>
          <div>
            <span className="text-[#565e74] block">تاريخ الإصدار:</span>
            <span className="font-bold text-[#0b1c30] font-mono">2025-05-30 10:45:12</span>
          </div>
          <div>
            <span className="text-[#565e74] block">العميل المستفيد:</span>
            <span className="font-bold text-[#0b1c30]">{order?.customerName || 'سعود بن عبدالله التميمي'}</span>
          </div>
          <div>
            <span className="text-[#565e74] block">المدينة والحي:</span>
            <span className="font-bold text-[#0b1c30]">{order?.district || 'حي النرجس'} - {order?.city || 'الرياض'}</span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-[#bccac0]/25 rounded-2xl overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#eff4ff] border-b border-[#bccac0]/20 text-[#565e74]">
              <tr>
                <th className="p-3">البند / الخدمة الهندسية</th>
                <th className="p-3">الكمية</th>
                <th className="p-3">سعر الوحدة</th>
                <th className="p-3">ضريبة القيمة المضافة (15%)</th>
                <th className="p-3">الإجمالي شامل الضريبة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]/15">
              <tr>
                <td className="p-3">
                  <div className="font-bold text-[#0b1c30]">{order?.serviceTitle || 'غسيل وصيانة تكييف اسبليت'}</div>
                  <div className="text-[11px] text-[#565e74]">فحص ضغوط الفريون بمقياس الديجيتال وضمان 30 يوماً</div>
                </td>
                <td className="p-3 font-mono">1</td>
                <td className="p-3 font-mono">{subtotal.toFixed(2)} ر.س</td>
                <td className="p-3 font-mono">{vatAmount.toFixed(2)} ر.س</td>
                <td className="p-3 font-mono font-bold text-[#006948]">{totalWithVat.toFixed(2)} ر.س</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cryptographic QR Code & Hash Block */}
        <div className="bg-[#eff4ff] p-5 rounded-2xl border border-[#bccac0]/25 flex flex-col sm:flex-row items-center gap-6">
          {/* Simulated Real TLV QR Code Container */}
          <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-md border border-[#bccac0]/30 shrink-0 flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <QrCode className="w-24 h-24 text-[#006948]" />
              <span className="text-[9px] font-mono text-[#006948] font-bold">ZATCA Compliant</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#006948] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>الختم الرقمي المشفر (ECDSA Cryptographic Stamp)</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-[#565e74] break-all bg-white p-2.5 rounded-xl border border-[#bccac0]/20">
              <p>UUID: 7f3b89e2-9a01-44cd-9f20-b88e1a742051</p>
              <p>HASH: 2c5a89f9e31d0b7a84e2098d6f1a8e9b4c7...f81a</p>
              <p>ZATCA STATUS: REPORTED_CLEARED_AUTOMATICALLY</p>
            </div>
            <p className="text-[11px] text-[#565e74]">
              تم إرسال الفاتورة إلكترونياً وتوثيقها في منصة «فاتورة» التابعة لهيئة الزكاة والضريبة والجمارك.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-3 rounded-full bg-[#006948] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#00855d] cursor-pointer shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة الرسمية</span>
          </button>

          <button
            onClick={() => {
              alert('جاري تنزيل ملف الفاتورة بصيغة PDF مع الختم الرقمي...');
            }}
            className="px-6 py-3 rounded-full bg-[#eff4ff] text-[#0b1c30] text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-[#e5eeff] border border-[#bccac0]/25 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
