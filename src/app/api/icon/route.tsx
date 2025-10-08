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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            fontSize: '120px',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          🎨
        </div>
      </div>
    ),
    {
      width: 200,
      height: 200,
    }
  );
}