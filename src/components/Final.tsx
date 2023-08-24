import { ClockCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Modal,
  Progress,
  Space,
  Typography,
} from "antd";
import { useRecoilValue, useSetRecoilState } from "recoil";
import recordState, { getRecords } from "../app/states/recordAtom";
import { useContext, useMemo, useState } from "react";
import AnswerContext from "../app/states/answersContext";
import { slides } from "../utils/constants";
import {
  calculatePercentageCorrect,
  getWinnerPlayerIds,
} from "../utils/number";
import PlayerTimeLine from "./PlayerTimeLine";
import { IPlayerTimeLine } from "../utils/types";

const Final = () => {
  const setRecord = useSetRecoilState(recordState);
  const records = useRecoilValue(getRecords);
  const { currentSlide } = useContext(AnswerContext);
  const inLastSlide = currentSlide === slides.RESULT;

  const stats = useMemo(() => {
    if (inLastSlide) {
      console.log("xx CALCULATING STATS");
      return calculatePercentageCorrect(records);
    }
    return [];
  }, [inLastSlide, records]);

  const winners = useMemo(() => {
    if (stats.length) {
      console.log("xx CALCULATING WINNERS");
      return getWinnerPlayerIds(stats);
    }

    return [];
  }, [stats]);

  const noWinner = winners.length < 1;
  const isWinner = winners.length === 1;

  const [viewTimeLine, setViewTimeLine] = useState<IPlayerTimeLine>();

  const onTimeLineView = (playerName: string, id: number) => {
    setViewTimeLine({
      playerName,
      result: records.filter((rec) => rec.playerId === id),
    });
  };

  return (
    <div>
      <Modal
        cancelText="Close"
        okButtonProps={{ className: "d-none" }}
        open={!!viewTimeLine}
        onCancel={() => setViewTimeLine(undefined)}
        title={
          <Typography.Title level={4}>
            {viewTimeLine?.playerName}
          </Typography.Title>
        }
      >
        <PlayerTimeLine result={viewTimeLine?.result ?? []} />
      </Modal>

      <Typography.Title>Report</Typography.Title>
      <div className="font-italic report-card">
        <p>- {records.length} total questions</p>
        {stats.length > 1 && (
          <p>- {records.length / stats.length} questions each</p>
        )}
        {noWinner && <p>- No winners</p>}
      </div>
      <Space wrap size="large">
        {stats.map((stat) => {
          const PlayerStat = (
            <Card
              actions={[
                <Button
                  size="small"
                  icon={<ClockCircleOutlined />}
                  onClick={() => onTimeLineView(stat.playerName, stat.playerId)}
                >
                  Timeline
                </Button>,
              ]}
              style={{ backgroundColor: "transparent" }}
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
          );

          if (isWinner && winners[0] === stat.playerId) {
            return (
              <Badge.Ribbon key={stat.playerId} text="Winner" color="green">
                <div className="bg-light">{PlayerStat}</div>
              </Badge.Ribbon>
            );
          }

          return PlayerStat;
        })}
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

