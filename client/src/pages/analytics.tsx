import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Activity, PieChart } from "lucide-react";

const Analytics = () => {
  return (
    <div className="bg-background animate-fade-in">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground">Deep market analysis and technical indicators</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Technical Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Technical Indicators</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Technical indicators chart will be displayed here</p>
                  <p className="text-sm">RSI, MACD, Moving Averages, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Market Correlations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Market Correlations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4" />
                  <p>Correlation analysis visualization</p>
                  <p className="text-sm">Cross-asset correlation matrix</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volatility Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Volatility Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Historical volatility trends</p>
                  <p className="text-sm">VIX correlation and volatility forecasting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sharpe Ratio</span>
                  <span className="font-mono">1.24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Beta</span>
                  <span className="font-mono">1.02</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Alpha</span>
                  <span className="font-mono">0.08</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Max Drawdown</span>
                  <span className="font-mono text-destructive">-12.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Avg. Daily Return</span>
                  <span className="font-mono text-success">0.05%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
