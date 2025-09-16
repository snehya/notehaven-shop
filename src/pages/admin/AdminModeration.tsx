import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/common/BackButton';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PendingNote {
  id: string;
  title: string;
  subject: string;
  institution: string;
  price: number;
  seller: {
    name: string;
    email: string;
  };
  uploadDate: string;
  description: string;
  fileSize: string;
}

export const AdminModeration: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [pendingNotes, setPendingNotes] = useState<PendingNote[]>([
    {
      id: '1',
      title: 'Advanced Calculus - Integration Techniques',
      subject: 'Mathematics',
      institution: 'MIT',
      price: 25.99,
      seller: {
        name: 'John Smith',
        email: 'john.smith@example.com'
      },
      uploadDate: '2024-01-15',
      description: 'Comprehensive notes covering advanced integration techniques including substitution, integration by parts, and partial fractions.',
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      title: 'Organic Chemistry Mechanisms',
      subject: 'Chemistry',
      institution: 'Harvard University',
      price: 32.50,
      seller: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com'
      },
      uploadDate: '2024-01-14',
      description: 'Detailed reaction mechanisms for organic chemistry with step-by-step explanations and examples.',
      fileSize: '4.1 MB'
    },
    {
      id: '3',
      title: 'Data Structures and Algorithms',
      subject: 'Computer Science',
      institution: 'Stanford University',
      price: 28.75,
      seller: {
        name: 'Mike Chen',
        email: 'mike.chen@example.com'
      },
      uploadDate: '2024-01-13',
      description: 'Complete guide to fundamental data structures and algorithms with code examples and complexity analysis.',
      fileSize: '3.7 MB'
    }
  ]);

  if (!user || !hasRole('admin')) {
    return <Navigate to="/login" replace />;
  }

  const handleApprove = (noteId: string) => {
    setPendingNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Note Approved",
      description: "The note has been approved and is now available for purchase.",
    });
  };

  const handleReject = (noteId: string) => {
    setPendingNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Note Rejected",
      description: "The note has been rejected and the seller has been notified.",
      variant: "destructive",
    });
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
          <h1 className="text-4xl font-bold text-primary mb-2">Moderation Queue</h1>
          <p className="text-muted-foreground">
            Review and approve notes pending publication ({pendingNotes.length} pending)
          </p>
        </div>

        {/* Pending Notes */}
        <div className="space-y-6">
          {pendingNotes.length === 0 ? (
            <Card className="bg-white/80 border-primary/20 shadow-elegant">
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">All caught up!</h3>
                <p className="text-muted-foreground">There are no notes pending review at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            pendingNotes.map((note) => (
              <Card key={note.id} className="bg-white/80 border-primary/20 shadow-elegant">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl text-primary">{note.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{note.subject}</Badge>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {note.institution}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(note.uploadDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${note.price}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary mb-2">Description</h4>
                      <p className="text-muted-foreground">{note.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-primary mb-2">Seller Information</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><strong>Name:</strong> {note.seller.name}</p>
                          <p><strong>Email:</strong> {note.seller.email}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary mb-2">File Information</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p><strong>Size:</strong> {note.fileSize}</p>
                          <p><strong>Upload Date:</strong> {new Date(note.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Full
                      </Button>
                      <div className="flex gap-2 ml-auto">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(note.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApprove(note.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};