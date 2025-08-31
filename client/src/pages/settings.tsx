import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, Monitor } from "lucide-react";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="bg-muted/30 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Customize your dashboard experience</p>
        </div>
        
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Theme Preference</Label>
                <div className="flex space-x-2">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        variant={theme === option.value ? "default" : "outline"}
                        onClick={() => setTheme(option.value as any)}
                        className="flex items-center space-x-2"
                        data-testid={`button-theme-${option.value}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Refresh Interval */}
              <div className="space-y-3">
                <Label htmlFor="refresh-interval">Refresh Interval</Label>
                <Select defaultValue="real-time">
                  <SelectTrigger data-testid="select-refresh-interval">
                    <SelectValue placeholder="Select refresh interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="5s">5 seconds</SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="1m">1 minute</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notifications */}
              <div className="space-y-3">
                <Label>Notifications</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price-alerts" className="text-sm font-normal">
                      Price alerts
                    </Label>
                    <Switch id="price-alerts" defaultChecked data-testid="switch-price-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="market-news" className="text-sm font-normal">
                      Market news
                    </Label>
                    <Switch id="market-news" data-testid="switch-market-news" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="portfolio-updates" className="text-sm font-normal">
                      Portfolio updates
                    </Label>
                    <Switch id="portfolio-updates" data-testid="switch-portfolio-updates" />
                  </div>
                </div>
              </div>

              {/* Chart Settings */}
              <div className="space-y-3">
                <Label>Chart Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animated-charts" className="text-sm font-normal">
                      Animated transitions
                    </Label>
                    <Switch id="animated-charts" defaultChecked data-testid="switch-animated-charts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-lines" className="text-sm font-normal">
                      Show grid lines
                    </Label>
                    <Switch id="grid-lines" defaultChecked data-testid="switch-grid-lines" />
                  </div>
                </div>
              </div>

              {/* Data Settings */}
              <div className="space-y-3">
                <Label htmlFor="data-source">Data Source</Label>
                <Select defaultValue="alpha-vantage">
                  <SelectTrigger data-testid="select-data-source">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alpha-vantage">Alpha Vantage</SelectItem>
                    <SelectItem value="demo">Demo Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button className="w-full" data-testid="button-save-settings">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
