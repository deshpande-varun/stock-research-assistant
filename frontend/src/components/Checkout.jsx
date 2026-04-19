import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const { tier } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const prices = {
    premium: { amount: 9.99, priceId: 'price_premium_monthly' },
    pro: { amount: 29.99, priceId: 'price_pro_monthly' },
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!prices[tier]) {
      navigate('/pricing');
      return;
    }

    const createCheckoutSession = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: prices[tier].priceId,
            userId: user.uid,
            userEmail: user.email,
            tier: tier,
          }),
        });

        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          setError(error.message);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to create checkout session');
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [tier, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 max-w-md w-full text-center"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <Loader size={48} className="text-blue-500" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Setting up your subscription</h2>
            <p className="text-gray-400">Redirecting to secure checkout...</p>
          </>
        ) : error ? (
          <>
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-red-400">Payment Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Back to Pricing
            </button>
          </>
        ) : (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-gray-400">Your subscription has been activated</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
