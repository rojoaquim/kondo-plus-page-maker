
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Incident } from '@/components/dashboard/IncidentsSection';
import { Alert } from '@/components/dashboard/AlertsSection';

export const useDashboardData = () => {
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Buscar incidentes recentes
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select('id, sequential_id, title, status, created_at, description, response, closing_note')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (incidentsError) throw incidentsError;
      setRecentIncidents(incidentsData || []);
      
      // Buscar alertas recentes
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('id, sequential_id, title, created_at, description')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (alertsError) throw alertsError;
      setRecentAlerts(alertsData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    recentIncidents,
    recentAlerts,
    loading,
    fetchData
  };
};
