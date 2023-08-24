/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Button, Typography } from "antd";
import Question from "./common/Question";
import { useContext, useEffect, useRef, useState } from "react";
import {
  formatNumber,
  getPlayerForGame,
  getQuestionAndAnswer,
  getRandomOperator,
} from "../utils/number";
import { config, gameDurationInSeconds, slides } from "../utils/constants";
import AnswerContext from "../app/states/answersContext";
import { playerCountState, players } from "../app/states/answerAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import recordState from "../app/states/recordAtom";
import Countdown from "react-countdown";

interface IProps {
  gameNumber: number;
  question: string;
  answer: number;
}

export const Game = ({ gameNumber, answer, question }: IProps) => {
  const { nextSlide, currentSlide } = useContext(AnswerContext);
  const playerCount = useRecoilValue(playerCountState);
  const playerDetails = useRecoilValue(players) ?? [];
  const setRecord = useSetRecoilState(recordState);

  const [canMove, setCanMove] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean>();

  const playerIndex = getPlayerForGame(gameNumber, playerCount);
  const currentPlayer = playerDetails?.[playerIndex]?.name;

  const [countdownTimer, setCountdownTimer] = useState<number>(
    Date.now() * 600000 // initialize countdown with 1hour
  );
  const countdownRef = useRef<Countdown>(null);
  const [timeFinished, setTimeFinished] = useState(false);

  const stopCT = () => countdownRef.current?.pause();

  const startCT = () => countdownRef.current?.start();

  const onAnswer = (value: number) => {
    stopCT();
    value = +value;
    setIsCorrect(value === answer);

    setCanMove(true);
    setRecord((current) => [
      ...current,
      { answer, playerId: playerDetails[playerIndex].id, question, value },
    ]);
  };

  useEffect(() => {
    if (currentSlide === gameNumber + slides.PLAYER_DETAILS) {
      setCountdownTimer(Date.now() + gameDurationInSeconds);
      startCT();
    }
  }, [currentSlide, gameNumber]);

  return (
    <div className="w-50">
      <Countdown
        className="text-danger fs-2"
        ref={countdownRef}
        autoStart={false}
        daysInHours
        date={countdownTimer}
        onComplete={() => {
          setTimeFinished(true);
        }}
      />

      <Typography.Title level={1}>{currentPlayer}</Typography.Title>
      <Question
        question={question}
        answer={answer}
        onAnswer={onAnswer}
        timeFinished={timeFinished}
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

      {timeFinished && (
        <Alert
          type="warning"
          className="mt-3"
          message={
            <span>
              You ran out of time!. Answer is{" "}
              <strong>{formatNumber(answer)}</strong>
            </span>
          }
        />
      )}
      <Button
        size="large"
        type="primary"
        onClick={() => {
          if (canMove || timeFinished) {
            setTimeFinished(false);
            nextSlide();
          }
        }}
        className="mt-4"
        disabled={!canMove && !timeFinished}
      >
        Next
      </Button>
    </div>
  );
};

const Questions = (total: number) => {
  const components: React.ReactElement[] = [];

  for (let index = 1; index < total * config.NUM_OF_QUESTIONS; index++) {
    const operator = getRandomOperator();
    const [question, answer] = getQuestionAndAnswer({ operator });
    components.push(
      <Game
        answer={answer}
        question={question}
        key={index}
        gameNumber={index}
      />
    );
  }

  return components;
};

export default Questions;

