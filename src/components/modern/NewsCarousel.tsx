import React, { useState } from 'react';
import { Gift, Zap, Star, TrendingUp, Award } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewsDialog } from './NewsDialog';
import { NewsItem } from '@/types/news';

const iconMap = {
  gift: Gift,
  zap: Zap,
  star: Star,
  trending: TrendingUp,
  award: Award,
};

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Get Daily Cashback',
    subtitle: 'Buy Airtime, Get up to 6% cashback',
    description: 'Earn amazing cashback rewards every time you purchase airtime through our platform. The more you buy, the more you save! Start earning today and watch your savings grow.\n\nHow it works:\n• Purchase airtime directly from your dashboard\n• Automatically receive up to 6% cashback\n• Cashback credited instantly to your wallet\n• No limits on how much you can earn\n\nDon\'t miss out on this exclusive offer for our valued users!',
    icon: 'gift',
    publishedAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    title: 'New Analytics Dashboard',
    subtitle: 'Advanced insights for your music',
    description: 'We\'ve completely redesigned our analytics dashboard to give you deeper insights into your music performance.\n\nNew Features:\n• Real-time streaming data\n• Audience demographics breakdown\n• Geographic performance maps\n• Revenue forecasting tools\n• Engagement metrics\n\nUpgrade your strategy with data-driven decisions!',
    icon: 'zap',
    publishedAt: new Date('2025-01-08'),
  },
  {
    id: '3',
    title: 'Artist Spotlight',
    subtitle: 'Featured artist of the month',
    description: 'This month we\'re featuring extraordinary talent from our community! Get inspired by their journey, learn from their strategies, and discover how they achieved success.\n\nSpotlight includes:\n• Exclusive artist interview\n• Behind-the-scenes content\n• Success tips and strategies\n• Music samples and highlights\n\nStay tuned for next month\'s feature!',
    icon: 'star',
    publishedAt: new Date('2025-01-05'),
  },
  {
    id: '4',
    title: 'Boost Your Streams',
    subtitle: 'Expert promotion tips & tricks',
    description: 'Learn the secrets to maximizing your streaming numbers with our comprehensive promotion guide.\n\nTopics covered:\n• Social media marketing strategies\n• Playlist placement tactics\n• Collaboration opportunities\n• Release timing optimization\n• Fan engagement techniques\n\nTake your music career to the next level!',
    icon: 'trending',
    publishedAt: new Date('2025-01-03'),
  },
  {
    id: '5',
    title: 'VIP Rewards Program',
    subtitle: 'Exclusive benefits for top artists',
    description: 'Join our elite VIP Rewards Program and unlock exclusive benefits designed for our most successful artists.\n\nVIP Benefits:\n• Priority customer support\n• Early access to new features\n• Reduced platform fees\n• Exclusive networking events\n• Premium promotion tools\n\nQualify today by reaching our streaming milestones!',
    icon: 'award',
    publishedAt: new Date('2025-01-01'),
  },
];

export const NewsCarousel = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewNews = (news: NewsItem) => {
    setSelectedNews(news);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Special Bonus For You</h2>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {mockNews.map((news) => {
              const IconComponent = iconMap[news.icon as keyof typeof iconMap] || Gift;
              
              return (
                <CarouselItem key={news.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]">
                  <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-border/50 p-4 rounded-[20px] hover:scale-[1.02] transition-smooth">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-3 bg-primary/20 rounded-full flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm truncate">
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-400 truncate">
                            {news.subtitle}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 flex-shrink-0"
                        onClick={() => handleViewNews(news)}
                      >
                        GO
                      </Button>
                    </div>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>

      <NewsDialog
        news={selectedNews}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
