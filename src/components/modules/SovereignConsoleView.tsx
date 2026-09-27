import React, { useState } from 'react';
import {
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  PhoneCall,
  Send,
  Fingerprint,
  Sliders,
  DollarSign,
  TrendingUp,
  MapPin,
  Check,
  X,
  Volume2,
} from 'lucide-react';
import {
  PlatformSwitches,
  WorkOrder,
  TechnicianTelemetry,
  TimeLockTransaction,
  ChatMessage,
} from '../../types';

interface SovereignConsoleViewProps {
  switches: PlatformSwitches;
  toggleSwitch: (key: keyof PlatformSwitches) => void;
  platformCommission: number;
  adjustCommission: (delta: number) => void;
  orders: WorkOrder[];
  techs: TechnicianTelemetry[];
  timeLocks: TimeLockTransaction[];
  chatMessages: ChatMessage[];
  onAddChatMessage: (msg: Omit<ChatMessage, 'id' | 'time'>) => void;
  onApproveTimeLock: (id: string) => void;
  onResolveDispute: (orderId: string, action: 'release_to_tech' | 'refund_to_customer') => void;
  onOpenThreeWayCall: () => void;
  onOpenZatcaModal: () => void;
  onBackToHome?: () => void;
}

export const SovereignConsoleView: React.FC<SovereignConsoleViewProps> = ({
  switches,
  toggleSwitch,
  platformCommission,
  adjustCommission,
  orders,
  techs,
  timeLocks,
  chatMessages,
  onAddChatMessage,
  onApproveTimeLock,
  onResolveDispute,
  onOpenThreeWayCall,
  onOpenZatcaModal,
  onBackToHome,
}) => {
  // Key Visibility Toggle
  const [showKey, setShowKey] = useState(false);
  const [sovereignKeyInput, setSovereignKeyInput] = useState('');
  const [isBiometricVerified, setIsBiometricVerified] = useState(true);

  // Intervention message
  const [interventionText, setInterventionText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filter for fleet radar map
  const [mapFilter, setMapFilter] = useState<'all' | 'الرياض' | 'جدة' | 'مكة'>('all');

  const pendingTimeLock = timeLocks.find((t) => t.status === 'locked') || timeLocks[0];
  const disputeOrder = orders.find((o) => o.status === 'disputed') || orders[orders.length - 1];

  const handleSendIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interventionText.trim()) return;

    onAddChatMessage({
      senderType: 'sovereign_owner',
      senderName: 'المهندس علي طلعت زيدان (المالك السيادي)',
      text: interventionText,
      isIntervention: true,
    });
    setInterventionText('');
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16 animate-fade-in">
      {/* Sovereign Identity & Top Cryptographic Badge (Matches Screenshot 1) */}
      <section className="relative overflow-hidden rounded-3xl bg-[#ffffff] p-6 lg:p-8 shadow-sm border border-[#bccac0]/25">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#006948]/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#825100]/5 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#006948] to-[#00855d] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#ffffff] rounded-[14px] flex items-center justify-center overflow-hidden">
                  <Shield className="w-10 h-10 text-[#006948]" />
                </div>
              </div>
              <span className="absolute -bottom-1 -left-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006948] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#006948]"></span>
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#00855d] text-white px-3 py-0.5 rounded-full text-xs font-bold">
                  الاعتماد السيادي الشامل
                </span>
                <span className="bg-[#ffddb8] text-[#825100] px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>صمام أمان زمني نشط (Time-Lock)</span>
                </span>
                <span className="bg-[#dce9ff] text-[#3d4a42] px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                  تشفير AES-256
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0b1c30] tracking-tight m-0">
                المهندس علي طلعت زيدان
              </h1>
              <p className="text-xs sm:text-sm text-[#3d4a42] m-0">
                المالك السيادي والمفوض العام • مؤسسة أكسجين للصيانة والمقاولات العامة (سجل تجاري:
                1010789512)
              </p>
            </div>
          </div>

          {/* Quick Auth & Key Display */}
          <div className="w-full xl:w-auto flex flex-wrap items-center gap-2 bg-[#eff4ff] p-2 rounded-2xl border border-[#bccac0]/25">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#006948] text-xs font-bold transition-colors cursor-pointer border border-[#bccac0]/20 shadow-xs"
              >
                <span>← العودة للرئيسية</span>
              </button>
            )}

            <div className="flex flex-col px-3.5 py-1.5 bg-[#ffffff] rounded-xl shadow-sm border border-[#bccac0]/20">
              <span className="text-[11px] text-[#565e74]">رقم التواصل الموثق</span>
              <span className="text-sm font-bold text-[#0b1c30] tracking-wider font-mono">
                0549423050
              </span>
            </div>

            <div className="flex flex-col px-3.5 py-1.5 bg-[#ffffff] rounded-xl shadow-sm border border-[#bccac0]/20">
              <span className="text-[11px] text-[#565e74]">البريد السيادي المعتمد</span>
              <span className="text-sm font-bold text-[#0b1c30] tracking-wider font-mono">
                alizizo888@gmail.com
              </span>
            </div>

            <div className="flex flex-col px-3.5 py-1.5 bg-[#006948] text-white rounded-xl shadow-sm">
              <span className="text-[11px] text-white/80">المفتاح السيادي (Key)</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono tracking-widest">
                  {showKey ? '789512364' : '•••••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-white hover:opacity-80 p-0.5 cursor-pointer"
                  title={showKey ? 'إخفاء الرمز' : 'إظهار الرمز'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 bg-[#ffffff] rounded-2xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#565e74]">إجمالي الإيراد الميداني</span>
            <div className="w-9 h-9 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1c30] font-mono tracking-tight">
              184,920
            </span>
            <span className="text-sm text-[#006948] font-bold">ر.س</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#565e74] border-t border-[#bccac0]/15 pt-2">
            <span className="text-[#006948] font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.8% اليوم
            </span>
            <span className="font-mono">حصة المنصة: {platformCommission}%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-[#ffffff] rounded-2xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#565e74]">فواتير ZATCA المرحلة 2</span>
            <div className="w-9 h-9 rounded-xl bg-[#ffddb8]/50 text-[#825100] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1c30] font-mono tracking-tight">1,429</span>
            <span className="text-xs text-[#825100] font-bold">مشفرة ومختومة</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#565e74] border-t border-[#bccac0]/15 pt-2">
            <span className="text-[#006948] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> امتثال 100%
            </span>
            <span>ضريبة: 15%</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-[#ffffff] rounded-2xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#565e74]">الأسطول النشط بالرادار</span>
            <div className="w-9 h-9 rounded-xl bg-[#dae2fd] text-[#565e74] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1c30] font-mono tracking-tight">86</span>
            <span className="text-xs text-[#565e74] font-semibold">فني أكسجين معتمد</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#565e74] border-t border-[#bccac0]/15 pt-2">
            <span>الرياض: 48 • جدة: 26 • مكة: 12</span>
            <span className="text-[#006948] font-bold">جاهزية 94%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-[#ffffff] rounded-2xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#565e74]">أوامر العمل الجارية</span>
            <div className="w-9 h-9 rounded-xl bg-[#dce9ff] text-[#006948] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0b1c30] font-mono tracking-tight">63</span>
            <span className="text-xs text-[#006948] font-bold">قيد التنفيذ الآن</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#565e74] border-t border-[#bccac0]/15 pt-2">
            <span>32 تكييف • 19 سباكة • 12 كهرباء</span>
            <span className="text-[#825100] font-bold">3 نزاعات مؤمنة</span>
          </div>
        </div>
      </section>

      {/* Sovereign Switchboard */}
      <section className="bg-[#ffffff] rounded-3xl p-6 lg:p-8 shadow-sm border border-[#bccac0]/25">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006948] text-white flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0b1c30] m-0">
                مركز التحكم السيادي الفوري (Sovereign Switchboard)
              </h2>
              <p className="text-xs text-[#565e74] m-0">
                تفعيل وتعطيل فوري لكافة الخدمات، بوابات الدفع، والوظائف دون الحاجة لإعادة نشر الكود
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#eff4ff] px-3.5 py-1.5 rounded-full border border-[#bccac0]/25">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-pulse"></span>
            <span className="text-xs font-mono text-[#0b1c30] font-bold">
              استجابة البنية التحتية: 14ms
            </span>
          </div>
        </div>

        {/* 8 Toggle Items (Matches Screenshot 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Toggle 1: Apple Pay & Mada */}
          <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
            <div>
              <span className="text-sm font-bold text-[#0b1c30] block">بوابة Apple Pay و Mada</span>
              <span className="text-xs text-[#565e74]">قبول الدفع الرقمي اللحظي</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('paymentMadaApplePay')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.paymentMadaApplePay ? 'bg-[#006948]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.paymentMadaApplePay ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 2: HVAC */}
          <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
            <div>
              <span className="text-sm font-bold text-[#0b1c30] block">خدمات صيانة التكييف HVAC</span>
              <span className="text-xs text-[#565e74]">طلب مركزي وسبليت فوري</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('hvacServices')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.hvacServices ? 'bg-[#006948]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.hvacServices ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 3: Plumbing */}
          <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
            <div>
              <span className="text-sm font-bold text-[#0b1c30] block">خدمات السباكة والشبكات</span>
              <span className="text-xs text-[#565e74]">كشف التسربات وتأسيس صحي</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('plumbingServices')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.plumbingServices ? 'bg-[#006948]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.plumbingServices ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 4: Electrical */}
          <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
            <div>
              <span className="text-sm font-bold text-[#0b1c30] block">الكهرباء والطاقة الذكية</span>
              <span className="text-xs text-[#565e74]">لوحات التوزيع والأحمال</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('electricalServices')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.electricalServices ? 'bg-[#006948]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.electricalServices ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 5: Technician Registration */}
          <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
            <div>
              <span className="text-sm font-bold text-[#0b1c30] block">تسجيل فنيين جدد</span>
              <span className="text-xs text-[#565e74]">استقبال اعتمادات مهنية</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('technicianRegistration')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.technicianRegistration ? 'bg-[#006948]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.technicianRegistration ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 6: STC Bank Payouts */}
          <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
            <div>
              <span className="text-sm font-bold text-[#0b1c30] block">بوابة STC Bank والتمويل</span>
              <span className="text-xs text-[#565e74]">سحب أرباح الفنيين اللحظية</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('stcBankPayouts')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.stcBankPayouts ? 'bg-[#006948]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.stcBankPayouts ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 7: AI Voice Chat */}
          <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
            <div>
              <span className="text-sm font-bold text-[#0b1c30] block">الدردشة الصوتية الذكية (AI)</span>
              <span className="text-xs text-[#565e74]">توليد الردود وتحليل الحوار</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('aiVoiceChat')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.aiVoiceChat ? 'bg-[#006948]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.aiVoiceChat ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>

          {/* Toggle 8: Emergency Kill-Switch */}
          <div className="bg-[#ffdad6]/40 p-4 rounded-2xl flex items-center justify-between border border-[#ba1a1a]/30">
            <div>
              <span className="text-sm font-bold text-[#ba1a1a] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>قفل الصيانة الطارئة</span>
              </span>
              <span className="text-xs text-[#ba1a1a]/80">تجميد مؤقت لعمليات الحجز</span>
            </div>
            <button
              type="button"
              onClick={() => toggleSwitch('emergencyKillSwitch')}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                switches.emergencyKillSwitch ? 'bg-[#ba1a1a]' : 'bg-[#bccac0]'
              }`}
            >
              <span
                className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  switches.emergencyKillSwitch ? 'translate-x-0' : 'translate-x-5'
                }`}
              ></span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Operations & Geo Fleet Tracking (Map + Stream) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Geo-Map Visual Frame (8 cols) */}
        <div className="lg:col-span-8 bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006948]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0b1c30]">خريطة الانتشار الميداني المباشر</h3>
                <p className="text-xs text-[#565e74]">
                  تغطية النطاق السيادي: الرياض، جدة، ومكة المكرمة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-full border border-[#bccac0]/25 text-xs font-bold">
              <button
                onClick={() => setMapFilter('all')}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  mapFilter === 'all' ? 'bg-[#006948] text-white shadow-sm' : 'text-[#565e74]'
                }`}
              >
                الكل (86)
              </button>
              <button
                onClick={() => setMapFilter('الرياض')}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  mapFilter === 'الرياض' ? 'bg-[#006948] text-white shadow-sm' : 'text-[#565e74]'
                }`}
              >
                الرياض (48)
              </button>
              <button
                onClick={() => setMapFilter('جدة')}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  mapFilter === 'جدة' ? 'bg-[#006948] text-white shadow-sm' : 'text-[#565e74]'
                }`}
              >
                جدة (26)
              </button>
              <button
                onClick={() => setMapFilter('مكة')}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  mapFilter === 'مكة' ? 'bg-[#006948] text-white shadow-sm' : 'text-[#565e74]'
                }`}
              >
                مكة (12)
              </button>
            </div>
          </div>

          {/* Geo-Map Frame */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-cover bg-center shadow-inner flex flex-col justify-between p-4 border border-[#bccac0]/20">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
              alt="Map"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-black/25"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-[#ffffff]/90 backdrop-blur-md px-3.5 py-1 rounded-full shadow-sm flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
                <span className="w-2 h-2 rounded-full bg-[#006948] animate-ping"></span>
                <span>بث الإحداثيات المباشر مفعل GPS / Galileo</span>
              </div>
              <div className="bg-[#213145]/85 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono">
                منطقة الرياض الكبرى • حي الملقا والنرجس
              </div>
            </div>

            {/* Technician Pins */}
            <div className="relative w-full h-full my-4">
              <div className="absolute top-1/4 right-1/3 bg-[#006948] text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold animate-bounce">
                <span>فني: م. سمير (تكييف)</span>
              </div>
              <div className="absolute bottom-1/3 left-1/4 bg-[#006948] text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold">
                <span>فني: أحمد ناصر (سباكة)</span>
              </div>
              <div className="absolute top-1/2 left-1/2 bg-[#825100] text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>بلاغ فحص طارئ</span>
              </div>
            </div>

            <div className="relative z-10 bg-[#ffffff]/95 backdrop-blur-md p-3 rounded-xl shadow-md flex items-center justify-between border border-[#bccac0]/30 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[#0b1c30] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006948]"></span> 63 مهمة نشطة
                </div>
                <div className="flex items-center gap-1.5 text-[#0b1c30] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#825100]"></span> 18 فني متاح
                </div>
                <div className="flex items-center gap-1.5 text-[#0b1c30] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#565e74]"></span> 5 قيد الاستراحة
                </div>
              </div>
              <button
                onClick={() => alert('تم تحديث إشارات جميع الفنيين على الرادار المركزي')}
                className="text-[#006948] font-bold hover:underline"
              >
                تحديث الرادار الشامل
              </button>
            </div>
          </div>
        </div>

        {/* Live Central Dispatch Stream (4 cols) */}
        <div className="lg:col-span-4 bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#0b1c30]">حركة الأوامر اللحظية</h3>
            <span className="bg-[#006948]/10 text-[#006948] text-xs px-2.5 py-0.5 rounded-full font-bold">
              مباشر
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px]">
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-[#eff4ff] rounded-2xl flex flex-col gap-1.5 hover:bg-[#e5eeff] transition-colors border border-[#bccac0]/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30]">{ord.serviceTitle}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      ord.status === 'in_progress'
                        ? 'bg-[#006948]/10 text-[#006948]'
                        : ord.status === 'completed'
                        ? 'bg-[#ffffff] text-[#006948] border border-[#006948]/20'
                        : 'bg-[#ffddb8] text-[#825100]'
                    }`}
                  >
                    {ord.status === 'in_progress'
                      ? 'جارِ الفحص'
                      : ord.status === 'completed'
                      ? 'مكتملة ومختومة'
                      : 'بانتظار الموافقة'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#565e74]">
                  <span>العميل: {ord.customerName}</span>
                  <span>الفني: {ord.technicianName || 'قيد الترشيح'}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#565e74] pt-1 border-t border-[#bccac0]/15">
                  <span className="font-mono text-[#825100] font-bold">{ord.totalCost} ر.س</span>
                  <span>{ord.district} • {ord.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Governance, Commission & Escrow Time-Lock */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Commission & Pricing (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-3xl p-6 lg:p-8 shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffddb8]/40 text-[#825100] flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30]">
                    حوكمة الأسعار، العمولات، والمحافظ
                  </h3>
                  <p className="text-xs text-[#565e74]">
                    سياسات التحصيل المالي السيادية لمؤسسة أكسجين
                  </p>
                </div>
              </div>
              <span className="text-xs bg-[#ffddb8] text-[#825100] px-3 py-1 rounded-full font-bold">
                ربط المحفظة المركزية
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Commission Slider */}
              <div className="p-4 bg-[#eff4ff] rounded-2xl flex flex-col justify-between border border-[#bccac0]/20">
                <span className="text-xs font-bold text-[#0b1c30]">
                  نسبة المنصة السيادية المقتطعة
                </span>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-3xl font-black font-mono text-[#006948]">
                    {platformCommission.toFixed(1)}%
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => adjustCommission(-0.5)}
                      className="w-8 h-8 rounded-lg bg-[#ffffff] hover:bg-[#e5eeff] flex items-center justify-center font-bold text-base border border-[#bccac0]/30 cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => adjustCommission(0.5)}
                      className="w-8 h-8 rounded-lg bg-[#ffffff] hover:bg-[#e5eeff] flex items-center justify-center font-bold text-base border border-[#bccac0]/30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="text-[11px] text-[#565e74] mt-2">
                  تُطبق تلقائياً على كل فاتورة فور إغلاقها
                </span>
              </div>

              {/* Loyalty Conversion */}
              <div className="p-4 bg-[#eff4ff] rounded-2xl flex flex-col justify-between border border-[#bccac0]/20">
                <span className="text-xs font-bold text-[#0b1c30]">
                  معامل استبدال نقاط الولاء (مُتقن بلس)
                </span>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-[#0b1c30]">100</span>
                    <span className="text-xs text-[#565e74]">نقطة =</span>
                    <span className="text-2xl font-black font-mono text-[#825100]">5.0</span>
                    <span className="text-xs text-[#825100] font-bold">ر.س</span>
                  </div>
                  <button
                    onClick={() => alert('تم تحديث معادلة النقاط')}
                    className="text-[#006948] text-xs font-bold hover:underline"
                  >
                    تعديل
                  </button>
                </div>
                <span className="text-[11px] text-[#565e74] mt-2">
                  الحد الأقصى للخصم: 25% من الفاتورة
                </span>
              </div>
            </div>

            {/* Annual Subscription Card */}
            <div className="bg-[#eff4ff] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border border-[#bccac0]/20">
              <div className="flex items-center gap-3">
                <Shield className="w-7 h-7 text-[#006948]" />
                <div>
                  <span className="text-sm font-bold text-[#0b1c30] block">
                    باقة «Oxygen Care Plus» السنوية
                  </span>
                  <span className="text-xs text-[#565e74]">
                    عقود الصيانة الوقائية والضمان الذهبي للمجمعات والفلل
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold font-mono text-[#0b1c30]">2,400 ر.س/سنة</span>
                <button
                  onClick={() => alert('تعديل تسعيرة باقة Oxygen Care Plus')}
                  className="bg-[#006948] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#00855d] cursor-pointer shadow-sm"
                >
                  تعديل الباقة
                </button>
              </div>
            </div>
          </div>

          {/* Split Breakdown */}
          <div className="bg-[#eff4ff] p-3 rounded-2xl flex items-center justify-between border border-[#bccac0]/20 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#0b1c30]">توزيع الدورة المالية اللحظية:</span>
              <span className="text-[#006948] font-mono font-bold">
                {(100 - platformCommission - 10).toFixed(1)}% الفني
              </span>
              <span className="text-[#bccac0]">•</span>
              <span className="text-[#825100] font-mono font-bold">
                {platformCommission.toFixed(1)}% المؤسسة
              </span>
              <span className="text-[#bccac0]">•</span>
              <span className="text-[#565e74] font-mono font-bold">10% احتياطي الضمان</span>
            </div>
            <Shield className="w-4 h-4 text-[#006948]" />
          </div>
        </div>

        {/* Time-Lock & High-Value Transfers (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-3xl p-6 lg:p-8 shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffdad6]/40 text-[#ba1a1a] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30]">
                    صمام الأمان الزمني (Time-Lock)
                  </h3>
                  <p className="text-xs text-[#565e74]">
                    حماية التحويلات الكبرى التي تتجاوز 10,000 ر.س
                  </p>
                </div>
              </div>
              <span className="bg-[#ffdad6] text-[#ba1a1a] text-xs px-2.5 py-0.5 rounded-full font-bold">
                صلاحية المالك فقط
              </span>
            </div>

            <div className="bg-[#eff4ff] p-5 rounded-2xl space-y-3 mb-4 border border-[#bccac0]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0b1c30]">{pendingTimeLock.title}</span>
                <span className="text-[11px] text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded font-mono font-bold">
                  محجوز: 04:18:22
                </span>
              </div>

              <p className="text-xs text-[#565e74] leading-relaxed">
                طلب تحويل بنكي بقيمة{' '}
                <strong className="text-[#0b1c30] font-mono font-bold">
                  {pendingTimeLock.amount.toLocaleString()} ر.س
                </strong>{' '}
                لصالح {pendingTimeLock.recipient}. {pendingTimeLock.purpose}.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onApproveTimeLock(pendingTimeLock.id);
                    alert(
                      'تمت المصادقة السيادية الفورية بنجاح! تم اعتماد التحويل المالي بالتوقيع الرقمي للمهندس علي طلعت زيدان.'
                    );
                  }}
                  className="flex-1 h-10 rounded-full bg-[#006948] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#00855d] cursor-pointer shadow-sm transition-all"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>
                    {pendingTimeLock.status === 'approved_by_owner'
                      ? 'تم اعتماد التحويل السيادي ✓'
                      : 'المصادقة السيادية الفورية'}
                  </span>
                </button>
                <button
                  onClick={() => alert('تم إلغاء طلب التحويل وإعادته للمراجعة المالية.')}
                  className="h-10 px-4 rounded-full bg-[#ffffff] text-[#ba1a1a] hover:bg-[#ffdad6] text-xs font-bold border border-[#bccac0]/20 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center gap-2 text-xs text-[#565e74] border border-[#bccac0]/20">
            <Shield className="w-5 h-5 text-[#006948] shrink-0" />
            <span>بروتوكول الأمان: يتطلب أي سحب لرأس المال مفتاح التشفير 789512364 مع بصمة الجهاز المعتمد.</span>
          </div>
        </div>
      </section>

      {/* Real-Time Central Interceptor & Voice Bot Relay + Disputes */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Relay (8 cols) */}
        <div className="lg:col-span-8 bg-[#ffffff] rounded-3xl p-6 lg:p-8 shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30]">
                    نظام التنصت والتوجيه المركزي (Live Audio & Chat Relay)
                  </h3>
                  <p className="text-xs text-[#565e74]">
                    مراقبة غرف المحادثة الحية بين العملاء والفنيين مع تحليل النبرة والذكاء الاصطناعي
                  </p>
                </div>
              </div>

              <span className="text-xs text-[#006948] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span> 14 محادثة
                نشطة الآن
              </span>
            </div>

            {/* Chat Relay Stream */}
            <div className="bg-[#eff4ff] rounded-2xl p-4 flex flex-col gap-3 min-h-[260px] max-h-[300px] overflow-y-auto border border-[#bccac0]/20">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    msg.senderType === 'ai_assistant'
                      ? 'self-end flex-row-reverse'
                      : msg.senderType === 'sovereign_owner'
                      ? 'self-center w-full max-w-[95%]'
                      : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.senderType === 'customer'
                        ? 'bg-[#ffffff] text-[#0b1c30] border border-[#bccac0]/30'
                        : msg.senderType === 'ai_assistant'
                        ? 'bg-[#006948] text-white'
                        : msg.senderType === 'sovereign_owner'
                        ? 'bg-[#213145] text-white'
                        : 'bg-[#ffddb8] text-[#825100]'
                    }`}
                  >
                    {msg.senderType === 'customer'
                      ? 'ع'
                      : msg.senderType === 'ai_assistant'
                      ? 'AI'
                      : msg.senderType === 'sovereign_owner'
                      ? '👑'
                      : 'ف'}
                  </div>

                  <div
                    className={`p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                      msg.senderType === 'customer'
                        ? 'bg-[#ffffff] text-[#0b1c30] border border-[#bccac0]/20'
                        : msg.senderType === 'ai_assistant'
                        ? 'bg-[#006948]/10 text-[#0b1c30]'
                        : msg.senderType === 'sovereign_owner'
                        ? 'bg-[#213145] text-white w-full'
                        : 'bg-[#ffffff] text-[#0b1c30] border border-[#bccac0]/20'
                    }`}
                  >
                    <span className="block font-bold mb-0.5 text-[11px] opacity-80">
                      {msg.senderName}
                    </span>
                    <p>{msg.text}</p>

                    {msg.audioDuration && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-black/10">
                        <button
                          type="button"
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-6 h-6 rounded-full bg-[#006948] text-white flex items-center justify-center cursor-pointer"
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3 ml-0.5" />
                          )}
                        </button>
                        <span className="text-[11px] font-mono">
                          {isPlayingAudio ? 'جاري التشغيل...' : `رسالة صوتية (${msg.audioDuration})`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Intervention Bar */}
          <form
            onSubmit={handleSendIntervention}
            className="mt-4 pt-2 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={interventionText}
                onChange={(e) => setInterventionText(e.target.value)}
                placeholder="التدخل السيادي المباشر في المحادثة بصفتك المالك..."
                className="w-full h-11 px-4 pl-10 rounded-full bg-[#eff4ff] text-[#0b1c30] text-xs sm:text-sm border border-transparent focus:border-[#006948] outline-none"
              />
              <button
                type="submit"
                className="absolute left-3 top-2.5 text-[#565e74] hover:text-[#006948]"
              >
                <Send className="w-5 h-5 rtl:-rotate-90" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenThreeWayCall}
              className="w-full sm:w-auto h-11 px-5 rounded-full bg-[#006948] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#00855d] cursor-pointer shadow-sm transition-all whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>الاتصال الفوري بالطرفين</span>
            </button>
          </form>
        </div>

        {/* Dispute Arbitration & Escrow (4 cols) */}
        <div className="lg:col-span-4 bg-[#ffffff] rounded-3xl p-6 lg:p-8 shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffddb8]/40 text-[#825100] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30]">مركز التحكيم وفض النزاعات</h3>
                  <p className="text-xs text-[#565e74]">حجز أموال الضمان والمقارنة الميدانية</p>
                </div>
              </div>
              <span className="bg-[#ffddb8] text-[#825100] text-xs px-2.5 py-0.5 rounded-full font-bold">
                نزاع #108
              </span>
            </div>

            {/* Before and After Comparison Photos */}
            <div className="space-y-2 mb-4">
              <span className="text-xs text-[#565e74] block font-bold">
                التوثيق الفوتوغرافي الميداني الإلزامي:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#ba1a1a] font-bold flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> قبل الصيانة
                  </span>
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/10 border border-[#bccac0]/20">
                    <img
                      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80"
                      alt="قبل الصيانة"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-[#006948] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> بعد المعالجة
                  </span>
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/10 border border-[#bccac0]/20">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"
                      alt="بعد الصيانة"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#eff4ff] rounded-xl mb-3 text-xs border border-[#bccac0]/20">
              <div className="flex items-center justify-between font-bold mb-1">
                <span>مبلغ الضمان المعلق بالمحفظة:</span>
                <span className="text-[#825100] font-mono">1,150 ر.س</span>
              </div>
              <p className="text-[#565e74] leading-relaxed">
                العميل يعترض على تسعيرة القطعة البديلة. تقرير الفاحص الميداني يؤكد مطابقة القطعة
                الأصلية لشهادة سابر.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onResolveDispute(disputeOrder.id, 'release_to_tech');
                alert('تم تحرير مبلغ الضمان إلى محفظة الفني مع تسجيل قرار تحكيمي معتمد.');
              }}
              className="h-10 rounded-full bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] cursor-pointer transition-all shadow-sm"
            >
              تحرير المبلغ للفني
            </button>
            <button
              onClick={() => {
                onResolveDispute(disputeOrder.id, 'refund_to_customer');
                alert('تم إرجاع المبلغ إلى محفظة العميل بضمان أكسجين الذهبي.');
              }}
              className="h-10 rounded-full bg-[#eff4ff] text-[#ba1a1a] hover:bg-[#ffdad6] text-xs font-bold border border-[#bccac0]/20 cursor-pointer transition-all"
            >
              إرجاع المبلغ للعميل
            </button>
          </div>
        </div>
      </section>

      {/* Platform Master Status & Footer Assurance */}
      <footer className="bg-[#eff4ff] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#565e74] border border-[#bccac0]/20">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#006948]" />
          <div>
            <span className="font-bold text-[#0b1c30] block">
              بوابة الإدارة المركزية والتحكم السيادي • مُتقن للصيانة
            </span>
            <span>كافة الحقوق والامتيازات محفوظة لمؤسسة أكسجين للصيانة والمقاولات العامة 2025</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[#006948] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#006948]"></span> تشفير تام E2EE
          </span>
          <span>
            مفتاح الجلسة: <strong className="font-mono text-[#0b1c30]">OX-789512-V8</strong>
          </span>
          <span className="bg-[#ffffff] px-3 py-1 rounded-full font-mono text-[#0b1c30] border border-[#bccac0]/20">
            v4.8 Sovereign Enterprise
          </span>
        </div>
      </footer>
    </div>
  );
};
