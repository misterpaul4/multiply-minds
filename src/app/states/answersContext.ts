import React from "react";

interface IInitialValue {
  goToSlide: (slide: number, delay?: boolean, startCountDown?: boolean) => void;
  setSlide: (slide: number) => void;
  startCT: () => void;
  stopCT: () => void;
}

const initialValue: IInitialValue = {
  goToSlide() {},
  setSlide() {},
  startCT() {},
  stopCT() {},
};

const AnswerContext = React.createContext(initialValue);
export default AnswerContext;

