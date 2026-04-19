import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function TechnicalIndicators({ symbol }) {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/stock/${symbol}/indicators`);
        setIndicators(response.data);
      } catch (error) {
        console.error('Error fetching indicators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, [symbol]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
        <div className="text-gray-400">Loading indicators...</div>
      </div>
    );
  }

  if (!indicators) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
        <div className="text-gray-400">No indicators available</div>
      </div>
    );
  }

  const getRSIColor = (rsi) => {
    if (!rsi) return 'text-gray-400';
    if (rsi < 30) return 'text-green-400';
    if (rsi > 70) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getRSILabel = (rsi) => {
    if (!rsi) return 'N/A';
    if (rsi < 30) return 'Oversold';
    if (rsi > 70) return 'Overbought';
    return 'Neutral';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
      <div className="space-y-4">
        {indicators.rsi && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">RSI (14)</span>
              <span className={`font-semibold ${getRSIColor(indicators.rsi)}`}>
                {indicators.rsi.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  indicators.rsi < 30
                    ? 'bg-green-500'
                    : indicators.rsi > 70
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${indicators.rsi}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getRSILabel(indicators.rsi)} - {indicators.rsi < 30
                ? 'Potential buying opportunity'
                : indicators.rsi > 70
                ? 'Potential selling pressure'
                : 'Not overbought or oversold'}
            </div>
          </div>
        )}

        {indicators.macd && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">MACD</span>
              <span
                className={`font-semibold ${
                  indicators.macd.trend === 'Bullish'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {indicators.macd.trend}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {indicators.macd.trend === 'Bullish'
                ? 'MACD line crossed above signal line'
                : 'MACD line crossed below signal line'}
            </div>
          </div>
        )}

        {indicators.sma_50 && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">50-Day MA</span>
              <span className="font-semibold">${indicators.sma_50.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">
              Short-term trend indicator
            </div>
          </div>
        )}

        {indicators.sma_200 && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">200-Day MA</span>
              <span className="font-semibold">${indicators.sma_200.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">
              Long-term trend indicator
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded">
          <div className="text-sm font-semibold text-blue-400 mb-1 flex items-center gap-2">
            <BookOpen size={16} />
            What does this mean?
          </div>
          <div className="text-xs text-gray-400">
            Overall Signal: <span className={`font-semibold ${
              indicators.signal === 'Bullish'
                ? 'text-green-400'
                : indicators.signal === 'Bearish'
                ? 'text-red-400'
                : 'text-yellow-400'
            }`}>{indicators.signal}</span>
            {' - '}
            These indicators suggest {indicators.signal.toLowerCase()} momentum based on technical analysis.
          </div>
        </div>
      </div>
    </div>
  );
}
