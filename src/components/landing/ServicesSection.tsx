import { Music, TrendingUp, BarChart3, User, Headphones, Image } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

export const ServicesSection = () => {
  const services = [
    { icon: Music, title: "Music Distribution", variant: "primary" as const },
    { icon: TrendingUp, title: "Promotion", variant: "secondary" as const },
    { icon: BarChart3, title: "Streaming Analytics", variant: "primary" as const },
    { icon: User, title: "Artist Profile Creation", variant: "secondary" as const },
    { icon: Headphones, title: "Artist Support", variant: "primary" as const },
    { icon: Image, title: "Cover Arts & Videos", variant: "secondary" as const },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Music Business Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in the music industry
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              variant={service.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
