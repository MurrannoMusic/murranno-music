import { Music } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingNav = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Murranno Music</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('services')} className="text-foreground/80 hover:text-primary transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('why')} className="text-foreground/80 hover:text-primary transition-colors">
              Resources
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="text-foreground/80 hover:text-primary transition-colors">
              Blog
            </button>
            <button onClick={() => scrollToSection('footer')} className="text-foreground/80 hover:text-primary transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
