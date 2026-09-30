import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  Compass,
  MapPin,
  Battery,
  Gauge,
  Layers,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  Zap,
  CheckCircle2,
  Clock,
  Phone,
  AlertTriangle,
  RotateCcw,
  Truck,
  Eye,
  Radio,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { TechnicianTelemetry, WorkOrder } from '../types';

interface FleetVisualizationMapProps {
  techs: TechnicianTelemetry[];
  orders: WorkOrder[];
  selectedTech: TechnicianTelemetry;
  onSelectTech: (tech: TechnicianTelemetry) => void;
  selectedCity: 'all' | 'الرياض' | 'جدة' | 'مكة المكرمة';
  onCityChange?: (city: 'all' | 'الرياض' | 'جدة' | 'مكة المكرمة') => void;
  onDispatchOrder?: (techId: string, orderNo: string) => void;
}

// City geographical centers
const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  all: { lat: 23.8859, lng: 45.0792, zoom: 6 },
  'الرياض': { lat: 24.774265, lng: 46.6542, zoom: 12 },
  'جدة': { lat: 21.5433, lng: 39.1728, zoom: 12 },
  'مكة المكرمة': { lat: 21.4225, lng: 39.8262, zoom: 12 },
};

export const FleetVisualizationMap: React.FC<FleetVisualizationMapProps> = ({
  techs,
  orders,
  selectedTech,
  onSelectTech,
  selectedCity,
  onCityChange,
  onDispatchOrder,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const coverageLayerRef = useRef<L.LayerGroup | null>(null);

  // UI Map Controls State
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'in_transit' | 'in_progress' | 'sos_stalled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCoverageRadius, setShowCoverageRadius] = useState(false);
  const [showCustomerPins, setShowCustomerPins] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Local animated positions for live GPS stream simulation
  const [liveTechs, setLiveTechs] = useState<TechnicianTelemetry[]>(techs);

  // Keep liveTechs in sync with incoming techs prop
  useEffect(() => {
    setLiveTechs((prev) => {
      return techs.map((t) => {
        const existing = prev.find((p) => p.technicianId === t.technicianId);
        return existing ? { ...t, lat: existing.lat, lng: existing.lng, heading: existing.heading, speed: existing.speed } : t;
      });
    });
  }, [techs]);

  // Real-time GPS stream simulation (jitter moving vehicles in realistic directions)
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setLiveTechs((prevTechs) =>
        prevTechs.map((t) => {
          // If vehicle is moving or in transit, simulate realistic micro-movements
          if (t.status === 'in_transit' || (t.status === 'in_progress' && t.speed > 0) || t.speed > 0) {
            const rad = ((t.heading || 0) * Math.PI) / 180;
            // Approx delta movement (~30-50 km/h)
            const deltaLat = Math.cos(rad) * 0.0003 + (Math.random() * 0.00008 - 0.00004);
            const deltaLng = Math.sin(rad) * 0.0003 + (Math.random() * 0.00008 - 0.00004);

            // Slightly adjust heading smoothly
            const newHeading = (t.heading + Math.floor(Math.random() * 7 - 3) + 360) % 360;
            const newSpeed = Math.max(10, Math.min(65, t.speed + Math.floor(Math.random() * 5 - 2)));

            return {
              ...t,
              lat: parseFloat((t.lat + deltaLat).toFixed(5)),
              lng: parseFloat((t.lng + deltaLng).toFixed(5)),
              heading: newHeading,
              speed: newSpeed,
            };
          }
          return t;
        })
      );
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Filtered techs
  const filteredTechs = useMemo(() => {
    return liveTechs.filter((t) => {
      const matchCity = selectedCity === 'all' || t.city === selectedCity;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        t.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchStatus && matchSearch;
    });
  }, [liveTechs, selectedCity, statusFilter, searchQuery]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const cityCenter = CITY_CENTERS[selectedCity] || CITY_CENTERS.all;
      const map = L.map(mapContainerRef.current, {
        center: [cityCenter.lat, cityCenter.lng],
        zoom: cityCenter.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Arabic-friendly, enterprise clean CartoDB Voyager tiles with OpenStreetMap fallback
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom control on top-left (for RTL)
      L.control
        .zoom({
          position: 'topleft',
        })
        .addTo(map);

      // Initialize layer groups
      coverageLayerRef.current = L.layerGroup().addTo(map);
      routesLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    // Resize map when expanded or mounted
    const timeout = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

    return () => clearTimeout(timeout);
  }, []);

  // Update Map Center when selectedCity changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const center = CITY_CENTERS[selectedCity] || CITY_CENTERS.all;
    mapInstanceRef.current.flyTo([center.lat, center.lng], center.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedCity]);

  // Render & Update Markers, Routes, and Coverage
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !routesLayerRef.current || !coverageLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();
    coverageLayerRef.current.clearLayers();

    // 1. Render Customer Orders on map (if enabled)
    if (showCustomerPins) {
      orders.forEach((ord) => {
        // Fallback realistic coordinates if not set
        const lat = ord.lat || (ord.city === 'جدة' ? 21.551 : ord.city === 'مكة المكرمة' ? 21.419 : 24.805);
        const lng = ord.lng || (ord.city === 'جدة' ? 39.168 : ord.city === 'مكة المكرمة' ? 39.835 : 46.662);

        const isOrderActive = ord.status === 'dispatched' || ord.status === 'in_progress';
        const isDisputed = ord.status === 'disputed';

        const orderIconHtml = `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border border-white text-white font-mono text-[10px] font-bold ${
              isDisputed
                ? 'bg-[#ba1a1a]'
                : isOrderActive
                ? 'bg-[#0b1c30]'
                : 'bg-[#565e74]'
            }">
              <span class="w-2 h-2 rounded-full ${isOrderActive ? 'bg-[#85f8c4] animate-ping' : 'bg-gray-300'}"></span>
              <span>${ord.orderNo}</span>
            </div>
            <div class="w-2.5 h-2.5 bg-[#0b1c30] rotate-45 mx-auto -mt-1 shadow-xs"></div>
          </div>
        `;

        const orderIcon = L.divIcon({
          html: orderIconHtml,
          className: 'custom-order-pin',
          iconSize: [80, 40],
          iconAnchor: [40, 40],
        });

        const orderMarker = L.marker([lat, lng], { icon: orderIcon });

        const orderPopupHtml = `
          <div dir="rtl" class="p-3 text-right font-sans text-xs">
            <div class="flex items-center justify-between border-b pb-2 mb-2">
              <span class="font-bold text-sm text-[#0b1c30]">${ord.orderNo}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                ord.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }">
                ${ord.status === 'in_progress' ? 'قيد التنفيذ' : ord.status === 'dispatched' ? 'في الطريق' : ord.status}
              </span>
            </div>
            <div class="text-[#006948] font-bold mb-1">${ord.serviceTitle}</div>
            <div class="text-gray-600 mb-1">العميل: ${ord.customerName}</div>
            <div class="text-gray-500 text-[11px] mb-2">العنوان: ${ord.district} • ${ord.nationalAddress}</div>
            <div class="bg-gray-50 p-2 rounded-lg text-[11px] font-mono flex items-center justify-between">
              <span>كود الدخول الآمن:</span>
              <span class="font-bold text-[#006948] text-sm">${ord.safeOtp}</span>
            </div>
          </div>
        `;

        orderMarker.bindPopup(orderPopupHtml, { className: 'motqan-leaflet-popup' });
        markersLayerRef.current?.addLayer(orderMarker);
      });
    }

    // 2. Render Technician Vehicles
    filteredTechs.forEach((t) => {
      const isSelected = selectedTech.technicianId === t.technicianId;
      const isAvailable = t.status === 'available';
      const isInTransit = t.status === 'in_transit';
      const isInProgress = t.status === 'in_progress';
      const isSos = t.status === 'sos_stalled';

      // Status colors
      const statusColor = isSos
        ? '#ba1a1a'
        : isInProgress
        ? '#1d4ed8'
        : isInTransit
        ? '#d97706'
        : '#006948';

      const statusBg = isSos
        ? 'bg-[#ba1a1a]'
        : isInProgress
        ? 'bg-[#1d4ed8]'
        : isInTransit
        ? 'bg-[#d97706]'
        : 'bg-[#006948]';

      const techIconHtml = `
        <div class="relative group cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'}" style="transform: translate(-50%, -50%);">
          ${
            isAvailable
              ? '<span class="absolute inset-0 -m-2 rounded-full bg-[#006948]/25 animate-ping pointer-events-none"></span>'
              : ''
          }
          <div class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-xl border-2 ${
            isSelected ? 'border-yellow-400 ring-4 ring-yellow-400/30' : 'border-white'
          } ${statusBg} text-white">
            <span class="material-symbols-outlined text-base">directions_car</span>
            <div class="flex flex-col text-right leading-none">
              <span class="text-[11px] font-bold whitespace-nowrap">${t.technicianName.split(' ')[0]}</span>
              <span class="text-[9px] opacity-85 font-mono">${t.speed > 0 ? `${t.speed} كم/س` : 'متوقف'}</span>
            </div>
          </div>
          <div class="w-2.5 h-2.5 ${statusBg} rotate-45 mx-auto -mt-1 shadow-sm"></div>
        </div>
      `;

      const techIcon = L.divIcon({
        html: techIconHtml,
        className: 'custom-tech-pin',
        iconSize: [90, 45],
        iconAnchor: [45, 25],
      });

      const techMarker = L.marker([t.lat, t.lng], { icon: techIcon });

      // Click to select technician
      techMarker.on('click', () => {
        onSelectTech(t);
      });

      // Rich Telemetry Popup
      const popupContent = `
        <div dir="rtl" class="p-3.5 text-right font-sans text-xs">
          <div class="flex items-center justify-between border-b pb-2 mb-2.5">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-[#006948]/10 text-[#006948] flex items-center justify-center font-bold">
                ${t.technicianName[0]}
              </div>
              <div>
                <span class="font-bold text-sm text-[#0b1c30] block">${t.technicianName}</span>
                <span class="text-[10px] text-gray-500">${t.vehicleNo}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isAvailable
                ? 'bg-emerald-100 text-emerald-800'
                : isInTransit
                ? 'bg-amber-100 text-amber-800'
                : isInProgress
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }">
              ${
                isAvailable
                  ? 'متاح للمهام'
                  : isInTransit
                  ? 'في الطريق'
                  : isInProgress
                  ? 'قيد التنفيذ'
                  : 'طوارئ'
              }
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div>
              <span class="text-[10px] text-gray-500 block">السرعة الحالية:</span>
              <span class="font-mono font-bold text-gray-800 text-xs">${t.speed} كم/س</span>
            </div>
            <div>
              <span class="text-[10px] text-gray-500 block">مستوى البطارية:</span>
              <span class="font-mono font-bold text-[#006948] text-xs">${t.batteryLevel}%</span>
            </div>
            <div>
              <span class="text-[10px] text-gray-500 block">النطاق والحي:</span>
              <span class="font-bold text-gray-800 text-xs truncate block">${t.district}</span>
            </div>
            <div>
              <span class="text-[10px] text-gray-500 block">حالة BLE Manifold:</span>
              <span class="font-bold ${t.bleConnected ? 'text-[#006948]' : 'text-gray-400'} text-xs">
                ${t.bleConnected ? 'متصل لاسلكياً' : 'غير متصل'}
              </span>
            </div>
          </div>

          <div class="mb-3">
            <span class="text-[10px] font-bold text-gray-600 block mb-1">مخزون الفان الميداني:</span>
            <div class="flex flex-wrap gap-1 text-[10px]">
              <span class="bg-blue-50 text-blue-800 px-2 py-0.5 rounded">R410A: ${t.inventory.freonR410A_cylinders}</span>
              <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">نحاس: ${t.inventory.copperCoils_meters}م</span>
              <span class="bg-amber-50 text-amber-800 px-2 py-0.5 rounded">كابستور: ${t.inventory.capacitors_45_5uF}</span>
            </div>
          </div>

          ${
            t.activeOrderId
              ? `<div class="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2 rounded-lg text-[11px] mb-2 font-bold">
                  مهمة حالية نشطة: ${t.activeOrderId}
                </div>`
              : ''
          }
        </div>
      `;

      techMarker.bindPopup(popupContent, { className: 'motqan-leaflet-popup' });
      markersLayerRef.current?.addLayer(techMarker);

      // 3. Render Coverage Buffer Circle (if enabled)
      if (showCoverageRadius) {
        const circle = L.circle([t.lat, t.lng], {
          radius: 5000, // 5km radius
          color: statusColor,
          weight: 1.5,
          opacity: 0.6,
          fillColor: statusColor,
          fillOpacity: 0.08,
          dashArray: '4, 8',
        });
        coverageLayerRef.current?.addLayer(circle);
      }

      // 4. Render Dispatch Routing Line to Active Order
      if (showRoutes && t.activeOrderId) {
        const assignedOrder = orders.find((o) => o.orderNo === t.activeOrderId || o.id === t.activeOrderId);
        if (assignedOrder) {
          const orderLat = assignedOrder.lat || (assignedOrder.city === 'جدة' ? 21.551 : assignedOrder.city === 'مكة المكرمة' ? 21.419 : 24.805);
          const orderLng = assignedOrder.lng || (assignedOrder.city === 'جدة' ? 39.168 : assignedOrder.city === 'مكة المكرمة' ? 39.835 : 46.662);

          const routeLine = L.polyline(
            [
              [t.lat, t.lng],
              [orderLat, orderLng],
            ],
            {
              color: statusColor,
              weight: isSelected ? 4 : 2.5,
              opacity: isSelected ? 0.9 : 0.6,
              dashArray: '6, 8',
            }
          );

          routesLayerRef.current?.addLayer(routeLine);
        }
      }
    });
  }, [filteredTechs, orders, selectedTech, showCoverageRadius, showCustomerPins, showRoutes]);

  // Center on selected technician when changed from outside
  const handleFocusTech = (t: TechnicianTelemetry) => {
    onSelectTech(t);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([t.lat, t.lng], 14, {
        duration: 0.8,
      });
    }
  };

  return (
    <div
      className={`w-full bg-[#ffffff] rounded-3xl shadow-sm border border-[#bccac0]/25 flex flex-col justify-between transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 p-6 bg-white overflow-hidden shadow-2xl' : 'p-6'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#006948] text-white flex items-center justify-center shadow-md">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0b1c30]">
                خريطة التوجيه اللحظية للأسطول (Real-Time Fleet Visualization Map)
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-[#006948] animate-ping"></span>
            </div>
            <p className="text-xs text-[#565e74]">
              تتبع جغرافي تفاعلي مدعوم بـ Leaflet & GPS Galileo • نطاق الرياض وجدة ومكة المكرمة
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#006948] font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-[#006948]"></span>
            <span>متاح ({liveTechs.filter((t) => t.status === 'available').length})</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>في الطريق ({liveTechs.filter((t) => t.status === 'in_transit').length})</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>قيد الصيانة ({liveTechs.filter((t) => t.status === 'in_progress').length})</span>
          </div>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsExpanded(!isExpanded);
              setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
            }}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            title={isExpanded ? 'تصغير الخريطة' : 'تكبير الشاشة بالكامل'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 bg-[#eff4ff] p-3 rounded-2xl border border-[#bccac0]/25 text-xs">
        {/* Search Input (4 cols) */}
        <div className="md:col-span-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الفني، رقم الفان، أو الحي..."
            className="w-full h-10 rounded-xl bg-white pr-9 pl-4 text-xs text-[#0b1c30] border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
        </div>

        {/* Status Filter Pills (5 cols) */}
        <div className="md:col-span-5 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'available', label: 'متاح' },
            { id: 'in_transit', label: 'في الطريق' },
            { id: 'in_progress', label: 'قيد التنفيذ' },
            { id: 'sos_stalled', label: 'طوارئ' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#006948] text-white shadow-xs'
                  : 'bg-white text-[#565e74] hover:text-[#0b1c30] border border-[#bccac0]/20'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Layer Toggles & Live GPS Switch (3 cols) */}
        <div className="md:col-span-3 flex items-center justify-end gap-2">
          {/* Toggle Live GPS Stream */}
          <button
            type="button"
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiveSimulating
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
            title="محاكاة التتبع اللحظي عبر الأقمار الصناعية"
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveSimulating ? 'animate-pulse' : ''}`} />
            <span>{isLiveSimulating ? 'البث اللحظي نشط' : 'البث متوقف'}</span>
          </button>

          {/* Toggle Coverage Circles */}
          <button
            type="button"
            onClick={() => setShowCoverageRadius(!showCoverageRadius)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showCoverageRadius
                ? 'bg-[#006948] text-white border-[#006948]'
                : 'bg-white text-gray-600 border-[#bccac0]/30 hover:bg-gray-50'
            }`}
            title="إظهار دوائر التغطية الجغرافية 5 كم"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Toggle Routes */}
          <button
            type="button"
            onClick={() => setShowRoutes(!showRoutes)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showRoutes
                ? 'bg-[#006948] text-white border-[#006948]'
                : 'bg-white text-gray-600 border-[#bccac0]/30 hover:bg-gray-50'
            }`}
            title="إظهار مسارات التوجيه نحو العميل"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#bccac0]/30 shadow-inner">
        <div
          ref={mapContainerRef}
          style={{ height: isExpanded ? 'calc(100vh - 240px)' : '420px', width: '100%' }}
          className="z-0 bg-[#f4f7f6]"
        />

        {/* Floating Quick Action Overlay on Map (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-[#bccac0]/30 flex flex-col gap-2 max-w-xs">
          <div className="flex items-center justify-between text-xs border-b pb-1.5">
            <span className="font-bold text-[#0b1c30]">الفني المحدد:</span>
            <span className="text-[#006948] font-bold">{selectedTech.technicianName}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-600">
            <span>المركبة: {selectedTech.vehicleNo}</span>
            <span>السرعة: {selectedTech.speed} كم/س</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-600">
            <span>البطارية: {selectedTech.batteryLevel}%</span>
            <span>{selectedTech.city} • {selectedTech.district}</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleFocusTech(selectedTech)}
              className="flex-1 py-1.5 rounded-lg bg-[#006948] text-white text-[11px] font-bold hover:bg-[#00855d] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>تركيز الكاميرا</span>
            </button>

            {selectedTech.activeOrderId && onDispatchOrder && (
              <button
                type="button"
                onClick={() => onDispatchOrder(selectedTech.technicianId, selectedTech.activeOrderId!)}
                className="py-1.5 px-3 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                title="تحديث مسار المهمة"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>إشعار</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Vehicle Switcher Strip (Top-Right on Map) */}
        <div className="absolute top-4 right-4 z-10 max-h-56 overflow-y-auto bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-[#bccac0]/30 flex flex-col gap-1.5 w-48 scrollbar-thin">
          <span className="text-[10px] font-bold text-gray-500 px-2 pb-1 border-b block">
            الأسطول الميداني ({filteredTechs.length})
          </span>
          {filteredTechs.map((t) => {
            const isSel = selectedTech.technicianId === t.technicianId;
            return (
              <button
                key={t.technicianId}
                type="button"
                onClick={() => handleFocusTech(t)}
                className={`p-1.5 rounded-xl text-right flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  isSel ? 'bg-[#006948] text-white font-bold' : 'hover:bg-gray-100 text-[#0b1c30]'
                }`}
              >
                <div className="truncate">
                  <span className="block truncate">{t.technicianName}</span>
                  <span className={`text-[10px] block opacity-75 ${isSel ? 'text-white' : 'text-gray-500'}`}>
                    {t.district}
                  </span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    t.status === 'available'
                      ? 'bg-[#85f8c4]'
                      : t.status === 'in_transit'
                      ? 'bg-amber-400'
                      : t.status === 'in_progress'
                      ? 'bg-blue-400'
                      : 'bg-red-400'
                  }`}
                ></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Footer Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 text-xs text-[#565e74]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#006948]"></span>
            <span>فني متاح وجاهز للإسناد</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
            <span>في الطريق نحو العميل</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1d4ed8]"></span>
            <span>قيد تنفيذ فحص ومعاينة الموقع</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0b1c30]"></span>
            <span>موقع العميل والطلب النشط</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span>دقة الرصد: 1.2 متر (RTK GPS)</span>
          <span>•</span>
          <span>تحديث التموضع: كل 3 ثوانٍ</span>
        </div>
      </div>
    </div>
  );
};
