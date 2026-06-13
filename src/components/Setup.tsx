import { useState } from "react";
import { DIFFICULTIES, OPERATION_META, OPERATIONS } from "../game/engine";
import { DifficultyId, Operation } from "../game/types";
import { DIFFICULTY_COLOR, OP_COLOR } from "../game/theme";

interface SetupProps {
  initialOps: Operation[];
  initialDifficulty: DifficultyId;
  onStart: (ops: Operation[], difficulty: DifficultyId) => void;
  onBack: () => void;
}

export default function Setup({ initialOps, initialDifficulty, onStart, onBack }: SetupProps) {
  const [ops, setOps] = useState<Operation[]>(initialOps.length ? initialOps : ["add"]);
  const [difficulty, setDifficulty] = useState<DifficultyId>(initialDifficulty);

  const toggleOp = (op: Operation) => {
    setOps((cur) =>
      cur.includes(op) ? (cur.length > 1 ? cur.filter((o) => o !== op) : cur) : [...cur, op]
    );
  };

  return (
    <div className="w-full animate-slide-up">
      <button
        onClick={onBack}
        className="mb-3 text-white/80 font-semibold text-sm flex items-center gap-1 active:scale-95"
      >
        ← Back
      </button>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Choose your mix</h2>
        <p className="text-ink/60 text-sm mb-4">Pick one or more operations.</p>

        <div className="grid grid-cols-2 gap-3 mb-7">
          {OPERATIONS.map((op) => {
            const meta = OPERATION_META[op];
            const c = OP_COLOR[op];
            const active = ops.includes(op);
            return (
              <button
                key={op}
                onClick={() => toggleOp(op)}
                className="no-select relative rounded-2xl p-4 text-left transition-all active:scale-95 border-2"
                style={{
                  background: active ? c.soft : "#f8fafc",
                  borderColor: active ? c.main : "transparent",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl font-display font-bold text-white mb-2"
                  style={{ background: c.main }}
                >
                  {meta.symbol}
                </div>
                <div className="font-display font-semibold text-ink leading-tight">
                  {meta.label}
                </div>
                {active && (
                  <span
                    className="absolute top-3 right-3 w-6 h-6 rounded-full text-white text-sm flex items-center justify-center animate-badge"
                    style={{ background: c.main }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <h2 className="font-display text-2xl font-semibold text-ink">Difficulty</h2>
        <p className="text-ink/60 text-sm mb-4">From first steps to legend mode.</p>

        <div className="flex flex-col gap-2.5">
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d.id;
            const color = DIFFICULTY_COLOR[d.id];
            return (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className="no-select flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all active:scale-[0.98] border-2"
                style={{
                  background: active ? "#fff" : "#f8fafc",
                  borderColor: active ? color : "transparent",
                  boxShadow: active ? `0 8px 20px -8px ${color}` : "none",
                }}
              >
                <span className="text-2xl">{d.emoji}</span>
                <span className="flex-1">
                  <span className="font-display font-semibold text-ink block leading-tight">
                    {d.label}
                  </span>
                  <span className="text-ink/55 text-xs">{d.blurb}</span>
                </span>
                <span
                  className="text-xs font-semibold rounded-full px-2.5 py-1 tabular"
                  style={{ background: color + "22", color }}
                >
                  {d.timePerQuestion}s
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onStart(ops, difficulty)}
        className="btn3d w-full mt-5 py-4 text-2xl"
        style={{ background: "#facc15", color: "#422006", ["--btn-shadow" as string]: "#a16207" }}
      >
        Start! 🚀
      </button>
    </div>
  );
}
