"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import "./input.css";

/**
 * Input Component - NGOInfo Branding (2A)
 * 
 * Consumes semantic design tokens from global theme.
 * No hardcoded hex values - all colors from CSS variables.
 * 
 * Accessibility:
 * - Labels properly associated (for/id)
 * - Error messages announced (aria-invalid, role="alert")
 * - 2px focus ring with offset
 * - Keyboard navigation
 * - Respects prefers-reduced-motion
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
    } = props;

    const inputClassName = [
      "ngo-input",
      error && "ngo-input--error",
      fullWidth && "ngo-input--full-width",
      className,
    ].filter(Boolean).join(" ");

    const labelClassName = "ngo-input__label";

    const helperClassName = [
      "ngo-input__helper",
      error && "ngo-input__helper--error",
    ].filter(Boolean).join(" ");

    const renderInput = () => {
      if ("variant" in props && props.variant === "textarea") {
        const { variant: _variant, options: _options, ...textareaProps } = props as TextareaProps;
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
        const { variant: _variant, options, ...selectProps } = props as SelectProps;
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

      const { variant = "text", options: _options, ...inputProps } = props as TextInputProps;
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
      <div className={fullWidth ? "ngo-input-wrapper ngo-input-wrapper--full-width" : "ngo-input-wrapper"}>
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

