import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getNeynarUser } from '~/lib/neynar';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');

  const user = fid ? await getNeynarUser(Number(fid)) : null;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col justify-center items-center relative bg-gradient-to-br from-purple-600 to-purple-800">
        {user?.pfp_url && (
          <div tw="flex w-80 h-80 rounded-full overflow-hidden mb-6 border-8 border-white shadow-2xl">
            <img src={user.pfp_url} alt="Profile" tw="w-full h-full object-cover" />
          </div>
        )}
        <h1 tw="text-6xl text-white font-bold text-center mb-4">
          {user?.display_name || user?.username || 'Lunava'}
        </h1>
        <p tw="text-3xl text-white opacity-90 text-center mb-6">
          🎨 Generate Beautiful Profile Cards
        </p>
        <div tw="flex bg-white rounded-2xl px-8 py-4">
          <p tw="text-2xl text-purple-600 font-semibold">
            Powered by Farcaster
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800, // Fixed: 3:2 ratio for proper frame display
    }
  );
}