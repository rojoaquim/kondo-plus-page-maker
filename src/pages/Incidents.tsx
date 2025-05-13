
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface Incident {
  id: number;
  title: string;
  status: string;
  date: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  assignedTo: string;
}

const Incidents: React.FC = () => {
  const [incidents] = useState<Incident[]>([
    { id: 1, title: "Falha no sistema", status: "Aberto", date: "10/05/2025", priority: "Alta", assignedTo: "Carlos Silva" },
    { id: 2, title: "Erro de login", status: "Em andamento", date: "09/05/2025", priority: "Média", assignedTo: "Ana Santos" },
    { id: 3, title: "Servidor fora do ar", status: "Resolvido", date: "08/05/2025", priority: "Alta", assignedTo: "Marcos Oliveira" },
    { id: 4, title: "Problemas com acesso remoto", status: "Aberto", date: "07/05/2025", priority: "Baixa", assignedTo: "Juliana Costa" },
    { id: 5, title: "Lentidão no sistema", status: "Em andamento", date: "06/05/2025", priority: "Média", assignedTo: "Paulo Mendes" },
    { id: 6, title: "Erro na interface do usuário", status: "Resolvido", date: "05/05/2025", priority: "Baixa", assignedTo: "Lucia Ferreira" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">INCIDENTES</h1>
        <Link to="/incidents/new">
          <Button className="bg-kondo-primary hover:bg-kondo-secondary">
            Registrar novo incidente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-kondo-accent" />
              Últimos incidentes
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
                  <th className="text-left pb-2">Prioridade</th>
                  <th className="text-left pb-2">Responsável</th>
                  <th className="text-left pb-2">Data</th>
                  <th className="text-left pb-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-b last:border-0">
                    <td className="py-3">#{incident.id}</td>
                    <td className="py-3">{incident.title}</td>
                    <td className="py-3">
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
                    <td className="py-3">
                      <span 
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          incident.priority === 'Alta' 
                            ? 'bg-red-100 text-red-800' 
                            : incident.priority === 'Média'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {incident.priority}
                      </span>
                    </td>
                    <td className="py-3">{incident.assignedTo}</td>
                    <td className="py-3">{incident.date}</td>
                    <td className="py-3">
                      <Link to={`/incidents/${incident.id}`} className="text-kondo-primary hover:underline mr-2">
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

export default Incidents;
