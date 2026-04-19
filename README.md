# StockPulse - Stock Research Assistant

A modern, full-stack stock research and analysis platform with real-time data, technical indicators, and educational insights.

![StockPulse](https://img.shields.io/badge/StockPulse-v1.0-blue)
![Python](https://img.shields.io/badge/Python-3.9+-green)
![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-teal)

## 🚀 Features

- **Real-time Stock Data**: Live price tracking with automatic updates
- **Interactive Charts**: Visualize stock price history with multiple timeframes (1D, 1W, 1M, 3M, 1Y, 5Y)
- **Technical Indicators**: 
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - 50-Day & 200-Day Moving Averages
  - Overall bullish/bearish signals
- **Educational Tooltips**: Learn what each indicator means
- **Latest News**: Stay updated with stock-specific news
- **Watchlist Management**: Track multiple stocks simultaneously
- **Market Overview**: Monitor major indices (S&P 500, Nasdaq, Dow Jones)
- **Modern UI**: Dark theme, responsive design, smooth animations

## 🛠 Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **yfinance** - Real-time stock data from Yahoo Finance
- **Pandas** - Data analysis and manipulation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Interactive chart library
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

## 📋 Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn

## 🔧 Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/stock-research-assistant.git
cd stock-research-assistant
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install
\`\`\`

## 🚀 Running the Application

### Start Backend Server

\`\`\`bash
cd backend
source venv/bin/activate  # Activate virtual environment
python main.py
\`\`\`

The API will be available at \`http://localhost:8000\`

### Start Frontend Development Server

In a new terminal:

\`\`\`bash
cd frontend
npm run dev
\`\`\`

The app will be available at \`http://localhost:5173\`

## 📚 API Documentation

Once the backend is running, visit:
- Interactive API docs: \`http://localhost:8000/docs\`
- Alternative docs: \`http://localhost:8000/redoc\`

### Key Endpoints

- \`GET /api/stock/{symbol}\` - Get stock quote
- \`GET /api/stock/{symbol}/history?period=1mo\` - Get historical data
- \`GET /api/stock/{symbol}/indicators\` - Get technical indicators
- \`GET /api/stock/{symbol}/news\` - Get latest news
- \`GET /api/market/overview\` - Get market indices overview
- \`GET /api/search/{query}\` - Search for stocks

## 🎨 UI Features

### Dashboard Components

1. **Header**: Navigation, search, and premium upgrade button
2. **Sidebar Watchlist**: Track multiple stocks with live prices
3. **Main Dashboard**: 
   - Stock price header with live updates
   - Key metrics cards (Market Cap, P/E Ratio, 52W High, Volume)
   - Interactive price chart
   - Technical indicators with educational insights
   - Latest news feed

### Color Coding

- 🟢 **Green**: Positive price movement, bullish signals
- 🔴 **Red**: Negative price movement, bearish signals
- 🟡 **Yellow**: Neutral signals
- 🔵 **Blue**: Interactive elements, links

## 📈 Future Enhancements

### Phase 1 (Current)
- ✅ Real-time stock data
- ✅ Technical indicators
- ✅ News feed
- ✅ Watchlist

### Phase 2 (Planned)
- [ ] User authentication
- [ ] Save watchlists to database
- [ ] Portfolio tracking
- [ ] Price alerts (email/SMS)
- [ ] Advanced charting (candlesticks, volume)
- [ ] More technical indicators

### Phase 3 (Future)
- [ ] AI-powered insights
- [ ] Backtesting strategies
- [ ] Social features (share watchlists)
- [ ] Mobile app
- [ ] Premium subscription tier

## 💰 Business Model (Future)

### Free Tier
- Basic stock data
- Limited watchlist (5 stocks)
- Standard technical indicators
- Ad-supported

### Premium Tier ($9.99/mo)
- Unlimited watchlist
- Real-time alerts
- Advanced indicators
- Ad-free experience
- Priority support

### Pro Tier ($29.99/mo)
- Everything in Premium
- API access
- Backtesting tools
- Portfolio analytics
- Early access to new features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## ⚠️ Disclaimer

**This tool is for educational and informational purposes only.**

- Not financial advice
- Not a recommendation to buy/sell securities
- Always do your own research (DYOR)
- Consult with a licensed financial advisor before making investment decisions
- Past performance does not guarantee future results

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [Yahoo Finance](https://finance.yahoo.com/) for stock data
- [yfinance](https://github.com/ranaroussi/yfinance) Python library
- [FastAPI](https://fastapi.tiangolo.com/) framework
- [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or feedback:
- GitHub Issues: [Create an issue](https://github.com/yourusername/stock-research-assistant/issues)
- Email: your.email@example.com

---

**Built with ❤️ for stock market enthusiasts and developers**
