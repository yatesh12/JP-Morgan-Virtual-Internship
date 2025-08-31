import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TopMoversProps {
  components?: Array<{ symbol: string; name: string }>;
  isLoading: boolean;
}

const TopMovers = ({ components, isLoading }: TopMoversProps) => {
  // Mock data for top movers with realistic movements
  const topMovers = [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.84, changePercent: 2.34, isPositive: true },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, changePercent: 1.89, isPositive: true },
    { symbol: "BA", name: "Boeing Co.", price: 203.45, changePercent: -1.23, isPositive: false },
  ];

  if (isLoading) {
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
            const Icon = stock.isPositive ? TrendingUp : TrendingDown;
            return (
              <div 
                key={stock.symbol} 
                className="flex items-center justify-between"
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
                    stock.isPositive ? 'text-success' : 'text-destructive'
                  }`}>
                    <Icon className="h-3 w-3 mr-1" />
                    <span>{stock.isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
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
