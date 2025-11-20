import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlatformLogos } from "./PlatformLogos";

export const HeroSection = () => {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-12 bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Your Music to the World
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Empowering music professionals with the tools that make the process of creating, distributing, and promoting music seamless and efficient.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8"
              onClick={scrollToServices}
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
      
      <PlatformLogos />
    </section>
  );
};
