
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert } from './types';

interface AlertDialogProps {
  selectedAlert: Alert | null;
  alertDialogOpen: boolean;
  setAlertDialogOpen: (open: boolean) => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  selectedAlert,
  alertDialogOpen,
  setAlertDialogOpen
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedAlert?.title}</DialogTitle>
        </DialogHeader>
        {selectedAlert && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <span>ID: #{selectedAlert.sequential_id} | Data: {formatDate(selectedAlert.created_at)}</span>
            </div>
            
            <div className="mt-4">
              <p className="whitespace-pre-wrap text-sm">{selectedAlert.description}</p>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setAlertDialogOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
