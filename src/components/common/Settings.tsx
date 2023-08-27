import { Card, InputNumber, Select, Space, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import configState, {
  difficulty,
  durationInSeconds,
  gameOperators,
  numOfQuestions,
} from "../../app/states/configAtom";
import { IGameConfig } from "../../utils/types";
import { setLS } from "../../utils/localStoage";
import { gameDifficulties, operators } from "../../utils/constants";

const GameSettings = () => {
  const setConfig = useSetRecoilState(configState);
  const totalQuestions = useRecoilValue(numOfQuestions);
  const gameDifficulty = useRecoilValue(difficulty);
  const duration = useRecoilValue(durationInSeconds);
  const operator = useRecoilValue(gameOperators);

  const onValueChange = (value: unknown, field: keyof IGameConfig) => {
    if (value) {
      setConfig((current) => ({ ...current, [field]: value }));
      setLS(field, value);
    }
  };

  return (
    <Card bordered={false}>
      <Space align="center" size="large">
        <Typography.Text className="mr-2">
          No. of questions{" "}
          <Tooltip
            title="Number of questions per player"
            className="gs-tooltip"
          >
            <QuestionCircleOutlined />
          </Tooltip>{" "}
          :
          <InputNumber
            value={totalQuestions}
            size="large"
            bordered={false}
            min={1}
            maxLength={2}
            onChange={(v) => onValueChange(v, "numOfQuestions")}
            className="border-bottom ml-3"
          />
        </Typography.Text>

        <Typography.Text className="mr-2">
          Duration(seconds){" "}
          <Tooltip
            title="Duration of each question in seconds"
            className="gs-tooltip"
          >
            <QuestionCircleOutlined />
          </Tooltip>{" "}
          :
          <InputNumber
            maxLength={2}
            value={duration}
            min={1}
            onChange={(v) => onValueChange(v, "durationInSeconds")}
            size="large"
            bordered={false}
            className="border-bottom ml-3"
          />
        </Typography.Text>

        <Typography.Text className="mr-2">
          Difficulty:
          <Select
            size="large"
            value={gameDifficulty}
            style={{ width: 120 }}
            options={gameDifficulties.map((d) => ({ label: d, value: d }))}
            onChange={(v) => onValueChange(v, "difficulty")}
          />
        </Typography.Text>
      </Space>
      <Space className="mt-3">
        <Typography.Text className="mr-2">
          Operators:
          <Select
            className="w-100"
            size="large"
            defaultValue={[operator[0]]}
            value={operator}
            mode="multiple"
            style={{ width: 120 }}
            options={operators.map((d) => ({ label: d, value: d }))}
            onChange={(v) => onValueChange(v, "operator")}
          />
        </Typography.Text>
      </Space>
    </Card>
  );
};

export default GameSettings;

