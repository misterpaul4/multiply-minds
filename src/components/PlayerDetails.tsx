import { useRecoilValue } from "recoil";
import { playerCountState } from "../app/states/answerAtom";
import { Button, Form, Input, Popconfirm, Space, Typography } from "antd";
import { LeftOutlined, SendOutlined } from "@ant-design/icons";
import { slides } from "../utils/constants";
import { useContext } from "react";
import AnswerContext from "../app/states/answersContext";

interface IProps {
  goToSlide: (slide: number) => void;
}

const PlayerDetails = ({ goToSlide }: IProps) => {
  const playCount = useRecoilValue(playerCountState);
  const onAnswer = useContext(AnswerContext);

  if (!playCount) {
    return null;
  }

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
          onAnswer(
            slides.PLAYER_DETAILS,
            Object.values(values).map((v) => v)
          )
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
              onAnswer(slides.PLAYER_DETAILS, playerNames);
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

