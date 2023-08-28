/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  List,
  Space,
  Typography,
} from "antd";
import { IAnswer } from "../../utils/types";
import { SendOutlined } from "@ant-design/icons";

interface IProps {
  question: string;
  isMultipleChoice?: boolean;
  suggestedAnswers?: IAnswer[];
  answer?: number;
  onAnswer: (answer: any) => void;
  timeFinished?: boolean;
  disabled?: boolean;
  form?: FormInstance;
  inputType?: "number" | "text";
}

const { Item } = List;

const Question = ({
  question,
  suggestedAnswers,
  isMultipleChoice,
  onAnswer,
  timeFinished,
  disabled,
  form,
  inputType,
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
        <Form
          form={form}
          onFinish={(values) => {
            onAnswer(values.answer);
          }}
          layout="inline"
          disabled={disabled || timeFinished}
        >
          <Space className="w-100">
            <Form.Item name="answer" className="mr-1">
              {inputType === "number" ? (
                <InputNumber className="w-100" required size="large" />
              ) : (
                <Input required size="large" />
              )}
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

