import { Challenge, Operation } from "./types";
import { OPERATION_META, difficultyMeta } from "./engine";

function encode(obj: unknown): string {
  const json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decode<T>(str: string): T | null {
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function appBaseUrl(): string {
  return window.location.origin + import.meta.env.BASE_URL;
}

export function buildChallengeUrl(challenge: Challenge): string {
  return `${appBaseUrl()}?c=${encode(challenge)}`;
}

export function readChallengeFromUrl(): Challenge | null {
  const params = new URLSearchParams(window.location.search);
  const c = params.get("c");
  if (!c) return null;
  const decoded = decode<Challenge>(c);
  if (!decoded || !Array.isArray(decoded.ops) || !decoded.difficulty) return null;
  return decoded;
}

export function clearChallengeFromUrl(): void {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, "", url.toString());
}

export function opsLabel(ops: Operation[]): string {
  return ops.map((o) => OPERATION_META[o].symbol).join(" ");
}

export interface ShareScorePayload {
  name: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  ops: Operation[];
  difficulty: Challenge["difficulty"];
  challengeUrl?: string;
}

export function buildShareText(p: ShareScorePayload): string {
  const diff = difficultyMeta(p.difficulty);
  const lines = [
    `🧠 Multiply Minds — ${diff.emoji} ${diff.label}`,
    `${p.name || "I"} scored ${p.score.toLocaleString()} pts!`,
    `🎯 ${p.accuracy}% accurate · 🔥 best combo x${p.maxCombo} · ${opsLabel(p.ops)}`,
  ];
  if (p.challengeUrl) {
    lines.push(`Can you beat me? ${p.challengeUrl}`);
  }
  return lines.join("\n");
}

export type ShareOutcome = "shared" | "copied" | "failed";

export async function shareScore(p: ShareScorePayload): Promise<ShareOutcome> {
  const text = buildShareText(p);
  const nav = navigator as Navigator & {
    share?: (data: ShareData) => Promise<void>;
  };
  if (nav.share) {
    const shared = await nav
      .share({ title: "Multiply Minds", text, url: p.challengeUrl })
      .then(() => true)
      .catch(() => false);
    if (shared) return "shared";
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
