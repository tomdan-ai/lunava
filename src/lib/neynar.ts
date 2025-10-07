import { NeynarAPIClient, Configuration, WebhookUserCreated } from '@neynar/nodejs-sdk';
import { APP_URL } from './constants';

let neynarClient: NeynarAPIClient | null = null;

// Example usage:
// const client = getNeynarClient();
// const user = await client.lookupUserByFid(fid); 
export function getNeynarClient() {
  if (!neynarClient) {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
      throw new Error('NEYNAR_API_KEY not configured');
    }
    const config = new Configuration({ apiKey });
    neynarClient = new NeynarAPIClient(config);
  }
  return neynarClient;
}

type User = WebhookUserCreated['data'];

export async function getNeynarUser(fid: number): Promise<User | null> {
  try {
    const client = getNeynarClient();
    const usersResponse = await client.fetchBulkUsers({ fids: [fid] });
    return usersResponse.users[0];
  } catch (error) {
    console.error('Error getting Neynar user:', error);
    return null;
  }
}

export async function searchNeynarUsers(query: string): Promise<User[] | null> {
  try {
    const client = getNeynarClient();
    const searchResponse = await client.searchUser({ q: query });
    return searchResponse.result.users;
  } catch (error) {
    console.error('Error searching for Neynar users:', error);
    return null;
  }
}

type SendMiniAppNotificationResult =
  | {
      state: "error";
      error: unknown;
    }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "success" };

export async function sendNeynarMiniAppNotification({
  fid,
  title,
  body,
}: {
  fid: number;
  title: string;
  body: string;
}): Promise<SendMiniAppNotificationResult> {
  try {
    const client = getNeynarClient();
    
    if (!process.env.NEYNAR_CLIENT_ID) {
      throw new Error('NEYNAR_CLIENT_ID not configured');
    }

    await client.notifyUser({
      clientId: process.env.NEYNAR_CLIENT_ID,
      targetFid: fid,
      title,
      body,
      url: APP_URL,
    });

    return { state: "success" };
  } catch (error: any) {
    if (error?.response?.status === 429) {
      return { state: "rate_limit" };
    }
    if (error?.message?.includes('notification token')) {
      return { state: "no_token" };
    }
    return { state: "error", error };
  }
}