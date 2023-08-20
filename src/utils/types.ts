export interface IAnswer {
  title: string;
  value: unknown;
}

export type $operators = "add" | "subtract" | "multiply";

export interface IQuestionAnswer {
  question: string;
  answer: number;
  value: number;
  playerId: number;
}

export interface IPlayerDetail {
  id: number;
  name: string;
}
