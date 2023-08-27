import { atom, selector } from "recoil";
import { IGameConfig } from "../../utils/types";
import { config } from "../../utils/constants";

export const defaultConfig: IGameConfig = {
  gameCount: 0,
  Questions: [],
  playerCount: 0,
  playerDetails: [],
  numOfQuestions: config.NUM_OF_QUESTIONS(),
  durationInSeconds: config.DURATION(),
  difficulty: config.DIFFICULTY(),
};

const configState = atom({
  key: "configState",
  default: defaultConfig,
});

export const playerCountState = selector({
  key: "playerCount",
  get: ({ get }) => get(configState).playerCount,
});

export const players = selector({
  key: "players",
  get: ({ get }) => get(configState).playerDetails,
});

export const numOfQuestions = selector({
  key: "numOfQuestions",
  get: ({ get }) => get(configState).numOfQuestions,
});

export const durationInSeconds = selector({
  key: "durationInSeconds",
  get: ({ get }) => get(configState).durationInSeconds,
});

export const difficulty = selector({
  key: "difficulty",
  get: ({ get }) => get(configState).difficulty,
});

export default configState;

