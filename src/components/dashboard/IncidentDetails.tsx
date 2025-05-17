
import React from 'react';
import { Info } from 'lucide-react';
import { format } from 'date-fns';
import { Incident } from './IncidentsSection';

interface IncidentDetailsProps {
  incident: Incident;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident }) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">#{incident.sequential_id} - {incident.title}</h3>
        <span 
          className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(incident.status)}`}
        >
          {incident.status}
        </span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Info size={16} className="mr-1" />
        <span>Data: {formatDate(incident.created_at)}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">Descrição:</p>
        <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
      </div>
      
      {incident.response && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-slate-700">Resposta:</p>
          <p className="text-sm whitespace-pre-wrap">{incident.response}</p>
        </div>
      )}
      
      {incident.closing_note && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-slate-700">Nota de encerramento:</p>
          <p className="text-sm whitespace-pre-wrap">{incident.closing_note}</p>
        </div>
      )}
    </div>
  );
};
