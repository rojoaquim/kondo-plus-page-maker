
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useCheckRole = (user: User | null) => {
  const [isSindico, setIsSindico] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setIsSindico(data?.role === 'sindico');
      } catch (error) {
        console.error('Erro ao verificar papel do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  return { isSindico, loading };
};
