"use client";

import { cn } from "@/lib/utils";

interface ThemedCardProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  primary: {
    outer: "bg-primary-200 ring-primary-300",
    outerSelected: "bg-primary-300 ring-primary-400",
    middle: "bg-primary-100",
    middleSelected: "bg-primary-200",
    inner: "bg-white ring-primary-200",
  },
  secondary: {
    outer: "bg-secondary-200 ring-secondary-300",
    outerSelected: "bg-secondary-300 ring-secondary-400",
    middle: "bg-secondary-100",
    middleSelected: "bg-secondary-200",
    inner: "bg-white ring-secondary-200",
  },
  accent: {
    outer: "bg-accent-200 ring-accent-300",
    outerSelected: "bg-accent-300 ring-accent-400",
    middle: "bg-accent-100",
    middleSelected: "bg-accent-200",
    inner: "bg-white ring-accent-200",
  },
};

export function ThemedCard({
  children,
  variant = "primary",
  className,
  isSelected = false,
  onClick,
}: ThemedCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "grid grid-cols-1 rounded-2xl",
        "shadow-[inset_0_0_2px_1px_rgba(0,0,0,0.05)]",
        "ring-1",
        isSelected ? styles.outerSelected : styles.outer,
        "transition-all duration-300 ease-in-out",
        onClick && "cursor-pointer hover:scale-[1.01]",
        className,
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 rounded-2xl p-1.5 shadow-md",
          isSelected ? styles.middleSelected : styles.middle,
        )}
      >
        <div
          className={cn(
            "rounded-xl p-4 shadow-lg ring-1",
            styles.inner,
            "h-full",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
