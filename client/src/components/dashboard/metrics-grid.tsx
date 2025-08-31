import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Percent, BarChart3, Building } from "lucide-react";
import type { StockData } from "@shared/schema";

interface MetricsGridProps {
  data?: StockData;
}

const MetricsGrid = ({ data }: MetricsGridProps) => {
  const metrics = [
    {
      title: "DJIA Index",
      value: data?.price ? `$${data.price.toLocaleString()}` : "$34,256.89",
      change: data?.change ? `${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}` : "+127.34",
      isPositive: data?.change ? data.change > 0 : true,
      icon: data?.change && data.change > 0 ? TrendingUp : TrendingDown,
      testId: "metric-djia-index",
    },
    {
      title: "Daily Change %",
      value: data?.changePercent ? `${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%` : "+0.37%",
      change: null,
      isPositive: data?.changePercent ? data.changePercent > 0 : true,
      icon: Percent,
      testId: "metric-daily-change",
    },
    {
      title: "Volume",
      value: data?.volume ? formatVolume(data.volume) : "2.4M",
      change: null,
      isPositive: true,
      icon: BarChart3,
      testId: "metric-volume",
    },
    {
      title: "Market Cap",
      value: data?.marketCap || "$8.2T",
      change: null,
      isPositive: true,
      icon: Building,
      testId: "metric-market-cap",
    },
  ];

  function formatVolume(volume: number): string {
    if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(1)}M`;
    } else if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(1)}K`;
    }
    return volume.toString();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} data-testid={metric.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.change && (
                      <div className={`flex items-center text-sm font-medium ${
                        metric.isPositive ? 'text-success' : 'text-destructive'
                      }`}>
                        <Icon className="h-3 w-3 mr-1" />
                        <span>{metric.change}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  metric.isPositive ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    metric.isPositive ? 'text-success' : 'text-destructive'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
