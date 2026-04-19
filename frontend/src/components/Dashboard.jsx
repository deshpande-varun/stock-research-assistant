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
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{stockData.name}</h1>
            <p className="text-gray-400">{stockData.symbol} · NASDAQ</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">${stockData.price.toFixed(2)}</div>
            <div className={`text-xl flex items-center gap-2 justify-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp /> : <TrendingDown />}
              {isPositive ? '+' : ''}${stockData.change.toFixed(2)} ({isPositive ? '+' : ''}
              {stockData.changePercent.toFixed(2)}%) Today
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Market Cap</div>
          <div className="text-2xl font-bold">
            {stockData.marketCap
              ? `$${(stockData.marketCap / 1e12).toFixed(2)}T`
              : 'N/A'}
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">P/E Ratio</div>
          <div className="text-2xl font-bold">
            {stockData.pe_ratio ? stockData.pe_ratio.toFixed(2) : 'N/A'}
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">52 Week High</div>
          <div className="text-2xl font-bold">
            {stockData.high_52week ? `$${stockData.high_52week.toFixed(2)}` : 'N/A'}
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Volume</div>
          <div className="text-2xl font-bold">
            {stockData.volume ? `${(stockData.volume / 1e6).toFixed(1)}M` : 'N/A'}
          </div>
        </div>
      </div>

      <StockChart symbol={symbol} />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <TechnicalIndicators symbol={symbol} />
        <NewsSection symbol={symbol} />
      </div>
    </main>
  );
}
