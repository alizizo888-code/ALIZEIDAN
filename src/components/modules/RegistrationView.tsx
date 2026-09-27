import React, { useState } from 'react';
import {
  Shield,
  Zap,
  CheckCircle2,
  MapPin,
  Compass,
  ArrowLeft,
  Building,
  Wrench,
  UserCheck,
  User,
  Briefcase,
  Layers,
  ChevronDown,
  Sparkles,
  Phone,
  FileCheck,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';
import { PlatformSwitches, WorkOrder, RegistrationType, TechSpecialty } from '../../types';

interface RegistrationViewProps {
  initialService?: string;
  initialType?: RegistrationType;
  onBackToHome: () => void;
  onOrderCreated: (order: Partial<WorkOrder>) => void;
  onNavigateToTechnician: () => void;
  switches: PlatformSwitches;
}

export const ALL_SERVICES_LIST = [
  { id: 'ac-maintenance', title: 'صيانة وتكييف مركزي وسبليت', category: 'hvac', defaultPrice: 180, icon: 'mode_fan' },
  { id: 'ac-install', title: 'تركيب ونقل مكيفات جديدة', category: 'hvac', defaultPrice: 220, icon: 'build' },
  { id: 'ac-cleaning', title: 'غسيل وتنظيف مكيفات وتعقيم دكت', category: 'hvac', defaultPrice: 120, icon: 'sanitizer' },
  { id: 'fridge-cooling', title: 'صيانة ثلاجات وتبريد وتجميد', category: 'appliances', defaultPrice: 160, icon: 'kitchen' },
  { id: 'plumbing', title: 'سباكة ذكية وكشف تسربات وشبكات مياه', category: 'plumbing', defaultPrice: 150, icon: 'water_damage' },
  { id: 'electrical', title: 'كهرباء وقواطع وأنظمة ذكية Smart Home', category: 'electrical', defaultPrice: 170, icon: 'bolt' },
  { id: 'carpentry-locks', title: 'أقفال أمنية ونجارة وأبواب إلكترونية', category: 'carpentry', defaultPrice: 190, icon: 'lock_open' },
  { id: 'periodic-contracts', title: 'عقود صيانة دورية شاملة للمباني', category: 'hvac', defaultPrice: 650, icon: 'assignment' },
  { id: 'general-contracting', title: 'مقاولات عامة وترميم وتشطيبات إنشائية', category: 'carpentry', defaultPrice: 1200, icon: 'home_repair_service' },
];

export const TECH_SPECIALTIES: TechSpecialty[] = [
  'مكيفات وتكييف مركزي',
  'تركيب مكيفات جديدة',
  'غسيل وتنظيف مكيفات',
  'ثلاجات وأجهزة تبريد',
  'سباكة وشبكات مياه وصرف',
  'كهرباء وطاقة وسمارت هوم',
  'أقفال أمنية ونجارة',
  'عقود صيانة دورية',
  'شركات مقاولات عامة وتشطيبات',
];

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  initialService = 'صيانة وتكييف مركزي وسبليت',
  initialType = 'guest',
  onBackToHome,
  onOrderCreated,
  onNavigateToTechnician,
  switches,
}) => {
  const [regType, setRegType] = useState<RegistrationType>(initialType);
  const [selectedService, setSelectedService] = useState<string>(initialService);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<'الرياض' | 'جدة' | 'مكة المكرمة'>('الرياض');
  const [district, setDistrict] = useState('حي النرجس');
  const [streetAddress, setStreetAddress] = useState('شارع 3481 • مبنى 14');
  const [notes, setNotes] = useState('');
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');

  // GPS state
  const [gpsStatus, setGpsStatus] = useState<string | null>(
    'تم التحديد التلقائي لنطاق التغطية بالرياض (دقة 8 أمتار)'
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Technician / Contractor Specific Fields
  const [providerType, setProviderType] = useState<'individual' | 'contractor_company'>('individual');
  const [licenseOrCr, setLicenseOrCr] = useState('');
  const [selectedTechSpecialties, setSelectedTechSpecialties] = useState<TechSpecialty[]>([
    'مكيفات وتكييف مركزي',
    'غسيل وتنظيف مكيفات',
  ]);
  const [fleetSize, setFleetSize] = useState('5 فنيين و3 سيارات خدمة');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGpsDetect = () => {
    setIsDetectingGps(true);
    setGpsStatus('جاري الاتصال بالأقمار الصناعية GPS/Galileo لجلب العنوان الوطني بدقة...');
    setTimeout(() => {
      setIsDetectingGps(false);
      setGpsStatus('تم التقاط إحداثياتك المباشرة: الرياض (24.7136° N, 46.6753° E) - حي الياسمين');
      setDistrict('حي الياسمين - طريق أنس بن مالك');
      setStreetAddress('مبنى 7492 • رمز إضافي 3180');
    }, 800);
  };

  const toggleSpecialty = (spec: TechSpecialty) => {
    setSelectedTechSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (regType === 'technician') {
      setSuccessMessage('تم اعتماد تسجيل مزود الخدمة بنجاح! جاري التوجيه إلى بوابة الفنيين والأسطول الميداني...');
      setTimeout(() => {
        setIsSubmitting(false);
        onNavigateToTechnician();
      }, 1200);
    } else {
      // Guest or Customer: Create work order and navigate to Customer Portal
      const currentServiceObj = ALL_SERVICES_LIST.find((s) => s.title === selectedService) || ALL_SERVICES_LIST[0];
      setSuccessMessage('تم تأكيد الطلب وتعيين الفني الأقرب مع كود الدخول Safe OTP! جاري نقلك لبوابة التتبع المباشر...');
      
      setTimeout(() => {
        setIsSubmitting(false);
        onOrderCreated({
          customerName: fullName.trim() || (regType === 'guest' ? 'عميل زائر سريع' : 'عميل معتمد'),
          customerPhone: phone.trim() ? (phone.startsWith('05') ? phone : `05${phone}`) : '0541239870',
          city,
          district,
          nationalAddress: `${streetAddress} • ${district} (${city})`,
          serviceCategory: currentServiceObj.category as any,
          serviceTitle: currentServiceObj.title,
          description: notes.trim() || `طلب صيانة فورية عبر ${regType === 'guest' ? 'الطلب السريع كزائر' : 'بوابة العميل المعتمد'}`,
          totalCost: currentServiceObj.defaultPrice,
          status: 'dispatched',
        });
      }, 1200);
    }
  };

  const activeServiceObj = ALL_SERVICES_LIST.find((s) => s.title === selectedService) || ALL_SERVICES_LIST[0];

  return (
    <div className="w-full flex flex-col pb-20 animate-fade-in" dir="rtl">
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006948] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
          <div className="h-6 w-[1px] bg-[#bccac0]/30 hidden sm:block"></div>
          <div>
            <span className="text-xs text-[#565e74] font-medium block">بوابة التشغيل والتوجيه الفوري</span>
            <h1 className="text-lg sm:text-xl font-bold text-[#0b1c30]">
              نظام طلب الخدمة والتسجيل الذكي الموحد
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006948]/10 text-[#006948] text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>إشراف م. علي طلعت زيدان</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffddb8]/40 text-[#825100] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ضمان 180 يوم</span>
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full bg-[#ffffff] rounded-3xl p-6 sm:p-10 shadow-lg border border-[#bccac0]/30">
        
        {/* Active Chosen Service Banner (Shown for Customer & Guest, or easily toggled) */}
        {regType !== 'technician' && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#eff4ff] to-[#e5eeff] border border-[#006948]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#006948] text-white flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-2xl">{activeServiceObj.icon}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-[#006948] block">الخدمة المحددة حالياً للطلب:</span>
                <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">{activeServiceObj.title}</h3>
                <span className="text-xs text-[#565e74]">
                  الكشف والمعايرة الهندسية: <span className="font-bold text-[#006948]">{activeServiceObj.defaultPrice} ر.س</span> شامل الضريبة والضمان
                </span>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-[#bccac0]/40 text-[#0b1c30] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>تغيير نوع الخدمة</span>
                <ChevronDown className="w-4 h-4 text-[#565e74]" />
              </button>

              {isServiceDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#bccac0]/30 p-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
                  <div className="text-xs font-bold text-[#565e74] px-3 py-1.5 border-b border-gray-100">
                    اختر من قائمة خدمات أكسجين المعتمدة:
                  </div>
                  {ALL_SERVICES_LIST.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setSelectedService(srv.title);
                        setIsServiceDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                        selectedService === srv.title
                          ? 'bg-[#006948] text-white font-bold'
                          : 'hover:bg-[#eff4ff] text-[#0b1c30]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">{srv.icon}</span>
                        <span>{srv.title}</span>
                      </div>
                      <span className={`text-xs ${selectedService === srv.title ? 'text-white' : 'text-[#006948] font-bold'}`}>
                        {srv.defaultPrice} ر.س
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3 PERSONA REGISTRATION TABS (Guest / Customer / Technician) */}
        <div className="mb-8">
          <div className="text-center sm:text-right mb-4">
            <span className="text-xs font-bold text-[#006948] tracking-wider uppercase">اختر نوع التسجيل للبدء</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">حدد صفتك لإتمام الطلب أو الانضمام</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-[#eff4ff] rounded-2xl border border-[#bccac0]/30">
            {/* Mode 1: Fast Guest */}
            <button
              type="button"
              onClick={() => setRegType('guest')}
              className={`p-3.5 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm transition-all cursor-pointer ${
                regType === 'guest'
                  ? 'bg-[#006948] text-white shadow-md'
                  : 'bg-transparent text-[#565e74] hover:text-[#0b1c30] hover:bg-white/60'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <div className="text-right">
                <span className="block leading-tight">طلب سريع كزائر</span>
                <span className="text-[10px] opacity-80 font-normal">بدون كلمة مرور أو انتظار</span>
              </div>
            </button>

            {/* Mode 2: Registered Customer */}
            <button
              type="button"
              onClick={() => setRegType('customer')}
              className={`p-3.5 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm transition-all cursor-pointer ${
                regType === 'customer'
                  ? 'bg-[#006948] text-white shadow-md'
                  : 'bg-transparent text-[#565e74] hover:text-[#0b1c30] hover:bg-white/60'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <div className="text-right">
                <span className="block leading-tight">تسجيل كعميل معتمد</span>
                <span className="text-[10px] opacity-80 font-normal">محفظة رقمية وضمان دائم</span>
              </div>
            </button>

            {/* Mode 3: Field Tech or Contracting Company */}
            <button
              type="button"
              onClick={() => setRegType('technician')}
              className={`p-3.5 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm transition-all cursor-pointer ${
                regType === 'technician'
                  ? 'bg-[#006948] text-white shadow-md'
                  : 'bg-transparent text-[#565e74] hover:text-[#0b1c30] hover:bg-white/60'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <div className="text-right">
                <span className="block leading-tight">فني أو شركة مقاولات</span>
                <span className="text-[10px] opacity-80 font-normal">مزود خدمة ودخل فوري</span>
              </div>
            </button>
          </div>
        </div>

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Persona Header Description Banner */}
          <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#bccac0]/20 flex items-start gap-3 text-xs sm:text-sm text-[#3d4a42]">
            <Info className="w-5 h-5 text-[#006948] shrink-0 mt-0.5" />
            <div>
              {regType === 'guest' && (
                <span>
                  <strong>الطلب السريع كزائر:</strong> أدخل اسمك ورقم جوالك وموقعك بنقرة واحدة، وسيتم إرسال الطلب فوراً لأقرب فني وتزويدك برمز الدخول الآمن <strong>Safe OTP</strong> لمتابعة وصوله لحظياً على الخريطة.
                </span>
              )}
              {regType === 'customer' && (
                <span>
                  <strong>حساب العميل المعتمد:</strong> يمنحك رصيد محفظة رقمية فوري، نقاط مكافآت قابلة للاستبدال، أرشفة الفواتير الضريبية المعتمدة من هيئة الزكاة (ZATCA)، وشهادات ضمان رقمية لمدة 180 يوماً.
                </span>
              )}
              {regType === 'technician' && (
                <span>
                  <strong>انضمام مزود خدمة (فني أو شركة مقاولات):</strong> انضم لشبكة أكسجين المعتمدة لاستقبال مهام يومية فورية عبر خوارزمية SmartLoad مع سحب فوري للمستحقات ودعم بأدوات فحص الحساسات الرقمية.
                </span>
              )}
            </div>
          </div>

          {/* Form Fields Section 1: Names and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                {regType === 'technician'
                  ? providerType === 'contractor_company'
                    ? 'اسم المنشأة أو شركة المقاولات *'
                    : 'الاسم الكامل للفني الميداني *'
                  : 'الاسم الكامل للعميل *'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  regType === 'technician'
                    ? providerType === 'contractor_company'
                      ? 'مثال: شركة أكسجين للمقاولات العامة'
                      : 'مثال: م. حسام بن فهد العتيبي'
                    : 'مثال: سعود بن عبدالله التميمي'
                }
                className="w-full h-12 rounded-xl bg-[#eff4ff] px-4 text-sm text-[#0b1c30] placeholder:text-[#6d7a72] focus:outline-none focus:ring-2 focus:ring-[#006948]/30 border border-transparent focus:border-[#006948]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                رقم الجوال لتأكيد الرمز الآمن والمتابعة *
              </label>
              <div className="flex gap-2 items-center">
                <div className="h-12 px-3 rounded-xl bg-[#e5eeff] flex items-center gap-1.5 text-[#0b1c30] text-xs font-bold shrink-0 border border-[#bccac0]/30">
                  <span>🇸🇦</span>
                  <span dir="ltr">+966</span>
                </div>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="5X XXX XXXX"
                  className="w-full h-12 rounded-xl bg-[#eff4ff] px-4 text-right text-sm text-[#0b1c30] placeholder:text-[#6d7a72] focus:outline-none focus:ring-2 focus:ring-[#006948]/30 border border-transparent focus:border-[#006948]"
                />
              </div>
            </div>
          </div>

          {/* TECHNICIAN & CONTRACTOR SPECIFIC SECTION */}
          {regType === 'technician' && (
            <div className="p-5 rounded-2xl bg-[#eff4ff]/60 border border-[#006948]/20 flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm font-bold text-[#006948] flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>تحديد نوع الكيان وبيانات الاعتماد المهني</span>
                </span>
                <div className="flex p-1 rounded-xl bg-[#ffffff] border border-[#bccac0]/30 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setProviderType('individual')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      providerType === 'individual' ? 'bg-[#006948] text-white shadow-sm' : 'text-[#565e74]'
                    }`}
                  >
                    فني فردي مرخص
                  </button>
                  <button
                    type="button"
                    onClick={() => setProviderType('contractor_company')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      providerType === 'contractor_company' ? 'bg-[#006948] text-white shadow-sm' : 'text-[#565e74]'
                    }`}
                  >
                    مؤسسة / شركة مقاولات
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#0b1c30]">
                    {providerType === 'contractor_company'
                      ? 'رقم السجل التجاري (CR) *'
                      : 'رقم اعتماد الهيئة السعودية للمهندسين (SCE) أو وثيقة العمل الحر *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseOrCr}
                    onChange={(e) => setLicenseOrCr(e.target.value)}
                    placeholder={
                      providerType === 'contractor_company'
                        ? '1010XXXXXX (سجل تجاري ساري)'
                        : 'SCE-489124 أو FL-9821'
                    }
                    className="w-full h-11 rounded-xl bg-white px-4 text-xs sm:text-sm text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                  />
                </div>

                {providerType === 'contractor_company' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#0b1c30]">حجم الأسطول والكوادر الفنية المتاحة</label>
                    <input
                      type="text"
                      value={fleetSize}
                      onChange={(e) => setFleetSize(e.target.value)}
                      placeholder="عدد الفنيين وسيارات الخدمة"
                      className="w-full h-11 rounded-xl bg-white px-4 text-xs sm:text-sm text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                    />
                  </div>
                )}
              </div>

              {/* SPECIALTY MULTI-SELECT CHIPS */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0b1c30]">
                    تحديد التخصصات المعتمدة (يمكنك اختيار عدة تخصصات لمزود الخدمة):
                  </label>
                  <span className="text-[11px] text-[#006948] font-bold">
                    تم تحديد {selectedTechSpecialties.length} تخصص
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {TECH_SPECIALTIES.map((spec) => {
                    const isSelected = selectedTechSpecialties.includes(spec);
                    return (
                      <div
                        key={spec}
                        onClick={() => toggleSpecialty(spec)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#006948] text-white border-[#006948] shadow-sm'
                            : 'bg-white text-[#3d4a42] border-[#bccac0]/30 hover:border-[#006948]/50'
                        }`}
                      >
                        <span>{spec}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LOCATION & SAUDI NATIONAL ADDRESS (SPL) WITH GPS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#eff4ff] border border-[#bccac0]/25 flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#006948]" />
                <span>
                  {regType === 'technician'
                    ? 'نطاق العمل والتغطية الميدانية (العنوان الوطني / GPS)'
                    : 'موقع تنفيذ الخدمة والعنوان الوطني الموحد (SPL)'}
                </span>
              </span>

              <button
                type="button"
                onClick={handleGpsDetect}
                disabled={isDetectingGps}
                className="text-[#006948] text-xs font-bold flex items-center gap-1.5 hover:underline cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#006948]/30 shadow-xs"
              >
                <Compass className={`w-4 h-4 text-[#006948] ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>تحديد موقعي التلقائي عبر GPS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#565e74]">المدينة</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="h-11 rounded-xl bg-white px-3 text-xs sm:text-sm text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                >
                  <option value="الرياض">الرياض (كافة الأحياء)</option>
                  <option value="جدة">جدة (شمال ووسط وجنوب)</option>
                  <option value="مكة المكرمة">مكة المكرمة (العاصمة المقدسة)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#565e74]">الحي السكني أو التجاري</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="مثال: حي الياسمين أو النرجس"
                  className="h-11 rounded-xl bg-white px-3 text-xs sm:text-sm text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#565e74]">الشارع / رقم المبنى / الرمز الإضافي</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="مثال: شارع 3481 • فيلا 4"
                  className="h-11 rounded-xl bg-white px-3 text-xs sm:text-sm text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                />
              </div>
            </div>

            {gpsStatus && (
              <div className="flex items-center gap-2 text-[#006948] text-xs pt-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{gpsStatus}</span>
              </div>
            )}
          </div>

          {/* CUSTOMER PROPERTY TYPE & NOTES (If not technician) */}
          {regType !== 'technician' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#0b1c30]">نوع العقار</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPropertyType('residential')}
                    className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      propertyType === 'residential'
                        ? 'bg-[#006948] text-white border-[#006948]'
                        : 'bg-white text-[#3d4a42] border-[#bccac0]/30 hover:bg-gray-50'
                    }`}
                  >
                    عقار سكني (فيلا / شقة)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType('commercial')}
                    className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      propertyType === 'commercial'
                        ? 'bg-[#006948] text-white border-[#006948]'
                        : 'bg-white text-[#3d4a42] border-[#bccac0]/30 hover:bg-gray-50'
                    }`}
                  >
                    عقار تجاري / مكتبي
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-[#0b1c30]">وصف العطل أو تفاصيل إضافية (اختياري)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: المكيف يقطر ماء وتبريده ضعيف، أو السخان لا يعمل"
                  className="w-full h-11 rounded-xl bg-[#eff4ff] px-4 text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#6d7a72] focus:outline-none focus:border-[#006948]"
                />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-full bg-[#006948] text-white text-base font-bold shadow-lg hover:bg-[#00855d] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري معالجة البيانات والربط اللحظي...</span>
                </div>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>
                    {regType === 'technician'
                      ? 'تأكيد تسجيل مزود الخدمة والدخول للبوابة الميدانية'
                      : regType === 'guest'
                      ? 'تأكيد الطلب الفوري كزائر وتتبع الفني الآن ⚡'
                      : 'تأكيد الطلب والتسجيل كعميل معتمد'}
                  </span>
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-[#85f8c4] text-[#002114] flex items-center gap-3 animate-bounce">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-[#006948]" />
              <div>
                <p className="font-bold text-sm">تم بنجاح وموثوقية عالية!</p>
                <p className="text-xs">{successMessage}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-[#565e74]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#006948]" />
              <span>رمز أمان مشفر Safe OTP عند الباب</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#006948]" />
              <span>فواتير معتمدة من هيئة الزكاة والضريبة (ZATCA)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006948]" />
              <span>ضمان أكسجين الذهبي 180 يوماً</span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
