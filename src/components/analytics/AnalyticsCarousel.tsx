import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Music, TrendingUp, Store, Trophy } from 'lucide-react';

interface AnalyticsCard {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  gradient: string;
}

const analyticsData: AnalyticsCard[] = [
  {
    title: 'Streams This Week',
    value: '2,847',
    subtext: 'Across all stores • Oct 1 – Oct 7, 2025',
    icon: <TrendingUp className="h-5 w-5" />,
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    title: 'Best Playlist',
    value: 'Mix',
    subtext: 'Spotify – 74 Streams',
    icon: <Music className="h-5 w-5" />,
    gradient: 'from-success/20 to-success/5',
  },
  {
    title: 'Best Store',
    value: 'Apple Music',
    subtext: '2,415 Streams',
    icon: <Store className="h-5 w-5" />,
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    title: 'Most Streamed Track (All Time)',
    value: 'Summer Nights',
    subtext: 'All Stores – 15,000 Streams',
    icon: <Trophy className="h-5 w-5" />,
    gradient: 'from-primary/20 to-primary/5',
  },
];

export const AnalyticsCarousel = () => {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {analyticsData.map((card, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
              <Card className="h-full border-border/20 overflow-hidden">
                <CardContent className={`p-5 h-full bg-gradient-to-br ${card.gradient}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-background/80 backdrop-blur-sm rounded-xl">
                      {card.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </h3>
                    <div className="text-2xl font-bold text-foreground">
                      {card.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.subtext}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};
