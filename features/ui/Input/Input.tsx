"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

/**
 * Input Component - Minimal UI Kit (V2)
 * 
 * Supports text, select, and textarea variants.
 * Includes focus ring, error states, and helper text.
 * Neutral styling with placeholder CSS variables.
 * 
 * Accessibility:
 * - Labels properly associated
 * - Error messages announced
 * - Focus indicators
 * - Keyboard navigation
 */

interface BaseInputProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
}

export type TextInputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement> & {
  variant?: "text" | "email" | "password" | "number" | "url";
};

export type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant: "textarea";
  rows?: number;
};

export type SelectProps = BaseInputProps & SelectHTMLAttributes<HTMLSelectElement> & {
  variant: "select";
  options: Array<{ value: string; label: string }>;
};

export type InputProps = TextInputProps | TextareaProps | SelectProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(
  (props, ref) => {
    const {
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      className = "",
      ...restProps
    } = props;

    const baseInputStyles = [
      "px-3 py-2",
      "border rounded-md",
      "text-[var(--placeholder-fg,#1f2937)]",
      "bg-[var(--placeholder-input-bg,white)]",
      "transition-colors duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--placeholder-disabled-bg,#f3f4f6)]",
    ].join(" ");

    const normalBorderStyles = [
      "border-[var(--placeholder-border,#d1d5db)]",
      "focus:border-[var(--placeholder-primary-bg,#3b82f6)]",
      "focus:ring-[var(--placeholder-primary-bg,#3b82f6)]",
    ].join(" ");

    const errorBorderStyles = [
      "border-[var(--placeholder-error,#ef4444)]",
      "focus:border-[var(--placeholder-error,#ef4444)]",
      "focus:ring-[var(--placeholder-error,#ef4444)]",
    ].join(" ");

    const widthStyles = fullWidth ? "w-full" : "";

    const inputClassName = [
      baseInputStyles,
      error ? errorBorderStyles : normalBorderStyles,
      widthStyles,
      className,
    ].join(" ");

    const labelClassName = [
      "block text-sm font-medium mb-1",
      "text-[var(--placeholder-label-fg,#374151)]",
    ].join(" ");

    const helperClassName = [
      "mt-1 text-sm",
      error ? "text-[var(--placeholder-error,#ef4444)]" : "text-[var(--placeholder-helper-fg,#6b7280)]",
    ].join(" ");

    const renderInput = () => {
      if ("variant" in props && props.variant === "textarea") {
        const { variant, options, ...textareaProps } = props as TextareaProps;
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClassName}
            rows={props.rows || 4}
            aria-invalid={error}
            aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
            {...textareaProps}
          />
        );
      }

      if ("variant" in props && props.variant === "select") {
        const { variant, options, ...selectProps } = props as SelectProps;
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={inputClassName}
            aria-invalid={error}
            aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
            {...selectProps}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      const { variant = "text", options, ...inputProps } = props as TextInputProps;
      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={variant}
          className={inputClassName}
          aria-invalid={error}
          aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
          {...inputProps}
        />
      );
    };

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={props.id} className={labelClassName}>
            {label}
          </label>
        )}
        {renderInput()}
        {(helperText || (error && errorMessage)) && (
          <p
            id={error && errorMessage ? `${props.id}-error` : undefined}
            className={helperClassName}
            role={error ? "alert" : undefined}
          >
            {error && errorMessage ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

