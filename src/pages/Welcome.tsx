import { useState } from 'react';
import { WelcomeCarousel } from '@/components/mobile/WelcomeCarousel';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
export const Welcome = () => {
  const [showCarousel, setShowCarousel] = useState(true);
  if (showCarousel) {
    return <WelcomeCarousel onComplete={() => setShowCarousel(false)} />;
  }
  return <div className="min-h-screen flex flex-col bg-gradient-dark">
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Murranno Music
          </h1>
          <p className="text-lg text-white/80">Your Music, Your Revenue, Your World</p>
        </div>
        
        <div className="w-full max-w-sm space-y-6">
          <Link to="/login">
            <Button className="w-full gradient-primary music-button shadow-glow" size="lg">
              Log In
            </Button>
          </Link>
          
          <Link to="/signup">
            <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" size="lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>;
};