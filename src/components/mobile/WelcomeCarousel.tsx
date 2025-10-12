import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import prototypeOne from '@/assets/prototype-1.jpg';
import prototypeTwo from '@/assets/prototype-2.jpg';
import prototypeThree from '@/assets/prototype-3.jpg';

interface SlideProps {
  title: string;
  description: string;
  backgroundImage: string;
}

const slides: SlideProps[] = [
  {
    title: "Distribute Your Music Globally",
    description: "Upload once and reach all major streaming platforms including Spotify, Apple Music, Boomplay, and more.",
    backgroundImage: prototypeOne
  },
  {
    title: "Promote & Grow Your Fanbase",
    description: "Run targeted campaigns, playlist pitching, and influencer partnerships to amplify your reach.",
    backgroundImage: prototypeTwo
  },
  {
    title: "Track Royalties & Get Paid Fast",
    description: "Real-time analytics, transparent earnings, and fast payouts to your bank or mobile money wallet.",
    backgroundImage: prototypeThree
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background images */}
      {slides.map((slide, index) => (
        <div
          key={`bg-${index}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div className="relative z-10 flex-1 flex flex-col justify-end items-center px-6 py-8">
        <div className="w-full max-w-sm">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-smooth transform ${
                index === currentSlide 
                  ? 'opacity-100 scale-100 translate-x-0' 
                  : index < currentSlide 
                    ? 'opacity-0 scale-95 -translate-x-full absolute'
                    : 'opacity-0 scale-95 translate-x-full absolute'
              } ${index === currentSlide ? 'relative' : ''}`}
            >
              <Card className="backdrop-blur-xl bg-black/30 border-white/20">
                <div className="p-8 text-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-white/90 text-base leading-relaxed drop-shadow-md">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
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
      <div className="relative z-10 p-6 space-y-4">
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
            className="w-full text-white hover:text-white hover:bg-white/10"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
};