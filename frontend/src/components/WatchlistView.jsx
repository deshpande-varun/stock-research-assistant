import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, X, Star } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function WatchlistView({ watchlist, onSelectStock, onRemoveStock }) {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const getTotalValue = () => {
    return Object.values(quotes).reduce((sum, quote) => sum + quote.price, 0);
  };

  const getAverageChange = () => {
    const changes = Object.values(quotes).map(q => q.changePercent);
    if (changes.length === 0) return 0;
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Star className="text-yellow-400" size={32} />
          My Watchlist
        </h1>
        <p className="text-gray-400">Track your favorite stocks in one place</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Total Stocks</div>
          <div className="text-3xl font-bold">{watchlist.length}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Combined Price</div>
          <div className="text-3xl font-bold">
            ${getTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Average Change</div>
          <div
            className={`text-3xl font-bold flex items-center gap-2 ${
              getAverageChange() >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {getAverageChange() >= 0 ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
            {getAverageChange() >= 0 ? '+' : ''}
            {getAverageChange().toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4 text-gray-400 font-medium">Symbol</th>
              <th className="text-left p-4 text-gray-400 font-medium">Name</th>
              <th className="text-right p-4 text-gray-400 font-medium">Price</th>
              <th className="text-right p-4 text-gray-400 font-medium">Change</th>
              <th className="text-right p-4 text-gray-400 font-medium">Change %</th>
              <th className="text-right p-4 text-gray-400 font-medium">Market Cap</th>
              <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400">
                  Loading watchlist...
                </td>
              </tr>
            ) : watchlist.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400">
                  Your watchlist is empty. Search for stocks to add them.
                </td>
              </tr>
            ) : (
              watchlist.map((symbol) => {
                const quote = quotes[symbol];
                if (!quote) return null;

                return (
                  <tr
                    key={symbol}
                    className="border-t border-gray-800 hover:bg-gray-800 cursor-pointer transition"
                    onClick={() => onSelectStock(symbol)}
                  >
                    <td className="p-4 font-bold text-blue-400">{quote.symbol}</td>
                    <td className="p-4 text-gray-300">{quote.name}</td>
                    <td className="p-4 text-right font-semibold">
                      ${quote.price.toFixed(2)}
                    </td>
                    <td
                      className={`p-4 text-right ${
                        quote.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)}
                    </td>
                    <td
                      className={`p-4 text-right font-medium ${
                        quote.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        {quote.changePercent >= 0 ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        {quote.changePercent >= 0 ? '+' : ''}
                        {quote.changePercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-300">
                      {quote.marketCap
                        ? `$${(quote.marketCap / 1e12).toFixed(2)}T`
                        : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveStock(symbol);
                        }}
                        className="text-gray-400 hover:text-red-400 transition"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
