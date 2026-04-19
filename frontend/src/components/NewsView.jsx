import { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:8000/api';

const MAJOR_STOCKS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META'];

export default function NewsView() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = [];

        for (const symbol of MAJOR_STOCKS) {
          try {
            const response = await axios.get(`${API_BASE}/stock/${symbol}/news`);
            const stockNews = (response.data.news || []).map(item => ({
              ...item,
              symbol,
            }));
            newsData.push(...stockNews);
          } catch (error) {
            console.error(`Error fetching news for ${symbol}:`, error);
          }
        }

        // Sort by date (newest first)
        newsData.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        setAllNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const filteredNews = selectedFilter === 'all'
    ? allNews
    : allNews.filter(item => item.symbol === selectedFilter);

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <Newspaper size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Market News
            </h1>
            <p className="text-gray-400 mt-1">Real-time updates from leading tech companies</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50 shadow-xl">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
              selectedFilter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            All News
          </button>
          {MAJOR_STOCKS.map((symbol) => (
            <button
              key={symbol}
              onClick={() => setSelectedFilter(symbol)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                selectedFilter === symbol
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Sparkles size={32} className="text-white" />
            </div>
          </motion.div>
          <span className="text-gray-300 font-medium">Loading market news...</span>
          <span className="text-gray-500 text-sm mt-2">Fetching latest updates</span>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800/50">
          <Newspaper size={64} className="mx-auto mb-4 text-gray-700" />
          <div className="text-gray-300 text-lg font-medium">No news available</div>
          <div className="text-gray-500 text-sm mt-2">Try selecting a different filter or check back later</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredNews.slice(0, 50).map((item, index) => (
            <motion.div
              key={`${item.symbol}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.02, 0.3), type: "spring", stiffness: 100 }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-gray-900 to-gray-900/50 rounded-2xl p-6 border border-gray-800/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group card-hover backdrop-blur-sm"
              >
                {/* Header with badges and time */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-lg shadow-blue-500/30">
                    {item.symbol}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={13} className="text-blue-400" />
                    <span>{getTimeAgo(item.published_at)}</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-gray-700"></div>
                  <span className="text-xs text-blue-400 font-semibold">{item.source}</span>
                  <div className="flex-1"></div>
                  <div className="p-2 rounded-lg bg-gray-800/50 group-hover:bg-blue-600/20 transition-colors">
                    <ExternalLink
                      size={16}
                      className="text-gray-500 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 mb-3 leading-tight">
                  {item.title}
                </h3>

                {/* Summary */}
                {item.summary && item.summary !== item.title && (
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">
                    {item.summary}
                  </p>
                )}

                {/* Bottom gradient line */}
                <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"></div>
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {filteredNews.length > 50 && (
        <div className="text-center mt-8 text-gray-400">
          Showing 50 of {filteredNews.length} articles
        </div>
      )}
    </main>
  );
}
