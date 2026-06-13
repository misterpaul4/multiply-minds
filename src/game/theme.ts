import { DifficultyId, Operation } from "./types";

export const OP_COLOR: Record<Operation, { main: string; soft: string; deep: string }> = {
  add: { main: "#22c55e", soft: "#dcfce7", deep: "#15803d" },
  sub: { main: "#f97316", soft: "#ffedd5", deep: "#c2410c" },
  mul: { main: "#8b5cf6", soft: "#ede9fe", deep: "#6d28d9" },
  div: { main: "#ec4899", soft: "#fce7f3", deep: "#be185d" },
};

export const DIFFICULTY_COLOR: Record<DifficultyId, string> = {
  rookie: "#22c55e",
  easy: "#38bdf8",
  medium: "#f59e0b",
  hard: "#f97316",
  legend: "#ec4899",
};
