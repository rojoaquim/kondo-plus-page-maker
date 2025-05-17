
import React, { useState } from 'react';
import { Bell, Plus, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export interface Alert {
  id: string;
  sequential_id: number;
  title: string;
  created_at: string;
  description: string;
}

interface AlertsSectionProps {
  alerts: Alert[];
  loading: boolean;
  isSindico: boolean;
  onAlertClick: (alert: Alert) => void;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ 
  alerts, 
  loading, 
  isSindico, 
  onAlertClick 
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  return (
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
            ) : alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Nenhum aviso encontrado</TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow 
                  key={alert.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => onAlertClick(alert)}
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
  );
};

export default AlertsSection;
