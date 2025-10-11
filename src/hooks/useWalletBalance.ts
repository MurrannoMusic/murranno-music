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
        console.log('No authenticated user found');
        setBalance(null);
        return;
      }

      console.log('Fetching wallet balance for user:', user.id);

      const { data, error } = await supabase
        .from('wallet_balance')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching wallet balance:', error);
        throw error;
      }

      if (!data) {
        console.log('No wallet balance found, creating new one...');
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

        if (createError) {
          console.error('Error creating wallet balance:', createError);
          throw createError;
        }
        
        console.log('Wallet balance created successfully:', newBalance);
        setBalance(newBalance);
        toast({
          title: 'Wallet Initialized',
          description: 'Your wallet has been set up successfully!',
        });
      } else {
        console.log('Wallet balance found:', data);
        setBalance(data);
      }
    } catch (error: any) {
      console.error('Error in fetchBalance:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch wallet balance',
        variant: 'destructive',
      });
      // Set balance to null on error so empty state shows
      setBalance(null);
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
