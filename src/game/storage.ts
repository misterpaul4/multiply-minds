import { DifficultyId, LeaderboardEntry, Operation } from "./types";

const PREFIX = "mm_v1_";
const LEADERBOARD_KEY = PREFIX + "leaderboard";
const SETTINGS_KEY = PREFIX + "settings";
const NAME_KEY = PREFIX + "name";

const MAX_ENTRIES = 25;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export interface SavedSettings {
  ops: Operation[];
  difficulty: DifficultyId;
}

export function loadSettings(): SavedSettings | null {
  return read<SavedSettings | null>(SETTINGS_KEY, null);
}

export function saveSettings(settings: SavedSettings): void {
  write(SETTINGS_KEY, settings);
}

export function loadName(): string {
  return read<string>(NAME_KEY, "");
}

export function saveName(name: string): void {
  write(NAME_KEY, name);
}

export function loadLeaderboard(): LeaderboardEntry[] {
  return read<LeaderboardEntry[]>(LEADERBOARD_KEY, []);
}

export function addLeaderboardEntry(entry: LeaderboardEntry): { board: LeaderboardEntry[]; rank: number } {
  const board = loadLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
  const trimmed = board.slice(0, MAX_ENTRIES);
  write(LEADERBOARD_KEY, trimmed);
  const rank = trimmed.indexOf(entry) + 1;
  return { board: trimmed, rank: rank || -1 };
}

export function personalBest(): number {
  const board = loadLeaderboard();
  return board.reduce((m, e) => Math.max(m, e.score), 0);
}

export function clearLeaderboard(): void {
  write(LEADERBOARD_KEY, []);
}
