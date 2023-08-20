/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, List, Typography } from "antd";
import { IAnswer } from "../../utils/types";
import { useContext } from "react";
import AnswerContext from "../../app/states/answersContext";
import { SendOutlined } from "@ant-design/icons";

interface IProps {
  question: string;
  isMultipleChoice?: boolean;
  suggestedAnswers?: IAnswer[];
  slide: number;
  answer?: number;
  onResponse?: (anwer: number) => void;
}

const { Item } = List;

const Question = ({
  question,
  suggestedAnswers,
  slide,
  isMultipleChoice,
  onResponse,
  answer,
}: IProps) => {
  const { onAnswer } = useContext(AnswerContext);

  const onSet = (resp: unknown) => {
    if (typeof answer === "number") {
      onResponse?.(resp as number);
    } else {
      onAnswer(slide, resp);
    }
  };

  return (
    <div>
      <Typography.Title level={4}>{question}</Typography.Title>
      {isMultipleChoice ? (
        <List
          className="question w-100"
          bordered
          dataSource={suggestedAnswers}
          renderItem={(dt) => (
            <Item onClick={() => onSet(dt.value)}>{dt.title}</Item>
          )}
        />
      ) : (
        <Form onFinish={(values) => onSet(values.answer)} layout="inline">
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
        </Form>
      )}
    </div>
  );
};

export default Question;

