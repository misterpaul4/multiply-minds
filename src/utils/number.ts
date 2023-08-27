import { config } from "./constants";
import {
  $gameDifficulty,
  $operators,
  IQuestionAnswer,
  PlayerStats,
} from "./types";

export function generateRandomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface IParams {
  operator: $operators;
  difficulty: $gameDifficulty;
}

const gameDifficultyConfig: Record<$gameDifficulty, [number, number]> = {
  "Very Easy": [1, 10],
  Easy: [5, 20],
  Moderate: [5, 50],
  Hard: [20, 100],
  "Very Hard": [100, 1000],
};

const gameDifficultyConfigMulti: Record<$gameDifficulty, [number, number]> = {
  "Very Easy": [2, 10],
  Easy: [2, 12],
  Moderate: [3, 30],
  Hard: [5, 50],
  "Very Hard": [10, 100],
};

export const getQuestionAndAnswer: (arg: IParams) => [string, number] = ({
  operator,
  difficulty,
}) => {
  const num1 =
    operator === "multiply (x)"
      ? generateRandomNumberInRange(...gameDifficultyConfigMulti[difficulty])
      : generateRandomNumberInRange(...gameDifficultyConfigMulti[difficulty]);
  const num2 =
    operator === "multiply (x)"
      ? generateRandomNumberInRange(...gameDifficultyConfig[difficulty])
      : generateRandomNumberInRange(...gameDifficultyConfig[difficulty]);

  switch (operator) {
    case "add (+)":
      return [`${num1} + ${num2}`, num1 + num2];

    case "subtract (-)":
      return [`${num1} - ${num2}`, num1 - num2];

    default:
      return [`${num1} x ${num2}`, num1 * num2];
  }
};

export const getRandomOperator = (op: $operators[]) => {
  const randomIndex = Math.floor(Math.random() * op.length);
  return op[randomIndex];
};

export const formatNumber = (amount: number) => {
  const breakAmount = amount.toString().split(".");
  const preDecimal = breakAmount[0];
  const postDecimal = breakAmount[1];
  const preDecimalWithCommas = preDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const resultArry = [preDecimalWithCommas, postDecimal];
  const result = postDecimal ? resultArry.join(".") : preDecimalWithCommas;
  return result;
};

export function getPlayerForGame(gameNumber: number, numberOfPlayers: number) {
  const playerIndex = (gameNumber - 1) % numberOfPlayers;
  return playerIndex;
}

export function calculatePercentageCorrect(
  data: IQuestionAnswer[]
): PlayerStats[] {
  const playerStatsMap: Map<number, PlayerStats> = new Map();

  // Iterate through the data and update player stats
  data.forEach((question) => {
    const playerStat = playerStatsMap.get(question.playerId) || {
      playerId: question.playerId,
      correctAnswers: 0,
      totalAnswers: 0,
      percentageCorrect: 0,
      playerName: question.name,
      points: 0,
    };

    if (question.value !== undefined && question.answer === question.value) {
      playerStat.correctAnswers++;
      playerStat.points += config.POINTS_PER_GAME;
    }

    playerStat.totalAnswers++;
    playerStatsMap.set(question.playerId, playerStat);
  });

  // Calculate the percentage & points of correct answers for each player
  const playerStats: PlayerStats[] = Array.from(playerStatsMap.values()).map(
    (playerStat) => {
      playerStat.percentageCorrect = Math.round(
        (playerStat.correctAnswers / playerStat.totalAnswers) * 100
      );
      return playerStat;
    }
  );

  return playerStats;
}

export function getWinnerPlayerIds(playerStats: PlayerStats[]): number[] {
  const winnerPlayerIds: number[] = [];
  let highestPercentage = 0;

  playerStats.forEach((playerStat) => {
    if (playerStat.percentageCorrect > highestPercentage) {
      highestPercentage = playerStat.percentageCorrect;
      winnerPlayerIds.length = 0; // Clear previous winners
      winnerPlayerIds.push(playerStat.playerId);
    } else if (
      playerStat.percentageCorrect === highestPercentage &&
      highestPercentage !== 0
    ) {
      winnerPlayerIds.push(playerStat.playerId);
    }
  });

  return winnerPlayerIds;
}

