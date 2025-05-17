
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/components/AuthProvider';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useCheckRole } from '@/hooks/useCheckRole';
import AlertsSection from '@/components/dashboard/AlertsSection';
import IncidentsSection from '@/components/dashboard/IncidentsSection';
import DetailOverlay from '@/components/dashboard/DetailOverlay';
import { Incident } from '@/components/dashboard/IncidentsSection';
import { Alert } from '@/components/dashboard/AlertsSection';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { recentIncidents, recentAlerts, loading } = useDashboardData();
  const { isSindico } = useCheckRole(user);
  
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setSelectedAlert(null);
    setOverlayOpen(true);
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setSelectedIncident(null);
    setOverlayOpen(true);
  };

  const closeOverlay = () => {
    setOverlayOpen(false);
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-100 to-teal-50 p-6 min-h-full rounded-lg">
      <h1 className="text-xl font-semibold text-center">HOME</h1>

      {/* Últimos Avisos Section */}
      <AlertsSection 
        alerts={recentAlerts} 
        loading={loading} 
        isSindico={isSindico} 
        onAlertClick={handleAlertClick} 
      />

      {/* Últimos Incidentes Section */}
      <IncidentsSection 
        incidents={recentIncidents} 
        loading={loading} 
        onIncidentClick={handleIncidentClick} 
      />

      {/* Overlay component for details */}
      <DetailOverlay 
        open={overlayOpen}
        onOpenChange={setOverlayOpen}
        selectedIncident={selectedIncident}
        selectedAlert={selectedAlert}
        isMobile={isMobile}
        onClose={closeOverlay}
      />
    </div>
  );
};

export default Dashboard;
