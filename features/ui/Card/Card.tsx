"use client";

import { HTMLAttributes, ReactNode } from "react";
import "./card.css";

/**
 * Card Component - NGOInfo Branding (2A)
 * 
 * Consumes semantic design tokens from global theme.
 * No hardcoded hex values - all colors from CSS variables.
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
  const cardClassName = [
    "ngo-card",
    `ngo-card--elevation-${elevation}`,
    `ngo-card--padding-${padding}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClassName} {...props}>
      {header && (
        <div className="ngo-card__header">
          {header}
        </div>
      )}
      <div className="ngo-card__content">
        {children}
      </div>
      {footer && (
        <div className="ngo-card__footer">
          {footer}
        </div>
      )}
    </div>
  );
}

