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
    <div className="min-h-screen bg-background mobile-safe-bottom">
      <div className="mobile-container">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6">
          <Link to="/" className="mr-3 sm:mr-4">
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
          </Link>
          <h1 className="mobile-heading">Promotions Hub</h1>
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
          <h3 className="text-lg font-semibold flex items-center text-white">
            <Target className="h-5 w-5 mr-2 text-[#6c5ce7]" />
            Campaign Packages
          </h3>
          
          {campaignPackages.map((pkg) => (
            <Card key={pkg.id} className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">{pkg.title}</CardTitle>
                    {pkg.popular && (
                      <Badge className="bg-[#6c5ce7] text-white mt-2">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#6c5ce7]">{pkg.price}</p>
                    <p className="text-sm text-[#8b8ba3]">one-time</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#8b8ba3] mb-4">{pkg.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#8b8ba3]">Reach</p>
                    <p className="font-semibold text-white">{pkg.reach}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#8b8ba3]">Duration</p>
                    <p className="font-semibold text-white">{pkg.duration}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-[#8b8ba3] mb-2">Features included:</p>
                  <ul className="text-sm space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-white">
                        <div className="w-1 h-1 bg-[#6c5ce7] rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                  pkg.popular 
                    ? 'bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white' 
                    : 'bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white'
                }`}>
                  Start Campaign
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Campaigns */}
        <Card className="mt-6 bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Play className="h-5 w-5 mr-2 text-[#6c5ce7]" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
                <div>
                  <p className="font-medium text-white">TikTok Boost - "Summer Vibes"</p>
                  <p className="text-sm text-[#8b8ba3]">5 days remaining</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#00b894]">Active</p>
                  <p className="text-xs text-[#8b8ba3]">12K views</p>
                </div>
              </div>
              
              <div className="text-center text-[#8b8ba3] py-4">
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