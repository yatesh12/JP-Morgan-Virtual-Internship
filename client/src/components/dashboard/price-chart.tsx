import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockData } from "@shared/schema";

interface PriceChartProps {
  data?: StockData;
  isLoading: boolean;
  timeframe: string;
  zoom?: number;
}

const PriceChart = ({ data, isLoading, timeframe, zoom = 1 }: PriceChartProps) => {
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
      const labels: string[] = [];
      const prices: number[] = [];
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
        const previousPrice: number = i === points - 1 ? basePrice : prices[prices.length - 1];
        prices.push(Math.max(0, previousPrice + change));
      }

      return { labels, prices };
    };

    const basePrice = data?.price || 34256.89;
    const dataPoints = timeframe === '1D' ? 13 : timeframe === '1W' ? 7 : 30;
    const { labels, prices } = generateMockData(basePrice, dataPoints);

    // Create gradient for impressive visual effect
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)'); // Blue with opacity
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'DJIA Price',
          data: prices,
          borderColor: '#3b82f6',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointBackgroundColor: 'hsl(var(--primary))',
          pointBorderColor: 'hsl(var(--background))',
          pointBorderWidth: 3,
          pointHoverBackgroundColor: 'hsl(var(--primary))',
          pointHoverBorderColor: 'hsl(var(--background))',
          pointHoverBorderWidth: 4,
          segment: {
            borderColor: (ctx) => {
              const current = ctx.p1.parsed.y;
              const previous = ctx.p0.parsed.y;
              return current >= previous ? '#10b981' : '#ef4444'; // Green or red
            }
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
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
            borderColor: 'hsl(var(--primary))',
            borderWidth: 2,
            padding: 16,
            cornerRadius: 12,
            displayColors: false,
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
              weight: 'normal',
            },
            callbacks: {
              title: (context) => {
                return `${context[0].label}`;
              },
              label: (context) => {
                const price = Number(context.parsed.y);
                const prevPrice = context.dataIndex > 0 ? 
                  Number(context.dataset.data[context.dataIndex - 1]) : price;
                const change = price - prevPrice;
                const changePercent = ((change / prevPrice) * 100).toFixed(2);
                
                return [
                  `Price: $${price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  `Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${change >= 0 ? '+' : ''}${changePercent}%)`
                ];
              },
            },
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'hsl(var(--border))',
              lineWidth: 0.5,
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              maxTicksLimit: 8,
              font: {
                size: 11,
                weight: 'normal',
              },
              padding: 8,
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
              lineWidth: 0.5,
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              font: {
                size: 11,
                weight: 'normal',
              },
              padding: 12,
              callback: function(value) {
                return '$' + Number(value).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                });
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
  }, [data, isLoading, timeframe, zoom]);

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
