
import React from 'react';
import UserManagement from '@/components/UserManagement';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Admin: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <Alert>
        <AlertTitle>Importante!</AlertTitle>
        <AlertDescription>
          Esta página permite gerenciar usuários quando eles não conseguem se registrar por causa de conflitos. 
          Use com cuidado, pois a exclusão de usuários é irreversível.
        </AlertDescription>
      </Alert>
      
      <UserManagement />
    </div>
  );
};

export default Admin;
