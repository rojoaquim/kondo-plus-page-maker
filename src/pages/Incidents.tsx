
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Incident {
  id: string;
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

const Incidents: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [response, setResponse] = useState('');
  const [closingNote, setClosingNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchIncidents();
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

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      
      // Base query
      let query = supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
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

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setResponse('');
    setClosingNote('');
    setOverlayOpen(true);
  };

  const closeOverlay = () => {
    setOverlayOpen(false);
    setSelectedIncident(null);
  };

  const handleResponse = async () => {
    if (!selectedIncident || !response) {
      toast.error('Por favor, insira uma resposta');
      return;
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
        .eq('id', selectedIncident.id);
      
      if (error) {
        console.error('Erro ao responder incidente:', error);
        toast.error('Erro ao responder incidente');
        return;
      }
      
      toast.success('Incidente respondido com sucesso!');
      closeOverlay();
      fetchIncidents();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao responder incidente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedIncident || !closingNote) {
      toast.error('Por favor, insira uma nota de encerramento');
      return;
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
        .eq('id', selectedIncident.id);
      
      if (error) {
        console.error('Erro ao resolver incidente:', error);
        toast.error('Erro ao resolver incidente');
        return;
      }
      
      toast.success('Incidente resolvido com sucesso!');
      closeOverlay();
      fetchIncidents();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao resolver incidente');
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

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const OverlayContent = () => {
    if (!selectedIncident) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">#{selectedIncident.id.slice(0, 8)} - {selectedIncident.title}</h3>
          <span 
            className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(selectedIncident.status)}`}
          >
            {selectedIncident.status}
          </span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span>Data: {formatDate(selectedIncident.created_at)}</span>
        </div>
        
        {isAdmin && selectedIncident.author && (
          <div className="text-sm bg-slate-50 p-3 rounded-md">
            <p><strong>Autor:</strong> {selectedIncident.author.full_name}</p>
            <p><strong>Apartamento:</strong> {selectedIncident.author.apartment}</p>
            <p><strong>Bloco:</strong> {selectedIncident.author.block}</p>
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700">Descrição:</p>
          <p className="text-sm whitespace-pre-wrap">{selectedIncident.description}</p>
        </div>
        
        {selectedIncident.response && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-slate-700">Resposta:</p>
            <p className="text-sm whitespace-pre-wrap">{selectedIncident.response}</p>
            {selectedIncident.responded_at && (
              <p className="text-xs text-slate-500 mt-1">
                Respondido em {formatDate(selectedIncident.responded_at)}
              </p>
            )}
          </div>
        )}
        
        {selectedIncident.closing_note && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-slate-700">Nota de encerramento:</p>
            <p className="text-sm whitespace-pre-wrap">{selectedIncident.closing_note}</p>
            {selectedIncident.resolved_at && (
              <p className="text-xs text-slate-500 mt-1">
                Resolvido em {formatDate(selectedIncident.resolved_at)}
              </p>
            )}
          </div>
        )}
        
        {isAdmin && selectedIncident.status === 'Aberto' && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-slate-700">Responder incidente:</p>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
              placeholder="Digite sua resposta..."
              className="mt-2"
            />
            <div className="flex justify-end mt-3">
              <Button 
                onClick={handleResponse}
                className="bg-kondo-primary hover:bg-kondo-secondary"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Responder'}
              </Button>
            </div>
          </div>
        )}
        
        {isAdmin && selectedIncident.status === 'Respondido' && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium text-slate-700">Resolver incidente:</p>
            <Textarea
              value={closingNote}
              onChange={(e) => setClosingNote(e.target.value)}
              rows={4}
              placeholder="Digite a nota de encerramento..."
              className="mt-2"
            />
            <div className="flex justify-end mt-3">
              <Button 
                onClick={handleResolve}
                className="bg-kondo-primary hover:bg-kondo-secondary"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Resolver'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">INCIDENTES</h1>
        <Link to="/incidents/new">
          <Button className="bg-kondo-accent hover:bg-kondo-accent/90 text-white shadow-lg flex items-center gap-2">
            <Plus size={18} />
            Registrar novo incidente
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center relative flex-1">
          <Search size={20} className="absolute left-3 text-gray-400" />
          <Input
            placeholder="Buscar incidentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              {statusFilter || "Filtrar"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
              <DropdownMenuRadioItem value="">Todos</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Aberto">Aberto</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Respondido">Respondido</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Resolvido">Resolvido</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-kondo-accent" />
              Incidentes
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
                  <th className="text-left pb-2">Status</th>
                  <th className="text-left pb-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">Carregando...</td>
                  </tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">Nenhum incidente encontrado</td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => (
                    <tr 
                      key={incident.id} 
                      className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleIncidentClick(incident)}
                    >
                      <td className="py-3">#{incident.id.slice(0, 8)}</td>
                      <td className="py-3">{incident.title}</td>
                      <td className="py-3">
                        <span 
                          className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(incident.status)}`}
                        >
                          {incident.status}
                        </span>
                      </td>
                      <td className="py-3">{formatDate(incident.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Overlay para visualizar detalhes do incidente */}
      {isMobile ? (
        <Drawer open={overlayOpen} onOpenChange={setOverlayOpen}>
          <DrawerContent>
            <DrawerHeader className="relative">
              <DrawerTitle>Detalhes do Incidente</DrawerTitle>
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
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Incidente</DialogTitle>
            </DialogHeader>
            <OverlayContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Incidents;
