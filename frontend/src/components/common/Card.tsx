import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-200 shadow-sm p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
