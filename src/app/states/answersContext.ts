import React from "react";

interface IInitialValue {
  goToSlide: (slide: number, delay?: boolean) => void;
  setSlide: (slide: number) => void;
}

const initialValue: IInitialValue = {
  goToSlide() {},
  setSlide() {},
};

const AnswerContext = React.createContext(initialValue);
export default AnswerContext;

