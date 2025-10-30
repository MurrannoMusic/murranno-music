import { Smartphone, Music, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

export const DesktopLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Music className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-foreground to-primary bg-clip-text text-transparent">
            Murranno Music
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Distribute. Promote. Earn.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-8 mb-12">
          <div className="flex items-center justify-center mb-6">
            <Smartphone className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">
            Mobile App Only
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Murranno Music is designed exclusively for mobile devices. Download our app to access all features and manage your music career on the go.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <Music className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Distribute Music</h3>
              <p className="text-sm text-muted-foreground">
                Release your tracks to major platforms worldwide
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Promote</h3>
              <p className="text-sm text-muted-foreground">
                Run campaigns and grow your audience
              </p>
            </div>
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Earn</h3>
              <p className="text-sm text-muted-foreground">
                Track earnings and manage payouts
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center text-muted-foreground">
          <p className="mb-4">Download the Murranno Music app from:</p>
          <div className="flex gap-4 justify-center">
            <Card className="px-6 py-3 hover:bg-accent cursor-pointer transition-colors">
              <p className="font-semibold">App Store</p>
              <p className="text-xs">Coming Soon</p>
            </Card>
            <Card className="px-6 py-3 hover:bg-accent cursor-pointer transition-colors">
              <p className="font-semibold">Google Play</p>
              <p className="text-xs">Coming Soon</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
