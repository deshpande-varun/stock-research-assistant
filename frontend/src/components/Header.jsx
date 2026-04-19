import { useState } from 'react';
import { Search } from 'lucide-react';

export default function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim().toUpperCase());
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            StockPulse
          </h1>
          <nav className="flex gap-6">
            <a href="#" className="text-blue-400 font-medium">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-gray-200">Markets</a>
            <a href="#" className="text-gray-400 hover:text-gray-200">Watchlist</a>
            <a href="#" className="text-gray-400 hover:text-gray-200">News</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search size={18} className="text-gray-400" />
            </button>
          </form>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition">
            Upgrade Pro
          </button>
        </div>
      </div>
    </header>
  );
}
