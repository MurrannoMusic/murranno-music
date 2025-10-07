import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CampaignActionsProps {
  onExportToPDF: () => void;
}

export const CampaignActions = ({ onExportToPDF }: CampaignActionsProps) => {
  return (
    <Card className="glass-card border border-border/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Link to="/promotions" className="w-full">
            <Button className="w-full gradient-primary font-semibold py-5 text-xs">
              Create Campaign
            </Button>
          </Link>
          
          <Button 
            variant="outline"
            className="w-full font-semibold py-5 text-xs border-border/20"
            onClick={onExportToPDF}
          >
            Export Results
          </Button>
          
          <Button variant="outline" className="w-full font-semibold py-5 text-xs border-border/20">
            Schedule Reports
          </Button>
          
          <Button variant="outline" className="w-full font-semibold py-5 text-xs border-border/20">
            Templates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
