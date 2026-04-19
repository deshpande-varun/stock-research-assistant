import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import MarketsView from './components/MarketsView'
import WatchlistView from './components/WatchlistView'
import NewsView from './components/NewsView'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Pricing from './components/Pricing'
import Checkout from './components/Checkout'
import './App.css'

const DEFAULT_WATCHLIST = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL'];

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function MainApp() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, userData } = useAuth();

  useEffect(() => {
    if (userData?.watchlists?.length > 0) {
      setWatchlist(userData.watchlists);
    }
  }, [userData]);

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol.toUpperCase())) {
      setWatchlist([...watchlist, symbol.toUpperCase()]);
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  const renderView = () => {
    switch (currentView) {
      case 'markets':
        return <MarketsView onSelectStock={(symbol) => {
          setSelectedStock(symbol);
          handleAddToWatchlist(symbol);
          setCurrentView('dashboard');
        }} />;
      case 'watchlist':
        return <WatchlistView
          watchlist={watchlist}
          onSelectStock={(symbol) => {
            setSelectedStock(symbol);
            setCurrentView('dashboard');
          }}
          onRemoveStock={removeFromWatchlist}
        />;
      case 'news':
        return <NewsView />;
      case 'pricing':
        return <Pricing />;
      default:
        return <Dashboard
          symbol={selectedStock}
          onAddToWatchlist={handleAddToWatchlist}
        />;
    }
  };

  const canAddToWatchlist = () => {
    const tier = userData?.subscriptionTier || 'free';
    const limits = { free: 5, premium: 25, pro: Infinity };
    return watchlist.length < limits[tier];
  };

  const handleAddToWatchlist = (symbol) => {
    if (!canAddToWatchlist()) {
      alert(`Watchlist limit reached. Upgrade to add more stocks!`);
      return;
    }
    addToWatchlist(symbol);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onSearch={(symbol) => {
          setSelectedStock(symbol);
          handleAddToWatchlist(symbol);
          setCurrentView('dashboard');
        }}
      />

      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            watchlist={watchlist}
            selectedStock={selectedStock}
            onSelectStock={(symbol) => {
              setSelectedStock(symbol);
              setCurrentView('dashboard');
            }}
            onRemoveStock={removeFromWatchlist}
          />
        </div>

        {/* Main Content */}
        {renderView()}

        {/* Mobile Bottom Navigation for Watchlist */}
        {currentView === 'dashboard' && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl z-40">
            <div className="overflow-x-auto custom-scrollbar">
              <div className="flex gap-2 p-3 min-w-max">
                {watchlist.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => setSelectedStock(symbol)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedStock === symbol
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout/:tier" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <MainApp />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App
