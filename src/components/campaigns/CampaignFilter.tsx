import { Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CampaignFilterProps {
  statusFilter: string;
  onFilterChange: (value: string) => void;
}

export const CampaignFilter = ({ statusFilter, onFilterChange }: CampaignFilterProps) => {
  return (
    <div className="flex items-center gap-3 p-4 glass-card border border-border/20 rounded-3xl">
      <Filter className="h-5 w-5 text-primary" />
      <Select value={statusFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="flex-1 bg-transparent border-0 focus:ring-0 font-medium">
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
  );
};
