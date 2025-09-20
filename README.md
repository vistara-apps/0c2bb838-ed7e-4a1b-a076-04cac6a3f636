# StreamSpark 🎮⚡

> Ignite your live stream with instant fan support

StreamSpark is a Base Mini App that enables live streamers to easily receive instant and recurring tips from their viewers, fostering community engagement through seamless Web3 interactions.

## Features

### 🎯 Core Features
- **Instant Tip Jar** - One-click tipping with predefined or custom amounts
- **Recurring Support Tiers** - Weekly/monthly subscription support for fans
- **On-Screen Tip Notifications** - Real-time tip celebrations and milestones
- **Tipping Milestones & Rewards** - Gamified goals and community achievements

### 🛠 Technical Features
- Built with Next.js 15 and App Router
- Integrated with Base blockchain via MiniKit
- OnchainKit components for wallet interactions
- Mobile-first responsive design
- Real-time tip tracking and notifications
- Farcaster Frame integration

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OnchainKit API key

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd streamspark
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture

### Data Models

**Streamer**
- `streamerId` - Unique identifier
- `farcasterUsername` - Farcaster handle
- `baseWalletAddress` - Base wallet address
- `displayName` - Display name
- `profilePictureUrl` - Profile image URL

**Tip**
- `tipId` - Unique tip identifier
- `streamerId` - Associated streamer
- `viewerId` - Tipper identifier
- `amount` - Tip amount in ETH
- `currency` - Currency type
- `timestamp` - When tip was sent
- `message` - Optional tip message

**Subscription**
- `subscriptionId` - Unique subscription ID
- `streamerId` - Associated streamer
- `viewerId` - Subscriber identifier
- `tierName` - Subscription tier
- `amount` - Recurring amount
- `frequency` - weekly/monthly
- `startDate` - Subscription start
- `endDate` - Optional end date

### Component Architecture

```
components/
├── StreamerProfileHeader.tsx    # Streamer profile display
├── TipButton.tsx               # Tip interaction buttons
├── SubscriptionCard.tsx        # Subscription tier cards
├── NotificationBanner.tsx      # Real-time notifications
└── TipJar.tsx                 # Visual tip jar with animations
```

### User Flows

**Viewer Tipping Flow:**
1. Viewer sees StreamSpark frame in Farcaster feed
2. Clicks 'Tip' button
3. Base Wallet prompts for transaction confirmation
4. Transaction processed on Base
5. Tip notification appears for streamer
6. Optional message added

**Streamer Setup Flow:**
1. Streamer connects Base Wallet
2. Enters display name and profile info
3. Configures tip amounts and subscription tiers
4. Gets shareable StreamSpark frame link

## Design System

### Colors
- **Background**: `hsl(210, 30%, 98%)`
- **Accent**: `hsl(40, 95%, 55%)` 
- **Primary**: `hsl(204, 85%, 45%)`
- **Surface**: `hsl(210, 30%, 100%)`
- **Text Primary**: `hsl(210, 20%, 15%)`
- **Text Secondary**: `hsl(210, 15%, 45%)`

### Components
- **TipButton** - Variants: default, processing, disabled
- **SubscriptionCard** - Variants: active, expired
- **NotificationBanner** - Variants: newTip, milestoneReached
- **StreamerProfileHeader** - Variant: basic

## API Integration

### Base Wallet SDK
- Purpose: Wallet interactions for tips and subscriptions
- Docs: [Base Wallet SDK](https://docs.base.org/wallet/sdk/quickstart)

### Farcaster Frames
- Purpose: Interactive frames within Farcaster feeds
- Docs: [Farcaster Frames](https://github.com/farcasterxyz/protocol/blob/main/docs/frame.md)

### Frame Endpoints
- `GET /api/frame` - Frame metadata
- `POST /api/frame` - Frame interactions
- `GET /api/og` - Dynamic OG images

## Development

### Project Structure
```
streamspark/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx      # App providers
├── components/            # React components
├── lib/                  # Utilities and types
│   ├── constants.ts      # App constants
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

### Key Technologies
- **Next.js 15** - React framework with App Router
- **MiniKit** - Base Mini App SDK
- **OnchainKit** - Coinbase's Web3 components
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety and developer experience
- **Lucide React** - Icon library

## Deployment

### Environment Setup
Ensure these environment variables are set:
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

### Build and Deploy
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Join our community discussions
- Check the [Base Mini Apps documentation](https://docs.base.org/mini-apps/)

---

**StreamSpark** - Built with ❤️ for the streaming community on Base
