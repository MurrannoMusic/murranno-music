import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/news';
import { format } from 'date-fns';

export default function NewsDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const news = location.state?.news as NewsItem | null;

  if (!news) {
    navigate(-1);
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <article className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{news.title}</h1>
            <p className="text-muted-foreground">
              {format(news.publishedAt, 'PPP')}
            </p>
          </div>

          {news.image && (
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xl font-semibold">{news.subtitle}</p>
            <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {news.description}
            </div>
            
            {news.link && (
              <a
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline font-medium"
              >
                Learn More →
              </a>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
