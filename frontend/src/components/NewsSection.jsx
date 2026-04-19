import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Newspaper } from 'lucide-react';

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

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Newspaper size={20} />
        Latest News
      </h2>

      {loading ? (
        <div className="text-gray-400">Loading news...</div>
      ) : news.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {news.map((item, index) => (
            <div key={index} className="pb-4 border-b border-gray-800 last:border-b-0">
              <div className="text-sm text-gray-400 mb-1">
                {item.published_at} · {item.source}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold mb-2 hover:text-blue-400 cursor-pointer flex items-start gap-2 group"
              >
                <span className="flex-1">{item.title}</span>
                <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400 mt-1" />
              </a>
              {item.summary && (
                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400">No news available</div>
      )}
    </div>
  );
}
