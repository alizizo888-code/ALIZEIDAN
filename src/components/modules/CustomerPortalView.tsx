import React, { useState } from 'react';
import {
  Wrench,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  Shield,
  CheckCircle2,
  FileText,
  Star,
  Phone,
  MessageSquare,
  Navigation,
  Download,
  Fingerprint,
  Home,
  Clock,
  Sparkles,
  Camera,
  Mic,
  Send,
  Play,
  Key,
  X,
  CreditCard,
  Plus,
} from 'lucide-react';
import { WorkOrder, PlatformSwitches } from '../../types';
import { BottomAppNavBar, AppNavTab } from '../BottomAppNavBar';

interface CustomerPortalViewProps {
  orders: WorkOrder[];
  customerWallet: number;
  loyaltyPoints: number;
  switches: PlatformSwitches;
  onAddOrder: (order: Partial<WorkOrder>) => WorkOrder;
  onOpenZatcaModal: () => void;
  initialSpecialty?: string;
  onBackToHome?: () => void;
  onNavigateToRegister?: (serviceTitle?: string) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  orders,
  customerWallet,
  loyaltyPoints,
  switches,
  onAddOrder,
  onOpenZatcaModal,
  initialSpecialty,
  onBackToHome,
  onNavigateToRegister,
}) => {
  const [activeTab, setActiveTab] = useState<
    'home' | 'offers' | 'tracking' | 'chat' | 'wallet' | 'orders' | 'auth'
  >('home');

  const handleBottomNavChange = (tab: AppNavTab) => {
    if (tab === 'home') setActiveTab('home');
    else if (tab === 'offers') setActiveTab('offers');
    else if (tab === 'services') setActiveTab('home');
    else if (tab === 'orders') setActiveTab('tracking');
    else if (tab === 'account') setActiveTab('wallet');
  };

  // Selected Order for viewing
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState(
    initialSpecialty || 'صيانة وتأسيس التكييف'
  );
  const [selectedServicePrice, setSelectedServicePrice] = useState('180');
  const [bookingTime, setBookingTime] = useState('الآن (خلال 30 - 45 دقيقة عبر الفني الأقرب)');
  const [bookingNotes, setBookingNotes] = useState('');

  // Active chat state
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState([
    {
      id: 1,
      sender: 'tech',
      name: 'الفني فهد الشمري (ميداني)',
      text: 'السلام عليكم ورحمة الله، حياك الله أخوي.. أنا استلمت طلب صيانة التكييف وغسيل الاسبليت، ومعي حقيبة الفحص ومضخة الضغط العالي وغاز R410A.',
      time: '01:14 م',
    },
    {
      id: 2,
      sender: 'user',
      name: 'أنت',
      text: 'وعليكم السلام ورحمة الله يا أهلاً بك فهد، يرجى التركيز على المكيف بغرفة المعيشة لأنه يصدر صوتاً وتبريده ضعيف مقارنة بالبقية.',
      time: '01:16 م',
    },
    {
      id: 3,
      sender: 'tech',
      name: 'الفني فهد الشمري (ميداني)',
      text: 'أبشر بعزك، هذا تقرير المعاينة الأولي من كاميرا الفحص الحراري، هناك انسداد طفيف في مخرج تصريف المياه وسيتم علاجه بضغط النيتروجين.',
      time: '01:18 م',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  // Nafath OTP inputs
  const [nafathOtp, setNafathOtp] = useState(['4', '8', '1', '9']);

  const activeOrder = (selectedOrderId ? orders.find((o) => o.id === selectedOrderId || o.orderNo === selectedOrderId) : null) ||
    orders.find((o) => o.status === 'dispatched' || o.status === 'in_progress') ||
    orders[0];

  const handleOpenBooking = (title: string, price: string) => {
    setSelectedServiceTitle(title);
    setSelectedServicePrice(price.replace(/[^0-9]/g, ''));
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    onAddOrder({
      serviceTitle: selectedServiceTitle,
      totalCost: parseInt(selectedServicePrice) || 180,
      description: bookingNotes || 'طلب صيانة فوري من بوابة العميل',
      status: 'dispatched',
    });
    setIsBookingModalOpen(false);
    setActiveTab('tracking');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      name: 'أنت',
      text: chatInput,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setLocalMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'tech',
          name: 'الفني فهد الشمري (ميداني)',
          text: 'تم استلام ملاحظتك يا غالي وجاري فحصها فور وصولي الآن، الضغط ومستوى التبريد تحت المراقبة الهندسية.',
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Ambient Banner & Sub-Brand Anchor */}
      <div className="w-full bg-[#ffffff] rounded-3xl p-5 lg:p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#bccac0]/25">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#00855d] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[32px]">hvac</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
                بوابة العميل الرقمية الموحدة
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold">
                إصدار 4.8 المعتمد
              </span>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5">
              مؤسسة أكسجين للصيانة والمقاولات العامة • رخصة رقم 1010789512 • إشراف استشاري: م. علي طلعت زيدان
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006948] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>← الرئيسية</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2 rounded-full border border-[#bccac0]/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-ping"></span>
            <span className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
              طلب نشط: {activeOrder?.orderNo || '#OXY-9082'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#ffddb8]/40 px-3.5 py-2 rounded-full text-[#825100]">
            <Shield className="w-4 h-4 text-[#825100]" />
            <span className="text-xs sm:text-sm font-bold">ضمان أكسجين الذهبي</span>
          </div>
        </div>
      </div>

      {/* QUICK ORDER SELECTOR / SWITCHER (يسمح للعميل باختيار أي أوردر ومتابعته) */}
      {orders.length > 0 && (
        <div className="w-full bg-[#ffffff] rounded-2xl p-4 shadow-xs mb-6 border border-[#bccac0]/25">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#006948]" />
              <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                طلباتي في المنظومة ({orders.length} طلبات) - انقر لاختيار الأوردر وتتبع حالته:
              </span>
            </div>

            {onNavigateToRegister && (
              <button
                onClick={() => onNavigateToRegister('صيانة مكيفات وتبريد')}
                className="px-3 py-1.5 rounded-xl bg-[#006948] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#00855d] transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>طلب خدمة جديدة</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {orders.map((ord) => {
              const isSelected = activeOrder?.id === ord.id || activeOrder?.orderNo === ord.orderNo;
              return (
                <button
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setActiveTab('tracking');
                  }}
                  className={`px-3.5 py-2.5 rounded-xl border text-right transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#006948] text-white border-[#006948] shadow-sm'
                      : 'bg-[#eff4ff]/60 hover:bg-[#eff4ff] text-[#0b1c30] border-[#bccac0]/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-bold text-xs">{ord.orderNo}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : ord.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : ord.status === 'dispatched' || ord.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ord.status === 'dispatched'
                        ? 'الفني في الطريق'
                        : ord.status === 'in_progress'
                        ? 'جاري الصيانة'
                        : ord.status === 'completed'
                        ? 'مكتمل'
                        : ord.status}
                    </span>
                  </div>
                  <div className="text-[11px] truncate max-w-[200px] opacity-90">
                    {ord.serviceTitle}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] opacity-75">
                    <span>كود الدخول: {ord.safeOtp}</span>
                    <span>{ord.totalCost} ر.س</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full bg-[#ffffff] rounded-3xl p-5 lg:p-8 shadow-sm border border-[#bccac0]/25">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none border-b border-[#bccac0]/20">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-5 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية والخدمات</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-5 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">local_offer</span>
            <span>العروض والباقات</span>
            <span className="w-2 h-2 rounded-full bg-[#825100]"></span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-5 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>تتبع الفني المباشر</span>
            <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>المحادثة الهندسية</span>
            <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-white text-[11px] flex items-center justify-center font-bold">
              1
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-5 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>المحفظة والفواتير</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>سجل الضمانات والطلبات</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`px-5 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'auth'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>نفاذ والعناوين</span>
          </button>
        </div>

        {/* TAB 1: HOME & SERVICES */}
        {activeTab === 'home' && (
          <div className="flex flex-col w-full space-y-8 animate-fade-in">
            {/* Location & Cart Pill Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#eff4ff] p-4 rounded-2xl border border-[#bccac0]/25">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#006948]/10 text-[#006948] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                    <span className="text-base font-bold text-[#0b1c30]">
                      الرياض، حي النرجس، 3481
                    </span>
                  </div>
                  <span className="text-xs text-[#565e74]">
                    العنوان الوطني المعتمد: RYD-7921 • فيلا 4
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-2 bg-[#ffffff] px-4 py-2 rounded-full shadow-sm border border-[#bccac0]/20">
                  <ShoppingBag className="w-4 h-4 text-[#006948]" />
                  <span className="text-sm font-bold text-[#0b1c30] font-mono">0.00 ر.س</span>
                </div>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="px-4 py-2 rounded-full bg-[#006948] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#00855d] cursor-pointer"
                >
                  <span>تتبع الطلب الحالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Promotional Hero Banner */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-l from-[#006948] via-[#00855d] to-[#213145] text-white p-6 lg:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 min-h-[220px]">
              <div className="max-w-xl z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 text-white">
                  <Sparkles className="w-4 h-4" />
                  <span>حملة الصيف لأكسجين للصيانة</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
                  خصم 30% كاشباك فوري
                </h2>
                <p className="text-sm sm:text-base text-white/90 mb-5 leading-relaxed">
                  على جميع عقود غسيل وصيانة أجهزة التكييف الاسبليت والمركزي مع فحص الفريون الشامل وضمان معتمد من المهندس المشرف.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenBooking('تكييف اسبليت شامل بالبخار', '120')}
                    className="px-6 py-2.5 rounded-full bg-[#ffddb8] text-[#2a1700] text-sm font-bold shadow-md hover:bg-[#ffb95f] transition-colors cursor-pointer"
                  >
                    احجز الآن بضمان Oxygen
                  </button>
                  <span className="text-xs text-white/80">يسري العرض لكافة أحياء الرياض وجدة</span>
                </div>
              </div>

              <div className="relative w-full md:w-72 h-44 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#85f8c4]/20 rounded-full blur-2xl"></div>
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-lg bg-[#e5eeff]">
                  <img
                    className="w-full h-full object-cover"
                    alt="مهندس صيانة معتمد"
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
                  />
                </div>
              </div>
            </div>

            {/* Oxygen Guarantee Badge Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center gap-3 border border-[#bccac0]/20">
                <div className="w-12 h-12 rounded-xl bg-[#ffddb8]/50 text-[#825100] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#825100]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0b1c30]">ضمان أكسجين الذهبي</div>
                  <div className="text-xs text-[#565e74]">30 يوماً استرداد فوري وتعديل مجاني</div>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center gap-3 border border-[#bccac0]/20">
                <div className="w-12 h-12 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-[#006948]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0b1c30]">فحص رقمي معتمد</div>
                  <div className="text-xs text-[#565e74]">قراءة الفريون بالـ PSI ودرجة الدلتا T</div>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center gap-3 border border-[#bccac0]/20">
                <div className="w-12 h-12 rounded-xl bg-[#dae2fd] text-[#565e74] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#565e74]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0b1c30]">فوترة ZATCA سريعة</div>
                  <div className="text-xs text-[#565e74]">فواتير إلكترونية متوافقة مع هيئة الزكاة</div>
                </div>
              </div>
            </div>

            {/* 8 Main Categories Grid (Matches Screenshot 3) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#0b1c30]">أهم الخدمات</span>
                  <span className="text-xl">🔥</span>
                  <span className="text-xs text-[#565e74]">صارت أقرب لك 🚀</span>
                </div>
                <span className="text-xs text-[#006948] font-bold">اختيار تخصص الصيانة</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* HVAC */}
                <div
                  onClick={() => handleOpenBooking('صيانة وتأسيس التكييف', '180 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#85f8c4]/40 text-[#006948] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">mode_fan</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">تكييف</span>
                  <span className="text-xs text-[#006948] font-bold">غسيل • فريون • دكت</span>
                </div>

                {/* Plumbing */}
                <div
                  onClick={() => handleOpenBooking('أعمال السباكة وكشف التسريب', '140 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#dce9ff] text-[#006948] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">faucet</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">سباكة</span>
                  <span className="text-xs text-[#565e74]">كشف تسريب • تركيب</span>
                </div>

                {/* Electrical */}
                <div
                  onClick={() => handleOpenBooking('التمديدات والأحمال الكهربائية', '150 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#dce9ff] text-[#825100] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">power</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">كهرباء</span>
                  <span className="text-xs text-[#565e74]">قواطع • إنارة • أمان</span>
                </div>

                {/* Carpentry */}
                <div
                  onClick={() => handleOpenBooking('نجارة وتركيبات خشبية', '120 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#dce9ff] text-[#565e74] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">handyman</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">نجارة</span>
                  <span className="text-xs text-[#565e74]">أبواب • مطابخ • خفايا</span>
                </div>

                {/* Appliances */}
                <div
                  onClick={() => handleOpenBooking('أجهزة منزلية وغسالات', '130 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#dce9ff] text-[#006948] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">local_laundry_service</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">أجهزة منزلية</span>
                  <span className="text-xs text-[#565e74]">أفران • غسالات • ثلاجات</span>
                </div>

                {/* Satellite */}
                <div
                  onClick={() => handleOpenBooking('ستالايت وشاشات ذكية', '110 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#dce9ff] text-[#006948] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">satellite_alt</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">ستالايت</span>
                  <span className="text-xs text-[#565e74]">دش • شاشات • رسيفر</span>
                </div>

                {/* Flooring */}
                <div
                  onClick={() => handleOpenBooking('تبليط وترميم أرضيات', '190 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#dce9ff] text-[#825100] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">grid_view</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">تبليط</span>
                  <span className="text-xs text-[#565e74]">سيراميك • رخام • باركيه</span>
                </div>

                {/* Security */}
                <div
                  onClick={() => handleOpenBooking('أمن وسلامة وكاميرات مراقبة', '220 ر.س')}
                  className="bg-[#eff4ff] hover:bg-[#e5eeff] transition-all cursor-pointer p-6 rounded-2xl flex flex-col items-center justify-center text-center group shadow-sm border border-[#bccac0]/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#dce9ff] text-[#006948] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">videocam</span>
                  </div>
                  <span className="text-base font-bold text-[#0b1c30] mb-1">أمن وسلامة</span>
                  <span className="text-xs text-[#565e74]">كاميرات • أقفال ذكية</span>
                </div>
              </div>
            </div>

            {/* Featured HVAC Packages */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">باقات تكييف أكسجين المتخصصة</h3>
                  <p className="text-xs text-[#565e74]">تشمل شهادة فحص الضغط وفاتورة ضريبية فورية</p>
                </div>
                <button
                  onClick={() => handleOpenBooking('باقة التكييف الشاملة', '220')}
                  className="text-[#006948] text-sm font-bold hover:underline"
                >
                  عرض كل الباقات
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Package 1 */}
                <div className="bg-[#eff4ff] p-5 rounded-2xl flex flex-col justify-between shadow-sm border border-[#bccac0]/25">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold">
                        الأكثر طلباً
                      </span>
                      <span className="text-lg font-bold text-[#006948] font-mono">120 ر.س</span>
                    </div>
                    <h4 className="text-base font-bold text-[#0b1c30] mb-1">
                      غسيل اسبليت داخلي وخارجي
                    </h4>
                    <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                      تنظيف الفلاتر بالبخار ومضخة الضغط العالي، تعقيم مجرى الصرف وحوض المكثف بمواد مضادة للبكتيريا.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenBooking('غسيل اسبليت بالبخار', '120')}
                    className="w-full py-2.5 rounded-full bg-[#006948] text-white text-sm font-bold hover:bg-[#00855d] transition-colors cursor-pointer"
                  >
                    طلب الخدمة فوراً
                  </button>
                </div>

                {/* Package 2 */}
                <div className="bg-[#eff4ff] p-5 rounded-2xl flex flex-col justify-between shadow-sm border border-[#bccac0]/25">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#825100] text-xs font-bold">
                        معتمد هندسياً
                      </span>
                      <span className="text-lg font-bold text-[#825100] font-mono">190 ر.س</span>
                    </div>
                    <h4 className="text-base font-bold text-[#0b1c30] mb-1">
                      شحن وفحص فريون R410A / R22
                    </h4>
                    <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                      فحص الضغوط بمقياس الديجيتال، كشف تسريب الوصلات بالنيتروجين، وضبط شحنة الفريون بدقة المصنع.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenBooking('شحن فريون ديجيتال', '190')}
                    className="w-full py-2.5 rounded-full bg-[#d3e4fe] text-[#0b1c30] text-sm font-bold hover:bg-[#dce9ff] transition-colors cursor-pointer"
                  >
                    طلب الخدمة فوراً
                  </button>
                </div>

                {/* Package 3 */}
                <div className="bg-[#eff4ff] p-5 rounded-2xl flex flex-col justify-between shadow-sm border border-[#bccac0]/25">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#565e74] text-xs font-bold">
                        باقة الفلل
                      </span>
                      <span className="text-lg font-bold text-[#0b1c30] font-mono">480 ر.س</span>
                    </div>
                    <h4 className="text-base font-bold text-[#0b1c30] mb-1">
                      صيانة تكييف مركزي ودكت كامل
                    </h4>
                    <p className="text-xs text-[#565e74] mb-4 leading-relaxed">
                      غسيل وحدات الـ Package و الـ Concealed، فحص مراوح الطرد، وزن الدلتا-T، وضمان 60 يوماً.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenBooking('صيانة تكييف مركزي شامل', '480')}
                    className="w-full py-2.5 rounded-full bg-[#d3e4fe] text-[#0b1c30] text-sm font-bold hover:bg-[#dce9ff] transition-colors cursor-pointer"
                  >
                    طلب الخدمة فوراً
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROMOTIONAL OFFERS & PACKAGES (العروض والباقات) */}
        {activeTab === 'offers' && (
          <div className="flex flex-col w-full space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#eff4ff] p-5 rounded-2xl border border-[#bccac0]/25">
              <div>
                <span className="text-xs font-bold text-[#825100] block mb-1">عروض وباقات مُتقن الحصرية</span>
                <h3 className="text-xl font-bold text-[#0b1c30]">باقات الصيانة الموسمية مع ضمان 180 يوماً</h3>
                <p className="text-xs text-[#565e74] mt-0.5">
                  استفد من خصومات حصرية لعملاء المنصة مع ربط فوري بالأجهزة الذكية والفحص الميداني المعتمد.
                </p>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold self-start sm:self-auto">
                وفر حتى 40%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Offer 1 */}
              <div className="p-6 rounded-3xl bg-white border border-[#bccac0]/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-[#825100] text-white text-xs font-bold px-3.5 py-1 rounded-br-2xl">
                  خصم 35%
                </div>
                <div>
                  <span className="inline-block text-xs font-bold text-[#006948] bg-[#006948]/10 px-3 py-1 rounded-full mb-3">
                    الأكثر طلباً وتوفيراً
                  </span>
                  <h4 className="text-lg font-bold text-[#0b1c30] mb-2">غسيل 3 مكيفات سبليت</h4>
                  <p className="text-xs text-[#565e74] leading-relaxed mb-4">
                    غسيل داخلي وخارجي بمضخة ضغط عالي وتعقيم كيميائي مع فحص مجاني لضغط الفريون ودرجة التبريد Delta-T.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 line-through block">360 ر.س</span>
                    <span className="text-lg font-bold text-[#006948]">235 ر.س</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking('غسيل 3 مكيفات سبليت عرض خاص', '235')}
                    className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    طلب الباقة
                  </button>
                </div>
              </div>

              {/* Offer 2 */}
              <div className="p-6 rounded-3xl bg-white border border-[#bccac0]/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-[#825100] text-white text-xs font-bold px-3.5 py-1 rounded-br-2xl">
                  خصم 25%
                </div>
                <div>
                  <span className="inline-block text-xs font-bold text-[#006948] bg-[#006948]/10 px-3 py-1 rounded-full mb-3">
                    تقرير معتمد للمياه
                  </span>
                  <h4 className="text-lg font-bold text-[#0b1c30] mb-2">كشف تسربات المياه بالموجات</h4>
                  <p className="text-xs text-[#565e74] leading-relaxed mb-4">
                    كشف إلكتروني متقدم بشهادة إصلاح رسمية ومعايرة شبكات التغذية والصرف دون تكسير.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 line-through block">200 ر.س</span>
                    <span className="text-lg font-bold text-[#006948]">150 ر.س</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking('كشف تسربات المياه بالموجات فوق الصوتية', '150')}
                    className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    طلب الباقة
                  </button>
                </div>
              </div>

              {/* Offer 3 */}
              <div className="p-6 rounded-3xl bg-white border border-[#bccac0]/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-[#825100] text-white text-xs font-bold px-3.5 py-1 rounded-br-2xl">
                  خصم 40%
                </div>
                <div>
                  <span className="inline-block text-xs font-bold text-[#006948] bg-[#006948]/10 px-3 py-1 rounded-full mb-3">
                    زيارات دورية شاملة
                  </span>
                  <h4 className="text-lg font-bold text-[#0b1c30] mb-2">عقد الصيانة الوقائية السنوي</h4>
                  <p className="text-xs text-[#565e74] leading-relaxed mb-4">
                    4 زيارات فحص دورية للمكيفات والمضخات واللوحات الكهربائية طوال العام مع استجابة طوارئ خلال ساعة.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 line-through block">1200 ر.س</span>
                    <span className="text-lg font-bold text-[#006948]">720 ر.س</span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking('عقد صيانة وقائية سنوي شامل', '720')}
                    className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    طلب الباقة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE TECHNICIAN TRACKING */}
        {activeTab === 'tracking' && (
          <div className="flex flex-col w-full space-y-6 animate-fade-in">
            {/* Live ETA Header */}
            <div className="bg-[#006948]/5 rounded-3xl p-5 lg:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-[#006948]/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#006948] text-white flex flex-col items-center justify-center shadow-md">
                  <span className="text-2xl font-black font-mono leading-none">09</span>
                  <span className="text-[11px] font-bold">دقائق</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#0b1c30]">الفني في الطريق إليك</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-ping"></span>
                  </div>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    طلب {activeOrder?.orderNo} • {activeOrder?.serviceTitle}
                  </p>
                </div>
              </div>

              {/* Safe Entry OTP */}
              <div className="bg-[#ffffff] px-6 py-3 rounded-2xl shadow-sm border border-[#bccac0]/30 flex items-center gap-4">
                <div className="text-left">
                  <span className="text-xs text-[#565e74] block">رمز الدخول الأمني</span>
                  <span className="text-2xl font-black font-mono text-[#006948] tracking-widest">
                    #{activeOrder?.safeOtp || '7412'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Map & Technician Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map & Progress */}
              <div className="lg:col-span-2 flex flex-col space-y-3">
                <div className="w-full h-80 lg:h-96 rounded-3xl bg-[#e5eeff] relative overflow-hidden shadow-inner flex items-end p-4 border border-[#bccac0]/25">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                    alt="خريطة المسار الحي للفني"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>

                  {/* Dynamic Tech Pin on Map */}
                  <div className="absolute top-1/3 right-1/2 bg-[#006948] text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold z-10 animate-bounce">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>فهد الشمري (على بعد 1.8 كم)</span>
                  </div>

                  <div className="relative z-10 w-full bg-[#ffffff]/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center justify-between border border-[#bccac0]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#006948] text-white flex items-center justify-center">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0b1c30]">
                          طريق الملك فهد الفرعي - تقاطع الثمامة
                        </div>
                        <div className="text-xs text-[#565e74]">
                          السرعة: 42 كم/س • المسافة المتبقية: 3.4 كم
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#006948] text-xs font-bold">
                      GPS دقيق
                    </span>
                  </div>
                </div>

                {/* Progression steps */}
                <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-[#006948]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>استلام البلاغ</span>
                  </div>
                  <div className="h-1 flex-1 bg-[#006948] mx-2 rounded-full"></div>
                  <div className="flex items-center gap-1.5 text-[#006948]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد المهندس علي</span>
                  </div>
                  <div className="h-1 flex-1 bg-[#006948] mx-2 rounded-full"></div>
                  <div className="flex items-center gap-1.5 text-[#006948]">
                    <span className="w-4 h-4 rounded-full bg-[#006948] text-white text-[10px] flex items-center justify-center">
                      3
                    </span>
                    <span>في الطريق</span>
                  </div>
                  <div className="h-1 flex-1 bg-[#d3e4fe] mx-2 rounded-full"></div>
                  <div className="flex items-center gap-1.5 text-[#565e74]">
                    <span className="w-4 h-4 rounded-full bg-[#d3e4fe] text-[#565e74] text-[10px] flex items-center justify-center">
                      4
                    </span>
                    <span>بدء الفحص والضمان</span>
                  </div>
                </div>
              </div>

              {/* Verified Tech Bio & Telemetry Card */}
              <div className="flex flex-col space-y-4">
                <div className="bg-[#eff4ff] p-5 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#d3e4fe] border border-[#bccac0]/30 shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        alt="فهد الشمري"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-[#0b1c30]">فهد الشمري</h4>
                        <span className="flex items-center text-[#825100] text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#825100] text-[#825100] ml-1" />
                          4.9 (312)
                        </span>
                      </div>
                      <p className="text-xs text-[#565e74] mt-0.5">فني تبريد وتكييف معتمد من أكسجين</p>
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#006948]/10 text-[#006948] text-[11px] font-bold">
                          هوية مفحوصة
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#ffffff] text-[#0b1c30] text-[11px] font-bold border border-[#bccac0]/20">
                          سيارة مجهزة #991
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <a
                      href="tel:0500123456"
                      className="py-2.5 rounded-full bg-[#ffffff] text-[#0b1c30] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#e5eeff] transition-colors border border-[#bccac0]/20"
                    >
                      <Phone className="w-4 h-4" />
                      <span>اتصال هاتفي</span>
                    </a>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="py-2.5 rounded-full bg-[#006948] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#00855d] transition-colors cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>مراسلة فورية</span>
                    </button>
                  </div>

                  {/* Remote IoT Telemetry Readout */}
                  <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#bccac0]/25">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#0b1c30]">
                        الفحص الهندسي اللحظي (IoT Field)
                      </span>
                      <span className="text-[11px] font-bold text-[#006948]">متصل بالجهاز</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#565e74]">ضغط الفريون المقاس (Freon R410A)</span>
                          <span className="font-bold text-[#0b1c30] font-mono">118 PSI / 125 PSI</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                          <div className="h-full bg-[#006948] rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#565e74]">فارق حرارة التبريد (Delta-T)</span>
                          <span className="font-bold text-[#825100] font-mono">11.4 °C (المثالي 12°C)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                          <div className="h-full bg-[#825100] rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE CHAT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col w-full animate-fade-in">
            <div className="bg-[#eff4ff] rounded-3xl overflow-hidden border border-[#bccac0]/25 flex flex-col h-[580px]">
              {/* Chat Header */}
              <div className="p-4 bg-[#ffffff] flex items-center justify-between border-b border-[#bccac0]/20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#d3e4fe] overflow-hidden border border-[#bccac0]/30">
                      <img
                        className="w-full h-full object-cover"
                        alt="فهد الشمري"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      />
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#006948] absolute bottom-0 right-0 ring-2 ring-[#ffffff]"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-bold text-[#0b1c30]">
                        الفني فهد الشمري (ميداني)
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold">
                        تحت إشراف م. علي
                      </span>
                    </div>
                    <span className="text-xs text-[#565e74]">
                      طلب رقم #OXY-9082 • متواجد الآن في حي النرجس
                    </span>
                  </div>
                </div>

                <a
                  href="tel:0500123456"
                  className="w-10 h-10 rounded-full bg-[#eff4ff] text-[#0b1c30] flex items-center justify-center hover:bg-[#e5eeff] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex justify-center">
                  <span className="px-4 py-1 rounded-full bg-[#ffffff] text-[#565e74] text-xs shadow-sm border border-[#bccac0]/20">
                    تم بدء المحادثة المباشرة الموثقة برقم بلاغ رسمي ZATCA-OXY-9082
                  </span>
                </div>

                {localMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-md ${
                      msg.sender === 'user' ? 'mr-auto flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        msg.sender === 'user'
                          ? 'bg-[#dae2fd] text-[#565e74]'
                          : 'bg-[#006948]/20 text-[#006948]'
                      }`}
                    >
                      {msg.sender === 'user' ? 'أنت' : 'ف'}
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl shadow-sm text-sm space-y-1.5 ${
                        msg.sender === 'user'
                          ? 'bg-[#006948] text-white rounded-tl-none'
                          : 'bg-[#ffffff] text-[#0b1c30] rounded-tr-none border border-[#bccac0]/20'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.image && (
                        <div className="w-full h-40 rounded-xl overflow-hidden bg-black/10">
                          <img
                            src={msg.image}
                            alt="صورة الفحص الهندسي"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span
                        className={`text-[10px] block ${
                          msg.sender === 'user' ? 'text-white/80 text-right' : 'text-[#565e74] text-left'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-[#ffffff] flex items-center gap-2 border-t border-[#bccac0]/20"
              >
                <button
                  type="button"
                  onClick={() => alert('إرفاق صورة جديدة للعطل للمهندس الفني')}
                  className="w-10 h-10 rounded-full bg-[#eff4ff] text-[#565e74] flex items-center justify-center hover:bg-[#e5eeff] transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => alert('تسجيل رسالة صوتية')}
                  className="w-10 h-10 rounded-full bg-[#eff4ff] text-[#565e74] flex items-center justify-center hover:bg-[#e5eeff] transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="اكتب رسالتك للفني أو للمهندس المشرف..."
                  className="flex-1 h-11 bg-[#eff4ff] text-[#0b1c30] px-4 rounded-full outline-none text-sm placeholder:text-[#6d7a72] border border-transparent focus:border-[#006948]"
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-full bg-[#006948] text-white flex items-center justify-center hover:bg-[#00855d] transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 rtl:-rotate-90" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: WALLET & INVOICES */}
        {activeTab === 'wallet' && (
          <div className="flex flex-col w-full space-y-8 animate-fade-in">
            {/* Balance Cards Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Balance Card */}
              <div className="bg-[#006948] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between min-h-[190px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/80">الرصيد المتاح بالمحفظة</span>
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-4xl font-black font-mono">
                    {customerWallet.toFixed(2)}{' '}
                    <span className="text-lg font-normal">ر.س</span>
                  </div>
                  <span className="text-xs text-white/80">شامل رصيد الكاشباك الترويجي (85 ر.س)</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => alert('تم تفعيل شحن المحفظة عبر Apple Pay / مدى')}
                    className="px-4 py-1.5 rounded-full bg-[#ffffff] text-[#006948] text-xs font-bold hover:bg-[#eff4ff] transition-colors cursor-pointer"
                  >
                    شحن الرصيد
                  </button>
                  <button
                    onClick={() => alert('تحويل رصيد لمستفيد آخر')}
                    className="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-colors cursor-pointer"
                  >
                    تحويل لمستفيد
                  </button>
                </div>
              </div>

              {/* Loyalty Points */}
              <div className="bg-[#eff4ff] p-6 rounded-3xl shadow-sm flex flex-col justify-between min-h-[190px] border border-[#bccac0]/25">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#565e74]">نقاط أكسجين للمكافآت (مُتقن بلس)</span>
                  <Sparkles className="w-6 h-6 text-[#825100]" />
                </div>
                <div>
                  <div className="text-4xl font-black font-mono text-[#0b1c30]">
                    {loyaltyPoints} <span className="text-lg font-normal text-[#565e74]">نقطة</span>
                  </div>
                  <span className="text-xs text-[#006948] font-bold">
                    تساوي خصم {(loyaltyPoints * 0.05).toFixed(0)} ر.س بالطلب القادم
                  </span>
                </div>
                <button
                  onClick={() => alert('تم تحويل 200 نقطة إلى كوبون خصم بقيمة 10 ر.س')}
                  className="w-full py-2 rounded-full bg-[#d3e4fe] text-[#0b1c30] text-xs font-bold hover:bg-[#dce9ff] transition-colors cursor-pointer"
                >
                  استبدال النقاط بكوبون
                </button>
              </div>

              {/* Payment Methods */}
              <div className="bg-[#eff4ff] p-6 rounded-3xl shadow-sm flex flex-col justify-between min-h-[190px] border border-[#bccac0]/25">
                <div>
                  <span className="text-xs text-[#565e74] block mb-2 font-bold">
                    طرق الدفع المعتمدة
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#ffffff] text-[#0b1c30] text-xs font-bold shadow-sm border border-[#bccac0]/20">
                      Mada مدى
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#ffffff] text-[#0b1c30] text-xs font-bold shadow-sm border border-[#bccac0]/20">
                      Apple Pay
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#ffffff] text-[#0b1c30] text-xs font-bold shadow-sm border border-[#bccac0]/20">
                      STC Pay
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#ffffff] text-[#0b1c30] text-xs font-bold shadow-sm border border-[#bccac0]/20">
                      تمارا وتابي
                    </span>
                  </div>
                </div>

                <div className="bg-[#ffffff] p-2.5 rounded-xl flex items-center justify-between border border-[#bccac0]/20">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#006948]" />
                    <span className="text-xs font-mono font-bold text-[#0b1c30]">•••• 4429</span>
                  </div>
                  <span className="text-xs text-[#006948] font-bold">البطاقة الافتراضية</span>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">الفواتير الضريبية وسندات الضمان</h3>
                  <p className="text-xs text-[#565e74]">معتمدة ومربوطة مع منصة فاتورة (ZATCA Phase 2)</p>
                </div>
                <button
                  onClick={onOpenZatcaModal}
                  className="px-4 py-2 rounded-full bg-[#eff4ff] text-[#0b1c30] text-xs font-bold hover:bg-[#e5eeff] transition-colors cursor-pointer border border-[#bccac0]/20"
                >
                  فحص تشفير ZATCA
                </button>
              </div>

              <div className="bg-[#eff4ff] rounded-2xl overflow-hidden border border-[#bccac0]/25 divide-y divide-[#bccac0]/20">
                {orders
                  .filter((o) => o.status === 'completed' || o.zatcaInvoiceNo)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#ffffff]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0b1c30]">
                              فاتورة ضريبية {inv.zatcaInvoiceNo || '#INV-2025-0891'}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#ffddb8] text-[#825100] text-[10px] font-bold">
                              QR مشفر
                            </span>
                          </div>
                          <span className="text-xs text-[#565e74]">
                            {inv.serviceTitle} • {inv.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                        <div className="text-left">
                          <span className="text-base font-bold text-[#0b1c30] font-mono block">
                            {inv.totalCost.toFixed(2)} ر.س
                          </span>
                          <span className="text-xs text-[#006948]">مدفوعة بالكامل</span>
                        </div>
                        <button
                          onClick={onOpenZatcaModal}
                          className="px-4 py-2 rounded-full bg-[#eff4ff] text-[#006948] hover:bg-[#006948] hover:text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>تحميل PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS & GUARANTEES */}
        {activeTab === 'orders' && (
          <div className="flex flex-col w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0b1c30]">سجل الطلبات وشهادات الضمان</h3>
                <p className="text-xs text-[#565e74]">كافة الخدمات مغطاة بضمان مؤسسة أكسجين المعتمد</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold">
                {orders.length} طلبات مسجلة
              </span>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#eff4ff] p-5 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#006948] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[28px]">
                        {ord.serviceCategory === 'hvac'
                          ? 'hvac'
                          : ord.serviceCategory === 'plumbing'
                          ? 'plumbing'
                          : 'bolt'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-[#0b1c30]">{ord.serviceTitle}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            ord.status === 'completed'
                              ? 'bg-[#ffffff] text-[#006948] border border-[#006948]/30'
                              : ord.status === 'in_progress' || ord.status === 'dispatched'
                              ? 'bg-[#006948] text-white'
                              : 'bg-[#ffddb8] text-[#825100]'
                          }`}
                        >
                          {ord.status === 'completed'
                            ? 'مكتمل ومعتمد'
                            : ord.status === 'in_progress'
                            ? 'قيد التنفيذ'
                            : ord.status === 'dispatched'
                            ? 'الفني بالطريق'
                            : 'بانتظار التأكيد'}
                        </span>
                      </div>

                      <p className="text-xs text-[#565e74] mt-1">
                        رقم الطلب: {ord.orderNo} • {ord.district}, {ord.city} • المبلغ:{' '}
                        <strong className="text-[#0b1c30] font-mono">{ord.totalCost} ر.س</strong>
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-[#825100] text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#006948]" />
                        <span>مشمول بضمان أكسجين الذهبي لمدة 30 يوماً</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {ord.status !== 'completed' ? (
                      <button
                        onClick={() => setActiveTab('tracking')}
                        className="px-4 py-2 rounded-full bg-[#006948] text-white text-xs font-bold shadow-sm hover:bg-[#00855d] cursor-pointer"
                      >
                        تتبع مباشر
                      </button>
                    ) : (
                      <button
                        onClick={onOpenZatcaModal}
                        className="px-4 py-2 rounded-full bg-[#ffffff] text-[#006948] text-xs font-bold shadow-sm hover:bg-[#e5eeff] border border-[#bccac0]/20 cursor-pointer flex items-center gap-1"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>شهادة الضمان</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-4 py-2 rounded-full bg-[#ffffff] text-[#0b1c30] text-xs font-bold shadow-sm hover:bg-[#e5eeff] border border-[#bccac0]/20 cursor-pointer"
                    >
                      المحادثة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AUTHENTICATION & NAFATH */}
        {activeTab === 'auth' && (
          <div className="flex flex-col w-full space-y-6 animate-fade-in">
            <div className="bg-[#eff4ff] p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#bccac0]/25">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#006948]/10 text-[#006948] flex items-center justify-center text-2xl font-bold">
                  س
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#0b1c30]">سعود بن عبدالله التميمي</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> موثق عبر نفاذ
                    </span>
                  </div>
                  <p className="text-xs text-[#565e74] mt-0.5">
                    رقم الجوال: 966541239870+ • العضوية الذهبية VIP
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert('تم تسجيل الخروج بنجاح')}
                className="px-4 py-2 rounded-full bg-[#ffffff] text-[#ba1a1a] text-xs font-bold hover:bg-[#ffdad6] transition-colors border border-[#bccac0]/20 cursor-pointer"
              >
                تسجيل الخروج
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nafath Access Form */}
              <div className="bg-[#eff4ff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#85f8c4]/40 text-[#006948] flex items-center justify-center">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#0b1c30]">
                        التحقق السريع والنفاذ الوطني الموحد
                      </h4>
                      <p className="text-xs text-[#565e74]">
                        ربط بيانات الهوية الوطنية لتسجيل الضمانات باسم المالك
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#565e74] block mb-1">
                        رقم الهوية الوطنية / الإقامة
                      </label>
                      <input
                        type="text"
                        defaultValue="1089332140"
                        className="w-full h-12 px-4 rounded-xl bg-[#ffffff] text-[#0b1c30] text-sm border border-[#bccac0]/30 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#565e74] block mb-1">
                        رمز التحقق السريع OTP المرسل لهاتفك
                      </label>
                      <div className="flex gap-2 justify-between">
                        {nafathOtp.map((val, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            defaultValue={val}
                            className="w-14 h-12 text-center text-xl font-bold font-mono rounded-xl bg-[#ffffff] text-[#0b1c30] border border-[#bccac0]/30 outline-none"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert('تم تأكيد الهوية الوطنية بنجاح وربط سجل العقارات.')}
                  className="mt-6 w-full py-3 rounded-full bg-[#006948] text-white text-sm font-bold shadow-sm hover:bg-[#00855d] cursor-pointer"
                >
                  تأكيد التحقق عبر نفاذ
                </button>
              </div>

              {/* National Address Registry */}
              <div className="bg-[#eff4ff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#dae2fd] text-[#565e74] flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#0b1c30]">سجل العناوين الوطنية</h4>
                        <p className="text-xs text-[#565e74]">لتوجيه الفني فوراً بضغطة زر</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('فتح نافذة إضافة موقع جغرافي جديد')}
                      className="text-[#006948] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + إضافة عنوان
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#ffffff] p-4 rounded-2xl shadow-sm border border-[#bccac0]/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#006948]" />
                        <div>
                          <div className="text-sm font-bold text-[#0b1c30]">
                            فيلا السكن الرئيسي - الرياض
                          </div>
                          <div className="text-xs text-[#565e74]">
                            حي النرجس، شارع 3481 • الرمز 13324
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold">
                        الافتراضي
                      </span>
                    </div>

                    <div className="bg-[#ffffff] p-4 rounded-2xl shadow-sm border border-[#bccac0]/20 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-[#565e74]" />
                        <div>
                          <div className="text-sm font-bold text-[#0b1c30]">
                            مكتب العمل والمؤسسة
                          </div>
                          <div className="text-xs text-[#565e74]">
                            حي العليا، طريق الملك فهد • برج النخبة
                          </div>
                        </div>
                      </div>
                      <button className="text-xs text-[#565e74] hover:text-[#006948]">
                        تعيين كافتراضي
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-[#ffffff]/80 p-3 rounded-2xl flex items-center gap-2 text-[#565e74] text-xs border border-[#bccac0]/20">
                  <Shield className="w-4 h-4 text-[#825100]" />
                  <span>جميع العناوين مرتبطة بأنظمة الخرائط الميدانية للوصول خلال أقل من 30 دقيقة.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-[#bccac0]/30 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#bccac0]/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#006948]/10 text-[#006948] flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0b1c30]">{selectedServiceTitle}</h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#565e74] flex items-center justify-center hover:bg-[#e5eeff]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[#565e74]">
                أنت على وشك حجز زيارة فورية تحت إشراف م. علي طلعت زيدان، وتشمل الضمان الذهبي وفاتورة ZATCA الرسمية.
              </p>

              <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <span className="text-sm font-semibold text-[#0b1c30]">السعر التقديري المبدئي:</span>
                <span className="text-xl font-black text-[#006948] font-mono">
                  {selectedServicePrice} ر.س
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#565e74] block mb-1">
                  الموعد المفضل للزيارة
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full h-12 bg-[#eff4ff] px-4 rounded-xl text-[#0b1c30] text-sm outline-none border border-[#bccac0]/20"
                >
                  <option>الآن (خلال 30 - 45 دقيقة عبر الفني الأقرب)</option>
                  <option>اليوم - الفترة المسائية (4:00 م - 8:00 م)</option>
                  <option>غداً صباحاً (9:00 ص - 1:00 م)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#565e74] block mb-1">
                  ملاحظات العطل للمهندس
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="صف المشكلة بدقة (صوت مروحة، تسريب ماء، قلة تبريد)..."
                  className="w-full h-24 p-3 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-sm outline-none resize-none border border-[#bccac0]/20"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-3 rounded-full bg-[#006948] text-white text-sm font-bold shadow-md hover:bg-[#00855d] cursor-pointer transition-all"
              >
                تأكيد الطلب وإرسال الفني
              </button>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-6 py-3 rounded-full bg-[#eff4ff] text-[#0b1c30] text-sm font-bold hover:bg-[#e5eeff] cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom App Navigation Bar (الرئيسية، العروض، الخدمات، طلباتي، الحساب) */}
      <BottomAppNavBar
        activeTab={
          activeTab === 'home'
            ? 'home'
            : activeTab === 'offers'
            ? 'offers'
            : activeTab === 'tracking' || activeTab === 'orders'
            ? 'orders'
            : 'account'
        }
        onChangeTab={handleBottomNavChange}
        ordersCount={orders.length}
        role="customer"
      />
    </div>
  );
};
