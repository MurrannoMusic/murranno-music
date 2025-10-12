import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, TrendingUp, Users, Zap, BarChart3, Wallet } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Music,
      title: 'Music Distribution',
      description: 'Distribute your music to all major streaming platforms worldwide'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track your streams, earnings, and audience insights in real-time'
    },
    {
      icon: TrendingUp,
      title: 'Campaign Management',
      description: 'Create and manage promotional campaigns to grow your fanbase'
    },
    {
      icon: Wallet,
      title: 'Earnings & Payouts',
      description: 'Track earnings and manage payouts with transparent reporting'
    },
    {
      icon: Users,
      title: 'Artist Management',
      description: 'Perfect for labels and agencies managing multiple artists'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast platform built for the modern music industry'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Murranno
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="hover:bg-primary/10"
            >
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            Your Music Career,
            <br />
            Simplified & Amplified
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The all-in-one platform for artists, labels, and agencies to distribute music, 
            track analytics, manage campaigns, and grow your audience.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-lg px-8 border-primary/20 hover:bg-primary/5"
            >
              Sign In
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            14-day free trial • No credit card required
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-105"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-20 text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12 border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Your Music Career to the Next Level?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of artists, labels, and agencies already growing with Murranno
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-10"
          >
            Start Your Free Trial
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 text-sm text-muted-foreground">
          <p>© 2024 Murranno. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
