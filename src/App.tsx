/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel, Progress } from "antd";
import PlayerCount from "./components/PlayerCount";
import { useRef } from "react";
import { CarouselRef } from "antd/es/carousel";
import AnswerContext from "./app/states/answersContext";
import { useRecoilState } from "recoil";
import PlayerDetails from "./components/PlayerDetails";
import answerState from "./app/states/answerAtom";

function App() {
  const [answers, setAnswers] = useRecoilState(answerState);
  const sliderRef = useRef<CarouselRef>(null);

  const goToSlide = (slide: number) => {
    sliderRef.current?.goTo(slide);
  };

  const onAnswer = (slide: number, answer: any) => {
    const dup = [...answers];
    dup[slide] = answer;
    setAnswers(dup);
    goToSlide(slide + 1);
  };

  return (
    <div className="pt-2">
      <div className="content-container p-5">
        {!!answers.length && <Progress className="progress mb-4" />}
        <AnswerContext.Provider value={onAnswer}>
          <Carousel ref={sliderRef} dots={false}>
            <PlayerCount />
            <PlayerDetails goToSlide={goToSlide} />
          </Carousel>
        </AnswerContext.Provider>
      </div>
    </div>
  );
}

export default App;

