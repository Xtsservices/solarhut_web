import { useState } from 'react';
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Calendar, 
  User, 
  Clock,
  Search,
  ArrowRight,
  Tag,
  Eye
} from "lucide-react";

export function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const featuredPost = {
    id: 1,
    title: "The Ultimate Guide to Solar Panel Installation in India 2024",
    excerpt: "Everything you need to know about installing solar panels on your home, from permits to performance optimization. Get expert insights and step-by-step guidance.",
    image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwc29sYXIlMjBwYW5lbHN8ZW58MXx8fHwxNzU5MDM5Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: "Dr. Rajesh Kumar",
    date: "March 28, 2024",
    readTime: "8 min read",
    category: "Installation",
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: "Solar Panel Maintenance: Tips for Maximum Efficiency",
      excerpt: "Learn how proper maintenance can extend your solar panel life and maximize energy production. Simple tips that every solar owner should know.",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwc29sYXIlMjBwYW5lbHN8ZW58MXx8fHwxNzU5MDM5Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Priya Sharma",
      date: "March 25, 2024",
      readTime: "5 min read",
      category: "Maintenance",
      views: "2.5k"
    },
    {
      id: 3,
      title: "Understanding Net Metering: How to Sell Power Back to the Grid",
      excerpt: "Complete guide to net metering policies in India, benefits, and how to set up your solar system for grid connectivity and bill credits.",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwc29sYXIlMjBwYW5lbHN8ZW58MXx8fHwxNzU5MDM5Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Amit Patel",
      date: "March 22, 2024",
      readTime: "6 min read",
      category: "Policy",
      views: "3.1k"
    },
    {
      id: 4,
      title: "Commercial Solar ROI: Calculate Your Business Savings",
      excerpt: "Discover how commercial solar installations can transform your business expenses. Real case studies and ROI calculations from successful projects.",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwc29sYXIlMjBwYW5lbHN8ZW58MXx8fHwxNzU5MDM5Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Kavita Singh",
      date: "March 20, 2024",
      readTime: "7 min read",
      category: "Commercial",
      views: "1.8k"
    },
    {
      id: 5,
      title: "Government Solar Subsidies 2024: Complete Application Guide",
      excerpt: "Navigate the latest government solar subsidy schemes, eligibility criteria, and step-by-step application process to maximize your benefits.",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwc29sYXIlMjBwYW5lbHN8ZW58MXx8fHwxNzU5MDM5Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Suresh Reddy",
      date: "March 18, 2024",
      readTime: "10 min read",
      category: "Subsidies",
      views: "4.2k"
    },
    {
      id: 6,
      title: "Solar vs Traditional Energy: Cost Comparison 2024",
      excerpt: "Detailed analysis comparing solar energy costs with traditional electricity sources. Find out why solar is becoming the preferred choice.",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwc29sYXIlMjBwYW5lbHN8ZW58MXx8fHwxNzU5MDM5Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Meera Joshi",
      date: "March 15, 2024",
      readTime: "6 min read",
      category: "Analysis",
      views: "2.9k"
    },
    {
      id: 7,
      title: "Battery Storage for Solar: Do You Really Need It?",
      excerpt: "Comprehensive guide to solar battery storage systems, costs, benefits, and whether it's right for your solar installation needs.",
      image: "https://images.unsplash.com/photo-1689463819955-31992c29be68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwc29sYXIlMjBwYW5lbHN8ZW58MXx8fHwxNzU5MDM5Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Vikram Kumar",
      date: "March 12, 2024",
      readTime: "8 min read",
      category: "Technology",
      views: "3.7k"
    }
  ];

  const categories = [
    { name: "All", count: 25 },
    { name: "Installation", count: 8 },
    { name: "Maintenance", count: 5 },
    { name: "Policy", count: 4 },
    { name: "Commercial", count: 3 },
    { name: "Subsidies", count: 3 },
    { name: "Technology", count: 2 }
  ];

  const recentPosts = [
    {
      title: "Top 5 Solar Panel Brands in India 2024",
      date: "March 26, 2024"
    },
    {
      title: "How Weather Affects Solar Panel Performance",
      date: "March 24, 2024"
    },
    {
      title: "Solar Installation Permits: A Complete Guide",
      date: "March 21, 2024"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEF7ED' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Solar Energy Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Stay informed with the latest insights, tips, and trends in solar energy. 
              Expert advice to help you make the most of your solar investment.
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <Card className="mb-12 overflow-hidden border-0 shadow-xl">
              <div className="relative h-64 lg:h-80">
                <ImageWithFallback
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500 text-yellow-900 border-0">
                    Featured
                  </Badge>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {featuredPost.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                <p className="text-lg text-gray-700 mb-6">{featuredPost.excerpt}</p>
                <Button>
                  Read Full Article
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-0">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <span className="text-gray-700">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Stay Updated</h3>
                <p className="text-gray-600 mb-4">
                  Get the latest solar energy news and tips delivered to your inbox weekly.
                </p>
                <div className="space-y-3">
                  <Input type="email" placeholder="Enter your email" />
                  <Button className="w-full">
                    Subscribe to Newsletter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Solar Installation", "Net Metering", "Subsidies", "ROI", 
                    "Maintenance", "Battery Storage", "Commercial Solar", "Residential"
                  ].map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}