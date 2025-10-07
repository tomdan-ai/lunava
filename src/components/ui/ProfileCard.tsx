"use client";

import { useState } from "react";

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

interface ProfileCardProps {
  user: UserProfile;
  className?: string;
}

export function ProfileCard({ user, className = "" }: ProfileCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className={`profile-card ${className}`}>
      {/* Card Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 p-6">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Header Section */}
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          
          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark p-1 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                {!imageLoaded && (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Loading...</span>
                  </div>
                )}
                <img
                  src={user.pfp_url}
                  alt={user.username}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </div>
            </div>
            
            {/* Verified Badge (if verified addresses exist) */}
            {user.verified_addresses && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          
          {/* Name and Username */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {user.display_name || user.username}
            </h2>
            <p className="text-primary font-medium">@{user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              FID: {user.fid}
            </p>
          </div>
        </div>
        
        {/* Bio Section */}
        {user.profile?.bio?.text && (
          <div className="relative z-10 mb-6">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-center px-2">
              {user.profile.bio.text}
            </p>
          </div>
        )}
        
        {/* Stats Section */}
        <div className="relative z-10 flex justify-center space-x-8 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatNumber(user.follower_count)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Followers
            </div>
          </div>
          
          {user.following_count && (
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatNumber(user.following_count)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Following
              </div>
            </div>
          )}
        </div>
        
        {/* Verified Addresses */}
        {user.verified_addresses && (
          <div className="relative z-10 flex justify-center space-x-2">
            {user.verified_addresses.eth_addresses && user.verified_addresses.eth_addresses.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                ETH
              </span>
            )}
            {user.verified_addresses.sol_addresses && user.verified_addresses.sol_addresses.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                SOL
              </span>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <div className="relative z-10 mt-6">
          <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
            View on Farcaster
          </button>
        </div>
        
        {/* Farcaster Badge */}
        <div className="relative z-10 flex items-center justify-center mt-4 space-x-2">
          <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Powered by Farcaster
          </span>
        </div>
      </div>
    </div>
  );
}