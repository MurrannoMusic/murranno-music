import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import musicianBg from '@/assets/musician-background.jpg';

export const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${musicianBg})`,
          backgroundSize: 'cover',
          backgroundPosition: '65% center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content positioned with header at top */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between pt-8 pb-8">
        <div className="mobile-container">
          <div className="flex items-center mb-8">
            <Link to="/get-started" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-white drop-shadow-lg" />
            </Link>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Welcome Back</h1>
          </div>
        </div>
        
        <div className="mobile-container">

          <Card className="backdrop-blur-xl bg-black/30 border-white/20 shadow-2xl">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-center text-2xl text-white drop-shadow-lg">Log in to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white/90 drop-shadow-md">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-white/90 drop-shadow-md">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-primary music-button shadow-primary" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/90 drop-shadow-md">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary font-medium hover:underline drop-shadow-lg">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};