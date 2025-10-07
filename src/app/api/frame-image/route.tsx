import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'welcome';

    if (type === 'welcome') {
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
              padding: '80px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '32px',
                padding: '80px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 24px 0',
                  lineHeight: '1.1',
                }}
              >
                🎨 Lunava
              </h1>
              <p
                style={{
                  fontSize: '32px',
                  color: '#6b7280',
                  margin: '0 0 48px 0',
                  lineHeight: '1.3',
                }}
              >
                Create Beautiful Farcaster Profile Cards
              </p>
              <div
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '20px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '600',
                }}
              >
                Enter a username to get started
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } else if (type === 'input') {
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
              padding: '80px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '32px',
                padding: '80px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 24px 0',
                }}
              >
                Try Another User
              </h1>
              <p
                style={{
                  fontSize: '28px',
                  color: '#6b7280',
                  margin: '0 0 32px 0',
                }}
              >
                Enter any Farcaster username
              </p>
              <div
                style={{
                  background: '#f3f4f6',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  fontSize: '24px',
                  color: '#6b7280',
                  border: '3px dashed #8b5cf6',
                }}
              >
                e.g., vitalik, dwr, jessepollak
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Default fallback
    return new Response('Invalid type', { status: 400 });
  } catch (e: any) {
    console.error('Error generating frame image:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}