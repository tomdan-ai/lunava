import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return new Response('Username parameter is required', { status: 400 });
    }

    // Get API key from environment
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      return new Response('Neynar API key not configured', { status: 500 });
    }

    // Make direct HTTP request to Neynar API
    const neynarResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(username)}&limit=1`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    if (!neynarResponse.ok) {
      console.error('Neynar API error:', neynarResponse.statusText);
      return new Response('Failed to fetch user data', { status: neynarResponse.status });
    }

    const userData = await neynarResponse.json();
    const user = userData.result?.users?.[0];
    
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '60px',
          }}
        >
          {/* Main Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '32px',
              padding: '60px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              maxWidth: '600px',
              width: '100%',
            }}
          >
            {/* Profile Picture */}
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                padding: '6px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={user.pfp_url}
                alt={user.username}
                style={{
                  width: '148px',
                  height: '148px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* User Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '32px',
              }}
            >
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2',
                }}
              >
                {user.display_name || user.username}
              </h1>
              
              <p
                style={{
                  fontSize: '28px',
                  color: '#8b5cf6',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                }}
              >
                @{user.username}
              </p>
              
              <div
                style={{
                  background: '#f3f4f6',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '18px',
                  color: '#6b7280',
                  fontWeight: '500',
                }}
              >
                FID: {user.fid}
              </div>
            </div>

            {/* Bio */}
            {user.profile?.bio?.text && (
              <p
                style={{
                  fontSize: '22px',
                  color: '#4b5563',
                  textAlign: 'center',
                  lineHeight: '1.6',
                  margin: '0 0 32px 0',
                  maxWidth: '480px',
                }}
              >
                {user.profile.bio.text.length > 120 
                  ? user.profile.bio.text.substring(0, 120) + '...' 
                  : user.profile.bio.text}
              </p>
            )}

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '48px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0',
                  }}
                >
                  {formatNumber(user.follower_count || 0)}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: '600',
                  }}
                >
                  FOLLOWERS
                </div>
              </div>

              {user.following_count && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: '0',
                    }}
                  >
                    {formatNumber(user.following_count)}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: '600',
                    }}
                  >
                    FOLLOWING
                  </div>
                </div>
              )}
            </div>

            {/* Verified Addresses */}
            {user.verified_addresses && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                {user.verified_addresses.eth_addresses && user.verified_addresses.eth_addresses.length > 0 && (
                  <div
                    style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                      }}
                    />
                    ETH
                  </div>
                )}
                {user.verified_addresses.sol_addresses && user.verified_addresses.sol_addresses.length > 0 && (
                  <div
                    style={{
                      background: '#ede9fe',
                      color: '#7c2d12',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#a855f7',
                        borderRadius: '50%',
                      }}
                    />
                    SOL
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '32px',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                background: '#8b5cf6',
                borderRadius: '4px',
              }}
            />
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              Generated by Lunava
            </span>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 1000,
      }
    );
  } catch (e: any) {
    console.error('Error generating card image:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}