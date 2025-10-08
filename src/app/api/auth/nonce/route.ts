import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Neynar API key is not configured' },
        { status: 500 }
      );
    }

    // Make direct API call instead of using deprecated getNeynarClient
    const response = await fetch('https://api.neynar.com/v2/farcaster/auth/nonce', {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching nonce:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nonce' },
      { status: 500 }
    );
  }
}