import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockData } from "@shared/schema";

interface VolumeChartProps {
  data?: StockData;
  isLoading: boolean;
}

const VolumeChart = ({ data, isLoading }: VolumeChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || isLoading) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Generate volume data
    const generateVolumeData = () => {
      const labels: string[] = [];
      const volumes: number[] = [];
      const colors: string[] = [];
      const now = new Date();

      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 2 * 60 * 60 * 1000); // Every 2 hours
        labels.push(time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }));
        
        const baseVolume = data?.volume || 2400000;
        const volume = baseVolume + (Math.random() - 0.5) * 1000000;
        volumes.push(Math.max(100000, volume));
        
        // Color based on volume relative to average with gradient effect
        const avgVolume = baseVolume;
        if (volume > avgVolume * 1.2) {
          colors.push('#10b981'); // High volume - green
        } else if (volume > avgVolume) {
          colors.push('#3b82f6'); // Normal high - blue
        } else {
          colors.push('#6b7280'); // Low volume - gray
        }
      }

      return { labels, volumes, colors };
    };

    const { labels, volumes, colors } = generateVolumeData();

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Volume',
          data: volumes,
          backgroundColor: colors,
          borderColor: colors.map(color => color + '80'), // Add transparency
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
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
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#3b82f6',
            borderWidth: 2,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => {
                return `Time: ${context[0].label}`;
              },
              label: (context) => {
                const volume = Number(context.parsed.y);
                return `Volume: ${(volume / 1000000).toFixed(2)}M`;
              },
            },
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(148, 163, 184, 0.1)',
              lineWidth: 0.5,
            },
            ticks: {
              color: 'rgba(148, 163, 184, 0.8)',
              font: {
                size: 10,
                weight: 'normal',
              },
              maxTicksLimit: 6,
            },
            border: {
              display: false,
            },
          },
          y: {
            display: true,
            position: 'right',
            grid: {
              color: 'rgba(148, 163, 184, 0.1)',
              lineWidth: 0.5,
            },
            ticks: {
              color: 'rgba(148, 163, 184, 0.8)',
              font: {
                size: 10,
                weight: 'normal',
              },
              callback: function(value) {
                return (Number(value) / 1000000).toFixed(1) + 'M';
              }
            },
            border: {
              display: false,
            },
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
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="h-48 w-full relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        data-testid="volume-chart-canvas"
      />
    </div>
  );
};

export default VolumeChart;