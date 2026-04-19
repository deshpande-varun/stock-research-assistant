import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'INTC', name: 'Intel Corp.' },
  { symbol: 'PYPL', name: 'PayPal Holdings' },
  { symbol: 'DIS', name: 'Walt Disney Co.' },
];

export default function MarketsView({ onSelectStock }) {
  const [marketData, setMarketData] = useState([]);
  const [stockQuotes, setStockQuotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch market indices
        const marketResponse = await axios.get(`${API_BASE}/market/overview`);
        setMarketData(marketResponse.data.indices || []);

        // Fetch popular stocks
        const quotes = {};
        for (const stock of POPULAR_STOCKS) {
          try {
            const response = await axios.get(`${API_BASE}/stock/${stock.symbol}`);
            quotes[stock.symbol] = response.data;
          } catch (error) {
            console.error(`Error fetching ${stock.symbol}:`, error);
          }
        }
        setStockQuotes(quotes);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Markets Overview</h1>
        <p className="text-gray-400">Real-time market data and trending stocks</p>
      </div>

      {/* Market Indices */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity size={20} />
          Major Indices
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {marketData.map((index) => (
            <div
              key={index.name}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="text-gray-400 text-sm mb-2">{index.name}</div>
              <div className="text-3xl font-bold mb-2">
                {index.price.toLocaleString('en-US', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`flex items-center gap-1 text-lg ${
                  index.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {index.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                {index.change >= 0 ? '+' : ''}
                {index.change.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Stocks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Popular Stocks</h2>
        {loading ? (
          <div className="text-gray-400">Loading stocks...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {POPULAR_STOCKS.map((stock) => {
              const quote = stockQuotes[stock.symbol];
              return (
                <div
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock.symbol)}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-500 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-xl font-bold">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">{stock.name}</div>
                    </div>
                    {quote ? (
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          ${quote.price.toFixed(2)}
                        </div>
                        <div
                          className={`text-sm flex items-center gap-1 justify-end ${
                            quote.changePercent >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {quote.changePercent >= 0 ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {quote.changePercent >= 0 ? '+' : ''}
                          {quote.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Loading...</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
