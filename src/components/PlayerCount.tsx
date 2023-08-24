import Question from "./common/Question";
import { IAnswer } from "../utils/types";
import { useSetRecoilState } from "recoil";
import answerState from "../app/states/answerAtom";
import { useContext } from "react";
import AnswerContext from "../app/states/answersContext";

const PlayerCount = () => {
  const values: IAnswer[] = [
    { title: "1 Player", value: 1 },
    { title: "2 Players", value: 2 },
    { title: "3 Players", value: 3 },
    { title: "4 Players", value: 4 },
  ];

  const setGameConfig = useSetRecoilState(answerState);
  const nextSlide = useContext(AnswerContext).nextSlide;

  return (
    <Question
      question="How Many Players"
      suggestedAnswers={values}
      onAnswer={(answer) => {
        setGameConfig((current) => ({
          ...current,
          playerCount: answer as number,
        }));
        nextSlide(true);
      }}
      isMultipleChoice
    />
  );
};

export default PlayerCount;

