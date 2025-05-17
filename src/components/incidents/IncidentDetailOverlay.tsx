
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import IncidentDetails from './IncidentDetails';
import { Incident } from '@/hooks/useIncidents';

interface IncidentDetailOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIncident: Incident | null;
  isMobile: boolean;
  isAdmin: boolean;
  submitting: boolean;
  onResponse: (incidentId: string, response: string) => Promise<boolean>;
  onResolve: (incidentId: string, closingNote: string) => Promise<boolean>;
  onClose: () => void;
}

const IncidentDetailOverlay: React.FC<IncidentDetailOverlayProps> = ({
  open,
  onOpenChange,
  selectedIncident,
  isMobile,
  isAdmin,
  submitting,
  onResponse,
  onResolve,
  onClose
}) => {
  if (!selectedIncident) {
    return null;
  }

  const Content = () => (
    <IncidentDetails 
      incident={selectedIncident} 
      isAdmin={isAdmin}
      submitting={submitting}
      onResponse={onResponse}
      onResolve={onResolve}
      onClose={onClose}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="relative">
            <DrawerTitle>Detalhes do Incidente</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4" onClick={onClose}>
              <X className="h-4 w-4" />
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Incidente</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailOverlay;
