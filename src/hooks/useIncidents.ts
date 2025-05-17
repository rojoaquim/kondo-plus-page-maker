
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';

export interface Incident {
  id: string;
  sequential_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
  response?: string;
  closing_note?: string;
  responded_at?: string;
  resolved_at?: string;
  author?: {
    full_name: string;
    apartment: string;
    block: string;
  };
}

export const useIncidents = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const checkUserRole = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Erro ao verificar papel do usuário:', error);
      return;
    }
    
    setIsAdmin(data.role === 'sindico');
  };

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar incidentes:', error);
        toast.error('Erro ao carregar incidentes');
        return;
      }
      
      // Se for síndico, busca os dados dos autores
      if (isAdmin && data) {
        const incidentsWithAuthors = await Promise.all(
          data.map(async (incident) => {
            const { data: authorData, error: authorError } = await supabase
              .from('profiles')
              .select('full_name, apartment, block')
              .eq('id', incident.user_id)
              .single();
            
            if (authorError || !authorData) {
              console.error('Erro ao buscar autor:', authorError);
              return incident;
            }
            
            return {
              ...incident,
              author: authorData
            };
          })
        );
        
        setIncidents(incidentsWithAuthors);
      } else {
        setIncidents(data || []);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar incidentes');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (incidentId: string, response: string) => {
    if (!response) {
      toast.error('Por favor, insira uma resposta');
      return false;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('incidents')
        .update({
          status: 'Respondido',
          response,
          responded_at: new Date().toISOString()
        })
        .eq('id', incidentId);
      
      if (error) {
        console.error('Erro ao responder incidente:', error);
        toast.error('Erro ao responder incidente');
        return false;
      }
      
      toast.success('Incidente respondido com sucesso!');
      await fetchIncidents();
      return true;
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao responder incidente');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (incidentId: string, closingNote: string) => {
    if (!closingNote) {
      toast.error('Por favor, insira uma nota de encerramento');
      return false;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('incidents')
        .update({
          status: 'Resolvido',
          closing_note: closingNote,
          resolved_at: new Date().toISOString()
        })
        .eq('id', incidentId);
      
      if (error) {
        console.error('Erro ao resolver incidente:', error);
        toast.error('Erro ao resolver incidente');
        return false;
      }
      
      toast.success('Incidente resolvido com sucesso!');
      await fetchIncidents();
      return true;
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao resolver incidente');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    checkUserRole();
  }, [user]);

  useEffect(() => {
    fetchIncidents();
  }, [isAdmin]);

  return {
    incidents,
    loading,
    isAdmin,
    submitting,
    fetchIncidents,
    handleResponse,
    handleResolve
  };
};
