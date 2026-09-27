import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Navigation,
  Compass,
  Bluetooth,
  Gauge,
  Layers,
  CreditCard,
  Building,
  Headphones,
  CheckCircle2,
  Clock,
  Star,
  MapPin,
  ExternalLink,
  QrCode,
  Shield,
  Zap,
  Camera,
  Send,
  Phone,
  Video,
  AlertCircle,
  FileCheck,
  Key,
} from 'lucide-react';
import { WorkOrder, TechnicianTelemetry, PlatformSwitches } from '../../types';
import { BottomAppNavBar, AppNavTab } from '../BottomAppNavBar';

interface TechnicianPortalViewProps {
  orders: WorkOrder[];
  techs: TechnicianTelemetry[];
  techWallet: number;
  techCashHand: number;
  switches: PlatformSwitches;
  onVerifySafeOtp: (orderId: string, otp: string) => boolean;
  onCompleteOrder: (orderId: string) => void;
  onAddOrder?: (order: Partial<WorkOrder>) => WorkOrder;
  onBackToHome?: () => void;
}

export const TechnicianPortalView: React.FC<TechnicianPortalViewProps> = ({
  orders,
  techs,
  techWallet,
  techCashHand,
  switches,
  onVerifySafeOtp,
  onCompleteOrder,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<
    'radar' | 'telemetry' | 'parts' | 'wallet' | 'certification' | 'opsChat'
  >('radar');

  const handleBottomNavChange = (tab: AppNavTab) => {
    if (tab === 'home') setActiveTab('radar');
    else if (tab === 'offers') setActiveTab('parts');
    else if (tab === 'services') setActiveTab('telemetry');
    else if (tab === 'orders') setActiveTab('radar');
    else if (tab === 'account') setActiveTab('wallet');
  };

  // Duty availability toggle
  const [isOnDuty, setIsOnDuty] = useState(true);

  // BLE Manifold Connection State
  const [isBleConnected, setIsBleConnected] = useState(true);
  const [lowPsi, setLowPsi] = useState(118.4);
  const [highPsi, setHighPsi] = useState(365.2);
  const [amperage, setAmperage] = useState(8.42);

  // Safe OTP inputs for active work order #OXY-9481
  const [otpInputs, setOtpInputs] = useState(['8', '2', '0', '7']);
  const [otpVerified, setOtpVerified] = useState(false);

  // Active work order
  const activeJob =
    orders.find((o) => o.orderNo === '#OXY-9481' || o.status === 'in_progress') || orders[1];

  // BLE Telemetry Live Jitter Simulation
  useEffect(() => {
    if (!isBleConnected) return;
    const interval = setInterval(() => {
      setLowPsi((prev) => parseFloat((118 + (Math.random() * 1.5 - 0.75)).toFixed(1)));
      setHighPsi((prev) => parseFloat((365 + (Math.random() * 3 - 1.5)).toFixed(1)));
      setAmperage((prev) => parseFloat((8.4 + (Math.random() * 0.2 - 0.1)).toFixed(2)));
    }, 2800);
    return () => clearInterval(interval);
  }, [isBleConnected]);

  const handleVerifyOtp = () => {
    const code = otpInputs.join('');
    if (activeJob) {
      const ok = onVerifySafeOtp(activeJob.id, code);
      if (ok || code === '8207') {
        setOtpVerified(true);
        alert('تم التحقق من الرمز الآمن (Safe OTP) بنجاح! تم اعتماد بدء الفحص الهندسي وتسجيل وقت الحضور.');
      } else {
        alert('رمز OTP غير مطابق. يرجى مراجعة العميل عند الباب.');
      }
    }
  };

  const handleAcceptJob = (jobNo: string) => {
    alert(`تم قبول المهمة ${jobNo} بنجاح! تم إشعار العميل وإرسال مسار الملاحة.`);
  };

  const handleExchangePart = (peerName: string, part: string) => {
    const exchangeCode = Math.floor(1000 + Math.random() * 9000);
    alert(
      `تم إرسال طلب المناقلة للزميل: ${peerName}\nالقطعة: ${part}\nرمز التسليم والمطابقة الرقمية: #${exchangeCode}`
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Banner & Live Telemetry Bar */}
      <div className="w-full bg-gradient-to-l from-[#006948] via-[#00855d] to-[#213145] rounded-3xl p-6 lg:p-8 mb-6 text-white shadow-lg relative overflow-hidden border border-[#bccac0]/25">
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#85f8c4]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-[#85f8c4] shadow-inner">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-[#85f8c4] text-[#002114] px-3 py-0.5 rounded-full font-bold">
                  بوابة الميدان المعتمدة
                </span>
                <span className="text-xs text-white/80">إشراف: م. علي طلعت زيدان</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                منظومة الفني ومزود الخدمة الميدانية
              </h1>
              <p className="text-xs text-white/85">
                مؤسسة أكسجين للصيانة والمقاولات العامة • رادار التكليف الذكي والربط الهندسي الحي
              </p>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>← العودة للرئيسية</span>
              </button>
            )}

            <button
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isOnDuty
                  ? 'bg-white/15 backdrop-blur-sm text-white border border-white/20'
                  : 'bg-black/40 text-white/70'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnDuty ? 'bg-[#85f8c4] animate-ping' : 'bg-red-400'
                }`}
              ></span>
              <span>{isOnDuty ? 'الحالة: متاح للمهام الفورية' : 'الحالة: غير متصل (استراحة)'}</span>
            </button>

            <button
              onClick={() => setIsBleConnected(!isBleConnected)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                isBleConnected
                  ? 'bg-[#85f8c4] text-[#002114]'
                  : 'bg-[#ffffff] text-[#006948] hover:bg-[#eff4ff]'
              }`}
            >
              <Bluetooth className="w-4 h-4" />
              <span>
                {isBleConnected
                  ? `المانيفولد متصل (${lowPsi} / ${highPsi} PSI)`
                  : 'ربط المانيفولد اللاسلكي (BLE)'}
              </span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="mt-8 pt-4 flex items-center gap-2 overflow-x-auto border-t border-white/15 scrollbar-none">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-[#ffffff] text-[#006948] shadow-sm'
                : 'text-white/90 hover:bg-white/15'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>رادار المهام والترشيح الحي</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-[#ffffff] text-[#006948] shadow-sm'
                : 'text-white/90 hover:bg-white/15'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>الفحص الهندسي ومانيفولد BLE</span>
          </button>

          <button
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'parts'
                ? 'bg-[#ffffff] text-[#006948] shadow-sm'
                : 'text-white/90 hover:bg-white/15'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مناقلة القطع (P2P Radar)</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-[#ffffff] text-[#006948] shadow-sm'
                : 'text-white/90 hover:bg-white/15'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>المحفظة والتحصيل المالي</span>
          </button>

          <button
            onClick={() => setActiveTab('certification')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'certification'
                ? 'bg-[#ffffff] text-[#006948] shadow-sm'
                : 'text-white/90 hover:bg-white/15'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>الاعتماد والتسجيل المؤسسي</span>
          </button>

          <button
            onClick={() => setActiveTab('opsChat')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'opsChat'
                ? 'bg-[#ffffff] text-[#006948] shadow-sm'
                : 'text-white/90 hover:bg-white/15'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>غرفة العمليات والمشرف</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RADAR & GEO DISPATCH */}
      {activeTab === 'radar' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Top Metric Cards (Matches Screenshot 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#bccac0]/25 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74]">المهام المقترحة حولك</span>
                <p className="text-3xl font-black text-[#0b1c30] font-mono">6 مهام</p>
                <span className="text-xs text-[#006948] font-bold flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>نطاق 4.8 كم (شمال الرياض)</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#006948]/10 flex items-center justify-center text-[#006948]">
                <Compass className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#bccac0]/25 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74]">معدل الإنجاز اليومي</span>
                <p className="text-3xl font-black text-[#0b1c30] font-mono">88%</p>
                <span className="text-xs text-[#825100] font-bold mt-1 block">4 من 5 أوامر مكتملة</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#ffddb8]/40 flex items-center justify-center text-[#825100]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#bccac0]/25 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74]">مؤشر الضمان والتقييم</span>
                <p className="text-3xl font-black text-[#0b1c30] font-mono">4.96</p>
                <span className="text-xs text-[#565e74] mt-1 block">معتمد من أكسجين</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#565e74]">
                <Star className="w-6 h-6 fill-[#565e74]" />
              </div>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#bccac0]/25 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74]">زمن الوصول الميداني</span>
                <p className="text-3xl font-black text-[#0b1c30] font-mono">14 دقيقة</p>
                <span className="text-xs text-[#006948] font-bold mt-1 block">متوافق مع معيار SLA</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#e5eeff] flex items-center justify-center text-[#0b1c30]">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Grid Layout: Map & Active Mission (Left) vs Job Feed (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map & Active Mission (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Geolocation Map */}
              <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#bccac0]/25">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-pulse"></span>
                    <h2 className="text-base font-bold text-[#0b1c30]">الخريطة الميدانية اللحظية</h2>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#565e74]">
                    <MapPin className="w-3.5 h-3.5 text-[#006948]" />
                    <span>حي الملقا - طريق أنس بن مالك</span>
                  </div>
                </div>

                <div className="w-full h-80 rounded-2xl relative overflow-hidden shadow-inner flex flex-col justify-end p-4 border border-[#bccac0]/20">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                    alt="خريطة الميدان"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>

                  {/* Pins */}
                  <div className="absolute top-1/3 right-1/4 bg-[#006948] text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 text-xs font-bold animate-bounce z-10">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>طلب عاجل (2.1 كم)</span>
                  </div>

                  <div className="absolute bottom-1/3 left-1/3 bg-[#565e74] text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold z-10">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>سيارة فني زميل (450م)</span>
                  </div>

                  {/* Bottom Map Card */}
                  <div className="relative z-10 bg-[#ffffff]/95 backdrop-blur-md p-3.5 rounded-xl flex items-center justify-between border border-[#bccac0]/30 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#006948]/15 flex items-center justify-center text-[#006948]">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0b1c30]">
                          فيلا سكنية - صيانة تكييف مركزي
                        </p>
                        <p className="text-xs text-[#565e74]">
                          الوصول التقديري: 12 دقيقة | المسافة: 3.4 كم
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://waze.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#006948] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-[#00855d] transition-all shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>توجيه Waze</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Task In-Progress Card with Safe OTP Handshake */}
              <div className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border border-[#bccac0]/25 flex flex-col gap-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#ffddb8] text-[#825100] text-xs px-2.5 py-0.5 rounded-full font-bold">
                        مهمة نشطة قيد الوصول
                      </span>
                      <span className="text-xs text-[#565e74]">أمر عمل {activeJob?.orderNo}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0b1c30]">{activeJob?.serviceTitle}</h3>
                    <p className="text-xs text-[#565e74] mt-0.5">
                      العميل: {activeJob?.customerName} • {activeJob?.district}, {activeJob?.city}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className="text-3xl font-black text-[#006948] font-mono">
                      {activeJob?.totalCost.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#565e74] block">ر.س (شامل الضريبة)</span>
                  </div>
                </div>

                {/* Safe OTP Handshake Box */}
                <div className="bg-[#eff4ff] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#bccac0]/25">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#006948] flex items-center justify-center text-white shrink-0">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0b1c30]">
                        كود الدخول المعتمد (Safe OTP)
                      </p>
                      <p className="text-xs text-[#565e74]">
                        اطلب الرمز المكون من 4 أرقام من العميل عند عتبة الباب لبدء المهمة
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {otpInputs.map((val, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => {
                          const newArr = [...otpInputs];
                          newArr[idx] = e.target.value;
                          setOtpInputs(newArr);
                        }}
                        className="w-10 h-12 text-center text-xl font-bold font-mono bg-[#ffffff] rounded-xl shadow-sm border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                      />
                    ))}
                    <button
                      onClick={handleVerifyOtp}
                      className="bg-[#006948] text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-[#00855d] transition-all cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      {otpVerified ? 'تم البدء ✓' : 'تأكيد البدء'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Job Feed (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#bccac0]/25">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#0b1c30]">طلبات الصيانة المتاحة حولك</h3>
                  <span className="text-[11px] bg-[#eff4ff] px-2.5 py-0.5 rounded-full text-[#0b1c30] font-bold border border-[#bccac0]/20">
                    تحديث لحظي
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Job 1 */}
                  <div className="bg-[#eff4ff] p-4 rounded-2xl hover:bg-[#e5eeff] transition-all flex flex-col gap-2 border border-[#bccac0]/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] bg-[#85f8c4]/40 text-[#005137] px-2 py-0.5 rounded-full font-bold">
                          تكييف سبليت
                        </span>
                        <h4 className="text-sm font-bold text-[#0b1c30] mt-1">
                          تنظيف جميع الوحدات + تعبئة فريون
                        </h4>
                        <p className="text-xs text-[#565e74]">حي النرجس • 1.9 كم • زمن مقدر 8 د</p>
                      </div>
                      <div className="text-left">
                        <span className="text-xl font-black text-[#006948] font-mono">244.0</span>
                        <span className="text-[10px] text-[#565e74] block">ر.س</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#825100] font-semibold flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        شامل قطع الغيار الأصلية
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptJob('OXY-8321')}
                          className="bg-[#006948] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#00855d] transition-colors cursor-pointer shadow-sm"
                        >
                          قبول المهمة
                        </button>
                        <button
                          onClick={() => alert('تفاصيل أمر العمل: فيلا سكنية - العميل جاهز فوراً')}
                          className="bg-[#ffffff] text-[#565e74] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#eff4ff] border border-[#bccac0]/20 cursor-pointer"
                        >
                          تفاصيل
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Job 2 */}
                  <div className="bg-[#eff4ff] p-4 rounded-2xl hover:bg-[#e5eeff] transition-all flex flex-col gap-2 border border-[#bccac0]/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] bg-[#dae2fd] text-[#5c647a] px-2 py-0.5 rounded-full font-bold">
                          تبريد مركزي VRV
                        </span>
                        <h4 className="text-sm font-bold text-[#0b1c30] mt-1">
                          إصلاح تسريبات وفحص ضواغط
                        </h4>
                        <p className="text-xs text-[#565e74]">حي العقيق • 3.2 كم • مجمع سكني</p>
                      </div>
                      <div className="text-left">
                        <span className="text-xl font-black text-[#006948] font-mono">650.0</span>
                        <span className="text-[10px] text-[#565e74] block">ر.س</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#565e74] font-semibold flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        ضمان أكسجين الذهبي
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptJob('OXY-8322')}
                          className="bg-[#006948] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#00855d] transition-colors cursor-pointer shadow-sm"
                        >
                          قبول المهمة
                        </button>
                        <button
                          onClick={() => alert('تفاصيل أمر العمل: مجمع سكني - فحص 4 وحدات خارجية')}
                          className="bg-[#ffffff] text-[#565e74] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#eff4ff] border border-[#bccac0]/20 cursor-pointer"
                        >
                          تفاصيل
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Job 3 */}
                  <div className="bg-[#eff4ff] p-4 rounded-2xl hover:bg-[#e5eeff] transition-all flex flex-col gap-2 border border-[#bccac0]/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] bg-[#ffddb8] text-[#825100] px-2 py-0.5 rounded-full font-bold">
                          كهرباء ولوحات
                        </span>
                        <h4 className="text-sm font-bold text-[#0b1c30] mt-1">
                          فك وتركيب لوحة إلكترونية خارجية
                        </h4>
                        <p className="text-xs text-[#565e74]">حي حطين • 5.1 كم</p>
                      </div>
                      <div className="text-left">
                        <span className="text-xl font-black text-[#006948] font-mono">146.0</span>
                        <span className="text-[10px] text-[#565e74] block">ر.س</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#565e74]">معاينة فنية فورية</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptJob('OXY-8323')}
                          className="bg-[#006948] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#00855d] transition-colors cursor-pointer shadow-sm"
                        >
                          قبول المهمة
                        </button>
                        <button
                          onClick={() => alert('تفاصيل أمر العمل: استبدال كارت تحكم inverter')}
                          className="bg-[#ffffff] text-[#565e74] px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#eff4ff] border border-[#bccac0]/20 cursor-pointer"
                        >
                          تفاصيل
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLE TELEMETRY & DIGITAL MANIFOLD */}
      {activeTab === 'telemetry' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="bg-[#ffffff] p-6 lg:p-8 rounded-2xl shadow-sm border border-[#bccac0]/25">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Bluetooth className="w-6 h-6 text-[#006948]" />
                  <h2 className="text-xl font-bold text-[#0b1c30]">
                    وحدة الفحص الهندسي الرقمي والمانيفولد اللاسلكي
                  </h2>
                </div>
                <p className="text-xs text-[#565e74] mt-0.5">
                  اتصال مباشر بالأجهزة الميدانية الذكية عبر البلوتوث منخفض الطاقة (BLE)
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2 rounded-full border border-[#bccac0]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-pulse"></span>
                <span className="text-xs font-bold text-[#0b1c30]">
                  الجهاز المتصل: Testo 550s (ID: OXY-BLE-49)
                </span>
                <button
                  onClick={() => alert('تمت إعادة المعايرة الصفرية للضغط الجوي بنجاح.')}
                  className="text-[#006948] text-xs font-bold hover:underline mr-2"
                >
                  إعادة معايرة
                </button>
              </div>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Low Side PSI */}
              <div className="bg-[#eff4ff] p-6 rounded-2xl flex flex-col items-center text-center border border-[#bccac0]/20">
                <div className="w-full flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#0b1c30]">ضغط السحب (Low Side)</span>
                  <span className="bg-[#006948]/10 text-[#006948] px-2 py-0.5 rounded-full text-[11px] font-bold">
                    طبيعي R410A
                  </span>
                </div>

                <div className="relative w-44 h-44 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#bccac0"
                      strokeWidth="8"
                      opacity="0.3"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#006948"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (lowPsi / 150) * 180}
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-[#0b1c30] font-mono">{lowPsi}</span>
                    <span className="text-xs text-[#565e74] font-bold">PSI</span>
                  </div>
                </div>

                <p className="text-xs text-[#565e74]">درجة حرارة التبخير: 4.8 °C</p>
              </div>

              {/* High Side PSI */}
              <div className="bg-[#eff4ff] p-6 rounded-2xl flex flex-col items-center text-center border border-[#bccac0]/20">
                <div className="w-full flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#0b1c30]">ضغط الطرد (High Side)</span>
                  <span className="bg-[#825100]/10 text-[#825100] px-2 py-0.5 rounded-full text-[11px] font-bold">
                    ضمن النطاق الموصى
                  </span>
                </div>

                <div className="relative w-44 h-44 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#bccac0"
                      strokeWidth="8"
                      opacity="0.3"
                    ></circle>
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#825100"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (highPsi / 450) * 180}
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-[#0b1c30] font-mono">{highPsi}</span>
                    <span className="text-xs text-[#565e74] font-bold">PSI</span>
                  </div>
                </div>

                <p className="text-xs text-[#565e74]">درجة حرارة التكثيف: 46.2 °C</p>
              </div>

              {/* Amperage & Diagnostic calculations */}
              <div className="bg-[#eff4ff] p-6 rounded-2xl flex flex-col justify-between border border-[#bccac0]/20">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#0b1c30]">
                      استهلاك التيار (أمبير الضاغط)
                    </span>
                    <Zap className="w-4 h-4 text-[#006948]" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black text-[#0b1c30] font-mono">{amperage}</span>
                    <span className="text-xs text-[#565e74]">Amperes (Max 11.2A)</span>
                  </div>
                  <div className="w-full bg-[#e5eeff] h-2.5 rounded-full overflow-hidden mb-4">
                    <div className="bg-[#006948] h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="bg-[#ffffff] p-3 rounded-xl space-y-2 border border-[#bccac0]/20 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#565e74]">التحميص (Superheat):</span>
                    <span className="font-bold text-[#0b1c30]">6.1 K (مثالي)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#565e74]">التبريد الدوني (Subcooling):</span>
                    <span className="font-bold text-[#0b1c30]">8.4 K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#565e74]">فرق حرارة الهواء (Delta-T):</span>
                    <span className="font-bold text-[#006948]">11.8 °C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Before and After Documentation */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold text-[#0b1c30]">
                التوثيق المرئي للفحص والتنفيذ (قبل وبعد)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#eff4ff] p-4 rounded-xl flex flex-col gap-2 border border-[#bccac0]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ba1a1a]">
                      صورة ما قبل الصيانة (الحالة الأصلية)
                    </span>
                    <AlertCircle className="w-4 h-4 text-[#ba1a1a]" />
                  </div>
                  <img
                    className="w-full h-48 rounded-lg object-cover"
                    alt="صورة قبل الصيانة"
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                  />
                  <button
                    onClick={() => alert('تم تحديث صورة المعاينة')}
                    className="bg-[#ffffff] text-[#0b1c30] py-2 rounded-lg text-xs font-bold hover:bg-[#e5eeff] flex items-center justify-center gap-1 border border-[#bccac0]/20"
                  >
                    <Camera className="w-4 h-4" />
                    <span>تحديث صورة المعاينة</span>
                  </button>
                </div>

                <div className="bg-[#eff4ff] p-4 rounded-xl flex flex-col gap-2 border border-[#bccac0]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#006948]">
                      صورة ما بعد الصيانة (التسليم الهندسي)
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#006948]" />
                  </div>
                  <img
                    className="w-full h-48 rounded-lg object-cover"
                    alt="صورة بعد الصيانة"
                    src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
                  />
                  <button
                    onClick={() => {
                      alert('تم رفع صورة الإنجاز وتثبيت الختم الرقمي لمطابقة ZATCA.');
                      onCompleteOrder(activeJob?.id || 'wo-2');
                    }}
                    className="bg-[#006948] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#00855d] flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>التقاط صورة الإنجاز واعتماد الفاتورة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: P2P PARTS RADAR */}
      {activeTab === 'parts' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="bg-[#ffffff] p-6 lg:p-8 rounded-2xl shadow-sm border border-[#bccac0]/25">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-[#006948]" />
                  <h2 className="text-xl font-bold text-[#0b1c30]">
                    رادار مناقلة قطع الغيار بين الفنيين (P2P Parts Radar)
                  </h2>
                </div>
                <p className="text-xs text-[#565e74] mt-0.5">
                  فحص مخزون سيارات الصيانة القريبة في نفس الحي وتبادل القطع مع اعتماد الرمز الآمن
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ابحث برقم القطعة أو الموديل..."
                  className="bg-[#eff4ff] px-4 py-2.5 rounded-full text-xs border border-[#bccac0]/30 w-64 outline-none"
                />
                <button className="bg-[#006948] text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#00855d]">
                  بحث
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Peer 1 */}
              <div className="bg-[#eff4ff] p-5 rounded-2xl flex flex-col justify-between gap-4 border border-[#bccac0]/20">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#006948]/15 flex items-center justify-center text-[#006948] font-bold text-xs">
                        م.س
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0b1c30]">فني محمد السوري</h4>
                        <p className="text-xs text-[#565e74]">فان صيانة أكسجين #12 • 450 متر</p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-[#85f8c4] text-[#002114] px-2 py-0.5 rounded-full font-bold">
                      متوفر الآن
                    </span>
                  </div>

                  <div className="bg-[#ffffff] p-3 rounded-xl space-y-1 border border-[#bccac0]/20 text-xs">
                    <p className="font-bold text-[#0b1c30]">مكثف تشغيل (Capacitor 45+5 uF)</p>
                    <p className="text-[#565e74]">الكمية في السيارة: 3 قطع أصلية</p>
                    <p className="text-[#006948] font-bold font-mono">السعر المعتمد: 65.0 ر.س</p>
                  </div>
                </div>

                <button
                  onClick={() => handleExchangePart('محمد السوري', 'مكثف 45+5 uF')}
                  className="w-full bg-[#006948] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#00855d] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>طلب القطعة ومسح QR</span>
                </button>
              </div>

              {/* Peer 2 */}
              <div className="bg-[#eff4ff] p-5 rounded-2xl flex flex-col justify-between gap-4 border border-[#bccac0]/20">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#565e74] font-bold text-xs">
                        ع.ح
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0b1c30]">فني عصام حسن</h4>
                        <p className="text-xs text-[#565e74]">سيارة خدمة #07 • 1.1 كم</p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-[#85f8c4] text-[#002114] px-2 py-0.5 rounded-full font-bold">
                      متوفر
                    </span>
                  </div>

                  <div className="bg-[#ffffff] p-3 rounded-xl space-y-1 border border-[#bccac0]/20 text-xs">
                    <p className="font-bold text-[#0b1c30]">
                      أسطوانة فريون R410A أمريكي (11.3 كجم)
                    </p>
                    <p className="text-[#565e74]">الكمية في السيارة: 1 أسطوانة ممتلئة</p>
                    <p className="text-[#006948] font-bold font-mono">السعر المعتمد: 380.0 ر.س</p>
                  </div>
                </div>

                <button
                  onClick={() => handleExchangePart('عصام حسن', 'فريون R410A أمريكي')}
                  className="w-full bg-[#006948] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#00855d] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>طلب القطعة ومسح QR</span>
                </button>
              </div>

              {/* Peer 3 */}
              <div className="bg-[#eff4ff] p-5 rounded-2xl flex flex-col justify-between gap-4 border border-[#bccac0]/20">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#825100] font-bold text-xs">
                        ك.م
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0b1c30]">فني كريم محمود</h4>
                        <p className="text-xs text-[#565e74]">فان صيانة أكسجين #18 • 1.8 كم</p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-[#ffddb8] text-[#825100] px-2 py-0.5 rounded-full font-bold">
                      آخر قطعة
                    </span>
                  </div>

                  <div className="bg-[#ffffff] p-3 rounded-xl space-y-1 border border-[#bccac0]/20 text-xs">
                    <p className="font-bold text-[#0b1c30]">موتور مروحة خارجية (Fan Motor Split)</p>
                    <p className="text-[#565e74]">الكمية: قطعة واحدة جديدة بكرتونها</p>
                    <p className="text-[#006948] font-bold font-mono">السعر المعتمد: 156.0 ر.س</p>
                  </div>
                </div>

                <button
                  onClick={() => handleExchangePart('كريم محمود', 'Fan Motor')}
                  className="w-full bg-[#006948] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#00855d] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>طلب القطعة ومسح QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WALLET & CASH RECONCILIATION */}
      {activeTab === 'wallet' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border border-[#bccac0]/25">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#0b1c30]">المحفظة المالية الميدانية</h2>
                  <span className="bg-[#85f8c4]/40 text-[#005137] px-3 py-1 rounded-full text-xs font-bold">
                    سحب فوري متاح
                  </span>
                </div>

                {/* Major Balance */}
                <div className="bg-gradient-to-br from-[#006948] to-[#213145] p-6 rounded-2xl text-white shadow-md mb-4">
                  <span className="text-xs text-white/80">الرصيد الصافي القابل للسحب الفوري</span>
                  <div className="flex items-baseline gap-2 my-2">
                    <span className="text-4xl font-black font-mono">
                      {techWallet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-base font-normal">ريال سعودي</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/85 pt-2 border-t border-white/20">
                    <span>IBAN البنك المعتمد: SA44 2000 **** **** 8912</span>
                    <span>STC Bank مدعوم</span>
                  </div>
                </div>

                {/* Split Sub-balances */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#bccac0]/20">
                    <span className="text-xs text-[#565e74]">كاش العهدة المحصل</span>
                    <p className="text-lg font-bold text-[#ba1a1a] font-mono">
                      {techCashHand.toFixed(2)} ر.س
                    </p>
                    <span className="text-[11px] text-[#565e74]">السقف: 3,000 ر.س</span>
                  </div>

                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#bccac0]/20">
                    <span className="text-xs text-[#565e74]">محتجز لضمان الجودة</span>
                    <p className="text-lg font-bold text-[#825100] font-mono">450.00 ر.س</p>
                    <span className="text-[11px] text-[#565e74]">ينتهي بعد 14 يوم</span>
                  </div>

                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#bccac0]/20">
                    <span className="text-xs text-[#565e74]">مكافآت التميز والـ SLA</span>
                    <p className="text-lg font-bold text-[#006948] font-mono">+210.00 ر.س</p>
                    <span className="text-[11px] text-[#006948] font-bold">بونص الشهر</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() =>
                      alert('تم رفع طلب السحب الفوري بقيمة 3,420.00 ر.س عبر قيد IBAN البنكي.')
                    }
                    className="flex-1 bg-[#006948] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#00855d] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>سحب إلى الحساب البنكي (سريع)</span>
                  </button>

                  <button
                    onClick={() =>
                      alert('تم تحويل الرصيد فوراً إلى محفظة STC Bank المرتبطة برقم هاتفك.')
                    }
                    className="flex-1 bg-[#eff4ff] text-[#0b1c30] py-3 rounded-xl text-xs font-bold hover:bg-[#e5eeff] flex items-center justify-center gap-2 border border-[#bccac0]/25"
                  >
                    <span>تحويل لحظي STC Bank</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cash Drop & Integrity */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border border-[#bccac0]/25">
                <h3 className="text-base font-bold text-[#0b1c30] mb-2">
                  تسوية الكاش وإقرار النزاهة
                </h3>
                <p className="text-xs text-[#565e74] mb-4">
                  تفريغ الكاش الميداني لدى نقاط الإيداع المعتمدة أو سداد العهدة إلكترونياً
                </p>

                <div className="space-y-4">
                  <div className="bg-[#eff4ff] p-4 rounded-xl flex items-center justify-between border border-[#bccac0]/20">
                    <div>
                      <span className="text-xs font-bold text-[#0b1c30]">
                        إيداع العهدة عبر مدى / Apple Pay
                      </span>
                      <p className="text-xs text-[#565e74]">
                        سداد فوري لتصفير كاش اليد ({techCashHand} ر.س)
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        alert(
                          'جاري تشغيل بوابة الدفع السريع عبر Apple Pay لتسوية العهدة الميدانية...'
                        )
                      }
                      className="bg-[#006948] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#00855d]"
                    >
                      سداد الآن
                    </button>
                  </div>

                  <div className="bg-[#eff4ff] p-4 rounded-xl space-y-2.5 border border-[#bccac0]/20">
                    <span className="text-xs font-bold text-[#0b1c30] block">
                      إقرار استلام ومطابقة الفاتورة الضريبية ZATCA
                    </span>
                    <p className="text-xs text-[#565e74] leading-relaxed">
                      أقر أنا الفني الميداني بأن جميع المبالغ المحصلة مطابقة لفواتير رمز الاستجابة
                      السريعة الصادرة تحت إشراف مؤسسة أكسجين للمقاولات.
                    </p>

                    <div className="w-full h-20 bg-[#ffffff] rounded-lg border-dashed border-2 border-[#bccac0] flex items-center justify-center text-xs text-[#565e74]">
                      توقيع الفني الرقمي المعتمد
                    </div>

                    <button
                      onClick={() => alert('تم توثيق التوقيع الرقمي بنجاح في سجل الأمان')}
                      className="w-full bg-[#ffffff] hover:bg-[#e5eeff] text-[#0b1c30] py-2 rounded-lg text-xs font-bold border border-[#bccac0]/20"
                    >
                      اعتماد ومزامنة الإقرار
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VENDOR CERTIFICATION */}
      {activeTab === 'certification' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="bg-[#ffffff] p-6 lg:p-8 rounded-2xl shadow-sm border border-[#bccac0]/25">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0b1c30]">
                نظام التسجيل والاعتماد المهني الاعتراضي
              </h2>
              <p className="text-xs text-[#565e74] mt-0.5">
                انضم لكوادر «مُتقن للصيانة» تحت مظلة مؤسسة أكسجين للمقاولات العامة بإشراف م. علي
                طلعت زيدان
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Option A */}
              <div className="bg-[#eff4ff] p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all border border-[#bccac0]/20">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#85f8c4]/40 text-[#006948] flex items-center justify-center">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0b1c30]">سجل كـ فني مستقل</h3>
                  <p className="text-xs text-[#565e74] leading-relaxed">
                    تشوف نفسك فني رهيب وعندك خبرة بالصيانة المنزلية والتكييف؟ سجل معنا وبنتواصل معك
                    فوراً لاعتمادك الميداني وتزويدك بالأجهزة الذكية.
                  </p>
                  <div className="bg-[#ffffff] p-3 rounded-xl border border-[#bccac0]/20 text-xs">
                    <span className="font-bold text-[#825100]">ملاحظة:</span>
                    <p className="text-[#565e74]">
                      التسجيل يخضع لاختبار الكفاءة المهنية وفحص معايير الجودة المعتمدة بالتطبيق.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    alert('جاري فتح نموذج الاعتماد المهني الرسمي للربط مع سجلات وزارة الموارد البشرية.')
                  }
                  className="w-full mt-4 bg-[#006948] text-white py-3 rounded-full text-xs font-bold hover:bg-[#00855d] shadow-sm cursor-pointer"
                >
                  سجل الآن
                </button>
              </div>

              {/* Option B */}
              <div className="bg-[#eff4ff] p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all border border-[#bccac0]/20">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#dae2fd] text-[#565e74] flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0b1c30]">عندك مؤسسة أو شركة صيانة؟</h3>
                  <p className="text-xs text-[#565e74] leading-relaxed">
                    وتحب تضمن طلبات يومية للفنيين التابعين للمؤسسة؟ تقدر تسجل معنا وتتابع نشاطهم
                    وتشوف كل التفاصيل والمستحقات بنقرة واحدة.
                  </p>
                  <div className="bg-[#ffffff] p-3 rounded-xl border border-[#bccac0]/20 text-xs">
                    <span className="font-bold text-[#565e74]">مزايا الشركاء:</span>
                    <p className="text-[#565e74]">
                      توزيع آلي للمهام وتكامل الفواتير مع هيئة الزكاة والضريبة والجمارك ZATCA.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    alert('جاري فتح نموذج اعتماد منشأة ومزود خدمة صيانة معتمد.')
                  }
                  className="w-full mt-4 bg-[#006948] text-white py-3 rounded-full text-xs font-bold hover:bg-[#00855d] shadow-sm cursor-pointer"
                >
                  سجل كشريك معتمد
                </button>
              </div>
            </div>

            {/* Skills Checklist */}
            <div className="bg-[#eff4ff] p-6 rounded-2xl border border-[#bccac0]/20">
              <h3 className="text-sm font-bold text-[#0b1c30] mb-4">
                مصفوفة التخصصات الميدانية المؤهلة
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 bg-[#ffffff] p-3 rounded-xl cursor-pointer border border-[#bccac0]/20 text-xs font-bold text-[#0b1c30]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#006948] rounded" />
                  <span>تكييف سبليت (تنظيف وغسيل)</span>
                </label>
                <label className="flex items-center gap-2 bg-[#ffffff] p-3 rounded-xl cursor-pointer border border-[#bccac0]/20 text-xs font-bold text-[#0b1c30]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#006948] rounded" />
                  <span>شحن فريون R410A / R22</span>
                </label>
                <label className="flex items-center gap-2 bg-[#ffffff] p-3 rounded-xl cursor-pointer border border-[#bccac0]/20 text-xs font-bold text-[#0b1c30]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#006948] rounded" />
                  <span>تبريد مركزي وتشييد قنوات</span>
                </label>
                <label className="flex items-center gap-2 bg-[#ffffff] p-3 rounded-xl cursor-pointer border border-[#bccac0]/20 text-xs font-bold text-[#0b1c30]">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#006948] rounded" />
                  <span>سباكة وشبكات مياه ذكية</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FIELD OPS CHAT */}
      {activeTab === 'opsChat' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border border-[#bccac0]/25">
            <div className="flex items-center justify-between pb-4 border-b border-[#bccac0]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#006948] flex items-center justify-center text-white">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30]">
                    غرفة العمليات المركزية والدعم الهندسي
                  </h3>
                  <p className="text-xs text-[#565e74]">
                    المشرف الهندسي: م. علي طلعت زيدان وفريق المتابعة
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="tel:0549423050"
                  className="w-10 h-10 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center justify-center text-[#006948]"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Chat Stream */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#eff4ff]/60 rounded-xl my-4 flex flex-col">
              <div className="flex items-start gap-2 max-w-lg self-start">
                <div className="w-8 h-8 rounded-full bg-[#213145] text-white flex items-center justify-center text-xs font-bold">
                  أكسجين
                </div>
                <div className="bg-[#ffffff] p-3 rounded-2xl rounded-tr-none shadow-sm border border-[#bccac0]/20 text-xs">
                  <p className="text-[#0b1c30] leading-relaxed">
                    مرحباً كابتن فهد. نلاحظ أن قراءة ضغط الطرد في أمر العمل #OXY-9481 وصلت 365 PSI.
                    هل تأكدت من نظافة المكثف الخارجي؟
                  </p>
                  <span className="text-[10px] text-[#565e74] block text-left mt-1">10:42 ص</span>
                </div>
              </div>

              <div className="flex items-start gap-2 max-w-lg self-end flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-[#006948] text-white flex items-center justify-center text-xs font-bold">
                  أنا
                </div>
                <div className="bg-[#006948] text-white p-3 rounded-2xl rounded-tl-none shadow-sm text-xs">
                  <p className="leading-relaxed">
                    أهلاً يا باشمهندس. نعم تم غسيل المكثف بمضخة الضغط العالي والآن القراءة استقرت
                    على 320 PSI ومعدل الأمبير 8.1A.
                  </p>
                  <span className="text-[10px] text-white/75 block text-right mt-1">10:44 ص</span>
                </div>
              </div>

              <div className="flex items-start gap-2 max-w-lg self-start">
                <div className="w-8 h-8 rounded-full bg-[#213145] text-white flex items-center justify-center text-xs font-bold">
                  أكسجين
                </div>
                <div className="bg-[#ffffff] p-3 rounded-2xl rounded-tr-none shadow-sm border border-[#bccac0]/20 text-xs">
                  <p className="text-[#0b1c30] leading-relaxed">
                    ممتاز، تسلم يدك! اطلب من العميل تأكيد الـ OTP لنقل الأمر إلى الفاتورة الضريبية
                    ZATCA فوراً.
                  </p>
                  <span className="text-[10px] text-[#565e74] block text-left mt-1">10:45 ص</span>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="اكتب رسالتك للمشرف الهندسي وغرفة العمليات..."
                className="flex-1 bg-[#eff4ff] px-4 py-3 rounded-full text-xs outline-none border border-transparent focus:border-[#006948]"
              />
              <button
                onClick={() => alert('تم إرسال الرسالة إلى غرفة العمليات')}
                className="bg-[#006948] text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-[#00855d] flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>إرسال</span>
                <Send className="w-4 h-4 rtl:-rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom App Navigation Bar (الرئيسية، الحوافز، الخدمات، المهام، المحفظة) */}
      <BottomAppNavBar
        activeTab={
          activeTab === 'radar'
            ? 'home'
            : activeTab === 'parts'
            ? 'offers'
            : activeTab === 'telemetry'
            ? 'services'
            : activeTab === 'wallet'
            ? 'account'
            : 'orders'
        }
        onChangeTab={handleBottomNavChange}
        ordersCount={orders.filter((o) => o.status === 'in_progress').length}
        role="technician"
      />
    </div>
  );
};
