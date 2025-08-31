import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  ChartLine, 
  Zap, 
  BarChart3, 
  Smartphone, 
  Play, 
  Activity 
} from "lucide-react";

const Home = () => {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Zap,
      title: "Real-time Data",
      description: "Live stock prices with millisecond precision from trusted financial data providers.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Interactive charts with technical indicators and historical trend analysis.",
      color: "bg-chart-2/10 text-chart-2",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Fully responsive design optimized for trading on any device, anywhere.",
      color: "bg-chart-3/10 text-chart-3",
    },
  ];

  const handleLaunchDashboard = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 lg:px-6 py-16 lg:py-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Real-time Market Intelligence
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Professional-grade stock visualization dashboard for the Dow Jones Industrial Average
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleLaunchDashboard}
                className="h-11 px-8"
                data-testid="button-launch-dashboard"
              >
                <ChartLine className="mr-2 h-4 w-4" />
                Launch Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-11 px-8"
                data-testid="button-watch-demo"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Market Status Indicator */}
            <div className="inline-flex items-center space-x-2 bg-card border border-border rounded-lg px-4 py-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
              <span className="text-muted-foreground">Market Status:</span>
              <span className="font-medium text-success" data-testid="text-market-status">Open</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono" data-testid="text-market-update">Real-time data</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="hover:shadow-lg transition-shadow animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
