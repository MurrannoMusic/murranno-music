import { ArrowLeft, BarChart3, Globe, Users, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/mobile/StatCard';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

export const Analytics = () => {
  return (
    <div className="min-h-screen bg-background mobile-safe-bottom">
      <div className="mobile-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center">
            <Link to="/" className="mr-3 sm:mr-4">
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
            </Link>
            <h1 className="mobile-heading">Analytics</h1>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Export</span>
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="mobile-card-grid mb-4 sm:mb-6">
          <StatCard
            icon={BarChart3}
            title="Total Streams"
            value="12.5K"
            change="+23%"
            changeType="positive"
          />
          <StatCard
            icon={Users}
            title="Unique Listeners"
            value="3.2K"
            change="+18%"
            changeType="positive"
          />
          <StatCard
            icon={Globe}
            title="Countries"
            value="45"
            change="+5"
            changeType="positive"
          />
          <StatCard
            icon={Calendar}
            title="Avg. Daily"
            value="180"
            change="+12%"
            changeType="positive"
          />
        </div>

        {/* Performance Chart */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Streams Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 sm:h-40 bg-gradient-primary/10 rounded-lg flex items-end justify-around p-3 sm:p-4">
              {/* Simplified bar chart representation */}
              <div className="w-4 sm:w-6 bg-primary rounded-t" style={{height: '60%'}}></div>
              <div className="w-4 sm:w-6 bg-primary rounded-t" style={{height: '80%'}}></div>
              <div className="w-4 sm:w-6 bg-primary rounded-t" style={{height: '45%'}}></div>
              <div className="w-4 sm:w-6 bg-primary rounded-t" style={{height: '90%'}}></div>
              <div className="w-4 sm:w-6 bg-primary rounded-t" style={{height: '75%'}}></div>
              <div className="w-4 sm:w-6 bg-primary rounded-t" style={{height: '100%'}}></div>
              <div className="w-4 sm:w-6 bg-primary rounded-t" style={{height: '85%'}}></div>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analytics */}
        <Tabs defaultValue="audience" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8 sm:h-10">
            <TabsTrigger value="audience" className="text-xs sm:text-sm">Audience</TabsTrigger>
            <TabsTrigger value="geography" className="text-xs sm:text-sm">Geography</TabsTrigger>
            <TabsTrigger value="tracks" className="text-xs sm:text-sm">Tracks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Fan Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>Age 18-24</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: '42%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>Age 25-34</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>Age 35+</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{width: '23%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="geography" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Top Countries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="text-xl sm:text-2xl">🇳🇬</div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Nigeria</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">4.2K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm sm:text-base">34%</p>
                </div>
                
                <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="text-xl sm:text-2xl">🇺🇸</div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">United States</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">2.8K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm sm:text-base">22%</p>
                </div>
                
                <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="text-xl sm:text-2xl">🇬🇧</div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">United Kingdom</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">1.5K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm sm:text-base">12%</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tracks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Top Performing Tracks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Summer Vibes</p>
                      <p className="text-sm text-muted-foreground">5.2K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold">42%</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Midnight Flow</p>
                      <p className="text-sm text-muted-foreground">3.8K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold">30%</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-foreground font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">City Dreams</p>
                      <p className="text-sm text-muted-foreground">2.1K streams</p>
                    </div>
                  </div>
                  <p className="font-semibold">17%</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};