/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, List, Space, Typography } from "antd";
import { IAnswer } from "../../utils/types";
import { SendOutlined } from "@ant-design/icons";

interface IProps {
  question: string;
  isMultipleChoice?: boolean;
  suggestedAnswers?: IAnswer[];
  answer?: number;
  onAnswer: (answer: any) => void;
}

const { Item } = List;

const Question = ({
  question,
  suggestedAnswers,
  isMultipleChoice,
  onAnswer,
}: IProps) => {
  return (
    <div>
      <Typography.Title level={4}>{question}</Typography.Title>
      {isMultipleChoice ? (
        <List
          className="question w-100"
          bordered
          dataSource={suggestedAnswers}
          renderItem={(dt) => (
            <Item onClick={() => onAnswer(dt.value)}>{dt.title}</Item>
          )}
        />
      ) : (
        <Form onFinish={(values) => onAnswer(values.answer)} layout="inline">
          <Space className="w-100">
            <Form.Item name="answer" className="mr-1">
              <Input required size="large" />
            </Form.Item>
            <Button
              htmlType="submit"
              title="Submit"
              icon={<SendOutlined />}
              size="large"
              type="primary"
            />
          </Space>
        </Form>
      )}
    </div>
  );
};

export default Question;

