import React, { useMemo, useState } from 'react';
import { EyeOff, Image as ImageIcon, Palette, Save, Tag, ToggleLeft, ToggleRight, ArrowRight, Trash2 } from 'lucide-react';
import { PageSupervisorConfig, SiteCustomization, SupervisedPage } from '../../types';

const PAGE_META: Record<SupervisedPage, { title: string; label: string }> = {
  landing: { title: 'مشرف واجهة الرئيسية', label: 'الرئيسية' },
  customer: { title: 'مشرف واجهة العميل', label: 'العميل' },
  technician: { title: 'مشرف واجهة الفني', label: 'الفني' },
  operations: { title: 'مشرف واجهة العمليات', label: 'مشرف العمليات' },
};

const LANDING_SERVICE_PRICES: Record<string, number> = {
  'صيانة مكيفات وتبريد': 180, 'تركيب مكيفات جديدة': 220, 'غسيل وتنظيف مكيفات': 120,
  'صيانة ثلاجات وتبريد': 160, 'سباكة وشبكات مياه': 150, 'كهرباء وأنظمة ذكية': 170,
  'أقفال أمنية ونجارة': 190, 'عقود صيانة دورية': 650, 'شركات مقاولات وتشطيبات': 1200,
};

const LANDING_OFFERS = [
  { id: 'promo-1', title: 'باقة تنظيف وغسيل 3 مكيفات سبليت', price: 235, originalPrice: 360, discount: 'خصم 35%', description: 'غسيل داخلي وخارجي بمضخة ضغط عالي وتعقيم كيميائي مع فحص مجاني.', service: 'غسيل وتنظيف مكيفات', active: true },
  { id: 'promo-2', title: 'فحص كشف تسربات المياه بالموجات فوق الصوتية', price: 150, originalPrice: 200, discount: 'خصم 25%', description: 'كشف إلكتروني متقدم وتقرير إصلاح دون تكسير.', service: 'سباكة وشبكات مياه', active: true },
  { id: 'promo-3', title: 'عقد الصيانة الوقائية السنوي للمنازل والفلل', price: 720, originalPrice: 1200, discount: 'خصم 40%', description: 'زيارات فحص دورية للمكيفات والمضخات واللوحات الكهربائية.', service: 'عقود صيانة دورية', active: true },
];

const defaults = (page: SupervisedPage): PageSupervisorConfig => ({
  page, enabled: true, pageTitle: PAGE_META[page].label, pageSubtitle: 'واجهة قابلة للتحرير بالكامل',
  heroTitle: page === 'landing' ? 'المنظومة الأسرع لخدمات الصيانة والتشغيل الميداني بالمملكة' : PAGE_META[page].title,
  heroText: page === 'landing' ? 'اطلب فني التكييف، السباكة، الكهرباء أو الصيانة الدورية فوراً من منصة مُتقن.' : 'تحكم في المحتوى والواجهة والجرافيكس من لوحة المشرف الخاصة بهذه الصفحة.',
  heroImageUrl: '', primaryColor: '#006948', accentColor: '#85f8c4', showHero: true, showServices: true,
  showPricing: true, showOffers: true, showGraphics: true, showAnnouncements: true, showQuickActions: true,
  visibleButtons: ['طلب خدمة', 'متابعة الطلب', 'تسجيل الدخول'],
  servicePrices: page === 'landing' ? LANDING_SERVICE_PRICES : {}, offers: page === 'landing' ? LANDING_OFFERS : [], customLabels: {},
});

interface Props { page: SupervisedPage; customization: SiteCustomization; onUpdateCustomization: (config: Partial<SiteCustomization>) => void; onBackToHome: () => void; }

export const PageSupervisorView: React.FC<Props> = ({ page, customization, onUpdateCustomization, onBackToHome }) => {
  const current = customization.pageSupervisors?.[page] || defaults(page);
  const [draft, setDraft] = useState<PageSupervisorConfig>(current);
  const [saved, setSaved] = useState(false);
  const [newButton, setNewButton] = useState('');
  const [newOffer, setNewOffer] = useState('');
  const meta = PAGE_META[page];
  const priceRows = useMemo(() => Object.entries(draft.servicePrices), [draft.servicePrices]);
  const set = <K extends keyof PageSupervisorConfig>(key: K, value: PageSupervisorConfig[K]) => setDraft(prev => ({ ...prev, [key]: value }));
  const toggle = (key: keyof PageSupervisorConfig) => set(key, !draft[key] as PageSupervisorConfig[typeof key]);
  const save = () => { const all = { ...(customization.pageSupervisors || {}), [page]: draft }; onUpdateCustomization({ pageSupervisors: all }); localStorage.setItem(`motqan_supervisor_${page}`, JSON.stringify(draft)); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  const addButton = () => { if (!newButton.trim()) return; set('visibleButtons', [...draft.visibleButtons, newButton.trim()]); setNewButton(''); };
  const addOffer = () => { if (!newOffer.trim()) return; set('offers', [...draft.offers, { id: `offer-${Date.now()}`, title: newOffer.trim(), active: true, price: 0, discount: 'عرض خاص', description: '', service: newOffer.trim() }]); setNewOffer(''); };
  const updateOffer = (id: string, patch: Partial<PageSupervisorConfig['offers'][number]>) => set('offers', draft.offers.map(o => o.id === id ? { ...o, ...patch } : o));

  return <div className="w-full pb-20" dir="rtl">
    <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-[#bccac0]/25 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#006948] text-white"><Palette className="h-7 w-7" /></div><div><div className="flex items-center gap-2"><h1 className="text-xl font-black text-[#0b1c30]">{meta.title}</h1><span className="rounded-full bg-[#85f8c4] px-2.5 py-1 text-[10px] font-bold">{meta.label}</span></div><p className="mt-1 text-xs text-[#565e74]">تحكم مستقل في المحتوى والتصميم والأسعار والعروض والجرافيكس.</p></div></div>
      <div className="flex gap-2"><button onClick={onBackToHome} className="rounded-xl bg-[#eff4ff] px-4 py-2 text-xs font-bold text-[#006948]"><ArrowRight className="ml-1 inline h-4 w-4"/>الرئيسية</button><button onClick={save} className="rounded-xl bg-[#006948] px-5 py-2 text-xs font-bold text-white"><Save className="ml-1 inline h-4 w-4"/>حفظ وتطبيق</button></div>
    </header>
    {saved && <div className="mb-5 rounded-2xl bg-[#85f8c4] p-4 text-sm font-bold text-[#002114]">تم حفظ إعدادات مشرف صفحة {meta.label} وتطبيقها على الواجهة.</div>}
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <section className="space-y-4 rounded-3xl border border-[#bccac0]/25 bg-white p-5 shadow-sm xl:col-span-2"><h2 className="font-black text-[#0b1c30]">محتوى الواجهة</h2><div className="grid gap-4 md:grid-cols-2"><Field label="عنوان الصفحة" value={draft.pageTitle} onChange={v => set('pageTitle', v)}/><Field label="العنوان الرئيسي" value={draft.heroTitle} onChange={v => set('heroTitle', v)}/><Field label="الوصف المختصر" value={draft.pageSubtitle} onChange={v => set('pageSubtitle', v)}/><Field label="نص الواجهة" value={draft.heroText} onChange={v => set('heroText', v)}/><Field label="رابط صورة / جرافيكس" value={draft.heroImageUrl} onChange={v => set('heroImageUrl', v)} wide/></div><div className="grid gap-3 md:grid-cols-2"><ColorField label="اللون الأساسي" value={draft.primaryColor} onChange={v => set('primaryColor', v)}/><ColorField label="لون الإبراز" value={draft.accentColor} onChange={v => set('accentColor', v)}/></div></section>
      <section className="space-y-3 rounded-3xl border border-[#bccac0]/25 bg-white p-5 shadow-sm"><h2 className="font-black text-[#0b1c30]">إظهار / إخفاء العناصر</h2>{([['showHero','الواجهة الرئيسية'],['showServices','الخدمات'],['showPricing','الأسعار'],['showOffers','العروض'],['showGraphics','الجرافيكس'],['showAnnouncements','الإعلانات والمناسبات'],['showQuickActions','الأزرار السريعة']] as const).map(([key,label])=><button key={key} onClick={()=>toggle(key)} className="flex w-full items-center justify-between rounded-2xl bg-[#f8f9ff] p-3 text-xs font-bold"><span>{label}</span>{draft[key] ? <ToggleRight className="h-6 w-6 text-[#006948]"/> : <ToggleLeft className="h-6 w-6 text-[#565e74]"/>}</button>)}</section>
      <section className="space-y-4 rounded-3xl border border-[#bccac0]/25 bg-white p-5 shadow-sm"><h2 className="font-black text-[#0b1c30]">الأزرار والاختصارات</h2><div className="flex gap-2"><input value={newButton} onChange={e=>setNewButton(e.target.value)} placeholder="اسم زر جديد" className="min-w-0 flex-1 rounded-xl border p-2 text-xs"/><button onClick={addButton} className="rounded-xl bg-[#006948] px-3 text-white">+</button></div>{draft.visibleButtons.map((b,i)=><div key={`${b}-${i}`} className="flex items-center justify-between rounded-xl bg-[#eff4ff] p-3 text-xs"><span>{b}</span><button onClick={()=>set('visibleButtons',draft.visibleButtons.filter((_,x)=>x!==i))}><EyeOff className="h-4 w-4 text-[#825100]"/></button></div>)}</section>
      <section className="space-y-4 rounded-3xl border border-[#bccac0]/25 bg-white p-5 shadow-sm xl:col-span-2"><h2 className="font-black text-[#0b1c30]">أسعار الخدمات</h2>{priceRows.length===0 && <p className="text-xs text-[#565e74]">لا توجد أسعار معرفة لهذه الواجهة.</p>}{priceRows.map(([name,price])=><div key={name} className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f9ff] p-3"><span className="text-xs font-bold">{name}</span><input type="number" min="0" value={price} onChange={e=>set('servicePrices',{...draft.servicePrices,[name]:Number(e.target.value)})} className="w-28 rounded-xl border p-2 text-xs"/></div>)}</section>
      <section className="space-y-4 rounded-3xl border border-[#bccac0]/25 bg-white p-5 shadow-sm xl:col-span-3"><div className="flex items-center justify-between"><div><h2 className="font-black text-[#0b1c30]">العروض والمناسبات والجرافيكس</h2><p className="text-xs text-[#565e74] mt-1">العرض الآن قابل للتعديل: الاسم، السعر، السعر قبل الخصم، الخصم، الصورة، الوصف، الخدمة والحالة.</p></div><ImageIcon className="h-5 w-5 text-[#006948]"/></div><div className="flex gap-2"><input value={newOffer} onChange={e=>setNewOffer(e.target.value)} placeholder="اسم عرض أو مناسبة جديدة" className="flex-1 rounded-xl border p-2 text-xs"/><button onClick={addOffer} className="rounded-xl bg-[#006948] px-4 text-xs font-bold text-white">إضافة</button></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{draft.offers.map(o=><div key={o.id} className="rounded-2xl bg-[#f8f9ff] p-4 space-y-2"><div className="flex items-center justify-between"><span className="font-bold text-sm">{o.title}</span><button onClick={()=>set('offers',draft.offers.filter(x=>x.id!==o.id))}><Trash2 className="h-4 w-4 text-[#825100]"/></button></div><Field label="اسم العرض" value={o.title} onChange={v=>updateOffer(o.id,{title:v})}/><div className="grid grid-cols-2 gap-2"><NumberField label="السعر" value={o.price ?? 0} onChange={v=>updateOffer(o.id,{price:v})}/><NumberField label="قبل الخصم" value={o.originalPrice ?? 0} onChange={v=>updateOffer(o.id,{originalPrice:v})}/></div><Field label="نسبة / نص الخصم" value={o.discount || ''} onChange={v=>updateOffer(o.id,{discount:v})}/><Field label="رابط صورة العرض" value={o.imageUrl || ''} onChange={v=>updateOffer(o.id,{imageUrl:v})}/><Field label="وصف العرض" value={o.description || ''} onChange={v=>updateOffer(o.id,{description:v})}/><Field label="الخدمة المرتبطة" value={o.service || ''} onChange={v=>updateOffer(o.id,{service:v})}/><label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={o.active} onChange={e=>updateOffer(o.id,{active:e.target.checked})}/><span>ظاهر للزوار</span></label></div>)}</div></section>
    </div>
  </div>;
};

const Field = ({label,value,onChange,wide=false}:{label:string;value:string;onChange:(v:string)=>void;wide?:boolean}) => <label className={wide?'md:col-span-2':''}><span className="mb-1 block text-xs font-bold text-[#565e74]">{label}</span><input value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-[#bccac0]/40 bg-[#f8f9ff] p-3 text-sm outline-none"/></label>;
const NumberField = ({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}) => <label><span className="mb-1 block text-xs font-bold text-[#565e74]">{label}</span><input type="number" min="0" value={value} onChange={e=>onChange(Number(e.target.value))} className="w-full rounded-xl border p-3 text-xs"/></label>;
const ColorField = ({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) => <label><span className="mb-1 block text-xs font-bold text-[#565e74]">{label}</span><div className="flex gap-2"><input type="color" value={value} onChange={e=>onChange(e.target.value)} className="h-11 w-14 rounded-lg"/><input value={value} onChange={e=>onChange(e.target.value)} className="flex-1 rounded-xl border p-3 text-xs"/></div></label>;
