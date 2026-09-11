import React, { useState, useEffect } from 'react';
import { MapPin, Phone, ShieldCheck, Filter, Info, Navigation, AlertCircle, Building2, ExternalLink, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet resize bug in React tabs
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// 100% Offline Pure HTML/CSS Marker Pins
const activePin = L.divIcon({
  className: 'leaflet-div-icon-clean',
  html: `<div style="background-color: #16a34a; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: bold; cursor: pointer;">✓</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16]
});

const restrictedPin = L.divIcon({
  className: 'leaflet-div-icon-clean',
  html: `<div style="background-color: #dc2626; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: bold; cursor: pointer;">✕</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16]
});

// District coordinate anchors for Gujarat
const DISTRICT_COORDS = {
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Gandhinagar": { lat: 23.2156, lng: 72.6369 },
  "Vadodara": { lat: 22.3072, lng: 73.1812 },
  "Surat": { lat: 21.1702, lng: 72.8311 },
  "Sanand": { lat: 22.9868, lng: 72.3812 }
};

// Haversine distance calculator (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function PartnerMap({ partners = [], selectedSchemeFilter = 'ALL', t, lang }) {
  // Normalize filter: case-insensitive ('ALL' vs 'All')
  const [schemeFilter, setSchemeFilter] = useState(selectedSchemeFilter ? selectedSchemeFilter.toUpperCase() : 'ALL');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' or 'all'
  const [selectedDistrict, setSelectedDistrict] = useState('Ahmedabad');
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id || null);
  const [mapMode, setMapMode] = useState('interactive'); // 'interactive' or 'leaflet'

  useEffect(() => {
    if (selectedSchemeFilter) {
      setSchemeFilter(selectedSchemeFilter.toUpperCase());
    }
  }, [selectedSchemeFilter]);

  const userLocation = DISTRICT_COORDS[selectedDistrict] || DISTRICT_COORDS["Ahmedabad"];

  // Filter partners with case-insensitive check
  const filteredPartners = partners.filter(p => {
    const isAllSchemes = !schemeFilter || schemeFilter === 'ALL' || schemeFilter === 'All';
    const matchScheme = isAllSchemes || (p.supportedSchemes && p.supportedSchemes.some(s => s.toUpperCase() === schemeFilter));
    const matchStatus = statusFilter === 'all' || p.status === 'active';
    return matchScheme && matchStatus;
  }).map(p => {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
    return { ...p, distanceKm: dist };
  }).sort((a, b) => a.distanceKm - b.distanceKm); // Sort by proximity

  const selectedPartner = partners.find(p => p.id === selectedPartnerId) || filteredPartners[0] || partners[0];

  const schemes = [
    { code: 'ALL', label: 'All Schemes' },
    { code: 'MFS', label: 'Micro Financing (MFS)' },
    { code: 'TERM_LOAN', label: 'Term Loan' },
    { code: 'UDYAM_NIDHI', label: 'Udyam Nidhi' },
    { code: 'ELS', label: 'Education Loan (ELS)' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>{t?.partners?.title || 'Geo-Spatial Channel Partner Router'}</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t?.partners?.subtitle || 'Locate authorized SCAs, PSBs, and RRBs verified for your scheme in Gujarat'}
          </p>
        </div>

        {/* User District Origin Switcher */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg text-xs font-semibold text-blue-900">
          <Compass className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Your Location:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-white border border-blue-300 text-blue-900 font-bold px-2 py-1 rounded outline-none cursor-pointer"
          >
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Gandhinagar">Gandhinagar</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Surat">Surat</option>
            <option value="Sanand">Sanand</option>
          </select>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Scheme Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600">Scheme:</span>
            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              {schemes.map(s => (
                <option key={s.code} value={s.code}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Operational Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option value="active">Active & Recommended Only</option>
              <option value="all">All (Including Restricted)</option>
            </select>
          </div>

          {/* Map Display Mode */}
          <div className="flex items-center bg-gray-200 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setMapMode('interactive')}
              className={`px-3 py-1.5 rounded-md transition ${mapMode === 'interactive' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Visual Geo-Map
            </button>
            <button
              onClick={() => setMapMode('leaflet')}
              className={`px-3 py-1.5 rounded-md transition ${mapMode === 'leaflet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Street Map
            </button>
          </div>
        </div>

        {/* Smart Routing Guarantee */}
        <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-md border border-emerald-200 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Smart Routing: High-overdue agencies are filtered out to ensure loan viability.</span>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* LEFT COLUMN: Map View (8 cols) */}
        <div className="lg:col-span-7 bg-slate-50 border-r border-gray-200 relative flex flex-col justify-between overflow-hidden">
          
          {mapMode === 'interactive' ? (
            /* 100% OFFLINE Interactive Vector Geo-Map */
            <div className="p-6 flex-1 flex flex-col justify-between">
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Gujarat State Channel Network Map
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Showing {filteredPartners.length} Agencies
                </span>
              </div>

              {/* Stylized Visual Map Board */}
              <div className="relative w-full h-[400px] bg-white rounded-xl border border-gray-200 p-6 shadow-inner flex flex-col justify-between">
                
                {/* Geographic Grid Lines & Background */}
                <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
                  backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>

                {/* Gujarat District Nodes */}
                <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
                  
                  {/* Northern Zone (Gandhinagar / Ahmedabad) */}
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-900">Gandhinagar Zone</span>
                        <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-bold">State HQ</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">GSCDC Head Office • Dr. Jivraj Mehta Bhavan</p>
                    </div>

                    <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-900">Ahmedabad Urban Core</span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold">Lead District</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">GSCDC District, Bank of Baroda Lead Bank, SBI Lal Darwaja</p>
                    </div>

                    <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-900">Sanand Rural Belt</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">RRB</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">Baroda Gujarat Gramin Bank (Sanand)</p>
                    </div>
                  </div>

                  {/* Central & Southern Zone (Vadodara / Surat) */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-900">Vadodara Central</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">SCA</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">GSCDC Kuber Bhavan, Kothi Compound</p>
                    </div>

                    <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-900">Surat South Zone</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">SCA</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1">GSCDC Nanpura Old Civil Court Compound</p>
                    </div>

                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-rose-900">Restricted Entity (Demo)</span>
                        <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-bold">Flagged</span>
                      </div>
                      <p className="text-[11px] text-rose-700 mt-1">Apex Cooperative Society • High Audit Overdue Ratio</p>
                    </div>
                  </div>

                </div>

                {/* Selected Partner Highlight Card */}
                {selectedPartner && (
                  <div className="relative z-10 mt-3 p-3.5 bg-white border-2 border-blue-500 rounded-lg shadow-md flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {selectedPartner.type} • {selectedPartner.district}
                        </span>
                        <span className="text-xs font-extrabold text-blue-600">
                          {selectedPartner.distanceKm} km from {selectedDistrict}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 mt-0.5">{selectedPartner.name}</h4>
                      <p className="text-xs text-gray-500">{selectedPartner.address}</p>
                    </div>

                    <a
                      href={`tel:${selectedPartner.phone}`}
                      className="shrink-0 flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                )}

              </div>

              {/* Map Footer Helper */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Distances calculated automatically from {selectedDistrict}.</span>
                <span className="font-medium text-emerald-700">✓ 100% Offline Geo-Routing</span>
              </div>

            </div>
          ) : (
            /* Standard Leaflet Street Map Container with Auto-Resize */
            <div className="relative w-full h-full min-h-[480px]">
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={9}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%', minHeight: '520px' }}
              >
                <MapResizer />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredPartners.map(partner => (
                  <Marker
                    key={partner.id}
                    position={[partner.lat, partner.lng]}
                    icon={partner.status === 'active' ? activePin : restrictedPin}
                    eventHandlers={{
                      click: () => setSelectedPartnerId(partner.id)
                    }}
                  >
                    <Popup>
                      <div className="p-1 max-w-[200px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">{partner.type}</span>
                        <h4 className="font-semibold text-gray-900 text-xs mt-0.5">{partner.name}</h4>
                        <p className="text-[11px] text-gray-600 mt-1">{partner.address}</p>
                        <div className="mt-2 pt-1 border-t border-gray-100 flex justify-between items-center text-[10px]">
                          <span className={`font-bold px-1 py-0.5 rounded ${partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {partner.status === 'active' ? 'Active' : 'Restricted'}
                          </span>
                          <span className="font-medium text-gray-600">{partner.distanceKm} km away</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Interactive Partner Cards List (4 cols) */}
        <div className="lg:col-span-5 bg-white p-4 overflow-y-auto max-h-[620px] space-y-3">
          
          <div className="flex justify-between items-center px-1 mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {filteredPartners.length} Matching Agencies
            </span>
            <span className="text-xs font-semibold text-gray-400">
              Sorted by Nearest
            </span>
          </div>

          {filteredPartners.map(partner => {
            const isSelected = selectedPartner?.id === partner.id;
            return (
              <div
                key={partner.id}
                onClick={() => setSelectedPartnerId(partner.id)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-500/20'
                    : partner.status === 'active'
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    : 'border-red-200 bg-red-50/30'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                        {partner.type}
                      </span>
                      <span className="text-xs font-bold text-blue-700">
                        {partner.distanceKm} km away
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mt-1">
                      {partner.name}
                    </h4>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    partner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {partner.status === 'active' ? 'Recommended' : 'Restricted'}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{partner.district} • {partner.address}</span>
                </p>

                {/* Supported Scheme Badges */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {partner.supportedSchemes?.map(code => (
                    <span
                      key={code}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        code.toUpperCase() === schemeFilter
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-800 border border-blue-100'
                      }`}
                    >
                      {code}
                    </span>
                  ))}
                </div>

                {/* Operational Details & Phone */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3 text-gray-600">
                    <span>Fund Rate: <strong className="text-gray-900">{partner.fundUtilizationRate}</strong></span>
                    <span>Avg Disb: <strong className="text-gray-900">{partner.avgDisbursementDays}d</strong></span>
                  </div>

                  {partner.status === 'active' ? (
                    <a
                      href={`tel:${partner.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{partner.phone}</span>
                    </a>
                  ) : (
                    <span className="text-red-600 font-bold text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Flagged by Audit
                    </span>
                  )}
                </div>

                {partner.status === 'restricted' && (
                  <div className="mt-2 p-2 rounded bg-red-100/60 text-red-800 text-[10px] leading-tight">
                    {partner.restrictionReason}
                  </div>
                )}
              </div>
            );
          })}

          {filteredPartners.length === 0 && (
            <div className="text-center py-16 text-gray-500 text-sm">
              <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold">No partners match the current filters.</p>
              <p className="text-xs text-gray-400 mt-1">Try selecting "All Schemes" or "All Statuses".</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}