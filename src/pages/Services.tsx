import React from 'react';
import { Check, Zap, Shield, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for individual creators getting started',
      features: [
        'Basic system diagnostics',
        'Automated plugin conflict detection',
        'Community forum access',
        'Basic troubleshooting guides',
        'Email support (48hr response)'
      ],
      cta: 'Start Free',
      popular: false,
      color: 'border-gray-200'
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for working professionals and content creators',
      features: [
        'Advanced system diagnostics',
        'Real-time plugin monitoring',
        'Priority support (4hr response)',
        'Custom optimization profiles',
        'Performance analytics',
        'Remote desktop assistance',
        'Plugin update notifications'
      ],
      cta: 'Start Trial',
      popular: true,
      color: 'border-blue-500'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'Complete solution for studios and large teams',
      features: [
        'Everything in Professional',
        'Team management dashboard',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support',
        'On-site troubleshooting',
        'System deployment assistance',
        'Bulk license management'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-purple-500'
    }
  ];

  const services = [
    {
      icon: Zap,
      title: 'Instant Diagnostics',
      description: 'Automated system scanning identifies issues in seconds, not hours.',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: Shield,
      title: 'System Protection',
      description: 'Proactive monitoring prevents crashes before they happen.',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 access to certified video editing professionals.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Clock,
      title: 'Fast Resolution',
      description: 'Average resolution time under 5 minutes for common issues.',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Video Editor Support Services
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Choose the perfect plan for your needs. From individual creators to enterprise studios.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions designed specifically for video editing professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-600">
              Flexible pricing options to match your workflow and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg border-2 ${plan.color} relative overflow-hidden ${
                  plan.popular ? 'scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Enterprise Solutions</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Custom solutions for large studios, production houses, and organizations with complex workflows.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>Dedicated infrastructure and support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>Custom integrations with your existing tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-400" />
                    <span>On-premises deployment options available</span>
                  </li>
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <Link
                  to="/contact"
                  className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What video editing software do you support?</h3>
              <p className="text-gray-600">
                We support all major video editing platforms including Adobe Premiere Pro, After Effects, DaVinci Resolve, 
                Final Cut Pro, Avid Media Composer, and more.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">How quickly can you resolve issues?</h3>
              <p className="text-gray-600">
                Most common issues are resolved within 5-15 minutes. Complex problems may take longer, 
                but our average resolution time is under 30 minutes.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee for all paid plans. 
                If you're not satisfied, we'll provide a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;