import React, { useState } from 'react';
import {
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Battery,
  Gauge,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Clock,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { WorkOrder, TechnicianTelemetry } from '../../types';

interface OperationsHubViewProps {
  orders: WorkOrder[];
  techs: TechnicianTelemetry[];
  onResolveDispute: (orderId: string, action: 'release_to_tech' | 'refund_to_customer') => void;
  onOpenZatcaModal: () => void;
  onBackToHome?: () => void;
}

export const OperationsHubView: React.FC<OperationsHubViewProps> = ({
  orders,
  techs,
  onResolveDispute,
  onOpenZatcaModal,
  onBackToHome,
}) => {
  const [selectedCity, setSelectedCity] = useState<'all' | 'الرياض' | 'جدة' | 'مكة المكرمة'>('all');
  const [selectedTech, setSelectedTech] = useState<TechnicianTelemetry>(techs[0]);
  const [autoDispatchLoading, setAutoDispatchLoading] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>('wo-7');

  const filteredTechs = techs.filter(
    (t) => selectedCity === 'all' || t.city === selectedCity
  );

  const pendingOrders = orders.filter(
    (o) => o.status === 'bidding' || o.status === 'dispatched'
  );

  const disputeOrder = orders.find((o) => o.id === selectedDisputeId || o.status === 'disputed') || orders[orders.length - 1];

  const handleAutoAssign = (orderNo: string) => {
    setAutoDispatchLoading(true);
    setTimeout(() => {
      setAutoDispatchLoading(false);
      alert(
        `خوارزمية SmartLoad: تم تعيين المهمة ${orderNo} تلقائياً للفني الأقرب والأعلى تقييماً (${selectedTech.technicianName}) مع توفر قطع الغيار في فان الخدمة.`
      );
    }, 1100);
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#006948] text-white flex items-center justify-center shadow-md">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
                غرفة العمليات المركزية والتحكم في الأسطول (Smart Fleet Command)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold">
                Retool / Supabase Realtime
              </span>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5">
              متابعة 86 سيارة صيانة ذكية متصلة • الرياض • جدة • مكة المكرمة • إشراف م. علي طلعت زيدان
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006948] text-xs font-bold transition-colors cursor-pointer border border-[#bccac0]/25"
            >
              <span>← الرئيسية</span>
            </button>
          )}

          {/* City Filter Pills */}
          <div className="flex items-center gap-2 bg-[#eff4ff] p-1.5 rounded-full border border-[#bccac0]/30 text-xs font-bold">
          <button
            onClick={() => setSelectedCity('all')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              selectedCity === 'all'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            كافة المدن ({techs.length})
          </button>
          <button
            onClick={() => setSelectedCity('الرياض')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              selectedCity === 'الرياض'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            الرياض (4)
          </button>
          <button
            onClick={() => setSelectedCity('جدة')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              selectedCity === 'جدة'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            جدة (1)
          </button>
          <button
            onClick={() => setSelectedCity('مكة المكرمة')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              selectedCity === 'مكة المكرمة'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            مكة (1)
          </button>
        </div>
      </div>
    </div>

      {/* Module 1: Live Fleet Command Map & Selected Van Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Full-width Map View (8 cols) */}
        <div className="lg:col-span-8 bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-ping"></span>
              <h2 className="text-base font-bold text-[#0b1c30]">
                خريطة التوجيه اللحظية للأسطول (Live GPS Vehicles)
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#006948] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006948]"></span> متاح (3)
              </span>
              <span className="flex items-center gap-1 text-[#825100] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#825100]"></span> قيد التنفيذ (3)
              </span>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="w-full h-88 rounded-2xl relative overflow-hidden bg-[#e5eeff] shadow-inner flex flex-col justify-between p-4 border border-[#bccac0]/20">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
              alt="Fleet Map"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/25"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-[#ffffff]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-xs font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
                <span>بث الإحداثيات المباشر GPS / Galileo نشط</span>
              </div>
              <div className="bg-[#213145]/90 text-white backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-mono">
                {filteredTechs.length} سيارة ميدانية متصلة
              </div>
            </div>

            {/* Clickable Vehicle Pins */}
            <div className="relative w-full h-full my-4">
              {filteredTechs.map((t, idx) => (
                <button
                  key={t.technicianId}
                  onClick={() => setSelectedTech(t)}
                  style={{
                    top: `${20 + (idx % 3) * 25}%`,
                    right: `${15 + (idx % 4) * 20}%`,
                  }}
                  className={`absolute p-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold cursor-pointer transition-transform hover:scale-110 ${
                    selectedTech.technicianId === t.technicianId
                      ? 'bg-[#006948] text-white ring-4 ring-white'
                      : t.status === 'available'
                      ? 'bg-[#85f8c4] text-[#002114]'
                      : 'bg-[#ffffff] text-[#0b1c30]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t.technicianName}</span>
                </button>
              ))}
            </div>

            {/* Bottom HUD */}
            <div className="relative z-10 bg-[#ffffff]/95 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-xs text-[#565e74] border border-[#bccac0]/30">
              <div className="flex items-center gap-4">
                <span>تحديث الخادم: 12ms</span>
                <span>متوسط استهلاك الوقود: طبيعي</span>
                <span>التغطية: 99.8%</span>
              </div>
              <button
                onClick={() => alert('تم تحديث إشارات جميع سيارات الأسطول في المدن الثلاث.')}
                className="text-[#006948] font-bold hover:underline"
              >
                تحديث التردد
              </button>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Telemetry Details (4 cols) */}
        <div className="lg:col-span-4 bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-[#565e74]">بيانات الفان الميداني</span>
                <h3 className="text-lg font-bold text-[#0b1c30]">{selectedTech.vehicleNo}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedTech.status === 'available'
                    ? 'bg-[#85f8c4] text-[#002114]'
                    : 'bg-[#ffddb8] text-[#825100]'
                }`}
              >
                {selectedTech.status === 'available' ? 'جاهز للتكليف' : 'قيد تنفيذ مهمة'}
              </span>
            </div>

            <div className="space-y-3 bg-[#eff4ff] p-4 rounded-2xl border border-[#bccac0]/20 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-[#565e74]">الكابتن المسؤول:</span>
                <span className="font-bold text-[#0b1c30]">{selectedTech.technicianName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">المنطقة والحي:</span>
                <span className="font-bold text-[#0b1c30]">
                  {selectedTech.district} - {selectedTech.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">سرعة المركبة الحالية:</span>
                <span className="font-bold text-[#0b1c30] font-mono">{selectedTech.speed} كم/س</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#565e74]">مستوى بطارية الأجهزة:</span>
                <span className="font-bold text-[#006948] font-mono flex items-center gap-1">
                  <Battery className="w-4 h-4" />
                  {selectedTech.batteryLevel}%
                </span>
              </div>
            </div>

            {/* Van Realtime Stock Summary */}
            <h4 className="text-xs font-bold text-[#0b1c30] mb-2">
              قطع الغيار والأسطوانات المحمولة بالسيارة:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                <span className="text-[#565e74] block">فريون R410A:</span>
                <span className="font-bold text-[#006948] font-mono">
                  {selectedTech.inventory.freonR410A_cylinders} أسطوانات
                </span>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                <span className="text-[#565e74] block">مكثفات 45+5uF:</span>
                <span className="font-bold text-[#006948] font-mono">
                  {selectedTech.inventory.capacitors_45_5uF} قطع
                </span>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                <span className="text-[#565e74] block">مواسير نحاس:</span>
                <span className="font-bold text-[#006948] font-mono">
                  {selectedTech.inventory.copperCoils_meters} متر
                </span>
              </div>
              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                <span className="text-[#565e74] block">محركات مراوح:</span>
                <span className="font-bold text-[#006948] font-mono">
                  {selectedTech.inventory.fanMotors} محركات
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <button
              onClick={() => alert(`تم إرسال إشعار توجيه مباشر إلى ${selectedTech.technicianName}`)}
              className="flex-1 py-2.5 rounded-full bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] cursor-pointer shadow-sm"
            >
              إرسال توجيه فوري
            </button>
            <button
              onClick={() => alert('فتح خط اتصال لاسلكي مباشر مع الفني')}
              className="px-4 py-2.5 rounded-full bg-[#eff4ff] text-[#0b1c30] text-xs font-bold hover:bg-[#e5eeff] cursor-pointer border border-[#bccac0]/20"
            >
              لاسلكي
            </button>
          </div>
        </div>
      </div>

      {/* Module 2: SmartLoad Dispatch Matrix */}
      <div className="bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#006948]" />
              <h2 className="text-xl font-bold text-[#0b1c30]">
                مصفوفة التوزيع الذكي للطلبات (SmartLoad Dispatch Matrix)
              </h2>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5">
              خوارزمية مطابقة تعتمد على القرب الجغرافي، تقييم الفني، وتوفر القطع المطلوبة بالمركبة
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#006948] text-xs font-bold border border-[#bccac0]/20">
            {pendingOrders.length} طلبات بانتظار التعيين أو القبول
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-[#bccac0]/20 text-[#565e74]">
                <th className="pb-3 px-3">رقم الطلب</th>
                <th className="pb-3 px-3">العميل والموقع</th>
                <th className="pb-3 px-3">نوع الخدمة والوصف</th>
                <th className="pb-3 px-3">القيمة التقديرية</th>
                <th className="pb-3 px-3">المرشح الأنسب (Smart Match)</th>
                <th className="pb-3 px-3">إجراء التعيين</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]/15">
              {pendingOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                  <td className="py-4 px-3 font-bold font-mono text-[#006948]">{ord.orderNo}</td>
                  <td className="py-4 px-3">
                    <div className="font-bold text-[#0b1c30]">{ord.customerName}</div>
                    <div className="text-[11px] text-[#565e74]">
                      {ord.district} • {ord.city}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="font-semibold text-[#0b1c30]">{ord.serviceTitle}</span>
                  </td>
                  <td className="py-4 px-3 font-mono font-bold text-[#0b1c30]">
                    {ord.totalCost} ر.س
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5 text-[#006948] font-bold">
                      <Sparkles className="w-4 h-4 text-[#825100]" />
                      <span>فهد الشمري (1.8 كم • تقييم 4.96)</span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <button
                      onClick={() => handleAutoAssign(ord.orderNo)}
                      disabled={autoDispatchLoading}
                      className="px-4 py-2 rounded-full bg-[#006948] text-white font-bold hover:bg-[#00855d] transition-colors cursor-pointer shadow-sm"
                    >
                      {autoDispatchLoading ? 'جاري الربط...' : 'توجيه آلي (Auto-Assign)'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module 3 & 4: Quality & Engineering Audit Bench (Disputes) & Mobile Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quality Audit Bench (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#825100]" />
                <h3 className="text-lg font-bold text-[#0b1c30]">
                  منصة التدقيق الهندسي وفض النزاعات (Audit Bench)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#825100] text-xs font-bold">
                نزاع {disputeOrder.orderNo}
              </span>
            </div>

            <p className="text-xs text-[#565e74] mb-4">
              مقارنة توثيق الفحص الميداني: صور قبل وبعد الصيانة وبيانات المانيفولد لحسم الضمان المعلق
            </p>

            {/* Before and After Side by Side */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#ba1a1a]">صورة اعتراض العميل (قبل)</span>
                <div className="w-full h-32 rounded-xl overflow-hidden bg-black/10 border border-[#bccac0]/20">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
                    alt="صورة قبل"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#006948]">صورة تسليم الفني (بعد)</span>
                <div className="w-full h-32 rounded-xl overflow-hidden bg-black/10 border border-[#bccac0]/20">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                    alt="صورة بعد"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Dispute Summary Box */}
            <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#bccac0]/20 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-[#0b1c30]">المبلغ المحتجز في الضمان:</span>
                <span className="text-[#825100] font-mono">{disputeOrder.totalCost} ر.س</span>
              </div>
              <p className="text-[#565e74] leading-relaxed">
                موضوع النزاع: {disputeOrder.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onResolveDispute(disputeOrder.id, 'release_to_tech');
                alert(
                  'قرار تحكيمي: تم اعتماد صحة الأعمال الهندسية وتحرير مستحقات الفني من الضمان وإشعار العميل برسالة SMS.'
                );
              }}
              className="py-3 rounded-full bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] cursor-pointer shadow-sm transition-all"
            >
              تحرير المبلغ للفني (إثبات الجودة)
            </button>
            <button
              onClick={() => {
                onResolveDispute(disputeOrder.id, 'refund_to_customer');
                alert(
                  'قرار تحكيمي: تم قبول اعتراض العميل وإعادة مبلغ الصيانة كاملاً لمحفظته بضمان أكسجين الذهبي.'
                );
              }}
              className="py-3 rounded-full bg-[#eff4ff] text-[#ba1a1a] text-xs font-bold hover:bg-[#ffdad6] border border-[#bccac0]/25 cursor-pointer transition-all"
            >
              إرجاع المبلغ للعميل (ضمان أكسجين)
            </button>
          </div>
        </div>

        {/* Mobile Inventory & Stock Ledger (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#006948]" />
                <h3 className="text-lg font-bold text-[#0b1c30]">سجل مخزون الشاحنات والفانات</h3>
              </div>
              <button
                onClick={() => alert('تم إرسال أمر إعادة تموين المستودع الرئيسي.')}
                className="text-xs text-[#006948] font-bold hover:underline"
              >
                + طلب تموين
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <div>
                  <span className="font-bold text-[#0b1c30] block">
                    أسطوانات غاز التبريد R410A (أكسجين)
                  </span>
                  <span className="text-[#565e74]">المتوفر في جميع الفانات: 14 أسطوانة</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#85f8c4] text-[#002114] font-bold font-mono">
                  آمن
                </span>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <div>
                  <span className="font-bold text-[#0b1c30] block">
                    مكثفات 45+5 uF (ضمان سنتين)
                  </span>
                  <span className="text-[#565e74]">المتوفر: 22 قطعة • استهلاك اليوم: 6</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#85f8c4] text-[#002114] font-bold font-mono">
                  آمن
                </span>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <div>
                  <span className="font-bold text-[#0b1c30] block">
                    لفات أنابيب نحاس كوري 5/8 و 3/8
                  </span>
                  <span className="text-[#565e74]">المتبقي: 45 متراً فقط</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#ffddb8] text-[#825100] font-bold font-mono">
                  منخفض
                </span>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <div>
                  <span className="font-bold text-[#0b1c30] block">
                    محركات مراوح Fan Motors 40W
                  </span>
                  <span className="text-[#565e74]">المتوفر: 8 قطع موزعة</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#85f8c4] text-[#002114] font-bold font-mono">
                  آمن
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#bccac0]/20 flex items-center justify-between text-xs text-[#565e74]">
            <span>التكامل: باركود المخزن المركزي (سابر / ZATCA)</span>
            <button
              onClick={onOpenZatcaModal}
              className="text-[#006948] font-bold hover:underline"
            >
              عرض سجل المطابقة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
