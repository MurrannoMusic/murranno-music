import { useState } from 'react';
import { ChevronRight, Music, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SlideProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const slides: SlideProps[] = [
  {
    icon: Music,
    title: "Distribute Your Music Globally",
    description: "Upload once and reach all major streaming platforms including Spotify, Apple Music, Boomplay, and more.",
    gradient: "gradient-primary"
  },
  {
    icon: TrendingUp,
    title: "Promote & Grow Your Fanbase",
    description: "Run targeted campaigns, playlist pitching, and influencer partnerships to amplify your reach.",
    gradient: "gradient-secondary"
  },
  {
    icon: DollarSign,
    title: "Track Royalties & Get Paid Fast",
    description: "Real-time analytics, transparent earnings, and fast payouts to your bank or mobile money wallet.",
    gradient: "gradient-dark"
  }
];

interface WelcomeCarouselProps {
  onComplete: () => void;
}

export const WelcomeCarousel = ({ onComplete }: WelcomeCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <div className="w-full max-w-sm">
          {slides.map((slide, index) => (
            <Card
              key={index}
              className={`transition-smooth transform ${
                index === currentSlide 
                  ? 'opacity-100 scale-100 translate-x-0' 
                  : index < currentSlide 
                    ? 'opacity-0 scale-95 -translate-x-full absolute'
                    : 'opacity-0 scale-95 translate-x-full absolute'
              } ${index === currentSlide ? 'relative' : ''}`}
            >
              <div className="p-8 text-center space-y-6">
                <div className={`w-20 h-20 mx-auto rounded-2xl ${slide.gradient} flex items-center justify-center shadow-glow`}>
                  <slide.icon className="h-10 w-10 text-white" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress indicators */}
        <div className="flex space-x-2 mt-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-smooth ${
                index === currentSlide ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-4">
        <Button 
          onClick={nextSlide}
          className="w-full gradient-primary music-button shadow-primary"
          size="lg"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            'Get Started'
          )}
        </Button>
        
        {currentSlide < slides.length - 1 && (
          <Button 
            onClick={skipToEnd}
            variant="ghost" 
            className="w-full"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
};