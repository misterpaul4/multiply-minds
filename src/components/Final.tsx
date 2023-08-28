import { ClockCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Modal,
  Popconfirm,
  Progress,
  Space,
  Typography,
} from "antd";
import { useRecoilValue, useSetRecoilState } from "recoil";
import recordState, {
  defaultRecord,
  getRecords,
} from "../app/states/recordAtom";
import { useContext, useMemo, useState } from "react";
import AnswerContext from "../app/states/answersContext";
import { config, slides } from "../utils/constants";
import {
  calculatePercentageCorrect,
  getWinnerPlayerIds,
} from "../utils/number";
import PlayerTimeLine from "./PlayerTimeLine";
import { IPlayerTimeLine } from "../utils/types";
import configState, {
  defaultConfig,
  difficulty,
  gameOperators,
  numOfQuestions,
  playerCountState,
} from "../app/states/configAtom";
import Questions from "./Game";

const Final = () => {
  const setRecord = useSetRecoilState(recordState);
  const setConfig = useSetRecoilState(configState);
  const records = useRecoilValue(getRecords);
  const { currentSlide, goToSlide } = useContext(AnswerContext);
  const inLastSlide = currentSlide === slides.RESULT;
  const playerCount = useRecoilValue(playerCountState);
  const NUM_OF_QUESTIONS = useRecoilValue(numOfQuestions);
  const gameDifficulty = useRecoilValue(difficulty);
  const operator = useRecoilValue(gameOperators);

  const stats = useMemo(() => {
    if (inLastSlide) {
      return calculatePercentageCorrect(records);
    }
    return [];
  }, [inLastSlide, records]);

  const winners = useMemo(() => {
    if (stats.length) {
      return getWinnerPlayerIds(stats);
    }

    return [];
  }, [stats]);

  const isWinner = winners.length === 1;

  const [viewTimeLine, setViewTimeLine] = useState<IPlayerTimeLine>();

  const onTimeLineView = (playerName: string, id: number) => {
    setViewTimeLine({
      playerName,
      result: records.filter((rec) => rec.playerId === id),
    });
  };

  const reset = () => {
    setRecord(defaultRecord);
    setConfig({
      ...defaultConfig,
      numOfQuestions: config.NUM_OF_QUESTIONS(),
      durationInSeconds: config.DURATION(),
      difficulty: config.DIFFICULTY(),
      operator: config.OPERATOR(),
    });
  };

  return (
    <div>
      <Modal
        cancelText="Close"
        okButtonProps={{ className: "d-none" }}
        open={!!viewTimeLine}
        onCancel={() => setViewTimeLine(undefined)}
        cancelButtonProps={{ className: "d-none" }}
        title={
          <Typography.Title level={4}>
            {viewTimeLine?.playerName}
          </Typography.Title>
        }
      >
        <PlayerTimeLine result={viewTimeLine?.result ?? []} />
      </Modal>

      <Typography.Title className="m-0">Report</Typography.Title>
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
              <Typography.Title level={5}>
                {stat.points}pts / {config.POINTS_PER_GAME * NUM_OF_QUESTIONS}
              </Typography.Title>
              <Descriptions
                bordered
                layout="vertical"
                className="mt-3"
                size="small"
              >
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

          if (playerCount > 1 && isWinner && winners[0] === stat.playerId) {
            return (
              <Badge.Ribbon key={stat.playerId} text="Winner" color="green">
                <div>{PlayerStat}</div>
              </Badge.Ribbon>
            );
          }

          return PlayerStat;
        })}
      </Space>
      <div className="mt-3">
        <Space>
          <Button
            size="large"
            icon={<ReloadOutlined />}
            type="primary"
            onClick={() => {
              setRecord([]);
              setConfig((current) => ({
                ...current,
                gameCount: current.gameCount + 1,
                Questions: Questions(
                  playerCount,
                  NUM_OF_QUESTIONS,
                  gameDifficulty,
                  operator
                ),
              }));
              goToSlide(slides.GAME_START);
            }}
          >
            Restart
          </Button>
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            onConfirm={() => {
              reset();
              goToSlide(slides.PLAYER_COUNT);
            }}
          >
            <Button size="large" danger>
              End
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </div>
  );
};

export default Final;

