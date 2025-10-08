import { NextResponse } from 'next/server';
import { mnemonicToAccount } from 'viem/accounts';
import {
  SIGNED_KEY_REQUEST_TYPE,
  SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
} from '~/lib/constants';

const postRequiredFields = ['signerUuid', 'publicKey'];

export async function POST(request: Request) {
  const body = await request.json();

  // Validate required fields
  for (const field of postRequiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }

  const { signerUuid, publicKey, redirectUrl } = body;

  if (redirectUrl && typeof redirectUrl !== 'string') {
    return NextResponse.json(
      { error: 'redirectUrl must be a string' },
      { status: 400 }
    );
  }

  try {
    // Get the app's account from seed phrase
    const seedPhrase = process.env.SEED_PHRASE;
    const shouldSponsor = process.env.SPONSOR_SIGNER === 'true';
    const apiKey = process.env.NEYNAR_API_KEY;

    if (!seedPhrase || !apiKey) {
      return NextResponse.json(
        { error: 'App configuration missing (SEED_PHRASE, NEYNAR_API_KEY, or FID)' },
        { status: 500 }
      );
    }

    const account = mnemonicToAccount(seedPhrase);

    // Make direct API call to lookup user by custody address
    const userResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/custody-address?custody_address=${account.address}`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`Failed to lookup user by custody address: ${userResponse.status} ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const appFid = userData.user.fid;

    // Generate deadline (24 hours from now)
    const deadline = Math.floor(Date.now() / 1000) + 86400;

    // Generate EIP-712 signature
    const signature = await account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
      },
      primaryType: 'SignedKeyRequest',
      message: {
        requestFid: BigInt(appFid),
        key: publicKey,
        deadline: BigInt(deadline),
      },
    });

    // Make direct API call to register signed key
    const registerResponse = await fetch('https://api.neynar.com/v2/farcaster/signer/signed_key', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_fid: appFid,
        deadline,
        signature,
        signer_uuid: signerUuid,
        ...(redirectUrl && { redirect_url: redirectUrl }),
        ...(shouldSponsor && { sponsor: { sponsored_by_neynar: true } }),
      }),
    });

    if (!registerResponse.ok) {
      throw new Error(`Failed to register signed key: ${registerResponse.status} ${registerResponse.statusText}`);
    }

    const signer = await registerResponse.json();
    return NextResponse.json(signer);
  } catch (error) {
    console.error('Error registering signed key:', error);
    return NextResponse.json(
      { error: 'Failed to register signed key' },
      { status: 500 }
    );
  }
}
