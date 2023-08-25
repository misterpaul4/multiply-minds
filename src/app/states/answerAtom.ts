import { atom, selector } from "recoil";
import { IGameConfig } from "../../utils/types";

const answerState = atom({
  key: "answerState",
  default: {
    gameCount: 0,
    Questions: [],
    playerCount: 0,
    playerDetails: [],
  } as IGameConfig,
});

export const playerCountState = selector({
  key: "playerCount",
  get: ({ get }) => get(answerState).playerCount,
});

export const players = selector({
  key: "players",
  get: ({ get }) => get(answerState).playerDetails,
});

export default answerState;

