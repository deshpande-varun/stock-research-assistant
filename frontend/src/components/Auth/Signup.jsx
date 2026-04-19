import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Chrome, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      navigate('/');
    } catch (error) {
      setError('Failed to create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <TrendingUp size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              StockPulse
            </h1>
          </div>
          <p className="text-gray-400">Create your account to get started</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-750 text-white font-semibold py-3 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
