export type Operation = "add" | "sub" | "mul" | "div";

export type DifficultyId = "rookie" | "easy" | "medium" | "hard" | "legend";

export interface Question {
  a: number;
  b: number;
  op: Operation;
  answer: number;
  prompt: string;
}

export interface RoundConfig {
  ops: Operation[];
  difficulty: DifficultyId;
  questionCount: number;
  seed: number;
  timePerQuestion: number;
}

export interface AnswerRecord {
  question: Question;
  given: number | null;
  correct: boolean;
  points: number;
  timeFraction: number;
}

export interface RoundResult {
  score: number;
  correct: number;
  total: number;
  accuracy: number;
  maxCombo: number;
  records: AnswerRecord[];
  config: RoundConfig;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  difficulty: DifficultyId;
  ops: Operation[];
  date: number;
}

export interface Challenge {
  ops: Operation[];
  difficulty: DifficultyId;
  questionCount: number;
  seed: number;
  byName?: string;
  byScore?: number;
}
