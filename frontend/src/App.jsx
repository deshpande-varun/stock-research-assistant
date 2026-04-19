import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import './App.css'

const DEFAULT_WATCHLIST = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL'];

function App() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol.toUpperCase())) {
      setWatchlist([...watchlist, symbol.toUpperCase()]);
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header
        onSearch={(symbol) => {
          setSelectedStock(symbol);
          addToWatchlist(symbol);
        }}
      />

      <div className="flex">
        <Sidebar
          watchlist={watchlist}
          selectedStock={selectedStock}
          onSelectStock={setSelectedStock}
          onRemoveStock={removeFromWatchlist}
        />

        <Dashboard
          symbol={selectedStock}
          onAddToWatchlist={addToWatchlist}
        />
      </div>
    </div>
  )
}

export default App
