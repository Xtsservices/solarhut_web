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
    image: "/src/assets/SolarHutImages/solar1.jpeg",
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

  return null;
}