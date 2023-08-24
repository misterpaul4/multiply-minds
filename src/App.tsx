import { Carousel, Progress } from "antd";
import PlayerCount from "./components/PlayerCount";
import { useEffect, useMemo, useRef, useState } from "react";
import { CarouselRef } from "antd/es/carousel";
import AnswerContext from "./app/states/answersContext";
import { useRecoilState } from "recoil";
import PlayerDetails from "./components/PlayerDetails";
import answerState from "./app/states/answerAtom";
import Questions from "./components/Game";
import { config, slides } from "./utils/constants";
import Final from "./components/Final";

function App() {
  const [gameConfig] = useRecoilState(answerState);

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

  const totalPlayers = gameConfig.playerCount ?? 0;
  const totalGames = (totalPlayers ?? 1) * config.NUM_OF_QUESTIONS;

  const gameRunning = slide > slides.PLAYER_DETAILS && slide < totalGames + 3;

  const nextSlide = (delay = false) => {
    if (delay) {
      setTimeout(() => {
        setSlide((current) => current + 1);
        sliderRef.current?.next();
      }, 800);
    } else {
      setSlide((current) => current + 1);
      sliderRef.current?.next();
    }
  };

  const prevSlide = () => {
    setSlide((current) => current - 1);
    sliderRef.current?.prev();
  };

  const goToSlide = (val: number) => {
    setSlide(val);
    sliderRef.current?.goTo(val);
  };

  const getpercent = () => {
    if (slide > slides.PLAYER_DETAILS) {
      return ((slide - slides.GAME_START) / totalGames) * 100;
    }

    return 0;
  };

  const Q = useMemo(() => {
    return Questions(totalPlayers);
  }, [totalPlayers]);

  return (
    <div className="pt-2">
      <div className="content-container p-5" ref={ref}>
        {gameRunning && (
          <>
            <Progress
              status={
                slide < totalGames + slides.GAME_START ? "active" : "success"
              }
              percent={getpercent()}
              className="progress mb-4"
              showInfo={false}
            />
          </>
        )}

        <AnswerContext.Provider
          value={{
            goToSlide,
            nextSlide,
            prevSlide,
            currentSlide: slide,
          }}
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

