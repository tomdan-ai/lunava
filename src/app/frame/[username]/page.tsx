import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { APP_URL, APP_NAME, APP_DESCRIPTION } from "~/lib/constants";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  
  const frameMetadata = {
    "fc:frame": "vNext",
    "fc:frame:image": `${APP_URL}/api/frame-image?type=welcome`,
    "fc:frame:button:1": "Generate Card",
    "fc:frame:button:1:action": "post",
    "fc:frame:button:2": "Open Mini App", 
    "fc:frame:button:2:action": "post_redirect",
    "fc:frame:input:text": "Enter Farcaster username",
    "fc:frame:post_url": `${APP_URL}/api/frame?username=${username}`,
  };

  return {
    title: `${APP_NAME} - Generate Profile Card for @${username}`,
    description: `Create a beautiful profile card for @${username} on Farcaster`,
    openGraph: {
      title: `${APP_NAME} - @${username}`,
      description: `Create a beautiful profile card for @${username}`,
      images: [`${APP_URL}/api/generate-card?username=${username}`],
    },
    other: frameMetadata,
  };
}

export default function FramePage() {
  // Redirect to home page when accessed directly
  redirect("/");
}