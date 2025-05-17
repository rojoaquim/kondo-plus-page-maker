
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { IncidentDetails } from './IncidentDetails';
import { AlertDetails } from './AlertDetails';
import { Incident } from './IncidentsSection';
import { Alert } from './AlertsSection';

interface DetailOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIncident: Incident | null;
  selectedAlert: Alert | null;
  isMobile: boolean;
  onClose: () => void;
}

const DetailOverlay: React.FC<DetailOverlayProps> = ({
  open,
  onOpenChange,
  selectedIncident,
  selectedAlert,
  isMobile,
  onClose,
}) => {
  if (!selectedIncident && !selectedAlert) {
    return null;
  }

  const Content = () => {
    if (selectedIncident) {
      return <IncidentDetails incident={selectedIncident} />;
    } else if (selectedAlert) {
      return <AlertDetails alert={selectedAlert} />;
    }
    return null;
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="relative">
            <DrawerTitle>Detalhes</DrawerTitle>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};

export default DetailOverlay;
