
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { Alert } from './types';

interface AlertsTableProps {
  alerts: Alert[];
  loading: boolean;
  filteredAlerts: Alert[];
  handleAlertClick: (alert: Alert) => void;
}

const AlertsTable: React.FC<AlertsTableProps> = ({
  loading,
  filteredAlerts,
  handleAlertClick
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  return (
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
                    <td className="py-3">#{alert.sequential_id}</td>
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
  );
};

export default AlertsTable;
