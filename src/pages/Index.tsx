
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, Info, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface Incident {
  id: number;
  title: string;
  status: string;
  date: string;
  description?: string;
}

interface Alert {
  id: number;
  title: string;
  date: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const [recentIncidents] = useState<Incident[]>([
    { 
      id: 1, 
      title: "Falha no sistema", 
      status: "Aberto", 
      date: "10/05/2025",
      description: "Falha detectada no sistema principal. A equipe técnica já foi notificada e está trabalhando para resolver o problema o mais rápido possível."
    },
    { 
      id: 2, 
      title: "Erro de login", 
      status: "Em andamento", 
      date: "09/05/2025",
      description: "Alguns usuários relataram problemas ao fazer login na plataforma. Nossa equipe está investigando as causas e implementando uma solução."
    },
    { 
      id: 3, 
      title: "Servidor fora do ar", 
      status: "Resolvido", 
      date: "08/05/2025",
      description: "O servidor secundário ficou indisponível por aproximadamente 20 minutos. O problema já foi resolvido e todos os serviços estão funcionando normalmente."
    },
  ]);

  const [recentAlerts] = useState<Alert[]>([
    { 
      id: 1, 
      title: "Manutenção programada", 
      date: "15/05/2025",
      description: "Haverá uma manutenção programada no dia 15/05 entre 02:00 e 04:00. Durante este período, o sistema poderá ficar indisponível."
    },
    { 
      id: 2, 
      title: "Atualização de sistema", 
      date: "12/05/2025",
      description: "Uma nova versão do sistema será lançada no dia 12/05. Esta atualização inclui melhorias de desempenho e correções de bugs."
    },
  ]);

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

  const OverlayContent = () => {
    const item = selectedIncident || selectedAlert;
    if (!item) return null;

    const title = selectedIncident ? `Incidente: ${item.title}` : `Aviso: ${item.title}`;
    const statusLabel = selectedIncident ? (
      <span 
        className={`inline-block px-2 py-1 rounded text-xs ${
          selectedIncident.status === 'Aberto' 
            ? 'bg-red-100 text-red-800' 
            : selectedIncident.status === 'Em andamento'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
        }`}
      >
        {selectedIncident.status}
      </span>
    ) : null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{title}</h3>
          {statusLabel}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Info size={16} className="mr-1" />
          <span>Data: {item.date}</span>
        </div>
        <p className="text-sm">{item.description}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">HOME</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-kondo-accent" />
                Últimos incidentes
              </div>
            </CardTitle>
            <Link to="/incidents">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Título</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((incident) => (
                    <tr 
                      key={incident.id} 
                      className="border-b last:border-0 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleIncidentClick(incident)}
                    >
                      <td className="py-2">{incident.title}</td>
                      <td className="py-2">
                        <span 
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            incident.status === 'Aberto' 
                              ? 'bg-red-100 text-red-800' 
                              : incident.status === 'Em andamento'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {incident.status}
                        </span>
                      </td>
                      <td className="py-2">{incident.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link to="/incidents/new">
                <Button className="w-full bg-kondo-primary hover:bg-kondo-secondary">
                  Registrar novo incidente
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-kondo-accent" />
                Últimos avisos
              </div>
            </CardTitle>
            <Link to="/alerts">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Título</th>
                    <th className="text-left pb-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert) => (
                    <tr 
                      key={alert.id} 
                      className="border-b last:border-0 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleAlertClick(alert)}
                    >
                      <td className="py-2">{alert.title}</td>
                      <td className="py-2">{alert.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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
