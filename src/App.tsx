import { useEffect, useState } from "react";
import Home from "./components/Home";
import Setup from "./components/Setup";
import Play from "./components/Play";
import Results from "./components/Results";
import { difficultyMeta } from "./game/engine";
import { randomSeed } from "./game/engine";
import { Challenge, DifficultyId, Operation, RoundConfig, RoundResult } from "./game/types";
import { clearChallengeFromUrl, readChallengeFromUrl } from "./game/share";
import { loadSettings, personalBest, saveSettings } from "./game/storage";

type Screen = "home" | "setup" | "play" | "results";

const DEFAULT_QUESTION_COUNT = 10;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [config, setConfig] = useState<RoundConfig | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [playedChallenge, setPlayedChallenge] = useState<Challenge | null>(null);
  const [best, setBest] = useState(0);

  const settings = loadSettings();

  useEffect(() => {
    const c = readChallengeFromUrl();
    if (c) {
      setChallenge(c);
      clearChallengeFromUrl();
    }
    setBest(personalBest());
  }, []);

  const buildConfig = (
    ops: Operation[],
    difficulty: DifficultyId,
    opts?: { seed?: number; questionCount?: number }
  ): RoundConfig => ({
    ops,
    difficulty,
    questionCount: opts?.questionCount ?? DEFAULT_QUESTION_COUNT,
    seed: opts?.seed ?? randomSeed(),
    timePerQuestion: difficultyMeta(difficulty).timePerQuestion,
  });

  const startFromSetup = (ops: Operation[], difficulty: DifficultyId) => {
    saveSettings({ ops, difficulty });
    setPlayedChallenge(null);
    setConfig(buildConfig(ops, difficulty));
    setScreen("play");
  };

  const acceptChallenge = () => {
    if (!challenge) return;
    setPlayedChallenge(challenge);
    setConfig(
      buildConfig(challenge.ops, challenge.difficulty, {
        seed: challenge.seed,
        questionCount: challenge.questionCount,
      })
    );
    setScreen("play");
  };

  const onComplete = (r: RoundResult) => {
    setResult(r);
    setBest(personalBest());
    setScreen("results");
  };

  const playAgain = () => {
    if (!config) return;
    setPlayedChallenge(null);
    setConfig(buildConfig(config.ops, config.difficulty));
    setScreen("play");
  };

  const goHome = () => {
    setBest(personalBest());
    setScreen("home");
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex justify-center md:items-center">
      <div className="w-full max-w-md h-full md:h-[min(900px,94vh)] overflow-y-auto overscroll-contain safe-pad flex flex-col md:rounded-[2.25rem] md:shadow-2xl md:ring-1 md:ring-white/10">
        {screen === "home" && (
          <Home
            best={best}
            challenge={challenge}
            onPlay={() => setScreen("setup")}
            onAcceptChallenge={acceptChallenge}
          />
        )}

        {screen === "setup" && (
          <Setup
            initialOps={settings?.ops ?? ["add", "sub"]}
            initialDifficulty={settings?.difficulty ?? "easy"}
            onStart={startFromSetup}
            onBack={() => setScreen("home")}
          />
        )}

        {screen === "play" && config && (
          <Play config={config} onComplete={onComplete} onQuit={goHome} />
        )}

        {screen === "results" && result && (
          <Results
            result={result}
            challenge={playedChallenge}
            onPlayAgain={playAgain}
            onHome={goHome}
          />
        )}
      </div>
    </div>
  );
}
