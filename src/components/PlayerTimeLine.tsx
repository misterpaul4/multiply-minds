import { Tag, Timeline } from "antd";
import { IQuestionAnswer } from "../utils/types";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface IProps {
  result: IQuestionAnswer[];
}

const AnswerConfig = ({ rec }: { rec: IQuestionAnswer }) => {
  if (rec.answer === rec.value) {
    return (
      <Tag color="green" icon={<CheckCircleOutlined />}>
        <strong>A</strong>: {rec.value}
      </Tag>
    );
  }

  if (rec.value === undefined) {
    return (
      <Tag color="warning">
        Timeout!. Answer should be <strong>{rec.answer}</strong>
      </Tag>
    );
  }

  return (
    <>
      <Tag color="error" icon={<CloseCircleOutlined />}>
        <strong>A</strong>: {rec.value} <br /> Wrong!. Answer should be{" "}
        {rec.answer}
      </Tag>
    </>
  );
};

const PlayerTimeLine = ({ result }: IProps) => {
  return (
    <Timeline
      className="timeline-content"
      mode="alternate"
      items={result.map((rec, index) => {
        return {
          children: (
            <div>
              <p>
                <strong>Q{index + 1}</strong>: {rec.question}
              </p>
              <p>
                <AnswerConfig rec={rec} />
              </p>
            </div>
          ),
        };
      })}
    />
  );
};

export default PlayerTimeLine;

