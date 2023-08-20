import Question from "./common/Question";
import { IAnswer } from "../utils/types";
import { slides } from "../utils/constants";

const PlayerCount = () => {
  const values: IAnswer[] = [
    { title: "1 Player", value: 1 },
    { title: "2 Players", value: 2 },
    { title: "3 Players", value: 3 },
    { title: "4 Players", value: 4 },
  ];

  return (
    <Question
      question="How Many Players"
      suggestedAnswers={values}
      slide={slides.PLAYER_COUNT}
      isMultipleChoice
    />
  );
};

export default PlayerCount;

