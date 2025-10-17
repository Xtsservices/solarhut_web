import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  Home, 
  ArrowLeft, 
  Search,
  Sun,
  Zap
} from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();
  const quickLinks = [
    { title: "Home", path: "/", icon: Home },
    { title: "Solar Solutions", path: "/solutions", icon: Sun },
    { title: "Residential Solar", path: "/solutions/residential", icon: Home },
    { title: "Commercial Solar", path: "/solutions/commercial", icon: Zap },
    { title: "Get Quote", path: "/contact", icon: Search }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* 404 Graphic */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
            <div className="flex justify-center items-center space-x-2 mb-8">
              <Sun className="w-12 h-12 text-yellow-500" />
              <div className="text-2xl text-gray-600">Page Not Found</div>
              <Sun className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Oops! This page is off the grid
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              It looks like the page you're looking for doesn't exist or has been moved. 
              But don't worry, we can help you find what you're looking for!
            </p>
            <p className="text-lg text-gray-500">
              Just like solar panels capture sunlight, let us help you capture the right information.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Home className="mr-2 w-5 h-5" />
                Go Back Home
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 w-5 h-5" />
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <Card className="border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Pages</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <Link key={index} to={link.path}>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{link.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Solar Fact */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sun className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-gray-900">Did You Know?</h3>
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-gray-700">
              Solar panels can generate electricity even on cloudy days! They use both direct and diffuse sunlight, 
              though at reduced efficiency. Just like how we can help you find the right page even when you're lost!
            </p>
          </div>

          {/* Contact CTA */}
          <div className="mt-12">
            <p className="text-gray-600 mb-4">Need help finding something specific?</p>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Our Solar Experts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}