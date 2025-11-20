import { Columns, Layers, Folder, CreditCard, List, Square } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

export const ServicesSection = () => {
  const services = [
    { icon: Columns, title: "Music Distribution", variant: "primary" as const },
    { icon: Layers, title: "Promotion", variant: "secondary" as const },
    { icon: Folder, title: "Streaming Analytics", variant: "primary" as const },
    { icon: CreditCard, title: "Artist Profile Creation", variant: "secondary" as const },
    { icon: List, title: "Artist Support", variant: "primary" as const },
    { icon: Square, title: "Cover Arts & Videos", variant: "secondary" as const },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-6xl mx-auto">
          <p className="text-sm font-semibold tracking-wider text-foreground/60 mb-2">
            FOCUS AREAS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Music Business Solutions
          </h2>
          <p className="text-foreground/70 max-w-2xl">
            We empower artists from every background to thrive in today's digital and interconnected global music industry.
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
