import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GeminiCommandCenter } from './components/GeminiCommandCenter';
import { LandingView } from './components/modules/LandingView';
import { RegistrationView } from './components/modules/RegistrationView';
import { CustomerPortalView } from './components/modules/CustomerPortalView';
import { TechnicianPortalView } from './components/modules/TechnicianPortalView';
import { OperationsHubView } from './components/modules/OperationsHubView';
import { SovereignConsoleView } from './components/modules/SovereignConsoleView';
import { AdminCmsView } from './components/modules/AdminCmsView';
import { ZatcaInvoiceModal } from './components/modals/ZatcaInvoiceModal';
import { ThreeWayCallModal } from './components/modals/ThreeWayCallModal';
import { SqlSchemaModal } from './components/modals/SqlSchemaModal';
import { RegistrationType, WorkOrder } from './types';

export default function App() {
  const store = useAppStore();
  const [isZatcaModalOpen, setIsZatcaModalOpen] = useState(false);
  const [isThreeWayCallOpen, setIsThreeWayCallOpen] = useState(false);
  const [sqlModalMode, setSqlModalMode] = useState<'sql' | 'workflow' | null>(null);
  const [initialCustomerSpecialty, setInitialCustomerSpecialty] = useState<string | undefined>(undefined);
  const [initialRegisterService, setInitialRegisterService] = useState<string>('صيانة وتكييف مركزي وسبليت');
  const [initialRegisterType, setInitialRegisterType] = useState<RegistrationType>('guest');

  const handleNavigateToCustomer = (specialty?: string) => {
    if (specialty) setInitialCustomerSpecialty(specialty);
    store.setActiveModule('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (serviceTitle: string, regType: RegistrationType = 'guest') => {
    setInitialRegisterService(serviceTitle);
    setInitialRegisterType(regType);
    store.setActiveModule('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRegister = (serviceTitle?: string, type: RegistrationType = 'guest') => {
    if (serviceTitle) setInitialRegisterService(serviceTitle);
    setInitialRegisterType(type);
    store.setActiveModule('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCreatedFromRegister = (order: Partial<WorkOrder>) => {
    store.addNewOrder(order);
    store.setActiveModule('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAiCreateOrder = (order: Partial<WorkOrder>) => {
    store.addNewOrder(order);
    store.setActiveModule('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    store.setActiveModule('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans" dir="rtl">
      <Header activeModule={store.activeModule} setActiveModule={store.setActiveModule} switches={store.switches} onOpenZatcaModal={() => setIsZatcaModalOpen(true)} />
      <Sidebar activeModule={store.activeModule} setActiveModule={store.setActiveModule} onOpenZatcaModal={() => setIsZatcaModalOpen(true)} onOpenSqlModal={() => setSqlModalMode('sql')} onOpenWorkflowModal={() => setSqlModalMode('workflow')} />
      <div className="w-full pr-0 lg:pr-64 pt-20 transition-all duration-200">
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 min-h-[calc(100vh-80px)]">
          {store.activeModule === 'landing' && <LandingView onSelectService={handleSelectService} onNavigateToCustomer={handleNavigateToCustomer} onNavigateToTechnician={() => store.setActiveModule('technician')} onNavigateToOperations={() => store.setActiveModule('operations')} onNavigateToSovereign={() => store.setActiveModule('sovereign')} onNavigateToRegister={handleNavigateToRegister} switches={store.switches} />}
          {store.activeModule === 'register' && <RegistrationView initialService={initialRegisterService} initialType={initialRegisterType} onBackToHome={handleBackToHome} onOrderCreated={handleOrderCreatedFromRegister} onNavigateToTechnician={() => { store.setActiveModule('technician'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} switches={store.switches} />}
          {store.activeModule === 'customer' && <CustomerPortalView orders={store.orders} customerWallet={store.customerWallet} loyaltyPoints={store.loyaltyPoints} switches={store.switches} onAddOrder={store.addNewOrder} onOpenZatcaModal={() => setIsZatcaModalOpen(true)} initialSpecialty={initialCustomerSpecialty} onBackToHome={handleBackToHome} onNavigateToRegister={(srv) => handleNavigateToRegister(srv, 'customer')} />}
          {store.activeModule === 'technician' && <TechnicianPortalView orders={store.orders} techs={store.techs} techWallet={store.techWallet} techCashHand={store.techCashHand} switches={store.switches} onVerifySafeOtp={store.verifySafeOtp} onCompleteOrder={store.completeOrder} onAddOrder={store.addNewOrder} onBackToHome={handleBackToHome} />}
          {store.activeModule === 'operations' && <OperationsHubView orders={store.orders} techs={store.techs} onResolveDispute={store.resolveDispute} onOpenZatcaModal={() => setIsZatcaModalOpen(true)} onBackToHome={handleBackToHome} />}
          {store.activeModule === 'sovereign' && <SovereignConsoleView switches={store.switches} toggleSwitch={store.toggleSwitch} platformCommission={store.platformCommission} adjustCommission={store.adjustCommission} orders={store.orders} techs={store.techs} timeLocks={store.timeLocks} chatMessages={store.chatMessages} onAddChatMessage={store.addChatMessage} onApproveTimeLock={store.approveTimeLock} onResolveDispute={store.resolveDispute} onOpenThreeWayCall={() => setIsThreeWayCallOpen(true)} onOpenZatcaModal={() => setIsZatcaModalOpen(true)} onBackToHome={handleBackToHome} />}
          {store.activeModule === 'admin_cms' && <AdminCmsView onBackToHome={handleBackToHome} customization={store.siteCustomization} onUpdateCustomization={store.updateCustomization} />}
        </main>
      </div>
      <GeminiCommandCenter orders={store.orders} techs={store.techs} onCreateOrder={handleAiCreateOrder} onNavigate={(target) => store.setActiveModule(target)} />
      <ZatcaInvoiceModal isOpen={isZatcaModalOpen} onClose={() => setIsZatcaModalOpen(false)} order={store.orders[0]} />
      <ThreeWayCallModal isOpen={isThreeWayCallOpen} onClose={() => setIsThreeWayCallOpen(false)} />
      <SqlSchemaModal isOpen={sqlModalMode !== null} onClose={() => setSqlModalMode(null)} mode={sqlModalMode || 'sql'} />
    </div>
  );
}
