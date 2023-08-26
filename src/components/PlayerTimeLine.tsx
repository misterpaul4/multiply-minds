import { Tag, Timeline, TimelineItemProps } from "antd";
import { IQuestionAnswer } from "../utils/types";
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

interface IProps {
  result: IQuestionAnswer[];
}

const answerConfig: (arg: { rec: IQuestionAnswer }) => TimelineItemProps = ({
  rec,
}) => {
  if (rec.answer === rec.value) {
    return {
      children: (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          <strong>A</strong>: {rec.value}
        </Tag>
      ),
      dot: <CheckSquareOutlined style={{ color: "green" }} />,
    };
  }

  if (rec.value === undefined) {
    return {
      children: (
        <Tag color="warning">
          Timeout!. Answer should be <strong>{rec.answer}</strong>
        </Tag>
      ),
      dot: <ClockCircleOutlined style={{ color: "#faad14" }} />,
    };
  }

  return {
    children: (
      <Tag color="error" icon={<CloseCircleOutlined />}>
        <strong>A</strong>: {rec.value} <br /> Wrong!. Answer should be{" "}
        {rec.answer}
      </Tag>
    ),
    dot: <CloseCircleOutlined style={{ color: "red" }} />,
  };
};

const PlayerTimeLine = ({ result }: IProps) => {
  return (
    <Timeline
      className="timeline-content"
      mode="alternate"
      items={result.map((rec, index) => {
        const { children, dot } = answerConfig({ rec });
        return {
          children: (
            <div>
              <p>
                <strong>Q{index + 1}</strong>: {rec.question}
              </p>
              <p>{children}</p>
            </div>
          ),
          dot,
        };
      })}
    />
  );
};

export default PlayerTimeLine;

