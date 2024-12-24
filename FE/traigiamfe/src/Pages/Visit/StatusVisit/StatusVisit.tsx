import { Tag } from "antd";

interface IStatusVisit {
  status?: number | undefined;
}

const StatusVisit = (props: IStatusVisit) => {
  const { status } = props;

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Tag
            style={{
              color: `#006ac2`,
              backgroundColor: `#e8f5ff`,
              border: `1px solid #006ac2`,
            }}
          >
            Chờ chấp thuận
          </Tag>
        );
      case 1:
        return (
          <Tag
            style={{
              color: `#00a84e`,
              backgroundColor: `#f5fff9`,
              border: `1px solid #00a84e`,
            }}
          >
            Được chấp thuận
          </Tag>
        );
      case 2:
        return (
          <Tag
            style={{
              color: `#d01b1b`,
              backgroundColor: `#fff5f5`,
              border: `1px solid #d01b1b`,
            }}
          >
            Đã Xong
          </Tag>
        );
      case 4:
        return (
          <Tag
            style={{
              color: `#5d569b`,
              backgroundColor: `#eeecff`,
              border: `1px solid #5d569b`,
            }}
          >
            Hủy
          </Tag>
        );
      default:
        break;
    }
  };

  return <div>{renderStatus(status ?? 0)}</div>;
};

export default StatusVisit;
