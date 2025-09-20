import { NextRequest, NextResponse } from 'next/server';
import { StreamerModel, TipModel } from '@/lib/models';

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

    // Extract frame data
    const buttonIndex = untrustedData?.buttonIndex || 1;
    const fid = untrustedData?.fid;
    const castId = untrustedData?.castId;

    // Extract streamer info from URL or cast data
    const url = new URL(request.url);
    const streamerId = url.searchParams.get('streamer') || 'demo_streamer';

    let responseHtml = '';

    switch (buttonIndex) {
      case 1: // Start Tipping - Show tip amount options
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?action=tip&streamer=${streamerId}" />
              <meta property="fc:frame:button:1" content="Tip 1 ETH" />
              <meta property="fc:frame:button:2" content="Tip 5 ETH" />
              <meta property="fc:frame:button:3" content="Tip 10 ETH" />
              <meta property="fc:frame:button:4" content="Subscribe" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?streamer=${streamerId}" />
              <title>StreamSpark - Choose Tip Amount</title>
            </head>
            <body>
              <h1>Choose your tip amount</h1>
            </body>
          </html>
        `;
        break;

      case 2: // Tip 1 ETH
      case 3: // Tip 5 ETH
      case 4: // Tip 10 ETH
        const amounts = [1, 5, 10];
        const tipAmount = amounts[buttonIndex - 2];

        // Get streamer info
        let streamer;
        try {
          streamer = await StreamerModel.findByFarcasterUsername(streamerId) ||
                    await StreamerModel.findByWalletAddress(streamerId);
        } catch (error) {
          console.error('Error fetching streamer:', error);
        }

        // Create tip record (mock for now)
        if (streamer && fid) {
          try {
            // In a real implementation, this would be handled after wallet transaction
            console.log(`Tip of ${tipAmount} ETH from FID ${fid} to streamer ${streamer.id}`);
          } catch (error) {
            console.error('Error recording tip:', error);
          }
        }

        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?action=success&amount=${tipAmount}&streamer=${streamerId}" />
              <meta property="fc:frame:button:1" content="Tip Again" />
              <meta property="fc:frame:button:2" content="View Stats" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?streamer=${streamerId}" />
              <title>StreamSpark - Tip Sent!</title>
            </head>
            <body>
              <h1>Tip sent successfully!</h1>
            </body>
          </html>
        `;
        break;

      case 5: // Subscribe - Show subscription options
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?action=subscribe&streamer=${streamerId}" />
              <meta property="fc:frame:button:1" content="Fan ($10/month)" />
              <meta property="fc:frame:button:2" content="Super Fan ($25/month)" />
              <meta property="fc:frame:button:3" content="Back to Tips" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?streamer=${streamerId}" />
              <title>StreamSpark - Subscribe</title>
            </head>
            <body>
              <h1>Choose subscription tier</h1>
            </body>
          </html>
        `;
        break;

      case 6: // Fan subscription ($10/month)
      case 7: // Super Fan subscription ($25/month)
        const subAmounts = [10, 25];
        const subAmount = subAmounts[buttonIndex - 6];
        const tierName = buttonIndex === 6 ? 'Fan' : 'Super Fan';

        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?action=subscribed&amount=${subAmount}&tier=${tierName}&streamer=${streamerId}" />
              <meta property="fc:frame:button:1" content="View Benefits" />
              <meta property="fc:frame:button:2" content="Tip Extra" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?streamer=${streamerId}" />
              <title>StreamSpark - Subscribed!</title>
            </head>
            <body>
              <h1>Subscription activated!</h1>
            </body>
          </html>
        `;
        break;

      case 8: // View Stats
        let stats = { totalTips: 0, subscribers: 0 };
        try {
          if (streamer) {
            const streamerStats = await StreamerModel.getWithStats(streamer.id);
            stats = {
              totalTips: streamerStats.totalTips,
              subscribers: streamerStats.subscriberCount,
            };
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }

        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?action=stats&total=${stats.totalTips}&subs=${stats.subscribers}&streamer=${streamerId}" />
              <meta property="fc:frame:button:1" content="Send Tip" />
              <meta property="fc:frame:button:2" content="Subscribe" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?streamer=${streamerId}" />
              <title>StreamSpark - Streamer Stats</title>
            </head>
            <body>
              <h1>Streamer Statistics</h1>
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
              <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og?streamer=${streamerId}" />
              <meta property="fc:frame:button:1" content="Start Tipping" />
              <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?streamer=${streamerId}" />
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
