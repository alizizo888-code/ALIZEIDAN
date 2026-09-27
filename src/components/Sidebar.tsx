import React from 'react';
import { LayoutDashboard, Sliders, FileText, ShieldCheck, Database, Workflow, Sparkles, Home, Zap, Wrench, Palette, Users, Settings2 } from 'lucide-react';
import { AppModule } from '../types';
interface SidebarProps { activeModule: AppModule; setActiveModule: (module: AppModule) => void; onOpenZatcaModal: () => void; onOpenSqlModal: () => void; onOpenWorkflowModal: () => void; }
export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, onOpenZatcaModal, onOpenSqlModal, onOpenWorkflowModal }) => {
  const Item = ({ module, icon, children }: { module: AppModule; icon: React.ReactNode; children: React.ReactNode }) => <button onClick={() => setActiveModule(module)} className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold gap-3 text-right cursor-pointer ${activeModule === module ? 'bg-[#006948] text-white shadow-sm' : 'text-[#3d4a42] hover:bg-[#dce9ff]'}`}>{icon}<span>{children}</span></button>;
  return <aside className="hidden lg:flex fixed right-0 top-0 h-full w-64 bg-[#eff4ff] z-40 flex-col pt-24 pb-6 border-l border-[#bccac0]/30 shadow-sm select-none">
    <div className="px-6 mb-3 flex items-center justify-between"><span className="text-[11px] font-bold text-[#3d4a42]">منظومة مُتقِن</span><span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse" /></div>
    <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
      <Item module="landing" icon={<Home className="w-5 h-5" />}>الرئيسية</Item>
      <Item module="register" icon={<Zap className="w-5 h-5" />}>طلب خدمة وتسجيل</Item>
      <Item module="customer" icon={<Sparkles className="w-5 h-5" />}>صفحة العميل</Item>
      <Item module="technician" icon={<Wrench className="w-5 h-5" />}>صفحة الفني</Item>
      <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-[#565e74]">مشرف كل واجهة</div>
      <Item module="supervisor_landing" icon={<Palette className="w-4 h-4" />}>تعديل الرئيسية</Item>
      <Item module="supervisor_customer" icon={<Settings2 className="w-4 h-4" />}>مشرف واجهة العميل</Item>
      <Item module="supervisor_technician" icon={<Settings2 className="w-4 h-4" />}>مشرف واجهة الفني</Item>
      <Item module="operations" icon={<Users className="w-4 h-4" />}>صفحة مشرف العمليات</Item>
      <Item module="supervisor_operations" icon={<Settings2 className="w-4 h-4" />}>مشرف واجهة العمليات</Item>
      <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-[#565e74]">الإدارة العليا</div>
      <Item module="sovereign" icon={<LayoutDashboard className="w-4 h-4" />}>المالك</Item>
      <Item module="admin_cms" icon={<Sliders className="w-4 h-4" />}>الإداري العام</Item>
      <div className="pt-3 pb-1 px-3"><div className="h-px bg-[#bccac0]/30" /></div>
      <button onClick={onOpenZatcaModal} className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] gap-3 text-right"><FileText className="w-4 h-4 text-[#825100]" /><span>الفاتورة الإلكترونية ZATCA</span></button>
      <button onClick={onOpenSqlModal} className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] gap-3 text-right"><Database className="w-4 h-4 text-[#006948]" /><span>قاعدة البيانات</span></button>
      <button onClick={onOpenWorkflowModal} className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] gap-3 text-right"><Workflow className="w-4 h-4 text-[#825100]" /><span>n8n و WhatsApp</span></button>
    </nav>
    <div className="px-4 mt-auto pt-3 bg-[#e5eeff]/60 rounded-xl mx-3 border border-[#bccac0]/20"><div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-[#006948]" /><div><span className="text-xs text-[#0b1c30] font-bold">تحكم مرتبط بالصفحات</span><span className="text-[10px] text-[#3d4a42] block">كل واجهة لها مشرف تحرير</span></div></div></div>
  </aside>;
};
