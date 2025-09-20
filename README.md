# StreamSpark

> Ignite your live stream with instant fan support

StreamSpark is a Base Mini App that enables live streamers to receive instant and recurring tips from their viewers through Farcaster frames and Base Wallet integrations.

## Features

### Core Features
- **Instant Tip Jar**: One-click tipping with predefined or custom amounts
- **Recurring Support Tiers**: Monthly subscriptions with different benefit levels
- **On-Screen Tip Notifications**: Real-time visual celebrations of tips
- **Tipping Milestones & Rewards**: Gamified goals and streamer achievements
- **Farcaster Frame Integration**: Seamless experience within Farcaster feeds
- **Base Wallet Integration**: Secure, gas-efficient transactions on Base

### Business Model
- Micro-transactions with 5% platform fee
- Subscription tiers: Fan ($10/month), Super Fan ($25/month), VIP ($50/month)
- Revenue from both one-time tips and recurring subscriptions

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL, Prisma ORM
- **Blockchain**: Base Network, Coinbase Wallet SDK
- **Social**: Farcaster Frames API
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Deployment**: Vercel/Netlify ready

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Base Wallet (for testing transactions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/0c2bb838-ed7e-4a1b-a076-04cac6a3f636.git
   cd streamspark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/streamspark"
   JWT_SECRET="your-super-secret-jwt-key"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Streamer**: Streamer profiles and wallet addresses
- **Viewer**: User profiles who can tip and subscribe
- **Tip**: Individual tip transactions
- **Subscription**: Recurring payment subscriptions
- **Milestone**: Achievement goals for streamers
- **Notification**: In-app notifications

## API Documentation

### Authentication Endpoints

#### POST /api/auth
Authenticate a user via Farcaster or wallet address.

**Request Body:**
```json
{
  "type": "farcaster",
  "context": {
    "user": {
      "fid": 123,
      "username": "alice",
      "displayName": "Alice",
      "pfpUrl": "https://..."
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "type": "viewer",
      "walletAddress": "0x...",
      "farcasterUsername": "alice"
    },
    "token": "jwt_token_here"
  }
}
```

### Tip Endpoints

#### POST /api/tips
Create a new tip transaction.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "streamerId": "streamer_wallet_or_username",
  "viewerId": "viewer_wallet",
  "amount": 5.0,
  "currency": "ETH",
  "message": "Great stream!"
}
```

#### GET /api/tips
Get tips for a streamer.

**Query Parameters:**
- `streamerId`: Streamer identifier
- `limit`: Number of tips to return (default: 10)

### Subscription Endpoints

#### POST /api/subscriptions
Create a new subscription.

**Request Body:**
```json
{
  "streamerId": "streamer_wallet",
  "viewerId": "viewer_wallet",
  "tierName": "Fan",
  "amount": 10.0,
  "frequency": "MONTHLY"
}
```

#### GET /api/subscriptions
Get subscriptions for a streamer or viewer.

### Streamer Endpoints

#### POST /api/streamers
Create a new streamer profile.

**Request Body:**
```json
{
  "farcasterUsername": "streamer",
  "baseWalletAddress": "0x...",
  "displayName": "Streamer Name",
  "profilePictureUrl": "https://...",
  "bio": "About the streamer"
}
```

#### GET /api/streamers
Get streamer information.

**Query Parameters:**
- `id`: Streamer ID, username, or wallet address
- `includeStats`: Include statistics (default: false)

### Transaction Endpoints

#### POST /api/transactions
Process wallet transactions.

**Query Parameters:**
- `type`: "tip" or "subscription"

**Request Body (for tips):**
```json
{
  "to": "0x...",
  "amount": 5.0,
  "message": "Keep it up!"
}
```

### Webhook Endpoints

#### POST /api/webhooks
Receive external webhook events (transaction confirmations, subscription renewals).

**Headers:**
```
x-webhook-signature: <signature>
```

### Farcaster Frame Endpoints

#### POST /api/frame
Handle Farcaster frame interactions.

**Query Parameters:**
- `streamer`: Streamer identifier

#### GET /api/og
Generate dynamic Open Graph images for frames.

**Query Parameters:**
- `action`: "tip", "success", "subscribe", "stats", etc.
- `amount`: Tip amount
- `streamer`: Streamer identifier

## Farcaster Frame Integration

### Frame URL Structure
```
https://yourapp.com/api/frame?streamer=streamer_username
```

### Frame Actions
1. **Start Tipping**: Shows tip amount options (1, 5, 10 ETH)
2. **Subscribe**: Shows subscription tiers (Fan, Super Fan)
3. **View Stats**: Shows streamer statistics
4. **Custom Amount**: Allows custom tip amounts

### Frame Images
Dynamic SVG images are generated based on the current frame state:
- Default: Welcome screen with tip jar
- Tip selection: Amount selection interface
- Success: Confirmation with tip amount
- Subscribe: Subscription tier selection
- Stats: Streamer statistics display

## Base Wallet Integration

### Supported Operations
- **Tip Transactions**: Send ETH to streamer wallet
- **Subscription Setup**: Create recurring payment agreements
- **Balance Checks**: Verify wallet balances
- **Transaction History**: Track all transactions

### Coinbase Wallet SDK
The app integrates with Coinbase Wallet SDK for:
- Wallet connection
- Transaction signing
- Gas estimation
- Network switching to Base

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to Vercel/Netlify

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] Coinbase Wallet app registered
- [ ] Farcaster app registered
- [ ] Webhook endpoints secured
- [ ] Rate limiting configured
- [ ] Monitoring and logging set up

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up PostgreSQL database (e.g., Neon, Supabase)
4. Deploy automatically on git push

## Development

### Project Structure
```
streamspark/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # React components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── config.ts         # Configuration
│   ├── db.ts            # Database connection
│   ├── errors.ts        # Error handling
│   ├── milestones.ts    # Milestone logic
│   ├── models.ts        # Database models
│   ├── notifications.ts # Notification system
│   ├── types.ts         # TypeScript types
│   ├── utils.ts         # Utility functions
│   └── wallet.ts        # Wallet integration
├── prisma/               # Database schema
└── public/              # Static assets
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@streamspark.app
- Discord: [StreamSpark Community](https://discord.gg/streamspark)
- Twitter: [@StreamSparkApp](https://twitter.com/streamspark)

## Roadmap

### Phase 1 (Current)
- ✅ Basic tipping functionality
- ✅ Farcaster frame integration
- ✅ Base wallet integration
- ✅ Subscription system
- ✅ Milestone achievements

### Phase 2 (Upcoming)
- 🔄 Advanced analytics dashboard
- 🔄 Custom tip amounts
- 🔄 Multi-currency support
- 🔄 Stream overlay integration
- 🔄 Mobile app companion

### Phase 3 (Future)
- 🔄 NFT rewards system
- 🔄 Creator marketplace
- 🔄 Advanced subscription features
- 🔄 Integration with streaming platforms

---

Built with ❤️ on Base

