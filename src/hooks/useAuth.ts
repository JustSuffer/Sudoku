import { useEffect } from 'react';
import { useGameStore } from './useGameStore';
import { supabase } from '@/integrations/supabase/client';
import { UserStats } from '@/types/game';

export const useAuth = () => {
  const { user, session, setUser, setSession, setUserStats } = useGameStore();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer data fetching to prevent deadlocks
          setTimeout(() => {
            loadUserStats(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserStats(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserStats(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setUserStats]);

  const loadUserStats = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user stats:', error);
        return;
      }

      if (data) {
        const userStatsData: UserStats = {
          ...data,
          best_times: data.best_times as Record<string, number>,
        };
        setUserStats(userStatsData);
      }
    } catch (error) {
      console.error('Error in loadUserStats:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setUserStats(null);
    }
    return { error };
  };

  return {
    user,
    session,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};