# StockPulse Setup Guide

## Prerequisites
- Node.js (v16+)
- Python (3.8+)
- Firebase account
- Stripe account (for payments)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in the backend directory:
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

5. Run the backend server:
```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the frontend directory (copy from `.env.example`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google providers
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Add security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the config values to your `.env` file

## Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys:
   - Go to Developers > API keys
   - Copy Publishable key to frontend `.env`
   - Copy Secret key to backend `.env`
3. Create Products and Prices:
   - Go to Products
   - Create two products:
     - **Premium**: $9.99/month (note the price ID as `price_premium_monthly`)
     - **Pro**: $29.99/month (note the price ID as `price_pro_monthly`)
4. Set up Webhooks:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe-webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy webhook secret to backend `.env`

## Subscription Tiers

### Free Tier
- 5 watchlist stocks
- Basic stock data
- Daily news updates
- Community support

### Premium Tier ($9.99/month)
- 25 watchlist stocks
- Real-time stock data
- Advanced technical indicators
- Unlimited news access
- Email alerts
- Priority support

### Pro Tier ($29.99/month)
- Unlimited watchlist stocks
- Real-time stock data
- Advanced technical indicators
- Unlimited news access
- Custom price alerts
- AI-powered insights
- Portfolio analytics
- API access
- Dedicated support

## Testing Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

## Deployment

### Backend (Railway/Render/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy

## Troubleshooting

### Firebase Authentication Issues
- Ensure authorized domains are configured in Firebase Console
- Check that API keys are correctly set in `.env`

### Stripe Payment Issues
- Verify webhook is receiving events
- Check that price IDs match your Stripe products
- Ensure webhook secret is correct

### CORS Issues
- Add your frontend URL to backend CORS origins
- For production, update `origins` in `main.py`

## Support

For issues and questions, please open an issue on GitHub.
