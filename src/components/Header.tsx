import React from 'react';
import { Shield, Bell, CheckCircle2, AlertTriangle, Key, Zap, Sliders } from 'lucide-react';
import { PlatformSwitches, AppModule } from '../types';

interface HeaderProps {
  activeModule: AppModule;
  setActiveModule: (module: AppModule) => void;
  switches: PlatformSwitches;
  onOpenZatcaModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  setActiveModule,
  switches,
  onOpenZatcaModal,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#ffffff]/90 backdrop-blur-xl border-b border-[#bccac0]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Emergency Kill-Switch Alert Banner if activated */}
      {switches.emergencyKillSwitch && (
        <div className="bg-[#ba1a1a] text-white px-4 py-1.5 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          <span>تنبيه سيادي طارئ: تم تفعيل قفل الصيانة الطارئة (Kill-Switch). تم تجميد الحجوزات والتحويلات الميدانية مؤقتاً بأمر الإدارة.</span>
        </div>
      )}

      <div className="h-20 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Sovereign Supervision Lockup */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveModule('landing')}
            className="flex items-center gap-2.5 text-right focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#006948] flex items-center justify-center text-white font-bold text-xl shadow-md">
              م
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#0b1c30] tracking-tight leading-tight">
                مُتقن للصيانة
              </span>
              <span className="text-[11px] text-[#3d4a42] leading-none">
                أكسجين للصيانة والمقاولات العامة
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-2 bg-[#eff4ff] px-3 py-1 rounded-full text-xs text-[#3d4a42]">
            <span className="w-2 h-2 rounded-full bg-[#006948] animate-pulse"></span>
            <span className="font-semibold text-[#006948]">المنظومة السيادية نشطة</span>
            <span className="text-[#bccac0]">•</span>
            <span>إشراف: م. علي طلعت زيدان</span>
          </div>
        </div>

        {/* Center Portal Switcher Navigation */}
        <nav className="hidden lg:flex items-center bg-[#e5eeff] p-1 rounded-full shadow-inner text-sm">
          <button
            onClick={() => setActiveModule('sovereign')}
            className={`px-3.5 py-2 rounded-full transition-all font-semibold flex items-center gap-1.5 ${
              activeModule === 'sovereign'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#0b1c30]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>المالك السيادي</span>
          </button>

          <button
            onClick={() => setActiveModule('admin_cms')}
            className={`px-3.5 py-2 rounded-full transition-all font-semibold flex items-center gap-1.5 ${
              activeModule === 'admin_cms'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#0b1c30]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>التعديل والإشراف</span>
          </button>

          <button
            onClick={() => setActiveModule('operations')}
            className={`px-3.5 py-2 rounded-full transition-all font-semibold flex items-center gap-1.5 ${
              activeModule === 'operations'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#0b1c30]'
            }`}
          >
            <span>غرفة العمليات</span>
          </button>

          <button
            onClick={() => setActiveModule('technician')}
            className={`px-3.5 py-2 rounded-full transition-all font-semibold flex items-center gap-1.5 ${
              activeModule === 'technician'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#0b1c30]'
            }`}
          >
            <span>بوابة الفنيين</span>
          </button>

          <button
            onClick={() => setActiveModule('customer')}
            className={`px-3.5 py-2 rounded-full transition-all font-semibold flex items-center gap-1.5 ${
              activeModule === 'customer'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#0b1c30]'
            }`}
          >
            <span>بوابة العميل</span>
          </button>

          <button
            onClick={() => setActiveModule('register')}
            className={`px-3 py-2 rounded-full transition-all font-semibold flex items-center gap-1.5 ${
              activeModule === 'register'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#0b1c30]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#006948]" />
            <span>طلب / تسجيل</span>
          </button>

          <button
            onClick={() => setActiveModule('landing')}
            className={`px-3 py-2 rounded-full transition-all font-semibold flex items-center gap-1.5 ${
              activeModule === 'landing'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'text-[#3d4a42] hover:text-[#0b1c30]'
            }`}
          >
            <span>الرئيسية</span>
          </button>
        </nav>

        {/* Left Side Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenZatcaModal}
            className="hidden md:flex items-center gap-1.5 bg-[#ffddb8]/40 hover:bg-[#ffddb8]/70 px-3 py-1.5 rounded-full text-[#653e00] text-xs font-bold transition-colors cursor-pointer"
            title="فحص الامتثال مع هيئة الزكاة والضريبة والجمارك (المرحلة الثانية)"
          >
            <CheckCircle2 className="w-4 h-4 text-[#825100]" />
            <span>ربط ZATCA معتمد</span>
          </button>

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center justify-center text-[#3d4a42] hover:text-[#0b1c30] transition-colors relative"
            title="التنبيهات الميدانية"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#006948]"></span>
          </button>

          {/* Profile Badge */}
          <div
            onClick={() => setActiveModule('sovereign')}
            className="flex items-center gap-2 cursor-pointer bg-[#eff4ff] hover:bg-[#e5eeff] p-1.5 pr-2.5 rounded-full transition-colors"
            title="الملف السيادي - م. علي طلعت زيدان"
          >
            <div className="w-7 h-7 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-xs">
              ع
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-[#0b1c30]">
              م. علي زيدان
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Portal Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-[#eff4ff] border-t border-[#bccac0]/20 px-2 py-1 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveModule('sovereign')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
            activeModule === 'sovereign' ? 'bg-[#006948] text-white' : 'text-[#3d4a42]'
          }`}
        >
          المالك السيادي
        </button>
        <button
          onClick={() => setActiveModule('admin_cms')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
            activeModule === 'admin_cms' ? 'bg-[#006948] text-white' : 'text-[#3d4a42]'
          }`}
        >
          التعديل والإشراف
        </button>
        <button
          onClick={() => setActiveModule('operations')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
            activeModule === 'operations' ? 'bg-[#006948] text-white' : 'text-[#3d4a42]'
          }`}
        >
          غرفة العمليات
        </button>
        <button
          onClick={() => setActiveModule('technician')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
            activeModule === 'technician' ? 'bg-[#006948] text-white' : 'text-[#3d4a42]'
          }`}
        >
          فني الميدان
        </button>
        <button
          onClick={() => setActiveModule('customer')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
            activeModule === 'customer' ? 'bg-[#006948] text-white' : 'text-[#3d4a42]'
          }`}
        >
          بوابة العميل
        </button>
        <button
          onClick={() => setActiveModule('register')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
            activeModule === 'register' ? 'bg-[#006948] text-white' : 'text-[#3d4a42]'
          }`}
        >
          طلب خدمة / تسجيل
        </button>
        <button
          onClick={() => setActiveModule('landing')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
            activeModule === 'landing' ? 'bg-[#006948] text-white' : 'text-[#3d4a42]'
          }`}
        >
          الرئيسية
        </button>
      </div>
    </header>
  );
};
