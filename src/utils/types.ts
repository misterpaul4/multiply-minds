export interface IAnswer {
  title: string;
  value: unknown;
}

export type $operators = "add" | "subtract" | "multiply";

export interface IQuestionAnswer {
  question: string;
  answer: number;
  value?: number;
  playerId: number;
  name: string;
}

export interface IPlayerDetail {
  id: number;
  name: string;
}

export interface IGameConfig {
  playerDetails: IPlayerDetail[];
  playerCount: number;
}

export interface PlayerStats {
  playerId: number;
  correctAnswers: number;
  totalAnswers: number;
  percentageCorrect: number;
  playerName: string;
}

export interface IPlayerTimeLine {
  result: IQuestionAnswer[];
  playerName: string;
}
