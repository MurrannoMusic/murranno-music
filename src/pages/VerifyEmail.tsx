import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import musicianBg from '@/assets/musician-background.jpg';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'pending'>('pending');
  const [email, setEmail] = useState<string>('');

  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    const verifyEmail = async () => {
      if (token && type) {
        setStatus('verifying');
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type as any,
          });

          if (error) {
            console.error('Verification error:', error);
            setStatus('error');
            toast({
              title: 'Verification failed',
              description: error.message,
              variant: 'destructive',
            });
          } else {
            setStatus('success');
            toast({
              title: 'Email verified!',
              description: 'Your account has been successfully verified.',
            });
            setTimeout(() => navigate('/login'), 2000);
          }
        } catch (err) {
          console.error('Verification error:', err);
          setStatus('error');
        }
      }
    };

    verifyEmail();
  }, [token, type, navigate, toast]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to resend',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${musicianBg})`,
          backgroundSize: 'cover',
          backgroundPosition: '65% center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-black/30 border-white/20 shadow-2xl">
          <CardHeader className="bg-white/5 border-b border-white/10">
            <CardTitle className="text-center text-2xl text-white drop-shadow-lg">
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {status === 'verifying' && (
              <div className="text-center space-y-4">
                <Loader2 className="h-16 w-16 mx-auto text-primary animate-spin" />
                <p className="text-white/90 drop-shadow-md">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-400" />
                <p className="text-white/90 drop-shadow-md font-medium">
                  Email verified successfully!
                </p>
                <p className="text-white/70 text-sm drop-shadow-md">
                  Redirecting you to login...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4">
                <XCircle className="h-16 w-16 mx-auto text-red-400" />
                <p className="text-white/90 drop-shadow-md font-medium">
                  Verification failed
                </p>
                <p className="text-white/70 text-sm drop-shadow-md">
                  The verification link may be invalid or expired.
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full gradient-primary music-button shadow-primary"
                >
                  Go to Login
                </Button>
              </div>
            )}

            {status === 'pending' && (
              <div className="text-center space-y-4">
                <Mail className="h-16 w-16 mx-auto text-primary" />
                <p className="text-white/90 drop-shadow-md font-medium">
                  Check your email
                </p>
                <p className="text-white/70 text-sm drop-shadow-md">
                  We've sent you a verification link. Please check your inbox and click the link to verify your account.
                </p>
                <div className="pt-4 space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 focus:outline-none"
                  />
                  <Button
                    onClick={handleResendVerification}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Resend Verification Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
