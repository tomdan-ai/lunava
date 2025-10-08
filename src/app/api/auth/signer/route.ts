import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Neynar API key is not configured' },
        { status: 500 }
      );
    }

    // Make direct API call instead of using deprecated getNeynarClient
    const response = await fetch('https://api.neynar.com/v2/farcaster/signer', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
    }

    const signer = await response.json();
    return NextResponse.json(signer);
  } catch (error) {
    console.error('Error fetching signer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signer' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const signerUuid = searchParams.get('signerUuid');

  if (!signerUuid) {
    return NextResponse.json(
      { error: 'signerUuid is required' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Neynar API key is not configured' },
        { status: 500 }
      );
    }

    // Make direct API call instead of using deprecated getNeynarClient
    const response = await fetch(`https://api.neynar.com/v2/farcaster/signer?signerUuid=${encodeURIComponent(signerUuid)}`, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
    }

    const signer = await response.json();
    return NextResponse.json(signer);
  } catch (error) {
    console.error('Error fetching signed key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signed key' },
      { status: 500 }
    );
  }
}
