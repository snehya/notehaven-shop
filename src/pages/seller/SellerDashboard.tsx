/**
 * @fileoverview Seller Dashboard - Overview of seller performance and stats
 * @author NoteMarket Team
 * @created 2024
 */

import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/common/BackButton';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import {
  DollarSign,
  TrendingUp,
  BookOpen,
  Star,
  Eye,
  Download,
  Users,
  Award,
  Target,
  Calendar,
  BarChart3,
  Upload,
  FileText,
  MessageSquare
} from 'lucide-react';

interface DashboardStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalSales: number;
  totalNotes: number;
  avgRating: number;
  totalReviews: number;
  totalViews: number;
  conversionRate: number;
  activeNotes: number;
  pendingNotes: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'review' | 'upload' | 'approval';
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
  rating?: number;
}

export const SellerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - In real app, this would come from an API
  const stats: DashboardStats = useMemo(() => ({
    totalEarnings: 2485.50,
    monthlyEarnings: 580.25,
    totalSales: 156,
    totalNotes: 24,
    avgRating: 4.8,
    totalReviews: 89,
    totalViews: 3420,
    conversionRate: 15.2,
    activeNotes: 22,
    pendingNotes: 2
  }), []);

  const recentActivity: RecentActivity[] = useMemo(() => [
    {
      id: '1',
      type: 'sale',
      title: 'New Sale',
      description: 'Advanced Calculus Study Guide',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      amount: 15.99
    },
    {
      id: '2',
      type: 'review',
      title: 'New Review',
      description: 'Data Structures & Algorithms',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      rating: 5
    },
    {
      id: '3',
      type: 'approval',
      title: 'Note Approved',
      description: 'Linear Algebra Fundamentals',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      type: 'upload',
      title: 'Note Uploaded',
      description: 'Machine Learning Basics',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }
  ], []);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-blue-600" />;
      case 'approval':
        return <Award className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton />
        
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}! Here's your performance overview.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to={ROUTES.SELLER_UPLOAD}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Note
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={ROUTES.SELLER_PROFILE}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">${stats.totalEarnings}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      +12% from last month
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">${stats.monthlyEarnings}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.totalSales} total sales
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes Published</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalNotes}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.activeNotes} active, {stats.pendingNotes} pending
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
                      <Star className="w-5 h-5 text-yellow-600 fill-current" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.totalReviews} reviews
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Monthly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sales Goal</span>
                      <span>{stats.totalSales}/200</span>
                    </div>
                    <Progress value={(stats.totalSales / 200) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {200 - stats.totalSales} more sales to reach your goal
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Earnings Goal</span>
                      <span>${stats.monthlyEarnings}/$800</span>
                    </div>
                    <Progress value={(stats.monthlyEarnings / 800) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      ${800 - stats.monthlyEarnings} more to reach your goal
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Rating Goal</span>
                      <span>{stats.avgRating}/5.0</span>
                    </div>
                    <Progress value={(stats.avgRating / 5) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maintain high quality to keep excellent rating
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">{stats.totalViews}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                    </div>

                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Download className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-semibold">{stats.totalSales}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                    </div>

                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-lg font-semibold">{stats.conversionRate}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Conversion</p>
                    </div>

                    <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                        <span className="text-lg font-semibold">{stats.totalReviews}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-muted">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{activity.title}</p>
                            {activity.type === 'sale' && activity.amount && (
                              <Badge variant="secondary" className="text-xs">
                                +${activity.amount}
                              </Badge>
                            )}
                            {activity.type === 'review' && activity.rating && (
                              <Badge variant="secondary" className="text-xs">
                                {activity.rating} ⭐
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full justify-start">
                    <Link to={ROUTES.SELLER_UPLOAD}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Note
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link to={ROUTES.SELLER_LISTINGS}>
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Notes
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link to={ROUTES.SELLER_PROFILE}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};