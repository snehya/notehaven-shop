/**
 * @fileoverview Upload Note page - Form for sellers to upload new study notes
 * @author NoteMarket Team
 * @created 2024
 */

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/common/BackButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES, SUBJECTS } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import {
  Upload,
  FileText,
  DollarSign,
  Tag,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface UploadFormData {
  title: string;
  subject: string;
  description: string;
  price: string;
  tags: string[];
  file: File | null;
  preview: boolean;
}

export const UploadNote: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    subject: '',
    description: '',
    price: '',
    tags: [],
    file: null,
    preview: false
  });
  
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = useCallback((field: keyof UploadFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, DOC, or DOCX files only.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, DOC, or DOCX files only.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
    }
  }, []);

  const addTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  }, [newTag, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your note.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subject) {
      toast({
        title: "Subject Required",
        description: "Please select a subject.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Valid Price Required",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.file) {
      toast({
        title: "File Required",
        description: "Please upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // In real app, this would upload to server
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      
      toast({
        title: "Note Uploaded Successfully!",
        description: "Your note has been submitted for review and will be available soon.",
      });

      // Navigate back to listings
      navigate(ROUTES.SELLER_LISTINGS);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [formData, navigate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  }, [addTag, newTag]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton />
        
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Upload New Note</h1>
            <p className="text-muted-foreground mt-1">
              Share your knowledge and earn from your study materials
            </p>
          </div>

          {/* Upload Guidelines */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Upload Guidelines</AlertTitle>
            <AlertDescription>
              • Files must be PDF, DOC, or DOCX format (max 10MB)
              • Ensure your content is original or properly attributed
              • Use clear, descriptive titles and comprehensive descriptions
              • Add relevant tags to help students find your notes
              • Price your notes competitively based on content quality
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Advanced Calculus - Comprehensive Study Guide"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what your notes cover, what makes them valuable, and who they're for..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min="0.99"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="9.99"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum price is $0.99. Consider competitive pricing for better sales.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., calculus, mathematics, derivatives"
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add relevant keywords to help students discover your notes
                  </p>
                </div>

                {formData.tags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Tags ({formData.tags.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                            title={`Remove ${tag} tag`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : formData.file
                      ? 'border-green-500 bg-green-50'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.file ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                      <p className="font-medium">{formData.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Drop your file here</p>
                        <p className="text-muted-foreground">or click to browse</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Supported formats: PDF, DOC, DOCX</p>
                        <p>Maximum file size: 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload note file"
                        aria-label="Upload note file"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isUploading}
                className="min-w-32"
              >
                {isUploading ? 'Uploading...' : 'Upload Note'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.SELLER_LISTINGS)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};