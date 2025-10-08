const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_API_KEY) {
  throw new Error('NEYNAR_API_KEY is not set');
}

// Define User type to match Neynar API response
export interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio: string;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
}

export async function searchNeynarUsers(query: string): Promise<User[]> {
  try {
    // Since search endpoint requires paid plan, try lookup by username instead
    // This is available on free tier
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(query)}`,
      {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // If exact username match fails, return empty array instead of throwing
      console.log(`Username lookup failed for "${query}": ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    // Return single user as array to match expected format
    return data.user ? [data.user] : [];
  } catch (error) {
    console.error('Error searching for Neynar users:', error);
    return [];
  }
}

export async function getUser(fid: number): Promise<User | null> {
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'x-api-key': NEYNAR_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.users?.[0] || null;
  } catch (error) {
    console.error('Error fetching Neynar user:', error);
    return null;
  }
}

// Alias for backwards compatibility with opengraph-image route
export const getNeynarUser = getUser;

// Add missing sendNeynarMiniAppNotification function
export async function sendNeynarMiniAppNotification({
  fid,
  title,
  body,
}: {
  fid: number;
  title: string;
  body: string;
}) {
  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/notifications', {
      method: 'POST',
      headers: {
        'x-api-key': NEYNAR_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fid,
        title,
        body,
      }),
    });

    if (!response.ok) {
      console.error('Neynar notification API error:', response.statusText);
      return { state: "error", error: response.statusText };
    }

    return { state: "success" };
  } catch (error) {
    console.error('Error sending Neynar notification:', error);
    return { state: "error", error };
  }
}

// Legacy function for backwards compatibility with other routes
export function getNeynarClient() {
  throw new Error('getNeynarClient is deprecated - use direct API calls instead');
}