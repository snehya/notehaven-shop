import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/common/BackButton';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Mail, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  status: 'active' | 'suspended';
  joinDate: string;
  totalPurchases: number;
  totalSales: number;
  totalSpent: number;
  totalEarned: number;
}

export const AdminUsers: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'seller',
      status: 'active',
      joinDate: '2023-12-01',
      totalPurchases: 3,
      totalSales: 12,
      totalSpent: 89.97,
      totalEarned: 324.50
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-01-05',
      totalPurchases: 8,
      totalSales: 0,
      totalSpent: 245.32,
      totalEarned: 0
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      role: 'seller',
      status: 'suspended',
      joinDate: '2023-11-15',
      totalPurchases: 1,
      totalSales: 5,
      totalSpent: 25.99,
      totalEarned: 142.75
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-01-10',
      totalPurchases: 15,
      totalSales: 0,
      totalSpent: 456.88,
      totalEarned: 0
    },
    {
      id: '5',
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      role: 'seller',
      status: 'active',
      joinDate: '2023-10-20',
      totalPurchases: 7,
      totalSales: 23,
      totalSpent: 198.45,
      totalEarned: 687.25
    }
  ]);

  if (!user || !hasRole('admin')) {
    return <Navigate to="/login" replace />;
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: user?.status === 'active' ? "User Suspended" : "User Reactivated",
      description: `${user?.name} has been ${user?.status === 'active' ? 'suspended' : 'reactivated'}.`,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary/10 text-primary border-primary/20';
      case 'seller': return 'bg-accent/10 text-accent border-accent/20';
      case 'buyer': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container py-8">
        <div className="mb-6">
          <BackButton fallbackUrl="/admin/dashboard" variant="outline">
            Back to Dashboard
          </BackButton>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Manage Users</h1>
          <p className="text-muted-foreground">
            View and manage all platform users ({filteredUsers.length} total)
          </p>
        </div>

        {/* Search */}
        <Card className="bg-white/80 border-primary/20 shadow-elegant mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/80 border-primary/20 shadow-elegant">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Purchases</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-primary">{userData.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {userData.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(userData.role)}>
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(userData.status)}>
                        {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(userData.joinDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{userData.totalPurchases}</div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${userData.totalSpent.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{userData.totalSales}</div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${userData.totalEarned.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={userData.status === 'active' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => handleSuspendUser(userData.id)}
                      >
                        {userData.status === 'active' ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Reactivate
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};