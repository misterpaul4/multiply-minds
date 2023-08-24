/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom, selector } from "recoil";
import { IQuestionAnswer } from "../../utils/types";

const recordState = atom({
  key: "recordState",
  default: [] as IQuestionAnswer[],
});

export const getRecords = selector({
  key: "records",
  get: ({ get }) => get(recordState),
});

export default recordState;

