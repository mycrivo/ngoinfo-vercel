"use client";

import { HTMLAttributes, ReactNode, useState } from "react";
import "./banner.css";

/**
 * Banner Component - NGOInfo Branding (2A)
 * 
 * Consumes semantic design tokens from global theme.
 * No hardcoded hex values - all colors from CSS variables.
 * 
 * Accessibility:
 * - Role="alert" for error/warning messages
 * - Clear dismiss button labels (aria-label)
 * - Keyboard navigation support
 * - Visible focus rings
 */

export type BannerVariant = "info" | "success" | "warning" | "error";

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  variant?: BannerVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: ReactNode;
}

export default function Banner({
  variant = "info",
  dismissible = false,
  onDismiss,
  children,
  className = "",
  ...props
}: BannerProps) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  const iconMap = {
    info: (
      <svg className="ngo-banner__icon" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="ngo-banner__icon" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="ngo-banner__icon" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="ngo-banner__icon" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  const bannerClassName = [
    "ngo-banner",
    `ngo-banner--${variant}`,
    className,
  ].filter(Boolean).join(" ");

  const isImportant = variant === "error" || variant === "warning";

  return (
    <div
      className={bannerClassName}
      role={isImportant ? "alert" : "status"}
      {...props}
    >
      {iconMap[variant]}
      <div className="ngo-banner__content">
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="ngo-banner__dismiss"
          aria-label="Dismiss banner"
        >
          <svg className="ngo-banner__dismiss-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

