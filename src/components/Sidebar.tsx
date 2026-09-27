import React from 'react';
import {
  LayoutDashboard,
  Users,
  Sliders,
  FileText,
  ShieldCheck,
  Database,
  Workflow,
  Sparkles,
  Home,
  Zap,
  Activity,
  ClipboardList,
  Wrench,
  Smartphone,
  ShieldAlert,
} from 'lucide-react';
import { AppModule } from '../types';

interface SidebarProps {
  activeModule: AppModule;
  setActiveModule: (module: AppModule) => void;
  onOpenZatcaModal: () => void;
  onOpenSqlModal: () => void;
  onOpenWorkflowModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  onOpenZatcaModal,
  onOpenSqlModal,
  onOpenWorkflowModal,
}) => {
  const isBackOfficeView =
    activeModule === 'sovereign' ||
    activeModule === 'operations' ||
    activeModule === 'admin_cms';

  return (
    <aside className="hidden lg:flex fixed right-0 top-0 h-full w-64 bg-[#eff4ff] z-40 flex-col pt-24 pb-6 border-l border-[#bccac0]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
      
      {/* Header section indicator */}
      <div className="px-6 mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#3d4a42] uppercase tracking-wider block">
          {isBackOfficeView ? 'منظومة الإدارة والإشراف العام' : 'منظومة التطبيق والتشغيل'}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            isBackOfficeView ? 'bg-[#825100]' : 'bg-[#006948]'
          } animate-pulse`}
        ></span>
      </div>

      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-thin">
        
        {/* BACK-OFFICE / CONSOLE MODE NAVIGATION */}
        {isBackOfficeView ? (
          <>
            <div className="text-[10px] font-bold text-[#565e74] px-3 pt-1 pb-1">
              لوحات التحكم والإشراف المؤسسي:
            </div>

            {/* 1. Sovereign Console */}
            <button
              onClick={() => setActiveModule('sovereign')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors gap-3 text-right cursor-pointer ${
                activeModule === 'sovereign'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>الكونسول السيادي والمالك</span>
            </button>

            {/* 2. Operations & Fleet Hub */}
            <button
              onClick={() => setActiveModule('operations')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors gap-3 text-right cursor-pointer ${
                activeModule === 'operations'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>غرفة العمليات وتوجيه الأسطول</span>
            </button>

            {/* 3. Admin CMS & Site Supervisor */}
            <button
              onClick={() => setActiveModule('admin_cms')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors gap-3 text-right cursor-pointer ${
                activeModule === 'admin_cms'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>بوابة التعديل والإشراف الإداري</span>
            </button>

            <div className="pt-2 pb-1 px-3">
              <div className="h-px bg-[#bccac0]/30"></div>
            </div>

            <div className="text-[10px] font-bold text-[#565e74] px-3 pt-1 pb-1">
              متابعة المهام والأوردرات الميدانية:
            </div>

            {/* In-Console Tasks Tracking (Does not switch away from admin, operates in Operations Hub) */}
            <button
              onClick={() => setActiveModule('operations')}
              className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 shrink-0 text-[#006948]" />
              <span>متابعة أوردرات وحملات العملاء</span>
            </button>

            <button
              onClick={() => setActiveModule('operations')}
              className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
            >
              <Activity className="w-4 h-4 shrink-0 text-[#825100]" />
              <span>متابعة مهام وتحركات الفنيين</span>
            </button>

            <div className="pt-2 pb-1 px-3">
              <div className="h-px bg-[#bccac0]/30"></div>
            </div>

            {/* Switch back to App Experience */}
            <div className="px-3 pt-1">
              <button
                onClick={() => setActiveModule('landing')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-[#bccac0]/30 text-xs font-bold text-[#006948] hover:bg-gray-50 shadow-xs cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>معاينة واجهة التطبيق</span>
              </button>
            </div>
          </>
        ) : (
          /* APP-STYLE PORTAL SIDEBAR */
          <>
            <button
              onClick={() => setActiveModule('landing')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors gap-3 text-right cursor-pointer ${
                activeModule === 'landing'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              <Home className="w-5 h-5 shrink-0" />
              <span>الرئيسية (تطبيق الصيانة)</span>
            </button>

            <button
              onClick={() => setActiveModule('register')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors gap-3 text-right cursor-pointer ${
                activeModule === 'register'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              <Zap className="w-5 h-5 shrink-0 text-[#006948]" />
              <span>طلب خدمة وتسجيل ذكي</span>
            </button>

            <button
              onClick={() => setActiveModule('customer')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors gap-3 text-right cursor-pointer ${
                activeModule === 'customer'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>تطبيق العميل والمستفيدين</span>
            </button>

            <button
              onClick={() => setActiveModule('technician')}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors gap-3 text-right cursor-pointer ${
                activeModule === 'technician'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              <Wrench className="w-5 h-5 shrink-0" />
              <span>تطبيق الفنيين ومزودي الخدمة</span>
            </button>

            <div className="pt-2 pb-1 px-3">
              <div className="h-px bg-[#bccac0]/30"></div>
            </div>

            <div className="text-[10px] font-bold text-[#565e74] px-3 pt-1 pb-1">
              الكونسول الإداري والمؤسسي:
            </div>

            <button
              onClick={() => setActiveModule('operations')}
              className="w-full flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
            >
              <Users className="w-4 h-4 shrink-0 text-[#006948]" />
              <span>غرفة العمليات والأسطول</span>
            </button>

            <button
              onClick={() => setActiveModule('sovereign')}
              className="w-full flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-[#213145]" />
              <span>الكونسول السيادي والمالك</span>
            </button>

            <button
              onClick={() => setActiveModule('admin_cms')}
              className="w-full flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
            >
              <Sliders className="w-4 h-4 shrink-0 text-[#825100]" />
              <span>بوابة التعديل والإشراف الإداري</span>
            </button>
          </>
        )}

        <div className="pt-2 pb-1 px-3">
          <div className="h-px bg-[#bccac0]/30"></div>
        </div>

        {/* Global Compliance & Tools */}
        <button
          onClick={onOpenZatcaModal}
          className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
        >
          <FileText className="w-4 h-4 shrink-0 text-[#825100]" />
          <span>الفاتورة الإلكترونية ZATCA</span>
        </button>

        <button
          onClick={onOpenSqlModal}
          className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
        >
          <Database className="w-4 h-4 shrink-0 text-[#006948]" />
          <span>مخطط PostgreSQL و Supabase</span>
        </button>

        <button
          onClick={onOpenWorkflowModal}
          className="w-full flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-[#3d4a42] hover:bg-[#dce9ff] hover:text-[#0b1c30] transition-colors gap-3 text-right cursor-pointer"
        >
          <Workflow className="w-4 h-4 shrink-0 text-[#825100]" />
          <span>أتمتة n8n و WhatsApp API</span>
        </button>
      </nav>

      {/* Security Assurance Badge */}
      <div className="px-4 mt-auto pt-3 bg-[#e5eeff]/60 rounded-xl mx-3 border border-[#bccac0]/20">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-[#006948] shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-[#0b1c30] font-bold">
              إشراف: م. علي طلعت زيدان
            </span>
            <span className="text-[10px] text-[#3d4a42]">
              مؤسسة أكسجين للمقاولات
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
