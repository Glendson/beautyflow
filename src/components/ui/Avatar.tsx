"use client";

import Image from "next/image";

interface AvatarProps {
  src?: string;
  initials?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  initials,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const getInitials = () => {
    if (initials) return initials;
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "?";
  };

  if (src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={name || "Avatar"}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-blue-500 to-blue-600
        text-white font-semibold flex items-center justify-center
        ${className}
      `}
    >
      {getInitials()}
    </div>
  );
}
