import { ArrowLeft, BarChart3, Globe, Users, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernStatCard } from '@/components/modern/ModernStatCard';
import { PageContainer } from '@/components/layout/PageContainer';

export const Analytics = () => {
  return (
    <PageContainer>
      {/* Consistent Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              ANALYTICS
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end mt-4">
          <Button variant="glass" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <ModernStatCard
            icon={<BarChart3 className="h-5 w-5 text-primary" />}
            title="Total Streams"
            value="12.5K"
            change="+23%"
            changeType="positive"
          />
          <ModernStatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            title="Unique Listeners"
            value="3.2K"
            change="+18%"
            changeType="positive"
          />
          <ModernStatCard
            icon={<Globe className="h-5 w-5 text-primary" />}
            title="Countries"
            value="45"
            change="+5"
            changeType="positive"
          />
          <ModernStatCard
            icon={<Calendar className="h-5 w-5 text-primary" />}
            title="Avg. Daily"
            value="180"
            change="+12%"
            changeType="positive"
          />
        </div>

        {/* Performance Chart */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="heading-md">Streams Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gradient-primary/10 rounded-2xl flex items-end justify-around p-4">
              <div className="w-6 bg-primary rounded-t-lg" style={{height: '60%'}}></div>
              <div className="w-6 bg-primary rounded-t-lg" style={{height: '80%'}}></div>
              <div className="w-6 bg-primary rounded-t-lg" style={{height: '45%'}}></div>
              <div className="w-6 bg-primary rounded-t-lg" style={{height: '90%'}}></div>
              <div className="w-6 bg-primary rounded-t-lg" style={{height: '75%'}}></div>
              <div className="w-6 bg-primary rounded-t-lg" style={{height: '100%'}}></div>
              <div className="w-6 bg-primary rounded-t-lg" style={{height: '85%'}}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-3">
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
        <Card className="modern-card">
          <CardContent className="p-0">
            <Tabs defaultValue="audience" className="w-full">
              <div className="p-6 border-b border-border/20">
                <TabsList className="grid w-full grid-cols-3 bg-secondary/30 rounded-2xl">
                  <TabsTrigger value="audience" className="rounded-xl">Audience</TabsTrigger>
                  <TabsTrigger value="geography" className="rounded-xl">Geography</TabsTrigger>
                  <TabsTrigger value="tracks" className="rounded-xl">Tracks</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="audience" className="p-6 space-y-4">
                <h3 className="heading-md">Fan Demographics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between body-md mb-2">
                      <span>Age 18-24</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{width: '42%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between body-md mb-2">
                      <span>Age 25-34</span>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-3">
                      <div className="bg-accent h-3 rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between body-md mb-2">
                      <span>Age 35+</span>
                      <span className="font-semibold">23%</span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-3">
                      <div className="bg-secondary h-3 rounded-full" style={{width: '23%'}}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="geography" className="p-6 space-y-4">
                <h3 className="heading-md">Top Countries</h3>
                <div className="space-y-3">
                  <div className="list-item">
                    <div className="text-2xl">🇳🇬</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">Nigeria</p>
                        <span className="body-md font-bold">34%</span>
                      </div>
                      <p className="body-sm text-muted-foreground">4.2K streams</p>
                    </div>
                  </div>
                  
                  <div className="list-item">
                    <div className="text-2xl">🇺🇸</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">United States</p>
                        <span className="body-md font-bold">22%</span>
                      </div>
                      <p className="body-sm text-muted-foreground">2.8K streams</p>
                    </div>
                  </div>
                  
                  <div className="list-item">
                    <div className="text-2xl">🇬🇧</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">United Kingdom</p>
                        <span className="body-md font-bold">12%</span>
                      </div>
                      <p className="body-sm text-muted-foreground">1.5K streams</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tracks" className="p-6 space-y-4">
                <h3 className="heading-md">Top Performing Tracks</h3>
                <div className="space-y-3">
                  <div className="list-item">
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">Summer Vibes</p>
                        <span className="body-md font-bold">42%</span>
                      </div>
                      <p className="body-sm text-muted-foreground">5.2K streams</p>
                    </div>
                  </div>
                  
                  <div className="list-item">
                    <div className="w-12 h-12 bg-gradient-accent rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">Midnight Flow</p>
                        <span className="body-md font-bold">30%</span>
                      </div>
                      <p className="body-sm text-muted-foreground">3.8K streams</p>
                    </div>
                  </div>
                  
                  <div className="list-item">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                      <span className="text-foreground font-bold">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="body-lg font-semibold">City Dreams</p>
                        <span className="body-md font-bold">17%</span>
                      </div>
                      <p className="body-sm text-muted-foreground">2.1K streams</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};