import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Building2, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:8000/api';

export default function Header({ currentView, onViewChange, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'markets', label: 'Markets' },
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'news', label: 'News' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await axios.get(`${API_BASE}/search/${searchQuery}`);
        setSearchResults(response.data.results || []);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      selectStock(searchQuery.trim().toUpperCase());
    } else if (searchResults.length > 0) {
      selectStock(searchResults[0].symbol);
    }
  };

  const selectStock = (symbol) => {
    onSearch(symbol);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectStock(searchResults[selectedIndex].symbol);
        } else if (searchResults.length > 0) {
          selectStock(searchResults[0].symbol);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 shadow-xl">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onViewChange('dashboard')}
          >
            StockPulse
          </h1>
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative" ref={searchRef}>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery && setShowDropdown(true)}
                style={{ paddingLeft: '44px', paddingRight: '48px' }}
                className="bg-gray-800 border border-gray-700 rounded-lg py-2.5 w-80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-500 text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-md transition z-10"
              >
                <ArrowRight size={14} className="text-white" />
              </button>
            </div>

            {/* Animated Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50"
                  style={{ width: '480px' }}
                >
                  {isSearching ? (
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center gap-3 text-blue-400">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={18} />
                        </motion.div>
                        <span className="text-sm font-medium">Searching markets...</span>
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="overflow-y-auto max-h-96 custom-scrollbar py-1">
                      {searchResults.map((result, index) => (
                        <div
                          key={result.symbol}
                          onClick={() => selectStock(result.symbol)}
                          className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                            index === selectedIndex
                              ? 'bg-blue-600'
                              : 'hover:bg-gray-750'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              index === selectedIndex
                                ? 'bg-white/20'
                                : 'bg-gray-700'
                            }`}>
                              <Building2 size={20} className={
                                index === selectedIndex ? 'text-white' : 'text-blue-400'
                              } />
                            </div>
                            <div className="flex-1 min-w-0 py-0.5">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-bold ${
                                  index === selectedIndex ? 'text-white' : 'text-blue-400'
                                }`}>
                                  {result.symbol}
                                </span>
                                {index === 0 && (
                                  <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                                    Best
                                  </span>
                                )}
                              </div>
                              <div className={`text-sm leading-tight truncate ${
                                index === selectedIndex ? 'text-blue-50' : 'text-gray-300'
                              }`}>
                                {result.name}
                              </div>
                              <div className={`text-[11px] mt-1 leading-none ${
                                index === selectedIndex ? 'text-blue-200' : 'text-gray-500'
                              }`}>
                                {result.exchange} · {result.type}
                              </div>
                            </div>
                            <TrendingUp
                              size={16}
                              className={`flex-shrink-0 transition-colors ${
                                index === selectedIndex
                                  ? 'text-white'
                                  : 'text-gray-500'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-500 mb-2">
                        <Search size={32} className="mx-auto mb-3 opacity-50" />
                      </div>
                      <div className="text-gray-400 text-sm">
                        No stocks found for "{searchQuery}"
                      </div>
                      <div className="text-gray-500 text-xs mt-2">
                        Try searching by symbol or company name
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <button className="relative px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105">
            <span className="relative z-10">Upgrade Pro</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 hover:opacity-20 blur transition-opacity"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
