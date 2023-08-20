import React from "react";

interface IInitialValue {
  onAnswer: (slide: number, answer: unknown) => void;
  goToSlide: (slide: number) => void;
}

const initialValue: IInitialValue = {
  onAnswer() {},
  goToSlide() {},
};

const AnswerContext = React.createContext(initialValue);
export default AnswerContext;

