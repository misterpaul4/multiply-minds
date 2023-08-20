import { useState } from "react";
import { getLs, setLS } from "../../utils/localStoage";

interface Props {
  key: string;
  fallback: unknown;
}

const useLocalStorage = ({ key, fallback }: Props) => {
  const [state, setState] = useState(getLs(key) ?? fallback);

  const update = (newValue: unknown) => {
    setLS(key, newValue);
    setState(newValue);
  };

  return [state, update];
};

export default useLocalStorage;

