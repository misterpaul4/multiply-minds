import { getLs } from "./localStoage";
import { IGameConfig } from "./types";

export const slides = {
  PLAYER_COUNT: 0,
  PLAYER_DETAILS: 1,
  GAME_START: 2,
  RESULT: -1,
};

const NUM_OF_QUESTIONS_LS_KEY: keyof IGameConfig = "numOfQuestions";
const DURATION_LS_KEY: keyof IGameConfig = "durationInSeconds";

export const config = {
  NUM_OF_QUESTIONS: getLs(NUM_OF_QUESTIONS_LS_KEY) ?? 5,
  DURATION: getLs(DURATION_LS_KEY) ?? 10,
  POINTS_PER_GAME: 5,
};

