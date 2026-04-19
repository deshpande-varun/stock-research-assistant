# StockPulse Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Backend Dependencies

\`\`\`bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

### Step 2: Install Frontend Dependencies

\`\`\`bash
cd frontend
npm install
\`\`\`

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
\`\`\`bash
./start-backend.sh
# Or manually:
cd backend
source venv/bin/activate
python main.py
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
./start-frontend.sh
# Or manually:
cd frontend
npm run dev
\`\`\`

### Step 4: Open Your Browser

Visit: \`http://localhost:5173\`

## Testing the Application

1. **Default Watchlist**: You'll see 5 stocks (AAPL, TSLA, MSFT, NVDA, GOOGL)
2. **Search**: Try searching for "AMZN" or "META"
3. **Click Stocks**: Click any stock in the sidebar to view details
4. **Chart Timeframes**: Switch between 1D, 1W, 1M, 3M, 1Y, 5Y
5. **Technical Indicators**: See RSI, MACD, moving averages
6. **News**: Scroll down to see latest news for selected stock

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
\`\`\`bash
# Find and kill process
lsof -ti:8000 | xargs kill -9
\`\`\`

**Import errors:**
\`\`\`bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt --upgrade
\`\`\`

### Frontend Issues

**Port 5173 already in use:**
The dev server will automatically use port 5174, 5175, etc.

**Module not found errors:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

**CORS errors:**
Make sure backend is running on port 8000

## Development Tips

### Backend Development

- API docs: \`http://localhost:8000/docs\`
- Test endpoints directly in the interactive docs
- Add new endpoints in \`backend/main.py\`
- Hot reload is enabled (changes auto-restart server)

### Frontend Development

- Hot Module Replacement (HMR) is enabled
- Changes appear instantly in browser
- Check browser console for errors (F12)
- Components are in \`frontend/src/components/\`

## Data Sources

- **Stock Data**: Yahoo Finance (via yfinance library)
- **Update Frequency**: Every 60 seconds for live prices
- **Rate Limits**: Yahoo Finance is free but rate-limited
- **Data Delay**: 15 minutes for most stocks (real-time for indices)

## Next Steps

### Immediate Improvements

1. **Add More Stocks**: Search and add any US stock symbol
2. **Customize UI**: Edit Tailwind classes in components
3. **Add Features**: Portfolio tracking, alerts, more indicators

### Database Integration (Future)

\`\`\`python
# Install PostgreSQL or SQLite
pip install sqlalchemy psycopg2-binary
\`\`\`

### User Authentication (Future)

\`\`\`python
# Install auth libraries
pip install python-jose[cryptography] passlib[bcrypt]
\`\`\```

### Deployment (Future)

**Backend:**
- Heroku, Railway, or AWS Lambda
- Add \`Procfile\` for Heroku
- Set environment variables

**Frontend:**
- Vercel, Netlify, or GitHub Pages
- Build: \`npm run build\`
- Deploy \`dist/\` folder

## Performance Optimization

### Backend
- Cache stock data (Redis)
- Rate limit API calls
- Use WebSockets for real-time updates

### Frontend
- Code splitting
- Lazy load components
- Optimize images
- Use React.memo for expensive components

## Security Checklist

- [ ] Add rate limiting to API
- [ ] Validate all user inputs
- [ ] Add API authentication
- [ ] Use HTTPS in production
- [ ] Sanitize stock symbols before queries
- [ ] Add CSP headers
- [ ] Enable CORS only for trusted origins

## Monitoring

### Backend Health Check
\`\`\`bash
curl http://localhost:8000/
# Should return: {"message":"Stock Research Assistant API","status":"active"}
\`\`\`

### Frontend Build
\`\`\`bash
cd frontend
npm run build
# Check dist/ folder
\`\`\`

## Contributing

See [README.md](README.md) for contribution guidelines.

## Support

- GitHub Issues: Report bugs
- Documentation: This guide + README.md
- API Docs: http://localhost:8000/docs

---

**Happy coding! 🚀📈**
