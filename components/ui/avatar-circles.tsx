"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface Avatar {
  imageUrl?: string;
  profileUrl?: string;
  name: string;
}

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatars: Avatar[];
  size?: number;
}

const AvatarCircles = ({
  numPeople,
  className,
  avatars,
  size = 40,
}: AvatarCirclesProps) => {
  function getInitials(name: string) {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatars.map((avatar, index) => (
        <div
          key={index}
          className="relative"
        >
          {avatar.imageUrl ? (
            <a
              href={avatar.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                className="rounded-full border-2 border-white dark:border-gray-800"
                src={avatar.imageUrl}
                width={size}
                height={size}
                alt={`Avatar ${avatar.name}`}
                style={{ width: size, height: size }}
              />
            </a>
          ) : (
            <div
              className="flex items-center justify-center rounded-full border-2 border-white bg-gray-100 dark:border-gray-800 dark:bg-gray-700"
              style={{ width: size, height: size }}
            >
              <span className="text-sm font-medium">
                {getInitials(avatar.name)}
              </span>
            </div>
          )}
        </div>
      ))}
      {(numPeople ?? 0) > 0 && (
        <a
          className="flex items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
          style={{ width: size, height: size }}
          href="#"
        >
          +{numPeople}
        </a>
      )}
    </div>
  );
};

export default AvatarCircles;
