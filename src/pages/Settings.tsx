
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Simulação de temas
const themes = [
  { id: 'light', name: 'Claro' },
  { id: 'dark', name: 'Escuro' },
  { id: 'system', name: 'Sistema' }
];

// Simulação de idiomas
const languages = [
  { id: 'pt-BR', name: 'Português (Brasil)' },
  { id: 'en-US', name: 'English (United States)' },
  { id: 'es', name: 'Español' }
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('pt-BR');
  const [notifications, setNotifications] = useState(true);
  const [compactSidebar, setCompactSidebar] = useState(() => {
    // Recuperar a configuração do localStorage
    const savedCompactSidebar = localStorage.getItem('compactSidebar');
    return savedCompactSidebar ? JSON.parse(savedCompactSidebar) : false;
  });

  // Efeito para atualizar o localStorage quando a configuração da sidebar mudar
  useEffect(() => {
    localStorage.setItem('compactSidebar', JSON.stringify(compactSidebar));
    // Disparar um evento personalizado para notificar outros componentes
    const event = new CustomEvent('sidebarCompactChange', { 
      detail: { compact: compactSidebar } 
    });
    window.dispatchEvent(event);
  }, [compactSidebar]);

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso');
    // Forçar um recarregamento para aplicar as mudanças
    navigate(0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Preferências da Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select value={theme} onValueChange={(value) => setTheme(value)}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language} onValueChange={(value) => setLanguage(value)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2 pt-2">
            <Label htmlFor="notifications" className="flex flex-col space-y-1">
              <span>Notificações</span>
              <span className="font-normal text-xs text-gray-500">
                Receber notificações sobre novos incidentes e avisos
              </span>
            </Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 pt-2">
            <Label htmlFor="compact-sidebar" className="flex flex-col space-y-1">
              <span>Menu lateral compacto</span>
              <span className="font-normal text-xs text-gray-500">
                Exibir o menu lateral em formato reduzido
              </span>
            </Label>
            <Switch
              id="compact-sidebar"
              checked={compactSidebar}
              onCheckedChange={setCompactSidebar}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-kondo-primary hover:bg-kondo-secondary">
          Salvar configurações
        </Button>
      </div>
    </div>
  );
};

export default Settings;
