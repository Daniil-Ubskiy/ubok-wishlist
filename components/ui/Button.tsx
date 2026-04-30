"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        size === "md" && "h-11 px-5 text-sm",
        size === "sm" && "h-9 px-3 text-sm",
        variant === "primary" &&
          "bg-brand-green text-white hover:bg-emerald-600 focus-visible:outline-brand-green",
        variant === "secondary" &&
          "bg-brand-blue text-white hover:bg-blue-600 focus-visible:outline-brand-blue",
        variant === "ghost" &&
          "bg-transparent text-text hover:bg-slate-100 dark:hover:bg-slate-800",
        variant === "outline" &&
          "border border-border bg-surface text-text hover:bg-slate-50 dark:hover:bg-slate-800",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
