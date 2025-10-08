// import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/farcaster';
import { NextRequest, NextResponse } from 'next/server';
import { APP_URL } from '~/lib/constants';

// Simple frame HTML generation without external dependencies
function generateFrameHtml({
  image,
  buttons,
  postUrl,
  inputText,
}: {
  image: string;
  buttons: Array<{ label: string; action?: string }>;
  postUrl: string;
  inputText?: string;
}) {
  const buttonMeta = buttons
    .map((button, index) => {
      const buttonIndex = index + 1;
      const action = button.action || 'post';
      return `<meta property="fc:frame:button:${buttonIndex}" content="${button.label}" />
<meta property="fc:frame:button:${buttonIndex}:action" content="${action}" />`;
    })
    .join('\n');

  const inputMeta = inputText
    ? `<meta property="fc:frame:input:text" content="${inputText}" />`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${image}" />
    <meta property="fc:frame:post_url" content="${postUrl}" />
    ${buttonMeta}
    ${inputMeta}
    <meta property="og:image" content="${image}" />
    <title>Lunava Frame</title>
</head>
<body>
    <h1>Farcaster Frame</h1>
    <p>This frame generates beautiful profile cards for Farcaster users.</p>
</body>
</html>`;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => ({}));
    const searchParams = new URL(req.url).searchParams;
    const _username = searchParams.get('username') || ''; // Fixed: changed from 'username' to '_username'
    const action = searchParams.get('action') || '';

    // Extract frame data from the request body
    const buttonIndex = body.untrustedData?.buttonIndex;
    const inputText = body.untrustedData?.inputText;

    if (buttonIndex === 1 && inputText) {
      // Generate Card button clicked with username input
      const frameHtml = generateFrameHtml({
        image: `${APP_URL}/api/generate-card?username=${encodeURIComponent(inputText)}`,
        buttons: [
          { label: 'Download Image', action: 'post_redirect' },
          { label: 'Try Another User', action: 'post' },
          { label: 'Open Mini App', action: 'post_redirect' },
        ],
        postUrl: `${APP_URL}/api/frame?username=${inputText}&action=generated`,
      });

      return new NextResponse(frameHtml, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else if (buttonIndex === 2) {
      // Try Another User button clicked
      const frameHtml = generateFrameHtml({
        image: `${APP_URL}/api/frame-image?type=input`,
        buttons: [
          { label: 'Generate Card', action: 'post' },
          { label: 'Open Mini App', action: 'post_redirect' },
        ],
        postUrl: `${APP_URL}/api/frame`,
        inputText: 'Enter Farcaster username',
      });

      return new NextResponse(frameHtml, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else if (buttonIndex === 3 || (buttonIndex === 1 && action === 'generated')) {
      // Open Mini App or Download Image redirect
      return NextResponse.redirect(`${APP_URL}`, 302);
    }

    // Default state - initial frame
    const frameHtml = generateFrameHtml({
      image: `${APP_URL}/api/frame-image?type=welcome`,
      buttons: [
        { label: 'Generate Card', action: 'post' },
        { label: 'Open Mini App', action: 'post_redirect' },
      ],
      postUrl: `${APP_URL}/api/frame`,
      inputText: 'Enter Farcaster username',
    });

    return new NextResponse(frameHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Frame error:', error);
    
    // Fallback frame
    const fallbackHtml = generateFrameHtml({
      image: `${APP_URL}/api/frame-image?type=welcome`,
      buttons: [
        { label: 'Try Again', action: 'post' },
        { label: 'Open Mini App', action: 'post_redirect' },
      ],
      postUrl: `${APP_URL}/api/frame`,
      inputText: 'Enter Farcaster username',
    });

    return new NextResponse(fallbackHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

// import { NextRequest } from "next/server";
// import { getUser } from "~/lib/neynar";
// import { APP_NAME } from "~/lib/constants"; 

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const _username = searchParams.get('username'); // Prefix with underscore to indicate intentionally unused
// }