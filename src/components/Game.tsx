/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertProps, Button, Form, Space, Typography } from "antd";
import Question from "./common/Question";
import { useContext, useEffect, useState } from "react";
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
import Icon from "@ant-design/icons";
import Clock from "../app/icons/Clock";
import useCountdown from "../app/hooks/useCountdownTimer";
import { $gameDifficulty } from "../utils/types";

interface IProps {
  gameNumber: number;
  question: string;
  answer: number;
  isLastGame?: boolean;
}

const AlertComp: (arg: {
  canMove: boolean;
  timeFinished: boolean;
  isCorrect?: boolean;
  answer?: number;
}) => React.ReactElement | null = ({
  canMove,
  timeFinished,
  isCorrect,
  answer,
}) => {
  const props: AlertProps = {};
  if (isCorrect) {
    props.type = "success";
    props.message = "Correct";
  } else if (canMove && !isCorrect) {
    props.type = "error";
    props.message = (
      <span>
        Wrong!. correct answer is <strong>{formatNumber(answer!)}</strong>
      </span>
    );
  } else if (timeFinished) {
    props.type = "warning";
    props.message = (
      <span>
        You ran out of time!. Answer is <strong>{formatNumber(answer!)}</strong>
      </span>
    );
  } else {
    return null;
  }

  return <Alert {...props} className="mt-3" showIcon />;
};

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

  const [timeFinished, setTimeFinished] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);

  const [form] = Form.useForm();

  const { countdown, pause, start } = useCountdown(gameDurationInSeconds, () =>
    setTimeFinished(true)
  );

  const onAnswer = (value: number) => {
    pause();
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
      setTimeFinished(false);
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, gameNumber, gameDurationInSeconds]);

  const resetValues = () => {
    setIsCorrect(undefined);
    setCanMove(false);
    setTimeFinished(false);
    setInputDisable(false);
    form.resetFields();
  };

  return (
    <div>
      <Space align="center" className="countdown-container">
        <Icon
          style={{ fontSize: "2rem" }}
          component={Clock}
          className={timeFinished ? "shake" : undefined}
        />
        <span className="text-danger fs-2">{countdown}</span>
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
      <AlertComp
        canMove={canMove}
        timeFinished={timeFinished}
        answer={answer}
        isCorrect={isCorrect}
      />
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

const Questions = (
  total: number,
  numOfQuestions: number,
  difficulty: $gameDifficulty
) => {
  const components: React.ReactElement[] = [];

  total = total * numOfQuestions;

  for (let index = 1; index < total + 1; index++) {
    const operator = getRandomOperator();
    const [question, answer] = getQuestionAndAnswer({ operator, difficulty });
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

