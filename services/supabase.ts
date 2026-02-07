import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Updated credentials for project: yeuylglkldywzywrvbhx
const supabaseUrl = 'https://yeuylglkldywzywrvbhx.supabase.co'.trim();
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldXlsZ2xrbGR5d3p5d3J2Ymh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTA3NjMsImV4cCI6MjA4NTk4Njc2M30.v6FDDz0YTYHLIG2BRi3aKV7hzIVCI5r2fYToVrH5Zn0'.trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Signs up a new user. 
 */
export const signUpUser = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (error) throw error;
  return data;
};

/**
 * Signs in a user with email and password.
 */
export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
};

/**
 * Initiates Google OAuth flow.
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    }
  });
  if (error) throw error;
  return data;
};

/**
 * Signs out the current user.
 */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};