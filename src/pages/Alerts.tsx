
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Alert {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
}

const Alerts: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertDescription, setNewAlertDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAlerts();
    checkUserRole();
  }, []);

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

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar avisos:', error);
        toast.error('Erro ao carregar avisos');
        return;
      }
      
      setAlerts(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar avisos');
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setOverlayOpen(true);
  };

  const closeOverlay = () => {
    setOverlayOpen(false);
    setSelectedAlert(null);
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAlertTitle || !newAlertDescription) {
      toast.error('Por favor, preencha todos os campos');
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
      
      if (error) {
        console.error('Erro ao criar aviso:', error);
        toast.error('Erro ao criar aviso');
        return;
      }
      
      toast.success('Aviso criado com sucesso!');
      setNewAlertOpen(false);
      setNewAlertTitle('');
      setNewAlertDescription('');
      fetchAlerts();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar aviso');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const OverlayContent = () => {
    if (!selectedAlert) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">#{selectedAlert.id.slice(0, 8)} - {selectedAlert.title}</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          <span>Data: {formatDate(selectedAlert.created_at)}</span>
        </div>
        <div className="mt-4">
          <p className="text-sm whitespace-pre-wrap">{selectedAlert.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AVISOS</h1>
        {isAdmin && (
          <Button 
            onClick={() => setNewAlertOpen(true)} 
            className="bg-kondo-primary hover:bg-kondo-secondary flex items-center gap-2"
          >
            <Plus size={18} />
            Novo aviso
          </Button>
        )}
      </div>

      <div className="flex items-center relative mb-4">
        <Search size={20} className="absolute left-3 text-gray-400" />
        <Input
          placeholder="Buscar avisos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-kondo-accent" />
              Avisos
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">ID</th>
                  <th className="text-left pb-2">Título</th>
                  <th className="text-left pb-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center">Carregando...</td>
                  </tr>
                ) : filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center">Nenhum aviso encontrado</td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => (
                    <tr 
                      key={alert.id} 
                      className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAlertClick(alert)}
                    >
                      <td className="py-3">#{alert.id.slice(0, 8)}</td>
                      <td className="py-3">{alert.title}</td>
                      <td className="py-3">{formatDate(alert.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Overlay para visualizar detalhes do aviso */}
      {isMobile ? (
        <Drawer open={overlayOpen} onOpenChange={setOverlayOpen}>
          <DrawerContent>
            <DrawerHeader className="relative">
              <DrawerTitle>Detalhes do Aviso</DrawerTitle>
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
              <DialogTitle>Detalhes do Aviso</DialogTitle>
            </DialogHeader>
            <OverlayContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Overlay para criar novo aviso */}
      {isMobile ? (
        <Drawer open={newAlertOpen} onOpenChange={setNewAlertOpen}>
          <DrawerContent>
            <DrawerHeader className="relative">
              <DrawerTitle>Novo Aviso</DrawerTitle>
              <DrawerClose className="absolute right-4 top-4" onClick={() => setNewAlertOpen(false)}>
                <X className="h-4 w-4" />
              </DrawerClose>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <form onSubmit={handleNewAlert} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <Input
                    id="title"
                    value={newAlertTitle}
                    onChange={(e) => setNewAlertTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <Textarea
                    id="description"
                    value={newAlertDescription}
                    onChange={(e) => setNewAlertDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-kondo-primary hover:bg-kondo-secondary"
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Criar Aviso'}
                </Button>
              </form>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Aviso</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewAlert} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Título
                </label>
                <Input
                  id="title"
                  value={newAlertTitle}
                  onChange={(e) => setNewAlertTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <Textarea
                  id="description"
                  value={newAlertDescription}
                  onChange={(e) => setNewAlertDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setNewAlertOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-kondo-primary hover:bg-kondo-secondary"
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Criar Aviso'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Alerts;
