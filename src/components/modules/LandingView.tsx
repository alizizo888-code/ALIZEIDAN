import React, { useState } from 'react';
import {
  Shield,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  Compass,
  ArrowLeft,
  ChevronDown,
  Building,
  Wrench,
  UserCheck,
  FileCheck,
  PhoneCall,
  Check,
  Briefcase,
  Users,
  CreditCard,
  Gauge,
  Star,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  ShoppingBag,
  Search,
  Gift,
  Percent,
  Phone,
} from 'lucide-react';
import { PlatformSwitches, RegistrationType } from '../../types';
import { BottomAppNavBar, AppNavTab } from '../BottomAppNavBar';

interface LandingViewProps {
  onSelectService: (serviceTitle: string, regType?: RegistrationType) => void;
  onNavigateToCustomer: (initialSpecialty?: string) => void;
  onNavigateToTechnician: () => void;
  onNavigateToOperations: () => void;
  onNavigateToSovereign: () => void;
  onNavigateToRegister: (serviceTitle?: string, type?: RegistrationType) => void;
  switches: PlatformSwitches;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onSelectService,
  onNavigateToCustomer,
  onNavigateToTechnician,
  onNavigateToOperations,
  onNavigateToSovereign,
  onNavigateToRegister,
  switches,
}) => {
  // Dual-Persona Switcher: 'customers' (العملاء والمستفيدون) vs 'providers' (مزودو الخدمة والشركات)
  const [activePersona, setActivePersona] = useState<'customers' | 'providers'>('customers');

  // Bottom Mobile-App Navigation Tab
  const [activeAppTab, setActiveAppTab] = useState<AppNavTab>('home');

  // In-tab filters
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedServiceCat, setSelectedServiceCat] = useState<'all' | 'hvac' | 'plumbing' | 'electrical' | 'appliances' | 'carpentry'>('all');
  const [offerCategory, setOfferCategory] = useState<'all' | 'hvac' | 'plumbing' | 'contracts'>('all');

  const handleAppTabChange = (tab: AppNavTab) => {
    setActiveAppTab(tab);
    if (tab === 'orders') {
      onNavigateToCustomer();
    }
  };

  // Promotional Offers List
  const promotionalOffers = [
    {
      id: 'promo-1',
      title: 'باقة تنظيف وغسيل 3 مكيفات سبليت',
      discount: 'خصم 35%',
      originalPrice: '360 ر.س',
      offerPrice: '235 ر.س',
      badge: 'الأكثر طلباً وتوفيراً',
      desc: 'غسيل داخلي وخارجي بمضخة ضغط عالي وتعقيم كيميائي مع فحص مجاني لضغط الفريون ودرجة التبريد Delta-T.',
      service: 'غسيل وتنظيف مكيفات',
    },
    {
      id: 'promo-2',
      title: 'فحص كشف تسربات المياه بالموجات فوق الصوتية',
      discount: 'خصم 25%',
      originalPrice: '200 ر.س',
      offerPrice: '150 ر.س',
      badge: 'تقرير معتمد للمياه',
      desc: 'كشف إلكتروني متقدم بشهادة إصلاح رسمية ومعايرة شبكات التغذية والصرف دون تكسير.',
      service: 'سباكة وشبكات مياه',
    },
    {
      id: 'promo-3',
      title: 'عقد الصيانة الوقائية السنوي للمنازل والفلل',
      discount: 'خصم 40%',
      originalPrice: '1200 ر.س',
      offerPrice: '720 ر.س',
      badge: 'زيارات دورية شاملة',
      desc: '4 زيارات فحص دورية للمكيفات والمضخات واللوحات الكهربائية طوال العام مع استجابة طوارئ خلال ساعة.',
      service: 'عقود صيانة دورية',
    },
  ];

  // Quick Services List matching user's requested categories
  const services = [
    {
      id: 'hvac-split',
      title: 'صيانة مكيفات وتبريد',
      subtitle: 'سبليت، مركزي، كاسيت وVRF',
      price: '180 ر.س',
      icon: 'mode_fan',
      badge: 'الأكثر طلباً',
      color: 'bg-[#006948]/10 text-[#006948]',
    },
    {
      id: 'hvac-install',
      title: 'تركيب مكيفات جديدة',
      subtitle: 'نقل وتأسيس مواسير نحاسية',
      price: '220 ر.س',
      icon: 'build',
      badge: 'ضمان تركيب',
      color: 'bg-[#006948]/10 text-[#006948]',
    },
    {
      id: 'hvac-wash',
      title: 'غسيل وتنظيف مكيفات',
      subtitle: 'تعقيم كيميائي ومضخة ضغط عالي',
      price: '120 ر.س',
      icon: 'sanitizer',
      badge: 'عرض خاص',
      color: 'bg-[#85f8c4]/30 text-[#006948]',
    },
    {
      id: 'appliances-fridge',
      title: 'صيانة ثلاجات وتبريد',
      subtitle: 'ثلاجات منزلية وتبريد تجاري',
      price: '160 ر.س',
      icon: 'kitchen',
      badge: 'قطع أصلية',
      color: 'bg-[#dae2fd] text-[#006948]',
    },
    {
      id: 'plumbing',
      title: 'سباكة وشبكات مياه',
      subtitle: 'كشف تسربات، مضخات وفلاتر',
      price: '150 ر.س',
      icon: 'water_damage',
      badge: 'كشف إلكتروني',
      color: 'bg-[#d3e4fe] text-[#006948]',
    },
    {
      id: 'electrical',
      title: 'كهرباء وأنظمة ذكية',
      subtitle: 'لوحات تحكم، أحمال وسمارت هوم',
      price: '170 ر.س',
      icon: 'bolt',
      badge: 'أمان معتمد',
      color: 'bg-[#ffddb8] text-[#825100]',
    },
    {
      id: 'carpentry-locks',
      title: 'أقفال أمنية ونجارة',
      subtitle: 'كالونات رقمية، أبواب ومفصلات',
      price: '190 ر.س',
      icon: 'lock_open',
      badge: 'استجابة سريعة',
      color: 'bg-[#dce9ff] text-[#3d4a42]',
    },
    {
      id: 'periodic-contracts',
      title: 'عقود صيانة دورية',
      subtitle: 'فلل، عمائر ومجمعات تجارية',
      price: '650 ر.س',
      icon: 'assignment',
      badge: 'توفير سنوي',
      color: 'bg-[#85f8c4] text-[#002114]',
    },
    {
      id: 'contracting-co',
      title: 'شركات مقاولات وتشطيبات',
      subtitle: 'ترميم إنشائي، عزل وديكورات',
      price: '1200 ر.س',
      icon: 'home_repair_service',
      badge: 'معتمد بلدي',
      color: 'bg-[#213145] text-white',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-20 font-sans" dir="rtl">
      
      {/* 1. HOME APP TAB */}
      {activeAppTab === 'home' && (
        <>
          {/* DUAL-PERSONA SWITCHER BAR (مخاطبة الشخصيتين: العملاء vs مزودي الخدمة) */}
          <div className="mb-6 bg-[#ffffff] p-2.5 sm:p-3 rounded-2xl border border-[#bccac0]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#565e74]">وجهتك المفضلة في المنصة:</span>
            </div>

            <div className="flex p-1 rounded-xl bg-[#eff4ff] border border-[#bccac0]/25 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActivePersona('customers')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activePersona === 'customers'
                    ? 'bg-[#006948] text-white shadow-sm'
                    : 'text-[#565e74] hover:text-[#0b1c30]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>للعملاء وأصحاب العقارات (طلب صيانة)</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePersona('providers')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activePersona === 'providers'
                    ? 'bg-[#006948] text-white shadow-sm'
                    : 'text-[#565e74] hover:text-[#0b1c30]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>لمزودي الخدمة والشركات (انضم كشريك)</span>
              </button>
            </div>
          </div>

      {/* HERO SECTION DYNAMICALLY TAILORED FOR ACTIVE PERSONA */}
      <section className="relative overflow-hidden bg-[#eff4ff] rounded-3xl p-6 sm:p-10 lg:p-12 mb-10 border border-[#bccac0]/25 shadow-sm">
        <div className="pointer-events-none absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#006948]/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-10 h-96 w-96 rounded-full bg-[#d3e4fe]/60 blur-3xl"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 relative z-10">
          
          {/* Text Column */}
          <div className="w-full lg:w-7/12 flex flex-col items-start gap-4 text-right">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffffff] text-[#006948] shadow-xs border border-[#bccac0]/30 text-xs sm:text-sm font-bold">
              <Shield className="w-4 h-4 text-[#006948]" />
              <span>مبادرة أكسجين للمقاولات | إشراف عام: م. علي طلعت زيدان</span>
            </div>

            {activePersona === 'customers' ? (
              <>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c30] tracking-tight leading-tight">
                  المنظومة الأسرع لخدمات الصيانة والتشغيل الميداني بالمملكة
                </h1>

                <p className="text-sm sm:text-base text-[#3d4a42] max-w-2xl leading-relaxed">
                  اطلب فني التكييف، السباكة، الكهرباء أو الصيانة الدورية فوراً. نضمن وصول الكوادر الهندسية المعتمدة خلال <span className="text-[#006948] font-bold">15 - 30 دقيقة</span> مع فحص دقيق بالحساسات ورمز أمان مشفر <span className="text-[#825100] font-bold">Safe OTP</span> وضمان ذهبي معتمد لمدة <span className="text-[#825100] font-bold">180 يوماً</span>.
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 w-full pt-1">
                  <div className="p-3.5 rounded-2xl bg-[#ffffff] shadow-xs border border-[#bccac0]/20 flex flex-col">
                    <span className="text-2xl font-bold font-mono text-[#006948]">15-30</span>
                    <span className="text-[11px] text-[#565e74]">دقيقة لمتوسط الوصول الميداني</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#ffffff] shadow-xs border border-[#bccac0]/20 flex flex-col">
                    <span className="text-2xl font-bold font-mono text-[#825100]">180</span>
                    <span className="text-[11px] text-[#565e74]">يوم ضمان معتمد للأعمال والقطع</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#ffffff] shadow-xs border border-[#bccac0]/20 flex flex-col">
                    <span className="text-2xl font-bold font-mono text-[#006948]">100%</span>
                    <span className="text-[11px] text-[#565e74]">فوترة إلكترونية ZATCA المرحلة 2</span>
                  </div>
                </div>

                {/* Customer CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-3 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigateToRegister('صيانة مكيفات وتبريد', 'guest')}
                    className="inline-flex items-center justify-center gap-2 px-7 h-[50px] rounded-full bg-[#006948] text-white font-bold shadow-md hover:bg-[#00855d] transition-all flex-1 sm:flex-none cursor-pointer text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    <span>طلب خدمة صيانة فورية كزائر ⚡</span>
                  </button>

                  <button
                    onClick={() => onNavigateToRegister('صيانة مكيفات وتبريد', 'customer')}
                    className="inline-flex items-center justify-center gap-2 px-6 h-[50px] rounded-full bg-[#ffffff] text-[#0b1c30] font-bold shadow-xs hover:bg-[#e5eeff] transition-all flex-1 sm:flex-none cursor-pointer border border-[#bccac0]/30 text-sm"
                  >
                    <UserCheck className="w-4 h-4 text-[#006948]" />
                    <span>تسجيل حساب عميل معتمد</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c30] tracking-tight leading-tight">
                  انضم كشريك نجاح معتمد في أكسجين وزد دخلك بعقود يومية مستمرة
                </h1>

                <p className="text-sm sm:text-base text-[#3d4a42] max-w-2xl leading-relaxed">
                  سواء كنت فنياً مستقلاً حاملاً لاعتماد الهيئة أو شركة مقاولات وصيانة تمتلك أسطولاً، تتيح لك منصة مُتقن استقبال طلبات الصيانة المباشرة في الرياض، جدة، ومكة المكرمة مع صرف فوري للمستحقات ودعم بالأدوات والقطع.
                </p>

                {/* Tech Metrics */}
                <div className="grid grid-cols-3 gap-3 w-full pt-1">
                  <div className="p-3.5 rounded-2xl bg-[#ffffff] shadow-xs border border-[#bccac0]/20 flex flex-col">
                    <span className="text-2xl font-bold font-mono text-[#006948]">81.5%</span>
                    <span className="text-[11px] text-[#565e74]">حصة الفني الصافية لكل عملية</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#ffffff] shadow-xs border border-[#bccac0]/20 flex flex-col">
                    <span className="text-2xl font-bold font-mono text-[#825100]">فوري</span>
                    <span className="text-[11px] text-[#565e74]">سحب بنكي عبر STC Bank والراجحي</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#ffffff] shadow-xs border border-[#bccac0]/20 flex flex-col">
                    <span className="text-2xl font-bold font-mono text-[#006948]">P2P</span>
                    <span className="text-[11px] text-[#565e74]">رادار تبادل قطع الغيار الميداني</span>
                  </div>
                </div>

                {/* Tech CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-3 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigateToRegister(undefined, 'technician')}
                    className="inline-flex items-center justify-center gap-2 px-7 h-[50px] rounded-full bg-[#006948] text-white font-bold shadow-md hover:bg-[#00855d] transition-all flex-1 sm:flex-none cursor-pointer text-sm"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>تسجيل فني أو شركة مقاولات الآن</span>
                  </button>

                  <button
                    onClick={onNavigateToTechnician}
                    className="inline-flex items-center justify-center gap-2 px-6 h-[50px] rounded-full bg-[#ffffff] text-[#0b1c30] font-bold shadow-xs hover:bg-[#e5eeff] transition-all flex-1 sm:flex-none cursor-pointer border border-[#bccac0]/30 text-sm"
                  >
                    <Gauge className="w-4 h-4 text-[#006948]" />
                    <span>الدخول للبوابة الميدانية للأعمال</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Visual Showcase Card */}
          <div className="w-full lg:w-5/12 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-[#bccac0]/30 p-2">
              <img
                src={
                  activePersona === 'customers'
                    ? 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80'
                    : 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80'
                }
                alt="فني صيانة معتمد في منصة متقن"
                className="w-full h-72 sm:h-80 object-cover rounded-2xl"
              />

              <div className="p-4 bg-white rounded-2xl mt-2 flex items-center justify-between border border-[#bccac0]/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#85f8c4] text-[#002114] flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5 text-[#006948]" />
                  </div>
                  <div>
                    <span className="text-xs text-[#565e74] block">التغطية الحية اللحظية:</span>
                    <span className="text-sm font-bold text-[#0b1c30]">الرياض، جدة، مكة المكرمة</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
                  <span>42 فني متاح الآن</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* OFFERS & PROMOTIONS SECTION */}
      <section id="offers-section" className="mb-14 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 text-[#825100] mb-1">
                <Tag className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-bold">باقات التوفير والعروض الموسمية المعتمدة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
                عروض الصيانة الحصرية بضمان 180 يوماً
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#565e74] max-w-md">
              باقات مخفضة متكاملة تشمل الكشف الهندسي، غسيل الوحدات، فحص ضغوط الفريون، وضمان ذهبي معتمد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {promotionalOffers.map((promo) => (
              <div
                key={promo.id}
                className="bg-white p-6 rounded-3xl border border-[#bccac0]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bg-[#825100] text-white text-xs font-bold px-4 py-1.5 rounded-br-2xl">
                  {promo.discount}
                </div>

                <div>
                  <span className="inline-block text-xs font-bold text-[#006948] bg-[#006948]/10 px-3 py-1 rounded-full mb-3">
                    {promo.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0b1c30] mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-[#565e74] leading-relaxed mb-4">
                    {promo.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 line-through block">{promo.originalPrice}</span>
                    <span className="text-lg font-bold text-[#006948]">{promo.offerPrice}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectService(promo.service, 'guest')}
                    className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>احجز العرض الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      {/* SERVICES GRID WITH 1-CLICK BOOKING & REGISTRATION */}
      <section className="mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs sm:text-sm font-bold text-[#006948] block mb-1">
              تخصصات الصيانة والتشغيل المعتمدة
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
              اختر الخدمة للتحويل الفوري لنظام التسجيل والطلب
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#565e74] max-w-md">
            نقر العميل على أي خدمة ينقله مباشرة لتحديد خيار التسجيل (كزائر سريع، عميل معتمد، أو فني/شركة) مع تحديد الموقع التلقائي بالـ GPS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              onClick={() => onSelectService(srv.title, 'guest')}
              className="group bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-xs hover:shadow-md hover:border-[#006948]/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${srv.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <span className="material-symbols-outlined text-2xl">{srv.icon}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#006948] text-xs font-bold border border-[#006948]/15">
                    {srv.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0b1c30] mb-1 group-hover:text-[#006948] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-[#565e74] mb-3 leading-relaxed">
                  {srv.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#565e74] block">تبدأ من:</span>
                  <span className="text-sm font-bold text-[#006948]">{srv.price}</span>
                </div>

                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-[#006948] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs group-hover:bg-[#00855d] transition-colors"
                >
                  <span>طلب فوري</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE PROVIDER & CONTRACTOR HIGHLIGHT SECTION */}
      <section className="mb-14 bg-gradient-to-br from-[#0b1c30] to-[#16273c] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 text-right">
            <span className="text-xs font-bold text-[#85f8c4] tracking-wider uppercase">
              شراكات المقاولات والكوادر الفنية
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              هل أنت فني محترف أو تمثل شركة مقاولات؟
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
              سجل معنا الآن وحدد تخصصاتك (مكيفات، ثلاجات، سباكة، كهرباء، أقفال، عقود صيانة دورية، مقاولات عامة). نوفر لك تدفق مستمر للطلبات مع سحب آلي للمستحقات وربط أجهزة القياس الذكية.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">مكيفات وتبريد</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">ثلاجات</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">سباكة وصرف</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">كهرباء وطاقة</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">أقفال ونجارة</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">عقود صيانة دورية</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">شركات مقاولات</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigateToRegister(undefined, 'technician')}
              className="px-8 py-3.5 rounded-full bg-[#006948] text-white font-bold text-sm hover:bg-[#00855d] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>انضم الآن كفني أو شركة مقاولات</span>
            </button>
            <button
              onClick={onNavigateToTechnician}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-[#85f8c4]" />
              <span>معاينة بوابة الفنيين التجريبية</span>
            </button>
          </div>
        </div>
      </section>

      {/* STANDALONE PORTAL ENTRY CARDS (فصل الصفحات وتمييز كل بوابة) */}
      <section className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-[#006948] block mb-1">بوابات المنظومة المستقلة</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">
            تصفح بوابات المنظومة المتكاملة
          </h2>
          <p className="text-xs sm:text-sm text-[#565e74] mt-1">
            تم فصل كل بوابة بصفحة مستقلة مخصصة بالكامل تضمن أعلى درجات الخصوصية والكفاءة التشغيلية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Customer Portal */}
          <div
            onClick={() => onNavigateToCustomer()}
            className="p-6 rounded-2xl bg-[#ffffff] shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-[#bccac0]/25 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center font-bold text-sm">
                  01
                </span>
                <Building className="w-5 h-5 text-[#565e74] group-hover:text-[#006948] transition-colors" />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] mb-1.5 group-hover:text-[#006948] transition-colors">
                بوابة العميل المستقلة
              </h3>
              <p className="text-xs text-[#565e74] leading-relaxed">
                متابعة الأوردرات الحية، تتبع الفني على الخريطة مع كود Safe OTP، الفاتورة الضريبية ZATCA، والمحادثة الهندسية المباشرة.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-[#006948] text-xs font-bold">
              <span>فتح بوابة العميل</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Technician Portal */}
          <div
            onClick={() => onNavigateToTechnician()}
            className="p-6 rounded-2xl bg-[#ffffff] shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-[#bccac0]/25 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#006948] flex items-center justify-center font-bold text-sm">
                  02
                </span>
                <Wrench className="w-5 h-5 text-[#565e74] group-hover:text-[#006948] transition-colors" />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] mb-1.5 group-hover:text-[#006948] transition-colors">
                بوابة الفنيين ومزودي الخدمة
              </h3>
              <p className="text-xs text-[#565e74] leading-relaxed">
                استقبال المهام الميدانية، مطابقة رمز Safe OTP عند الباب، أجهزة القياس الحية BLE Manifold، وتبادل قطع الغيار P2P.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-[#006948] text-xs font-bold">
              <span>فتح بوابة الفنيين</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Operations Hub */}
          <div
            onClick={() => onNavigateToOperations()}
            className="p-6 rounded-2xl bg-[#ffffff] shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-[#bccac0]/25 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#ffddb8] text-[#825100] flex items-center justify-center font-bold text-sm">
                  03
                </span>
                <Compass className="w-5 h-5 text-[#825100] group-hover:text-[#006948] transition-colors" />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] mb-1.5 group-hover:text-[#006948] transition-colors">
                مركز العمليات والأسطول
              </h3>
              <p className="text-xs text-[#565e74] leading-relaxed">
                توجيه ذكي للأسطول، توزيع الأحمال SmartLoad، ومراجعة الجودة والنزاعات الهندسية مع فض المنازعات.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-[#825100] text-xs font-bold">
              <span>فتح مركز العمليات</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Sovereign Console */}
          <div
            onClick={() => onNavigateToSovereign()}
            className="p-6 rounded-2xl bg-[#ffffff] shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-[#bccac0]/25 cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-[#213145] text-white flex items-center justify-center font-bold text-sm">
                  04
                </span>
                <Shield className="w-5 h-5 text-[#213145] group-hover:text-[#006948] transition-colors" />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] mb-1.5 group-hover:text-[#006948] transition-colors">
                الكونسول السيادي للمالك
              </h3>
              <p className="text-xs text-[#565e74] leading-relaxed">
                إشراف م. علي طلعت زيدان: المفتاح السيادي 789512364، قواطع الصيانة الطارئة، تعديل نسبة العمولة، وإقرار المعاملات الكبرى.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-[#006948] text-xs font-bold">
              <span>دخول المالك المفوض</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* ACCREDITATIONS FOOTER */}
      <section className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#bccac0]/20">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-[#565e74] tracking-widest uppercase mb-4">
            التراخيص والاعتمادات الوطنية الرسمية
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-85">
            <div className="flex items-center gap-2 text-[#565e74] text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#006948]" />
              <span>رخصة بلدي المعتمدة</span>
            </div>
            <div className="flex items-center gap-2 text-[#565e74] text-xs sm:text-sm font-bold">
              <FileCheck className="w-5 h-5 text-[#006948]" />
              <span>هيئة الزكاة والضريبة (ZATCA)</span>
            </div>
            <div className="flex items-center gap-2 text-[#565e74] text-xs sm:text-sm font-bold">
              <Shield className="w-5 h-5 text-[#006948]" />
              <span>الهيئة السعودية للمهندسين</span>
            </div>
            <div className="flex items-center gap-2 text-[#565e74] text-xs sm:text-sm font-bold">
              <MapPin className="w-5 h-5 text-[#006948]" />
              <span>العنوان الوطني الموحد (SPL)</span>
            </div>
            <div className="flex items-center gap-2 text-[#565e74] text-xs sm:text-sm font-bold">
              <Building className="w-5 h-5 text-[#006948]" />
              <span>مؤسسة أكسجين للمقاولات العامة</span>
            </div>
          </div>
        </div>
      </section>
      </>
    )}

      {/* 2. OFFERS & PROMOTIONS IN-APP TAB */}
      {activeAppTab === 'offers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#006948] text-white flex items-center justify-center shadow-md">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
                  العروض والباقات الترويجية الحصرية (Exclusive Offers)
                </h1>
                <p className="text-xs text-[#565e74] mt-0.5">
                  باقات مخفضة بضمان ذهبي 180 يوماً معتمدة بفواتير هيئة الزكاة والضريبة (ZATCA)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold">
                خصومات تصل إلى 40%
              </span>
            </div>
          </div>

          {/* Offers Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'كافة العروض والباقات' },
              { id: 'hvac', label: 'عروض التكييف والتبريد' },
              { id: 'plumbing', label: 'عروض كشف التسربات' },
              { id: 'contracts', label: 'عقود الصيانة السنوية' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setOfferCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  offerCategory === cat.id
                    ? 'bg-[#006948] text-white shadow-sm'
                    : 'bg-[#ffffff] text-[#565e74] hover:bg-[#eff4ff] border border-[#bccac0]/25'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Offers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotionalOffers
              .filter((offer) => {
                if (offerCategory === 'hvac') return offer.service.includes('مكيفات');
                if (offerCategory === 'plumbing') return offer.service.includes('سباكة');
                if (offerCategory === 'contracts') return offer.service.includes('عقود');
                return true;
              })
              .map((offer) => (
                <div
                  key={offer.id}
                  className="bg-[#ffffff] rounded-3xl p-6 border border-[#bccac0]/25 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-[#006948]/10 text-[#006948] font-bold text-xs">
                        {offer.badge}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#825100] text-white text-[11px] font-bold">
                        {offer.discount}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0b1c30] mb-2 leading-snug">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-[#565e74] leading-relaxed mb-4">
                      {offer.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#bccac0]/20 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-[#565e74] line-through font-mono">
                        {offer.originalPrice}
                      </div>
                      <div className="text-lg font-black text-[#006948] font-mono">
                        {offer.offerPrice}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectService(offer.service, 'guest')}
                      className="px-5 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>احجز العرض الآن</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Promotional Coupon Simulator Box */}
          <div className="bg-[#eff4ff] p-5 rounded-3xl border border-[#bccac0]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-[#006948]" />
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30]">
                  هل تملك كود خصم خاص أو نقاط ولاء؟
                </h4>
                <p className="text-xs text-[#565e74]">
                  استخدم كود الترحيب <strong className="font-mono text-[#006948]">OXYGEN2025</strong> لخصم إضافي 10% عند إتمام الطلب
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToRegister('باقة تنظيف وغسيل 3 مكيفات سبليت', 'customer')}
              className="px-5 py-2.5 rounded-xl bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] cursor-pointer"
            >
              تفعيل الكوبون وحجز موعد
            </button>
          </div>
        </div>
      )}

      {/* 3. SERVICES DIRECTORY IN-APP TAB */}
      {activeAppTab === 'services' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#006948] text-white flex items-center justify-center shadow-md">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
                  دليل الخدمات التخصصية المعتمدة (Services Catalog)
                </h1>
                <p className="text-xs text-[#565e74] mt-0.5">
                  جميع الخدمات تخضع للضمان الذهبي وفحص أجهزة الضغط والتبريد اللاسلكية BLE
                </p>
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#565e74] absolute right-3 top-3.5" />
              <input
                type="text"
                placeholder="ابحث عن خدمة صيانة..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full bg-[#eff4ff] pl-4 pr-9 py-2.5 rounded-xl text-xs outline-none border border-transparent focus:border-[#006948]"
              />
            </div>
          </div>

          {/* Services Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'كافة الخدمات' },
              { id: 'hvac', label: 'تكييف وتبريد' },
              { id: 'plumbing', label: 'سباكة وشبكات مياه' },
              { id: 'electrical', label: 'كهرباء وأنظمة ذكية' },
              { id: 'appliances', label: 'أجهزة وثلاجات' },
              { id: 'carpentry', label: 'أقفال أمنية ونجارة' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedServiceCat(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedServiceCat === cat.id
                    ? 'bg-[#006948] text-white shadow-sm'
                    : 'bg-[#ffffff] text-[#565e74] hover:bg-[#eff4ff] border border-[#bccac0]/25'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services
              .filter((svc) => {
                if (selectedServiceCat === 'hvac') return svc.id.startsWith('hvac');
                if (selectedServiceCat === 'plumbing') return svc.id === 'plumbing';
                if (selectedServiceCat === 'electrical') return svc.id === 'electrical';
                if (selectedServiceCat === 'appliances') return svc.id.startsWith('appliances');
                if (selectedServiceCat === 'carpentry') return svc.id.startsWith('carpentry');
                return true;
              })
              .filter((svc) => {
                if (!serviceSearch) return true;
                return (
                  svc.title.includes(serviceSearch) ||
                  svc.subtitle.includes(serviceSearch)
                );
              })
              .map((svc) => (
                <div
                  key={svc.id}
                  className="bg-[#ffffff] p-5 rounded-3xl border border-[#bccac0]/25 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-2xl ${svc.color} flex items-center justify-center shadow-xs`}>
                        <span className="material-symbols-outlined text-xl">{svc.icon}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#006948] font-bold text-[11px] border border-[#bccac0]/20">
                        {svc.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#0b1c30] mb-1">{svc.title}</h3>
                    <p className="text-xs text-[#565e74] mb-4">{svc.subtitle}</p>
                  </div>

                  <div className="pt-3 border-t border-[#bccac0]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#565e74] block">تبدأ من</span>
                      <span className="text-base font-black text-[#006948] font-mono">{svc.price}</span>
                    </div>

                    <button
                      onClick={() => onSelectService(svc.title, 'guest')}
                      className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>طلب فوري</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. ACCOUNT & PROFILE IN-APP TAB */}
      {activeAppTab === 'account' && (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
          {/* Profile Card */}
          <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#bccac0]/25 text-center">
            <div className="w-20 h-20 rounded-full bg-[#006948]/10 text-[#006948] flex items-center justify-center mx-auto mb-4 font-bold text-2xl border-2 border-[#006948]/30">
              <UserCheck className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-[#0b1c30] mb-1">
              مرحباً بك في منصة مُتقن للصيانة
            </h2>
            <p className="text-xs text-[#565e74] mb-4">
              مبادرة مؤسسة أكسجين للصيانة والمقاولات العامة • إشراف م. علي طلعت زيدان
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#006948] text-xs font-bold border border-[#bccac0]/25">
                مستفيد ضيف نشط
              </span>
              <span className="px-3 py-1 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold">
                150 نقطة ولاء ترحيبية
              </span>
            </div>

            {/* Quick Portal Switcher Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
              <button
                onClick={() => onNavigateToRegister(undefined, 'customer')}
                className="p-4 rounded-2xl bg-[#eff4ff] hover:bg-[#e5eeff] border border-[#bccac0]/25 text-right transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-[#0b1c30] mb-0.5">
                    تسجيل الدخول / فتح حساب عميل
                  </h4>
                  <p className="text-[11px] text-[#565e74]">
                    ربط بالعنوان الوطني الموحد وتتبع الضمان
                  </p>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#006948]" />
              </button>

              <button
                onClick={() => onNavigateToRegister(undefined, 'technician')}
                className="p-4 rounded-2xl bg-[#eff4ff] hover:bg-[#e5eeff] border border-[#bccac0]/25 text-right transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-[#0b1c30] mb-0.5">
                    الانضمام كفني أو مقاول
                  </h4>
                  <p className="text-[11px] text-[#565e74]">
                    استقبال أوردرات الصيانة وأرباح فورية
                  </p>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#006948]" />
              </button>
            </div>
          </div>

          {/* Account Quick Features */}
          <div className="bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25 space-y-4">
            <h3 className="font-bold text-sm text-[#0b1c30]">
              الميزات والضمانات المعتمدة لحسابك:
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#006948]" />
                  <div>
                    <span className="font-bold text-[#0b1c30] block">الضمان الذهبي 180 يوماً</span>
                    <span className="text-[#565e74]">إعادة صيانة مجانية أو استرداد كامل للمبلغ</span>
                  </div>
                </div>
                <span className="text-[#006948] font-bold">نشط وتلقائي</span>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-[#006948]" />
                  <div>
                    <span className="font-bold text-[#0b1c30] block">الفاتورة الإلكترونية المعتمدة ZATCA</span>
                    <span className="text-[#565e74]">رمز QR مشفر ومطابق لهيئة الزكاة والضريبة</span>
                  </div>
                </div>
                <span className="text-[#006948] font-bold">فوري مع كل طلب</span>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-2xl flex items-center justify-between border border-[#bccac0]/20">
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-[#006948]" />
                  <div>
                    <span className="font-bold text-[#0b1c30] block">خط الطوارئ والاستجابة السريعة</span>
                    <span className="text-[#565e74]">إشراف م. علي طلعت زيدان: 0549423050</span>
                  </div>
                </div>
                <a
                  href="tel:0549423050"
                  className="px-3 py-1 rounded-full bg-[#006948] text-white text-[11px] font-bold hover:bg-[#00855d]"
                >
                  اتصال مباشر
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom App Navigation Bar (الرئيسية، العروض، الخدمات، طلباتي، الحساب) */}
      <BottomAppNavBar
        activeTab={activeAppTab}
        onChangeTab={handleAppTabChange}
        role="guest"
      />
    </div>
  );
};
