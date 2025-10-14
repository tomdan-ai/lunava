import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '32px',
            padding: '60px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          {/* App Icon */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '24px',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🎨
          </div>
          
          {/* App Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 16px 0',
              lineHeight: '1.1',
            }}
          >
            Lunava
          </h1>
          
          {/* App Description */}
          <p
            style={{
              fontSize: '28px',
              color: '#6b7280',
              margin: '0 0 32px 0',
              lineHeight: '1.3',
              maxWidth: '600px',
            }}
          >
            Create Beautiful Farcaster Profile Cards
          </p>
          
          {/* Feature highlights */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '16px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              🚀 Instant Generation
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              📱 High Quality
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '16px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              🎯 Easy Sharing
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800, // 3:2 aspect ratio for Mini App compatibility
      headers: {
        'Cache-Control': 'public, immutable, no-transform, max-age=3600', // Cache for 1 hour
        'Content-Type': 'image/png',
      },
    }
  );
}