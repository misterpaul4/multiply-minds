import { OPERATION_META, OPERATIONS, difficultyMeta } from "../game/engine";
import { OP_COLOR } from "../game/theme";
import { Challenge } from "../game/types";
import { opsLabel } from "../game/share";

interface HomeProps {
  best: number;
  challenge: Challenge | null;
  onPlay: () => void;
  onAcceptChallenge: () => void;
}

export default function Home({ best, challenge, onPlay, onAcceptChallenge }: HomeProps) {
  return (
    <div className="w-full flex flex-col items-center text-center animate-slide-up">
      <div className="mt-6 mb-2 flex gap-2">
        {OPERATIONS.map((op, i) => {
          const c = OP_COLOR[op];
          return (
            <span
              key={op}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl font-display font-bold text-white shadow-lg animate-pop-in"
              style={{ background: c.main, animationDelay: `${i * 80}ms` }}
            >
              {OPERATION_META[op].symbol}
            </span>
          );
        })}
      </div>

      <h1 className="font-display font-bold text-white text-5xl leading-none drop-shadow-md">
        Multiply
        <br />
        Minds
      </h1>
      <p className="text-white/80 font-semibold mt-3 mb-1">
        The math arcade for every brain 🧠
      </p>

      {best > 0 && (
        <div className="mt-3 bg-white/15 text-white font-display font-semibold rounded-full px-4 py-1.5 text-sm tabular">
          ⭐ Personal best: {best.toLocaleString()}
        </div>
      )}

      {challenge && (
        <div className="glass rounded-3xl p-5 mt-6 w-full animate-pop-in">
          <div className="text-3xl mb-1">🥊</div>
          <div className="font-display font-bold text-ink text-lg leading-tight">
            {challenge.byName || "A friend"} challenged you!
          </div>
          {challenge.byScore !== undefined && (
            <div className="text-ink/60 font-semibold text-sm mt-1">
              Beat their score of{" "}
              <span className="font-bold text-brand tabular">
                {challenge.byScore.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-ink/60 font-semibold">
            <span>
              {difficultyMeta(challenge.difficulty).emoji}{" "}
              {difficultyMeta(challenge.difficulty).label}
            </span>
            <span className="text-ink/30">·</span>
            <span>{opsLabel(challenge.ops)}</span>
            <span className="text-ink/30">·</span>
            <span>{challenge.questionCount} Qs</span>
          </div>
          <button
            onClick={onAcceptChallenge}
            className="btn3d w-full mt-4 py-3.5 text-white text-lg"
            style={{ background: "#ec4899", ["--btn-shadow" as string]: "#9d174d" }}
          >
            Accept challenge! 🔥
          </button>
        </div>
      )}

      <button
        onClick={onPlay}
        className="btn3d w-full mt-6 py-5 text-3xl"
        style={{ background: "#facc15", color: "#422006", ["--btn-shadow" as string]: "#a16207" }}
      >
        {challenge ? "Play your own ▶" : "Play ▶"}
      </button>

      <div className="glass rounded-3xl p-5 mt-6 w-full text-left">
        <div className="font-display font-semibold text-ink mb-3">How to play</div>
        <ul className="flex flex-col gap-2.5 text-sm text-ink/70 font-semibold">
          <li className="flex gap-2.5 items-center">
            <span className="text-xl">⏱️</span> Answer before the timer runs out
          </li>
          <li className="flex gap-2.5 items-center">
            <span className="text-xl">🔥</span> Chain correct answers to boost your combo (up to x5)
          </li>
          <li className="flex gap-2.5 items-center">
            <span className="text-xl">⚡</span> Faster answers score more points
          </li>
          <li className="flex gap-2.5 items-center">
            <span className="text-xl">🥊</span> Challenge friends to the exact same questions
          </li>
        </ul>
      </div>

      <div className="text-white/40 text-xs mt-6 mb-3 font-semibold">
        Made for brains big and small
      </div>
    </div>
  );
}
