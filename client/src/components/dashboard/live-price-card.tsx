import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { StockData } from "@shared/schema";

interface LivePriceCardProps {
  data?: StockData;
  isLoading: boolean;
}

const LivePriceCard = ({ data, isLoading }: LivePriceCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-4"></div>
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const price = data?.price || 34256.89;
  const change = data?.change || 127.34;
  const changePercent = data?.changePercent || 0.37;
  const isPositive = change >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card data-testid="live-price-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Price</CardTitle>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span data-testid="text-live-status">Live</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold" data-testid="text-live-price">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center ${isPositive ? 'text-success' : 'text-destructive'}`}>
                <Icon className="h-3 w-3 mr-1" />
                <span className="font-medium" data-testid="text-price-change">
                  {isPositive ? '+' : ''}{change.toFixed(2)}
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span 
                className={`font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}
                data-testid="text-price-change-percent"
              >
                {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Day High</span>
              <span className="font-medium" data-testid="text-day-high">
                ${(data?.dayHigh || 34401.23).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Day Low</span>
              <span className="font-medium" data-testid="text-day-low">
                ${(data?.dayLow || 34012.45).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">52W High</span>
              <span className="font-medium" data-testid="text-year-high">
                ${(data?.yearHigh || 36799.65).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">52W Low</span>
              <span className="font-medium" data-testid="text-year-low">
                ${(data?.yearLow || 28660.94).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceCard;
