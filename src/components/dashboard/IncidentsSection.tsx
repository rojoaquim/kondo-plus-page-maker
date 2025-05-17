
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export interface Incident {
  id: string;
  sequential_id: number;
  title: string;
  status: string;
  created_at: string;
  description: string;
  response?: string;
  closing_note?: string;
}

interface IncidentsSectionProps {
  incidents: Incident[];
  loading: boolean;
  onIncidentClick: (incident: Incident) => void;
}

const IncidentsSection: React.FC<IncidentsSectionProps> = ({ 
  incidents, 
  loading, 
  onIncidentClick 
}) => {
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

  return (
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
            ) : incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Nenhum incidente encontrado</TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => (
                <TableRow 
                  key={incident.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => onIncidentClick(incident)}
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
  );
};

export default IncidentsSection;
