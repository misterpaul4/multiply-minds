/* eslint-disable @typescript-eslint/no-explicit-any */
import { Carousel, Progress } from "antd";
import PlayerCount from "./components/PlayerCount";
import { useEffect, useRef, useState } from "react";
import { CarouselRef } from "antd/es/carousel";
import AnswerContext from "./app/states/answersContext";
import { useRecoilState } from "recoil";
import PlayerDetails from "./components/PlayerDetails";
import answerState from "./app/states/answerAtom";
import Questions from "./components/Game";
import { config } from "./utils/constants";
import Final from "./components/Final";

function App() {
  const [answers, setAnswers] = useRecoilState(answerState);
  const [slide, setSlide] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const removeDefaultTabbehaviour = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
      }
    };
    const reference = ref.current;

    reference!.addEventListener("keydown", removeDefaultTabbehaviour);

    return () =>
      reference!.removeEventListener("keydown", removeDefaultTabbehaviour);
  }, []);

  const sliderRef = useRef<CarouselRef>(null);

  const goToSlide = (slide: number) => {
    setSlide(slide);
    sliderRef.current?.goTo(slide);
  };

  const onAnswer = (slide: number, answer: any) => {
    const dup = [...answers];
    dup[slide] = answer;
    setAnswers(dup);
    goToSlide(slide + 1);
  };

  const getpercent = () => {
    if (slide > 1) {
      return ((slide - 2) / config.NUM_OF_QUESTIONS) * 100;
    }

    return 0;
  };

  return (
    <div className="pt-2">
      <div className="content-container p-5" ref={ref}>
        {slide > 1 && slide < config.NUM_OF_QUESTIONS + 3 && (
          <Progress
            status={slide < config.NUM_OF_QUESTIONS + 2 ? "active" : "success"}
            percent={getpercent()}
            className="progress mb-4"
            showInfo={false}
          />
        )}
        <AnswerContext.Provider value={{ goToSlide, onAnswer, setSlide }}>
          <Carousel ref={sliderRef} dots={false}>
            <PlayerCount />
            <PlayerDetails goToSlide={goToSlide} />
            {Questions}
            <Final />
          </Carousel>
        </AnswerContext.Provider>
      </div>
    </div>
  );
}

export default App;

