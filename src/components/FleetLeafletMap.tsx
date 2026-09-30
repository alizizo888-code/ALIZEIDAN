import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TechnicianTelemetry, WorkOrder, FleetAlert, GeofenceZone } from '../types';
import {
  MapPin,
  Battery,
  Navigation,
  Gauge,
  Layers,
  Zap,
  Phone,
  Radio,
  CheckCircle2,
  RefreshCw,
  Maximize2,
  Minimize2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Crosshair,
  Wrench,
  Check,
  ArrowRight,
} from 'lucide-react';

interface FleetLeafletMapProps {
  techs: TechnicianTelemetry[];
  selectedTech: TechnicianTelemetry;
  onSelectTech: (tech: TechnicianTelemetry) => void;
  selectedCity: 'all' | 'الرياض' | 'جدة' | 'مكة المكرمة';
  onCityChange?: (city: 'all' | 'الرياض' | 'جدة' | 'مكة المكرمة') => void;
  pendingOrders?: WorkOrder[];
  onDispatchOrder?: (orderNo: string, techName: string) => void;
  // Alert & Geofence Props
  alerts?: FleetAlert[];
  geofences?: GeofenceZone[];
  focusedAlertId?: string | null;
  onSelectAlert?: (alert: FleetAlert) => void;
  onResolveAlert?: (alertId: string, note?: string) => void;
  onRecalibrateGeofence?: (alertId: string) => void;
  onDispatchBackupVan?: (alertId: string, backupTechName: string) => void;
}

// City coordinates mapping for fly-to
const CITY_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  all: { lat: 23.8859, lng: 45.0792, zoom: 6 },
  'الرياض': { lat: 24.7136, lng: 46.6753, zoom: 12 },
  'جدة': { lat: 21.5433, lng: 39.1728, zoom: 12 },
  'مكة المكرمة': { lat: 21.4225, lng: 39.8262, zoom: 13 },
};

export const FleetLeafletMap: React.FC<FleetLeafletMapProps> = ({
  techs,
  selectedTech,
  onSelectTech,
  selectedCity,
  onCityChange,
  pendingOrders = [],
  onDispatchOrder,
  alerts = [],
  geofences = [],
  focusedAlertId,
  onSelectAlert,
  onResolveAlert,
  onRecalibrateGeofence,
  onDispatchBackupVan,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const geofencesLayerRef = useRef<L.LayerGroup | null>(null);
  const breachLinesLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineLayerRef = useRef<L.Polyline | null>(null);

  const [isLiveSimActive, setIsLiveSimActive] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'all' | 'alerts_only'>('all');
  const [liveTechs, setLiveTechs] = useState<TechnicianTelemetry[]>(techs);

  // Sync internal state with external props
  useEffect(() => {
    setLiveTechs(techs);
  }, [techs]);

  // Live telemetry jitter simulation (vehicles subtly moving along roads)
  useEffect(() => {
    if (!isLiveSimActive) return;

    const interval = setInterval(() => {
      setLiveTechs((prevTechs) =>
        prevTechs.map((t) => {
          if (t.status === 'in_transit' || (t.status === 'in_progress' && t.mechanicalStatus !== 'breakdown')) {
            const deltaLat = (Math.random() - 0.5) * 0.0008;
            const deltaLng = (Math.random() - 0.5) * 0.0008;
            const newSpeed = t.status === 'in_transit' ? Math.floor(30 + Math.random() * 25) : 0;
            return {
              ...t,
              lat: parseFloat((t.lat + deltaLat).toFixed(5)),
              lng: parseFloat((t.lng + deltaLng).toFixed(5)),
              speed: newSpeed,
            };
          }
          return t;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveSimActive]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // If map already exists, remove it cleanly
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter = CITY_COORDINATES[selectedCity] || CITY_COORDINATES['all'];

    const map = L.map(mapContainerRef.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom: defaultCenter.zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Modern tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Attribution
    L.control
      .attribution({
        prefix: '<span>نظام ملاحة أكسجين الميداني • Leaflet GPS GIS Engine</span>',
        position: 'bottomleft',
      })
      .addTo(map);

    // Zoom Control
    L.control
      .zoom({
        position: 'topleft',
      })
      .addTo(map);

    // Layer groups
    const geofencesLayer = L.layerGroup().addTo(map);
    const breachLinesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    geofencesLayerRef.current = geofencesLayer;
    breachLinesLayerRef.current = breachLinesLayer;
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // 2. Handle City Change / Fly-to
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const target = CITY_COORDINATES[selectedCity] || CITY_COORDINATES['all'];
    mapInstanceRef.current.flyTo([target.lat, target.lng], target.zoom, {
      duration: 1.5,
    });
  }, [selectedCity]);

  // 3. Render Geofences Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !geofencesLayerRef.current) return;

    geofencesLayerRef.current.clearLayers();

    if (!showGeofences) return;

    const visibleGeofences = geofences.filter(
      (g) => selectedCity === 'all' || g.city === selectedCity
    );

    visibleGeofences.forEach((zone) => {
      // Check if any vehicle in this zone is breached
      const hasBreachedVehicle = zone.assignedVehicleIds.some((vId) =>
        liveTechs.some((t) => t.technicianId === vId && (t.geofenceStatus === 'breached' || t.status === 'sos_stalled'))
      );

      const zoneColor = hasBreachedVehicle ? '#dc2626' : zone.color;

      const circle = L.circle([zone.centerLat, zone.centerLng], {
        radius: zone.radiusMeters,
        color: zoneColor,
        weight: hasBreachedVehicle ? 2.5 : 1.5,
        opacity: hasBreachedVehicle ? 0.9 : 0.6,
        dashArray: hasBreachedVehicle ? '6, 6' : '4, 8',
        fillColor: zoneColor,
        fillOpacity: hasBreachedVehicle ? 0.12 : 0.05,
      });

      const zonePopup = `
        <div style="direction: rtl; font-family: system-ui, sans-serif; min-width: 180px;" class="p-1">
          <div class="font-bold text-xs text-gray-900 border-b pb-1 mb-1 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${zoneColor}"></span>
            <span>${zone.name}</span>
          </div>
          <div class="text-[11px] text-gray-600 space-y-0.5">
            <div>المدينة: <strong class="text-gray-900">${zone.city}</strong></div>
            <div>نصف قطر النطاق: <strong class="text-gray-900 font-mono">${(zone.radiusMeters / 1000).toFixed(1)} كم</strong></div>
            <div>المركبات المخصصة: <strong class="text-gray-900">${zone.assignedVehicleIds.length} سيارات</strong></div>
            ${hasBreachedVehicle ? '<div class="text-red-600 font-bold text-[10px] mt-1">⚠️ تم رصد تجاوز للنطاق من إحدى المركبات</div>' : ''}
          </div>
        </div>
      `;

      circle.bindPopup(zonePopup);
      geofencesLayerRef.current?.addLayer(circle);
    });
  }, [geofences, liveTechs, showGeofences, selectedCity]);

  // 4. Update Markers and Breach Warning Lines
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !breachLinesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    breachLinesLayerRef.current.clearLayers();

    // Filter techs matching selectedCity and alert filter
    let visibleTechs = liveTechs.filter(
      (t) => selectedCity === 'all' || t.city === selectedCity
    );

    if (filterMode === 'alerts_only') {
      visibleTechs = visibleTechs.filter(
        (t) =>
          t.status === 'sos_stalled' ||
          t.geofenceStatus === 'breached' ||
          t.mechanicalStatus === 'breakdown' ||
          alerts.some((a) => a.technicianId === t.technicianId && a.status !== 'resolved')
      );
    }

    visibleTechs.forEach((t) => {
      const isSelected = selectedTech?.technicianId === t.technicianId;
      const techAlert = alerts.find(
        (a) => a.technicianId === t.technicianId && a.status !== 'resolved'
      );
      const isBreakdown = t.status === 'sos_stalled' || t.mechanicalStatus === 'breakdown' || techAlert?.type === 'vehicle_breakdown';
      const isGeofenceBreached = t.geofenceStatus === 'breached' || techAlert?.type === 'geofence_breach';
      const hasActiveAlert = isBreakdown || isGeofenceBreached || (techAlert && techAlert.status !== 'resolved');

      // Status color styles
      let statusColor = '#006948'; // green
      let statusBg = 'bg-[#006948]';
      let statusText = 'متاح للطلب';

      if (isBreakdown) {
        statusColor = '#dc2626'; // red
        statusBg = 'bg-[#dc2626]';
        statusText = 'عطل ميكانيكي (SOS)';
      } else if (isGeofenceBreached) {
        statusColor = '#ea580c'; // orange
        statusBg = 'bg-[#ea580c]';
        statusText = 'خارج النطاق الجغرافي';
      } else if (t.status === 'in_transit') {
        statusColor = '#825100'; // amber
        statusBg = 'bg-[#825100]';
        statusText = 'في الطريق';
      } else if (t.status === 'in_progress') {
        statusColor = '#1d4ed8'; // blue
        statusBg = 'bg-[#1d4ed8]';
        statusText = 'قيد التنفيذ';
      }

      // Draw breach line from assigned geofence center to vehicle if breached
      if (isGeofenceBreached) {
        const assignedZone = geofences.find((g) => g.assignedVehicleIds.includes(t.technicianId));
        if (assignedZone) {
          const breachLine = L.polyline(
            [
              [assignedZone.centerLat, assignedZone.centerLng],
              [t.lat, t.lng],
            ],
            {
              color: '#ea580c',
              weight: 3,
              dashArray: '5, 8',
              opacity: 0.85,
            }
          );
          breachLine.bindTooltip(`خروج عن ${assignedZone.name} بمقدار ${(techAlert?.breachDistanceKm || 2.5)} كم`);
          breachLinesLayerRef.current?.addLayer(breachLine);
        }
      }

      // Custom HTML Marker using L.divIcon
      const markerHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer" style="transform: translate(-50%, -100%);">
          <!-- Pulse animation for warning/emergency or active vehicles -->
          ${
            hasActiveAlert
              ? `<div class="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-full ${isBreakdown ? 'bg-red-500' : 'bg-orange-500'} opacity-35 animate-ping"></div>`
              : `<div class="absolute -top-1 w-8 h-8 rounded-full ${statusBg} opacity-25 animate-ping"></div>`
          }

          <!-- Pin Head with Van / Hazard icon -->
          <div class="relative w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform transform group-hover:scale-110 ${
            isSelected ? 'ring-4 ring-white shadow-2xl scale-110' : ''
          } ${hasActiveAlert ? 'ring-2 ring-red-400' : ''}" style="background-color: ${statusColor};">
            ${
              isBreakdown
                ? `<svg class="w-5 h-5 fill-current animate-bounce text-white" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>`
                : isGeofenceBreached
                ? `<svg class="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
                : `<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                    <circle cx="7.5" cy="14.5" r="1.5"/>
                    <circle cx="16.5" cy="14.5" r="1.5"/>
                  </svg>`
            }

            <!-- Hazard Badge Indicator -->
            ${
              hasActiveAlert
                ? `<span class="absolute -top-2 -right-2 px-1.5 py-0.2 bg-red-600 border border-white text-[9px] font-black rounded-full text-white shadow-sm">!</span>`
                : t.batteryLevel < 30
                ? `<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>`
                : ''
            }
          </div>

          <!-- Bottom pointer needle -->
          <div class="w-2.5 h-2.5 rotate-45 -mt-1.5 shadow-sm" style="background-color: ${statusColor};"></div>

          <!-- Floating Name & Status Label -->
          <div class="mt-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-md border ${
            hasActiveAlert ? 'border-red-400 bg-red-50/95' : 'border-gray-200'
          } text-[10px] font-bold text-gray-800 whitespace-nowrap flex items-center gap-1">
            <span>${t.technicianName.split(' ')[0]}</span>
            ${
              hasActiveAlert
                ? `<span class="text-[9px] text-red-600 font-bold">${isBreakdown ? 'عطل' : 'تجاوز'}</span>`
                : t.speed > 0
                ? `<span class="text-[9px] text-[#006948] font-mono">${t.speed} كم/س</span>`
                : ''
            }
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-fleet-pin',
        html: markerHtml,
        iconSize: [44, 54],
        iconAnchor: [22, 52],
        popupAnchor: [0, -52],
      });

      const marker = L.marker([t.lat, t.lng], { icon: customIcon });

      // Build Rich Interactive Popup HTML
      const popupHtml = `
        <div style="direction: rtl; font-family: system-ui, -apple-system, sans-serif; min-width: 260px;" class="p-1">
          <!-- Header -->
          <div class="flex items-center justify-between border-b pb-2 mb-2">
            <div>
              <div class="font-bold text-sm text-gray-900">${t.technicianName}</div>
              <div class="text-[11px] text-gray-500 font-mono">${t.vehicleNo} • ${t.city}</div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap" style="background-color: ${statusColor};">
              ${statusText}
            </span>
          </div>

          <!-- Active Alert Warning Box (If any) -->
          ${
            techAlert
              ? `
              <div class="mb-3 p-2 rounded-xl ${
                techAlert.type === 'vehicle_breakdown'
                  ? 'bg-red-50 border border-red-200 text-red-900'
                  : 'bg-orange-50 border border-orange-200 text-orange-900'
              } text-xs">
                <div class="font-bold flex items-center gap-1.5 mb-1 text-[11px]">
                  <span>${techAlert.type === 'vehicle_breakdown' ? '🚨' : '⚠️'}</span>
                  <span>${techAlert.title}</span>
                </div>
                <p class="text-[10px] leading-relaxed opacity-90 mb-1.5">${techAlert.message}</p>
                
                ${
                  techAlert.breakdownDetails
                    ? `
                  <div class="bg-white/80 p-1.5 rounded-md text-[10px] space-y-0.5 font-mono mb-2">
                    <div>سبب التوقف: <span class="font-bold">${techAlert.breakdownDetails.cause}</span></div>
                    ${techAlert.breakdownDetails.engineTemp ? `<div>حرارة المحرك: <span class="font-bold text-red-600">${techAlert.breakdownDetails.engineTemp}°C</span></div>` : ''}
                    <div>توصية: <span class="font-bold text-blue-700">${techAlert.breakdownDetails.recommendedAction || 'إرسال ونش مساندة'}</span></div>
                  </div>
                `
                    : ''
                }

                <!-- Direct Alert Action Buttons inside Popup -->
                <div class="flex items-center gap-1 pt-1 border-t border-red-200/60">
                  ${
                    techAlert.type === 'vehicle_breakdown'
                      ? `<button id="btn-backup-${techAlert.id}" class="flex-1 py-1 px-2 bg-red-700 hover:bg-red-800 text-white rounded text-[10px] font-bold cursor-pointer">
                          توجيه فان مساندة
                        </button>`
                      : `<button id="btn-recalib-${techAlert.id}" class="flex-1 py-1 px-2 bg-orange-700 hover:bg-orange-800 text-white rounded text-[10px] font-bold cursor-pointer">
                          إعادة ضبط النطاق
                        </button>`
                  }
                  <button id="btn-resolve-${techAlert.id}" class="py-1 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold cursor-pointer">
                    معالجة
                  </button>
                </div>
              </div>
            `
              : ''
          }

          <!-- Normal Telemetry Details -->
          <div class="space-y-1 text-xs text-gray-700 mb-3">
            <div class="flex justify-between">
              <span>الحي الميداني:</span>
              <span class="font-bold text-gray-900">${t.district}</span>
            </div>
            <div class="flex justify-between">
              <span>البطارية:</span>
              <span class="font-bold font-mono ${t.batteryLevel < 30 ? 'text-red-600' : 'text-emerald-700'}">${t.batteryLevel}%</span>
            </div>
            <div class="flex justify-between">
              <span>السرعة الحالية:</span>
              <span class="font-bold font-mono text-gray-900">${t.speed} كم/س</span>
            </div>
            ${
              t.activeOrderId
                ? `
              <div class="flex justify-between text-blue-800 bg-blue-50 p-1 rounded font-mono">
                <span>المهمة الحالية:</span>
                <span class="font-bold">${t.activeOrderId}</span>
              </div>
            `
                : ''
            }
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center gap-1.5 pt-1 border-t border-gray-100">
            <button id="dispatch-btn-${t.technicianId}" class="flex-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center">
              تعيين مهمة
            </button>
            <button id="select-btn-${t.technicianId}" class="py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-colors cursor-pointer">
              تفاصيل الفان
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -35],
      });

      marker.on('click', () => {
        onSelectTech(t);
        if (techAlert && onSelectAlert) {
          onSelectAlert(techAlert);
        }
      });

      marker.on('popupopen', () => {
        const dispatchBtn = document.getElementById(`dispatch-btn-${t.technicianId}`);
        const selectBtn = document.getElementById(`select-btn-${t.technicianId}`);

        if (dispatchBtn) {
          dispatchBtn.onclick = () => {
            if (pendingOrders.length > 0 && onDispatchOrder) {
              onDispatchOrder(pendingOrders[0].orderNo, t.technicianName);
            } else {
              alert(`تم إرسال إشعار توجيه إلى ${t.technicianName} (${t.vehicleNo})`);
            }
          };
        }

        if (selectBtn) {
          selectBtn.onclick = () => {
            onSelectTech(t);
          };
        }

        if (techAlert) {
          const btnBackup = document.getElementById(`btn-backup-${techAlert.id}`);
          const btnRecalib = document.getElementById(`btn-recalib-${techAlert.id}`);
          const btnResolve = document.getElementById(`btn-resolve-${techAlert.id}`);

          if (btnBackup && onDispatchBackupVan) {
            btnBackup.onclick = () => {
              onDispatchBackupVan(techAlert.id, 'فان أكسجين #12 (محمد السوري)');
              marker.closePopup();
            };
          }

          if (btnRecalib && onRecalibrateGeofence) {
            btnRecalib.onclick = () => {
              onRecalibrateGeofence(techAlert.id);
              marker.closePopup();
            };
          }

          if (btnResolve && onResolveAlert) {
            btnResolve.onclick = () => {
              onResolveAlert(techAlert.id, 'تمت المعالجة والإقرار من الخريطة');
              marker.closePopup();
            };
          }
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // 5. Draw route line from selected technician to destination
    if (routeLineLayerRef.current) {
      routeLineLayerRef.current.remove();
      routeLineLayerRef.current = null;
    }

    if (selectedTech) {
      const destLat = selectedTech.lat + (selectedTech.status === 'in_transit' ? 0.012 : 0.008);
      const destLng = selectedTech.lng + (selectedTech.status === 'in_transit' ? -0.015 : 0.009);

      const latlngs: [number, number][] = [
        [selectedTech.lat, selectedTech.lng],
        [
          (selectedTech.lat + destLat) / 2 + 0.002,
          (selectedTech.lng + destLng) / 2 - 0.001,
        ],
        [destLat, destLng],
      ];

      const isBreakdown = selectedTech.status === 'sos_stalled' || selectedTech.mechanicalStatus === 'breakdown';
      const routeColor = isBreakdown ? '#dc2626' : selectedTech.status === 'in_transit' ? '#825100' : '#006948';

      const routeLine = L.polyline(latlngs, {
        color: routeColor,
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(mapInstanceRef.current);

      routeLineLayerRef.current = routeLine;
    }
  }, [liveTechs, selectedTech, selectedCity, alerts, geofences, showGeofences, filterMode]);

  // 6. Handle Focused Alert Change
  useEffect(() => {
    if (!mapInstanceRef.current || !focusedAlertId) return;

    const targetAlert = alerts.find((a) => a.id === focusedAlertId);
    if (!targetAlert) return;

    // Fly directly to the affected vehicle
    mapInstanceRef.current.flyTo([targetAlert.lat, targetAlert.lng], 15, {
      duration: 1.2,
    });

    // Match technician
    const targetTech = liveTechs.find((t) => t.technicianId === targetAlert.technicianId);
    if (targetTech) {
      onSelectTech(targetTech);
    }
  }, [focusedAlertId]);

  // Recenter map on selected technician
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !selectedTech) return;
    mapInstanceRef.current.flyTo([selectedTech.lat, selectedTech.lng], 14, {
      duration: 1.2,
    });
  };

  const activeAlertsCount = alerts.filter((a) => a.status !== 'resolved').length;
  const breakdownCount = alerts.filter((a) => a.status !== 'resolved' && a.type === 'vehicle_breakdown').length;
  const geofenceCount = alerts.filter((a) => a.status !== 'resolved' && a.type === 'geofence_breach').length;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#bccac0]/30 shadow-md bg-[#e5eeff] transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[460px] sm:h-[500px]'
      }`}
    >
      {/* Actual Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Controls Overlay */}
      <div className="absolute top-3 inset-x-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Real-time Status Badge & Active Alert Counter */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#ffffff]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-[#0b1c30] flex items-center gap-2 border border-[#bccac0]/30">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveSimActive ? 'bg-[#006948] animate-ping' : 'bg-gray-400'
              }`}
            ></span>
            <span>خريطة توجيه الأسطول GPS</span>
            <span className="bg-[#85f8c4] text-[#002114] text-[10px] px-2 py-0.5 rounded-full font-bold">
              {liveTechs.filter((t) => selectedCity === 'all' || t.city === selectedCity).length} سيارة
            </span>
          </div>

          {/* Alert Ticker Indicator */}
          {activeAlertsCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterMode(filterMode === 'alerts_only' ? 'all' : 'alerts_only')}
              className={`px-3 py-1.5 rounded-full shadow-md text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                filterMode === 'alerts_only'
                  ? 'bg-red-700 text-white border-red-800 ring-2 ring-red-400 animate-pulse'
                  : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>{activeAlertsCount} تنبيهات ميدانية</span>
              {breakdownCount > 0 && (
                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {breakdownCount} عطل
                </span>
              )}
              {geofenceCount > 0 && (
                <span className="bg-orange-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {geofenceCount} نطاق
                </span>
              )}
            </button>
          )}
        </div>

        {/* Action Controls: Cities, Geofence Toggle, Sim, Fullscreen */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {onCityChange && (
            <div className="bg-[#ffffff]/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-[#bccac0]/30 flex items-center gap-1 text-[11px] font-bold">
              {(['all', 'الرياض', 'جدة', 'مكة المكرمة'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCityChange(c)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCity === c
                      ? 'bg-[#006948] text-white shadow-xs'
                      : 'text-[#565e74] hover:text-[#0b1c30]'
                  }`}
                >
                  {c === 'all' ? 'الكل' : c}
                </button>
              ))}
            </div>
          )}

          {/* Geofence Layer Toggle */}
          <button
            type="button"
            onClick={() => setShowGeofences(!showGeofences)}
            title="تبديل عرض النطاقات الجغرافية على الخريطة"
            className={`p-2 rounded-xl backdrop-blur-md shadow-md border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
              showGeofences
                ? 'bg-[#006948] text-white border-[#006948]'
                : 'bg-white/90 text-[#565e74] border-[#bccac0]/30 hover:bg-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden md:inline">النطاقات الجغرافية</span>
          </button>

          {/* Live Jitter Simulation Toggle */}
          <button
            type="button"
            onClick={() => setIsLiveSimActive(!isLiveSimActive)}
            title="تبديل محاكاة حركة المركبات اللحظية"
            className={`p-2 rounded-xl backdrop-blur-md shadow-md border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
              isLiveSimActive
                ? 'bg-[#006948] text-white border-[#006948]'
                : 'bg-white/90 text-[#565e74] border-[#bccac0]/30 hover:bg-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveSimActive ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">بث حي</span>
          </button>

          {/* Center on Selected Tech */}
          <button
            type="button"
            onClick={handleRecenter}
            title="توسيط الخريطة على الفان المحدد"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-[#bccac0]/30 text-[#006948] hover:bg-[#eff4ff] cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
              }, 300);
            }}
            title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-[#bccac0]/30 text-[#565e74] hover:text-[#0b1c30] cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Telemetry Strip */}
      <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none">
        <div className="bg-[#ffffff]/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-lg border border-[#bccac0]/30 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          {/* Selected Tech Quick Glance */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                selectedTech.status === 'sos_stalled' || selectedTech.mechanicalStatus === 'breakdown'
                  ? 'bg-red-600 animate-pulse'
                  : selectedTech.geofenceStatus === 'breached'
                  ? 'bg-orange-600'
                  : 'bg-[#006948]'
              }`}
            >
              {selectedTech.status === 'sos_stalled' || selectedTech.mechanicalStatus === 'breakdown' ? (
                <Wrench className="w-5 h-5 text-white" />
              ) : selectedTech.geofenceStatus === 'breached' ? (
                <ShieldAlert className="w-5 h-5 text-white" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#0b1c30]">
                  {selectedTech.technicianName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#006948] font-bold">
                  {selectedTech.vehicleNo}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                    ? 'تعطل ميكانيكي'
                    : selectedTech.geofenceStatus === 'breached'
                    ? 'تجاوز النطاق'
                    : selectedTech.status === 'available'
                    ? 'متاح'
                    : selectedTech.status === 'in_transit'
                    ? 'في الطريق'
                    : 'قيد التنفيذ'}
                </span>
              </div>
              <p className="text-[11px] text-[#565e74]">
                {selectedTech.city} • {selectedTech.district} • السرعة: {selectedTech.speed} كم/س
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#565e74]">
              <Battery
                className={`w-4 h-4 ${
                  selectedTech.batteryLevel < 30 ? 'text-red-500' : 'text-[#006948]'
                }`}
              />
              <span className="font-bold">{selectedTech.batteryLevel}%</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[#565e74]">
              <span className="text-[11px]">مخزون R410A:</span>
              <span className="font-bold text-[#006948]">
                {selectedTech.inventory.freonR410A_cylinders} أسطوانات
              </span>
            </div>

            {selectedTech.activeOrderId && (
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                {selectedTech.activeOrderId}
              </span>
            )}

            <button
              type="button"
              onClick={handleRecenter}
              className="px-3 py-1.5 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>تتبع الفان</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
