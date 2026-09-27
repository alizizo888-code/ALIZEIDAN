/**
 * مُتقن للصيانة - أكسجين للصيانة والمقاولات العامة
 * Type definitions for the complete enterprise platform
 */

export type UserRole = 'customer' | 'technician' | 'dispatcher' | 'sovereign_owner';

export type AppModule = 
  | 'landing' 
  | 'register' 
  | 'customer' 
  | 'technician' 
  | 'operations' 
  | 'sovereign'
  | 'admin_cms';

export interface SiteCustomization {
  siteTitle: string;
  siteSubtitle: string;
  primaryColor: string;
  warrantyDays: number;
  slaMinutes: number;
  bannerHeadline: string;
  bannerSubtext: string;
  heroImageUrl: string;
  accreditedMinistries: {
    balady: boolean;
    zatca: boolean;
    saudiEngineers: boolean;
    splAddress: boolean;
    commerceMinistry: boolean;
  };
  serviceIcons: {
    [key: string]: string;
  };
  promotionalOffers: {
    id: string;
    title: string;
    discount: string;
    originalPrice: number;
    offerPrice: number;
    badge: string;
    description: string;
    active: boolean;
  }[];
  customPermissions: {
    allowGuestOrder: boolean;
    allowTechSelfRegistration: boolean;
    requireNafathAuth: boolean;
    autoEscrowReleaseOnOtp: boolean;
  };
}

export type RegistrationType = 'guest' | 'customer' | 'technician';

export type TechSpecialty =
  | 'مكيفات وتكييف مركزي'
  | 'تركيب مكيفات جديدة'
  | 'غسيل وتنظيف مكيفات'
  | 'ثلاجات وأجهزة تبريد'
  | 'سباكة وشبكات مياه وصرف'
  | 'كهرباء وطاقة وسمارت هوم'
  | 'أقفال أمنية ونجارة'
  | 'عقود صيانة دورية'
  | 'شركات مقاولات عامة وتشطيبات';

export type ServiceCategory = 
  | 'hvac' 
  | 'plumbing' 
  | 'electrical' 
  | 'carpentry' 
  | 'appliances' 
  | 'satellite' 
  | 'tiling' 
  | 'security';

export type OrderStatus = 
  | 'draft' 
  | 'bidding' 
  | 'dispatched' 
  | 'in_progress' 
  | 'completed' 
  | 'disputed' 
  | 'cancelled';

export type EscrowStatus = 'held' | 'released' | 'refunded' | 'held_for_sovereign_approval';

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  nationalId?: string;
  crNumber?: string;
  walletBalance: number;
  cashCollected: number;
  isVerified: boolean;
  avatarUrl?: string;
  rating?: number;
  completedJobsCount?: number;
  currentVehicleId?: string;
}

export interface WorkOrder {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  district: string;
  city: 'الرياض' | 'جدة' | 'مكة المكرمة';
  nationalAddress: string;
  serviceCategory: ServiceCategory;
  serviceTitle: string;
  description: string;
  status: OrderStatus;
  safeOtp: string; // 4-digit door code
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  totalCost: number;
  platformCutPercentage: number;
  platformCutAmount: number;
  technicianCutAmount: number;
  escrowStatus: EscrowStatus;
  deltaT?: number;
  suctionPressure?: number;
  dischargePressure?: number;
  compressorCurrent?: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  zatcaInvoiceNo?: string;
  zatcaQrData?: string;
  createdAt: string;
  updatedAt: string;
  slaMinutesRemaining?: number;
  disputeReason?: string;
  disputeAmount?: number;
}

export interface TechnicianTelemetry {
  technicianId: string;
  technicianName: string;
  vehicleNo: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  batteryLevel: number;
  status: 'available' | 'in_transit' | 'in_progress' | 'sos_stalled';
  city: 'الرياض' | 'جدة' | 'مكة المكرمة';
  district: string;
  activeOrderId?: string;
  inventory: {
    freonR410A_cylinders: number;
    freonR22_cylinders: number;
    copperCoils_meters: number;
    capacitors_45_5uF: number;
    fanMotors: number;
  };
  lastBleSyncTime?: string;
  bleConnected: boolean;
}

export interface PlatformSwitches {
  paymentMadaApplePay: boolean;
  hvacServices: boolean;
  plumbingServices: boolean;
  electricalServices: boolean;
  appliancesServices: boolean;
  technicianRegistration: boolean;
  stcBankPayouts: boolean;
  aiVoiceChat: boolean;
  emergencyKillSwitch: boolean; // freezes field ops
}

export interface TimeLockTransaction {
  id: string;
  title: string;
  recipient: string;
  amount: number;
  initiatedAt: string;
  unlocksAt: string;
  status: 'locked' | 'approved_by_owner' | 'cancelled';
  purpose: string;
}

export interface ChatMessage {
  id: string;
  senderType: 'customer' | 'technician' | 'ai_assistant' | 'sovereign_owner';
  senderName: string;
  text: string;
  time: string;
  audioDuration?: string;
  imageUrl?: string;
  isIntervention?: boolean;
}

export interface P2PPartRequest {
  id: string;
  fromTechName: string;
  toTechName: string;
  partName: string;
  amount: number;
  verificationCode: string;
  status: 'pending' | 'accepted' | 'handed_over';
  timestamp: string;
}
