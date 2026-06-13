import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  OPERATION_META,
  comboMultiplier,
  generateQuestions,
  scoreAnswer,
  summarize,
} from "../game/engine";
import { OP_COLOR } from "../game/theme";
import { AnswerRecord, RoundConfig, RoundResult } from "../game/types";
import { useCountdown } from "../hooks/useCountdown";
import { useCountUp } from "../hooks/useCountUp";
import Keypad from "./Keypad";
import TimerRing from "./TimerRing";

interface PlayProps {
  config: RoundConfig;
  onComplete: (result: RoundResult) => void;
  onQuit: () => void;
}

interface Feedback {
  correct: boolean;
  timeout: boolean;
  gained: number;
  answer: number;
  mult: number;
}

const MAX_DIGITS = 7;

export default function Play({ config, onComplete, onQuit }: PlayProps) {
  const questions = useMemo(() => generateQuestions(config), [config]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"answering" | "feedback">("answering");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [floatKey, setFloatKey] = useState(0);

  const recordsRef = useRef<AnswerRecord[]>([]);
  const advanceRef = useRef<ReturnType<typeof setTimeout>>();
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const current = questions[index];
  const opColor = OP_COLOR[current.op];
  const displayedScore = useCountUp(score, 600);

  const timer = useCountdown(config.timePerQuestion, () => resolveRef.current(null, true));

  const advance = useCallback(() => {
    setFeedback(null);
    setIndex((i) => {
      const next = i + 1;
      if (next >= questions.length) {
        onComplete(summarize(recordsRef.current, config));
        return i;
      }
      setPhase("answering");
      return next;
    });
  }, [questions.length, onComplete, config]);

  const resolve = useCallback(
    (value: number | null, timeout: boolean) => {
      if (phaseRef.current !== "answering") return;
      timer.pause();
      const q = questions[index];
      const correct = value !== null && value === q.answer;
      const fraction = timeout ? 0 : timer.fraction;

      let gained = 0;
      let mult = 1;
      if (correct) {
        const newStreak = streak + 1;
        mult = comboMultiplier(newStreak);
        gained = scoreAnswer(fraction, mult);
        setStreak(newStreak);
        setScore((s) => s + gained);
        setFloatKey((k) => k + 1);
      } else {
        setStreak(0);
        setShakeKey((k) => k + 1);
      }

      recordsRef.current.push({
        question: q,
        given: value,
        correct,
        points: gained,
        timeFraction: fraction,
      });

      setFeedback({ correct, timeout, gained, answer: q.answer, mult });
      setPhase("feedback");
      advanceRef.current = setTimeout(advance, correct ? 850 : 1550);
    },
    [questions, index, streak, timer, advance]
  );

  const resolveRef = useRef(resolve);
  resolveRef.current = resolve;

  const startTimer = timer.start;
  useEffect(() => {
    setInput("");
    startTimer();
  }, [index, startTimer]);

  useEffect(() => () => clearTimeout(advanceRef.current), []);

  const submit = useCallback(() => {
    if (phaseRef.current !== "answering" || input.length === 0) return;
    resolveRef.current(parseInt(input, 10), false);
  }, [input]);

  const pushDigit = useCallback((d: string) => {
    if (phaseRef.current !== "answering") return;
    setInput((cur) => (cur.length >= MAX_DIGITS ? cur : cur + d));
  }, []);

  const del = useCallback(() => {
    if (phaseRef.current !== "answering") return;
    setInput((cur) => cur.slice(0, -1));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") pushDigit(e.key);
      else if (e.key === "Backspace") del();
      else if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pushDigit, del, submit]);

  const progress = (index / questions.length) * 100;
  const showFlame = streak >= 3;
  const mult = comboMultiplier(streak);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col">
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <button
          onClick={onQuit}
          aria-label="Quit"
          className="no-select w-9 h-9 rounded-full bg-white/20 text-white text-lg flex items-center justify-center active:scale-90"
        >
          ✕
        </button>
        <div className="flex-1">
          <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="text-white font-display font-semibold text-sm tabular">
          {index + 1}/{questions.length}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 px-1 shrink-0">
        <div className="relative">
          <div className="text-white/70 text-xs font-semibold uppercase tracking-wide">Score</div>
          <div className="font-display text-3xl font-bold text-white tabular leading-none">
            {displayedScore.toLocaleString()}
          </div>
          {feedback?.correct && feedback.gained > 0 && (
            <div
              key={floatKey}
              className="animate-float-up absolute -top-1 left-0 font-display font-bold text-yellow-300 text-xl"
            >
              +{feedback.gained}
            </div>
          )}
        </div>

        <div
          className={
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all " +
            (showFlame ? "bg-white/95" : "bg-white/15")
          }
        >
          <span className={showFlame ? "animate-flame text-xl" : "text-xl opacity-70"}>
            {showFlame ? "🔥" : "✨"}
          </span>
          <span
            className={
              "font-display font-bold tabular " + (showFlame ? "text-orange-600" : "text-white")
            }
          >
            x{mult}
          </span>
          <span className={"text-xs font-semibold " + (showFlame ? "text-ink/50" : "text-white/60")}>
            {streak}
          </span>
        </div>
      </div>

      <div
        key={index + "-" + shakeKey}
        className={
          "glass relative rounded-3xl px-5 pt-5 pb-3 flex flex-col items-center flex-1 min-h-0 " +
          (feedback && !feedback.correct
            ? "animate-shake"
            : feedback?.correct
              ? "animate-correct"
              : "animate-question-in")
        }
        style={
          feedback
            ? {
                boxShadow: feedback.correct
                  ? "0 0 0 4px #22c55e, 0 20px 50px -12px rgba(34,197,94,0.5)"
                  : "0 0 0 4px #ef4444, 0 20px 50px -12px rgba(239,68,68,0.4)",
              }
            : undefined
        }
      >
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <TimerRing fraction={timer.fraction} seconds={timer.remaining} />
        </div>

        <div className="mt-7 flex items-center gap-2 shrink-0">
          <span
            className="text-xs font-display font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ background: opColor.soft, color: opColor.deep }}
          >
            {OPERATION_META[current.op].label}
          </span>
        </div>

        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-[2vh]">
          <div className="font-display font-bold text-ink tabular text-center leading-none">
            <span className="text-[clamp(2.5rem,7.5vh,3.75rem)]">{current.prompt}</span>
          </div>

          <div
            className="min-w-[8rem] text-center rounded-2xl px-6 py-2 font-display font-bold text-[clamp(1.75rem,5vh,2.25rem)] tabular transition-colors"
            style={{
              background: opColor.soft,
              color: input ? opColor.deep : "#cbd5e1",
              boxShadow: `inset 0 0 0 2px ${opColor.main}`,
            }}
          >
            {input || "?"}
          </div>
        </div>

        <div className="h-6 shrink-0 text-center font-display font-semibold">
          {feedback?.correct && (
            <span className="text-op-add animate-pop-in inline-block">
              {feedback.mult > 1 ? `Combo x${feedback.mult}! ` : ""}Nice! 🎉
            </span>
          )}
          {feedback && !feedback.correct && (
            <span className="text-red-500 animate-pop-in inline-block">
              {feedback.timeout ? "⏰ Time! " : "Oops! "}Answer: {feedback.answer.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 pt-3">
        <Keypad
          onDigit={pushDigit}
          onDelete={del}
          onSubmit={submit}
          disabled={phase === "feedback"}
          canSubmit={input.length > 0}
          accent={opColor.main}
        />
      </div>
    </div>
  );
}
