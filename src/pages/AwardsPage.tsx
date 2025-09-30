import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Award, 
  Trophy, 
  Medal, 
  Star,
  Calendar,
  Users,
  Zap,
  Leaf
} from "lucide-react";

export function AwardsPage() {
  const awards = [
    {
      id: 1,
      title: "Best Solar Company of the Year 2024",
      organization: "Solar Power India Awards",
      year: "2024",
      category: "Excellence in Solar Energy",
      description: "Recognized for outstanding contribution to solar energy adoption in India with innovative solutions and exceptional customer service.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeXxlbnwxfHx8fDE3NTkwMzkyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Trophy
    },
    {
      id: 2,
      title: "Innovation Excellence Award",
      organization: "Renewable Energy Council",
      year: "2024",
      category: "Technology Innovation",
      description: "Awarded for pioneering advanced solar monitoring systems and smart grid integration technologies.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeXxlbnwxfHx8fDE3NTkwMzkyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Star
    },
    {
      id: 3,
      title: "Customer Choice Award",
      organization: "Indian Solar Association",
      year: "2023",
      category: "Customer Satisfaction",
      description: "Voted by customers as the most trusted solar company with highest satisfaction ratings in residential solar segment.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeXxlbnwxfHx8fDE3NTkwMzkyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Users
    },
    {
      id: 4,
      title: "Green Energy Champion",
      organization: "Ministry of New & Renewable Energy",
      year: "2023",
      category: "Environmental Impact",
      description: "Recognized for significant contribution to carbon emission reduction and promoting clean energy adoption across India.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeXxlbnwxfHx8fDE3NTkwMzkyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Leaf
    },
    {
      id: 5,
      title: "Quality Excellence Award",
      organization: "Solar Manufacturing Association",
      year: "2023",
      category: "Installation Quality",
      description: "Honored for maintaining highest standards in solar installation quality and post-installation support services.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeXxlbnwxfHx8fDE3NTkwMzkyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Medal
    },
    {
      id: 6,
      title: "Fastest Growing Solar Company",
      organization: "Clean Energy Business Awards",
      year: "2022",
      category: "Business Excellence",
      description: "Achieved record growth in solar installations with over 200% year-on-year growth in system deployments.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHRyb3BoeXxlbnwxfHx8fDE3NTkwMzkyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Zap
    }
  ];

  const certifications = [
    {
      name: "ISO 9001:2015",
      description: "Quality Management System",
      validUntil: "2026"
    },
    {
      name: "ISO 14001:2015",
      description: "Environmental Management System",
      validUntil: "2026"
    },
    {
      name: "MNRE Approved",
      description: "Ministry of New & Renewable Energy",
      validUntil: "Ongoing"
    },
    {
      name: "ALMM Listed",
      description: "Approved List of Models & Manufacturers",
      validUntil: "2025"
    },
    {
      name: "IEC 61215",
      description: "Crystalline Silicon PV Module Certification",
      validUntil: "2025"
    },
    {
      name: "IEC 61730",
      description: "Safety Qualification Requirements",
      validUntil: "2025"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Solar Energy India 2024",
      type: "Trade Show",
      date: "March 15-17, 2024",
      location: "New Delhi",
      description: "Showcased latest solar innovations and participated as a key exhibitor in India's largest solar trade fair.",
      achievements: ["Launched new monitoring app", "Signed 50+ new partnerships", "Generated 1000+ leads"]
    },
    {
      id: 2,
      title: "REI Expo 2024",
      type: "Exhibition",
      date: "February 28 - March 2, 2024",
      location: "Greater Noida",
      description: "Presented cutting-edge solar technologies and demonstrated smart grid integration solutions.",
      achievements: ["Technology innovation award", "Best booth design", "Media recognition"]
    },
    {
      id: 3,
      title: "Clean Energy Summit 2023",
      type: "Conference",
      date: "November 10-12, 2023",
      location: "Mumbai",
      description: "Participated as keynote speaker on 'Future of Solar Energy in India' and shared industry insights.",
      achievements: ["Keynote presentation", "Panel discussion", "Networking success"]
    },
    {
      id: 4,
      title: "Solar Rooftop Conference 2023",
      type: "Seminar",
      date: "September 20-21, 2023",
      location: "Bangalore",
      description: "Conducted technical sessions on residential solar solutions and shared best practices with industry peers.",
      achievements: ["Technical presentations", "Customer testimonials", "Industry networking"]
    }
  ];

  const achievements = [
    { label: "Awards Won", value: "15+", icon: Trophy },
    { label: "Certifications", value: "10+", icon: Medal },
    { label: "Events Participated", value: "50+", icon: Calendar },
    { label: "Industry Recognition", value: "25+", icon: Star }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
     <section className="relative bg-gradient-to-br from-[#ffa500] to-[#FFa500] text-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Awards & Recognition
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Celebrating excellence in solar energy innovation, customer service, 
              and sustainable business practices recognized by industry leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Achievement Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#FFA500]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.value}</div>
                    <div className="text-lg text-gray-600">{achievement.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Major Awards & Honors</h2>
            <p className="text-xl text-gray-600">
              Recognition for excellence and innovation in the solar energy industry
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {awards.map((award) => {
              const IconComponent = award.icon;
              return (
                <Card key={award.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={award.image}
                      alt={award.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 text-yellow-900 border-0">
                        {award.year}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{award.title}</CardTitle>
                    <div className="text-sm text-gray-600">{award.organization}</div>
                    <Badge variant="outline" className="w-fit border-orange-200 text-orange-700">
                      {award.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{award.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Standards</h2>
            <p className="text-xl text-gray-600">
              Maintaining highest quality standards through certified processes and compliance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-[#FFA500]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cert.name}</h3>
                  <p className="text-gray-600 mb-2">{cert.description}</p>
                  <Badge variant="outline" className="border-orange-200 text-orange-700">
                    Valid until {cert.validUntil}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry Events & Participation</h2>
            <p className="text-xl text-gray-600">
              Active participation in solar industry events and knowledge sharing
            </p>
          </div>
          <div className="space-y-8">
            {events.map((event) => (
              <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-[#FFA500]" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <Badge variant="outline">{event.type}</Badge>
                            <span>{event.date}</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {event.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Experience Award-Winning Service</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who have chosen our award-winning solar solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge className="bg-yellow-500 text-yellow-900 px-6 py-2 text-lg border-0 mx-auto sm:mx-0">
              ⭐ 4.9/5 Customer Rating
            </Badge>
            <Badge className="bg-white text-[#FFA500] px-6 py-2 text-lg border-0 mx-auto sm:mx-0">
              🏆 15+ Industry Awards
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}