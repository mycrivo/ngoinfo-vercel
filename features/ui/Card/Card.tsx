"use client";

import { HTMLAttributes, ReactNode } from "react";

/**
 * Card Component - Minimal UI Kit (V2)
 * 
 * Surface container with border and elevation.
 * Supports header, content, and footer slots.
 * Neutral styling with placeholder CSS variables.
 * 
 * Accessibility:
 * - Semantic HTML structure
 * - Proper heading hierarchy in header
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  elevation?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  header,
  footer,
  children,
  elevation = "sm",
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const baseStyles = [
    "rounded-lg",
    "border border-[var(--placeholder-border,#e5e7eb)]",
    "bg-[var(--placeholder-card-bg,white)]",
  ].join(" ");

  const elevationStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const cardClassName = [
    baseStyles,
    elevationStyles[elevation],
    paddingStyles[padding],
    className,
  ].join(" ");

  const headerClassName = [
    "border-b border-[var(--placeholder-border,#e5e7eb)]",
    padding === "none" ? "p-4 pb-3" : padding === "sm" ? "pb-2 mb-2" : padding === "md" ? "pb-3 mb-3" : "pb-4 mb-4",
  ].join(" ");

  const footerClassName = [
    "border-t border-[var(--placeholder-border,#e5e7eb)]",
    padding === "none" ? "p-4 pt-3" : padding === "sm" ? "pt-2 mt-2" : padding === "md" ? "pt-3 mt-3" : "pt-4 mt-4",
  ].join(" ");

  return (
    <div className={cardClassName} {...props}>
      {header && (
        <div className={headerClassName}>
          {header}
        </div>
      )}
      <div className={padding === "none" && (header || footer) ? "p-4" : ""}>
        {children}
      </div>
      {footer && (
        <div className={footerClassName}>
          {footer}
        </div>
      )}
    </div>
  );
}

