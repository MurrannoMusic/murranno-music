import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const HeroSection = () => {
  const [bgImage, setBgImage] = useState<string>("");

  useEffect(() => {
    const generateBackground = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-hero-background');
        if (error) throw error;
        if (data?.imageUrl) {
          setBgImage(data.imageUrl);
        }
      } catch (error) {
        console.error('Error generating background:', error);
      }
    };

    generateBackground();
  }, []);

  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#000',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Gradient overlay matching the mockup */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      
      {/* Geometric shape accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight">
            Your Music to the World
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Empowering Artists Worldwide with Digital Music Distribution and Promotions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold"
            >
              <Link to="/releases">Distribute</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg font-semibold"
            >
              <Link to="/promotions">Promote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
