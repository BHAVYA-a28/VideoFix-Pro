import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  ArrowRight,
  Zap,
  Globe,
  Star,
  Award,
  RefreshCw
} from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free Edition',
    price: '$0',
    duration: 'forever',
    features: [
      'Basic system diagnostics',
      'Community software catalog',
      'Standard download speeds',
      'Local plugin tracking',
      '720p Render Queue limits'
    ],
    highlight: false,
    cta: 'Current Plan',
    disabled: true
  },
  {
    id: 'pro-monthly',
    name: 'Pro Professional',
    price: '$19.99',
    duration: '/ month',
    features: [
      'Deep system telemetry history',
      'Priority multi-threaded downloads',
      'Pre-beta software access',
      'Automatic plugin updates',
      'Unlimited 8K Render Queue',
      '24/7 Premium technical support'
    ],
    highlight: true,
    cta: 'Upgrade to Pro',
    disabled: false
  },
  {
    id: 'pro-yearly',
    name: 'Pro Enterprise',
    price: '$199',
    duration: '/ year',
    features: [
      'Everything in Pro Monthly',
      'Volume licensing for 5 machines',
      'Custom installation hooks',
      'Cloud render node access',
      'White-label management reports',
      'Lifetime API access keys'
    ],
    highlight: false,
    cta: 'Get Enterprise',
    disabled: false,
    badge: 'SAVE $40'
  }
];

const Payment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handlePlanSelect = (id: string) => {
    if (id === 'free') return;
    setSelectedPlan(id);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment logic
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Activity log
      const activities = JSON.parse(localStorage.getItem('vfp_recent_activities') || '[]');
      const plan = PLANS.find(p => p.id === selectedPlan);
      activities.unshift({
        id: Date.now().toString(),
        type: 'billing',
        title: `Upgraded to ${plan?.name}`,
        description: `Premium features are now active for your account.`,
        timestamp: new Date().toLocaleString(),
        status: 'completed',
        icon: 'credit-card'
      });
      localStorage.setItem('vfp_recent_activities', JSON.stringify(activities.slice(0, 20)));
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-xl w-full text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Welcome to <span className="font-bold text-indigo-600">VideoFix Pro Premium</span>. 
            Your professional toolkit is now fully unlocked and ready for export-ready performance.
          </p>
          <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center"><Award className="w-5 h-5 mr-2" /> What happens next?</h3>
            <ul className="space-y-2 text-indigo-700 text-sm">
              <li className="flex items-center"><Zap className="w-4 h-4 mr-2" /> Dashboard analytics updated with deep telemetry</li>
              <li className="flex items-center"><Zap className="w-4 h-4 mr-2" /> Unlimited render queues activated</li>
              <li className="flex items-center"><Zap className="w-4 h-4 mr-2" /> Professional plugin repository unlocked</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 border-t border-gray-100">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
        <Zap className="w-64 h-64 text-indigo-600" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Elevate Your Production <span className="text-indigo-600">Standard</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Choose the core that powers your workflow. From solo creators to enterprise studios, 
            unlock the full potential of VideoFix Pro diagnostics and management.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => !plan.disabled && handlePlanSelect(plan.id)}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer flex flex-col group ${
                selectedPlan === plan.id 
                  ? 'border-indigo-600 shadow-2xl scale-[1.03] ring-4 ring-indigo-50' 
                  : plan.highlight 
                    ? 'border-indigo-200 shadow-xl hover:shadow-2xl' 
                    : 'border-gray-100 hover:border-indigo-100'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 font-medium">{plan.duration}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                      <Check className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                disabled={plan.disabled}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                  plan.disabled 
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : selectedPlan === plan.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                <span>{selectedPlan === plan.id ? 'Selection Active' : plan.cta}</span>
                {!plan.disabled && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Section */}
        {selectedPlan && (
          <div id="checkout-form" className="max-w-4xl mx-auto scroll-mt-24">
            <div className="bg-white rounded-4xl shadow-3xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
              {/* Left: Summary */}
              <div className="md:w-5/12 bg-gray-900 p-10 text-white">
                <div className="flex items-center space-x-3 mb-10">
                  <ShieldCheck className="w-8 h-8 text-indigo-400" />
                  <span className="text-xl font-black tracking-tight">Checkout</span>
                </div>
                
                <div className="mb-12">
                  <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-2">Order Summary</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">{PLANS.find(p => p.id === selectedPlan)?.name}</span>
                    <span className="text-lg font-black">{PLANS.find(p => p.id === selectedPlan)?.price}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Full access to professional toolkit and priority updates.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-300">Bank-Grade Encryption</p>
                      <p className="text-[10px] text-gray-500">256-bit SSL Secure Payment</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl">
                    <Star className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-300">Certified Professional</p>
                      <p className="text-[10px] text-gray-500">Official VFP Licensing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Payment Form */}
              <div className="md:w-7/12 p-10 bg-white">
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Cardholder Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. John Wick" 
                      value={formData.cardName}
                      onChange={e => setFormData(p => ({ ...p, cardName: e.target.value }))}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        required
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        value={formData.cardNumber}
                        onChange={e => setFormData(p => ({ ...p, cardNumber: e.target.value }))}
                        className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Expiry Date</label>
                      <input 
                        required
                        type="text" 
                        placeholder="MM / YY" 
                        value={formData.expiry}
                        onChange={e => setFormData(p => ({ ...p, expiry: e.target.value }))}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">CVC / CVV</label>
                      <input 
                        required
                        type="text" 
                        placeholder="•••" 
                        value={formData.cvc}
                        onChange={e => setFormData(p => ({ ...p, cvc: e.target.value }))}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={isProcessing}
                      className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-75 disabled:cursor-wait"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Verifying with Global Gateway...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          <span>Complete Secured Payment</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4 flex items-center justify-center">
                      <Globe className="w-3 h-3 mr-1" /> All transactions are encrypted and processed via AWS-SecDirect.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12 text-gray-400 text-sm flex items-center justify-center space-x-4">
          <span>Trusted by 10,000+ Studios</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>No hidden fees</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;