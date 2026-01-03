import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { payout_method_id, amount, description } = await req.json()
    
    console.log('Initiating withdrawal:', { payout_method_id, amount, description })
    
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount')
    }

    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallet_balance')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (walletError) {
      console.error('Wallet error:', walletError)
      throw walletError
    }

    if (!wallet) {
      throw new Error('Wallet not found. Please contact support.')
    }

    if (wallet.available_balance < amount) {
      throw new Error('Insufficient balance')
    }

    const { data: payoutMethod, error: methodError } = await supabaseClient
      .from('payout_methods')
      .select('*')
      .eq('id', payout_method_id)
      .eq('user_id', user.id)
      .single()

    if (methodError || !payoutMethod) {
      console.error('Payout method error:', methodError)
      throw new Error('Payout method not found')
    }

    const fee = amount >= 5000 ? 50 : 25
    const netAmount = amount - fee

    const reference = `WD-${Date.now()}-${user.id.substring(0, 8)}`

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured')
    }

    const response = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        reason: description || 'Withdrawal from wallet',
        amount: Math.round(netAmount * 100),
        recipient: payoutMethod.recipient_code,
        reference: reference,
      }),
    })

    const data = await response.json()
    console.log('Paystack transfer response:', data)

    if (!data.status) {
      throw new Error(data.message || 'Failed to initiate transfer')
    }

    const { data: transaction, error: txError } = await supabaseClient
      .from('withdrawal_transactions')
      .insert({
        user_id: user.id,
        payout_method_id: payout_method_id,
        amount: amount,
        fee: fee,
        net_amount: netAmount,
        currency: 'NGN',
        status: 'processing',
        transfer_code: data.data.transfer_code,
        reference: reference,
        description: description || 'Withdrawal from wallet',
        paystack_response: data.data,
      })
      .select()
      .single()

    if (txError) {
      console.error('Transaction error:', txError)
      throw txError
    }

    const { error: balanceError } = await supabaseClient
      .from('wallet_balance')
      .update({
        available_balance: wallet.available_balance - amount,
        pending_balance: wallet.pending_balance + amount,
      })
      .eq('user_id', user.id)

    if (balanceError) {
      console.error('Balance update error:', balanceError)
    }

    await supabaseClient
      .from('payout_methods')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', payout_method_id)

    console.log('Withdrawal initiated successfully:', transaction)

    return new Response(
      JSON.stringify({
        success: true,
        data: transaction,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error initiating withdrawal:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
