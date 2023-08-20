/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, Button } from "antd";
import Question from "./common/Question";
import { useSetRecoilState } from "recoil";
import recordState from "../app/states/recordAtom";
import { useContext, useState } from "react";
import {
  formatNumber,
  getQuestionAndAnswer,
  getRandomOperator,
} from "../utils/number";
import { config } from "../utils/constants";
import AnswerContext from "../app/states/answersContext";

interface IProps {
  slide: number;
  question: string;
  answer: number;
}

const Game = ({ slide, answer, question }: IProps) => {
  // const setRecord = useSetRecoilState(recordState);

  const { goToSlide } = useContext(AnswerContext);

  const [canMove, setCanMove] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean>();

  const onAnswer = (value: number) => {
    setCanMove(true);
    setIsCorrect(+value === answer);
  };

  return (
    <div className="w-50">
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

const Questions: React.ReactElement[] = [];

for (let index = 1; index < config.NUM_OF_QUESTIONS + 1; index++) {
  const operator = getRandomOperator();
  const [question, answer] = getQuestionAndAnswer({ operator });
  Questions.push(
    <Game answer={answer} question={question} key={index} slide={index + 1} />
  );
}

export default Questions;
