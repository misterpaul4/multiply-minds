import {
  AnswerRecord,
  DifficultyId,
  Operation,
  Question,
  RoundConfig,
} from "./types";

export function xmur3(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

export const OPERATIONS: Operation[] = ["add", "sub", "mul", "div"];

export interface OperationMeta {
  id: Operation;
  symbol: string;
  label: string;
  accent: string;
  emoji: string;
}

export const OPERATION_META: Record<Operation, OperationMeta> = {
  add: { id: "add", symbol: "+", label: "Add", accent: "add", emoji: "➕" },
  sub: { id: "sub", symbol: "−", label: "Subtract", accent: "sub", emoji: "➖" },
  mul: { id: "mul", symbol: "×", label: "Multiply", accent: "mul", emoji: "✖️" },
  div: { id: "div", symbol: "÷", label: "Divide", accent: "div", emoji: "➗" },
};

export interface DifficultyMeta {
  id: DifficultyId;
  label: string;
  blurb: string;
  emoji: string;
  timePerQuestion: number;
}

export const DIFFICULTIES: DifficultyMeta[] = [
  {
    id: "rookie",
    label: "Rookie",
    blurb: "Tiny numbers. Great for ages 6+",
    emoji: "🐣",
    timePerQuestion: 15,
  },
  {
    id: "easy",
    label: "Easy",
    blurb: "Building confidence",
    emoji: "🙂",
    timePerQuestion: 12,
  },
  {
    id: "medium",
    label: "Medium",
    blurb: "A solid mental workout",
    emoji: "🔥",
    timePerQuestion: 10,
  },
  {
    id: "hard",
    label: "Hard",
    blurb: "Big numbers, fast clock",
    emoji: "⚡",
    timePerQuestion: 9,
  },
  {
    id: "legend",
    label: "Legend",
    blurb: "For math wizards only",
    emoji: "👑",
    timePerQuestion: 8,
  },
];

export function difficultyMeta(id: DifficultyId): DifficultyMeta {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1];
}

const ADD_SUB_RANGE: Record<DifficultyId, [number, number]> = {
  rookie: [1, 9],
  easy: [2, 20],
  medium: [5, 60],
  hard: [20, 250],
  legend: [100, 1000],
};

const MUL_RANGE: Record<DifficultyId, [number, number]> = {
  rookie: [1, 5],
  easy: [2, 9],
  medium: [2, 12],
  hard: [4, 20],
  legend: [11, 40],
};

const DIV_DIVISOR_RANGE: Record<DifficultyId, [number, number]> = {
  rookie: [2, 5],
  easy: [2, 9],
  medium: [2, 12],
  hard: [3, 15],
  legend: [6, 25],
};
const DIV_QUOTIENT_RANGE: Record<DifficultyId, [number, number]> = {
  rookie: [1, 5],
  easy: [2, 9],
  medium: [2, 12],
  hard: [4, 20],
  legend: [8, 40],
};

function intInRange(rng: () => number, [min, max]: [number, number]): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function makeQuestion(op: Operation, difficulty: DifficultyId, rng: () => number): Question {
  let a: number;
  let b: number;
  let answer: number;

  switch (op) {
    case "add": {
      a = intInRange(rng, ADD_SUB_RANGE[difficulty]);
      b = intInRange(rng, ADD_SUB_RANGE[difficulty]);
      answer = a + b;
      break;
    }
    case "sub": {
      a = intInRange(rng, ADD_SUB_RANGE[difficulty]);
      b = intInRange(rng, ADD_SUB_RANGE[difficulty]);
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      break;
    }
    case "mul": {
      a = intInRange(rng, MUL_RANGE[difficulty]);
      b = intInRange(rng, MUL_RANGE[difficulty]);
      answer = a * b;
      break;
    }
    case "div":
    default: {
      const divisor = intInRange(rng, DIV_DIVISOR_RANGE[difficulty]);
      const quotient = intInRange(rng, DIV_QUOTIENT_RANGE[difficulty]);
      a = divisor * quotient;
      b = divisor;
      answer = quotient;
      break;
    }
  }

  const symbol = OPERATION_META[op].symbol;
  return { a, b, op, answer, prompt: `${a} ${symbol} ${b}` };
}

export function generateQuestions(config: RoundConfig): Question[] {
  const rng = mulberry32(config.seed);
  const ops = config.ops.length ? config.ops : ["add"];
  const questions: Question[] = [];
  let lastPrompt = "";

  for (let i = 0; i < config.questionCount; i++) {
    const op = ops[Math.floor(rng() * ops.length)] as Operation;
    let q = makeQuestion(op, config.difficulty, rng);
    let guard = 0;
    while (q.prompt === lastPrompt && guard++ < 5) {
      q = makeQuestion(op, config.difficulty, rng);
    }
    lastPrompt = q.prompt;
    questions.push(q);
  }
  return questions;
}

export const BASE_POINTS = 50;
export const MAX_SPEED_BONUS = 50;
export const MAX_MULTIPLIER = 5;

export function comboMultiplier(streak: number): number {
  return Math.min(1 + Math.floor(streak / 3), MAX_MULTIPLIER);
}

export function scoreAnswer(timeFraction: number, multiplier: number): number {
  const speedBonus = Math.round(MAX_SPEED_BONUS * Math.max(0, Math.min(1, timeFraction)));
  return Math.round((BASE_POINTS + speedBonus) * multiplier);
}

export function summarize(records: AnswerRecord[], config: RoundConfig) {
  const correct = records.filter((r) => r.correct).length;
  const score = records.reduce((s, r) => s + r.points, 0);
  let combo = 0;
  let maxCombo = 0;
  for (const r of records) {
    if (r.correct) {
      combo++;
      maxCombo = Math.max(maxCombo, combo);
    } else {
      combo = 0;
    }
  }
  return {
    score,
    correct,
    total: records.length,
    accuracy: records.length ? Math.round((correct / records.length) * 100) : 0,
    maxCombo,
    records,
    config,
  };
}
