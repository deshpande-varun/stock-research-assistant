import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import MarketsView from './components/MarketsView'
import WatchlistView from './components/WatchlistView'
import NewsView from './components/NewsView'
import './App.css'

const DEFAULT_WATCHLIST = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL'];

function App() {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [currentView, setCurrentView] = useState('dashboard');

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol.toUpperCase())) {
      setWatchlist([...watchlist, symbol.toUpperCase()]);
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  const renderView = () => {
    switch (currentView) {
      case 'markets':
        return <MarketsView onSelectStock={(symbol) => {
          setSelectedStock(symbol);
          addToWatchlist(symbol);
          setCurrentView('dashboard');
        }} />;
      case 'watchlist':
        return <WatchlistView
          watchlist={watchlist}
          onSelectStock={(symbol) => {
            setSelectedStock(symbol);
            setCurrentView('dashboard');
          }}
          onRemoveStock={removeFromWatchlist}
        />;
      case 'news':
        return <NewsView />;
      default:
        return <Dashboard
          symbol={selectedStock}
          onAddToWatchlist={addToWatchlist}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onSearch={(symbol) => {
          setSelectedStock(symbol);
          addToWatchlist(symbol);
          setCurrentView('dashboard');
        }}
      />

      <div className="flex">
        <Sidebar
          watchlist={watchlist}
          selectedStock={selectedStock}
          onSelectStock={(symbol) => {
            setSelectedStock(symbol);
            setCurrentView('dashboard');
          }}
          onRemoveStock={removeFromWatchlist}
        />

        {renderView()}
      </div>
    </div>
  )
}

export default App
