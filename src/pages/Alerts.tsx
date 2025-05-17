
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AlertFilters from '@/components/alerts/AlertFilters';
import AlertsTable from '@/components/alerts/AlertsTable';
import AlertDialog from '@/components/alerts/AlertDialog';
import NewAlertDialog from '@/components/alerts/NewAlertDialog';
import { useAlerts } from '@/hooks/useAlerts';

const Alerts: React.FC = () => {
  const {
    isSindico,
    searchQuery,
    setSearchQuery,
    selectedAlert,
    alertDialogOpen,
    setAlertDialogOpen,
    newAlertOpen,
    setNewAlertOpen,
    newAlertTitle,
    setNewAlertTitle,
    newAlertDescription,
    setNewAlertDescription,
    submitting,
    loading,
    handleAlertClick,
    handleCreateAlert,
    filteredAlerts,
    alerts
  } = useAlerts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AVISOS</h1>
        {isSindico && (
          <Button
            onClick={() => setNewAlertOpen(true)}
            className="bg-kondo-primary hover:bg-kondo-secondary text-white shadow-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Novo aviso
          </Button>
        )}
      </div>

      <AlertFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <AlertsTable 
        alerts={alerts}
        loading={loading}
        filteredAlerts={filteredAlerts}
        handleAlertClick={handleAlertClick}
      />

      <AlertDialog 
        selectedAlert={selectedAlert}
        alertDialogOpen={alertDialogOpen}
        setAlertDialogOpen={setAlertDialogOpen}
      />

      <NewAlertDialog 
        newAlertOpen={newAlertOpen}
        setNewAlertOpen={setNewAlertOpen}
        newAlertTitle={newAlertTitle}
        setNewAlertTitle={setNewAlertTitle}
        newAlertDescription={newAlertDescription}
        setNewAlertDescription={setNewAlertDescription}
        handleCreateAlert={handleCreateAlert}
        submitting={submitting}
      />
    </div>
  );
};

export default Alerts;
