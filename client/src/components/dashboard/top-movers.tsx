import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { StockData } from "@shared/schema";

interface TopMoversProps {
  components?: Array<{ symbol: string; name: string }>;
  isLoading: boolean;
}

const TopMovers = ({ components, isLoading }: TopMoversProps) => {
  // Fetch all stock data to find top movers
  const { data: allStocks, isLoading: stocksLoading } = useQuery<StockData[]>({
    queryKey: ["/api/stocks"],
    refetchInterval: 30000,
  });

  // Get top 3 movers by absolute change percentage
  const topMovers = allStocks 
    ? allStocks
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 3)
    : [];

  const isLoadingData = isLoading || stocksLoading;

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Movers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="top-movers-card">
      <CardHeader>
        <CardTitle className="text-lg">Top Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topMovers.map((stock) => {
            const isPositive = stock.changePercent >= 0;
            const Icon = isPositive ? TrendingUp : TrendingDown;
            return (
              <div 
                key={stock.symbol} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
                data-testid={`top-mover-${stock.symbol}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{stock.symbol}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stock.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${stock.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm ${
                    isPositive ? 'text-success' : 'text-destructive'
                  }`}>
                    <Icon className="h-3 w-3 mr-1" />
                    <span>{isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopMovers;
