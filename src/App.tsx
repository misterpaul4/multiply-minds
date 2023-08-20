/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel, Progress, Typography } from "antd";
import PlayerCount from "./components/PlayerCount";
import { useRef } from "react";
import { CarouselRef } from "antd/es/carousel";
import AnswerContext from "./app/context/answersContext";
import { atom, useRecoilState } from "recoil";
import PlayerDetails from "./components/PlayerDetails";

const answerState = atom({
  key: "answerState", // unique ID (with respect to other atoms/selectors)
  default: [] as any[], // default value (aka initial value)
});

function App() {
  const [answers, setAnswers] = useRecoilState(answerState);
  const sliderRef = useRef<CarouselRef>(null);

  const goToSlide = (slide: number) => {
    sliderRef.current?.goTo(slide);
  };

  console.log(answers);

  const onAnswer = (slide: number, answer: any) => {
    setAnswers((current) => [...current, answer]);
    goToSlide(slide + 1);
  };

  return (
    <div className="pt-2">
      <div className="content-container p-5">
        <Progress className="progress mb-4" />
        <AnswerContext.Provider value={onAnswer}>
          <Carousel ref={sliderRef} dots={false}>
            <PlayerCount />
            <PlayerDetails />
          </Carousel>
        </AnswerContext.Provider>
      </div>

      <Typography.Title level={1} className="text-center mt-5">
        Math Trivia
      </Typography.Title>
    </div>
  );
}

export default App;

