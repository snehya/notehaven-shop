/**
 * @fileoverview Seller profile page - Manage seller account, notes, and earnings
 * @author NoteMarket Team
 * @created 2024
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BackButton } from '@/components/common/BackButton';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Download,
  Star,
  Edit,
  Save,
  X,
  DollarSign,
  TrendingUp,
  BookOpen,
  Eye,
  MessageSquare,
  Award,
  Target,
  BarChart3,
  FileText,
  Users,
  Clock
} from 'lucide-react';

interface SellerStats {
  totalEarnings: number;
  totalSales: number;
  totalNotes: number;
  avgRating: number;
  totalReviews: number;
  monthlyEarnings: number;
  conversionRate: number;
}

interface SellerNote {
  id: string;
  title: string;
  subject: string;
  price: number;
  sales: number;
  earnings: number;
  rating: number;
  reviews: number;
  views: number;
  uploadDate: Date;
  status: 'approved' | 'pending' | 'rejected';
}

export const SellerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: 'Passionate educator sharing high-quality study materials',
    location: '',
    university: 'MIT',
    specialization: 'Mathematics & Computer Science',
    yearsOfExperience: '3',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
  });

  // Mock seller stats - In real app, this would come from an API
  const sellerStats: SellerStats = useMemo(() => ({
    totalEarnings: 2485.50,
    totalSales: 156,
    totalNotes: 24,
    avgRating: 4.8,
    totalReviews: 89,
    monthlyEarnings: 580.25,
    conversionRate: 15.2
  }), []);

  // Mock seller notes - In real app, this would come from an API
  const sellerNotes: SellerNote[] = useMemo(() => [
    {
      id: '1',
      title: 'Advanced Calculus - Comprehensive Study Guide',
      subject: 'Mathematics',
      price: 15.99,
      sales: 45,
      earnings: 719.55,
      rating: 4.9,
      reviews: 23,
      views: 234,
      uploadDate: new Date('2024-01-15'),
      status: 'approved'
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      subject: 'Computer Science',
      price: 18.75,
      sales: 38,
      earnings: 712.50,
      rating: 4.7,
      reviews: 19,
      views: 189,
      uploadDate: new Date('2024-01-10'),
      status: 'approved'
    },
    {
      id: '3',
      title: 'Linear Algebra Fundamentals',
      subject: 'Mathematics',
      price: 12.99,
      sales: 52,
      earnings: 675.48,
      rating: 4.8,
      reviews: 31,
      views: 298,
      uploadDate: new Date('2024-01-05'),
      status: 'approved'
    },
    {
      id: '4',
      title: 'Machine Learning Basics',
      subject: 'Computer Science',
      price: 22.50,
      sales: 21,
      earnings: 472.50,
      rating: 5.0,
      reviews: 16,
      views: 156,
      uploadDate: new Date('2023-12-28'),
      status: 'pending'
    }
  ], []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await updateProfile({
        name: profileData.name,
        avatar: profileData.avatar
      });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your seller profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  }, [profileData, updateProfile]);

  const handleCancel = useCallback(() => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      bio: 'Passionate educator sharing high-quality study materials',
      location: '',
      university: 'MIT',
      specialization: 'Mathematics & Computer Science',
      yearsOfExperience: '3',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
    });
    setIsEditing(false);
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton />
        
        <div className="mt-6 space-y-6">
          {/* Seller Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{profileData.name}</h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        <Award className="w-4 h-4 mr-1" />
                        Top Seller
                      </Badge>
                      <Badge variant="secondary">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Seller
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {profileData.email}
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profileData.university} • {profileData.specialization}
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">${sellerStats.totalEarnings}</div>
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                    </div>
                    
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{sellerStats.totalSales}</div>
                      <div className="text-sm text-muted-foreground">Total Sales</div>
                    </div>
                    
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{sellerStats.totalNotes}</div>
                      <div className="text-sm text-muted-foreground">Notes Published</div>
                    </div>
                    
                    <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-center justify-center text-2xl font-bold text-yellow-600">
                        <Star className="w-6 h-6 mr-1 fill-current" />
                        {sellerStats.avgRating}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    variant={isEditing ? "default" : "outline"}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  
                  {isEditing && (
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="notes">My Notes</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Dashboard */}
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Cards */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        This Month's Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-green-600">${sellerStats.monthlyEarnings}</div>
                          <div className="text-sm text-muted-foreground">Monthly Earnings</div>
                          <div className="text-xs text-green-600">+15% from last month</div>
                        </div>
                        
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{sellerStats.conversionRate}%</div>
                          <div className="text-sm text-muted-foreground">Conversion Rate</div>
                          <div className="text-xs text-blue-600">+2.3% from last month</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium">New sale: Advanced Calculus Study Guide</div>
                            <div className="text-sm text-muted-foreground">2 hours ago • $15.99</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium">New review: 5 stars on Data Structures</div>
                            <div className="text-sm text-muted-foreground">5 hours ago</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium">Note pending approval: Machine Learning Basics</div>
                            <div className="text-sm text-muted-foreground">1 day ago</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Goals Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Monthly Sales Goal</span>
                          <span>32/50</span>
                        </div>
                        <Progress value={64} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Earnings Goal</span>
                          <span>$580/$800</span>
                        </div>
                        <Progress value={72.5} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Rating Goal</span>
                          <span>4.8/5.0</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Audience Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Followers</span>
                        <span className="font-medium">234</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Profile Views</span>
                        <span className="font-medium">1,245</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Note Downloads</span>
                        <span className="font-medium">{sellerStats.totalSales}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* My Notes */}
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      My Notes ({sellerNotes.length})
                    </div>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Note
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sellerNotes.map((note) => (
                      <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{note.title}</h4>
                            <Badge variant={note.status === 'approved' ? 'default' : note.status === 'pending' ? 'secondary' : 'destructive'}>
                              {note.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                            <span>{note.subject}</span>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {note.views} views
                            </div>
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-1" />
                              {note.sales} sales
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                              {note.rating} ({note.reviews} reviews)
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-lg font-semibold">${note.price}</div>
                          <div className="text-sm text-green-600 font-medium">
                            Earned: ${note.earnings.toFixed(2)}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="w-4 h-4 mr-1" />
                              Stats
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings */}
            <TabsContent value="earnings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Earnings</span>
                      <span className="text-2xl font-bold text-green-600">${sellerStats.totalEarnings}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <span className="text-lg font-semibold">${sellerStats.monthlyEarnings}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Average per Sale</span>
                      <span className="text-lg font-semibold">${(sellerStats.totalEarnings / sellerStats.totalSales).toFixed(2)}</span>
                    </div>
                    
                    <Button className="w-full mt-4">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Request Payout
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sellerNotes
                        .sort((a, b) => b.earnings - a.earnings)
                        .slice(0, 5)
                        .map((note, index) => (
                          <div key={note.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{note.title}</div>
                                <div className="text-xs text-muted-foreground">{note.sales} sales</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">${note.earnings.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Seller Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="bg-muted"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={profileData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={profileData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        value={profileData.yearsOfExperience}
                        onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell students about your expertise..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-semibold">{sellerStats.conversionRate}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Average Rating</span>
                      <span className="font-semibold">{sellerStats.avgRating}/5.0</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Total Reviews</span>
                      <span className="font-semibold">{sellerStats.totalReviews}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Response Rate</span>
                      <span className="font-semibold">98%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-yellow-400 pl-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm mt-1">"Excellent notes! Very detailed and well-organized."</p>
                        <p className="text-xs text-muted-foreground">- Advanced Calculus Study Guide</p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-400 pl-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">1 week ago</span>
                        </div>
                        <p className="text-sm mt-1">"Great content, helped me ace my exam!"</p>
                        <p className="text-xs text-muted-foreground">- Data Structures & Algorithms</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};