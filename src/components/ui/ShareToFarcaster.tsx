"use client";

import { useState } from "react";
import { Button } from "./Button";
import { APP_URL } from "~/lib/constants";

interface ShareToFarcasterProps {
  username?: string;
  className?: string;
}

export function ShareToFarcaster({ username, className = "" }: ShareToFarcasterProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // Generate the frame URL for sharing
      const frameUrl = username 
        ? `${APP_URL}/frame/${username}`
        : APP_URL;
      
      // Create the Warpcast share URL
      const shareText = username 
        ? `Check out this beautiful Farcaster profile card for @${username}! 🎨`
        : `Create beautiful Farcaster profile cards with Lunava! 🎨`;
      
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
      
      // Open in new window
      window.open(warpcastUrl, '_blank', 'width=600,height=600');
    } catch (error) {
      console.error('Error sharing to Farcaster:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      className={`bg-purple-600 hover:bg-purple-700 text-white ${className}`}
    >
      {isSharing ? 'Sharing...' : '📢 Share on Farcaster'}
    </Button>
  );
}