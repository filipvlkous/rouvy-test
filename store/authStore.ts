import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../lib/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      user: session?.user ? { id: session.user.id, email: session.user.email! } : null,
      loading: false
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ? { id: session.user.id, email: session.user.email! } : null
      });
    });
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user ? { id: data.user.id, email: data.user.email! } : null });
  },

  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user ? { id: data.user.id, email: data.user.email! } : null });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
