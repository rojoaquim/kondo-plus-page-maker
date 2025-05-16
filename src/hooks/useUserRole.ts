
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

export type UserRole = 'sindico' | 'morador' | '';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Checking user role for:", user.id);

        type RoleResponse = { role: string | null };

        const { data, error } = await supabase.functions.invoke('get_current_user_role');

        if (error) {
          console.error("Error fetching user role:", error);
          setError(new Error(`Error fetching user role: ${error.message}`));
          return;
        }

        const response = data as RoleResponse;
        console.log("User role:", response?.role);

        if (response && response.role) {
          setRole(response.role as UserRole);
        }
      } catch (error) {
        const err = error as Error;
        console.error('Error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, isAdmin: role === 'sindico', loading, error };
}
