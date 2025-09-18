import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { HazardReport } from "@shared/schema";

declare global {
  interface Window {
    L: any;
  }
}

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  const { data: reports = [], isLoading } = useQuery<HazardReport[]>({
    queryKey: ['/api/hazard-reports'],
  });

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (window.L) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(script);

      return new Promise((resolve) => {
        script.onload = resolve;
      });
    };

    const initMap = async () => {
      await loadLeaflet();
      
      if (!mapRef.current || mapInstanceRef.current) return;

      // Initialize map centered on Indian Ocean
      const map = window.L.map(mapRef.current).setView([13.045, 80.273], 8);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add markers for each report
    reports.forEach((report) => {
      const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
          case 'critical': return 'red';
          case 'high': return 'orange';
          case 'medium': return 'blue';
          case 'low': return 'green';
          default: return 'gray';
        }
      };

      const marker = window.L.marker([report.latitude, report.longitude], {
        icon: window.L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${getRiskColor(report.riskLevel!)};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })
      }).addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[250px]">
          <div class="flex items-center space-x-2 mb-2">
            <strong>${report.username}</strong>
            ${report.verified ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified</span>' : ''}
          </div>
          <p class="text-sm mb-2">${report.description}</p>
          ${report.media ? `<img src="${report.media}" alt="Report media" class="w-full h-32 object-cover rounded mb-2">` : ''}
          <div class="text-xs text-gray-500">
            <div>📍 ${report.location}</div>
            <div>⏰ ${new Date(report.createdAt!).toLocaleDateString()}</div>
            <div>🚨 Risk Level: ${report.riskLevel}</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });
  }, [reports, isLoading]);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Interactive Hazard Map</h2>
          <div className="flex items-center space-x-2">
            <button className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              All Reports
            </button>
            <button className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              Verified Only
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-card/80 z-10 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading reports...</span>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-[600px]"
          data-testid="hazard-map"
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 text-xs">
          <h4 className="font-semibold mb-2">Risk Levels</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
