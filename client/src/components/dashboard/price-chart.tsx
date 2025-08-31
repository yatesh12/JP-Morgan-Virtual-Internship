import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockData } from "@shared/schema";

interface PriceChartProps {
  data?: StockData;
  isLoading: boolean;
  timeframe: string;
}

const PriceChart = ({ data, isLoading, timeframe }: PriceChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || isLoading) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Generate mock data based on current price
    const generateMockData = (basePrice: number, points: number) => {
      const labels = [];
      const prices = [];
      const now = new Date();

      for (let i = points - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * (timeframe === '1D' ? 30 * 60 * 1000 : 60 * 60 * 1000));
        labels.push(time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }));
        
        // Generate realistic price movements
        const variance = basePrice * 0.002; // 0.2% variance
        const change = (Math.random() - 0.5) * variance * 2;
        const previousPrice = i === points - 1 ? basePrice : prices[prices.length - 1];
        prices.push(Math.max(0, previousPrice + change));
      }

      return { labels, prices };
    };

    const basePrice = data?.price || 34256.89;
    const dataPoints = timeframe === '1D' ? 13 : timeframe === '1W' ? 7 : 30;
    const { labels, prices } = generateMockData(basePrice, dataPoints);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'DJIA Price',
          data: prices,
          borderColor: 'hsl(var(--primary))',
          backgroundColor: 'hsla(var(--primary), 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: 'hsl(var(--primary))',
          pointBorderColor: 'hsl(var(--background))',
          pointBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'hsl(var(--popover))',
            titleColor: 'hsl(var(--popover-foreground))',
            bodyColor: 'hsl(var(--popover-foreground))',
            borderColor: 'hsl(var(--border))',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => {
                return `Time: ${context[0].label}`;
              },
              label: (context) => {
                return `Price: $${Number(context.parsed.y).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              },
            },
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'hsl(var(--border))',
              drawBorder: false,
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              maxTicksLimit: 8,
            },
            border: {
              display: false,
            },
          },
          y: {
            display: true,
            position: 'right',
            grid: {
              color: 'hsl(var(--border))',
              drawBorder: false,
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              callback: function(value) {
                return '$' + Number(value).toLocaleString();
              }
            },
            border: {
              display: false,
            },
          }
        },
        elements: {
          point: {
            hoverBackgroundColor: 'hsl(var(--primary))',
          }
        },
      }
    };

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, isLoading, timeframe]);

  if (isLoading) {
    return (
      <div className="h-[300px] w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        data-testid="price-chart-canvas"
      />
    </div>
  );
};

export default PriceChart;
