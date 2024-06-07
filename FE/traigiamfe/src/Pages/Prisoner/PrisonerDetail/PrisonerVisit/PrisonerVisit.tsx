import { VisitModel } from "@/common/Model/visit";
import StatusVisit from "../../../Visit/StatusVisit/StatusVisit";
import Table, { ColumnsType } from "antd/es/table";
import React from "react";
import dayjs from "dayjs";
import styles from "./PrisonerVisit.module.scss";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface IPrisonerVisit {
  dataVisit?: VisitModel[];
}

const PrisonerVisit = (props: IPrisonerVisit) => {
  const { dataVisit } = props;

  const navigate = useNavigate();

  const handleToView = (record: VisitModel) => {
    navigate("/visit", { state: { curentRecord: record } });
  };

  const columns: ColumnsType<VisitModel> = [
    {
      title: "Tên Phạm Nhân",
      dataIndex: "prisonerName",
      key: "prisonerName",
      render: (_, record) => {
        return (
          <div onClick={() => handleToView(record)} className={styles.name}>
            {record.prisonerName}
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
            <StatusVisit status={record?.status} />
          </div>
        );
      },
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => {
        return <div>{dayjs(record?.startDate).format("DD-MM-YYYY")}</div>;
      },
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => {
        return <div>{dayjs(record?.endDate).format("DD-MM-YYYY")}</div>;
      },
    },
  ];
  return (
    <div>
      {dataVisit && dataVisit?.length > 0 ? (
        <Table
          columns={columns}
          dataSource={dataVisit}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      ) : (
        <div className={styles.text}>
          <CloudUploadOutlined />
          <div>Không tồn tại lịch sử thăm khám.</div>
        </div>
      )}
    </div>
  );
};

export default PrisonerVisit;
