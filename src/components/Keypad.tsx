interface KeypadProps {
  onDigit: (d: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  canSubmit?: boolean;
  accent: string;
}

const KEY_BASE =
  "btn3d no-select flex items-center justify-center text-3xl h-[clamp(2.75rem,7.5vh,4.25rem)] " +
  "bg-white text-ink select-none active:translate-y-1";

export default function Keypad({
  onDigit,
  onDelete,
  onSubmit,
  disabled,
  canSubmit,
  accent,
}: KeypadProps) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {digits.map((d) => (
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={() => onDigit(d)}
          className={KEY_BASE}
          style={{ color: "#1e1b4b", ["--btn-shadow" as string]: "rgba(99,102,241,0.18)" }}
        >
          {d}
        </button>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={onDelete}
        aria-label="Delete"
        className={KEY_BASE + " text-2xl"}
        style={{ color: "#1e1b4b", ["--btn-shadow" as string]: "rgba(99,102,241,0.18)" }}
      >
        ⌫
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("0")}
        className={KEY_BASE}
        style={{ color: "#1e1b4b", ["--btn-shadow" as string]: "rgba(99,102,241,0.18)" }}
      >
        0
      </button>

      <button
        type="button"
        disabled={disabled || !canSubmit}
        onClick={onSubmit}
        aria-label="Submit answer"
        className="btn3d no-select flex items-center justify-center text-3xl h-[clamp(2.75rem,7.5vh,4.25rem)] text-white"
        style={{
          background: accent,
          ["--btn-shadow" as string]: "rgba(0,0,0,0.28)",
        }}
      >
        ✓
      </button>
    </div>
  );
}
