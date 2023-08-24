import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Progress, Space, Typography } from "antd";
import { useRecoilValue, useSetRecoilState } from "recoil";
import recordState, { getRecords } from "../app/states/recordAtom";
import { useContext, useMemo } from "react";
import AnswerContext from "../app/states/answersContext";
import { slides } from "../utils/constants";
import { calculatePercentageCorrect } from "../utils/number";

const Final = () => {
  const setRecord = useSetRecoilState(recordState);
  const records = useRecoilValue(getRecords);
  const { currentSlide } = useContext(AnswerContext);
  const inLastSlide = currentSlide === slides.RESULT;

  const stats = useMemo(() => {
    if (inLastSlide) {
      return calculatePercentageCorrect(records);
    }
    return [];
  }, [inLastSlide, records]);

  return (
    <div>
      <Typography.Title>Report</Typography.Title>
      <div className="font-italic">
        <p className="m-0 p-0">- {records.length} questions</p>
        {stats.length > 1 && (
          <p className="m-0 p-0">
            - {records.length / stats.length} questions each
          </p>
        )}
      </div>
      <Space wrap>
        {stats.map((stat) => (
          <Card
            key={stat.playerId}
            className="text-center"
            title={
              <Typography.Title level={4}>{stat.playerName}</Typography.Title>
            }
          >
            <Progress type="circle" percent={stat.percentageCorrect} />
            <Descriptions bordered layout="vertical" className="mt-5">
              <Descriptions.Item
                labelStyle={{ fontWeight: "bold" }}
                label="Correct Answers"
              >
                <span className="fs-2 p-1">{stat.correctAnswers}</span>
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ fontWeight: "bold" }}
                label="Wrong Answers"
              >
                <span className="fs-2 p-1">
                  {stat.totalAnswers - stat.correctAnswers}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ))}
      </Space>
      <div className="mt-5">
        <Button
          size="large"
          icon={<ReloadOutlined />}
          type="primary"
          onClick={() => setRecord([])}
        >
          Restart
        </Button>
      </div>
    </div>
  );
};

export default Final;

