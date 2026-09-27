import React, { useState } from 'react';
import {
  Palette,
  Layers,
  Shield,
  FileCheck,
  CheckCircle2,
  Building,
  MapPin,
  Save,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Tag,
  Percent,
  Clock,
  Zap,
  Lock,
  Eye,
  Sliders,
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { SiteCustomization } from '../../types';

interface AdminCmsViewProps {
  onBackToHome?: () => void;
  customization: SiteCustomization;
  onUpdateCustomization: (newConfig: Partial<SiteCustomization>) => void;
}

export const INITIAL_CUSTOMIZATION: SiteCustomization = {
  siteTitle: 'مُتقن للصيانة - أكسجين للمقاولات',
  siteSubtitle: 'المنظومة الذكية للتشغيل والصيانة الميدانية في المملكة',
  primaryColor: '#006948',
  warrantyDays: 180,
  slaMinutes: 15,
  bannerHeadline: 'المنظومة الأسرع لخدمات الصيانة والتشغيل الميداني بالمملكة',
  bannerSubtext: 'أسرع منصة ربط تقني معتمدة تجمع ملاك العقارات بالكوادر الهندسية المؤهلة بضمان مؤسسي معتمد.',
  heroImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80',
  accreditedMinistries: {
    balady: true,
    zatca: true,
    saudiEngineers: true,
    splAddress: true,
    commerceMinistry: true,
  },
  serviceIcons: {
    'ac-maintenance': 'mode_fan',
    'ac-install': 'build',
    'ac-cleaning': 'sanitizer',
    'fridge-cooling': 'kitchen',
    'plumbing': 'water_damage',
    'electrical': 'bolt',
    'carpentry-locks': 'lock_open',
    'periodic-contracts': 'assignment',
    'general-contracting': 'home_repair_service',
  },
  promotionalOffers: [
    {
      id: 'promo-1',
      title: 'باقة تنظيف وغسيل 3 مكيفات سبليت',
      discount: 'خصم 35%',
      originalPrice: 360,
      offerPrice: 235,
      badge: 'العرض الأكثر توفيراً',
      description: 'غسيل داخلي وخارجي بمضخة ضغط عالي وتعقيم كيميائي مع فحص مجاني لضغط الفريون ودرجة التبريد Delta-T.',
      active: true,
    },
    {
      id: 'promo-2',
      title: 'فحص كشف تسربات المياه بالموجات فوق الصوتية',
      discount: 'خصم 25%',
      originalPrice: 200,
      offerPrice: 150,
      badge: 'تقرير معتمد لشركة المياه',
      description: 'كشف إلكتروني متقدم بشهادة إصلاح رسمية ومعايرة شبكات التغذية والصرف دون تكسير.',
      active: true,
    },
    {
      id: 'promo-3',
      title: 'عقد الصيانة الوقائية السنوي للفيلا السكنية',
      discount: 'خصم 40%',
      originalPrice: 1200,
      offerPrice: 720,
      badge: 'زيارات دورية شاملة',
      description: '4 زيارات فحص دورية للمكيفات والمضخات واللوحات الكهربائية طوال العام مع استجابة طوارئ خلال ساعة.',
      active: true,
    },
  ],
  customPermissions: {
    allowGuestOrder: true,
    allowTechSelfRegistration: true,
    requireNafathAuth: false,
    autoEscrowReleaseOnOtp: true,
  },
};

export const AdminCmsView: React.FC<AdminCmsViewProps> = ({
  onBackToHome,
  customization,
  onUpdateCustomization,
}) => {
  const [activeTab, setActiveTab] = useState<'graphics' | 'pricing' | 'offers' | 'ministries' | 'policies'>('graphics');
  
  // Local editable draft state
  const [config, setConfig] = useState<SiteCustomization>(customization || INITIAL_CUSTOMIZATION);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Available icon presets for services
  const availableIcons = [
    { name: 'mode_fan', label: 'مروحة / تكييف' },
    { name: 'build', label: 'أدوات وتركيب' },
    { name: 'sanitizer', label: 'تعقيم وتنظيف' },
    { name: 'kitchen', label: 'ثلاجات ومطابخ' },
    { name: 'water_damage', label: 'سباكة ومياه' },
    { name: 'bolt', label: 'كهرباء وطاقة' },
    { name: 'lock_open', label: 'أقفال وأمان' },
    { name: 'assignment', label: 'عقود وتقارير' },
    { name: 'home_repair_service', label: 'مقاولات وترميم' },
    { name: 'ac_unit', label: 'تبريد وتجميد' },
    { name: 'thermostat', label: 'حرارة وثرموستات' },
    { name: 'power', label: 'قواطع كهرباء' },
  ];

  // Preset Hero Images
  const heroImagePresets = [
    { label: 'فني تكييف يفحص وحدة خارجية', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80' },
    { label: 'مهندس يفحص أنظمة ذكية ولوحات', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80' },
    { label: 'أعمال سباكة وشبكات مياه حديثة', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80' },
  ];

  const handleSave = () => {
    onUpdateCustomization(config);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  const handleResetToDefault = () => {
    if (confirm('هل تريد استعادة الإعدادات الافتراضية للمنظومة؟')) {
      setConfig(INITIAL_CUSTOMIZATION);
      onUpdateCustomization(INITIAL_CUSTOMIZATION);
      setIsSavedAlert(true);
      setTimeout(() => setIsSavedAlert(false), 2500);
    }
  };

  return (
    <div className="w-full flex flex-col pb-20 font-sans" dir="rtl">
      
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-sm">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006948] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          )}
          <div className="h-6 w-[1px] bg-[#bccac0]/30 hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#85f8c4] text-[#002114] px-2.5 py-0.5 rounded-full font-bold">
                إشراف إداري متقدم
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-[#0b1c30]">
                بوابة التعديل والإشراف الإداري (Admin CMS & Visual Switchboard)
              </h1>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5">
              تعديل الأيقونات والجرافيكس، تخصيص الخدمات والأسعار، إدارة العروض، واعتمادات الوزارات والجهات الرسمية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#565e74] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات وتطبيقها</span>
          </button>
        </div>
      </div>

      {isSavedAlert && (
        <div className="mb-6 p-4 rounded-2xl bg-[#85f8c4] text-[#002114] flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-[#006948]" />
          <div>
            <span className="font-bold text-sm block">تم حفظ وتطبيق التعديلات بنجاح!</span>
            <span className="text-xs">تم تحديث واجهات المنظومة اللحظية، وتطبيق إعدادات الجرافيكس والخدمات والصلاحيات.</span>
          </div>
        </div>
      )}

      {/* Main Card with Tabs */}
      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#bccac0]/25">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#bccac0]/20 scrollbar-none">
          <button
            onClick={() => setActiveTab('graphics')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'graphics'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>استوديو الأيقونات والجرافيكس</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>إدارة العروض الترويجية الحية</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#825100] text-white text-[10px]">
              {config.promotionalOffers.filter((o) => o.active).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>تخصيص أسعار وخدمات المنصة</span>
          </button>

          <button
            onClick={() => setActiveTab('ministries')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ministries'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>الاعتمادات الحكومية والوزارات</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'policies'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>الأوامر والسياسات والصلاحيات</span>
          </button>
        </div>

        {/* TAB 1: GRAPHICS & ICONS STUDIO */}
        {activeTab === 'graphics' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-[#0b1c30] mb-1">
                تخصيص أيقونات الخدمات والجرافيكس المرئي
              </h2>
              <p className="text-xs text-[#565e74]">
                يمكنك تغيير الأيقونة المخصصة لكل تخصص صيانة لتعكس الهوية البصرية التي تفضلها في بطاقات الصفحة الرئيسية وتطبيق العميل.
              </p>
            </div>

            {/* Service Icons Grid Editor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'ac-maintenance', title: 'صيانة وتكييف مركزي' },
                { id: 'ac-install', title: 'تركيب ونقل مكيفات' },
                { id: 'ac-cleaning', title: 'غسيل وتنظيف مكيفات' },
                { id: 'fridge-cooling', title: 'صيانة ثلاجات وتبريد' },
                { id: 'plumbing', title: 'سباكة وشبكات مياه' },
                { id: 'electrical', title: 'كهرباء وأنظمة ذكية' },
                { id: 'carpentry-locks', title: 'أقفال أمنية ونجارة' },
                { id: 'periodic-contracts', title: 'عقود صيانة دورية' },
                { id: 'general-contracting', title: 'شركات مقاولات عامة' },
              ].map((srv) => {
                const currentIcon = config.serviceIcons[srv.id] || 'build';
                return (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl bg-[#eff4ff] border border-[#bccac0]/25 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#006948] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-2xl">{currentIcon}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0b1c30] block">{srv.title}</span>
                        <span className="text-[10px] text-[#565e74]">رمز الأيقونة: {currentIcon}</span>
                      </div>
                    </div>

                    <select
                      value={currentIcon}
                      onChange={(e) => {
                        setConfig((prev) => ({
                          ...prev,
                          serviceIcons: {
                            ...prev.serviceIcons,
                            [srv.id]: e.target.value,
                          },
                        }));
                      }}
                      className="h-10 rounded-xl bg-white px-3 text-xs font-semibold text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948] cursor-pointer"
                    >
                      {availableIcons.map((ico) => (
                        <option key={ico.name} value={ico.name}>
                          {ico.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* Hero Image Customization */}
            <div className="p-6 rounded-2xl bg-[#eff4ff]/60 border border-[#bccac0]/25 flex flex-col gap-4">
              <span className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#006948]" />
                <span>الصورة الرئيسية للواجهة (Hero Showcase Banner)</span>
              </span>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#565e74]">
                    رابط الصورة الحالية المعتمدة:
                  </label>
                  <input
                    type="text"
                    value={config.heroImageUrl}
                    onChange={(e) => setConfig({ ...config, heroImageUrl: e.target.value })}
                    className="w-full h-11 rounded-xl bg-white px-4 text-xs text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                  />

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] text-[#565e74] w-full">صور جاهزة معتمدة:</span>
                    {heroImagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setConfig({ ...config, heroImageUrl: preset.url })}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          config.heroImageUrl === preset.url
                            ? 'bg-[#006948] text-white border-[#006948]'
                            : 'bg-white text-[#3d4a42] border-[#bccac0]/30 hover:bg-gray-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden aspect-[16/9] bg-gray-100 border border-[#bccac0]/30 shadow-inner">
                  <img
                    src={config.heroImageUrl}
                    alt="معاينة الصورة"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: OFFERS & PACKAGES MANAGER */}
        {activeTab === 'offers' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0b1c30] mb-1">
                  إدارة العروض الترويجية والباقات الحصرية
                </h2>
                <p className="text-xs text-[#565e74]">
                  هذه العروض تظهر للعملاء في شريط التنقل السفلي للتطبيق (تبويب العروض) وفي الصفحة الرئيسية.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newOffer = {
                    id: `promo-${Date.now()}`,
                    title: 'عرض جديد: صيانة تكييف وقائية',
                    discount: 'خصم 30%',
                    originalPrice: 250,
                    offerPrice: 175,
                    badge: 'عرض حصري جديد',
                    description: 'فحص شامل للضاغط وشحن الفريون مع تنظيف الفلاتر بالبخار.',
                    active: true,
                  };
                  setConfig({
                    ...config,
                    promotionalOffers: [newOffer, ...config.promotionalOffers],
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#006948] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#00855d] cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة باقة عرض جديدة</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {config.promotionalOffers.map((offer, idx) => (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl bg-[#eff4ff] border border-[#bccac0]/25 flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#bccac0]/20 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#825100] text-white text-xs font-bold">
                        {offer.discount}
                      </span>
                      <input
                        type="text"
                        value={offer.title}
                        onChange={(e) => {
                          const updated = [...config.promotionalOffers];
                          updated[idx].title = e.target.value;
                          setConfig({ ...config, promotionalOffers: updated });
                        }}
                        className="font-bold text-sm sm:text-base text-[#0b1c30] bg-white px-3 py-1 rounded-lg border border-[#bccac0]/25"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#006948]">
                        <input
                          type="checkbox"
                          checked={offer.active}
                          onChange={(e) => {
                            const updated = [...config.promotionalOffers];
                            updated[idx].active = e.target.checked;
                            setConfig({ ...config, promotionalOffers: updated });
                          }}
                          className="w-4 h-4 text-[#006948] rounded"
                        />
                        <span>{offer.active ? 'العرض مفعل ونشط' : 'العرض معطل'}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.promotionalOffers.filter((o) => o.id !== offer.id);
                          setConfig({ ...config, promotionalOffers: updated });
                        }}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="حذف العرض"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#565e74]">شارة العرض الترويجية</label>
                      <input
                        type="text"
                        value={offer.badge}
                        onChange={(e) => {
                          const updated = [...config.promotionalOffers];
                          updated[idx].badge = e.target.value;
                          setConfig({ ...config, promotionalOffers: updated });
                        }}
                        className="h-10 rounded-lg bg-white px-3 text-xs text-[#0b1c30] border border-[#bccac0]/25"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#565e74]">السعر الأصلي (ر.س)</label>
                      <input
                        type="number"
                        value={offer.originalPrice}
                        onChange={(e) => {
                          const updated = [...config.promotionalOffers];
                          updated[idx].originalPrice = parseFloat(e.target.value) || 0;
                          setConfig({ ...config, promotionalOffers: updated });
                        }}
                        className="h-10 rounded-lg bg-white px-3 text-xs text-[#0b1c30] border border-[#bccac0]/25"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-[#006948]">سعر العرض المخفض (ر.س)</label>
                      <input
                        type="number"
                        value={offer.offerPrice}
                        onChange={(e) => {
                          const updated = [...config.promotionalOffers];
                          updated[idx].offerPrice = parseFloat(e.target.value) || 0;
                          setConfig({ ...config, promotionalOffers: updated });
                        }}
                        className="h-10 rounded-lg bg-white px-3 text-xs text-[#006948] font-bold border border-[#006948]/30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#565e74]">تفاصيل ومزايا الباقة</label>
                    <input
                      type="text"
                      value={offer.description}
                      onChange={(e) => {
                        const updated = [...config.promotionalOffers];
                        updated[idx].description = e.target.value;
                        setConfig({ ...config, promotionalOffers: updated });
                      }}
                      className="h-10 rounded-lg bg-white px-3 text-xs text-[#0b1c30] border border-[#bccac0]/25"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRICING & SERVICES CUSTOMIZER */}
        {activeTab === 'pricing' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-[#0b1c30] mb-1">
                تخصيص أسعار الكشف والخدمات الأساسية
              </h2>
              <p className="text-xs text-[#565e74]">
                يمكن لمشرف الموقع تعديل تسعيرة المعاينة والكشف الأولي لكل تخصص لحساب الرسوم وحصص الفنيين تلقائياً.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'صيانة وتكييف مركزي', defaultVal: 180, key: 'ac' },
                { title: 'تركيب ونقل مكيفات', defaultVal: 220, key: 'install' },
                { title: 'غسيل وتنظيف مكيفات', defaultVal: 120, key: 'wash' },
                { title: 'صيانة ثلاجات وتبريد', defaultVal: 160, key: 'fridge' },
                { title: 'سباكة وكشف تسربات', defaultVal: 150, key: 'plumb' },
                { title: 'كهرباء وأنظمة ذكية', defaultVal: 170, key: 'elec' },
                { title: 'أقفال أمنية ونجارة', defaultVal: 190, key: 'lock' },
                { title: 'عقود صيانة دورية للمباني', defaultVal: 650, key: 'contract' },
                { title: 'مقاولات عامة وتشطيبات', defaultVal: 1200, key: 'contracting' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#eff4ff] border border-[#bccac0]/25 flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#0b1c30]">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={item.defaultVal}
                      className="w-full h-10 rounded-xl bg-white px-3 text-xs font-bold text-[#006948] border border-[#bccac0]/30"
                    />
                    <span className="text-xs font-semibold text-[#565e74] shrink-0">ر.س</span>
                  </div>
                  <span className="text-[10px] text-[#565e74]">شامل الضريبة وضمان 180 يوم</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACCREDITATIONS & GOVERNMENT MINISTRIES */}
        {activeTab === 'ministries' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-[#0b1c30] mb-1">
                الاعتمادات الحكومية والوزارات والشراكات الرسمية
              </h2>
              <p className="text-xs text-[#565e74]">
                التحكم في شارات وموثوقية الهيئات والوزارات التي تظهر في تذييل المنصة والتقارير الرسمية المعتمدة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  key: 'balady' as const,
                  title: 'منصة بلدي - وزارة الشؤون البلدية والقروية والإسكان',
                  desc: 'رخصة منشأة معتمدة لمزاولة أعمال صيانة المباني والمقاولات العامة (رقم: 1010789512).',
                  icon: Building,
                },
                {
                  key: 'zatca' as const,
                  title: 'هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2)',
                  desc: 'تكامل الفوترة الإلكترونية والمطابقة مع متطلبات الربط والتكامل ومفتاح التشفير الرقمي.',
                  icon: FileCheck,
                },
                {
                  key: 'saudiEngineers' as const,
                  title: 'الهيئة السعودية للمهندسين (SCE)',
                  desc: 'اعتماد الكوادر الهندسية والفنية الميدانية وتوثيق تصنيف الممارسين المهنيين.',
                  icon: Shield,
                },
                {
                  key: 'splAddress' as const,
                  title: 'العنوان الوطني الموحد (SPL - سبل)',
                  desc: 'تحديد الإحداثيات الجغرافية والرموز الإضافية لتوجيه أسطول سيارات الصيانة بدقة.',
                  icon: MapPin,
                },
                {
                  key: 'commerceMinistry' as const,
                  title: 'وزارة التجارة - حماية المستهلك وتوثيق الأعمال',
                  desc: 'الالتزام بضوابط التجارة وحقوق المستهلك وفترات الضمان المعتمدة ونماذج العقود.',
                  icon: CheckCircle2,
                },
              ].map((item) => {
                const IconComponent = item.icon;
                const isEnabled = config.accreditedMinistries[item.key];
                return (
                  <div
                    key={item.key}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isEnabled
                        ? 'bg-[#ffffff] border-[#006948]/30 shadow-xs'
                        : 'bg-[#eff4ff]/40 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-[#0b1c30] block">{item.title}</span>
                          <span className="text-[11px] text-[#565e74] leading-relaxed block mt-0.5">{item.desc}</span>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            accreditedMinistries: {
                              ...config.accreditedMinistries,
                              [item.key]: e.target.checked,
                            },
                          });
                        }}
                        className="w-5 h-5 text-[#006948] rounded shrink-0 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <span className="text-[#565e74]">حالة الاعتماد:</span>
                      <span className={`font-bold ${isEnabled ? 'text-[#006948]' : 'text-gray-400'}`}>
                        {isEnabled ? 'مفعل وموثق بالواجهة الرسمية' : 'معطل مؤقتاً'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: POLICIES, SLA & PERMISSIONS */}
        {activeTab === 'policies' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-[#0b1c30] mb-1">
                الأوامر التشغيلية والسياسات والصلاحيات الميدانية
              </h2>
              <p className="text-xs text-[#565e74]">
                ضبط معايير الضمان الذهبي، أوقات الاستجابة SLA، وصلاحيات التسجيل التلقائي للمستخدمين ومزودي الخدمة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#eff4ff] border border-[#bccac0]/25 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#825100]" />
                  <span>فترة الضمان المؤسسي المعتمد (يوم)</span>
                </span>
                <input
                  type="number"
                  value={config.warrantyDays}
                  onChange={(e) => setConfig({ ...config, warrantyDays: parseInt(e.target.value) || 180 })}
                  className="h-11 rounded-xl bg-white px-3 text-sm font-bold text-[#0b1c30] border border-[#bccac0]/30"
                />
                <span className="text-[11px] text-[#565e74]">حالياً: 180 يوماً ضمان ذهبي شامل لقطع الغيار والمصنعية</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#eff4ff] border border-[#bccac0]/25 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#006948]" />
                  <span>زمن التوجيه الميداني الأقصى المستهدف SLA (دقيقة)</span>
                </span>
                <input
                  type="number"
                  value={config.slaMinutes}
                  onChange={(e) => setConfig({ ...config, slaMinutes: parseInt(e.target.value) || 15 })}
                  className="h-11 rounded-xl bg-white px-3 text-sm font-bold text-[#0b1c30] border border-[#bccac0]/30"
                />
                <span className="text-[11px] text-[#565e74]">الحد الزمني لوصول الفني لأي موقع في نطاق التغطية</span>
              </div>
            </div>

            {/* Permissions Toggles */}
            <div className="p-6 rounded-2xl bg-white border border-[#bccac0]/30 flex flex-col gap-4">
              <span className="text-sm font-bold text-[#0b1c30]">صلاحيات تسجيل الحسابات والتحقق الأمني:</span>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">السماح بالطلب السريع كزائر بدون حساب مسبق</span>
                  <span className="text-[11px] text-[#565e74]">يتيح للعملاء طلب الصيانة وتحديد الموقع وإصدار كود Safe OTP فوراً</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.customPermissions.allowGuestOrder}
                  onChange={(e) => setConfig({
                    ...config,
                    customPermissions: { ...config.customPermissions, allowGuestOrder: e.target.checked }
                  })}
                  className="w-5 h-5 text-[#006948] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">فتح بوابة الانضمام الذاتي للفنيين وشركات المقاولات</span>
                  <span className="text-[11px] text-[#565e74]">استقبال طلبات الكوادر المهنية والتحقق من رخصة الهيئة وسجل المنشأة</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.customPermissions.allowTechSelfRegistration}
                  onChange={(e) => setConfig({
                    ...config,
                    customPermissions: { ...config.customPermissions, allowTechSelfRegistration: e.target.checked }
                  })}
                  className="w-5 h-5 text-[#006948] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
                <div>
                  <span className="text-xs font-bold text-[#0b1c30] block">الإفراج التلقائي عن مستحقات الفني بمجرد إدخال Safe OTP وإتمام الفحص</span>
                  <span className="text-[11px] text-[#565e74]">تحويل فوري لمحفظة الفني الرقمية بعد استقطاع عمولة المنصة</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.customPermissions.autoEscrowReleaseOnOtp}
                  onChange={(e) => setConfig({
                    ...config,
                    customPermissions: { ...config.customPermissions, autoEscrowReleaseOnOtp: e.target.checked }
                  })}
                  className="w-5 h-5 text-[#006948] rounded cursor-pointer"
                />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
