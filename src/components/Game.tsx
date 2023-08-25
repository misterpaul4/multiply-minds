/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Button, Form, Space, Typography } from "antd";
import Question from "./common/Question";
import { useContext, useEffect, useRef, useState } from "react";
import {
  formatNumber,
  getPlayerForGame,
  getQuestionAndAnswer,
  getRandomOperator,
} from "../utils/number";
import { slides } from "../utils/constants";
import AnswerContext from "../app/states/answersContext";
import {
  durationInSeconds,
  playerCountState,
  players,
} from "../app/states/configAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import recordState from "../app/states/recordAtom";
import Countdown from "react-countdown";
import Icon from "@ant-design/icons";
import Clock from "../app/icons/Clock";

interface IProps {
  gameNumber: number;
  question: string;
  answer: number;
  isLastGame?: boolean;
}

export const Game = ({ gameNumber, answer, question }: IProps) => {
  const { nextSlide, currentSlide } = useContext(AnswerContext);
  const playerCount = useRecoilValue(playerCountState);
  const playerDetails = useRecoilValue(players) ?? [];
  const gameDurationInSeconds = useRecoilValue(durationInSeconds);
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
  const [inputDisable, setInputDisable] = useState(false);

  const [form] = Form.useForm();

  const stopCT = () => countdownRef.current?.pause();

  const startCT = () => countdownRef.current?.start();

  const onAnswer = (value: number) => {
    stopCT();
    value = +value;
    setIsCorrect(value === answer);
    setInputDisable(true);
    setCanMove(true);
    setRecord((current) => [
      ...current,
      {
        answer,
        playerId: playerDetails[playerIndex].id,
        question,
        value,
        name: currentPlayer,
      },
    ]);
  };

  useEffect(() => {
    if (currentSlide === gameNumber + slides.PLAYER_DETAILS) {
      setCountdownTimer(Date.now() + gameDurationInSeconds * 1000);
      startCT();
    }
  }, [currentSlide, gameNumber, gameDurationInSeconds]);

  const resetValues = () => {
    setIsCorrect(undefined);
    setCanMove(false);
    setTimeFinished(false);
    setInputDisable(false);
    form.resetFields();
  };

  return (
    <div className="w-50">
      <Space align="center" className="countdown-container">
        <Icon
          style={{ fontSize: "2rem" }}
          component={Clock}
          className={timeFinished ? "shake" : undefined}
        />
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
      </Space>

      <Typography.Title level={1}>{currentPlayer}</Typography.Title>
      <Question
        form={form}
        question={question}
        answer={answer}
        onAnswer={onAnswer}
        timeFinished={timeFinished}
        disabled={inputDisable}
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
            if (timeFinished) {
              setTimeFinished(false);
              setRecord((current) => [
                ...current,
                {
                  answer,
                  playerId: playerDetails[playerIndex].id,
                  question,
                  name: currentPlayer,
                },
              ]);
            }
            nextSlide();
            resetValues();
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

const Questions = (total: number, numOfQuestions: number) => {
  const components: React.ReactElement[] = [];

  total = total * numOfQuestions;

  for (let index = 1; index < total + 1; index++) {
    const operator = getRandomOperator();
    const [question, answer] = getQuestionAndAnswer({ operator });
    components.push(
      <Game
        answer={answer}
        question={question}
        key={index}
        gameNumber={index}
        isLastGame={total === index}
      />
    );
  }

  return components;
};

export default Questions;

