import { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkOrder,
  TechnicianTelemetry,
  PlatformSwitches,
  TimeLockTransaction,
  ChatMessage,
  P2PPartRequest,
  AppModule,
  SiteCustomization,
} from '../types';
import { INITIAL_CUSTOMIZATION } from '../components/modules/AdminCmsView';

export const INITIAL_SWITCHES: PlatformSwitches = {
  paymentMadaApplePay: true,
  hvacServices: true,
  plumbingServices: true,
  electricalServices: true,
  appliancesServices: true,
  technicianRegistration: true,
  stcBankPayouts: true,
  aiVoiceChat: true,
  emergencyKillSwitch: false,
};

export const INITIAL_ORDERS: WorkOrder[] = [
  {
    id: 'wo-1',
    orderNo: '#OXY-9082',
    customerId: 'cust-1',
    customerName: 'سعود بن عبدالله التميمي',
    customerPhone: '0541239870',
    city: 'الرياض',
    district: 'حي النرجس',
    nationalAddress: 'شارع 3481 • فيلا 4 (RYD-7921)',
    serviceCategory: 'hvac',
    serviceTitle: 'غسيل اسبليت داخلي وخارجي + فحص وشحن فريون',
    description: 'المكيف في غرفة المعيشة يصدر صوتاً وتبريده ضعيف مقارنة بالبقية ويحتاج فحص الضغوط.',
    status: 'dispatched',
    safeOtp: '7412',
    technicianId: 'tech-1',
    technicianName: 'فهد الشمري',
    technicianPhone: '0500123456',
    totalCost: 310,
    platformCutPercentage: 18.5,
    platformCutAmount: 57.35,
    technicianCutAmount: 252.65,
    escrowStatus: 'held',
    suctionPressure: 118.4,
    dischargePressure: 365.2,
    deltaT: 11.4,
    compressorCurrent: 8.42,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    zatcaInvoiceNo: 'INV-2025-09082',
    zatcaQrData: 'AQ5PeHlnZW4gRXN0Li4DMTU0MDIwODk...==',
    createdAt: '2025-05-30T10:15:00Z',
    updatedAt: '2025-05-30T10:45:00Z',
    slaMinutesRemaining: 9,
  },
  {
    id: 'wo-2',
    orderNo: '#OXY-9481',
    customerId: 'cust-2',
    customerName: 'فهد بن عبد العزيز السبيعي',
    customerPhone: '0559876543',
    city: 'الرياض',
    district: 'حي الياسمين',
    nationalAddress: 'طريق أنس بن مالك • مبنى 7492',
    serviceCategory: 'hvac',
    serviceTitle: 'غسيل وصيانة تكييف سبليت (3 وحدات) وفحص فريون',
    description: 'تنظيف مكثفات بالبخار وفحص تسريب الغاز بالأشعة فوق البنفسجية.',
    status: 'in_progress',
    safeOtp: '8207',
    technicianId: 'tech-2',
    technicianName: 'م. حسام العتيبي',
    technicianPhone: '0551122334',
    totalCost: 485,
    platformCutPercentage: 18.5,
    platformCutAmount: 89.72,
    technicianCutAmount: 395.28,
    escrowStatus: 'held',
    suctionPressure: 119.1,
    dischargePressure: 320.0,
    deltaT: 12.1,
    compressorCurrent: 8.1,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-05-30T09:00:00Z',
    updatedAt: '2025-05-30T10:30:00Z',
    slaMinutesRemaining: 25,
  },
  {
    id: 'wo-3',
    orderNo: '#OXY-7714',
    customerId: 'cust-1',
    customerName: 'سعود بن عبدالله التميمي',
    customerPhone: '0541239870',
    city: 'الرياض',
    district: 'حي النرجس',
    nationalAddress: 'شارع 3481 • فيلا 4',
    serviceCategory: 'plumbing',
    serviceTitle: 'كشف تسريب وعزل مواسير مياه رئيسية',
    description: 'كشف تسريب صوتي وعزل خط التغذية العلوي.',
    status: 'completed',
    safeOtp: '3391',
    technicianId: 'tech-3',
    technicianName: 'كريم السعد',
    technicianPhone: '0567788990',
    totalCost: 180,
    platformCutPercentage: 18.5,
    platformCutAmount: 33.3,
    technicianCutAmount: 146.7,
    escrowStatus: 'released',
    zatcaInvoiceNo: 'INV-2025-0612',
    zatcaQrData: 'AQ5PeHlnZW4gRXN0Li4DMTU0MDIwODk...==',
    createdAt: '2025-04-14T08:00:00Z',
    updatedAt: '2025-04-14T11:00:00Z',
  },
  {
    id: 'wo-4',
    orderNo: '#OXY-8321',
    customerId: 'cust-3',
    customerName: 'فيلا الدكتورة سارة',
    customerPhone: '0503456789',
    city: 'جدة',
    district: 'حي الشاطئ',
    nationalAddress: 'طريق الكورنيش • فيلا 12',
    serviceCategory: 'plumbing',
    serviceTitle: 'استبدال خط مياه رئيسي وصمام ضغط',
    description: 'ضعف تدفق المياه في الدور الثاني واحتمال تلف الصمام الميكانيكي.',
    status: 'bidding',
    safeOtp: '5514',
    totalCost: 640,
    platformCutPercentage: 18.5,
    platformCutAmount: 118.4,
    technicianCutAmount: 521.6,
    escrowStatus: 'held',
    createdAt: '2025-05-30T10:40:00Z',
    updatedAt: '2025-05-30T10:40:00Z',
    slaMinutesRemaining: 15,
  },
  {
    id: 'wo-5',
    orderNo: '#OXY-8322',
    customerId: 'cust-4',
    customerName: 'مجمع الملقا الطبي',
    customerPhone: '0509988776',
    city: 'الرياض',
    district: 'حي الملقا',
    nationalAddress: 'طريق أنس بن مالك • مبنى العيادات',
    serviceCategory: 'hvac',
    serviceTitle: 'صيانة مكيف مركزي VRF وتغيير فلتر الزيت',
    description: 'توقف مؤقت في الدائرة رقم 2 مع تنبيه في لوحة الإنذار المركزية.',
    status: 'in_progress',
    safeOtp: '9120',
    technicianId: 'tech-4',
    technicianName: 'كريم سالم',
    technicianPhone: '0533344556',
    totalCost: 1850,
    platformCutPercentage: 18.5,
    platformCutAmount: 342.25,
    technicianCutAmount: 1507.75,
    escrowStatus: 'held',
    createdAt: '2025-05-30T10:42:00Z',
    updatedAt: '2025-05-30T10:45:00Z',
    slaMinutesRemaining: 40,
  },
  {
    id: 'wo-6',
    orderNo: '#OXY-4912',
    customerId: 'cust-5',
    customerName: 'برج الجوهرة للأعمال',
    customerPhone: '0542233445',
    city: 'مكة المكرمة',
    district: 'حي العزيزية',
    nationalAddress: 'شارع عبدالله خياط • برج الجوهرة',
    serviceCategory: 'electrical',
    serviceTitle: 'فحص لوحة تحكم ذكية ومعايرة قواطع Schneider',
    description: 'معايرة الأحمال المتوازنة وقواطع الـ ATS الاحتياطية للمصاعد.',
    status: 'completed',
    safeOtp: '1109',
    technicianId: 'tech-5',
    technicianName: 'رامي منصور',
    technicianPhone: '0577788990',
    totalCost: 3200,
    platformCutPercentage: 18.5,
    platformCutAmount: 592,
    technicianCutAmount: 2608,
    escrowStatus: 'released',
    zatcaInvoiceNo: 'INV-2025-4912',
    zatcaQrData: 'AQ5PeHlnZW4gRXN0Li4DMTU0MDIwODk...==',
    createdAt: '2025-05-30T10:30:00Z',
    updatedAt: '2025-05-30T10:45:00Z',
  },
  {
    id: 'wo-7',
    orderNo: '#DISPUTE-108',
    customerId: 'cust-6',
    customerName: 'سعد القحطاني',
    customerPhone: '0554433221',
    city: 'الرياض',
    district: 'حي الصحافة',
    nationalAddress: 'شارع العليا • فيلا 77',
    serviceCategory: 'hvac',
    serviceTitle: 'اعتراض على تسعيرة القطعة البديلة (كومبريسور وضاغط)',
    description: 'العميل يعترض على تسعيرة القطعة البديلة. تقرير الفاحص الميداني يؤكد مطابقة القطعة الأصلية لشهادة سابر.',
    status: 'disputed',
    safeOtp: '4040',
    technicianId: 'tech-1',
    technicianName: 'فهد الشمري',
    totalCost: 1150,
    platformCutPercentage: 18.5,
    platformCutAmount: 212.75,
    technicianCutAmount: 937.25,
    escrowStatus: 'held',
    disputeReason: 'اعتراض على تكلفة القطعة البديلة مقارنة بأسعار السوق',
    disputeAmount: 1150,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-05-29T14:00:00Z',
    updatedAt: '2025-05-30T09:15:00Z',
  },
];

export const INITIAL_TECHS: TechnicianTelemetry[] = [
  {
    technicianId: 'tech-1',
    technicianName: 'م. سمير (تكييف)',
    vehicleNo: 'فان أكسجين #01',
    lat: 24.7891,
    lng: 46.6542,
    heading: 45,
    speed: 42,
    batteryLevel: 92,
    status: 'in_progress',
    city: 'الرياض',
    district: 'حي الملقا والنرجس',
    activeOrderId: '#OXY-9082',
    inventory: {
      freonR410A_cylinders: 2,
      freonR22_cylinders: 1,
      copperCoils_meters: 15,
      capacitors_45_5uF: 4,
      fanMotors: 2,
    },
    bleConnected: true,
  },
  {
    technicianId: 'tech-2',
    technicianName: 'أحمد ناصر (سباكة)',
    vehicleNo: 'فان أكسجين #02',
    lat: 24.7612,
    lng: 46.6214,
    heading: 120,
    speed: 0,
    batteryLevel: 85,
    status: 'in_progress',
    city: 'الرياض',
    district: 'حي العقيق',
    activeOrderId: '#OXY-9481',
    inventory: {
      freonR410A_cylinders: 0,
      freonR22_cylinders: 0,
      copperCoils_meters: 25,
      capacitors_45_5uF: 0,
      fanMotors: 0,
    },
    bleConnected: false,
  },
  {
    technicianId: 'tech-3',
    technicianName: 'محمد السوري',
    vehicleNo: 'فان أكسجين #12',
    lat: 24.795,
    lng: 46.671,
    heading: 90,
    speed: 15,
    batteryLevel: 78,
    status: 'available',
    city: 'الرياض',
    district: 'حي الياسمين',
    inventory: {
      freonR410A_cylinders: 3,
      freonR22_cylinders: 1,
      copperCoils_meters: 10,
      capacitors_45_5uF: 3,
      fanMotors: 1,
    },
    bleConnected: true,
  },
  {
    technicianId: 'tech-4',
    technicianName: 'عصام حسن',
    vehicleNo: 'فان أكسجين #07',
    lat: 24.81,
    lng: 46.685,
    heading: 270,
    speed: 35,
    batteryLevel: 65,
    status: 'in_transit',
    city: 'الرياض',
    district: 'حي الصحافة',
    inventory: {
      freonR410A_cylinders: 1,
      freonR22_cylinders: 2,
      copperCoils_meters: 30,
      capacitors_45_5uF: 5,
      fanMotors: 2,
    },
    bleConnected: true,
  },
  {
    technicianId: 'tech-5',
    technicianName: 'كريم محمود',
    vehicleNo: 'فان أكسجين #18',
    lat: 21.5433,
    lng: 39.1728,
    heading: 180,
    speed: 0,
    batteryLevel: 95,
    status: 'available',
    city: 'جدة',
    district: 'حي الروضة',
    inventory: {
      freonR410A_cylinders: 2,
      freonR22_cylinders: 1,
      copperCoils_meters: 12,
      capacitors_45_5uF: 1,
      fanMotors: 1,
    },
    bleConnected: false,
  },
  {
    technicianId: 'tech-6',
    technicianName: 'رامي منصور',
    vehicleNo: 'فان أكسجين #22',
    lat: 21.4225,
    lng: 39.8262,
    heading: 0,
    speed: 20,
    batteryLevel: 88,
    status: 'in_progress',
    city: 'مكة المكرمة',
    district: 'حي العزيزية',
    activeOrderId: '#OXY-4912',
    inventory: {
      freonR410A_cylinders: 1,
      freonR22_cylinders: 0,
      copperCoils_meters: 8,
      capacitors_45_5uF: 6,
      fanMotors: 3,
    },
    bleConnected: true,
  },
];

export const INITIAL_TIMELOCKS: TimeLockTransaction[] = [
  {
    id: 'tl-1',
    title: 'تحويل مستحقات المقاولات الكبرى',
    recipient: 'شركة التكييف المركزي الدولية',
    amount: 34500,
    initiatedAt: '2025-05-30T06:00:00Z',
    unlocksAt: '2025-05-30T12:00:00Z',
    status: 'locked',
    purpose: 'توريد دفعة ضواغط وشيلرات مجمع الملقا - طلب تأخير أمان زمني 6 ساعات لمصادقة م. علي طلعت زيدان شخصياً',
  },
  {
    id: 'tl-2',
    title: 'مستحقات وكيل فريون Dupont المعتمد',
    recipient: 'مؤسسة التبريد الخليجي للتجارة',
    amount: 18200,
    initiatedAt: '2025-05-29T18:00:00Z',
    unlocksAt: '2025-05-30T00:00:00Z',
    status: 'approved_by_owner',
    purpose: 'شحنة 50 أسطوانة غاز R410A للمنطقة الوسطى والغربية',
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    senderType: 'customer',
    senderName: 'سعد القحطاني (حي الصحافة)',
    text: 'الفني وصل متأخر ربع ساعة ومعه أدوات غير مطابقة لطلب صيانة المكيف المركزي. هل الفحص مشمول بالضمان؟',
    time: '10:32 ص',
  },
  {
    id: 'msg-2',
    senderType: 'ai_assistant',
    senderName: 'المساعد الصوتي الآلي (Oxygen Smart Voice)',
    text: 'أهلاً أستاذ سعد، نعتذر عن التأخير. نعم، فحص مؤسسة أكسجين مشمول بضمان الجودة، والفني يحمل تصنيف معتمد من الإدارة السيادية.',
    time: '10:33 ص',
  },
  {
    id: 'msg-3',
    senderType: 'technician',
    senderName: 'الفني فهد الشمري',
    text: 'تم قياس ضغط غاز الفريون ووجدنا تهريب في الكومبريسور الخارجي وضغط السحب 85 PSI فقط. نقترح استبدال الوصلة النحاسية.',
    time: '10:36 ص',
    audioDuration: '0:24',
  },
];

// Custom hook providing global persistent state
export function useAppStore() {
  const [switches, setSwitches] = useState<PlatformSwitches>(() => {
    const saved = localStorage.getItem('motqan_switches');
    return saved ? JSON.parse(saved) : INITIAL_SWITCHES;
  });

  const [orders, setOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('motqan_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [techs, setTechs] = useState<TechnicianTelemetry[]>(INITIAL_TECHS);
  const [timeLocks, setTimeLocks] = useState<TimeLockTransaction[]>(INITIAL_TIMELOCKS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  
  const [platformCommission, setPlatformCommission] = useState<number>(() => {
    const saved = localStorage.getItem('motqan_commission');
    return saved ? parseFloat(saved) : 18.5;
  });

  const [sovereignKeyUnlocked, setSovereignKeyUnlocked] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<AppModule>('landing');

  // Customer Wallet & State
  const [customerWallet, setCustomerWallet] = useState<number>(450.0);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(1280);

  // Technician Wallet & State
  const [techWallet, setTechWallet] = useState<number>(3420.0);
  const [techCashHand, setTechCashHand] = useState<number>(1850.0);

  // Site Customization & Admin CMS State
  const [siteCustomization, setSiteCustomization] = useState<SiteCustomization>(() => {
    const saved = localStorage.getItem('motqan_customization');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMIZATION;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('motqan_switches', JSON.stringify(switches));
  }, [switches]);

  useEffect(() => {
    localStorage.setItem('motqan_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('motqan_commission', platformCommission.toString());
  }, [platformCommission]);

  useEffect(() => {
    localStorage.setItem('motqan_customization', JSON.stringify(siteCustomization));
  }, [siteCustomization]);

  // Actions
  const updateCustomization = (newConfig: Partial<SiteCustomization>) => {
    setSiteCustomization((prev) => ({ ...prev, ...newConfig }));
  };
  const toggleSwitch = (key: keyof PlatformSwitches) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const adjustCommission = (delta: number) => {
    setPlatformCommission((prev) => {
      const val = Math.max(5, Math.min(40, prev + delta));
      return parseFloat(val.toFixed(1));
    });
  };

  const verifySafeOtp = (orderId: string, enteredOtp: string): boolean => {
    const order = orders.find((o) => o.id === orderId || o.orderNo === orderId);
    if (!order) return false;
    if (order.safeOtp === enteredOtp) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, status: 'in_progress', updatedAt: new Date().toISOString() }
            : o
        )
      );
      return true;
    }
    return false;
  };

  const completeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.orderNo === orderId) {
          const cut = (o.totalCost * platformCommission) / 100;
          const techEarn = o.totalCost - cut;
          setTechWallet((tw) => tw + techEarn);
          return {
            ...o,
            status: 'completed',
            escrowStatus: 'released',
            platformCutPercentage: platformCommission,
            platformCutAmount: parseFloat(cut.toFixed(2)),
            technicianCutAmount: parseFloat(techEarn.toFixed(2)),
            zatcaInvoiceNo: `INV-2025-${Math.floor(1000 + Math.random() * 9000)}`,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );
  };

  const resolveDispute = (orderId: string, action: 'release_to_tech' | 'refund_to_customer') => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.orderNo === orderId) {
          if (action === 'release_to_tech') {
            const cut = (o.totalCost * platformCommission) / 100;
            const techEarn = o.totalCost - cut;
            setTechWallet((tw) => tw + techEarn);
            return {
              ...o,
              status: 'completed',
              escrowStatus: 'released',
              updatedAt: new Date().toISOString(),
            };
          } else {
            setCustomerWallet((cw) => cw + o.totalCost);
            return {
              ...o,
              status: 'cancelled',
              escrowStatus: 'refunded',
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return o;
      })
    );
  };

  const approveTimeLock = (id: string) => {
    setTimeLocks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'approved_by_owner' } : t))
    );
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'time'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const addNewOrder = (newOrderData: Partial<WorkOrder>) => {
    const orderNo = `#OXY-${Math.floor(1000 + Math.random() * 9000)}`;
    const cost = newOrderData.totalCost || 180;
    const cut = (cost * platformCommission) / 100;
    const newOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNo,
      customerId: 'cust-1',
      customerName: newOrderData.customerName || 'سعود بن عبدالله التميمي',
      customerPhone: newOrderData.customerPhone || '0541239870',
      city: (newOrderData.city as any) || 'الرياض',
      district: newOrderData.district || 'حي النرجس',
      nationalAddress: newOrderData.nationalAddress || 'شارع 3481 • فيلا 4',
      serviceCategory: newOrderData.serviceCategory || 'hvac',
      serviceTitle: newOrderData.serviceTitle || 'خدمة صيانة معتمدة',
      description: newOrderData.description || 'طلب صيانة فوري بضمان أكسجين الذهبي',
      status: 'dispatched',
      safeOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      technicianId: 'tech-1',
      technicianName: 'فهد الشمري',
      technicianPhone: '0500123456',
      totalCost: cost,
      platformCutPercentage: platformCommission,
      platformCutAmount: parseFloat(cut.toFixed(2)),
      technicianCutAmount: parseFloat((cost - cut).toFixed(2)),
      escrowStatus: 'held',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaMinutesRemaining: 15,
      ...newOrderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return {
    switches,
    toggleSwitch,
    platformCommission,
    adjustCommission,
    orders,
    techs,
    timeLocks,
    chatMessages,
    addChatMessage,
    verifySafeOtp,
    completeOrder,
    resolveDispute,
    approveTimeLock,
    addNewOrder,
    activeModule,
    setActiveModule,
    sovereignKeyUnlocked,
    setSovereignKeyUnlocked,
    customerWallet,
    setCustomerWallet,
    loyaltyPoints,
    setLoyaltyPoints,
    techWallet,
    setTechWallet,
    techCashHand,
    setTechCashHand,
    siteCustomization,
    updateCustomization,
  };
}
