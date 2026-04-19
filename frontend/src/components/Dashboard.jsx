import { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from './StockChart';
import TechnicalIndicators from './TechnicalIndicators';
import NewsSection from './NewsSection';
import { TrendingUp, TrendingDown } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard({ symbol }) {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/stock/${symbol}`);
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!stockData) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-400">Stock not found</div>
      </main>
    );
  }

  const isPositive = stockData.changePercent >= 0;

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 custom-scrollbar">
      {/* Stock Header with Premium Design */}
      <div className="mb-6 md:mb-8 bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-800/50 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {stockData.name}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-gray-400 font-mono text-base md:text-lg">{stockData.symbol}</p>
              <span className="text-gray-600">·</span>
              <span className="text-blue-400 text-sm font-medium">NASDAQ</span>
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">${stockData.price.toFixed(2)}</div>
            <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-semibold text-base md:text-lg ${
              isPositive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? <TrendingUp size={20} className="md:w-6 md:h-6" /> : <TrendingDown size={20} className="md:w-6 md:h-6" />}
              <span className="text-sm md:text-base">
                {isPositive ? '+' : ''}${stockData.change.toFixed(2)} ({isPositive ? '+' : ''}
                {stockData.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards with Gradient Borders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
          <div className="relative bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
            <div className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2 font-medium">Market Cap</div>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {stockData.marketCap
                ? `$${(stockData.marketCap / 1e12).toFixed(2)}T`
                : 'N/A'}
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
          <div className="relative bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 shadow-lg">
            <div className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2 font-medium">P/E Ratio</div>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {stockData.pe_ratio ? stockData.pe_ratio.toFixed(2) : 'N/A'}
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
          <div className="relative bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300 shadow-lg">
            <div className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2 font-medium">52W High</div>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {stockData.high_52week ? `$${stockData.high_52week.toFixed(2)}` : 'N/A'}
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
          <div className="relative bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 shadow-lg">
            <div className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2 font-medium">Volume</div>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {stockData.volume ? `${(stockData.volume / 1e6).toFixed(1)}M` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <StockChart symbol={symbol} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
        <TechnicalIndicators symbol={symbol} />
        <NewsSection symbol={symbol} />
      </div>
    </main>
  );
}
