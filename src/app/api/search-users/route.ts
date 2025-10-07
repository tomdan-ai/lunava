import { NextResponse } from 'next/server';
import { searchNeynarUsers } from '~/lib/neynar';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const users = await searchNeynarUsers(query);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to search users:', error);
    return NextResponse.json(
      { error: 'Failed to search users. Please check your Neynar API key and try again.' },
      { status: 500 }
    );
  }
}