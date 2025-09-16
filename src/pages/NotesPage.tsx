import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { NoteCard, Note } from '@/components/common/NoteCard';
import { BackButton } from '@/components/common/BackButton';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Grid,
  List,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

// Mock data for demonstration
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Advanced Calculus - Comprehensive Study Guide with Practice Problems',
    description: 'Complete notes covering differentiation, integration, and series with worked examples.',
    price: 15.99,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    subject: 'Mathematics',
    grade: 'Undergraduate',
    university: 'MIT',
    seller: {
      id: 'seller1',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      rating: 4.9,
      totalSales: 156
    },
    rating: 4.8,
    totalRatings: 89,
    downloads: 234,
    pages: 45,
    uploadedAt: new Date('2024-01-15'),
    status: 'approved',
    tags: ['calculus', 'derivatives', 'integrals', 'series']
  },
  {
    id: '2',
    title: 'Organic Chemistry Reaction Mechanisms - Visual Guide',
    description: 'Detailed mechanisms with step-by-step explanations and electron flow diagrams.',
    price: 22.50,
    thumbnail: 'https://images.unsplash.com/photo-1576319155264-99536e0be1ee?w=400&h=300&fit=crop',
    subject: 'Chemistry',
    grade: 'Undergraduate',
    university: 'Harvard',
    seller: {
      id: 'seller2',
      name: 'Alex Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      rating: 4.7,
      totalSales: 89
    },
    rating: 4.9,
    totalRatings: 67,
    downloads: 189,
    pages: 38,
    uploadedAt: new Date('2024-01-20'),
    status: 'approved',
    tags: ['organic chemistry', 'mechanisms', 'reactions']
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms - Interview Prep',
    description: 'Essential algorithms with time complexity analysis and coding examples.',
    price: 18.99,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    subject: 'Computer Science',
    grade: 'Undergraduate',
    university: 'Stanford',
    seller: {
      id: 'seller3',
      name: 'Emily Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      rating: 4.8,
      totalSales: 203
    },
    rating: 4.7,
    totalRatings: 124,
    downloads: 445,
    pages: 52,
    uploadedAt: new Date('2024-01-25'),
    status: 'approved',
    tags: ['algorithms', 'data structures', 'coding', 'interviews']
  },
  {
    id: '4',
    title: 'Financial Markets & Investment Analysis',
    description: 'Complete guide to financial markets, valuation methods, and portfolio theory.',
    price: 24.99,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    subject: 'Finance',
    grade: 'Graduate',
    university: 'Wharton',
    seller: {
      id: 'seller4',
      name: 'Michael Zhang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      rating: 4.9,
      totalSales: 134
    },
    rating: 4.8,
    totalRatings: 93,
    downloads: 267,
    pages: 62,
    uploadedAt: new Date('2024-02-01'),
    status: 'approved',
    tags: ['finance', 'investments', 'markets', 'valuation']
  },
  {
    id: '5',
    title: 'Human Anatomy & Physiology - Complete System Review',
    description: 'Comprehensive coverage of all body systems with diagrams and clinical correlations.',
    price: 29.99,
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    subject: 'Biology',
    grade: 'Undergraduate',
    university: 'Johns Hopkins',
    seller: {
      id: 'seller5',
      name: 'Dr. Lisa Park',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
      rating: 5.0,
      totalSales: 78
    },
    rating: 4.9,
    totalRatings: 156,
    downloads: 334,
    pages: 78,
    uploadedAt: new Date('2024-02-05'),
    status: 'approved',
    tags: ['anatomy', 'physiology', 'biology', 'medical']
  },
  {
    id: '6',
    title: 'Macroeconomic Theory & Policy Analysis',
    description: 'Modern macroeconomic models, fiscal policy, and monetary policy with real-world examples.',
    price: 19.99,
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=300&fit=crop',
    subject: 'Economics',
    grade: 'Graduate',
    university: 'University of Chicago',
    seller: {
      id: 'seller6',
      name: 'David Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
      rating: 4.6,
      totalSales: 167
    },
    rating: 4.6,
    totalRatings: 78,
    downloads: 198,
    pages: 41,
    uploadedAt: new Date('2024-02-10'),
    status: 'approved',
    tags: ['macroeconomics', 'policy', 'theory', 'economics']
  }
];

const subjects = [
  'All Subjects', 'Mathematics', 'Chemistry', 'Computer Science', 
  'Finance', 'Biology', 'Economics', 'Physics', 'Psychology', 'Engineering'
];

const grades = ['All Levels', 'High School', 'Undergraduate', 'Graduate', 'PhD'];

const universities = [
  'All Universities', 'MIT', 'Harvard', 'Stanford', 'Wharton', 
  'Johns Hopkins', 'University of Chicago', 'Yale', 'Princeton'
];

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedGrade, setSelectedGrade] = useState('All Levels');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  // Filter and sort notes
  useEffect(() => {
    let filteredNotes = mockNotes;

    // Filter by search query
    if (searchQuery) {
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by subject
    if (selectedSubject !== 'All Subjects') {
      filteredNotes = filteredNotes.filter(note => note.subject === selectedSubject);
    }

    // Filter by grade
    if (selectedGrade !== 'All Levels') {
      filteredNotes = filteredNotes.filter(note => note.grade === selectedGrade);
    }

    // Filter by university
    if (selectedUniversity !== 'All Universities') {
      filteredNotes = filteredNotes.filter(note => note.university === selectedUniversity);
    }

    // Filter by price range
    filteredNotes = filteredNotes.filter(note => 
      note.price >= priceRange.min && note.price <= priceRange.max
    );

    // Sort notes
    switch (sortBy) {
      case 'newest':
        filteredNotes.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
        break;
      case 'oldest':
        filteredNotes.sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime());
        break;
      case 'price_low':
        filteredNotes.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredNotes.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredNotes.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filteredNotes.sort((a, b) => b.downloads - a.downloads);
        break;
      default:
        break;
    }

    setNotes(filteredNotes);
  }, [searchQuery, selectedSubject, selectedGrade, selectedUniversity, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-card border-b">
        <div className="container py-8">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <BackButton fallbackUrl="/" variant="outline">
                Back to Home
              </BackButton>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Discover Quality Study Notes
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Browse thousands of premium notes from top students at leading universities
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search notes, subjects, topics, universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg h-14"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Subject Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grade Level Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Grade Level</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* University Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">University</label>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map(university => (
                      <SelectItem key={university} value={university}>{university}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Active Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Active Filters</label>
                <div className="flex flex-wrap gap-2">
                  {selectedSubject !== 'All Subjects' && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedSubject('All Subjects')}>
                      {selectedSubject} ×
                    </Badge>
                  )}
                  {selectedGrade !== 'All Levels' && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedGrade('All Levels')}>
                      {selectedGrade} ×
                    </Badge>
                  )}
                  {selectedUniversity !== 'All Universities' && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedUniversity('All Universities')}>
                      {selectedUniversity} ×
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">
                  {notes.length} Notes Found
                </h2>
                <Badge variant="outline" className="text-sm">
                  {searchQuery ? `for "${searchQuery}"` : 'All Results'}
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Newest First
                      </div>
                    </SelectItem>
                    <SelectItem value="popular">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Most Popular
                      </div>
                    </SelectItem>
                    <SelectItem value="rating">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Highest Rated
                      </div>
                    </SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {notes.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {notes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    size={viewMode === 'list' ? 'compact' : 'default'} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notes found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse all available notes.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject('All Subjects');
                    setSelectedGrade('All Levels');
                    setSelectedUniversity('All Universities');
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};