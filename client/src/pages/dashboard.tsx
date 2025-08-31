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
import VolumeChart from "@/components/dashboard/volume-chart";
import SectorChart from "@/components/dashboard/sector-chart";
import { RefreshCw, ZoomIn, ZoomOut, RotateCcw, BarChart3 } from "lucide-react";
import { useState } from "react";
import type { StockData, MarketNews } from "@shared/schema";

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [chartZoom, setChartZoom] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { 
    data: djiaData, 
    isLoading: djiaLoading, 
    error: djiaError,
    refetch: refetchDjia 
  } = useQuery<StockData>({
    queryKey: ["/api/external/djia"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: components,
    isLoading: componentsLoading,
  } = useQuery<Array<{ symbol: string; name: string }>>({
    queryKey: ["/api/djia/components"],
  });

  const {
    data: marketNews,
    isLoading: newsLoading,
  } = useQuery<MarketNews[]>({
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
    if (djiaError) {
      toast({
        title: "Data Error",
        description: "Failed to fetch DJIA data. Showing last known values.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Data Refreshed",
        description: "Latest market data has been fetched.",
      });
    }
  };

  const handleZoomIn = () => {
    setChartZoom(prev => Math.min(prev + 0.2, 2));
    toast({
      title: "Chart Zoomed In",
      description: `Zoom level: ${Math.round((chartZoom + 0.2) * 100)}%`,
    });
  };

  const handleZoomOut = () => {
    setChartZoom(prev => Math.max(prev - 0.2, 0.5));
    toast({
      title: "Chart Zoomed Out", 
      description: `Zoom level: ${Math.round((chartZoom - 0.2) * 100)}%`,
    });
  };

  const handleResetChart = () => {
    setChartZoom(1);
    setSelectedTimeframe("1D");
    toast({
      title: "Chart Reset",
      description: "Chart view has been reset to default settings.",
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
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">DJIA Dashboard</h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Dow Jones Industrial Average - Live Trading Data</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-success font-medium">Real-time</span>
              </div>
              <span>•</span>
              <span className="font-mono">
                Last updated: {djiaData?.lastUpdated ? 
                  new Date(djiaData.lastUpdated).toLocaleTimeString() : 
                  new Date().toLocaleTimeString()
                }
              </span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              data-testid="button-refresh-data"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            
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
        <div className="grid lg:grid-cols-3 gap-8 mb-8 animate-slide-up">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">DJIA Price Chart</CardTitle>
                    <p className="text-sm text-muted-foreground">Real-time price movements</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleZoomIn}
                      data-testid="button-zoom-in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleZoomOut}
                      data-testid="button-zoom-out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleResetChart}
                      data-testid="button-reset-chart"
                    >
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
                  zoom={chartZoom}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-fade-in">
            <div className="animate-float">
              <LivePriceCard data={djiaData} isLoading={djiaLoading} />
            </div>
            <TopMovers components={components} isLoading={componentsLoading} />
            <NewsWidget news={marketNews} isLoading={newsLoading} />
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8 animate-bounce-in">
          {/* Volume Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Volume Analysis</CardTitle>
                <div className="text-sm text-muted-foreground">24H</div>
              </div>
            </CardHeader>
            <CardContent>
              <VolumeChart data={djiaData} isLoading={djiaLoading} />
            </CardContent>
          </Card>

          {/* Sector Breakdown */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">Sector Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <SectorChart isLoading={djiaLoading} />
                <div className="space-y-2">
                  {[
                    { name: "Technology", percentage: 28.4, color: "#3b82f6" },
                    { name: "Financials", percentage: 18.7, color: "#10b981" },
                    { name: "Healthcare", percentage: 15.2, color: "#8b5cf6" },
                    { name: "Consumer Goods", percentage: 12.1, color: "#f59e0b" },
                    { name: "Industrials", percentage: 10.3, color: "#ef4444" },
                    { name: "Other", percentage: 15.3, color: "#6b7280" },
                  ].map((sector, index) => (
                    <div 
                      key={sector.name} 
                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/30 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: sector.color }}
                        ></div>
                        <span className="text-sm font-medium">{sector.name}</span>
                      </div>
                      <span className="text-sm font-bold">{sector.percentage}%</span>
                    </div>
                  ))}
                </div>
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
