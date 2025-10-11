import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WalletBalance {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  currency: string;
  updated_at: string;
  created_at: string;
}

export const useWalletBalance = () => {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setBalance(null);
        return;
      }

      const { data, error } = await supabase
        .from('wallet_balance')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newBalance, error: createError } = await supabase
          .from('wallet_balance')
          .insert({
            user_id: user.id,
            available_balance: 0,
            pending_balance: 0,
            total_earnings: 0,
            currency: 'NGN',
          })
          .select()
          .single();

        if (createError) throw createError;
        setBalance(newBalance);
      } else {
        setBalance(data);
      }
    } catch (error: any) {
      console.error('Error fetching wallet balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch wallet balance',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    const channel = supabase
      .channel('wallet_balance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_balance',
        },
        () => {
          fetchBalance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    balance,
    loading,
    refetch: fetchBalance,
  };
};
