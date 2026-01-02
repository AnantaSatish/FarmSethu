
import { supabase } from '../supabaseClient';
import { UserRole } from '../types';

export const authService = {
  // Existing Email/Pass for Admin/Agent
  async signUp(email: string, password: string, role: UserRole, name: string) {
    if (!supabase) {
      return { data: { user: { id: 'mock-user', email, user_metadata: { role, full_name: name } } }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, full_name: name } },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    if (!supabase) {
      return { data: { user: { id: 'mock-user', email, user_metadata: { role: UserRole.ADMIN, full_name: 'Mock Admin' } } }, error: null };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  },

  // New Phone/OTP methods
  async signInWithPhone(phone: string) {
    if (!supabase) {
      console.log("Mock OTP sent to:", phone);
      return { data: {}, error: null };
    }
    // Note: Phone must be in E.164 format (e.g., +919876543210)
    return await supabase.auth.signInWithOtp({ phone });
  },

  async verifyPhoneOtp(phone: string, token: string, metadata?: Record<string, any>) {
    if (!supabase) {
      return { 
        data: { 
          user: { 
            id: 'mock-user-phone', 
            phone, 
            user_metadata: metadata || { role: UserRole.CUSTOMER, full_name: 'Mock Phone User' } 
          } 
        }, 
        error: null 
      };
    }
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    // If it's a new signup and metadata is provided, update user metadata
    if (!error && metadata) {
      await supabase.auth.updateUser({
        data: metadata
      });
    }

    return { data, error };
  },

  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
