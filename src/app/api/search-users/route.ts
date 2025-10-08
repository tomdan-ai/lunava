import { NextResponse } from 'next/server';
import { searchNeynarUsers } from '~/lib/neynar';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // Validate query parameter
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return NextResponse.json(
      { error: 'Valid query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const users = await searchNeynarUsers(query.trim());
    return NextResponse.json({ users });
  } catch (error) {
    // Enhanced error logging with more context
    console.error('Failed to search users:', {
      query,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to search users. Please check your Neynar API configuration.' },
      { status: 500 }
    );
  }
}