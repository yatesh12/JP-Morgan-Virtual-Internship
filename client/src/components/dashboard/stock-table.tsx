import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StockTableProps {
  components?: Array<{ symbol: string; name: string }>;
  isLoading: boolean;
}

const StockTable = ({ components, isLoading }: StockTableProps) => {
  // Mock data for demonstration - in a real app this would come from an API
  const mockStockData = [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.84, changePercent: 2.34, volume: "2.4M", isPositive: true },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, changePercent: 1.89, volume: "1.8M", isPositive: true },
    { symbol: "BA", name: "Boeing Co.", price: 203.45, changePercent: -1.23, volume: "3.2M", isPositive: false },
    { symbol: "UNH", name: "UnitedHealth Group Inc.", price: 523.67, changePercent: 0.87, volume: "1.1M", isPositive: true },
    { symbol: "GS", name: "Goldman Sachs Group Inc.", price: 445.23, changePercent: -0.45, volume: "2.7M", isPositive: false },
  ];

  if (isLoading) {
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
              {mockStockData.map((stock) => {
                const Icon = stock.isPositive ? TrendingUp : TrendingDown;
                return (
                  <tr 
                    key={stock.symbol} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                    data-testid={`stock-row-${stock.symbol}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{stock.symbol}</span>
                        </div>
                        <span className="font-medium">{stock.symbol}</span>
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
                        stock.isPositive ? 'text-success' : 'text-destructive'
                      }`}>
                        <Icon className="h-3 w-3 mr-1" />
                        <span className="font-medium">
                          {stock.isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono hidden md:table-cell text-muted-foreground">
                      {stock.volume}
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
