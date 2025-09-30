import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  BookOpen, 
  Calendar, 
  User, 
  ArrowRight,
  Clock,
  TrendingUp,
  Lightbulb,
  DollarSign
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Blog() {
  const featuredPost = {
    id: 1,
    title: "Complete Guide to Solar Installation in Texas: What Every Homeowner Should Know",
    excerpt: "Everything you need to know about going solar in Texas, from permits and incentives to choosing the right system size for your home.",
    author: "Sarah Martinez",
    authorRole: "Solar Energy Consultant",
    date: "March 10, 2024",
    readTime: "8 min read",
    category: "Installation Guide",
    image: "https://images.unsplash.com/photo-1660330589243-4c640d878052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMHJlc2lkZW50aWFsJTIwaG9tZXxlbnwxfHx8fDE3NTkwNDY3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
    trending: true
  };

  const blogPosts = [
    {
      id: 2,
      title: "Solar Panel Maintenance: Tips to Maximize Your System's Performance",
      excerpt: "Learn essential maintenance practices to keep your solar panels operating at peak efficiency for decades.",
      author: "Mike Johnson",
      date: "March 8, 2024",
      readTime: "5 min read",
      category: "Maintenance",
      image: "https://images.unsplash.com/photo-1653270892594-8452dbf985f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwbWFpbnRlbmFuY2V8ZW58MXx8fHwxNzU5MDQ2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      trending: false
    },
    {
      id: 3,
      title: "2024 Solar Tax Credits and Incentives: Maximize Your Savings",
      excerpt: "Complete breakdown of federal, state, and local solar incentives available to Texas homeowners in 2024.",
      author: "Jennifer Lee",
      date: "March 5, 2024",
      readTime: "6 min read",
      category: "Financing",
      image: "https://images.unsplash.com/photo-1670519808728-335b1eb2ef52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2xhciUyMGZhcm0lMjBncmVlbiUyMGVuZXJneXxlbnwxfHx8fDE3NTkwMzc4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      trending: true
    },
    {
      id: 4,
      title: "Commercial Solar: ROI Analysis for Texas Businesses",
      excerpt: "How businesses across Texas are reducing operational costs and improving sustainability with commercial solar installations.",
      author: "David Chen",
      date: "March 2, 2024",
      readTime: "7 min read",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1726866672851-5b99c837603c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwc29sYXIlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzU5MDM3ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      trending: false
    },
    {
      id: 5,
      title: "Solar Storage Solutions: Battery Backup for Your Home",
      excerpt: "Understanding solar battery storage options and how they can provide energy independence during outages.",
      author: "Lisa Rodriguez",
      date: "February 28, 2024",
      readTime: "4 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1662601680176-b797a4417c25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGJhdHRlcnklMjBzdG9yYWdlfGVufDF8fHx8MTc1OTAzNzg2OHww&ixlib=rb-4.1.0&q=80&w=1080",
      trending: false
    },
    {
      id: 6,
      title: "Understanding Net Metering: How to Sell Power Back to the Grid",
      excerpt: "Everything homeowners need to know about net metering policies and how to maximize earnings from excess solar power.",
      author: "Robert Kim",
      date: "February 25, 2024",
      readTime: "6 min read",
      category: "Policy",
      image: "https://images.unsplash.com/photo-1660330589243-4c640d878052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMHJlc2lkZW50aWFsJTIwaG9tZXxlbnwxfHx8fDE3NTkwNDY3NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      trending: true
    }
  ];

  const categories = [
    { name: "All Posts", count: 25, icon: BookOpen },
    { name: "Installation Guide", count: 8, icon: Lightbulb },
    { name: "Maintenance", count: 6, icon: TrendingUp },
    { name: "Financing", count: 5, icon: DollarSign },
    { name: "Technology", count: 6, icon: BookOpen }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Installation Guide": return Lightbulb;
      case "Maintenance": return TrendingUp;
      case "Financing": return DollarSign;
      case "Technology": return BookOpen;
      case "Commercial": return BookOpen;
      case "Policy": return BookOpen;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Installation Guide": return "bg-orange-100 text-orange-800";
      case "Maintenance": return "bg-blue-100 text-blue-800";
      case "Financing": return "bg-green-100 text-green-800";
      case "Technology": return "bg-purple-100 text-purple-800";
      case "Commercial": return "bg-yellow-100 text-yellow-800";
      case "Policy": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="section-alternate-2 section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Solar Knowledge Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest insights, tips, and updates from our solar experts. 
            From installation guides to maintenance tips, we've got you covered.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button 
                key={category.name}
                variant="outline" 
                className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50"
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800">
                  {category.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="md:flex">
              <div className="md:w-1/2">
                <ImageWithFallback 
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getCategoryColor(featuredPost.category)}>
                    {featuredPost.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => {
            const CategoryIcon = getCategoryIcon(post.category);
            return (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative overflow-hidden">
                  <ImageWithFallback 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(post.category)}>
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {post.category}
                    </Badge>
                  </div>
                  {post.trending && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FFA500] transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {post.date}
                    </span>
                  </div>
                  
                  <Button variant="outline" className="w-full border-[#FFA500] text-[#FFA500] hover:bg-orange-50">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white border-0">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4">Stay Updated with Solar Insights</h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest solar tips, industry news, and exclusive guides delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button size="lg" className="bg-white text-[#FFA500] hover:bg-gray-100">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Subscribe Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#FFA500]">
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}