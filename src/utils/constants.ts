import { getLs } from "./localStoage";
import { $gameDifficulty, IGameConfig } from "./types";

export const slides = {
  PLAYER_COUNT: 0,
  PLAYER_DETAILS: 1,
  GAME_START: 2,
  RESULT: -1,
};

const NUM_OF_QUESTIONS_LS_KEY: keyof IGameConfig = "numOfQuestions";
const DURATION_LS_KEY: keyof IGameConfig = "durationInSeconds";
const DIFFICULTY_KS_KEY: keyof IGameConfig = "difficulty";

export const config = {
  NUM_OF_QUESTIONS: () => getLs(NUM_OF_QUESTIONS_LS_KEY) ?? 5,
  DURATION: () => getLs(DURATION_LS_KEY) ?? 10,
  DIFFICULTY: () => getLs(DIFFICULTY_KS_KEY) ?? "Moderate",
  POINTS_PER_GAME: 5,
};

export const gameDifficulties: $gameDifficulty[] = [
  "Very Easy",
  "Easy",
  "Moderate",
  "Hard",
  "Very Hard",
];

