import { $operators } from "./types";

export function generateRandomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface IParams {
  operator: $operators;
}

export const getQuestionAndAnswer: (arg: IParams) => [string, number] = ({
  operator,
}) => {
  let num1 = generateRandomNumberInRange(2, 100);
  let num2 = generateRandomNumberInRange(2, 100);

  if (num1 < num2) {
    const temp = num1;
    num1 = num2;
    num2 = temp;
  }

  switch (operator) {
    case "add":
      return [`${num1} + ${num2}`, num1 + num2];

    case "subtract":
      return [`${num1} - ${num2}`, num1 - num2];

    default:
      return [`${num1} x ${num2}`, num1 * num2];
  }
};

const operators: $operators[] = ["add", "multiply", "subtract"];

export const getRandomOperator = () => {
  const randomIndex = Math.floor(Math.random() * operators.length);
  return operators[randomIndex];
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

