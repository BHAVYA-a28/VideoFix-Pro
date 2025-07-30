import React, { useState } from 'react';
import { Mail, Phone, Clock, Send, MessageSquare, Video, Users } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you within 4 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      priority: 'medium',
      message: ''
    });
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available 24/7',
      action: 'Start Chat',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      value: 'support@videofixpro.com',
      action: 'Send Email',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with an expert',
      value: '+1 (555) 123-4567',
      action: 'Call Now',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Video,
      title: 'Screen Share',
      description: 'Remote assistance session',
      value: 'Schedule a session',
      action: 'Book Now',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const supportHours = [
    { day: 'Monday - Friday', hours: '24/7 Support' },
    { day: 'Saturday - Sunday', hours: '24/7 Support' },
    { day: 'Holidays', hours: '24/7 Support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Expert Help
          </h1>
          <p className="text-xl text-blue-100">
            Our team of video editing professionals is here to help you resolve any issues quickly and efficiently.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low - General question</option>
                      <option value="medium">Medium - Need assistance</option>
                      <option value="high">High - Blocking my work</option>
                      <option value="urgent">Urgent - Production down</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please describe your issue in detail, including your video editing software, version, and what you were doing when the problem occurred..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">How to Reach Us</h3>
              
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.color}`}>
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{method.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                      <p className="text-sm font-medium text-gray-900">{method.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Support Hours
              </h3>
              
              <div className="space-y-3">
                {supportHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{schedule.day}</span>
                    <span className="font-medium text-gray-900">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>24/7 Support:</strong> Our team is always available to help you resolve critical issues.
                </p>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Response Time Guarantee</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Free Plan</span>
                  <span className="font-semibold">48 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Professional</span>
                  <span className="font-semibold">4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Enterprise</span>
                  <span className="font-semibold">1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Quick Access */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Answers to Common Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Account & Billing</h4>
              <p className="text-sm text-gray-600">Questions about your subscription, billing, or account management.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Technical Support</h4>
              <p className="text-sm text-gray-600">Help with software issues, plugin conflicts, and system problems.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Training & Setup</h4>
              <p className="text-sm text-gray-600">Guidance on best practices, setup optimization, and workflow improvements.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;