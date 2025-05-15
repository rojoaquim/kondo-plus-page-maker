
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children,
  requireAuth = false
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      console.log("Refreshing user data...");
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        console.log("User refreshed:", data.user);
        setUser(data.user);
      } else {
        console.log("No user found during refresh");
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  useEffect(() => {
    console.log("AuthProvider mounted");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session check:", session ? "Authenticated" : "Unauthenticated");
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Redirect user if requireAuth is true and user is not logged in
      if (requireAuth && !session && window.location.pathname !== '/login') {
        console.log("No session, redirecting to login");
        navigate('/login', { replace: true });
      }
    });

    return () => {
      console.log("AuthProvider unmounted, cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth]);

  // Redirect user to login page if requireAuth is true and user is not logged in
  useEffect(() => {
    if (requireAuth && !loading && !user && window.location.pathname !== '/login') {
      console.log("No user after loading completed, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate, requireAuth]);

  const value = {
    user,
    session,
    loading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
