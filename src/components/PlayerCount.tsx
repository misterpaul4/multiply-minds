import Question from "./common/Question";
import { IAnswer } from "../utils/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import configState, {
  difficulty,
  numOfQuestions,
} from "../app/states/configAtom";
import { useContext } from "react";
import AnswerContext from "../app/states/answersContext";
import { slides } from "../utils/constants";
import Questions from "./Game";
import GameSettings from "./common/Settings";

const options: IAnswer[] = [
  { title: "1 Player", value: 1 },
  { title: "2 Players", value: 2 },
  { title: "3 Players", value: 3 },
  { title: "4 Players", value: 4 },
];

const PlayerCount = () => {
  const setGameConfig = useSetRecoilState(configState);
  const nextSlide = useContext(AnswerContext).nextSlide;
  const NUM_OF_QUESTIONS = useRecoilValue(numOfQuestions);
  const gameDifficulty = useRecoilValue(difficulty);

  return (
    <>
      <GameSettings />
      <Question
        question="How Many Players"
        suggestedAnswers={options}
        onAnswer={(answer) => {
          setGameConfig((current) => ({
            ...current,
            playerCount: answer as number,
            Questions: Questions(answer, NUM_OF_QUESTIONS, gameDifficulty),
          }));
          slides.RESULT = slides.PLAYER_DETAILS + 1 + answer * NUM_OF_QUESTIONS;
          nextSlide(true);
        }}
        isMultipleChoice
      />
    </>
  );
};

export default PlayerCount;

