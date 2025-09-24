import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/common/BackButton';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  AlertCircle, 
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, hasRole } = useAuth();

  if (!user || !hasRole('admin')) {
    return <Navigate to="/login" replace />;
  }

  const stats = {
    totalUsers: 1247,
    pendingNotes: 23,
    totalNotes: 892,
    totalRevenue: 15742,
    monthlyGrowth: 12.5,
    avgResponseTime: '2.3 hours'
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container py-8">
        <div className="mb-6">
          <BackButton fallbackUrl="/" variant="outline">
            Back to Home
          </BackButton>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform activity and manage operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 border-primary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-accent/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.pendingNotes}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting moderation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-secondary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <FileText className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.totalNotes}</div>
              <p className="text-xs text-muted-foreground">
                Published and active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-primary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                Platform lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-accent/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">+{stats.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                Monthly user growth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-secondary/20 shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">
                For moderation reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 border-primary/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/admin/moderation'}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Review Pending Notes ({stats.pendingNotes})
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-accent/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-card rounded-lg">
                  <span className="text-sm">New user registration</span>
                  <Badge variant="secondary">2 min ago</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-card rounded-lg">
                  <span className="text-sm">Note approved</span>
                  <Badge variant="secondary">5 min ago</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-card rounded-lg">
                  <span className="text-sm">Purchase completed</span>
                  <Badge variant="secondary">8 min ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};