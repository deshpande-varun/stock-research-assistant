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
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Newspaper size={32} />
          Market News
        </h1>
        <p className="text-gray-400">Latest news from major tech stocks</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All News
        </button>
        {MAJOR_STOCKS.map((symbol) => (
          <button
            key={symbol}
            onClick={() => setSelectedFilter(symbol)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === symbol
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {symbol}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={24} className="text-blue-400" />
          </motion.div>
          <span className="ml-3 text-gray-400">Loading news...</span>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper size={48} className="mx-auto mb-3 text-gray-700" />
          <div className="text-gray-400 text-sm">No news available</div>
          <div className="text-gray-600 text-xs mt-1">Try selecting a different filter</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredNews.slice(0, 50).map((item, index) => (
            <motion.div
              key={`${item.symbol}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-900 rounded-lg p-5 border border-gray-800 hover:border-blue-500/50 hover:bg-gray-850 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-bold">
                    {item.symbol}
                  </span>
                  <span className="text-gray-500 text-xs flex items-center gap-1.5">
                    <Clock size={12} />
                    {getTimeAgo(item.published_at)}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-blue-400 text-xs font-medium">{item.source}</span>
                  <div className="flex-1"></div>
                  <ExternalLink
                    size={14}
                    className="text-gray-600 group-hover:text-blue-400 transition-colors"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                  {item.title}
                </h3>
                {item.summary && item.summary !== item.title && (
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                )}
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
