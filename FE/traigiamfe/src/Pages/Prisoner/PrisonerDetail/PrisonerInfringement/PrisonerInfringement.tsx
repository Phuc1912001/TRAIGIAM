import { InfringementResponse } from "@/common/Model/infringement";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import StatusInfringement from "../../../InfringementReport/StatusInfringement/StatusInfringement";
import styles from "./PrisonerInfringement.module.scss";

interface IPrisonerInfringement {
  dataInfringement?: InfringementResponse[];
}

const PrisonerInfringement = (props: IPrisonerInfringement) => {
  const { dataInfringement } = props;

  const navigate = useNavigate();

  const handleToView = (record: InfringementResponse) => {
    navigate(`/infringement/${record.id}`);
  };

  const columns: ColumnsType<InfringementResponse> = [
    {
      title: "Mã Vi Phạm",
      dataIndex: "mvp",
      key: "mvp",
      render: (_, record) => {
        return (
          <div onClick={() => handleToView(record)} className={styles.name}>
            {record.mvp}
          </div>
        );
      },
    },
    {
      title: "Phạm Nhân",
      dataIndex: "ListPrisoner",
      key: "ListPrisoner",
      render: (_, record) => {
        const prisonerName = record?.listPrisoner?.[0]?.prisonerName ?? "N/A";

        const content = (
          <div>
            {record.listPrisoner?.map((item) => (
              <div key={item.id}>{item?.prisonerName}</div>
            ))}
          </div>
        );
        return (
          <div className={styles.wrapperPrisoner}>
            <div>{prisonerName}</div>
            <Popover placement="top" content={content}>
              <div className={styles.wrapperCount}>
                <div>{record.listPrisoner?.length}</div>
              </div>
            </Popover>
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return (
          <div>
            <StatusInfringement status={record?.status ?? 0} />
          </div>
        );
      },
    },

    {
      title: "Ngày Vi Phạm",
      dataIndex: "timeInfringement",
      key: "timeInfringement",
      render: (_, record) => {
        return (
          <div>{dayjs(record?.timeInfringement).format("DD-MM-YYYY")}</div>
        );
      },
    },
  ];

  return (
    <div>
      {dataInfringement && dataInfringement.length > 0 ? (
        <Table
          columns={columns}
          dataSource={dataInfringement}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      ) : (
        <div className={styles.text}>
          <CloudUploadOutlined />
          <div>Không tồn tại vi phạm.</div>
        </div>
      )}
    </div>
  );
};

export default PrisonerInfringement;
