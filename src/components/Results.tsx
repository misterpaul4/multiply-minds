import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OPERATION_META, difficultyMeta } from "../game/engine";
import { OP_COLOR } from "../game/theme";
import { Challenge, LeaderboardEntry, RoundResult } from "../game/types";
import { addLeaderboardEntry, loadName, personalBest, saveName } from "../game/storage";
import { buildChallengeUrl, shareScore, ShareOutcome } from "../game/share";
import { useCountUp } from "../hooks/useCountUp";
import Confetti from "./Confetti";

interface ResultsProps {
  result: RoundResult;
  challenge: Challenge | null;
  onPlayAgain: () => void;
  onHome: () => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Results({ result, challenge, onPlayAgain, onHome }: ResultsProps) {
  const diff = difficultyMeta(result.config.difficulty);

  const prevBest = useMemo(() => personalBest(), []);
  const isNewBest = result.score > prevBest && result.score > 0;

  const [name, setName] = useState(loadName());
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [rank, setRank] = useState<number>(-1);
  const [saved, setSaved] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const savedRef = useRef(false);
  const initRef = useRef(false);

  const displayScore = useCountUp(result.score, 1100);

  const doSave = useCallback(
    (playerName: string) => {
      const n = playerName.trim();
      if (savedRef.current || !n) return;
      savedRef.current = true;
      saveName(n);
      const entry: LeaderboardEntry = {
        name: n,
        score: result.score,
        accuracy: result.accuracy,
        maxCombo: result.maxCombo,
        difficulty: result.config.difficulty,
        ops: result.config.ops,
        date: Date.now(),
      };
      const { board: nb, rank: r } = addLeaderboardEntry(entry);
      setBoard(nb);
      setRank(r);
      setSaved(true);
    },
    [result]
  );

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setBurst((b) => b + 1);
    if (name.trim()) doSave(name);
  }, [name, doSave]);

  const beatFriend =
    challenge?.byScore !== undefined ? result.score > challenge.byScore : null;

  const challengeUrl = useMemo(
    () =>
      buildChallengeUrl({
        ops: result.config.ops,
        difficulty: result.config.difficulty,
        questionCount: result.config.questionCount,
        seed: result.config.seed,
        byName: name.trim() || "A friend",
        byScore: result.score,
      }),
    [result, name]
  );

  const handleShare = async (withChallenge: boolean) => {
    const outcome: ShareOutcome = await shareScore({
      name: name.trim(),
      score: result.score,
      accuracy: result.accuracy,
      maxCombo: result.maxCombo,
      ops: result.config.ops,
      difficulty: result.config.difficulty,
      challengeUrl: withChallenge ? challengeUrl : undefined,
    });
    setShareMsg(
      outcome === "shared"
        ? "Shared! 🎉"
        : outcome === "copied"
          ? withChallenge
            ? "Challenge link copied! 📋"
            : "Copied to clipboard! 📋"
          : "Couldn't share — try again"
    );
    setTimeout(() => setShareMsg(null), 2500);
  };

  return (
    <div className="w-full my-auto animate-slide-up">
      <Confetti burstKey={burst} intensity={isNewBest || rank === 1 ? 1.8 : 1} />

      <div className="glass rounded-3xl p-6 text-center relative overflow-hidden">
        {isNewBest && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 font-display font-bold text-xs px-3 py-1 rounded-full animate-badge">
            NEW BEST! ⭐
          </div>
        )}

        <div className="text-5xl mb-1 animate-pop-in">
          {result.accuracy === 100 ? "🏆" : result.accuracy >= 70 ? "🎉" : "💪"}
        </div>
        <h2 className="font-display text-xl font-semibold text-ink/70">
          {result.accuracy === 100
            ? "Flawless!"
            : result.accuracy >= 70
              ? "Great round!"
              : "Good effort!"}
        </h2>

        <div className="font-display font-bold text-ink tabular leading-none my-2">
          <span className="text-6xl">{displayScore.toLocaleString()}</span>
        </div>
        <div className="text-ink/50 font-semibold text-sm">points</div>

        {beatFriend !== null && (
          <div
            className="mt-4 rounded-2xl p-3 font-display font-semibold animate-pop-in"
            style={{
              background: beatFriend ? "#dcfce7" : "#fee2e2",
              color: beatFriend ? "#15803d" : "#b91c1c",
            }}
          >
            {beatFriend ? "🎯 You beat " : "😤 So close to "}
            {challenge?.byName || "your friend"}
            {"! "}
            <span className="tabular">
              ({result.score.toLocaleString()} vs {challenge?.byScore?.toLocaleString()})
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-5">
          <Stat label="Accuracy" value={`${result.accuracy}%`} />
          <Stat label="Correct" value={`${result.correct}/${result.total}`} />
          <Stat label="Best combo" value={`x${result.maxCombo}`} />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-ink/60 font-semibold">
          <span>
            {diff.emoji} {diff.label}
          </span>
          <span className="text-ink/30">·</span>
          <span className="flex gap-1">
            {result.config.ops.map((o) => (
              <span key={o}>{OPERATION_META[o].symbol}</span>
            ))}
          </span>
        </div>
      </div>

      {!saved && (
        <div className="glass rounded-2xl p-4 mt-4 animate-slide-up">
          <label className="font-display font-semibold text-ink text-sm">
            Save your score to the leaderboard
          </label>
          <div className="flex gap-2 mt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={14}
              className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 font-display text-lg outline-none focus:border-brand"
            />
            <button
              onClick={() => doSave(name)}
              disabled={!name.trim()}
              className="btn3d px-5 text-white"
              style={{ background: "#6d28d9", ["--btn-shadow" as string]: "#4c1d95" }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {saved && rank > 0 && (
        <div className="glass rounded-2xl p-3 mt-4 flex items-center justify-center gap-2 font-display font-semibold text-ink animate-pop-in">
          {rank <= 3 ? <span className="text-2xl">{MEDALS[rank - 1]}</span> : null}
          You ranked #{rank} of {board.length}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={() => handleShare(true)}
          className="btn3d py-3.5 text-white text-lg col-span-2"
          style={{ background: "#ec4899", ["--btn-shadow" as string]: "#9d174d" }}
        >
          🥊 Challenge a friend
        </button>
        <button
          onClick={() => handleShare(false)}
          className="btn3d py-3 text-white"
          style={{ background: "#0ea5e9", ["--btn-shadow" as string]: "#0369a1" }}
        >
          📤 Share
        </button>
        <button
          onClick={onPlayAgain}
          className="btn3d py-3 text-white"
          style={{ background: "#22c55e", ["--btn-shadow" as string]: "#15803d" }}
        >
          🔁 Play again
        </button>
      </div>

      {shareMsg && (
        <div className="text-center text-white font-display font-semibold mt-3 animate-pop-in">
          {shareMsg}
        </div>
      )}

      <div className="glass rounded-2xl p-4 mt-4">
        <div className="font-display font-semibold text-ink mb-2 text-sm">Round review</div>
        <div className="flex flex-wrap gap-1.5">
          {result.records.map((r, i) => {
            const c = OP_COLOR[r.question.op];
            return (
              <span
                key={i}
                className="text-xs font-semibold rounded-lg px-2 py-1 tabular"
                style={{
                  background: r.correct ? c.soft : "#fee2e2",
                  color: r.correct ? c.deep : "#b91c1c",
                }}
                title={
                  r.correct
                    ? `${r.question.prompt} = ${r.question.answer}`
                    : `${r.question.prompt} = ${r.question.answer} (you: ${
                        r.given ?? "—"
                      })`
                }
              >
                {r.correct ? "✓" : "✗"} {r.question.prompt}
              </span>
            );
          })}
        </div>
      </div>

      {board.length > 0 && (
        <div className="glass rounded-2xl p-4 mt-4">
          <div className="font-display font-semibold text-ink mb-2 text-sm">🏅 Leaderboard</div>
          <ol className="flex flex-col gap-1">
            {board.slice(0, 8).map((e, i) => (
              <li
                key={i}
                className={
                  "flex items-center gap-3 rounded-xl px-3 py-2 " +
                  (i + 1 === rank ? "bg-brand/10" : "")
                }
              >
                <span className="w-6 text-center font-display font-bold text-ink/50 tabular">
                  {i < 3 ? MEDALS[i] : i + 1}
                </span>
                <span className="flex-1 font-display font-semibold text-ink truncate">
                  {e.name}
                </span>
                <span className="text-ink/40 text-xs">{difficultyMeta(e.difficulty).emoji}</span>
                <span className="font-display font-bold text-ink tabular">
                  {e.score.toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <button
        onClick={onHome}
        className="w-full mt-4 mb-2 py-3 text-white/80 font-display font-semibold active:scale-95"
      >
        🏠 Back to home
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-100 rounded-2xl py-3">
      <div className="font-display font-bold text-xl text-ink tabular">{value}</div>
      <div className="text-ink/50 text-xs font-semibold">{label}</div>
    </div>
  );
}
