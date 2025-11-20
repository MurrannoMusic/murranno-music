import { Link } from "react-router-dom";
import mmLogo from "@/assets/mm_logo.png";

export const LandingNav = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={mmLogo} alt="Murranno Music" className="h-10" />
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollToSection('home')} className="text-white hover:text-primary transition-colors font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('services')} className="text-white hover:text-primary transition-colors font-medium">
              Distribution
            </button>
            <button onClick={() => scrollToSection('why')} className="text-white hover:text-primary transition-colors font-medium">
              Promotions
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="text-white hover:text-primary transition-colors font-medium">
              Blog
            </button>
            <button onClick={() => scrollToSection('footer')} className="text-white hover:text-primary transition-colors font-medium">
              Support
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
