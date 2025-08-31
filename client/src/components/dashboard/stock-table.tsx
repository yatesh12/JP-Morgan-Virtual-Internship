import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { StockData } from "@shared/schema";

interface StockTableProps {
  components?: Array<{ symbol: string; name: string }>;
  isLoading: boolean;
}

const StockTable = ({ components, isLoading }: StockTableProps) => {
  // Fetch all stock data from the API
  const { data: allStocks, isLoading: stocksLoading } = useQuery<StockData[]>({
    queryKey: ["/api/stocks"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatVolume = (volume: number): string => {
    if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(1)}M`;
    } else if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const isLoadingData = isLoading || stocksLoading;

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">DJIA Components</CardTitle>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Company</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Change</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Volume</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3 px-4 hidden sm:table-cell"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-3 px-4 hidden md:table-cell"><Skeleton className="h-4 w-12" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="stock-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">DJIA Components</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" data-testid="button-export-data">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" data-testid="button-refresh-table">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Company</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Change</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Volume</th>
              </tr>
            </thead>
            <tbody>
              {allStocks?.slice(0, 10).map((stock) => {
                const Icon = stock.change >= 0 ? TrendingUp : TrendingDown;
                const isPositive = stock.change >= 0;
                return (
                  <tr 
                    key={stock.symbol} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    data-testid={`stock-row-${stock.symbol}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-xs font-bold text-primary">{stock.symbol}</span>
                        </div>
                        <span className="font-medium group-hover:text-primary transition-colors">{stock.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">{stock.name}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className={`flex items-center justify-end ${
                        isPositive ? 'text-success' : 'text-destructive'
                      }`}>
                        <Icon className="h-3 w-3 mr-1" />
                        <span className="font-medium">
                          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono hidden md:table-cell text-muted-foreground">
                      {formatVolume(stock.volume)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockTable;
