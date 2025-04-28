"use client"; // This is a Client Component due to animation

import styles from "./Skeleton.module.css";
import React from "react";

interface SkeletonProps {
  width?: string; // Width of the skeleton (e.g., "100%", "200px")
  height?: string; // Height of the skeleton (e.g., "20px", "100px")
  lines?: number; // Number of skeleton lines (e.g., for text blocks)
  className?: string; // Custom classes for additional styling
  variant?: "text" | "rect" | "circle"; // Shape of the skeleton
}

export default function Skeleton({
  width = "100%",
  height = "20px",
  lines = 1,
  className = "",
  variant = "rect",
}: SkeletonProps) {
  const skeletonStyle = {
    width,
    height: variant === "text" ? "1em" : height, // Default to text line height
    borderRadius: variant === "circle" ? "50%" : "4px",
  };

  if (lines > 1 && variant === "text") {
    return (
      <div className={`${styles.skeletonContainer} ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${styles.skeleton} ${styles.shimmer}`}
            style={{
              ...skeletonStyle,
              marginBottom: index < lines - 1 ? "8px" : "0",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${styles.shimmer} ${className}`}
      style={skeletonStyle}
    />
  );
}
