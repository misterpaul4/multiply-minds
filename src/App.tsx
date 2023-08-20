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

  return (
    <div className="pt-2">
      <div className="content-container p-5" ref={ref}>
        {slide > 1 && <Progress className="progress mb-4" />}
        <AnswerContext.Provider value={{ goToSlide, onAnswer }}>
          <Carousel ref={sliderRef} dots={false}>
            <PlayerCount />
            <PlayerDetails goToSlide={goToSlide} />
            {Questions}
          </Carousel>
        </AnswerContext.Provider>
      </div>
    </div>
  );
}

export default App;

