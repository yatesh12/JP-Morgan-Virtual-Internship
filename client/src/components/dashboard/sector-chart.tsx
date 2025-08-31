import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { Skeleton } from "@/components/ui/skeleton";

interface SectorChartProps {
  isLoading: boolean;
}

const SectorChart = ({ isLoading }: SectorChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || isLoading) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const sectorData = [
      { name: "Technology", percentage: 28.4, color: "#3b82f6" },
      { name: "Financials", percentage: 18.7, color: "#10b981" },
      { name: "Healthcare", percentage: 15.2, color: "#8b5cf6" },
      { name: "Consumer Goods", percentage: 12.1, color: "#f59e0b" },
      { name: "Industrials", percentage: 10.3, color: "#ef4444" },
      { name: "Other", percentage: 15.3, color: "#6b7280" },
    ];

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: sectorData.map(sector => sector.name),
        datasets: [{
          data: sectorData.map(sector => sector.percentage),
          backgroundColor: sectorData.map(sector => sector.color),
          borderColor: sectorData.map(sector => sector.color),
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: 'easeInOutQuart',
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#3b82f6',
            borderWidth: 2,
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label;
                const value = Number(context.parsed);
                return `${label}: ${value.toFixed(1)}%`;
              },
            },
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
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
  }, [isLoading]);

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
        data-testid="sector-chart-canvas"
      />
    </div>
  );
};

export default SectorChart;