import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Clock, Shield } from 'lucide-react';
import SystemDiagnosticsModal from '../components/SystemDiagnosticsModal';

const Home = () => {
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const features = [
    {
      icon: CheckCircle,
      title: 'Automated Diagnostics',
      description: 'Advanced system scanning to identify plugin conflicts and performance issues instantly.'
    },
    {
      icon: Shield,
      title: 'Expert Support',
      description: '24/7 access to certified video editing professionals with years of experience.'
    },
    {
      icon: Clock,
      title: 'Fast Resolution',
      description: 'Most issues resolved within minutes, not hours. Get back to creating quickly.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Learn from thousands of video editors who have solved similar problems.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Professional Video Editor',
      content: 'VideoFix Pro saved me hours of troubleshooting. The diagnostic tool found my plugin conflict in seconds!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'YouTube Creator',
      content: 'Finally, a service that understands video editor problems. The support team is incredibly knowledgeable.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Film Production House',
      content: 'We use VideoFix Pro for our entire team. It\'s prevented countless hours of downtime.',
      rating: 5
    }
  ];

  const stats = [
    { number: '50K+', label: 'Issues Resolved' },
    { number: '98%', label: 'Success Rate' },
    { number: '5 min', label: 'Avg Resolution Time' },
    { number: '24/7', label: 'Expert Support' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Fix Your Video Editor
              <span className="text-blue-400"> Plugin Issues</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional diagnostics and expert support for video editing software. 
              Resolve crashes, conflicts, and performance issues in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsDiagnosticsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Start Free Diagnosis
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link
                to="/services"
                className="border-2 border-blue-400 hover:bg-blue-400 hover:text-blue-900 text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VideoFix Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools and expert support designed specifically for video editors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of video professionals worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Fix Your Video Editor Issues?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of video professionals who trust VideoFix Pro for reliable solutions
          </p>
          <button
            onClick={() => setIsDiagnosticsOpen(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
          >
            Start Your Free Diagnosis
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* System Diagnostics Modal */}
      <SystemDiagnosticsModal 
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </div>
  );
};

export default Home;