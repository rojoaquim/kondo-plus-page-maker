
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const NewIncident: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado para registrar um incidente');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('incidents')
        .insert([
          {
            title,
            description,
            user_id: user.id,
            status: 'Aberto'
          }
        ]);

      if (error) {
        console.error('Erro ao criar incidente:', error);
        toast.error('Erro ao registrar incidente');
        return;
      }
      
      toast.success('Incidente registrado com sucesso!');
      navigate('/incidents');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Novo Incidente</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <AlertTriangle size={18} className="text-kondo-accent" />
            Registrar Incidente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Digite um título breve para o incidente"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o incidente"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/incidents')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-kondo-accent hover:bg-kondo-accent/90"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Registrar Incidente'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewIncident;
