
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell } from 'lucide-react';

interface Incident {
  id: number;
  title: string;
  status: string;
  date: string;
}

interface Alert {
  id: number;
  title: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [recentIncidents] = useState<Incident[]>([
    { id: 1, title: "Falha no sistema", status: "Aberto", date: "10/05/2025" },
    { id: 2, title: "Erro de login", status: "Em andamento", date: "09/05/2025" },
    { id: 3, title: "Servidor fora do ar", status: "Resolvido", date: "08/05/2025" },
  ]);

  const [recentAlerts] = useState<Alert[]>([
    { id: 1, title: "Manutenção programada", date: "15/05/2025" },
    { id: 2, title: "Atualização de sistema", date: "12/05/2025" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">HOME</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-kondo-accent" />
                Últimos incidentes
              </div>
            </CardTitle>
            <Link to="/incidents">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Título</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id} className="border-b last:border-0">
                      <td className="py-2">{incident.title}</td>
                      <td className="py-2">
                        <span 
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            incident.status === 'Aberto' 
                              ? 'bg-red-100 text-red-800' 
                              : incident.status === 'Em andamento'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {incident.status}
                        </span>
                      </td>
                      <td className="py-2">{incident.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link to="/incidents/new">
                <Button className="w-full bg-kondo-primary hover:bg-kondo-secondary">
                  Registrar novo incidente
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-kondo-accent" />
                Últimos avisos
              </div>
            </CardTitle>
            <Link to="/alerts">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Título</th>
                    <th className="text-left pb-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b last:border-0">
                      <td className="py-2">{alert.title}</td>
                      <td className="py-2">{alert.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
