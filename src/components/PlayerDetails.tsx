import { useRecoilValue, useSetRecoilState } from "recoil";
import answerState, { playerCountState } from "../app/states/answerAtom";
import { Button, Form, Input, Popconfirm, Space, Typography } from "antd";
import { LeftOutlined, SendOutlined } from "@ant-design/icons";
import { slides } from "../utils/constants";
import { useContext } from "react";
import AnswerContext from "../app/states/answersContext";
import { IPlayerDetail } from "../utils/types";

const PlayerDetails = () => {
  const playCount = useRecoilValue(playerCountState);
  const setGameConfig = useSetRecoilState(answerState);
  const { goToSlide } = useContext(AnswerContext);

  if (!playCount) {
    return null;
  }

  const onSave = (names: string[]) => {
    const answer: IPlayerDetail[] = names.map((name, index) => ({
      id: index,
      name,
    }));

    setGameConfig((current) => ({ ...current, playerDetails: answer }));
    goToSlide(slides.PLAYER_DETAILS + 1);
  };

  return (
    <div>
      <Button
        icon={<LeftOutlined />}
        type="text"
        onClick={() => goToSlide(slides.PLAYER_COUNT)}
      >
        Go Back
      </Button>
      <Form
        layout="vertical"
        className="w-25"
        onFinish={(values) =>
          onSave(Object.values(values as string).map((v) => v))
        }
      >
        {(() => {
          const components: React.ReactElement[] = [];
          for (let index = 0; index < playCount; index++) {
            components.push(
              <Form.Item
                className="m-0"
                key={index}
                name={`player.${index}`}
                label={
                  <Typography.Title level={5}>
                    Player {index + 1} Name
                  </Typography.Title>
                }
              >
                <Input size="large" required />
              </Form.Item>
            );
          }

          return components;
        })()}

        <Space className="mt-4">
          <Button
            htmlType="submit"
            title="Submit"
            icon={<SendOutlined />}
            size="large"
            type="primary"
          >
            Submit
          </Button>

          <Popconfirm
            title="Are you sure"
            okText="Yes"
            onConfirm={() => {
              const playerNames: string[] = [];
              for (let index = 0; index < playCount; index++) {
                playerNames.push(`Player ${index + 1}`);
              }

              onSave(playerNames);
            }}
          >
            <Button size="large">Skip</Button>
          </Popconfirm>
        </Space>
      </Form>
    </div>
  );
};

export default PlayerDetails;

