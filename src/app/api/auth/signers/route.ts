import { NextResponse } from 'next/server';

const requiredParams = ['message', 'signature'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string | null> = {};
  for (const param of requiredParams) {
    params[param] = searchParams.get(param);
    if (!params[param]) {
      return NextResponse.json(
        {
          error: `${param} parameter is required`,
        },
        { status: 400 }
      );
    }
  }

  const message = params.message as string;
  const signature = params.signature as string;

  try {
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

    return NextResponse.json({
      signers,
    });
  } catch (error) {
    console.error('Error fetching signers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signers' },
      { status: 500 }
    );
  }
}
