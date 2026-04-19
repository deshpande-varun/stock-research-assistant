from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
from pydantic import BaseModel

app = FastAPI(title="Stock Research Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    changePercent: float
    volume: int
    marketCap: Optional[float] = None
    pe_ratio: Optional[float] = None
    high_52week: Optional[float] = None
    low_52week: Optional[float] = None

class TechnicalIndicators(BaseModel):
    rsi: Optional[float] = None
    macd: Optional[dict] = None
    sma_50: Optional[float] = None
    sma_200: Optional[float] = None
    signal: str

class NewsItem(BaseModel):
    title: str
    source: str
    published_at: str
    url: str
    summary: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Stock Research Assistant API", "status": "active"}

@app.get("/api/stock/{symbol}", response_model=StockQuote)
def get_stock_quote(symbol: str):
    try:
        ticker = yf.Ticker(symbol.upper())
        info = ticker.info

        current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
        previous_close = info.get('previousClose', current_price)

        change = current_price - previous_close
        change_percent = (change / previous_close * 100) if previous_close else 0

        return StockQuote(
            symbol=symbol.upper(),
            name=info.get('longName', symbol.upper()),
            price=current_price,
            change=change,
            changePercent=change_percent,
            volume=info.get('volume', 0),
            marketCap=info.get('marketCap'),
            pe_ratio=info.get('trailingPE'),
            high_52week=info.get('fiftyTwoWeekHigh'),
            low_52week=info.get('fiftyTwoWeekLow')
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found: {str(e)}")

@app.get("/api/stock/{symbol}/history")
def get_stock_history(symbol: str, period: str = "1mo"):
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period=period)

        data = []
        for index, row in hist.iterrows():
            data.append({
                "date": index.strftime("%Y-%m-%d"),
                "open": round(row['Open'], 2),
                "high": round(row['High'], 2),
                "low": round(row['Low'], 2),
                "close": round(row['Close'], 2),
                "volume": int(row['Volume'])
            })

        return {"symbol": symbol.upper(), "period": period, "data": data}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"History not found: {str(e)}")

@app.get("/api/stock/{symbol}/indicators", response_model=TechnicalIndicators)
def get_technical_indicators(symbol: str):
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period="6mo")

        if hist.empty:
            raise HTTPException(status_code=404, detail="No historical data available")

        close_prices = hist['Close']

        # RSI Calculation
        delta = close_prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        current_rsi = rsi.iloc[-1] if not rsi.empty else None

        # Moving Averages
        sma_50 = close_prices.rolling(window=50).mean().iloc[-1] if len(close_prices) >= 50 else None
        sma_200 = close_prices.rolling(window=200).mean().iloc[-1] if len(close_prices) >= 200 else None

        # MACD
        exp1 = close_prices.ewm(span=12, adjust=False).mean()
        exp2 = close_prices.ewm(span=26, adjust=False).mean()
        macd_line = exp1 - exp2
        signal_line = macd_line.ewm(span=9, adjust=False).mean()

        macd_current = macd_line.iloc[-1]
        signal_current = signal_line.iloc[-1]
        macd_signal = "Bullish" if macd_current > signal_current else "Bearish"

        # Overall Signal
        current_price = close_prices.iloc[-1]
        signals = []

        if current_rsi and current_rsi < 30:
            signals.append("oversold")
        elif current_rsi and current_rsi > 70:
            signals.append("overbought")

        if sma_50 and current_price > sma_50:
            signals.append("bullish_sma50")
        elif sma_50 and current_price < sma_50:
            signals.append("bearish_sma50")

        overall_signal = "Bullish" if "bullish" in str(signals) else "Bearish" if "bearish" in str(signals) else "Neutral"

        return TechnicalIndicators(
            rsi=round(current_rsi, 2) if current_rsi else None,
            macd={
                "value": round(macd_current, 2),
                "signal": round(signal_current, 2),
                "trend": macd_signal
            },
            sma_50=round(sma_50, 2) if sma_50 else None,
            sma_200=round(sma_200, 2) if sma_200 else None,
            signal=overall_signal
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating indicators: {str(e)}")

@app.get("/api/stock/{symbol}/news")
def get_stock_news(symbol: str):
    try:
        ticker = yf.Ticker(symbol.upper())
        news = ticker.news

        news_items = []
        for item in news[:10]:
            try:
                # Handle new yfinance news structure
                if isinstance(item, dict) and 'content' in item:
                    content = item.get('content', {})
                    if not content:
                        continue

                    title = content.get('title', '')
                    summary = content.get('summary', content.get('description', ''))
                    pub_date = content.get('pubDate', content.get('displayTime', ''))
                    provider = content.get('provider', {}) or {}
                    source = provider.get('displayName', 'Unknown')

                    click_through = content.get('clickThroughUrl', {}) or {}
                    canonical = content.get('canonicalUrl', {}) or {}
                    url = click_through.get('url', canonical.get('url', ''))

                    # Parse the date
                    try:
                        from dateutil import parser
                        parsed_date = parser.parse(pub_date)
                        formatted_date = parsed_date.strftime("%Y-%m-%d %H:%M:%S")
                    except:
                        formatted_date = str(pub_date) if pub_date else 'Unknown'

                    if title:  # Only add if we have a title
                        news_items.append({
                            "title": title,
                            "source": source,
                            "published_at": formatted_date,
                            "url": url,
                            "summary": summary or title
                        })
                else:
                    # Handle old structure (fallback)
                    title = item.get('title', '')
                    if title:
                        news_items.append({
                            "title": title,
                            "source": item.get('publisher', 'Unknown'),
                            "published_at": datetime.fromtimestamp(item.get('providerPublishTime', 0)).strftime("%Y-%m-%d %H:%M:%S"),
                            "url": item.get('link', ''),
                            "summary": title
                        })
            except Exception as item_error:
                print(f"Error processing news item: {item_error}")
                continue

        return {"symbol": symbol.upper(), "news": news_items}
    except Exception as e:
        print(f"Error fetching news: {e}")
        import traceback
        traceback.print_exc()
        return {"symbol": symbol.upper(), "news": []}

@app.get("/api/search/{query}")
def search_stocks(query: str):
    """Search for stocks with autocomplete suggestions"""
    try:
        # Common stocks database for quick search
        common_stocks = {
            'AAPL': 'Apple Inc.',
            'MSFT': 'Microsoft Corporation',
            'GOOGL': 'Alphabet Inc. (Google)',
            'GOOG': 'Alphabet Inc. Class C',
            'AMZN': 'Amazon.com Inc.',
            'TSLA': 'Tesla Inc.',
            'META': 'Meta Platforms Inc. (Facebook)',
            'NVDA': 'NVIDIA Corporation',
            'BRK.B': 'Berkshire Hathaway Inc.',
            'JPM': 'JPMorgan Chase & Co.',
            'V': 'Visa Inc.',
            'JNJ': 'Johnson & Johnson',
            'WMT': 'Walmart Inc.',
            'PG': 'Procter & Gamble Co.',
            'MA': 'Mastercard Inc.',
            'UNH': 'UnitedHealth Group Inc.',
            'HD': 'Home Depot Inc.',
            'DIS': 'Walt Disney Co.',
            'BAC': 'Bank of America Corp.',
            'NFLX': 'Netflix Inc.',
            'ADBE': 'Adobe Inc.',
            'CRM': 'Salesforce Inc.',
            'CSCO': 'Cisco Systems Inc.',
            'PFE': 'Pfizer Inc.',
            'INTC': 'Intel Corporation',
            'AMD': 'Advanced Micro Devices Inc.',
            'PYPL': 'PayPal Holdings Inc.',
            'ORCL': 'Oracle Corporation',
            'CMCSA': 'Comcast Corporation',
            'NKE': 'Nike Inc.',
            'COST': 'Costco Wholesale Corp.',
            'T': 'AT&T Inc.',
            'VZ': 'Verizon Communications Inc.',
            'MRK': 'Merck & Co. Inc.',
            'PEP': 'PepsiCo Inc.',
            'KO': 'Coca-Cola Co.',
            'ABT': 'Abbott Laboratories',
            'TMO': 'Thermo Fisher Scientific Inc.',
            'CVX': 'Chevron Corporation',
            'XOM': 'Exxon Mobil Corporation',
            'BA': 'Boeing Co.',
            'GE': 'General Electric Co.',
            'F': 'Ford Motor Co.',
            'GM': 'General Motors Co.',
            'UBER': 'Uber Technologies Inc.',
            'LYFT': 'Lyft Inc.',
            'SNAP': 'Snap Inc.',
            'TWTR': 'Twitter Inc.',
            'SQ': 'Block Inc. (Square)',
            'SHOP': 'Shopify Inc.',
            'SPOT': 'Spotify Technology S.A.',
            'ZM': 'Zoom Video Communications Inc.',
        }

        query_upper = query.upper()
        results = []

        # Search in common stocks first
        for symbol, name in common_stocks.items():
            if query_upper in symbol or query_upper in name.upper():
                results.append({
                    "symbol": symbol,
                    "name": name,
                    "type": "EQUITY",
                    "exchange": "NASDAQ/NYSE"
                })

        # If exact match in query, try to fetch it
        if len(results) == 0 or query_upper not in [r['symbol'] for r in results]:
            try:
                ticker = yf.Ticker(query_upper)
                info = ticker.info
                long_name = info.get('longName', info.get('shortName', query_upper))
                if long_name and long_name != query_upper:
                    results.insert(0, {
                        "symbol": query_upper,
                        "name": long_name,
                        "type": info.get('quoteType', 'EQUITY'),
                        "exchange": info.get('exchange', 'Unknown')
                    })
            except:
                pass

        return {"results": results[:10]}  # Return top 10 matches
    except Exception as e:
        print(f"Search error: {e}")
        return {"results": []}

@app.get("/api/market/overview")
def get_market_overview():
    try:
        indices = {
            "^GSPC": "S&P 500",
            "^IXIC": "Nasdaq",
            "^DJI": "Dow Jones"
        }

        overview = []
        for symbol, name in indices.items():
            ticker = yf.Ticker(symbol)
            info = ticker.info
            current_price = info.get('regularMarketPrice', 0)
            previous_close = info.get('previousClose', current_price)
            change_percent = ((current_price - previous_close) / previous_close * 100) if previous_close else 0

            overview.append({
                "name": name,
                "price": current_price,
                "change": change_percent
            })

        return {"indices": overview}
    except Exception as e:
        return {"indices": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
