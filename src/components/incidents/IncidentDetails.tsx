
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Incident } from '@/hooks/useIncidents';

interface IncidentDetailsProps {
  incident: Incident;
  isAdmin: boolean;
  submitting: boolean;
  onResponse: (incidentId: string, response: string) => Promise<boolean>;
  onResolve: (incidentId: string, closingNote: string) => Promise<boolean>;
  onClose: () => void;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incident,
  isAdmin,
  submitting,
  onResponse,
  onResolve,
  onClose
}) => {
  const [response, setResponse] = useState('');
  const [closingNote, setClosingNote] = useState('');
  
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

  const handleResponseSubmit = async () => {
    const success = await onResponse(incident.id, response);
    if (success) {
      onClose();
    }
  };

  const handleResolveSubmit = async () => {
    const success = await onResolve(incident.id, closingNote);
    if (success) {
      onClose();
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
      
      <div className="text-sm text-muted-foreground">
        <span>Data: {formatDate(incident.created_at)}</span>
      </div>
      
      {isAdmin && incident.author && (
        <div className="text-sm bg-slate-50 p-3 rounded-md">
          <p><strong>Autor:</strong> {incident.author.full_name}</p>
          <p><strong>Apartamento:</strong> {incident.author.apartment}</p>
          <p><strong>Bloco:</strong> {incident.author.block}</p>
        </div>
      )}
      
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-700">Descrição:</p>
        <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
      </div>
      
      {incident.response && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-slate-700">Resposta:</p>
          <p className="text-sm whitespace-pre-wrap">{incident.response}</p>
          {incident.responded_at && (
            <p className="text-xs text-slate-500 mt-1">
              Respondido em {formatDate(incident.responded_at)}
            </p>
          )}
        </div>
      )}
      
      {incident.closing_note && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-slate-700">Nota de encerramento:</p>
          <p className="text-sm whitespace-pre-wrap">{incident.closing_note}</p>
          {incident.resolved_at && (
            <p className="text-xs text-slate-500 mt-1">
              Resolvido em {formatDate(incident.resolved_at)}
            </p>
          )}
        </div>
      )}
      
      {isAdmin && incident.status === 'Aberto' && (
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
              onClick={handleResponseSubmit}
              className="bg-kondo-primary hover:bg-kondo-secondary"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Responder'}
            </Button>
          </div>
        </div>
      )}
      
      {isAdmin && incident.status === 'Respondido' && (
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
              onClick={handleResolveSubmit}
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

export default IncidentDetails;
