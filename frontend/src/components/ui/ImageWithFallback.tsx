"use client";

import React from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  fallbackSrc: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  width,
  height,
  className,
  sizes,
  priority,
  quality,
  fill,
  objectFit = "cover",
  ...props
}: ImageWithFallbackProps & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>) {
  const [error, setError] = React.useState<boolean>(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error || !src ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      className={className}
      style={{ objectFit }}
      {...props}
    />
  );
}

export function ProductImage({ 
  src, 
  alt, 
  className, 
  size = "medium" 
}: { 
  src?: string; 
  alt: string; 
  className?: string; 
  size?: "small" | "medium" | "large"; 
}) {
  const fallbackSrc = size === "small" ? "/no-image-small.svg" : "/no-image.svg";
  
  const dimensions = {
    small: { width: 48, height: 48 },
    medium: { width: 96, height: 96 },
    large: { width: 200, height: 200 },
  };
  
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      fallbackSrc={fallbackSrc}
      width={dimensions[size].width}
      height={dimensions[size].height}
      className={className}
    />
  );
}

export function UserAvatar({ 
  src, 
  alt, 
  className, 
  size = "medium",
  initials
}: { 
  src?: string; 
  alt: string; 
  className?: string; 
  size?: "small" | "medium" | "large";
  initials?: string;
}) {
  const [error, setError] = React.useState<boolean>(!src);
  
  const dimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 64, height: 64 },
  };
  
  if (error || !src) {
    return (
      <div 
        className={`rounded-full bg-orange-500 flex items-center justify-center text-white ${className || ''}`}
        style={{ width: dimensions[size].width, height: dimensions[size].height }}
      >
        {initials || '?'}
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      width={dimensions[size].width}
      height={dimensions[size].height}
      onError={() => setError(true)}
      className={`rounded-full object-cover ${className || ''}`}
    />
  );
}
