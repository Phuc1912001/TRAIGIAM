import { Tag } from "antd";

interface IStatusStaff {
  isActive?: boolean;
}

const StatusStaff = (props: IStatusStaff) => {
  const { isActive } = props;
  return (
    <div>
      {isActive ? (
        <Tag
          style={{
            color: `#00a84e`,
            backgroundColor: `#f5fff9`,
            border: `1px solid #00a84e`,
          }}
        >
          Hoạt Động
        </Tag>
      ) : (
        <Tag
          style={{
            color: `#d01b1b`,
            backgroundColor: `#fff5f5`,
            border: `1px solid #d01b1b`,
          }}
        >
          Tạm Nghỉ
        </Tag>
      )}
    </div>
  );
};

export default StatusStaff;
