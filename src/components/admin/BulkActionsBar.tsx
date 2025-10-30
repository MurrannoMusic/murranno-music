import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BulkActionsBarProps {
  selectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export const BulkActionsBar = ({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onClear,
  isLoading = false,
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-card border border-border/50 rounded-xl shadow-lg p-4 flex items-center gap-4 backdrop-blur-xl">
        <Badge variant="secondary" className="px-3 py-1.5">
          {selectedCount} selected
        </Badge>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onApproveAll}
            disabled={isLoading}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Approve All
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={onRejectAll}
            disabled={isLoading}
          >
            <XCircle className="h-4 w-4" />
            Reject All
          </Button>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
