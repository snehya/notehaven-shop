import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Shield, 
  Search, 
  Upload, 
  Download,
  Star,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Discover Quality Notes",
      description: "Browse thousands of high-quality study materials from top students worldwide."
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Earn from Your Notes",
      description: "Turn your study materials into income by selling to fellow students."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quality Guaranteed",
      description: "All notes are moderated by our team to ensure high academic standards."
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Instant Access",
      description: "Get immediate access to purchased notes with high-quality PDF downloads."
    }
  ];

  const stats = [
    { label: "Active Students", value: "50,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Notes Available", value: "100,000+", icon: <BookOpen className="h-5 w-5" /> },
    { label: "Universities", value: "500+", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Total Earnings", value: "$2M+", icon: <DollarSign className="h-5 w-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      university: "MIT",
      content: "NoteMarket saved my GPA! The quality of notes here is incredible, and I even earn money selling my own.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      name: "Alex Rodriguez",
      role: "Business Student",
      university: "Harvard",
      content: "As a busy student, having access to well-organized notes from top performers is a game-changer.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    },
    {
      name: "Emily Johnson",
      role: "Pre-Med Student",
      university: "Stanford",
      content: "I've earned over $3,000 selling my biology notes. It's amazing how my study habits can help others!",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-secondary/20 text-secondary-light border-secondary/30">
              🎓 Join 50,000+ Students Worldwide
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Your Academic Success,{' '}
              <span className="text-gradient-secondary">Monetized</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Buy premium study notes from top students or turn your own notes into a profitable side hustle. 
              Quality education materials, fairly priced.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary-light text-lg px-8 py-3" asChild>
                <Link to="/notes">
                  Browse Notes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3"
                asChild
              >
                <Link to="/signup">Start Selling</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-primary">Why Choose NoteMarket?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've built the perfect platform for academic collaboration and success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto text-white">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-primary">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* For Buyers */}
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  1
                </div>
                <CardTitle className="text-2xl">For Buyers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Browse our extensive library</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Preview notes before purchasing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Download instantly after payment</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/notes">Start Browsing</Link>
                </Button>
              </CardContent>
            </Card>

            {/* For Sellers */}
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  2
                </div>
                <CardTitle className="text-2xl">For Sellers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Upload your quality notes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Set your own prices</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Earn money with each sale</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/signup">Start Selling</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quality Assurance */}
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  3
                </div>
                <CardTitle className="text-2xl">Quality First</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Expert moderation team</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Student rating system</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-primary">What Students Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful students who trust NoteMarket
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.university}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Transform Your Studies?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join the largest community of students sharing knowledge and earning together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary-light" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/notes">Browse Notes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};