import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message');
    const signature = searchParams.get('signature');

    if (!message || !signature) {
      return NextResponse.json(
        { error: 'Message and signature are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Neynar API key is not configured' },
        { status: 500 }
      );
    }

    // Make direct API call instead of using deprecated getNeynarClient
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/signers?message=${encodeURIComponent(
        message
      )}&signature=${encodeURIComponent(signature)}`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Neynar API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const signers = data.signers || [];

    // Fetch user data if signers exist
    let user = null;
    if (signers && signers.length > 0 && signers[0].fid) {
      const userResponse = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${signers[0].fid}`,
        {
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        user = userData.users?.[0] || null;
      }
    }

    return NextResponse.json({
      signers,
      user,
    });
  } catch (error) {
    console.error('Error in session-signers API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signers' },
      { status: 500 }
    );
  }
}
