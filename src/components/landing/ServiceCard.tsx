import { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  variant?: "primary" | "secondary";
}

export const ServiceCard = ({ icon: Icon, title, variant = "primary" }: ServiceCardProps) => {
  return (
    <Card className={`p-6 hover:scale-105 transition-transform cursor-pointer ${
      variant === "primary" 
        ? "bg-gradient-to-br from-primary/20 to-primary/10" 
        : "bg-gradient-to-br from-accent/20 to-accent/10"
    }`}>
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-4 rounded-full ${
          variant === "primary" ? "bg-primary/20" : "bg-accent/20"
        }`}>
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        <button className="flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all">
          Learn More <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
};
