export interface ProgressBarProps {
  percent: number;
  label?: string;
  showValue?: boolean;
  striped?: boolean;
  className?: string;
}

/** Horizontal progress bar with brand fill. Clamped to 0–100. */
export function ProgressBar({
  percent,
  label,
  showValue = true,
  striped = false,
  className,
}: ProgressBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className={className}>
      {label || showValue ? (
        <div className="mb-1 flex items-center justify-between text-caption text-gray-600">
          <span>{label}</span>
          {showValue ? <span className="font-semibold text-ink">{value}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-3 w-full overflow-hidden rounded-pill bg-gray-200"
      >
        <div
          className={
            striped
              ? "h-full rounded-pill bg-brand-500 transition-all"
              : "h-full rounded-pill bg-brand-500 transition-all"
          }
          style={{
            width: `${value}%`,
            ...(striped
              ? {
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, rgba(255,255,255,.25) 0, rgba(255,255,255,.25) 8px, transparent 8px, transparent 16px)",
                }
              : {}),
          }}
        />
        {striped && value > 12 ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[11px] font-semibold text-white">
            {value}%
          </span>
        ) : null}
      </div>
    </div>
  );
}
