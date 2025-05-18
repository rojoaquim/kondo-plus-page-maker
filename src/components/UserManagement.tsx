
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteEmail, setDeleteEmail] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('manage_users', {
        body: { action: 'list' }
      });

      if (error) {
        throw error;
      }

      setUsers(data.users.map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: new Date(user.created_at).toLocaleString()
      })));
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Error fetching users');
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setDeleteLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('manage_users', {
        body: { action: 'delete', email: deleteEmail }
      });

      if (error) {
        throw error;
      }

      toast.success(data.message || 'User deleted successfully');
      setDeleteEmail('');
      
      // Refresh the user list
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Error deleting user');
      toast.error(`Error deleting user: ${error.message || 'Unknown error'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Button 
                onClick={fetchUsers} 
                disabled={loading}
                variant="secondary"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                List Users
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {users.length > 0 && (
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <form onSubmit={handleDeleteUser} className="pt-4 space-y-4">
              <h3 className="text-lg font-medium">Delete User</h3>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter user email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  disabled={deleteLoading || !deleteEmail}
                  variant="destructive"
                >
                  {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
