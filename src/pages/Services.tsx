import React, { useState } from 'react';
import { Check, Zap, Shield, Users, Clock, ArrowRight, Star, Phone, CheckCircle, CreditCard, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createUPIQRCode } from '../utils/qrCodeData';
import { 
  initializePayment, 
  generateOrderId, 
  formatAmount, 
  verifyPayment,
  type PaymentDetails,
  type RazorpayResponse 
} from '../services/razorpay';
import PaymentStatus from '../components/PaymentStatus';

const Services = () => {
  // const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'support', message: 'Hello! How can we help you today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showUPIQR, setShowUPIQR] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentService, setPaymentService] = useState<string>('');
  const [selectedUPIApp, setSelectedUPIApp] = useState<string>('paytm');
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending' | 'processing' | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId?: string;
    orderId?: string;
    amount?: number;
  }>({});

  const plans = [
    {
      id: 'basic',
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
      color: 'border-gray-200',
      bgColor: 'bg-gray-50',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      id: 'professional',
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
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'enterprise',
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
      color: 'border-purple-500',
      bgColor: 'bg-purple-50',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const services = [
    {
      icon: Zap,
      title: 'Instant Diagnostics',
      description: 'Automated system scanning identifies issues in seconds, not hours.',
      color: 'text-yellow-600 bg-yellow-100',
      price: '$49',
      duration: '15 min'
    },
    {
      icon: Shield,
      title: 'System Protection',
      description: 'Proactive monitoring prevents crashes before they happen.',
      color: 'text-green-600 bg-green-100',
      price: '$79',
      duration: '30 min'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 access to certified video editing professionals.',
      color: 'text-blue-600 bg-blue-100',
      price: '$129',
      duration: '1 hour'
    },
    {
      icon: Clock,
      title: 'Fast Resolution',
      description: 'Average resolution time under 5 minutes for common issues.',
      color: 'text-purple-600 bg-purple-100',
      price: '$99',
      duration: '45 min'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Video Editor',
      company: 'Creative Studios',
      rating: 5,
      comment: 'VideoFix Pro saved me hours of troubleshooting. The automated diagnostics are incredible!',
      avatar: 'SJ'
    },
    {
      name: 'Mike Chen',
      role: 'Post-Production Lead',
      company: 'Digital Media Co.',
      rating: 5,
      comment: 'The professional plan is worth every penny. Real-time monitoring prevents so many issues.',
      avatar: 'MC'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Freelance Editor',
      company: 'Independent',
      rating: 5,
      comment: 'Finally, a service that understands video editing workflows. Excellent support team!',
      avatar: 'ER'
    }
  ];

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay Gateway',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Secure payment gateway with cards, UPI, net banking',
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: '💳',
      description: 'Pay using UPI apps like Paytm, Google Pay, PhonePe',
      popular: false
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay cards accepted',
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-6 h-6" />,
      description: 'All major banks supported',
      popular: false
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      icon: '📱',
      description: 'Paytm, Google Pay, PhonePe wallets',
      popular: false
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💰',
      description: 'Pay after service completion',
      popular: false
    }
  ];

  const upiDetails = {
    paytm: {
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGF5dG0gUVIgQ29kZTwvdGV4dD4KPHN2Zz4=',
      upiId: 'videofixpro@paytm',
      amount: '₹299',
      service: 'Professional Plan'
    },
    googlepay: {
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R29vZ2xlIFBheSBRUiBDb2RlPC90ZXh0Pgo8c3ZnPg==',
      upiId: 'videofixpro@okicici',
      amount: '₹299',
      service: 'Professional Plan'
    },
    phonepe: {
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvbmVQZSBxciBDb2RlPC90ZXh0Pgo8c3ZnPg==',
      upiId: 'videofixpro@ybl',
      amount: '₹299',
      service: 'Professional Plan'
    }
  };

  const handlePlanSelect = (planId: string) => {
    // setSelectedPlan(planId);
    setPaymentService(planId);
    
    // Set payment amount based on plan
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const amount = plan.price === 'Free' ? 0 : parseInt(plan.price.replace('$', ''));
      setPaymentAmount(amount);
    }
    
    setShowPaymentModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowBookingModal(false);
      setSubmitted(false);
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (methodId === 'upi') {
      setShowUPIQR(true);
    }
  };

  const handleUPIAppSelect = (app: string) => {
    setSelectedUPIApp(app);
  };

  const handlePaymentComplete = async () => {
    if (selectedPaymentMethod === 'razorpay') {
      try {
        const paymentDetails: PaymentDetails = {
          amount: paymentAmount * 75, // Convert USD to INR (approximate)
          currency: 'INR',
          description: paymentService,
          customerName: bookingForm.name || 'Customer',
          customerEmail: bookingForm.email || 'customer@example.com',
          customerPhone: bookingForm.phone,
          orderId: generateOrderId()
        };

        await initializePayment(
          paymentDetails,
          (response: RazorpayResponse) => {
            console.log('Payment successful:', response);
            setPaymentDetails({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: paymentAmount * 75
            });
            setPaymentStatus('success');
            setShowPaymentModal(false);
            setShowUPIQR(false);
            setSelectedPaymentMethod('');
            // Here you would typically update your database with payment success
          },
          (error: any) => {
            console.error('Payment failed:', error);
            setPaymentDetails({
              orderId: paymentDetails.orderId,
              amount: paymentAmount * 75
            });
            setPaymentStatus('failed');
            setShowPaymentModal(false);
            setShowUPIQR(false);
            setSelectedPaymentMethod('');
          },
          () => {
            console.log('Payment modal closed');
            setShowPaymentModal(false);
            setShowUPIQR(false);
            setSelectedPaymentMethod('');
          }
        );
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Error processing payment. Please try again.');
      }
    } else if (selectedPaymentMethod === 'upi') {
      // Handle UPI payment
      alert('UPI payment initiated. Please scan the QR code to complete payment.');
      setShowPaymentModal(false);
      setShowUPIQR(false);
      setSelectedPaymentMethod('');
    } else {
      // Handle other payment methods
      alert('Payment method selected. Redirecting to payment gateway...');
      setShowPaymentModal(false);
      setShowUPIQR(false);
      setSelectedPaymentMethod('');
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: chatInput,
      time: 'Just now'
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simulate support response
    setTimeout(() => {
      const responses = [
        'Thanks for your message! Our team will get back to you shortly.',
        'I understand your concern. Let me connect you with a specialist.',
        'That\'s a great question! Here\'s what we can do to help...',
        'I\'ll forward this to our technical team for immediate assistance.'
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      const supportMessage = {
        id: chatMessages.length + 2,
        sender: 'support',
        message: response,
        time: 'Just now'
      };
      
      setChatMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Consultation
            </button>
            <Link
              to="/plugins"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Try Plugin Manager
            </Link>
          </div>
          
          {/* Service Status */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-100">All Systems Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-100">24/7 Support Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions designed specifically for video editing professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{service.price}</span> • {service.duration}
                  </div>
                  <button
                    onClick={() => {
                      setPaymentAmount(parseInt(service.price.replace('$', '')));
                      setPaymentService(service.title);
                      setShowPaymentModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Buy Now - {service.price}
                  </button>
                </div>
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
                className={`bg-white rounded-2xl shadow-lg border-2 ${plan.color} relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  plan.popular ? 'scale-105 shadow-xl' : ''
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
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonColor} text-white`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600">Join thousands of satisfied video editors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
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
                <button
                  onClick={() => {
                    setPaymentAmount(99);
                    setPaymentService('Enterprise Consultation');
                    setShowPaymentModal(true);
                  }}
                  className="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Schedule Consultation - ₹7,425
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
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

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            {!submitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Book Your Service</h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select
                      required
                      value={bookingForm.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="Instant Diagnostics">Instant Diagnostics</option>
                      <option value="System Protection">System Protection</option>
                      <option value="Expert Support">Expert Support</option>
                      <option value="Fast Resolution">Fast Resolution</option>
                      <option value="Basic Plan">Basic Plan</option>
                      <option value="Professional Plan">Professional Plan</option>
                      <option value="Enterprise Plan">Enterprise Plan</option>
                      <option value="Enterprise Consultation">Enterprise Consultation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea
                      value={bookingForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your specific needs..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Book Service'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your booking. We'll contact you within 24 hours to confirm your appointment.
                </p>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Choose Payment Method</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setShowUPIQR(false);
                  setSelectedPaymentMethod('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {!showUPIQR ? (
              <>
                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                    <p className="text-gray-600">{paymentService}</p>
                    <p className="text-2xl font-bold text-blue-600">₹{paymentAmount * 75}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {typeof method.icon === 'string' ? method.icon : method.icon}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{method.name}</h4>
                            {method.popular && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handlePaymentComplete}
                  disabled={!selectedPaymentMethod}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Proceed to Payment
                </button>
              </>
            ) : (
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">UPI Payment Options</h4>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => handleUPIAppSelect('paytm')}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedUPIApp === 'paytm' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <span className="text-sm font-medium">Paytm</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleUPIAppSelect('googlepay')}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedUPIApp === 'googlepay' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <span className="text-sm font-medium">Google Pay</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleUPIAppSelect('phonepe')}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedUPIApp === 'phonepe' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📱</div>
                      <span className="text-sm font-medium">PhonePe</span>
                    </div>
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">{selectedUPIApp === 'paytm' ? 'Paytm' : selectedUPIApp === 'googlepay' ? 'Google Pay' : 'PhonePe'} QR Code</h5>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200">
                      <img 
                        src={createUPIQRCode(upiDetails[selectedUPIApp as keyof typeof upiDetails]?.upiId || '', paymentAmount * 75)}
                        alt="UPI QR Code" 
                        className="w-44 h-44 object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">UPI ID: {upiDetails[selectedUPIApp as keyof typeof upiDetails]?.upiId}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{paymentAmount * 75}</p>
                  <p className="text-xs text-gray-500 mt-1">Scan with {selectedUPIApp === 'paytm' ? 'Paytm' : selectedUPIApp === 'googlepay' ? 'Google Pay' : 'PhonePe'} app</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUPIQR(false)}
                    className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePaymentComplete}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Payment Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Chat Widget */}
      <div className="fixed bottom-4 right-4 z-40">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Phone className="h-6 w-6" />
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold">Live Support</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleChatSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Payment Status Modal */}
      {paymentStatus && (
        <PaymentStatus
          status={paymentStatus}
          paymentId={paymentDetails.paymentId}
          orderId={paymentDetails.orderId}
          amount={paymentDetails.amount}
          onClose={() => {
            setPaymentStatus(null);
            setPaymentDetails({});
          }}
          onRetry={() => {
            setPaymentStatus(null);
            setPaymentDetails({});
            setShowPaymentModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Services;