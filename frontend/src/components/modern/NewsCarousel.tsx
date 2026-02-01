import React from 'react';
import { Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/news';
import newsDistribution from '@/assets/news-distribution.png';
import newsTrending from '@/assets/news-trending.png';
import newsSuccess from '@/assets/news-success.png';
import newsStrategy from '@/assets/news-strategy.png';
import newsUpdate from '@/assets/news-update.png';

const imageMap = {
  distribution: newsDistribution,
  trending: newsTrending,
  success: newsSuccess,
  strategy: newsStrategy,
  update: newsUpdate,
};

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'New Distribution Partnership Announced',
    subtitle: 'Major streaming platforms integration',
    description: 'We\'re excited to announce our new distribution partnership with major streaming platforms, expanding your music\'s reach globally.\n\nKey Highlights:\n• Direct integration with 150+ platforms\n• Faster release processing times\n• Enhanced royalty tracking\n• Priority playlist consideration\n• Global territory coverage\n\nThis partnership ensures your music reaches audiences worldwide with improved efficiency and transparency.',
    icon: 'distribution',
    publishedAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    title: 'Industry Report: Streaming Revenue Up 23%',
    subtitle: 'Latest market insights',
    description: 'The latest industry report reveals streaming revenue has increased by 23% year-over-year, signaling continued growth in the digital music landscape.\n\nKey Findings:\n• Global streaming subscriptions hit 600M+\n• Independent artists capture 35% market share\n• Emerging markets show 40% growth\n• Playlist placements drive 60% of discovery\n• Video content boosts engagement by 45%\n\nLearn how to capitalize on these trends and grow your audience.',
    icon: 'trending',
    publishedAt: new Date('2025-01-08'),
  },
  {
    id: '3',
    title: 'Artist Success Story: From Bedroom to Billboard',
    subtitle: 'Featured success case',
    description: 'Discover how independent artist Maya Johnson went from recording in her bedroom to charting on Billboard in just 18 months.\n\nHer Journey:\n• Started with zero followers and $200 budget\n• Focused on consistent releases and engagement\n• Built authentic connections with fans\n• Leveraged data to optimize strategy\n• Achieved 10M+ streams and label interest\n\nGet inspired and learn actionable strategies from her remarkable journey.',
    icon: 'success',
    publishedAt: new Date('2025-01-05'),
  },
  {
    id: '4',
    title: 'New Release Strategy Guide',
    subtitle: 'Expert tips for 2025',
    description: 'Our comprehensive 2025 release strategy guide helps you maximize impact and reach with your upcoming music.\n\nStrategy Highlights:\n• Pre-release campaign planning (4-6 weeks)\n• Content creation and social media timeline\n• Playlist pitching best practices\n• Email marketing automation\n• Post-release momentum tactics\n• Collaboration opportunities\n\nDownload the full guide and take your releases to the next level.',
    icon: 'strategy',
    publishedAt: new Date('2025-01-03'),
  },
  {
    id: '5',
    title: 'Platform Update: Enhanced Analytics Tools',
    subtitle: 'Feature announcement',
    description: 'We\'ve launched enhanced analytics tools to give you deeper insights into your music performance and audience behavior.\n\nNew Features:\n• Real-time streaming dashboards\n• Demographic and geographic breakdowns\n• Revenue forecasting models\n• Engagement metrics and trends\n• Custom report generation\n• Comparative performance analysis\n\nUpgrade your strategy with data-driven decision making.',
    icon: 'update',
    publishedAt: new Date('2025-01-01'),
  },
];

export const NewsCarousel = () => {
  const navigate = useNavigate();

  const handleViewNews = (news: NewsItem) => {
    navigate(`/news/${news.id}`, { state: { news } });
  };

  return (
    <>
      <div className="space-y-4">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {mockNews.map((news) => {
              const newsImage = imageMap[news.icon as keyof typeof imageMap];

              return (
                <CarouselItem key={news.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]">
                  <Card className="bg-gray-900/80 border-gray-800/50 p-3 rounded-[20px] hover:scale-[1.02] transition-smooth shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                          <img
                            src={newsImage}
                            alt={news.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm truncate">
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {news.subtitle}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full px-4 flex-shrink-0 border-gray-700 hover:bg-gray-800"
                        onClick={() => handleViewNews(news)}
                      >
                        View
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
    </>
  );
};
