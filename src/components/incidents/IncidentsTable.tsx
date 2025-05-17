
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Incident } from '@/hooks/useIncidents';

interface IncidentsTableProps {
  incidents: Incident[];
  loading: boolean;
  onIncidentClick: (incident: Incident) => void;
  filteredIncidents: Incident[];
}

const IncidentsTable: React.FC<IncidentsTableProps> = ({ 
  incidents, 
  loading, 
  onIncidentClick, 
  filteredIncidents 
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
                    onClick={() => onIncidentClick(incident)}
                  >
                    <td className="py-3">#{incident.sequential_id}</td>
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
  );
};

export default IncidentsTable;
