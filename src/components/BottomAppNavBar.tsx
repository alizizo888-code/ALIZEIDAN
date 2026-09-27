import React from 'react';
import { Home, Tag, Wrench, ShoppingBag, UserCheck, Shield } from 'lucide-react';

export type AppNavTab = 'home' | 'offers' | 'services' | 'orders' | 'account';

interface BottomAppNavBarProps {
  activeTab: AppNavTab;
  onChangeTab: (tab: AppNavTab) => void;
  ordersCount?: number;
  role?: 'customer' | 'technician' | 'guest';
}

export const BottomAppNavBar: React.FC<BottomAppNavBarProps> = ({
  activeTab,
  onChangeTab,
  ordersCount = 0,
  role = 'customer',
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#bccac0]/30 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] py-1.5 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around" dir="rtl">
        
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => {
            onChangeTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#006948] font-bold scale-105'
              : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'home' ? 'bg-[#006948]/10' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">الرئيسية</span>
        </button>

        {/* Tab 2: Offers & Promotions */}
        <button
          type="button"
          onClick={() => {
            onChangeTab('offers');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'offers'
              ? 'text-[#006948] font-bold scale-105'
              : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'offers' ? 'bg-[#006948]/10' : ''}`}>
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">العروض</span>
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#825100]"></span>
        </button>

        {/* Tab 3: Services */}
        <button
          type="button"
          onClick={() => {
            onChangeTab('services');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'text-[#006948] font-bold scale-105'
              : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'services' ? 'bg-[#006948]/10' : ''}`}>
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">الخدمات</span>
        </button>

        {/* Tab 4: Orders / Tasks */}
        <button
          type="button"
          onClick={() => {
            onChangeTab('orders');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'orders'
              ? 'text-[#006948] font-bold scale-105'
              : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'orders' ? 'bg-[#006948]/10' : ''}`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">
            {role === 'technician' ? 'المهام' : 'طلباتي'}
          </span>
          {ordersCount > 0 && (
            <span className="absolute top-1 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#006948] text-white text-[10px] font-bold flex items-center justify-center">
              {ordersCount}
            </span>
          )}
        </button>

        {/* Tab 5: Account / Profile */}
        <button
          type="button"
          onClick={() => {
            onChangeTab('account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'account'
              ? 'text-[#006948] font-bold scale-105'
              : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'account' ? 'bg-[#006948]/10' : ''}`}>
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 leading-tight">الحساب</span>
        </button>

      </div>
    </div>
  );
};
