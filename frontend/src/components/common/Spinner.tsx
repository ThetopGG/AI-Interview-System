import clsx from "clsx";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export default function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <span
      className={clsx(
        "inline-block animate-spin rounded-full border-2 border-slate-300 border-t-brand-600",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
