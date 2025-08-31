import { useQuery } from "@tanstack/react-query";
import { stockApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import PriceChart from "@/components/dashboard/price-chart";
import LivePriceCard from "@/components/dashboard/live-price-card";
import TopMovers from "@/components/dashboard/top-movers";
import NewsWidget from "@/components/dashboard/news-widget";
import StockTable from "@/components/dashboard/stock-table";
import { RefreshCw, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");

  const { 
    data: djiaData, 
    isLoading: djiaLoading, 
    error: djiaError,
    refetch: refetchDjia 
  } = useQuery({
    queryKey: ["/api/external/djia"],
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: () => {
      toast({
        title: "Data Error",
        description: "Failed to fetch DJIA data. Showing last known values.",
        variant: "destructive",
      });
    },
  });

  const {
    data: components,
    isLoading: componentsLoading,
  } = useQuery({
    queryKey: ["/api/djia/components"],
  });

  const {
    data: marketNews,
    isLoading: newsLoading,
  } = useQuery({
    queryKey: ["/api/news"],
  });

  const timeframes = [
    { value: "1D", label: "1D" },
    { value: "1W", label: "1W" },
    { value: "1M", label: "1M" },
    { value: "1Y", label: "1Y" },
  ];

  const handleRefresh = () => {
    refetchDjia();
    toast({
      title: "Data Refreshed",
      description: "Latest market data has been fetched.",
    });
  };

  if (djiaError) {
    return (
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Unable to Load Market Data</h2>
            <p className="text-muted-foreground mb-4">
              There was an error connecting to the market data service. Please check your connection and try again.
            </p>
            <Button onClick={handleRefresh} data-testid="button-retry">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">DJIA Dashboard</h2>
            <p className="text-muted-foreground">Dow Jones Industrial Average - Live Trading Data</p>
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Timeframe:</span>
            <div className="flex bg-muted rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe.value}
                  variant={selectedTimeframe === timeframe.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe.value)}
                  className="px-3 py-1 h-8"
                  data-testid={`button-timeframe-${timeframe.value}`}
                >
                  {timeframe.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        {djiaLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <MetricsGrid data={djiaData} />
        )}

        {/* Main Chart Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">DJIA Price Chart</CardTitle>
                    <p className="text-sm text-muted-foreground">Real-time price movements</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" data-testid="button-zoom-in">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" data-testid="button-zoom-out">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" data-testid="button-reset-chart">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PriceChart 
                  data={djiaData} 
                  isLoading={djiaLoading} 
                  timeframe={selectedTimeframe}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LivePriceCard data={djiaData} isLoading={djiaLoading} />
            <TopMovers components={components} isLoading={componentsLoading} />
            <NewsWidget news={marketNews} isLoading={newsLoading} />
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Chart Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Volume Analysis</CardTitle>
                <div className="text-sm text-muted-foreground">24H</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mr-2" />
                Volume chart visualization
              </div>
            </CardContent>
          </Card>

          {/* Sector Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sector Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Technology", percentage: 28.4, color: "bg-chart-1" },
                  { name: "Financials", percentage: 18.7, color: "bg-chart-2" },
                  { name: "Healthcare", percentage: 15.2, color: "bg-chart-3" },
                  { name: "Consumer Goods", percentage: 12.1, color: "bg-chart-4" },
                  { name: "Other", percentage: 25.6, color: "bg-chart-5" },
                ].map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${sector.color} rounded-full`}></div>
                      <span className="text-sm">{sector.name}</span>
                    </div>
                    <span className="text-sm font-medium">{sector.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Table */}
        <StockTable components={components} isLoading={componentsLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
