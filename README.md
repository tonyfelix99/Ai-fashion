# AI Fashion Fit MVP

An AI-powered fashion application featuring virtual try-on technology, personalized outfit recommendations based on body shape and skin tone analysis using Gemini AI.

## ⚠️ Security Notice

**This is a demonstration/MVP application only.** It contains security limitations that make it unsuitable for production use. See [SECURITY.md](./SECURITY.md) for details.

## Features

### User Features
- **Google Authentication** - Sign in with your Google account via Firebase
- **AI Profile Analysis** - Upload your photo for AI-powered body shape and skin tone detection
- **Smart Recommendations** - Browse clothing models filtered by your body shape
- **Fabric Matching** - Explore fabrics that complement your skin tone
- **Virtual Try-On** - Generate AI-powered images of yourself in different outfit combinations (4 models × 4 fabrics)
- **Shopping Cart** - Add favorite outfits to cart and checkout

### Admin Features
- **Dashboard** - View platform statistics and analytics
- **Model Management** - Add and manage clothing designs
- **Fabric Management** - Add and manage fabric options
- **Content Control** - Full CRUD operations for inventory

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS + Shadcn UI
- TanStack Query for state management
- Wouter for routing
- Firebase Authentication & Storage

### Backend
- Node.js with Express
- TypeScript
- In-memory storage (demo only - use PostgreSQL for production)
- Gemini AI API for image analysis and generation

## Setup Instructions

### Prerequisites
- Node.js 20+
- Firebase project
- Gemini API key

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Google Sign-in in Authentication → Sign-in method

2. **Add Authorized Domains**
   - In Firebase Console → Authentication → Settings → Authorized domains
   - Add your Replit domain (e.g., `your-repl-name.username.replit.dev`)
   - This is **required** to fix "auth/unauthorized-domain" errors

3. **Enable Firebase Storage**
   - Go to Storage in Firebase Console
   - Click "Get Started" and enable it with default rules

### Environment Variables

The following environment variables are already configured:

```
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### Installation

```bash
npm install
npm run dev
```

The application will run on `http://localhost:5000`

## Usage

1. **Sign In** - Use the Google Sign-In button on the landing page
2. **Create Profile** - Navigate to Profile and upload your photo
3. **AI Analysis** - Click "Upload & Analyze" to get AI-powered body shape and skin tone analysis
4. **Browse Models** - Explore clothing designs matched to your body shape
5. **Browse Fabrics** - Discover fabrics that complement your skin tone
6. **Virtual Try-On** - Select up to 4 models and 4 fabrics, then generate AI try-on images
7. **Shop** - Add favorite combinations to cart and checkout

### Admin Access

To test admin features, you need to manually set a user's role to "admin" in the storage. For production, implement proper role management.

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── lib/          # Utilities (Firebase, Query Client)
│   │   └── pages/        # Page components
├── server/                # Backend Express application
│   ├── lib/              # Server utilities
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic (AI service)
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage interface
└── shared/               # Shared types and schemas
    └── schema.ts         # TypeScript types and Zod schemas
```

## API Endpoints

### Public
- `POST /api/auth/sync` - Sync Firebase user
- `GET /api/models` - Get all clothing models
- `GET /api/fabrics` - Get all fabrics

### Protected (Requires Auth)
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `POST /api/ai/analyze-photo` - Analyze uploaded photo
- `POST /api/trials/generate` - Generate virtual try-ons
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:id` - Remove from cart
- `POST /api/orders/checkout` - Checkout cart

### Admin Only
- `GET /api/admin/stats` - Get platform statistics
- `POST /api/admin/models` - Create clothing model
- `POST /api/admin/fabrics` - Create fabric

## Development Notes

- The application seeds 8 models and 8 fabrics on startup
- Virtual try-on uses Gemini's image generation API
- All user photos must be uploaded to Firebase Storage
- Admin routes require the user's role to be set to "admin"

## Production Considerations

Before deploying to production, you MUST:

1. Implement proper Firebase Admin SDK token verification
2. Replace in-memory storage with PostgreSQL
3. Add rate limiting and security headers
4. Implement proper error handling and logging
5. Set up HTTPS/SSL certificates
6. Review and fix all items in [SECURITY.md](./SECURITY.md)

## License

MIT License - This is demo/educational code only

## Disclaimer

This application uses AI for image analysis and generation. Results may vary and should not be considered professional styling advice. Always consult with fashion professionals for important decisions.
