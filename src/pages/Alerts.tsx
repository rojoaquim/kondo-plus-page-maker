
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface Alert {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
}

const Alerts: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSindico, setIsSindico] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  
  // Novo aviso
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
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      setIsSindico(data.role === 'sindico');
    } catch (error) {
      console.error('Erro ao verificar papel do usuário:', error);
    }
  };

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

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AVISOS</h1>
        {isSindico && (
          <Button
            onClick={() => setNewAlertOpen(true)}
            className="bg-kondo-primary hover:bg-kondo-secondary text-white shadow-lg flex items-center gap-2"
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

      {/* Dialog para visualizar detalhes do aviso */}
      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAlert?.title}</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <span>Data: {formatDate(selectedAlert.created_at)}</span>
              </div>
              
              <div className="mt-4">
                <p className="whitespace-pre-wrap text-sm">{selectedAlert.description}</p>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setAlertDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para criar novo aviso */}
      <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Aviso</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newAlertTitle}
                onChange={(e) => setNewAlertTitle(e.target.value)}
                placeholder="Digite o título do aviso"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newAlertDescription}
                onChange={(e) => setNewAlertDescription(e.target.value)}
                placeholder="Digite a descrição do aviso"
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setNewAlertOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateAlert}
              className="bg-kondo-primary hover:bg-kondo-secondary"
              disabled={submitting}
            >
              {submitting ? 'Criando...' : 'Criar Aviso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Alerts;
