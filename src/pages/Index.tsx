
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, Info, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { format } from 'date-fns';

interface Incident {
  id: string;
  sequential_id: number;
  title: string;
  status: string;
  created_at: string;
  description: string;
  response?: string;
  closing_note?: string;
}

interface Alert {
  id: string;
  sequential_id: number;
  title: string;
  created_at: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSindico, setIsSindico] = useState(false);

  useEffect(() => {
    fetchData();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setIsSindico(data?.role === 'sindico');
    } catch (error) {
      console.error('Erro ao verificar papel do usuário:', error);
    }
  };

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

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto':
        return 'bg-red-100 text-red-800';
      case 'Respondido':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolvido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const OverlayContent = () => {
    const item = selectedIncident || selectedAlert;
    if (!item) return null;

    if (selectedIncident) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">#{selectedIncident.sequential_id} - {selectedIncident.title}</h3>
            <span 
              className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(selectedIncident.status)}`}
            >
              {selectedIncident.status}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Info size={16} className="mr-1" />
            <span>Data: {formatDate(selectedIncident.created_at)}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Descrição:</p>
            <p className="text-sm whitespace-pre-wrap">{selectedIncident.description}</p>
          </div>
          
          {selectedIncident.response && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-medium text-slate-700">Resposta:</p>
              <p className="text-sm whitespace-pre-wrap">{selectedIncident.response}</p>
            </div>
          )}
          
          {selectedIncident.closing_note && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-medium text-slate-700">Nota de encerramento:</p>
              <p className="text-sm whitespace-pre-wrap">{selectedIncident.closing_note}</p>
            </div>
          )}
        </div>
      );
    } else {
      // Mostra informações do alerta selecionado
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">#{selectedAlert.sequential_id} - {selectedAlert.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Info size={16} className="mr-1" />
            <span>Data: {formatDate(selectedAlert.created_at)}</span>
          </div>
          <p className="text-sm">{selectedAlert.description}</p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-100 to-teal-50 p-6 min-h-full rounded-lg">
      <h1 className="text-xl font-semibold text-center">HOME</h1>

      {/* Últimos Avisos Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <Bell size={16} className="text-kondo-accent" />
            <h2 className="text-base font-medium">Avisos</h2>
          </div>
          {isSindico && (
            <Link to="/alerts">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus size={14} />
                Novo
              </Button>
            </Link>
          )}
        </div>
        <div className="bg-white rounded-md shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="w-24">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : recentAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Nenhum aviso encontrado</TableCell>
                </TableRow>
              ) : (
                recentAlerts.map((alert) => (
                  <TableRow 
                    key={alert.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <TableCell>{alert.sequential_id}</TableCell>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{formatDate(alert.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Últimos Incidentes Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2">
          <AlertTriangle size={16} className="text-kondo-accent" />
          <h2 className="text-base font-medium">Incidentes</h2>
        </div>
        <div className="bg-white rounded-md shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : recentIncidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Nenhum incidente encontrado</TableCell>
                </TableRow>
              ) : (
                recentIncidents.map((incident) => (
                  <TableRow 
                    key={incident.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleIncidentClick(incident)}
                  >
                    <TableCell>{incident.sequential_id}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(incident.status)}`}
                      >
                        {incident.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(incident.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end pt-2">
          <Link to="/incidents/new">
            <Button className="bg-kondo-primary hover:bg-kondo-secondary">
              Registrar novo incidente
            </Button>
          </Link>
        </div>
      </div>

      {/* Overlay component - uses Dialog for desktop and Drawer for mobile */}
      {isMobile ? (
        <Drawer open={overlayOpen} onOpenChange={setOverlayOpen}>
          <DrawerContent>
            <DrawerHeader className="relative">
              <DrawerTitle>Detalhes</DrawerTitle>
              <DrawerClose className="absolute right-4 top-4" onClick={closeOverlay}>
                <X className="h-4 w-4" />
              </DrawerClose>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <OverlayContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={overlayOpen} onOpenChange={setOverlayOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes</DialogTitle>
            </DialogHeader>
            <OverlayContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
