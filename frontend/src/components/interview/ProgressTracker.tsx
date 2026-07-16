interface ProgressTrackerProps {
  current: number;
  total: number;
}

export default function ProgressTracker({ current, total }: ProgressTrackerProps) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm text-slate-500">
        <span>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
