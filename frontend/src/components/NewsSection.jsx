import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Newspaper, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:8000/api';

export default function NewsSection({ symbol }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/stock/${symbol}/news`);
        setNews(response.data.news || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      return 'Just now';
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <div className="p-2 bg-blue-600/20 rounded-lg">
          <Newspaper size={20} className="text-blue-400" />
        </div>
        <span>Latest News</span>
      </h2>

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
      ) : news.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-gray-800 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    <Clock size={12} className="flex-shrink-0" />
                    <span>{getTimeAgo(item.published_at)}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-blue-400 font-medium">{item.source}</span>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5"
                  />
                </div>
                <h3 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
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
      ) : (
        <div className="text-center py-12">
          <Newspaper size={48} className="mx-auto mb-3 text-gray-700" />
          <div className="text-gray-400 text-sm">No news available</div>
          <div className="text-gray-600 text-xs mt-1">Check back later for updates</div>
        </div>
      )}
    </div>
  );
}
