/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom, selector } from "recoil";

const answerState = atom({
  key: "answerState", // unique ID (with respect to other atoms/selectors)
  default: [] as any[], // default value (aka initial value)
});

export const playerCountState = selector({
  key: "playerCount",
  get: ({ get }) => get(answerState)[0] as number,
});

export default answerState;

