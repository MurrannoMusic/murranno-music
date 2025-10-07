import { Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CampaignFilterProps {
  statusFilter: string;
  onFilterChange: (value: string) => void;
}

export const CampaignFilter = ({ statusFilter, onFilterChange }: CampaignFilterProps) => {
  return (
    <Card className="glass-card border border-border/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={onFilterChange}>
            <SelectTrigger className="flex-1 glass-card border-border/20">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="glass-card border-border/20">
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
