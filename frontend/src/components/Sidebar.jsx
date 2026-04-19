import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function Sidebar({ watchlist, selectedStock, onSelectStock, onRemoveStock }) {
  const [quotes, setQuotes] = useState({});
  const [marketOverview, setMarketOverview] = useState([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      const newQuotes = {};
      for (const symbol of watchlist) {
        try {
          const response = await axios.get(`${API_BASE}/stock/${symbol}`);
          newQuotes[symbol] = response.data;
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
        }
      }
      setQuotes(newQuotes);
    };

    const fetchMarketOverview = async () => {
      try {
        const response = await axios.get(`${API_BASE}/market/overview`);
        setMarketOverview(response.data.indices || []);
      } catch (error) {
        console.error('Error fetching market overview:', error);
      }
    };

    fetchQuotes();
    fetchMarketOverview();

    const interval = setInterval(() => {
      fetchQuotes();
      fetchMarketOverview();
    }, 60000);

    return () => clearInterval(interval);
  }, [watchlist]);

  return (
    <aside className="w-80 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50 h-[calc(100vh-73px)] overflow-y-auto sticky top-[73px] shadow-2xl custom-scrollbar">
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">My Watchlist</h2>
        </div>

        <div className="space-y-2">
          {watchlist.map((symbol) => {
            const quote = quotes[symbol];
            const isSelected = selectedStock === symbol;

            return (
              <div
                key={symbol}
                className={`rounded-xl p-4 cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800/50 hover:bg-gray-800 border-2 border-transparent hover:border-gray-700'
                }`}
                onClick={() => onSelectStock(symbol)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">{symbol}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {quote?.name || 'Loading...'}
                    </div>
                  </div>
                  <div className="text-right">
                    {quote ? (
                      <>
                        <div className="font-semibold">${quote.price.toFixed(2)}</div>
                        <div
                          className={`text-xs flex items-center gap-1 justify-end ${
                            quote.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {quote.changePercent >= 0 ? (
                            <TrendingUp size={12} />
                          ) : (
                            <TrendingDown size={12} />
                          )}
                          {quote.changePercent >= 0 ? '+' : ''}
                          {quote.changePercent.toFixed(2)}%
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-gray-500">Loading...</div>
                    )}
                  </div>
                  {watchlist.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStock(symbol);
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} className="text-gray-400 hover:text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 text-gray-400">MARKET OVERVIEW</h3>
          <div className="space-y-2 text-sm">
            {marketOverview.map((index) => (
              <div key={index.name} className="flex justify-between">
                <span className="text-gray-400">{index.name}</span>
                <span
                  className={
                    index.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
