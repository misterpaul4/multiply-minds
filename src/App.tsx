/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Carousel, Progress } from "antd";
import PlayerCount from "./components/PlayerCount";
import { useEffect, useMemo, useRef, useState } from "react";
import { CarouselRef } from "antd/es/carousel";
import AnswerContext from "./app/states/answersContext";
import { useRecoilState } from "recoil";
import PlayerDetails from "./components/PlayerDetails";
import answerState from "./app/states/answerAtom";
import Questions from "./components/Game";
import { config } from "./utils/constants";
import Final from "./components/Final";
import recordState from "./app/states/recordAtom";
import Countdown from "react-countdown";

function App() {
  const [gameConfig, setGameConfig] = useRecoilState(answerState);
  const [record] = useRecoilState(recordState);

  const [slide, setSlide] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const countdownRef = useRef<Countdown>(null);

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

  const totalPlayers = gameConfig.playerCount ?? 0;
  const totalGames = (totalPlayers ?? 1) * config.NUM_OF_QUESTIONS;

  const gameRunning = slide > 1 && slide < totalGames + 3;

  const startCT = () => countdownRef.current?.start();

  const stopCT = () => countdownRef.current?.stop();

  const goToSlide = (slide: number, delay = false, startCountDown = false) => {
    if (delay) {
      setTimeout(() => {
        setSlide(slide);
        sliderRef.current?.goTo(slide);
      }, 800);
    } else {
      setSlide(slide);
      sliderRef.current?.goTo(slide);
      setTimeout(() => {
        startCountDown && startCT();
      }, 200);
    }
  };

  const getpercent = () => {
    if (slide > 1) {
      return ((slide - 2) / totalGames) * 100;
    }

    return 0;
  };

  const Q = useMemo(() => {
    return Questions(totalPlayers);
  }, [totalPlayers]);

  return (
    <div className="pt-2">
      {/* <Button onClick={() => goToSlide(2 + totalGames)}>Jump to last</Button> */}
      <div className="content-container p-5" ref={ref}>
        {gameRunning && (
          <>
            <Progress
              status={slide < totalGames + 2 ? "active" : "success"}
              percent={getpercent()}
              className="progress mb-4"
              showInfo={false}
            />
            <Countdown
              className="text-danger fs-2"
              ref={countdownRef}
              autoStart={false}
              daysInHours
              date={Date.now() + 10000}
            />
          </>
        )}

        <AnswerContext.Provider
          value={{ goToSlide, setSlide, startCT, stopCT }}
        >
          <Carousel
            ref={sliderRef}
            dots={false}
            effect={slide > 1 ? "scrollx" : "fade"}
          >
            <PlayerCount />
            <PlayerDetails />
            {Q}
            <Final />
          </Carousel>
        </AnswerContext.Provider>
      </div>
    </div>
  );
}

export default App;

