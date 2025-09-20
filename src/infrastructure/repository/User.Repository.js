import { supabase } from "../supabaseClient";

export class UserRepository {
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
      
          if (error) {
            console.error('Error signing in user:', error);
            return {isSuccess: false, data:error};
          }
      
          return {isSuccess:true,data:data}; 
    }

    async validateSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return {isSuccess: false, data:error};
        }
        return {isSuccess:true,data:data};
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error signing out user:', error);
          return {isSuccess: false, data:error};
        }
        return {isSuccess:true,data:null};
    }

    async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) {
            console.error('Error resetting password:', error);
            return {isSuccess: false, data: error};
        }
        
        return {isSuccess: true, data: data};
    }

    async updatePassword(newPassword) {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (error) {
            console.error('Error updating password:', error);
            return {isSuccess: false, data: error};
        }
        
        return {isSuccess: true, data: data};
    }
}