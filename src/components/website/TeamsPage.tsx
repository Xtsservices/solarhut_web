import React from 'react';
import { Mail, Phone, Linkedin, Award, Users, Target, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import kishoreImg from '../../../src/assets/kishorekodali.png'
import sampathImg from '../../../src/assets/sampathkumar.png';
import SubbuImg from '../../../src/assets/SubbuMetadev.png';
import DevunipallyPhaniImg from '../../../src/assets/DevunipallyPhani.jpeg';
import GowthamRajuImg from '../../../src/assets/GowthamRaju.jpeg';
import SiramVenkataGowthamImg from '../../../src/assets/SiramVenkataGowtham.jpeg';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  specialties: string[];
  experience: string;
  achievements?: string[];
}

const TeamsPage: React.FC = () => {
  // Directors and Leadership Team
  const directors: TeamMember[] = [
    {
      id: 'dir-1',
      name: 'KISHORE KODALI',
      role: 'Managing Partner & Head IT & Marketing',
      department: 'Leadership',
      image: kishoreImg, 
      bio: 'With over 15 years of experience in renewable energy sector, Rajesh leads Solar Hut Solutions with a vision to make solar energy accessible to every household and business in India.',
      email: 'rajesh@solarhut.com',
      phone: '+91 98765 43210',
      linkedin: 'https://linkedin.com/in/rajeshkumar',
      specialties: ['Strategic Planning', 'Business Development', 'Renewable Energy'],
      experience: '15+ Years',
      achievements: [
        'Led 500+ successful solar installations',
        'Green Energy Leadership Award 2023',
        'Sustainable Business Excellence Award'
      ]
    },
    {
      id: 'dir-2',
      name: 'SAMPATH KUMAR GRANDHI',
      role: 'Managing Partner & CFO',
      department: 'Leadership',
      image: sampathImg,
      bio: 'Priya oversees all operational aspects of Solar Hut Solutions, ensuring quality delivery and customer satisfaction across all projects.',
      email: 'priya@solarhut.com',
      phone: '+91 98765 43211',
      linkedin: 'https://linkedin.com/in/priyasharma',
      specialties: ['Operations Management', 'Quality Assurance', 'Project Management'],
      experience: '12+ Years',
      achievements: [
        '99.8% customer satisfaction rate',
        'Operational Excellence Award',
        'ISO 9001 implementation leader'
      ]
    },
    {
      id: 'dir-3',
      name: 'SUBBU',
      role: 'Managing Director',
      department: 'Leadership',
      image: SubbuImg,
      bio: 'Amit brings deep technical expertise in solar technology and engineering, driving innovation and technical excellence in all our solutions.',
      email: 'amit@solarhut.com',
      phone: '+91 98765 43212',
      linkedin: 'https://linkedin.com/in/amitpatel',
      specialties: ['Solar Engineering', 'Technical Innovation', 'System Design'],
      experience: '18+ Years',
      achievements: [
        'Solar Technology Innovation Award',
        '25+ patents in solar technology',
        'Technical Excellence in Renewable Energy'
      ]
    }
  ];

  // Department Teams
  const teamMembers: TeamMember[] = [
    // Sales Team
    {
        id: 'sales-1',
        name: 'DEVUNIPALLY PHANI',
        role: 'Managing Partner and Ap state head ',
        department: 'Sales',
        image: DevunipallyPhaniImg,
        bio: 'Arjun drives our sales strategy with a focus on sustainable energy solutions and customer satisfaction.',
        email: 'arjun@solarhut.com',
        specialties: ['Sales Leadership', 'Market Strategy', 'Client Relations'],
        experience: '12+ Years'
    },
    {
        id: 'sales-2',
        name: 'Gowtham raju Suklaboina',
        role: 'Ap Marketing',
        department: 'Sales',
        image: GowthamRajuImg,
        bio: 'Deepika specializes in large-scale commercial solar projects and enterprise solutions.',
        specialties: ['Enterprise Sales', 'Commercial Projects', 'Business Development'],
        experience: '9+ Years'
    },
    {
        id: 'sales-3',
        name: 'Siram Venkata Gowtham',
        role: 'Manager operations',
        department: 'Sales',
        image: SiramVenkataGowthamImg,
        bio: 'Karan helps families transition to solar energy with personalized consultation and support.',
        specialties: ['Residential Solar', 'Home Consultation', 'Energy Planning'],
        experience: '6+ Years'
    },

    // === TECHNICAL TEAM COMMENTED OUT ===
    /*
    {
        id: 'tech-1',
        name: 'Dr. Sanjay Rao',
        role: 'Chief Technology Officer',
        department: 'Technical',
        image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=250&h=250&fit=crop&crop=face',
        bio: 'Dr. Rao leads innovation in solar technology and oversees all technical operations.',
        specialties: ['Solar Innovation', 'R&D Leadership', 'System Optimization'],
        experience: '15+ Years'
    },
    {
        id: 'tech-2',
        name: 'Pooja Desai',
        role: 'Senior Design Engineer',
        department: 'Technical',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=250&h=250&fit=crop&crop=face',
        bio: 'Pooja creates custom solar solutions tailored to each client\'s specific energy needs.',
        specialties: ['System Design', 'Energy Modeling', 'Technical Planning'],
        experience: '8+ Years'
    },
    {
        id: 'tech-3',
        name: 'Abhishek Gupta',
        role: 'Field Operations Manager',
        department: 'Technical',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&h=250&fit=crop&crop=face',
        bio: 'Abhishek coordinates field operations and ensures seamless project execution.',
        specialties: ['Field Operations', 'Project Coordination', 'Quality Assurance'],
        experience: '11+ Years'
    },
    */

    // === CUSTOMER SUPPORT TEAM COMMENTED OUT ===
    /*
    {
        id: 'cs-1',
        name: 'Shreya Iyer',
        role: 'Customer Experience Director',
        department: 'Customer Support',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&fit=crop&crop=face',
        bio: 'Shreya leads our customer experience initiatives ensuring exceptional service delivery.',
        specialties: ['Customer Experience', 'Service Excellence', 'Support Strategy'],
        experience: '10+ Years'
    },
    {
        id: 'cs-2',
        name: 'Rajiv Khanna',
        role: 'After-Sales Support Manager',
        department: 'Customer Support',
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=250&h=250&fit=crop&crop=face',
        bio: 'Rajiv manages post-installation support and maintenance services for optimal system performance.',
        specialties: ['After-Sales Support', 'Maintenance Planning', 'Customer Care'],
        experience: '7+ Years'
    },
    {
        id: 'cs-3',
        name: 'Meera Jain',
        role: 'Technical Help Desk Lead',
        department: 'Customer Support',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=250&h=250&fit=crop&crop=face',
        bio: 'Meera provides expert technical assistance and resolves system-related queries.',
        specialties: ['Technical Assistance', 'System Diagnostics', 'Customer Solutions'],
        experience: '6+ Years'
    }
    */
  ];

  // Only show Sales department
  const departments = ['Sales'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-color-black">
            Meet Our Team
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
            Dedicated professionals driving the solar revolution in India
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold">50+ Professionals</h3>
              <p className="text-blue-100">Experienced team members</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold">Industry Leaders</h3>
              <p className="text-blue-100">Award-winning expertise</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 rounded-full p-4 mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold">Customer Focused</h3>
              <p className="text-blue-100">99.8% satisfaction rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Leadership Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visionary leaders driving innovation and excellence in solar energy solutions
            firing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directors.map((director) => (
              <Card key={director.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={director.image}
                    alt={director.name}
                    className="w-full h-80 object-cover "
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{director.name}</h3>
                    <p className="text-blue-200">{director.role}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{director.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {director.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {director.achievements && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-orange-500" />
                        Key Achievements
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {director.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t">
                    {director.email && (
                      <a
                        href={`mailto:${director.email}`}
                        className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                        title={`Email ${director.name}`}
                      >
                        <Mail className="h-4 w-4 text-blue-600" />
                      </a>
                    )}
                    {director.phone && (
                      <a
                        href={`tel:${director.phone}`}
                        className="flex items-center justify-center w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                        title={`Call ${director.name}`}
                      >
                        <Phone className="h-4 w-4 text-green-600" />
                      </a>
                    )}
                    {director.linkedin && (
                      <a
                        href={director.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                        title={`LinkedIn profile of ${director.name}`}
                      >
                        <Linkedin className="h-4 w-4 text-blue-600" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Department Teams Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Departments
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized teams working together to deliver exceptional solar solutions
            </p>
          </div>

          {departments.map((department) => {
            const deptMembers = teamMembers.filter(member => member.department === department);
            const deptColors = {
              'Sales': 'bg-green-100 text-green-800',
              // 'Technical': 'bg-blue-100 text-blue-800',      // Commented
              // 'Customer Support': 'bg-purple-100 text-purple-800' // Commented
            };
            
            return (
              <div key={department} className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`px-4 py-2 rounded-full ${deptColors[department as keyof typeof deptColors]}`}>
                    <h3 className="text-2xl font-bold">{department} Team</h3>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deptMembers.map((member) => (
                    <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>

                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h5>
                          <div className="flex flex-wrap gap-1">
                            {member.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {member.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${member.email}`} className="hover:text-blue-600">
                              {member.email}
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add team member CTA for each department */}
                <div className="mt-6 text-center">
                  <Card className="inline-block p-4 border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Join Our {department} Team</h4>
                        <p className="text-sm text-gray-600">We're always looking for talented professionals</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Company Values Section */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-orange-600 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Values</h2>
            <p className="text-xl max-w-2xl mx-auto">
              The principles that guide our team and drive our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-blue-100 leading-relaxed">
                Continuously pushing boundaries in solar technology to deliver cutting-edge solutions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
              <p className="text-blue-100 leading-relaxed">
                Working together as one team to achieve exceptional results for our customers
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-blue-100 leading-relaxed">
                Commitment to quality and excellence in every project we undertake
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Our Team CTA */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Join Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Be part of India's renewable energy revolution. We're always looking for passionate individuals 
            who want to make a difference in the world of clean energy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 hover:bg-orange-700 text-black px-8 py-3 rounded-lg font-semibold transition-colors">
              View Open Positions
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact HR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;