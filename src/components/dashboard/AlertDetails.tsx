
import React from 'react';
import { Info } from 'lucide-react';
import { format } from 'date-fns';
import { Alert } from './AlertsSection';

interface AlertDetailsProps {
  alert: Alert;
}

export const AlertDetails: React.FC<AlertDetailsProps> = ({ alert }) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">#{alert.sequential_id} - {alert.title}</h3>
      <div className="flex items-center text-sm text-muted-foreground">
        <Info size={16} className="mr-1" />
        <span>Data: {formatDate(alert.created_at)}</span>
      </div>
      <p className="text-sm whitespace-pre-wrap">{alert.description}</p>
    </div>
  );
};
