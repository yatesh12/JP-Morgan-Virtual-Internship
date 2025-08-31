import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketNews } from "@shared/schema";

interface NewsWidgetProps {
  news?: MarketNews[];
  isLoading: boolean;
}

const NewsWidget = ({ news, isLoading }: NewsWidgetProps) => {
  // Fallback news items
  const fallbackNews = [
    {
      id: "1",
      headline: "Fed Signals Potential Rate Cuts in Q4",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2", 
      headline: "Tech Stocks Rally on AI Optimism",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: "3",
      headline: "Energy Sector Gains on Oil Price Surge", 
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  ];

  const displayNews = news && news.length > 0 ? news : fallbackNews;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-border pb-3 last:border-b-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="news-widget">
      <CardHeader>
        <CardTitle className="text-lg">Market News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayNews.slice(0, 3).map((item, index) => (
            <div 
              key={item.id || index} 
              className="border-b border-border pb-3 last:border-b-0"
              data-testid={`news-item-${index}`}
            >
              <h4 className="text-sm font-medium leading-tight mb-1">
                {item.headline}
              </h4>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(item.publishedAt)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsWidget;
