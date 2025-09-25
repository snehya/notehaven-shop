/**
 * @fileoverview Seller Listings - Manage all seller's uploaded notes
 * @author NoteMarket Team
 * @created 2024
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/common/BackButton';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import {
  Search,
  Upload,
  Edit,
  Trash2,
  Eye,
  Download,
  Star,
  DollarSign,
  Filter,
  MoreHorizontal,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SellerNote {
  id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  sales: number;
  earnings: number;
  rating: number;
  reviews: number;
  views: number;
  uploadDate: Date;
  lastModified: Date;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  tags: string[];
  fileSize: string;
  downloadCount: number;
}

type SortOption = 'newest' | 'oldest' | 'earnings' | 'sales' | 'rating' | 'views';
type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected' | 'draft';

export const SellerListings: React.FC = () => {
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');  
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Mock data - In real app, this would come from an API
  const allNotes: SellerNote[] = useMemo(() => [
    {
      id: '1',
      title: 'Advanced Calculus - Comprehensive Study Guide',
      subject: 'Mathematics',
      description: 'Complete guide covering derivatives, integrals, and applications',
      price: 15.99,
      sales: 45,
      earnings: 719.55,
      rating: 4.9,
      reviews: 23,
      views: 234,
      uploadDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-16'),
      status: 'approved',
      tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
      fileSize: '2.4 MB',
      downloadCount: 45
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms',
      subject: 'Computer Science',
      description: 'Comprehensive coverage of arrays, trees, graphs, and sorting algorithms',
      price: 18.75,
      sales: 38,
      earnings: 712.50,
      rating: 4.7,
      reviews: 19,
      views: 189,
      uploadDate: new Date('2024-01-10'),
      lastModified: new Date('2024-01-12'),
      status: 'approved',
      tags: ['algorithms', 'data-structures', 'programming', 'computer-science'],
      fileSize: '3.1 MB',
      downloadCount: 38
    },
    {
      id: '3',
      title: 'Linear Algebra Fundamentals',
      subject: 'Mathematics',
      description: 'Vectors, matrices, eigenvalues and their applications',
      price: 12.99,
      sales: 52,
      earnings: 675.48,
      rating: 4.8,
      reviews: 31,
      views: 298,
      uploadDate: new Date('2024-01-05'),
      lastModified: new Date('2024-01-06'),
      status: 'approved',
      tags: ['linear-algebra', 'matrices', 'vectors', 'mathematics'],
      fileSize: '1.8 MB',
      downloadCount: 52
    },
    {
      id: '4',
      title: 'Machine Learning Basics',
      subject: 'Computer Science',
      description: 'Introduction to ML concepts, algorithms, and applications',
      price: 22.50,
      sales: 21,
      earnings: 472.50,
      rating: 5.0,
      reviews: 16,
      views: 156,
      uploadDate: new Date('2023-12-28'),
      lastModified: new Date('2023-12-30'),
      status: 'pending',
      tags: ['machine-learning', 'ai', 'algorithms', 'python'],
      fileSize: '4.2 MB',
      downloadCount: 21
    },
    {
      id: '5',
      title: 'Quantum Physics Introduction',
      subject: 'Physics',
      description: 'Basic principles of quantum mechanics and applications',
      price: 19.99,
      sales: 0,
      earnings: 0,
      rating: 0,
      reviews: 0,
      views: 15,
      uploadDate: new Date('2024-01-20'),
      lastModified: new Date('2024-01-20'),
      status: 'draft',
      tags: ['quantum-physics', 'physics', 'mechanics'],
      fileSize: '2.7 MB',
      downloadCount: 0
    }
  ], []);

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = allNotes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(note => note.status === statusFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'oldest':
          return a.uploadDate.getTime() - b.uploadDate.getTime();
        case 'earnings':
          return b.earnings - a.earnings;
        case 'sales':
          return b.sales - a.sales;
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });
  }, [allNotes, searchQuery, statusFilter, sortBy]);

  const getStatusBadge = (status: SellerNote['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'draft':
        return <Badge variant="outline"><FileText className="w-3 h-3 mr-1" />Draft</Badge>;
      default:
        return null;
    }
  };

  const handleDeleteNote = useCallback((noteId: string) => {
    // In real app, this would make an API call
    toast({
      title: "Note Deleted",
      description: "Your note has been deleted successfully.",
    });
  }, []);

  const handleEditNote = useCallback((noteId: string) => {
    // In real app, this would navigate to edit page
    toast({
      title: "Edit Note",
      description: "Edit functionality will be implemented soon.",
    });
  }, []);

  const stats = useMemo(() => {
    const totalNotes = allNotes.length;
    const approved = allNotes.filter(n => n.status === 'approved').length;
    const pending = allNotes.filter(n => n.status === 'pending').length;
    const totalEarnings = allNotes.reduce((sum, note) => sum + note.earnings, 0);
    const totalSales = allNotes.reduce((sum, note) => sum + note.sales, 0);

    return { totalNotes, approved, pending, totalEarnings, totalSales };
  }, [allNotes]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton />
        
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Listings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your uploaded notes and track performance
              </p>
            </div>
            <Button asChild>
              <Link to={ROUTES.SELLER_UPLOAD}>
                <Upload className="w-4 h-4 mr-2" />
                Upload New Note
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalNotes}</p>
                    <p className="text-xs text-muted-foreground">Total Notes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSales}</p>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes by title, subject, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="earnings">Earnings</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes List */}
          <div className="space-y-4">
            {filteredAndSortedNotes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters.'
                      : 'Start by uploading your first study note.'
                    }
                  </p>
                  {!searchQuery && statusFilter === 'all' && (
                    <Button asChild>
                      <Link to={ROUTES.SELLER_UPLOAD}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Your First Note
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredAndSortedNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{note.title}</h3>
                            <p className="text-sm text-muted-foreground">{note.subject}</p>
                          </div>
                          {getStatusBadge(note.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {note.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {note.uploadDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {note.views} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {note.sales} sales
                          </div>
                          {note.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {note.rating} ({note.reviews} reviews)
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="lg:w-48 space-y-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold">${note.price}</div>
                          <div className="text-sm text-green-600 font-medium">
                            Earned: ${note.earnings.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Size: {note.fileSize}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditNote(note.id)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditNote(note.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Note
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="w-4 h-4 mr-2" />
                                View Reviews
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteNote(note.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {filteredAndSortedNotes.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedNotes.length} of {allNotes.length} notes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};