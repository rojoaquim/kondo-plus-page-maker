
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NewAlertDialogProps {
  newAlertOpen: boolean;
  setNewAlertOpen: (open: boolean) => void;
  newAlertTitle: string;
  setNewAlertTitle: (title: string) => void;
  newAlertDescription: string;
  setNewAlertDescription: (description: string) => void;
  handleCreateAlert: () => Promise<void>;
  submitting: boolean;
}

const NewAlertDialog: React.FC<NewAlertDialogProps> = ({
  newAlertOpen,
  setNewAlertOpen,
  newAlertTitle,
  setNewAlertTitle,
  newAlertDescription,
  setNewAlertDescription,
  handleCreateAlert,
  submitting
}) => {
  return (
    <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Aviso</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={newAlertTitle}
              onChange={(e) => setNewAlertTitle(e.target.value)}
              placeholder="Digite o título do aviso"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newAlertDescription}
              onChange={(e) => setNewAlertDescription(e.target.value)}
              placeholder="Digite a descrição do aviso"
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setNewAlertOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateAlert}
            className="bg-kondo-primary hover:bg-kondo-secondary"
            disabled={submitting}
          >
            {submitting ? 'Criando...' : 'Criar Aviso'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewAlertDialog;
