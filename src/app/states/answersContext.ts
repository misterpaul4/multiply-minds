import React from "react";

interface IInitialValue {
  goToSlide: (slide: number, delay?: boolean) => void;
  nextSlide: (delay?: boolean) => void;
  prevSlide: () => void;
  currentSlide: number;
}

const initialValue: IInitialValue = {
  goToSlide() {},
  nextSlide() {},
  prevSlide() {},
  currentSlide: 0,
};

const AnswerContext = React.createContext(initialValue);
export default AnswerContext;

