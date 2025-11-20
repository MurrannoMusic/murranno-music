import { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "primary" | "secondary";
}

export const ServiceCard = ({ icon: Icon, title, description, variant = "primary" }: ServiceCardProps) => {
  const bgColor = variant === "primary" 
    ? "bg-[#E5D4F5]" 
    : "bg-[#B99FE5]";
  
  return (
    <Card className={`group ${bgColor} p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-0 rounded-2xl h-[240px] flex flex-col justify-between`}>
      <div className="flex flex-col gap-4">
        <div className="w-fit">
          <Icon className="h-10 w-10 text-[#7C3AED]" strokeWidth={2.5} />
        </div>
        <h3 className="font-semibold text-xl text-foreground">{title}</h3>
        <p className="text-sm text-foreground/70 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
      </div>
      <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:gap-3 transition-all w-fit">
        Learn More <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  );
};
