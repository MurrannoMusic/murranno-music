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
    <div className="gradient-primary p-6 text-white mobile-safe-top">
      <div className="flex items-center gap-4 mb-4">
        {backTo && (
          <Link to={backTo}>
            <ArrowLeft className="h-6 w-6" />
          </Link>
        )}
        <div className="flex-1">
          <h1 className="mobile-heading">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-base">{subtitle}</p>
          )}
        </div>
        {actions}
      </div>
    </div>
  );
};