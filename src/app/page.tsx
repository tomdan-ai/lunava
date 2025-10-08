import { Metadata } from "next";
import App from "./app";
import { APP_NAME, APP_DESCRIPTION, APP_URL, APP_OG_IMAGE_URL } from "~/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const miniAppEmbed = {
    version: "1",
    imageUrl: `${APP_URL}/api/opengraph-image`,
    button: {
      title: "🎨 Create Profile Card",
      action: {
        type: "launch_frame",
        name: APP_NAME,
        url: APP_URL,
        splashImageUrl: `${APP_URL}/icon.png`,
        splashBackgroundColor: "#8b5cf6"
      }
    }
  };

  return {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      url: APP_URL,
      siteName: APP_NAME,
      images: [
        {
          url: APP_OG_IMAGE_URL || `${APP_URL}/api/opengraph-image`,
          width: 1200,
          height: 630,
          alt: APP_NAME,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [APP_OG_IMAGE_URL || `${APP_URL}/api/opengraph-image`],
    },
    other: {
      "fc:miniapp": JSON.stringify(miniAppEmbed),
      // For backward compatibility
      "fc:frame": JSON.stringify(miniAppEmbed),
    },
  };
}

export default function HomePage() {
  return <App />;
}
