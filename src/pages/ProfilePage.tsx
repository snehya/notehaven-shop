/**
 * @fileoverview Profile page for buyers - Account management and purchase history
 * @author NoteMarket Team
 * @created 2024
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackButton } from '@/components/common/BackButton';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Download,
  Star,
  Edit,
  Save,
  X,
  CreditCard,
  Bell,
  Shield,
  BookOpen
} from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  university: string;
  avatar: string;
}

interface PurchaseHistory {
  id: string;
  title: string;
  subject: string;
  price: number;
  purchaseDate: Date;
  downloadCount: number;
  seller: string;
  rating?: number;
}

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { totalItems } = useCart();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    location: '',
    university: '',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
  });

  // Mock purchase history - In real app, this would come from an API
  const purchaseHistory: PurchaseHistory[] = useMemo(() => [
    {
      id: '1',
      title: 'Advanced Calculus - Comprehensive Study Guide',
      subject: 'Mathematics',
      price: 15.99,
      purchaseDate: new Date('2024-01-15'),
      downloadCount: 3,
      seller: 'Sarah Chen',
      rating: 5
    },
    {
      id: '2',
      title: 'Organic Chemistry Reaction Mechanisms',
      subject: 'Chemistry',
      price: 22.50,
      purchaseDate: new Date('2024-01-10'),
      downloadCount: 1,
      seller: 'Dr. Michael Rodriguez'
    },
    {
      id: '3',
      title: 'Data Structures & Algorithms',
      subject: 'Computer Science',
      price: 18.75,
      purchaseDate: new Date('2024-01-05'),
      downloadCount: 5,
      seller: 'Alex Thompson',
      rating: 4
    }
  ], []);

  const totalSpent = useMemo(() => 
    purchaseHistory.reduce((sum, purchase) => sum + purchase.price, 0),
    [purchaseHistory]
  );

  const handleInputChange = useCallback((field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      // In a real app, this would make an API call
      await updateProfile({
        name: profileData.name,
        avatar: profileData.avatar
      });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
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
      bio: '',
      location: '',
      university: '',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
    });
    setIsEditing(false);
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton />
        
        <div className="mt-6 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback className="text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{profileData.name}</h1>
                    <Badge variant="secondary" className="ml-2">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Buyer
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {profileData.email}
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{purchaseHistory.length}</div>
                      <div className="text-sm text-muted-foreground">Purchases</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{totalItems}</div>
                      <div className="text-sm text-muted-foreground">In Cart</div>
                    </div>
                  </div>
                </div>
                
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
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="purchases">Purchase History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
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
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="+1 (555) 123-4567"
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={profileData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your university"
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
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Purchase History */}
            <TabsContent value="purchases">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Purchase History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {purchaseHistory.length > 0 ? (
                    <div className="space-y-4">
                      {purchaseHistory.map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{purchase.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{purchase.subject}</span>
                              <span>•</span>
                              <span>by {purchase.seller}</span>
                              <span>•</span>
                              <span>{purchase.purchaseDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center">
                                <Download className="w-4 h-4 mr-1" />
                                {purchase.downloadCount} downloads
                              </div>
                              {purchase.rating && (
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                  {purchase.rating}/5
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold">${purchase.price}</div>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                      <p className="text-muted-foreground">Start browsing notes to make your first purchase!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Email Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>New notes in my subjects</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Price drops on notes in my wishlist</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Marketing emails and promotions</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Privacy Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Show my purchase history to sellers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Allow sellers to contact me directly</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Password</h4>
                    <Button variant="outline">
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Payment Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-3" />
                          <div>
                            <div className="font-medium">•••• •••• •••• 4242</div>
                            <div className="text-sm text-muted-foreground">Expires 12/25</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                      <Button variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Authentication</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};