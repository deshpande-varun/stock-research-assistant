# StockPulse - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Open Two Terminals

### Terminal 1 - Backend
\`\`\`bash
cd ~/stock-research-assistant
./start-backend.sh
\`\`\`

### Terminal 2 - Frontend
\`\`\`bash
cd ~/stock-research-assistant
./start-frontend.sh
\`\`\`

### Step 3: Open Browser
Go to: **http://localhost:5173**

## ✅ What You'll See

1. **Header** with search bar
2. **Sidebar** with 5 default stocks (AAPL, TSLA, MSFT, NVDA, GOOGL)
3. **Main dashboard** showing Apple stock by default
4. **Price chart** with timeframe options
5. **Technical indicators** with educational tooltips
6. **Latest news** for the selected stock

## 🎮 Try These Features

- **Click stocks in sidebar** to switch between them
- **Search for a stock** (try "AMZN", "META", "NFLX")
- **Change chart timeframe** (1D, 1W, 1M, 3M, 1Y, 5Y)
- **Read technical indicators** - hover to learn what they mean
- **Click news articles** to read full stories

## 📝 Project Structure

\`\`\`
stock-research-assistant/
├── backend/               # Python FastAPI server
│   ├── main.py           # API endpoints
│   ├── requirements.txt  # Python dependencies
│   └── venv/             # Virtual environment
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── App.jsx       # Main app
│   │   └── index.css     # Tailwind styles
│   └── package.json      # Node dependencies
├── README.md             # Full documentation
├── SETUP_GUIDE.md        # Detailed setup instructions
├── BUSINESS_PLAN.md      # Business strategy
└── QUICKSTART.md         # This file
\`\`\`

## 🔧 Troubleshooting

**Backend not starting?**
\`\`\`bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python main.py
\`\`\`

**Frontend not starting?**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

**Still having issues?**
Check SETUP_GUIDE.md for detailed troubleshooting.

## 📚 Next Steps

1. **Read README.md** - Full feature list and documentation
2. **Check BUSINESS_PLAN.md** - See the vision and roadmap
3. **Customize the UI** - Edit components in `frontend/src/components/`
4. **Add features** - Extend API in `backend/main.py`
5. **Deploy** - Follow deployment guide in SETUP_GUIDE.md

## 🎯 Key Files to Know

### Backend
- `backend/main.py` - All API endpoints
- `backend/requirements.txt` - Python packages

### Frontend
- `frontend/src/App.jsx` - Main application
- `frontend/src/components/Dashboard.jsx` - Stock detail view
- `frontend/src/components/Sidebar.jsx` - Watchlist sidebar
- `frontend/src/components/StockChart.jsx` - Price chart
- `frontend/src/components/TechnicalIndicators.jsx` - RSI, MACD, etc.
- `frontend/src/components/NewsSection.jsx` - News feed

## 💡 Tips

- **API Documentation**: Visit http://localhost:8000/docs while backend is running
- **Hot Reload**: Both servers auto-reload when you edit code
- **Free Data**: Using Yahoo Finance API (no API key needed)
- **Rate Limits**: Don't spam requests, data updates every 60 seconds

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `lsof -ti:8000 \| xargs kill -9` |
| Module not found | `pip install -r requirements.txt` |
| npm errors | `rm -rf node_modules && npm install` |
| CORS errors | Make sure backend is running on port 8000 |

## 🎨 Customization Ideas

1. **Change colors**: Edit `frontend/tailwind.config.js`
2. **Add stocks to default watchlist**: Edit `DEFAULT_WATCHLIST` in `App.jsx`
3. **Change update frequency**: Modify `setInterval` timers in components
4. **Add new indicators**: Extend API in `backend/main.py`

## 📞 Need Help?

- Check **README.md** for full documentation
- Read **SETUP_GUIDE.md** for detailed setup
- See **BUSINESS_PLAN.md** for product vision
- Open an issue on GitHub

---

**Enjoy StockPulse! 🚀📈**
