import type { Metadata } from 'next';
import { Montserrat, Lato } from "next/font/google";
import '~/app/globals.css';
import { Providers } from '~/app/providers';
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '~/lib/constants';
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
});

// Mini App embed configuration
const miniappEmbed = {
  version: "1",
  imageUrl: `${APP_URL}/home.png`, // Fixed: Using API route instead of static file
  button: {
    title: "🎨 Generate Card",
    action: {
      type: "launch_miniapp", // Fixed: Using launch_miniapp instead of launch_frame
      name: APP_NAME,
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#8b5cf6"
    }
  }
};

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/api/thumbnail`,
        width: 1200,
        height: 800,
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
    images: [`${APP_URL}/api/thumbnail`],
  },
  other: {
    'fc:miniapp': JSON.stringify(miniappEmbed),
    'fc:frame': JSON.stringify(miniappEmbed), // Backward compatibility
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${lato.variable}`}>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}