import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 text-gray-500 flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg border bg-dark-base px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-all focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error ? 'border-coral-500 focus:border-coral-500 focus:ring-coral-500' : 'border-dark-border'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3.5 text-gray-500 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-medium text-coral-500">{error}</span>}
        {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
