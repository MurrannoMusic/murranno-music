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
    <Card className={`group ${bgColor} p-6 hover:scale-105 transition-all duration-300 cursor-pointer border-0 rounded-2xl min-h-[240px] flex flex-col justify-between`}>
      <div className="flex flex-col gap-3">
        <div className="w-fit">
          <Icon className="h-9 w-9 text-[#7C3AED]" strokeWidth={2.5} />
        </div>
        <h3 className="font-bold text-lg text-white">{title}</h3>
        <p className="text-sm text-white/80 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
          {description}
        </p>
      </div>
      <button className="flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all w-fit mt-2">
        Learn More <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  );
};
