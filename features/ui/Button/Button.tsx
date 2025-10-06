"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

/**
 * Button Component - Minimal UI Kit (V2)
 * 
 * Neutral styling with placeholder CSS variables.
 * Brand tokens will be applied in 2A.
 * 
 * Accessibility:
 * - 44x44px minimum tap target
 * - Keyboard navigation support
 * - Clear focus indicators
 * - Disabled state properly communicated
 */

export type ButtonVariant = "primary" | "secondary" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth = false, className = "", children, onClick, ...props }, ref) => {
    
    // Telemetry: log button clicks (stub)
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log(`[telemetry:button] variant=${variant} action=click timestamp=${Date.now()}`);
      onClick?.(e);
    };

    const baseStyles = [
      "inline-flex items-center justify-center",
      "font-medium transition-colors duration-200",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "rounded-md",
    ].join(" ");

    const variantStyles = {
      primary: [
        "bg-[var(--placeholder-primary-bg,#3b82f6)]",
        "text-[var(--placeholder-primary-fg,white)]",
        "border border-transparent",
        "hover:bg-[var(--placeholder-primary-hover,#2563eb)]",
        "active:bg-[var(--placeholder-primary-active,#1d4ed8)]",
        "focus-visible:outline-[var(--placeholder-primary-bg,#3b82f6)]",
      ].join(" "),
      secondary: [
        "bg-[var(--placeholder-secondary-bg,transparent)]",
        "text-[var(--placeholder-secondary-fg,#3b82f6)]",
        "border border-[var(--placeholder-border,#d1d5db)]",
        "hover:bg-[var(--placeholder-secondary-hover,#f3f4f6)]",
        "active:bg-[var(--placeholder-secondary-active,#e5e7eb)]",
        "focus-visible:outline-[var(--placeholder-secondary-fg,#3b82f6)]",
      ].join(" "),
      link: [
        "bg-transparent",
        "text-[var(--placeholder-link-fg,#3b82f6)]",
        "border-none",
        "underline-offset-4",
        "hover:underline",
        "focus-visible:outline-[var(--placeholder-link-fg,#3b82f6)]",
        "px-0",
      ].join(" "),
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm min-h-[36px]",
      md: "px-4 py-2 text-base min-h-[44px]", // 44px min tap target
      lg: "px-6 py-3 text-lg min-h-[48px]",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    const combinedClassName = [
      baseStyles,
      variantStyles[variant],
      variant !== "link" ? sizeStyles[size] : "py-2", // Link variant has custom padding
      widthStyles,
      className,
    ].join(" ");

    return (
      <button
        ref={ref}
        className={combinedClassName}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

