/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "recoil";
import { IQuestionAnswer } from "../../utils/types";

const recordState = atom({
  key: "recordState",
  default: [] as IQuestionAnswer[],
});

export default recordState;

