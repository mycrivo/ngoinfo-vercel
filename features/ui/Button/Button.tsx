"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import "./button.css";

/**
 * Button Component - NGOInfo Branding (2A)
 * 
 * Consumes semantic design tokens from global theme.
 * No hardcoded hex values - all colors from CSS variables.
 * 
 * Accessibility:
 * - 44x44px minimum tap target (WCAG 2.5.5)
 * - Keyboard navigation support
 * - Visible focus ring (2px, offset)
 * - Disabled state properly communicated
 * - Respects prefers-reduced-motion
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

    const classNames = [
      "ngo-button",
      `ngo-button--${variant}`,
      `ngo-button--${size}`,
      fullWidth && "ngo-button--full-width",
      className,
    ].filter(Boolean).join(" ");

    return (
      <button
        ref={ref}
        className={classNames}
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

