import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CampaignActionsProps {
  onExportToPDF: () => void;
}

export const CampaignActions = ({ onExportToPDF }: CampaignActionsProps) => {
  return (
    <Card className="glass-card border border-border/20">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Campaign Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/promotions" className="w-full">
            <Button className="w-full gradient-primary font-semibold py-6 px-3 text-xs">
              Create Campaign
            </Button>
          </Link>
          
          <Button 
            variant="outline"
            className="w-full font-semibold py-6 px-3 text-xs border-border/20"
            onClick={onExportToPDF}
          >
            Export Results
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full font-semibold py-6 px-3 text-xs border-border/20">
            Schedule Reports
          </Button>
          
          <Button variant="outline" className="w-full font-semibold py-6 px-3 text-xs border-border/20">
            Templates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
