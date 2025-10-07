import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, backTo, actions }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-dark backdrop-blur-xl border-b border-border/20 p-4 text-foreground mobile-safe-top">
      <div className="flex items-center gap-3 mb-1">
        {backTo && (
          <Link to={backTo} className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="flex-1">
          <h1 className="heading-lg">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground/80 mt-1">{subtitle}</p>
          )}
        </div>
        {actions}
      </div>
    </div>
  );
};