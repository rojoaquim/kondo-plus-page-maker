
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { useUserRole } from './useUserRole';
import { UserRole } from './useUserRole';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  apartment: string;
  block: string;
  role: UserRole; // Using UserRole type from useUserRole
}

export function useUserProfile() {
  const { user } = useAuth();
  const { role } = useUserRole();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching profile for user:", user.id);
        
        // Get user email from auth
        const email = user.email || '';
        
        // Get additional profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, apartment, block')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile data:', profileError);
          toast.error('Erro ao carregar dados do perfil: ' + profileError.message);
          setError(new Error(`Error fetching profile data: ${profileError.message}`));
          return;
        }
        
        const profileInfo: UserProfile = {
          id: user.id,
          email: email,
          full_name: profileData.full_name,
          apartment: profileData.apartment,
          block: profileData.block,
          role: role as UserRole
        };
        
        console.log("Profile data received:", profileInfo);
        setProfile(profileInfo);
      } catch (error) {
        const err = error as Error;
        console.error('Error:', err);
        toast.error('Ocorreu um erro ao carregar o perfil');
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    } else {
      console.log("No user available for profile fetch");
    }
  }, [user, role]);

  const updateProfile = async (data: Partial<Omit<UserProfile, 'role' | 'id' | 'email'>>) => {
    if (!user) return { error: new Error('Usuário não autenticado') };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Erro ao atualizar perfil');
        return { error };
      }
      
      // Update the state of the profile
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast.success('Perfil atualizado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ocorreu um erro ao atualizar o perfil');
      return { error };
    }
  };

  return { 
    profile, 
    loading, 
    error, 
    updateProfile 
  };
}
