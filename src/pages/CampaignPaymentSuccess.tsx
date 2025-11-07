import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CampaignPaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [campaignName, setCampaignName] = useState('');
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }

    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      // Verify payment with Paystack
      const paystackResponse = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}`,
          },
        }
      );

      const paystackData = await paystackResponse.json();

      if (paystackData.status && paystackData.data.status === 'success') {
        const campaignId = paystackData.data.metadata.campaign_id;

        // Fetch campaign details to verify update
        const { data: campaign, error } = await supabase
          .from('campaigns')
          .select('name, status, payment_status')
          .eq('id', campaignId)
          .single();

        if (error) {
          console.error('Error fetching campaign:', error);
          throw error;
        }

        setCampaignName(campaign.name);
        setStatus('success');
        toast.success('Payment successful! Your campaign is now under review.');
      } else {
        setStatus('failed');
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      toast.error('Failed to verify payment. Please contact support.');
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Campaign Payment" />

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-8">
          {status === 'verifying' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">Verifying Payment</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-6">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Payment Successful!</h2>
                <p className="text-muted-foreground">
                  Your campaign "{campaignName}" has been paid and is now under review by our team.
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => navigate('/app/campaign-manager')}
                  className="w-full"
                >
                  View My Campaigns
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/app/promotions')}
                  className="w-full"
                >
                  Create Another Campaign
                </Button>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="text-center space-y-6">
              <XCircle className="h-16 w-16 mx-auto text-destructive" />
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Payment Failed</h2>
                <p className="text-muted-foreground">
                  We couldn't verify your payment. Please try again or contact support if the issue persists.
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => navigate('/app/promotions')}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/app/campaign-manager')}
                  className="w-full"
                >
                  View My Campaigns
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
