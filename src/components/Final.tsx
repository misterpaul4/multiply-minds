import { ReloadOutlined } from "@ant-design/icons";
import { Button, Progress } from "antd";
import { useSetRecoilState } from "recoil";
import recordState from "../app/states/recordAtom";

const Final = () => {
  const setRecord = useSetRecoilState(recordState);
  return (
    <div>
      <Progress type="circle" percent={75} />
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

