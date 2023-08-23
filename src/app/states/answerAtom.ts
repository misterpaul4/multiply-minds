/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom, selector } from "recoil";
import { IGameConfig } from "../../utils/types";

const answerState = atom({
  key: "answerState",
  default: {} as IGameConfig,
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

