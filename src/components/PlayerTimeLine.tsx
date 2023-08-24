import { Timeline } from "antd";
import { IQuestionAnswer } from "../utils/types";

interface IProps {
  result: IQuestionAnswer[];
}

const PlayerTimeLine = ({ result }: IProps) => {
  return (
    <Timeline
      mode="alternate"
      items={result.map((rec) => ({
        children: (
          <div>
            <p>
              <strong>Q</strong>: {rec.question}
            </p>
            <p>
              <strong>A</strong>: {rec.answer}
            </p>
          </div>
        ),
      }))}
    />
  );
};

export default PlayerTimeLine;

