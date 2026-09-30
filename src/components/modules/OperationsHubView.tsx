import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Battery,
  Gauge,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  Clock,
  Sparkles,
  Search,
  Filter,
  ClipboardList,
  Activity,
  FileText,
  Phone,
  Radio,
  Check,
  ChevronDown,
  AlertOctagon,
  ShieldAlert,
  Wrench,
  Volume2,
  VolumeX,
  Crosshair,
  RefreshCw,
  Sliders,
  Compass,
} from 'lucide-react';
import { WorkOrder, TechnicianTelemetry, FleetAlert, GeofenceZone } from '../../types';
import { FleetLeafletMap } from '../FleetLeafletMap';

interface OperationsHubViewProps {
  orders: WorkOrder[];
  techs: TechnicianTelemetry[];
  onResolveDispute: (orderId: string, action: 'release_to_tech' | 'refund_to_customer') => void;
  onOpenZatcaModal: () => void;
  onBackToHome?: () => void;
  initialSubView?: 'fleet' | 'alerts' | 'customer_orders' | 'tech_tasks';
  // Alerts and Geofences Integration Props
  alerts?: FleetAlert[];
  geofences?: GeofenceZone[];
  focusedAlertId?: string | null;
  onSelectAlert?: (alert: FleetAlert) => void;
  onResolveAlert?: (alertId: string, note?: string) => void;
  onRecalibrateGeofence?: (alertId: string) => void;
  onDispatchBackupVan?: (alertId: string, backupTechName: string) => void;
  onTriggerBreakdown?: (techId?: string) => void;
  onTriggerGeofenceBreach?: (techId?: string) => void;
  isAlertSoundEnabled?: boolean;
  onToggleAlertSound?: () => void;
}

export const OperationsHubView: React.FC<OperationsHubViewProps> = ({
  orders,
  techs,
  onResolveDispute,
  onOpenZatcaModal,
  onBackToHome,
  initialSubView = 'fleet',
  alerts = [],
  geofences = [],
  focusedAlertId = null,
  onSelectAlert,
  onResolveAlert,
  onRecalibrateGeofence,
  onDispatchBackupVan,
  onTriggerBreakdown,
  onTriggerGeofenceBreach,
  isAlertSoundEnabled = true,
  onToggleAlertSound,
}) => {
  const [activeSubView, setActiveSubView] = useState<'fleet' | 'alerts' | 'customer_orders' | 'tech_tasks'>(
    initialSubView
  );

  useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
  }, [initialSubView]);

  const [selectedCity, setSelectedCity] = useState<'all' | 'الرياض' | 'جدة' | 'مكة المكرمة'>('all');
  const [selectedTech, setSelectedTech] = useState<TechnicianTelemetry>(techs[0]);
  const [autoDispatchLoading, setAutoDispatchLoading] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>('wo-7');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'in_progress' | 'dispatched' | 'bidding' | 'completed' | 'disputed'>('all');
  const [alertTypeFilter, setAlertTypeFilter] = useState<'all' | 'vehicle_breakdown' | 'geofence_breach' | 'battery_critical' | 'resolved'>('all');
  const [alertSearchQuery, setAlertSearchQuery] = useState('');

  const filteredTechs = techs.filter(
    (t) => selectedCity === 'all' || t.city === selectedCity
  );

  const pendingOrders = orders.filter(
    (o) => o.status === 'bidding' || o.status === 'dispatched'
  );

  const filteredOrders = orders.filter((o) => {
    const matchCity = selectedCity === 'all' || o.city === selectedCity;
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchSearch =
      !orderSearchQuery ||
      o.orderNo.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.includes(orderSearchQuery) ||
      o.serviceTitle.includes(orderSearchQuery);
    return matchCity && matchStatus && matchSearch;
  });

  const disputeOrder =
    orders.find((o) => o.id === selectedDisputeId || o.status === 'disputed') ||
    orders[orders.length - 1];

  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');
  const breakdownAlerts = alerts.filter((a) => a.type === 'vehicle_breakdown' && a.status !== 'resolved');
  const geofenceAlerts = alerts.filter((a) => a.type === 'geofence_breach' && a.status !== 'resolved');

  const filteredAlerts = alerts.filter((a) => {
    const matchCity = selectedCity === 'all' || a.city === selectedCity;
    const matchType =
      alertTypeFilter === 'all'
        ? a.status !== 'resolved'
        : alertTypeFilter === 'resolved'
        ? a.status === 'resolved'
        : a.type === alertTypeFilter && a.status !== 'resolved';
    const matchSearch =
      !alertSearchQuery ||
      a.vehicleNo.toLowerCase().includes(alertSearchQuery.toLowerCase()) ||
      a.technicianName.includes(alertSearchQuery) ||
      a.district.includes(alertSearchQuery) ||
      a.title.includes(alertSearchQuery);
    return matchCity && matchType && matchSearch;
  });

  const handleAutoAssign = (orderNo: string, targetTechName?: string) => {
    setAutoDispatchLoading(true);
    const techName = targetTechName || selectedTech.technicianName;
    setTimeout(() => {
      setAutoDispatchLoading(false);
      alert(
        `خوارزمية SmartLoad: تم تعيين المهمة ${orderNo} تلقائياً للفني الأقرب والأعلى تقييماً (${techName}) مع توفر قطع الغيار في فان الخدمة.`
      );
    }, 900);
  };

  // Jump to van on map
  const handleFocusAlertOnMap = (alertItem: FleetAlert) => {
    const matchedTech = techs.find((t) => t.technicianId === alertItem.technicianId);
    if (matchedTech) {
      setSelectedTech(matchedTech);
    }
    setActiveSubView('fleet');
    if (onSelectAlert) {
      onSelectAlert(alertItem);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-20 animate-fade-in font-sans" dir="rtl">
      {/* Top Banner & Control Deck */}
      <div className="bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#006948] text-white flex items-center justify-center shadow-md relative">
            <Users className="w-7 h-7" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
                غرفة العمليات المركزية والتحكم في الأسطول (Smart Fleet Command)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-xs font-bold">
                Retool / Supabase Realtime
              </span>
            </div>
            <p className="text-xs text-[#565e74] mt-0.5">
              متابعة 86 سيارة صيانة ذكية متصلة • الرياض • جدة • مكة المكرمة • نظام الإنذار الجغرافي الفوري
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006948] text-xs font-bold transition-colors cursor-pointer border border-[#bccac0]/25 flex items-center gap-1"
            >
              <span>← الرئيسية</span>
            </button>
          )}

          {/* Sound Effect Toggle */}
          {onToggleAlertSound && (
            <button
              onClick={onToggleAlertSound}
              title={isAlertSoundEnabled ? 'صوت الإنذار مفعّل' : 'صوت الإنذار صامت'}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isAlertSoundEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-[#006948]'
                  : 'bg-gray-100 border-gray-200 text-gray-500'
              }`}
            >
              {isAlertSoundEnabled ? <Volume2 className="w-4 h-4 text-[#006948]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isAlertSoundEnabled ? 'الإنذار الصوتي' : 'صامت'}</span>
            </button>
          )}

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1.5 rounded-full border border-[#bccac0]/30 text-xs font-bold">
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedCity === 'all'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              كافة المدن ({techs.length})
            </button>
            <button
              onClick={() => setSelectedCity('الرياض')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedCity === 'الرياض'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              الرياض (4)
            </button>
            <button
              onClick={() => setSelectedCity('جدة')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedCity === 'جدة'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              جدة (1)
            </button>
            <button
              onClick={() => setSelectedCity('مكة المكرمة')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedCity === 'مكة المكرمة'
                  ? 'bg-[#006948] text-white shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              مكة (1)
            </button>
          </div>
        </div>
      </div>

      {/* EMERGENCY REAL-TIME ALERT TICKER & CONTROLS DECK */}
      <div className="bg-[#ffffff] rounded-2xl p-3 sm:p-4 border border-red-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-900">نظام الرصد والإنذار الميداني الفوري</span>
              <span className="px-2 py-0.2 rounded-full bg-red-600 text-white font-mono font-bold text-[10px]">
                {activeAlerts.length} تنبيهات نشطة
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">
              مراقبة أعطال محركات الفانات وخروج السيارات عن النطاقات الجغرافية المصرحة عبر GPS
            </p>
          </div>
        </div>

        {/* Action Controls & Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end text-xs">
          {onTriggerBreakdown && (
            <button
              onClick={() => onTriggerBreakdown()}
              className="py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-red-600" />
              <span>محاكاة عطل مركبة</span>
            </button>
          )}

          {onTriggerGeofenceBreach && (
            <button
              onClick={() => onTriggerGeofenceBreach()}
              className="py-1.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
              <span>محاكاة خروج عن النطاق</span>
            </button>
          )}

          {activeAlerts.length > 0 && (
            <button
              onClick={() => handleFocusAlertOnMap(activeAlerts[0])}
              className="py-1.5 px-3 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>تحديد موقع أول بلاغ</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Oversight View Switcher Bar */}
      <div className="bg-[#ffffff] p-2 rounded-2xl border border-[#bccac0]/25 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubView('fleet')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubView === 'fleet'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>خريطة الأسطول والتوجيه اللحظي (GPS GIS)</span>
        </button>

        <button
          onClick={() => setActiveSubView('alerts')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
            activeSubView === 'alerts'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>سجل التنبيهات والأعطال الجغرافية</span>
          {activeAlerts.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeSubView === 'alerts' ? 'bg-red-500 text-white' : 'bg-red-600 text-white animate-pulse'
              }`}
            >
              {activeAlerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubView('customer_orders')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubView === 'customer_orders'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>متابعة أوردرات وحملات العملاء ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubView('tech_tasks')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubView === 'tech_tasks'
              ? 'bg-[#006948] text-white shadow-sm'
              : 'bg-[#eff4ff] text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>متابعة مهام وتحركات الفنيين ({techs.length})</span>
        </button>
      </div>

      {/* SUBVIEW 1: FLEET COMMAND MAP */}
      {activeSubView === 'fleet' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real Interactive Leaflet Fleet Map (8 cols) */}
            <div className="lg:col-span-8 bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-ping"></span>
                  <h2 className="text-base font-bold text-[#0b1c30]">
                    خريطة التوجيه اللحظية للأسطول (Interactive Leaflet Fleet GIS)
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-[#006948] font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006948]"></span> متاح ({techs.filter((t) => t.status === 'available').length})
                  </span>
                  <span className="flex items-center gap-1 text-red-600 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> أعطال ({breakdownAlerts.length})
                  </span>
                  <span className="flex items-center gap-1 text-orange-600 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> خارج النطاق ({geofenceAlerts.length})
                  </span>
                </div>
              </div>

              {/* Real Leaflet Map Component with Alerts & Geofences */}
              <FleetLeafletMap
                techs={filteredTechs}
                selectedTech={selectedTech}
                onSelectTech={setSelectedTech}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                pendingOrders={pendingOrders}
                onDispatchOrder={(orderNo, techName) => handleAutoAssign(orderNo, techName)}
                alerts={alerts}
                geofences={geofences}
                focusedAlertId={focusedAlertId}
                onSelectAlert={onSelectAlert}
                onResolveAlert={onResolveAlert}
                onRecalibrateGeofence={onRecalibrateGeofence}
                onDispatchBackupVan={onDispatchBackupVan}
              />
            </div>

            {/* Selected Vehicle Telemetry & Emergency Incident Panel (4 cols) */}
            <div className="lg:col-span-4 bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-[#565e74]">بيانات الفان الميداني المحدد</span>
                    <h3 className="text-lg font-bold text-[#0b1c30]">{selectedTech.vehicleNo}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedTech.status === 'sos_stalled' || selectedTech.mechanicalStatus === 'breakdown'
                        ? 'bg-red-100 text-red-800'
                        : selectedTech.geofenceStatus === 'breached'
                        ? 'bg-orange-100 text-orange-800'
                        : selectedTech.status === 'available'
                        ? 'bg-[#85f8c4] text-[#002114]'
                        : selectedTech.status === 'in_transit'
                        ? 'bg-[#ffddb8] text-[#825100]'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedTech.status === 'sos_stalled' || selectedTech.mechanicalStatus === 'breakdown'
                      ? 'عطل ميكانيكي'
                      : selectedTech.geofenceStatus === 'breached'
                      ? 'تجاوز النطاق'
                      : selectedTech.status === 'available'
                      ? 'جاهز للتكليف'
                      : selectedTech.status === 'in_transit'
                      ? 'في الطريق'
                      : 'قيد تنفيذ مهمة'}
                  </span>
                </div>

                {/* EMERGENCY INCIDENT RESPONSE CARD (If this tech has an active alert) */}
                {(() => {
                  const techAlert = alerts.find(
                    (a) => a.technicianId === selectedTech.technicianId && a.status !== 'resolved'
                  );
                  if (!techAlert) return null;

                  return (
                    <div
                      className={`mb-4 p-4 rounded-2xl border text-xs ${
                        techAlert.type === 'vehicle_breakdown'
                          ? 'bg-red-50 border-red-200 text-red-950'
                          : 'bg-orange-50 border-orange-200 text-orange-950'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {techAlert.type === 'vehicle_breakdown' ? (
                            <Wrench className="w-4 h-4 text-red-600" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-orange-600" />
                          )}
                          <span>{techAlert.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{techAlert.timestamp}</span>
                      </div>

                      <p className="text-[11px] leading-relaxed mb-3 opacity-90">{techAlert.message}</p>

                      {techAlert.breakdownDetails && (
                        <div className="bg-white/80 p-2 rounded-xl text-[11px] font-mono space-y-1 mb-3 border border-red-100">
                          <div className="flex justify-between">
                            <span>سبب التوقف:</span>
                            <strong>{techAlert.breakdownDetails.cause}</strong>
                          </div>
                          {techAlert.breakdownDetails.engineTemp && (
                            <div className="flex justify-between">
                              <span>حرارة المحرك:</span>
                              <strong className="text-red-600">{techAlert.breakdownDetails.engineTemp}°C</strong>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>ضغط الإطارات:</span>
                            <strong>{techAlert.breakdownDetails.tirePressure || '32 PSI'}</strong>
                          </div>
                        </div>
                      )}

                      {/* Incident Response Action Buttons */}
                      <div className="space-y-1.5 pt-1">
                        {techAlert.type === 'vehicle_breakdown' && onDispatchBackupVan && (
                          <button
                            onClick={() => onDispatchBackupVan(techAlert.id, 'فان أكسجين #12 (محمد السوري)')}
                            className="w-full py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-colors cursor-pointer text-center shadow-xs"
                          >
                            توجيه فان إسناد سريع (فان #12)
                          </button>
                        )}

                        {techAlert.type === 'geofence_breach' && onRecalibrateGeofence && (
                          <button
                            onClick={() => onRecalibrateGeofence(techAlert.id)}
                            className="w-full py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs transition-colors cursor-pointer text-center shadow-xs"
                          >
                            إعادة معايرة وتوسيع النطاق الجغرافي
                          </button>
                        )}

                        {onResolveAlert && (
                          <button
                            onClick={() => onResolveAlert(techAlert.id, 'تمت المعالجة من لوحة القيادة المركزية')}
                            className="w-full py-1.5 rounded-xl bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold text-[11px] transition-colors cursor-pointer text-center"
                          >
                            إقرار ومعالجة التنبيه
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Normal Telemetry Card */}
                <div className="space-y-2.5 bg-[#eff4ff] p-4 rounded-2xl border border-[#bccac0]/20 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#565e74]">الكابتن المسؤول:</span>
                    <span className="font-bold text-[#0b1c30]">{selectedTech.technicianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#565e74]">المنطقة والحي:</span>
                    <span className="font-bold text-[#0b1c30]">
                      {selectedTech.district} - {selectedTech.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#565e74]">السرعة الحالية:</span>
                    <span className="font-bold text-[#0b1c30] font-mono">{selectedTech.speed} كم/س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#565e74]">مستوى بطارية الأجهزة:</span>
                    <span className="font-bold text-[#006948] font-mono flex items-center gap-1">
                      <Battery className="w-4 h-4" />
                      {selectedTech.batteryLevel}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#565e74]">حالة النطاق الجغرافي:</span>
                    <span
                      className={`font-bold ${
                        selectedTech.geofenceStatus === 'breached' ? 'text-orange-600' : 'text-[#006948]'
                      }`}
                    >
                      {selectedTech.geofenceStatus === 'breached' ? 'خارج النطاق الجغرافي ⚠️' : 'داخل النطاق المعتمد ✓'}
                    </span>
                  </div>
                </div>

                {/* Van Realtime Stock Summary */}
                <h4 className="text-xs font-bold text-[#0b1c30] mb-2">
                  قطع الغيار والأسطوانات المحمولة بالسيارة:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                    <span className="text-[#565e74] block">فريون R410A:</span>
                    <span className="font-bold text-[#006948] font-mono">
                      {selectedTech.inventory.freonR410A_cylinders} أسطوانات
                    </span>
                  </div>
                  <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                    <span className="text-[#565e74] block">مكثفات 45+5uF:</span>
                    <span className="font-bold text-[#006948] font-mono">
                      {selectedTech.inventory.capacitors_45_5uF} قطع
                    </span>
                  </div>
                  <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                    <span className="text-[#565e74] block">مواسير نحاس:</span>
                    <span className="font-bold text-[#006948] font-mono">
                      {selectedTech.inventory.copperCoils_meters} متر
                    </span>
                  </div>
                  <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bccac0]/20">
                    <span className="text-[#565e74] block">محركات مراوح:</span>
                    <span className="font-bold text-[#006948] font-mono">
                      {selectedTech.inventory.fanMotors} محركات
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => alert(`تم إرسال إشعار توجيه مباشر إلى ${selectedTech.technicianName}`)}
                  className="flex-1 py-2.5 rounded-full bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] cursor-pointer shadow-sm transition-all"
                >
                  إرسال توجيه فوري
                </button>
                <button
                  onClick={() => alert(`فتح خط اتصال لاسلكي مباشر مع فان ${selectedTech.vehicleNo}`)}
                  className="px-4 py-2.5 rounded-full bg-[#eff4ff] text-[#0b1c30] text-xs font-bold hover:bg-[#e5eeff] cursor-pointer border border-[#bccac0]/20 flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 text-[#006948]" />
                  <span>لاسلكي</span>
                </button>
              </div>
            </div>
          </div>

          {/* SmartLoad Dispatch Matrix */}
          <div className="bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#006948]" />
                  <h2 className="text-xl font-bold text-[#0b1c30]">
                    مصفوفة التوزيع الذكي للطلبات (SmartLoad Dispatch Matrix)
                  </h2>
                </div>
                <p className="text-xs text-[#565e74] mt-0.5">
                  خوارزمية مطابقة تعتمد على القرب الجغرافي، تقييم الفني، وتوفر القطع المطلوبة بالمركبة
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#006948] text-xs font-bold border border-[#bccac0]/20">
                {pendingOrders.length} طلبات بانتظار التعيين أو القبول
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#bccac0]/20 text-[#565e74]">
                    <th className="pb-3 px-3">رقم الطلب</th>
                    <th className="pb-3 px-3">العميل والموقع</th>
                    <th className="pb-3 px-3">نوع الخدمة والوصف</th>
                    <th className="pb-3 px-3">القيمة التقديرية</th>
                    <th className="pb-3 px-3">المرشح الأنسب (Smart Match)</th>
                    <th className="pb-3 px-3">إجراء التعيين</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bccac0]/15">
                  {pendingOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                      <td className="py-4 px-3 font-bold font-mono text-[#006948]">{ord.orderNo}</td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-[#0b1c30]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#565e74]">
                          {ord.district} • {ord.city}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-semibold text-[#0b1c30]">{ord.serviceTitle}</span>
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-[#0b1c30]">
                        {ord.totalCost} ر.س
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1.5 text-[#006948] font-bold">
                          <Sparkles className="w-4 h-4 text-[#825100]" />
                          <span>فهد الشمري (1.8 كم • تقييم 4.96)</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <button
                          onClick={() => handleAutoAssign(ord.orderNo)}
                          disabled={autoDispatchLoading}
                          className="px-4 py-2 rounded-full bg-[#006948] text-white font-bold hover:bg-[#00855d] transition-colors cursor-pointer shadow-sm"
                        >
                          {autoDispatchLoading ? 'جاري الربط...' : 'توجيه آلي (Auto-Assign)'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: DEDICATED INSTANT FLEET ALERTS & GEOFENCING SENTINEL */}
      {activeSubView === 'alerts' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74] block">التنبيهات الميدانية النشطة</span>
                <span className="text-2xl font-bold font-mono text-[#0b1c30]">{activeAlerts.length}</span>
                <span className="text-[10px] text-red-600 block mt-0.5">تتطلب استجابة فورية</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74] block">أعطال ميكانيكية وتوقفات</span>
                <span className="text-2xl font-bold font-mono text-red-600">{breakdownAlerts.length}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">حرارة محرك / مضخات</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74] block">خروج عن النطاق الجغرافي</span>
                <span className="text-2xl font-bold font-mono text-orange-600">{geofenceAlerts.length}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">تجاوزات بدون أمر عمل</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-[#565e74] block">النطاقات الجغرافية المعتمدة</span>
                <span className="text-2xl font-bold font-mono text-[#006948]">{geofences.length}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">الرياض • جدة • مكة المكرمة</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006948] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 text-[#565e74] absolute right-3 top-3.5" />
                <input
                  type="text"
                  placeholder="بحث برقم الفان، الكابتن، الحي، أو نوع العطل..."
                  value={alertSearchQuery}
                  onChange={(e) => setAlertSearchQuery(e.target.value)}
                  className="w-full bg-[#eff4ff] pl-4 pr-9 py-2.5 rounded-xl text-xs outline-none border border-transparent focus:border-[#006948]"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl text-xs">
                {(['all', 'vehicle_breakdown', 'geofence_breach', 'battery_critical', 'resolved'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAlertTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      alertTypeFilter === type
                        ? 'bg-[#006948] text-white'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    {type === 'all'
                      ? 'النشطة'
                      : type === 'vehicle_breakdown'
                      ? 'أعطال ميكانيكية'
                      : type === 'geofence_breach'
                      ? 'تجاوز النطاق'
                      : type === 'battery_critical'
                      ? 'بطاريات منخفضة'
                      : 'تمت المعالجة'}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#565e74] font-mono">
              إجمالي النتائج: <strong className="text-[#006948]">{filteredAlerts.length}</strong> تنبيه
            </div>
          </div>

          {/* Alerts Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlerts.length === 0 ? (
              <div className="col-span-2 bg-[#ffffff] p-12 rounded-3xl border border-[#bccac0]/25 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#006948] mx-auto mb-3" />
                <h3 className="font-bold text-[#0b1c30] text-base">لا توجد تنبيهات نشطة مطابقة للفلتر المحدد</h3>
                <p className="text-xs text-[#565e74] mt-1">كافة الفانات تعمل وفق النطاقات الجغرافية المعتمدة وبحالة ميكانيكية سليمة.</p>
              </div>
            ) : (
              filteredAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`bg-[#ffffff] p-5 rounded-3xl border transition-all shadow-xs flex flex-col justify-between ${
                    alt.status === 'resolved'
                      ? 'border-gray-200 opacity-70'
                      : alt.type === 'vehicle_breakdown'
                      ? 'border-red-300 ring-1 ring-red-200'
                      : 'border-orange-300 ring-1 ring-orange-200'
                  }`}
                >
                  <div>
                    {/* Top Row: Badge, Time & Location */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            alt.status === 'resolved'
                              ? 'bg-gray-400'
                              : alt.type === 'vehicle_breakdown'
                              ? 'bg-red-600 animate-ping'
                              : 'bg-orange-500 animate-ping'
                          }`}
                        ></span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            alt.status === 'resolved'
                              ? 'bg-gray-100 text-gray-700'
                              : alt.type === 'vehicle_breakdown'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {alt.type === 'vehicle_breakdown'
                            ? 'عطل ميكانيكي حرج'
                            : alt.type === 'geofence_breach'
                            ? 'خروج عن النطاق الجغرافي'
                            : 'تنبيه بطارية ومجسات'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{alt.timestamp}</span>
                      </div>

                      <span className="font-mono text-xs font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded">
                        {alt.vehicleNo}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#0b1c30] mb-1.5">{alt.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{alt.message}</p>

                    {/* Metadata & Technical Specs */}
                    <div className="bg-[#eff4ff] p-3 rounded-2xl text-xs space-y-1 font-mono mb-3">
                      <div className="flex justify-between">
                        <span className="text-[#565e74]">الكابتن:</span>
                        <strong className="text-[#0b1c30]">{alt.technicianName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#565e74]">الموقع المسجل:</span>
                        <strong>{alt.district} • {alt.city}</strong>
                      </div>
                      {alt.breachDistanceKm && (
                        <div className="flex justify-between text-orange-800">
                          <span>مسافة التجاوز عن النطاق:</span>
                          <strong>{alt.breachDistanceKm} كم</strong>
                        </div>
                      )}
                      {alt.breakdownDetails && (
                        <>
                          <div className="flex justify-between text-red-800">
                            <span>سبب العطل:</span>
                            <strong>{alt.breakdownDetails.cause}</strong>
                          </div>
                          {alt.breakdownDetails.engineTemp && (
                            <div className="flex justify-between text-red-800">
                              <span>درجة حرارة المحرك:</span>
                              <strong>{alt.breakdownDetails.engineTemp}°C</strong>
                            </div>
                          )}
                          <div className="flex justify-between text-blue-800 pt-1 border-t border-blue-100">
                            <span>التوصية التشغيلية:</span>
                            <strong>{alt.breakdownDetails.recommendedAction || 'إرسال ونش مساندة'}</strong>
                          </div>
                        </>
                      )}
                      {alt.resolutionNote && (
                        <div className="flex justify-between text-emerald-800 pt-1 border-t border-emerald-100">
                          <span>سجل المعالجة:</span>
                          <strong>{alt.resolutionNote}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleFocusAlertOnMap(alt)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>عرض وتوسيط على الخريطة</span>
                    </button>

                    {alt.status !== 'resolved' && (
                      <>
                        {alt.type === 'vehicle_breakdown' && onDispatchBackupVan && (
                          <button
                            onClick={() => onDispatchBackupVan(alt.id, 'فان أكسجين #12 (محمد السوري)')}
                            className="py-2 px-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            توجيه فان مساندة
                          </button>
                        )}

                        {alt.type === 'geofence_breach' && onRecalibrateGeofence && (
                          <button
                            onClick={() => onRecalibrateGeofence(alt.id)}
                            className="py-2 px-3 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            معايرة النطاق
                          </button>
                        )}

                        {onResolveAlert && (
                          <button
                            onClick={() => onResolveAlert(alt.id, 'تمت المعالجة والإغلاق يدوياً من مركز العمليات')}
                            className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006948] text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
                          >
                            معالجة
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* GEOFENCE ZONES REGISTRY SECTION */}
          <div className="bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-[#006948]" />
                <h3 className="text-lg font-bold text-[#0b1c30]">
                  سجل النطاقات الجغرافية التشغيلية المعتمدة (Operational Geofencing Matrix)
                </h3>
              </div>
              <span className="text-xs text-[#565e74]">
                تطبيق خوارزميات الحظر والتنبيه التلقائي للمركبات الخارجة عن نطاق التغطية
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#bccac0]/20 text-[#565e74]">
                    <th className="pb-3 px-3">معرف النطاق</th>
                    <th className="pb-3 px-3">اسم القطاع الجغرافي</th>
                    <th className="pb-3 px-3">المدينة</th>
                    <th className="pb-3 px-3">إحداثيات المركز</th>
                    <th className="pb-3 px-3">نصف القطر المصرح</th>
                    <th className="pb-3 px-3">المركبات المخصصة</th>
                    <th className="pb-3 px-3">حالة الامتثال</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bccac0]/15">
                  {geofences.map((geo) => {
                    const hasBreach = geo.assignedVehicleIds.some((vId) =>
                      techs.some((t) => t.technicianId === vId && (t.geofenceStatus === 'breached' || t.status === 'sos_stalled'))
                    );

                    return (
                      <tr key={geo.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-[#006948]">{geo.id}</td>
                        <td className="py-4 px-3">
                          <div className="font-bold text-[#0b1c30] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: geo.color }}></span>
                            <span>{geo.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 font-semibold text-gray-700">{geo.city}</td>
                        <td className="py-4 px-3 font-mono text-gray-600">
                          {geo.centerLat.toFixed(4)}, {geo.centerLng.toFixed(4)}
                        </td>
                        <td className="py-4 px-3 font-mono font-bold text-[#0b1c30]">
                          {(geo.radiusMeters / 1000).toFixed(1)} كم
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex flex-wrap gap-1">
                            {geo.assignedVehicleIds.map((v) => {
                              const tObj = techs.find((t) => t.technicianId === v);
                              return (
                                <span
                                  key={v}
                                  className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px] font-mono font-bold"
                                >
                                  {tObj ? tObj.vehicleNo : v}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          {hasBreach ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 animate-pulse">
                              ⚠️ تم رصد خروج عن النطاق
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ ملتزم بالكامل
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 3: CUSTOMER ORDERS & CAMPAIGNS OVERSIGHT */}
      {activeSubView === 'customer_orders' && (
        <div className="space-y-6 animate-fade-in">
          {/* Orders Filters & Search */}
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#bccac0]/25 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 text-[#565e74] absolute right-3 top-3.5" />
                <input
                  type="text"
                  placeholder="بحث برقم الطلب، اسم العميل، نوع الخدمة..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-[#eff4ff] pl-4 pr-9 py-2.5 rounded-xl text-xs outline-none border border-transparent focus:border-[#006948]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl text-xs">
                {(['all', 'in_progress', 'dispatched', 'bidding', 'completed', 'disputed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-[#006948] text-white'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    {st === 'all'
                      ? 'الكل'
                      : st === 'in_progress'
                      ? 'قيد التنفيذ'
                      : st === 'dispatched'
                      ? 'في الطريق'
                      : st === 'bidding'
                      ? 'بانتظار العروض'
                      : st === 'completed'
                      ? 'مكتمل'
                      : 'نزاع معلق'}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#565e74] font-mono">
              إجمالي النتائج: <strong className="text-[#006948]">{filteredOrders.length}</strong> أوردر
            </div>
          </div>

          {/* Orders Oversight Table */}
          <div className="bg-[#ffffff] rounded-3xl p-6 shadow-sm border border-[#bccac0]/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#006948]" />
                <h3 className="text-lg font-bold text-[#0b1c30]">
                  سجل أوردرات وحملات الصيانة الجارية (Orders Oversight Deck)
                </h3>
              </div>
              <span className="text-xs text-[#565e74]">
                متابعة لحظية لدخول الفني عبر Safe OTP، والفاتورة الضريبية، وحالة الضمان المالي
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#bccac0]/20 text-[#565e74]">
                    <th className="pb-3 px-3">رقم الطلب</th>
                    <th className="pb-3 px-3">العميل والموقع</th>
                    <th className="pb-3 px-3">الخدمة والتفاصيل</th>
                    <th className="pb-3 px-3">الفني المعين</th>
                    <th className="pb-3 px-3">كود Safe OTP</th>
                    <th className="pb-3 px-3">التكلفة والعمولة (18.5%)</th>
                    <th className="pb-3 px-3">حالة الضمان (Escrow)</th>
                    <th className="pb-3 px-3">الحالة التشغيلية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bccac0]/15">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                      <td className="py-4 px-3 font-mono font-bold text-[#006948]">{ord.orderNo}</td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-[#0b1c30]">{ord.customerName}</div>
                        <div className="text-[11px] text-[#565e74]">
                          {ord.city} • {ord.district}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-semibold text-[#0b1c30] block">{ord.serviceTitle}</span>
                        <span className="text-[11px] text-[#565e74] truncate max-w-[180px] block">
                          {ord.description}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {ord.technicianName ? (
                          <div className="font-bold text-[#0b1c30]">{ord.technicianName}</div>
                        ) : (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                            بانتظار التعيين
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-xs bg-gray-50 text-center rounded">
                        {ord.safeOtp}
                      </td>
                      <td className="py-4 px-3 font-mono">
                        <div className="font-bold text-[#0b1c30]">{ord.totalCost} ر.س</div>
                        <div className="text-[10px] text-[#565e74]">
                          عمولة المنصة: {ord.platformCutAmount} ر.س
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.escrowStatus === 'released'
                              ? 'bg-[#85f8c4] text-[#002114]'
                              : ord.escrowStatus === 'refunded'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.escrowStatus === 'released'
                            ? 'محرر للفني'
                            : ord.escrowStatus === 'refunded'
                            ? 'مسترد للعميل'
                            : 'محتجز بالضمان'}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'completed'
                              ? 'bg-[#85f8c4] text-[#002114]'
                              : ord.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'dispatched'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'disputed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {ord.status === 'completed'
                            ? 'مكتمل'
                            : ord.status === 'in_progress'
                            ? 'جاري العمل'
                            : ord.status === 'dispatched'
                            ? 'في الطريق'
                            : ord.status === 'disputed'
                            ? 'نزاع نشط'
                            : 'طرح عروض'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quality Audit & Dispute Arbitration Bench */}
          <div className="bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#825100]" />
                <h3 className="text-lg font-bold text-[#0b1c30]">
                  منصة التدقيق الهندسي وفض النزاعات (Audit Bench & Escrow Arbitration)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#825100] text-xs font-bold">
                نزاع {disputeOrder.orderNo}
              </span>
            </div>

            <p className="text-xs text-[#565e74] mb-4">
              مقارنة توثيق الفحص الميداني: صور قبل وبعد الصيانة وبيانات المانيفولد لحسم الضمان المعلق
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#ba1a1a]">صورة اعتراض العميل (قبل)</span>
                <div className="w-full h-40 rounded-xl overflow-hidden bg-black/10 border border-[#bccac0]/20">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
                    alt="صورة قبل"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#006948]">صورة تسليم الفني (بعد)</span>
                <div className="w-full h-40 rounded-xl overflow-hidden bg-black/10 border border-[#bccac0]/20">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                    alt="صورة بعد"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#bccac0]/20 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-[#0b1c30]">المبلغ المحتجز في الضمان:</span>
                <span className="text-[#825100] font-mono">{disputeOrder.totalCost} ر.س</span>
              </div>
              <p className="text-[#565e74] leading-relaxed">
                موضوع النزاع: {disputeOrder.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onResolveDispute(disputeOrder.id, 'release_to_tech');
                  alert(
                    'قرار تحكيمي: تم اعتماد صحة الأعمال الهندسية وتحرير مستحقات الفني من الضمان وإشعار العميل برسالة SMS.'
                  );
                }}
                className="py-3 rounded-full bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] cursor-pointer shadow-sm transition-all text-center"
              >
                تحرير المبلغ للفني (إثبات الجودة الهندسية)
              </button>
              <button
                onClick={() => {
                  onResolveDispute(disputeOrder.id, 'refund_to_customer');
                  alert(
                    'قرار تحكيمي: تم قبول اعتراض العميل وإعادة مبلغ الصيانة كاملاً لمحفظته بضمان أكسجين الذهبي.'
                  );
                }}
                className="py-3 rounded-full bg-[#eff4ff] text-[#ba1a1a] text-xs font-bold hover:bg-[#ffdad6] border border-[#bccac0]/25 cursor-pointer transition-all text-center"
              >
                إرجاع المبلغ للعميل (ضمان أكسجين الذهبي)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 4: TECHNICIAN FIELD TASKS & TELEMETRY OVERSIGHT */}
      {activeSubView === 'tech_tasks' && (
        <div className="space-y-6 animate-fade-in">
          {/* Techs Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTechs.map((t) => (
              <div
                key={t.technicianId}
                className={`bg-[#ffffff] p-5 rounded-2xl border transition-all shadow-xs ${
                  selectedTech.technicianId === t.technicianId
                    ? 'border-[#006948] ring-2 ring-[#006948]/20'
                    : 'border-[#bccac0]/25 hover:border-[#006948]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                        t.status === 'sos_stalled' || t.mechanicalStatus === 'breakdown'
                          ? 'bg-red-600'
                          : t.geofenceStatus === 'breached'
                          ? 'bg-orange-600'
                          : 'bg-[#006948]'
                      }`}
                    >
                      {t.status === 'sos_stalled' || t.mechanicalStatus === 'breakdown' ? (
                        <Wrench className="w-5 h-5" />
                      ) : t.geofenceStatus === 'breached' ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : (
                        <MapPin className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0b1c30]">{t.technicianName}</h4>
                      <span className="text-[11px] text-[#565e74] font-mono">{t.vehicleNo} • {t.city}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'sos_stalled' || t.mechanicalStatus === 'breakdown'
                        ? 'bg-red-100 text-red-800'
                        : t.geofenceStatus === 'breached'
                        ? 'bg-orange-100 text-orange-800'
                        : t.status === 'available'
                        ? 'bg-[#85f8c4] text-[#002114]'
                        : t.status === 'in_transit'
                        ? 'bg-[#ffddb8] text-[#825100]'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {t.status === 'sos_stalled' || t.mechanicalStatus === 'breakdown'
                      ? 'عطل ميكانيكي'
                      : t.geofenceStatus === 'breached'
                      ? 'تجاوز النطاق'
                      : t.status === 'available'
                      ? 'متاح'
                      : t.status === 'in_transit'
                      ? 'في الطريق'
                      : 'قيد التنفيذ'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-[#eff4ff] p-3 rounded-xl mb-3 text-[#565e74]">
                  <div className="flex justify-between">
                    <span>الحي الميداني:</span>
                    <strong className="text-[#0b1c30]">{t.district}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>البطارية:</span>
                    <strong className="font-mono text-[#006948]">{t.batteryLevel}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>السرعة:</span>
                    <strong className="font-mono">{t.speed} كم/س</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>ربط البلوتوث BLE:</span>
                    <strong className={t.bleConnected ? 'text-[#006948]' : 'text-gray-400'}>
                      {t.bleConnected ? 'متصل بالمانيفولد' : 'غير متصل'}
                    </strong>
                  </div>
                </div>

                {/* Stock Chips */}
                <div className="flex items-center justify-between text-[11px] text-[#565e74] mb-3">
                  <span>مخزون R410A: <strong className="text-[#006948]">{t.inventory.freonR410A_cylinders}</strong></span>
                  <span>مكثفات: <strong className="text-[#006948]">{t.inventory.capacitors_45_5uF}</strong></span>
                  <span>نحاس: <strong className="text-[#006948]">{t.inventory.copperCoils_meters}م</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTech(t);
                      setActiveSubView('fleet');
                    }}
                    className="flex-1 py-1.5 bg-[#006948] text-white rounded-xl text-xs font-bold hover:bg-[#00855d] transition-colors cursor-pointer text-center"
                  >
                    تتبع في الخريطة
                  </button>
                  <button
                    onClick={() => alert(`إجراء اتصال صوتي مباشر مع الفني ${t.technicianName}`)}
                    className="p-1.5 bg-[#eff4ff] text-[#006948] rounded-xl hover:bg-[#e5eeff] transition-colors cursor-pointer border border-[#bccac0]/20"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Van Warehouse Stock Matrix */}
          <div className="bg-[#ffffff] p-6 rounded-3xl shadow-sm border border-[#bccac0]/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#006948]" />
                <h3 className="text-lg font-bold text-[#0b1c30]">
                  حالة مخزون سيارات الخدمة الميدانية (Fleet Inventory Stock)
                </h3>
              </div>
              <span className="text-xs text-[#565e74]">
                مراقبة حية لكميات الفريون وقطع الغيار بكل سيارة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#bccac0]/20 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-[#0b1c30] block mb-1">
                    أسطوانات فريون R410A الأصلية
                  </span>
                  <span className="text-[#565e74]">المتوفر: 18 أسطوانة بجميع السيارات</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-bold">
                    آمن
                  </span>
                  <span className="text-[10px] text-[#565e74]">الحد الأدنى: 10</span>
                </div>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#bccac0]/20 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-[#0b1c30] block mb-1">
                    لفات أنابيب نحاس كوري 5/8 و 3/8
                  </span>
                  <span className="text-[#565e74]">المتبقي: 45 متراً فقط</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffddb8] text-[#825100] font-bold">
                    منخفض
                  </span>
                  <span className="text-[10px] text-[#565e74]">الحد الأدنى: 60م</span>
                </div>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#bccac0]/20 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-[#0b1c30] block mb-1">
                    محركات مراوح Fan Motors 40W
                  </span>
                  <span className="text-[#565e74]">المتوفر: 8 قطع موزعة بالفانات</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-bold">
                    آمن
                  </span>
                  <span className="text-[10px] text-[#565e74]">الحد الأدنى: 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
