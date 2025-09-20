import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'StreamSpark - Ignite your live stream with instant fan support',
  description: 'A Base Mini App for live streamers to easily receive instant and recurring tips from their viewers, fostering community engagement.',
  openGraph: {
    title: 'StreamSpark',
    description: 'Ignite your live stream with instant fan support',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/og`,
    'fc:frame:button:1': 'Start Tipping',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/frame`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
