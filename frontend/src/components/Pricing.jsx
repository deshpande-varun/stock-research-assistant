import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const tiers = [
    {
      name: 'Free',
      price: 0,
      icon: Sparkles,
      gradient: 'from-gray-600 to-gray-700',
      features: [
        '5 watchlist stocks',
        'Basic stock data',
        'Daily news updates',
        'Community support',
      ],
      tier: 'free'
    },
    {
      name: 'Premium',
      price: 9.99,
      icon: Zap,
      gradient: 'from-blue-600 to-purple-600',
      features: [
        '25 watchlist stocks',
        'Real-time stock data',
        'Advanced technical indicators',
        'Unlimited news access',
        'Email alerts',
        'Priority support',
      ],
      popular: true,
      tier: 'premium'
    },
    {
      name: 'Pro',
      price: 29.99,
      icon: Crown,
      gradient: 'from-purple-600 to-pink-600',
      features: [
        'Unlimited watchlist stocks',
        'Real-time stock data',
        'Advanced technical indicators',
        'Unlimited news access',
        'Custom price alerts',
        'AI-powered insights',
        'Portfolio analytics',
        'API access',
        'Dedicated support',
      ],
      tier: 'pro'
    },
  ];

  const handleSubscribe = (tier) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (tier === 'free') return;
    navigate(`/checkout/${tier}`);
  };

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Unlock premium features and take your trading to the next level
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            const isCurrentTier = userData?.subscriptionTier === tier.tier;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.popular ? 'md:scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className={`h-full bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl border ${
                  tier.popular ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20' : 'border-gray-800/50'
                } p-6 lg:p-8`}>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${tier.gradient} mb-4`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check size={20} className={`flex-shrink-0 mt-0.5 text-green-400`} />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(tier.tier)}
                    disabled={isCurrentTier}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isCurrentTier
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : tier.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    }`}
                  >
                    {isCurrentTier ? 'Current Plan' : tier.tier === 'free' ? 'Get Started' : 'Upgrade Now'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>All plans include a 14-day money-back guarantee</p>
          <p className="mt-2">Cancel anytime, no questions asked</p>
        </div>
      </div>
    </main>
  );
}
