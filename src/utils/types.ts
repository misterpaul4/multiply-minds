import React from "react";

export interface IAnswer {
  title: string;
  value: unknown;
}

export type $operators = "add (+)" | "subtract (-)" | "multiply (x)";
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

export type $gameDifficulty =
  | "Very Easy"
  | "Easy"
  | "Moderate"
  | "Hard"
  | "Very Hard";

export interface IGameConfig {
  playerDetails: IPlayerDetail[];
  playerCount: number;
  gameCount: number;
  Questions: React.ReactElement[];
  numOfQuestions: number;
  durationInSeconds: number;
  difficulty: $gameDifficulty;
  operator: $operators[];
}

export interface PlayerStats {
  playerId: number;
  correctAnswers: number;
  totalAnswers: number;
  percentageCorrect: number;
  playerName: string;
  points: number;
}

export interface IPlayerTimeLine {
  result: IQuestionAnswer[];
  playerName: string;
}

