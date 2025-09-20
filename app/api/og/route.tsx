import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'default';
    const amount = searchParams.get('amount') || '';

    // Generate SVG image based on action
    let svgContent = '';
    
    switch (action) {
      case 'tip':
        svgContent = `
          <svg width="800" height="420" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#3730a3;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#4338ca;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="jar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="800" height="420" fill="url(#bg)"/>
            <text x="400" y="80" text-anchor="middle" fill="white" font-size="36" font-weight="bold">StreamSpark</text>
            <text x="400" y="120" text-anchor="middle" fill="#a78bfa" font-size="18">Choose your tip amount</text>
            
            <!-- Tip Jar -->
            <ellipse cx="400" cy="280" rx="80" ry="100" fill="url(#jar)" stroke="#fbbf24" stroke-width="4"/>
            <ellipse cx="400" cy="200" rx="85" ry="15" fill="#e5e7eb"/>
            
            <!-- Heart -->
            <circle cx="400" cy="280" r="25" fill="#ef4444"/>
            <text x="400" y="290" text-anchor="middle" fill="white" font-size="24">♥</text>
            
            <!-- Dollar sign -->
            <text x="460" y="240" text-anchor="middle" fill="#10b981" font-size="24" font-weight="bold">$</text>
            
            <text x="400" y="380" text-anchor="middle" fill="white" font-size="16">Select an amount to tip the streamer</text>
          </svg>
        `;
        break;
        
      case 'success':
        svgContent = `
          <svg width="800" height="420" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#065f46;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#047857;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="800" height="420" fill="url(#bg)"/>
            <text x="400" y="80" text-anchor="middle" fill="white" font-size="36" font-weight="bold">StreamSpark</text>
            <text x="400" y="120" text-anchor="middle" fill="#6ee7b7" font-size="18">Tip sent successfully!</text>
            
            <!-- Success checkmark -->
            <circle cx="400" cy="210" r="50" fill="#10b981" stroke="white" stroke-width="4"/>
            <path d="M 375 210 L 390 225 L 425 190" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
            
            <text x="400" y="300" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${amount} ETH Sent! 🎉</text>
            <text x="400" y="340" text-anchor="middle" fill="#6ee7b7" font-size="16">Thank you for supporting the streamer!</text>
            <text x="400" y="380" text-anchor="middle" fill="white" font-size="14">Your tip helps keep the stream going</text>
          </svg>
        `;
        break;
        
      default:
        svgContent = `
          <svg width="800" height="420" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#3730a3;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#4338ca;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="jar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f3f4f6;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="fill" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#fde047;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="800" height="420" fill="url(#bg)"/>
            
            <!-- Title -->
            <text x="400" y="60" text-anchor="middle" fill="white" font-size="42" font-weight="bold">StreamSpark</text>
            <text x="400" y="90" text-anchor="middle" fill="#fbbf24" font-size="16">Ignite your live stream with instant fan support</text>
            
            <!-- Tip Jar -->
            <ellipse cx="400" cy="250" rx="80" ry="100" fill="url(#jar)" stroke="#fbbf24" stroke-width="4"/>
            <ellipse cx="400" cy="170" rx="85" ry="15" fill="#e5e7eb"/>
            
            <!-- Jar Fill -->
            <ellipse cx="400" cy="290" rx="75" ry="60" fill="url(#fill)"/>
            
            <!-- Heart -->
            <circle cx="400" cy="250" r="25" fill="#ef4444"/>
            <text x="400" y="260" text-anchor="middle" fill="white" font-size="24">♥</text>
            
            <!-- Dollar sign -->
            <text x="460" y="210" text-anchor="middle" fill="#10b981" font-size="24" font-weight="bold">$</text>
            
            <!-- Floating coins -->
            <circle cx="350" cy="220" r="6" fill="#fbbf24"/>
            <circle cx="450" cy="280" r="4" fill="#fde047"/>
            
            <text x="400" y="380" text-anchor="middle" fill="white" font-size="18">Start tipping your favorite streamers!</text>
            <text x="400" y="405" text-anchor="middle" fill="#a78bfa" font-size="14">Built on Base • Powered by MiniKit</text>
          </svg>
        `;
    }

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    console.error('OG image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
