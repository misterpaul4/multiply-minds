import React from "react";

const initialValue: (slide: number, answer: unknown) => void = () => undefined;

const AnswerContext = React.createContext(initialValue);
export default AnswerContext;

