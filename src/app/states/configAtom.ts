import { atom, selector } from "recoil";
import { IGameConfig } from "../../utils/types";

const configState = atom({
  key: "configState",
  default: {
    gameCount: 0,
    Questions: [],
    playerCount: 0,
    playerDetails: [],
  } as IGameConfig,
});

export const playerCountState = selector({
  key: "playerCount",
  get: ({ get }) => get(configState).playerCount,
});

export const players = selector({
  key: "players",
  get: ({ get }) => get(configState).playerDetails,
});

export default configState;

