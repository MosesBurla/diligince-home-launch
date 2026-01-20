import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../../services/api.service';
import { apiRoutes } from '../../../services/api.routes';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = useCallback(async (userData: any) => {
    setIsLoading(true);
    try {
      let data: any = await api.post(apiRoutes.auth.register, userData);
      data = data || {};
      console.log(data);
      if (!data.success || data.success === false) {
        // API returned success: false
        const message = data.error?.message || "An error occurred during sign up.";
        toast.error(message);
        return { success: false, error: message };
      }

      // Success: show green toast
      toast.success(data?.message || "Registration successful. Please check your email and phone to verify your account.");

      navigate('/login');
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      debugger
      const message = error.response?.data?.message || "An unexpected error occurred. Please try again.";
      // Error: show red toast
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [toast, navigate]);

  return {
    signUp,
    isLoading
  };
};
