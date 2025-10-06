"use client";

import { HTMLAttributes, ReactNode, useState } from "react";

/**
 * Banner Component - Minimal UI Kit (V2)
 * 
 * Notification banner with semantic variants.
 * Supports dismissible state and custom actions.
 * Neutral styling with placeholder CSS variables.
 * 
 * Accessibility:
 * - Role="alert" for important messages
 * - Clear dismiss button labels
 * - Keyboard navigation support
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

  const baseStyles = [
    "rounded-lg p-4",
    "border",
    "flex items-start gap-3",
  ].join(" ");

  const variantStyles = {
    info: [
      "bg-[var(--placeholder-info-bg,#eff6ff)]",
      "border-[var(--placeholder-info-border,#bfdbfe)]",
      "text-[var(--placeholder-info-fg,#1e40af)]",
    ].join(" "),
    success: [
      "bg-[var(--placeholder-success-bg,#f0fdf4)]",
      "border-[var(--placeholder-success-border,#bbf7d0)]",
      "text-[var(--placeholder-success-fg,#166534)]",
    ].join(" "),
    warning: [
      "bg-[var(--placeholder-warning-bg,#fffbeb)]",
      "border-[var(--placeholder-warning-border,#fde68a)]",
      "text-[var(--placeholder-warning-fg,#92400e)]",
    ].join(" "),
    error: [
      "bg-[var(--placeholder-error-bg,#fef2f2)]",
      "border-[var(--placeholder-error-border,#fecaca)]",
      "text-[var(--placeholder-error-fg,#991b1b)]",
    ].join(" "),
  };

  const iconMap = {
    info: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  const bannerClassName = [
    baseStyles,
    variantStyles[variant],
    className,
  ].join(" ");

  const isImportant = variant === "error" || variant === "warning";

  return (
    <div
      className={bannerClassName}
      role={isImportant ? "alert" : "status"}
      {...props}
    >
      {iconMap[variant]}
      <div className="flex-1 text-sm">
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

