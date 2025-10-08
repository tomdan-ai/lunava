"use client";

import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/input";
import { ProfileCard } from "~/components/ui/ProfileCard";
import { ShareButton } from "~/components/ui/Share";
import { APP_URL } from "~/lib/constants";

interface UserProfile {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  following_count?: number;
  verified_addresses?: {
    eth_addresses?: string[];
    sol_addresses?: string[];
  };
}

export function HomeTab() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [downloadingImage, setDownloadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Username is required");
      return;
    }
    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const response = await fetch(
        `/api/search-users?q=${encodeURIComponent(username)}`
      );
      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();

      if (data.users && data.users.length > 0) {
        const foundUser = data.users[0];
        setUser(foundUser);
      } else {
        setError("User not found");
      }
    } catch (apiError) {
      console.error("API Error:", apiError);
      setError(
        "Failed to fetch user data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!user) return;

    setDownloadingImage(true);
    try {
      const imageUrl = `${APP_URL}/api/generate-card?username=${encodeURIComponent(
        user.username
      )}`;

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${user.username}-farcaster-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image");
    } finally {
      setDownloadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🎨 Lunava
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create beautiful profile cards for any Farcaster user
        </p>
      </div>

      {/* Search Form */}
      {!user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Farcaster Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username (e.g., vitalik, dwr, jessepollak)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Card...</span>
              </div>
            ) : (
              "🎨 Generate Profile Card"
            )}
          </Button>
        </form>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        </div>
      )}

      {/* Success State - Show Profile Card */}
      {user && (
        <div className="space-y-6">
          <ProfileCard user={user} className="mx-auto" />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Share Actions - Fixed to use correct props */}
              <ShareButton
                buttonText="📢 Share on Farcaster"
                cast={{
                  text: `Check out this beautiful profile card for @${user.username}! 🎨`,
                  embeds: [`${APP_URL}/api/generate-card?username=${user.username}`],
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              />
            </div>

            {/* Download Button */}
            <button
              onClick={downloadImage}
              disabled={downloadingImage}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {downloadingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Download Image</span>
                </>
              )}
            </button>

            {/* Secondary Action */}
            <button
              onClick={() => setUser(null)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Generate Another Card
            </button>
          </div>

          {/* Frame Preview Link */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Direct image link (800x1000px, optimized for social sharing):
            </p>
            <a
              href={`${APP_URL}/api/generate-card?username=${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-xs break-all"
            >
              {APP_URL}/api/generate-card?username={user.username}
            </a>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!user && !loading && (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter any Farcaster username to generate a beautiful profile card
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Perfect for sharing on social media or downloading as an image
          </p>
        </div>
      )}
    </div>
  );
}