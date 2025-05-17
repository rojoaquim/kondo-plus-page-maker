
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { Alert } from '@/components/alerts/types';
import { useUserRole } from './useUserRole';

export function useAlerts() {
  const { user } = useAuth();
  const { role } = useUserRole();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  
  // For creating a new alert
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertDescription, setNewAlertDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const isSindico = role === 'sindico';
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAlerts(data || []);
    } catch (error) {
      console.error('Erro ao buscar avisos:', error);
      toast.error('Erro ao carregar avisos');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setAlertDialogOpen(true);
  };

  const handleCreateAlert = async () => {
    if (!newAlertTitle.trim() || !newAlertDescription.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('alerts')
        .insert([
          {
            title: newAlertTitle,
            description: newAlertDescription,
            user_id: user?.id
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Aviso criado com sucesso!');
      setNewAlertOpen(false);
      setNewAlertTitle('');
      setNewAlertDescription('');
      fetchAlerts();
    } catch (error) {
      console.error('Erro ao criar aviso:', error);
      toast.error('Erro ao criar aviso');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    isSindico,
    searchQuery,
    setSearchQuery,
    selectedAlert,
    setSelectedAlert,
    alertDialogOpen,
    setAlertDialogOpen,
    newAlertOpen,
    setNewAlertOpen,
    newAlertTitle,
    setNewAlertTitle,
    newAlertDescription,
    setNewAlertDescription,
    submitting,
    handleAlertClick,
    handleCreateAlert,
    filteredAlerts
  };
}
