/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Button, Typography } from "antd";
import Question from "./common/Question";
import { useContext, useState } from "react";
import {
  formatNumber,
  getPlayerForGame,
  getQuestionAndAnswer,
  getRandomOperator,
} from "../utils/number";
import { config } from "../utils/constants";
import AnswerContext from "../app/states/answersContext";
import { playerCountState, players } from "../app/states/answerAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import recordState from "../app/states/recordAtom";

interface IProps {
  slide: number;
  question: string;
  answer: number;
}

export const Game = ({ slide, answer, question }: IProps) => {
  const { goToSlide, setSlide } = useContext(AnswerContext);
  const playerCount = useRecoilValue(playerCountState);
  const playerDetails = useRecoilValue(players) ?? [];
  const setRecord = useSetRecoilState(recordState);

  const [canMove, setCanMove] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean>();

  const playerIndex = getPlayerForGame(slide - 1, playerCount);
  const currentPlayer = playerDetails?.[playerIndex]?.name;

  const onAnswer = (value: number) => {
    value = +value;
    setCanMove(true);
    setIsCorrect(value === answer);
    setRecord((current) => [
      ...current,
      { answer, playerId: playerDetails[playerIndex].id, question, value },
    ]);

    setSlide(slide + 1);
  };

  return (
    <div className="w-50">
      <Typography.Title level={1}>{currentPlayer}</Typography.Title>
      <Question
        question={question}
        slide={slide}
        answer={answer}
        onResponse={onAnswer}
      />
      {canMove && (
        <Alert
          type={isCorrect ? "success" : "error"}
          className="mt-3"
          message={
            isCorrect ? (
              "Correct"
            ) : (
              <span>
                Wrong!. correct answer is{" "}
                <strong>{formatNumber(answer)}</strong>
              </span>
            )
          }
          showIcon
        />
      )}
      <Button
        size="large"
        type="primary"
        onClick={() => canMove && goToSlide(slide + 1)}
        className="mt-4"
        disabled={!canMove}
      >
        Next
      </Button>
    </div>
  );
};

const Questions = (total: number) => {
  if (!total) {
    return null;
  }

  const components: React.ReactElement[] = [];

  for (let index = 1; index < total * config.NUM_OF_QUESTIONS + 1; index++) {
    const operator = getRandomOperator();
    const [question, answer] = getQuestionAndAnswer({ operator });
    components.push(
      <Game answer={answer} question={question} key={index} slide={index + 1} />
    );
  }

  return components.map((Comp) => Comp);
};

export default Questions;

