import React, { useMemo } from 'react';
import { ArrowLeft, Briefcase, Image as ImageIcon, Tag, Zap } from 'lucide-react';
import { LandingView } from './LandingView';
import { PageSupervisorConfig, PlatformSwitches, RegistrationType } from '../../types';

const DEFAULT_SERVICES = [
  { id: 'hvac-split', title: 'صيانة مكيفات وتبريد', subtitle: 'سبليت، مركزي، كاسيت وVRF', price: 180 },
  { id: 'hvac-install', title: 'تركيب مكيفات جديدة', subtitle: 'نقل وتأسيس مواسير نحاسية', price: 220 },
  { id: 'hvac-wash', title: 'غسيل وتنظيف مكيفات', subtitle: 'تعقيم كيميائي ومضخة ضغط عالي', price: 120 },
  { id: 'appliances-fridge', title: 'صيانة ثلاجات وتبريد', subtitle: 'ثلاجات منزلية وتبريد تجاري', price: 160 },
  { id: 'plumbing', title: 'سباكة وشبكات مياه', subtitle: 'كشف تسربات، مضخات وفلاتر', price: 150 },
  { id: 'electrical', title: 'كهرباء وأنظمة ذكية', subtitle: 'لوحات تحكم، أحمال وسمارت هوم', price: 170 },
  { id: 'carpentry-locks', title: 'أقفال أمنية ونجارة', subtitle: 'كالونات رقمية، أبواب ومفصلات', price: 190 },
  { id: 'periodic-contracts', title: 'عقود صيانة دورية', subtitle: 'فلل، عمائر ومجمعات تجارية', price: 650 },
  { id: 'contracting-co', title: 'شركات مقاولات وتشطيبات', subtitle: 'ترميم إنشائي، عزل وديكورات', price: 1200 },
];

const DEFAULT_OFFERS = [
  { id: 'promo-1', title: 'باقة تنظيف وغسيل 3 مكيفات سبليت', discount: 'خصم 35%', price: 235, originalPrice: 360, service: 'غسيل وتنظيف مكيفات', description: 'غسيل داخلي وخارجي بمضخة ضغط عالي وتعقيم كيميائي مع فحص مجاني.' },
  { id: 'promo-2', title: 'فحص كشف تسربات المياه بالموجات فوق الصوتية', discount: 'خصم 25%', price: 150, originalPrice: 200, service: 'سباكة وشبكات مياه', description: 'كشف إلكتروني متقدم وتقرير إصلاح دون تكسير.' },
  { id: 'promo-3', title: 'عقد الصيانة الوقائية السنوي للمنازل والفلل', discount: 'خصم 40%', price: 720, originalPrice: 1200, service: 'عقود صيانة دورية', description: 'زيارات فحص دورية للمكيفات والمضخات واللوحات الكهربائية.' },
];

const defaultConfig = (): PageSupervisorConfig => ({
  page: 'landing', enabled: true, pageTitle: 'الرئيسية', pageSubtitle: 'خدمات الصيانة والتشغيل الميداني',
  heroTitle: 'المنظومة الأسرع لخدمات الصيانة والتشغيل الميداني بالمملكة',
  heroText: 'اطلب فني التكييف، السباكة، الكهرباء أو الصيانة الدورية فوراً من منصة مُتقن.', heroImageUrl: '',
  primaryColor: '#006948', accentColor: '#85f8c4', showHero: true, showServices: true, showPricing: true,
  showOffers: true, showGraphics: true, showAnnouncements: true, showQuickActions: true,
  visibleButtons: ['طلب خدمة', 'متابعة الطلب', 'تسجيل الدخول'],
  servicePrices: Object.fromEntries(DEFAULT_SERVICES.map(s => [s.title, s.price])), offers: DEFAULT_OFFERS.map(o => ({ id: o.id, title: o.title, price: o.price, discount: o.discount, active: true })), customLabels: {},
});

interface Props {
  onSelectService: (serviceTitle: string, regType?: RegistrationType) => void;
  onNavigateToCustomer: (initialSpecialty?: string) => void;
  onNavigateToTechnician: () => void;
  onNavigateToOperations: () => void;
  onNavigateToSovereign: () => void;
  onNavigateToRegister: (serviceTitle?: string, type?: RegistrationType) => void;
  switches: PlatformSwitches;
  customization?: PageSupervisorConfig;
}

export const ManagedLandingView: React.FC<Props> = (props) => {
  const config = props.customization?.page === 'landing' ? props.customization : defaultConfig();
  const prices = config.servicePrices || {};
  const services = useMemo(() => DEFAULT_SERVICES.map(service => ({ ...service, price: prices[service.title] ?? service.price })), [prices]);
  const offers = useMemo(() => {
    const configured = (config.offers || []).filter(o => o.active);
    return configured.length ? configured.map(o => ({ ...o, price: o.price ?? 0, discount: o.discount || 'عرض خاص', service: o.title })) : DEFAULT_OFFERS;
  }, [config.offers]);

  const label = (key: string, fallback: string) => config.customLabels?.[key] || fallback;
  const money = (value: number) => `${value.toLocaleString('ar-SA')} ر.س`;

  return (
    <div data-landing-managed="true" style={{ ['--landing-primary' as string]: config.primaryColor, ['--landing-accent' as string]: config.accentColor }}>
      <style>{`
        [data-landing-managed="true"] .landing-source > div > section:nth-of-type(1),
        [data-landing-managed="true"] .landing-source > div > section:nth-of-type(2),
        [data-landing-managed="true"] .landing-source > div > section:nth-of-type(3) { display: none; }
      `}</style>

      {config.enabled && config.showAnnouncements && (
        <div className="mb-5 rounded-2xl border border-[#bccac0]/25 bg-white px-4 py-3 shadow-sm flex items-center gap-2" style={{ color: config.primaryColor }}>
          <Tag className="h-4 w-4 shrink-0" />
          <span className="text-xs font-bold">{label('announcement', 'إعلانات ومناسبات الصفحة مفعلة من لوحة مشرف الرئيسية')}</span>
        </div>
      )}

      {config.enabled && config.showHero && (
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 mb-10 border border-[#bccac0]/25 shadow-sm" style={{ background: `${config.primaryColor}10` }}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 relative z-10">
            <div className="w-full lg:w-7/12 flex flex-col items-start gap-4 text-right">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-xs border border-[#bccac0]/30 text-xs sm:text-sm font-bold" style={{ color: config.primaryColor }}>
                <Zap className="w-4 h-4" /> {config.pageTitle}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c30] tracking-tight leading-tight">{config.heroTitle}</h1>
              <p className="text-sm sm:text-base text-[#3d4a42] max-w-2xl leading-relaxed">{config.heroText}</p>
              <p className="text-xs sm:text-sm text-[#565e74] max-w-2xl">{config.pageSubtitle}</p>
              {config.showQuickActions && config.visibleButtons.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {config.visibleButtons.map((button, index) => {
                    const action = button.includes('فني') || button.includes('شريك') ? () => props.onNavigateToRegister(undefined, 'technician') : button.includes('متابعة') ? () => props.onNavigateToCustomer() : () => props.onNavigateToRegister('صيانة مكيفات وتبريد', 'guest');
                    return <button key={`${button}-${index}`} onClick={action} className="inline-flex items-center gap-2 px-6 h-11 rounded-full text-white font-bold text-xs shadow-md" style={{ background: index === 0 ? config.primaryColor : '#0b1c30' }}><ArrowLeft className="w-4 h-4" />{button}</button>;
                  })}
                </div>
              )}
            </div>
            {config.showGraphics && (
              <div className="w-full lg:w-5/12 relative">
                {config.heroImageUrl ? <img src={config.heroImageUrl} alt={config.pageTitle} className="w-full h-72 sm:h-80 object-cover rounded-3xl shadow-xl" /> : <div className="h-72 sm:h-80 rounded-3xl bg-white border border-[#bccac0]/25 shadow-xl flex items-center justify-center" style={{ color: config.primaryColor }}><ImageIcon className="w-20 h-20 opacity-30" /></div>}
              </div>
            )}
          </div>
        </section>
      )}

      {config.enabled && config.showOffers && offers.length > 0 && (
        <section className="mb-14" id="managed-offers">
          <div className="flex items-end justify-between mb-6 gap-3"><div><div className="flex items-center gap-2 mb-1" style={{ color: config.primaryColor }}><Tag className="w-4 h-4"/><span className="text-xs font-bold">{label('offersLabel', 'باقات التوفير والعروض الموسمية')}</span></div><h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">{label('offersTitle', 'العروض الحالية')}</h2></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {offers.map(offer => <div key={offer.id} className="bg-white p-6 rounded-3xl border border-[#bccac0]/30 shadow-xs flex flex-col justify-between"><span className="self-start text-xs font-bold text-white px-3 py-1 rounded-full" style={{ background: config.primaryColor }}>{offer.discount}</span><div><h3 className="text-base sm:text-lg font-bold text-[#0b1c30] my-3">{offer.title}</h3><p className="text-xs text-[#565e74] leading-relaxed">{label(`offer-${offer.id}`, 'عرض متاح للحجز من الصفحة الرئيسية.')}</p></div><div className="pt-4 border-t border-gray-100 flex items-center justify-between"><span className="text-lg font-bold" style={{ color: config.primaryColor }}>{money(offer.price)}</span><button type="button" onClick={() => props.onSelectService(offer.service || offer.title, 'guest')} className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5" style={{ background: config.primaryColor }}>احجز العرض <ArrowLeft className="w-3.5 h-3.5"/></button></div></div>)}
          </div>
        </section>
      )}

      {config.enabled && config.showServices && (
        <section className="mb-14">
          <div className="mb-8"><span className="text-xs sm:text-sm font-bold block mb-1" style={{ color: config.primaryColor }}>تخصصات الصيانة والتشغيل</span><h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30]">{label('servicesTitle', 'اختر الخدمة')}</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => <div key={service.id} onClick={() => props.onSelectService(service.title, 'guest')} className="group bg-white p-5 rounded-2xl border border-[#bccac0]/25 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"><div><div className="flex items-center justify-between mb-3"><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${config.primaryColor}15`, color: config.primaryColor }}><Briefcase className="w-6 h-6"/></div><span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-xs font-bold" style={{ color: config.primaryColor }}>متاح</span></div><h3 className="text-base font-bold text-[#0b1c30] mb-1">{service.title}</h3><p className="text-xs text-[#565e74] mb-3 leading-relaxed">{service.subtitle}</p></div><div className="pt-3 border-t border-gray-100 flex items-center justify-between"><div><span className="text-[11px] text-[#565e74] block">تبدأ من:</span>{config.showPricing ? <span className="text-sm font-bold" style={{ color: config.primaryColor }}>{money(service.price)}</span> : <span className="text-sm font-bold text-[#565e74]">السعر عند الطلب</span>}</div><button type="button" className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold" style={{ background: config.primaryColor }}>طلب فوري</button></div></div>)}
          </div>
        </section>
      )}

      <div className="landing-source">
        <LandingView {...props} />
      </div>
    </div>
  );
};
