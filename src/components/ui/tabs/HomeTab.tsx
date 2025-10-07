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
      setError("An error occurred while fetching the user.");
      console.error("API Error:", apiError);
    }

    setLoading(false);
  };

  const handleDownloadImage = async () => {
    if (!user) return;

    setDownloadingImage(true);
    try {
      const response = await fetch(
        `/api/generate-card?username=${encodeURIComponent(user.username)}`
      );
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${user.username}-farcaster-card.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image");
    }
    setDownloadingImage(false);
  };

  const handleShareImage = async () => {
    if (!user) return;

    try {
      const imageUrl = `/api/generate-card?username=${encodeURIComponent(
        user.username
      )}`;

      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: `${user.display_name || user.username}'s Farcaster Card`,
          text: `Check out this Farcaster profile card for @${user.username}!`,
          url: window.location.origin + imageUrl,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.origin + imageUrl);
        // Show temporary success message
        const originalError = error;
        setError("Image link copied to clipboard!");
        setTimeout(() => setError(originalError), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      setError("Failed to share image");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Farcaster Profile Cards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create beautiful profile cards for any Farcaster user
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g., dwr, vitalik)"
                className="text-center text-lg py-3"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>

            {error && (
              <div className="text-center">
                <p
                  className={`text-sm px-3 py-2 rounded-lg ${
                    error.includes("copied")
                      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                      : "text-red-500 bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="spinner w-4 h-4"></div>
                  <span>Searching...</span>
                </span>
              ) : (
                "Generate Profile Card"
              )}
            </Button>
          </form>
        </div>

        {/* Profile Card Display */}
        {user && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Card Generated! 🎉
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preview your card and download or share the image
              </p>
            </div>
            <ProfileCard user={user} />

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              {/* Primary Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleDownloadImage}
                  disabled={downloadingImage}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:transform-none"
                >
                  {downloadingImage ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="spinner w-4 h-4"></div>
                      <span>Generating...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>📥</span>
                      <span>Download</span>
                    </span>
                  )}
                </button>

                <button
                  onClick={handleShareImage}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🔗</span>
                    <span>Share</span>
                  </span>
                </button>
              </div>

              {/* Farcaster Share Button */}
              <div className="w-full">
                <ShareButton
                  buttonText="🟪 Share to Farcaster"
                  cast={{
                    text: `Check out this beautiful profile card for @${user.username}! 🎨\n\nGenerated with Lunava ✨`,
                    embeds: [
                      {
                        url: `${APP_URL}/api/generate-card?username=${user.username}`,
                      },
                    ],
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                />
              </div>

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
                href={`/api/generate-card?username=${encodeURIComponent(
                  user.username
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark text-sm font-mono break-all"
              >
                /api/generate-card?username={user.username}
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by Neynar 🪐
          </p>
        </div>
      </div>
    </div>
  );
}