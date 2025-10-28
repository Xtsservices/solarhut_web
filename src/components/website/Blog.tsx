import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  BookOpen, 
  Calendar, 
  User, 
  ArrowRight,
  Clock,
  TrendingUp,
  Lightbulb,
  IndianRupee
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BlogProps {
  onNavigate?: (page: string) => void;
}

export function Blog({ onNavigate }: BlogProps) {
  const handleReadMore = () => {
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  const handleViewAllPosts = () => {
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  const featuredPost = {
    id: 1,
    title: "Complete Guide to Solar Installation in India: What Every Homeowner Should Know",
    excerpt: "Everything you need to know about going solar in India, from permits and subsidies to choosing the right system size for your home.",
    author: "Priya Malhotra",
    authorRole: "Solar Energy Consultant",
    date: "March 10, 2024",
    readTime: "8 min read",
    category: "Installation Guide",
    image: "https://images.unsplash.com/photo-1635424709845-3a85ad5e1f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwaW5zdGFsbGF0aW9uJTIwcm9vZnRvcHxlbnwxfHx8fDE3NjE1NTkxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
    trending: true
  };

  const blogPosts = [
    {
      id: 2,
      title: "Solar Panel Maintenance: Tips to Maximize Your System's Performance",
      excerpt: "Learn essential maintenance practices to keep your solar panels operating at peak efficiency for decades in Indian climate.",
      author: "Rajesh Kumar",
      date: "March 8, 2024",
      readTime: "5 min read",
      category: "Maintenance",
      image: "https://images.unsplash.com/photo-1653270892594-8452dbf985f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsJTIwbWFpbnRlbmFuY2V8ZW58MXx8fHwxNzU5MDQ2NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      trending: false
    },
    {
      id: 3,
      title: "2024 Solar Subsidies and Incentives: Maximize Your Savings",
      excerpt: "Complete breakdown of central, state, and local solar subsidies available to Indian homeowners in 2024.",
      author: "Anjali Sharma",
      date: "March 5, 2024",
      readTime: "6 min read",
      category: "Financing",
      image: "https://images.unsplash.com/photo-1670519808728-335b1eb2ef52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2xhciUyMGZhcm0lMjBncmVlbiUyMGVuZXJneXxlbnwxfHx8fDE3NTkwMzc4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      trending: true
    },
    {
      id: 4,
      title: "Commercial Solar: ROI Analysis for Indian Businesses",
      excerpt: "How businesses across India are reducing operational costs and improving sustainability with commercial solar installations.",
      author: "Vikram Patel",
      date: "March 2, 2024",
      readTime: "7 min read",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1726866672851-5b99c837603c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwc29sYXIlMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzU5MDM3ODkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      trending: false
    },
    {
      id: 5,
      title: "Solar Storage Solutions: Battery Backup for Your Home",
      excerpt: "Understanding solar battery storage options and how they can provide energy independence during power cuts.",
      author: "Meera Reddy",
      date: "February 28, 2024",
      readTime: "4 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1662601680176-b797a4417c25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGJhdHRlcnklMjBzdG9yYWdlfGVufDF8fHx8MTc1OTAzNzg2OHww&ixlib=rb-4.1.0&q=80&w=1080",
      trending: false
    },
    {
      id: 6,
      title: "Understanding Net Metering: How to Sell Power Back to the Grid",
      excerpt: "Everything homeowners need to know about net metering policies and how to maximize earnings from excess solar power in India.",
      author: "Arjun Singh",
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
    { name: "Financing", count: 5, icon: IndianRupee },
    { name: "Technology", count: 6, icon: BookOpen }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Installation Guide": return Lightbulb;
      case "Maintenance": return TrendingUp;
      case "Financing": return IndianRupee;
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
    <section id="blog" className="section-blog section-padding bg-gray-50">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Solar Insights & Resources
          </div>
          <h2 className="text-3xl lg:text-5xl text-gray-900 mb-6">
            Latest From Our Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay informed with expert insights, installation guides, and the latest news 
            in solar energy technology and sustainable living.
          </p>
        </div>

        {/* Categories - HIDDEN */}
        {/* <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className="flex items-center px-4 py-2 bg-white rounded-lg border-2 border-gray-200 hover:border-[#FFA500] hover:text-[#FFA500] transition-all duration-300"
            >
              <category.icon className="w-4 h-4 mr-2" />
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-2 bg-gray-100">
                {category.count}
              </Badge>
            </button>
          ))}
        </div> */}

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden border-0 shadow-xl bg-white">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <ImageWithFallback
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <Badge className="bg-[#FFA500] text-white border-0">
                    Featured
                  </Badge>
                  {featuredPost.trending && (
                    <Badge className="bg-white text-gray-900 border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-8 lg:p-10 flex flex-col justify-center">
                <Badge className={`${getCategoryColor(featuredPost.category)} w-fit mb-4`}>
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {featuredPost.category}
                </Badge>
                
                <h3 className="text-2xl lg:text-3xl text-gray-900 mb-4">
                  {featuredPost.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                
                <Button 
                  className="bg-[#FFA500] hover:bg-[#FF8C00] text-white w-fit"
                  onClick={handleReadMore}
                >
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center bg-orange-50 p-8 rounded-2xl">
          <h3 className="text-2xl text-gray-900 mb-4">
            Want More Solar Insights?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest solar energy tips, installation guides, 
            and exclusive offers delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#FFA500] hover:bg-[#FF8C00] text-white"
              onClick={handleViewAllPosts}
            >
              Subscribe to Newsletter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#FFA500] text-[#FFA500] hover:bg-orange-50 transition-all duration-200"
              onClick={handleViewAllPosts}
            >
              View All Articles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
