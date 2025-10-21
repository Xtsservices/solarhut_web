import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Award, 
  Calendar, 
  Trophy, 
  Star,
  Users,
  ArrowRight,
  MapPin,
  Clock
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Awards() {
  const awards = [
    {
      id: 1,
      title: "Solar Power World Top Contractor 2024",
      organization: "Solar Power World Magazine",
      year: "2024",
      category: "Installation Excellence",
      description: "Recognized among the top 500 solar contractors nationwide for outstanding installation quality and customer service.",
      icon: Trophy,
      featured: true
    },
    {
      id: 2,
      title: "Best Commercial Solar Installer",
      organization: "Texas Clean Energy Association",
      year: "2023",
      category: "Commercial Excellence",
      description: "Awarded for exceptional commercial solar installations and innovative energy solutions across Texas.",
      icon: Award,
      featured: true
    },
    {
      id: 3,
      title: "Customer Choice Award",
      organization: "Better Business Bureau",
      year: "2024",
      category: "Customer Service",
      description: "Recognized for maintaining A+ BBB rating and exceptional customer satisfaction scores.",
      icon: Star,
      featured: true
    },
    {
      id: 4,
      title: "Green Business Certification",
      organization: "EPA Green Power Partnership",
      year: "2023",
      category: "Environmental Leadership",
      description: "Certified for promoting renewable energy and sustainable business practices.",
      icon: Award,
      featured: false
    },
    {
      id: 5,
      title: "Fastest Growing Solar Company",
      organization: "Austin Business Journal",
      year: "2022",
      category: "Business Growth",
      description: "Listed among the fastest-growing solar companies in Central Texas.",
      icon: Trophy,
      featured: false
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Texas Solar Summit 2024",
      date: "March 15-17, 2024",
      location: "Austin Convention Center",
      type: "Conference",
      description: "Join us at the state's largest solar energy conference. We'll be showcasing our latest innovations.",
      status: "Speaking"
    },
    {
      id: 2,
      title: "Home & Garden Show",
      date: "April 8-10, 2024",
      location: "Dallas Market Hall",
      type: "Trade Show",
      description: "Visit our booth to learn about residential solar solutions and meet our expert team.",
      status: "Exhibiting"
    },
    {
      id: 3,
      title: "Clean Energy Business Forum",
      date: "May 22, 2024",
      location: "Houston Energy Center",
      type: "Business Forum",
      description: "Panel discussion on the future of commercial solar energy in Texas.",
      status: "Panelist"
    }
  ];

  const recentEvents = [
    {
      id: 1,
      title: "Solar Installation Workshop",
      date: "February 12, 2024",
      location: "Solar Hut Solutions HQ",
      type: "Educational",
      description: "Hosted free educational workshop for homeowners interested in solar energy.",
      attendees: "85+ participants"
    },
    {
      id: 2,
      title: "Community Solar Fair",
      date: "January 20, 2024",
      location: "Austin City Park",
      type: "Community",
      description: "Participated in community sustainability fair, promoting clean energy adoption.",
      attendees: "500+ visitors"
    }
  ];

  const certifications = [
    { name: "NABCEP Certified", logo: "🏆" },
    { name: "Tesla Powerwall Certified", logo: "⚡" },
    { name: "SunPower Authorized", logo: "☀️" },
    { name: "Enphase Partner", logo: "🔋" },
    { name: "BBB A+ Rating", logo: "⭐" },
    { name: "Licensed & Insured", logo: "🛡️" }
  ];

  return (
    <section id="awards" className="section-alternate-2 section-padding">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            Recognition & Events
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Awards, Recognition & Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our commitment to excellence has been recognized by industry leaders and customers alike. 
            Join us at upcoming events and learn about our achievements in solar energy.
          </p>
        </div>

        {/* Awards Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Industry Recognition</h3>
          
          {/* Featured Awards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {awards.filter(award => award.featured).map((award) => (
              <Card key={award.id} className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-yellow-50 hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-bl-full"></div>
                <award.icon className="absolute top-4 right-4 w-6 h-6 text-white" />
                
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <award.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{award.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{award.organization}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <Badge variant="outline" className="text-orange-600 border-orange-200 mb-2">
                      {award.category}
                    </Badge>
                    <div className="text-2xl font-bold text-gray-900">{award.year}</div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{award.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Awards */}
          <div className="grid md:grid-cols-2 gap-6">
            {awards.filter(award => !award.featured).map((award) => (
              <Card key={award.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <award.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{award.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{award.organization} • {award.year}</p>
                      <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs mb-2">
                        {award.category}
                      </Badge>
                      <p className="text-sm text-gray-700">{award.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professional Certifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{cert.logo}</div>
                  <div className="text-sm font-medium text-gray-900">{cert.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

       
        {/* <div className="grid lg:grid-cols-2 gap-12">
        
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Upcoming Events</h3>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        event.status === 'Speaking' ? 'bg-orange-100 text-orange-800' :
                        event.status === 'Exhibiting' ? 'bg-amber-100 text-amber-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-orange-50">
                      Learn More
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Events</h3>
            <div className="space-y-6">
              {recentEvents.map((event) => (
                <Card key={event.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees}
                      </div>
                    </div>
                    <p className="text-gray-700">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
              
              
              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Stay Updated</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get notified about upcoming events, workshops, and community initiatives.
                  </p>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-orange-600 hover:to-orange-700 text-white">
                    Subscribe to Updates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}