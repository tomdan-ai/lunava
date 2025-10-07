import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';

import { NextRequest, NextResponse } from 'next/server';
import { APP_URL } from '~/lib/constants';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  const searchParams = new URL(req.url).searchParams;
  const username = searchParams.get('username') || '';

  if (message?.button === 1) {
    // Generate Card button clicked
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Download Image',
            action: 'post',
          },
          {
            label: 'Try Another User',
            action: 'post',
          },
          {
            label: 'Open Mini App',
            action: 'post_redirect',
          },
        ],
        image: {
          src: `${APP_URL}/api/generate-card?username=${encodeURIComponent(username)}`,
        },
        postUrl: `${APP_URL}/api/frame?username=${username}&action=generated`,
      }),
    );
  } else if (message?.button === 2) {
    // Try Another User button clicked
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Generate Card',
            action: 'post',
          },
          {
            label: 'Open Mini App',
            action: 'post_redirect',
          },
        ],
        image: {
          src: `${APP_URL}/api/frame-image?type=input`,
        },
        input: {
          text: 'Enter Farcaster username',
        },
        postUrl: `${APP_URL}/api/frame`,
      }),
    );
  } else if (message?.button === 3) {
    // Open Mini App button clicked
    return NextResponse.redirect(`${APP_URL}`, 302);
  }

  // Default state - initial frame
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Generate Card',
          action: 'post',
        },
        {
          label: 'Open Mini App',
          action: 'post_redirect',
        },
      ],
      image: {
        src: `${APP_URL}/api/frame-image?type=welcome`,
      },
      input: {
        text: 'Enter Farcaster username',
      },
      postUrl: `${APP_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';