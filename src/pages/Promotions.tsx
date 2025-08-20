import { ArrowLeft, Megaphone, Target, TrendingUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

interface CampaignPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  reach: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

const campaignPackages: CampaignPackage[] = [
  {
    id: 'playlist',
    title: 'Playlist Pitching',
    description: 'Get your track featured on curated playlists',
    price: '$49',
    reach: '10K-50K listeners',
    duration: '2 weeks',
    features: ['Spotify playlists', 'Apple Music playlists', 'Performance report'],
  },
  {
    id: 'tiktok',
    title: 'TikTok Influencer Boost',
    description: 'Partner with TikTok creators for viral content',
    price: '$89',
    reach: '50K-200K views',
    duration: '1 week',
    features: ['Micro-influencer partnerships', 'Hashtag campaigns', 'Video analytics'],
    popular: true,
  },
  {
    id: 'instagram',
    title: 'Instagram Ad Package',
    description: 'Targeted Instagram story and feed advertisements',
    price: '$69',
    reach: '25K-100K users',
    duration: '10 days',
    features: ['Story ads', 'Feed promotion', 'Audience targeting'],
  },
  {
    id: 'youtube',
    title: 'YouTube Pre-Roll Ads',
    description: 'Your music in front of YouTube viewers',
    price: '$129',
    reach: '100K-500K views',
    duration: '2 weeks',
    features: ['Video pre-roll ads', 'Music discovery ads', 'Geographic targeting'],
  },
];

export const Promotions = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mobile-container">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-muted-foreground" />
          </Link>
          <h1 className="text-2xl font-bold">Promotions Hub</h1>
        </div>

        {/* Hero Section */}
        <Card className="gradient-primary text-white mb-6">
          <CardContent className="p-6 text-center">
            <Megaphone className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Amplify Your Reach</h2>
            <p className="text-white/80">
              Run targeted campaigns to get your music discovered by the right audience
            </p>
          </CardContent>
        </Card>

        {/* Campaign Packages */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Campaign Packages
          </h3>
          
          {campaignPackages.map((pkg) => (
            <Card key={pkg.id} className="stat-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pkg.title}</CardTitle>
                    {pkg.popular && (
                      <Badge className="gradient-secondary text-white mt-2">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{pkg.price}</p>
                    <p className="text-sm text-muted-foreground">one-time</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{pkg.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Reach</p>
                    <p className="font-semibold">{pkg.reach}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{pkg.duration}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Features included:</p>
                  <ul className="text-sm space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className={`w-full music-button ${
                    pkg.popular 
                      ? 'gradient-secondary shadow-secondary' 
                      : 'gradient-primary shadow-primary'
                  }`}
                >
                  Start Campaign
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Campaigns */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2 text-primary" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">TikTok Boost - "Summer Vibes"</p>
                  <p className="text-sm text-muted-foreground">5 days remaining</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-success">Active</p>
                  <p className="text-xs text-muted-foreground">12K views</p>
                </div>
              </div>
              
              <div className="text-center text-muted-foreground py-4">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start your first campaign to see results here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};