import { Carousel, Progress, Spin } from "antd";
import PlayerCount from "./components/PlayerCount";
import { useEffect, useRef, useState } from "react";
import { CarouselRef } from "antd/es/carousel";
import AnswerContext from "./app/states/answersContext";
import { useRecoilState } from "recoil";
import PlayerDetails from "./components/PlayerDetails";
import answerState from "./app/states/answerAtom";
import { config, slides } from "./utils/constants";
import Final from "./components/Final";
import { LoadingOutlined } from "@ant-design/icons";

function App() {
  const [gameConfig] = useRecoilState(answerState);

  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      setTimeout(() => {
        setSlide((current) => current + 1);
        sliderRef.current?.next();
        setLoading(false);
      }, 1000);
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
        <Spin indicator={<LoadingOutlined />} spinning={loading}>
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
              effect={slide > slides.PLAYER_DETAILS ? "scrollx" : "fade"}
            >
              <PlayerCount />
              <PlayerDetails />
              {gameConfig.Questions}
              <Final />
            </Carousel>
          </AnswerContext.Provider>
        </Spin>
      </div>
    </div>
  );
}

export default App;

