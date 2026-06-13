interface TimerRingProps {
  fraction: number;
  seconds: number;
  size?: number;
}

export default function TimerRing({ fraction, seconds, size = 64 }: TimerRingProps) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - fraction);

  const color =
    fraction > 0.5 ? "#34d399" : fraction > 0.25 ? "#fbbf24" : "#f87171";

  const urgent = fraction <= 0.25;

  return (
    <div
      className={"relative rounded-full " + (urgent ? "animate-flame" : "")}
      style={{ width: size, height: size, boxShadow: "0 6px 16px rgba(15,23,42,0.4)" }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="#1e1b4b" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-display font-bold tabular text-white"
        style={{ fontSize: size * 0.36 }}
      >
        {Math.ceil(seconds)}
      </span>
    </div>
  );
}
