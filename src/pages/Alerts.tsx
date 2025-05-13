
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Alert {
  id: number;
  title: string;
  date: string;
  type: string;
  author: string;
}

const Alerts: React.FC = () => {
  const [alerts] = useState<Alert[]>([
    { id: 1, title: "Manutenção programada", date: "15/05/2025", type: "Manutenção", author: "Sistema" },
    { id: 2, title: "Atualização de sistema", date: "12/05/2025", type: "Atualização", author: "Admin" },
    { id: 3, title: "Novos recursos disponíveis", date: "10/05/2025", type: "Informação", author: "Sistema" },
    { id: 4, title: "Backup do sistema", date: "08/05/2025", type: "Manutenção", author: "Admin" },
    { id: 5, title: "Problema resolvido", date: "05/05/2025", type: "Resolução", author: "Equipe Técnica" },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AVISOS</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-kondo-accent" />
              Últimos avisos
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
                  <th className="text-left pb-2">Tipo</th>
                  <th className="text-left pb-2">Autor</th>
                  <th className="text-left pb-2">Data</th>
                  <th className="text-left pb-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} className="border-b last:border-0">
                    <td className="py-3">#{alert.id}</td>
                    <td className="py-3">{alert.title}</td>
                    <td className="py-3">
                      <span 
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          alert.type === 'Manutenção' 
                            ? 'bg-orange-100 text-orange-800' 
                            : alert.type === 'Atualização'
                              ? 'bg-blue-100 text-blue-800'
                              : alert.type === 'Resolução'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {alert.type}
                      </span>
                    </td>
                    <td className="py-3">{alert.author}</td>
                    <td className="py-3">{alert.date}</td>
                    <td className="py-3">
                      <Link to={`/alerts/${alert.id}`} className="text-kondo-primary hover:underline mr-2">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
