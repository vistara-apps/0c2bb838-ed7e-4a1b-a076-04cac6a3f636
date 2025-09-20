import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'StreamSpark Frame API',
    version: '1.0.0',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle frame button interactions
    const { untrustedData, trustedData } = body;
    
    // Process the frame action
    const buttonIndex = untrustedData?.buttonIndex || 1;
    
    let responseHtml = '';
    
    switch (buttonIndex) {
      case 1: // Start Tipping
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?action=tip" />
              <meta property="fc:frame:button:1" content="Tip 1 ETH" />
              <meta property="fc:frame:button:2" content="Tip 5 ETH" />
              <meta property="fc:frame:button:3" content="Tip 10 ETH" />
              <meta property="fc:frame:button:4" content="Custom Amount" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
              <title>StreamSpark - Choose Tip Amount</title>
            </head>
            <body>
              <h1>Choose your tip amount</h1>
            </body>
          </html>
        `;
        break;
        
      case 2: // Tip amounts
      case 3:
      case 4:
        const amounts = [1, 5, 10];
        const tipAmount = amounts[buttonIndex - 2] || 'custom';
        
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?action=success&amount=${tipAmount}" />
              <meta property="fc:frame:button:1" content="Tip Again" />
              <meta property="fc:frame:button:2" content="View Profile" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
              <title>StreamSpark - Tip Sent!</title>
            </head>
            <body>
              <h1>Tip sent successfully!</h1>
            </body>
          </html>
        `;
        break;
        
      default:
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og" />
              <meta property="fc:frame:button:1" content="Start Tipping" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
              <title>StreamSpark</title>
            </head>
            <body>
              <h1>StreamSpark - Ignite your live stream</h1>
            </body>
          </html>
        `;
    }
    
    return new NextResponse(responseHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
