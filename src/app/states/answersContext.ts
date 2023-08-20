import React from "react";

interface IInitialValue {
  onAnswer: (slide: number, answer: unknown) => void;
  goToSlide: (slide: number) => void;
  setSlide: (slide: number) => void;
}

const initialValue: IInitialValue = {
  onAnswer() {},
  goToSlide() {},
  setSlide() {},
};

const AnswerContext = React.createContext(initialValue);
export default AnswerContext;

