import { InfringementResponse } from "@/common/Model/infringement";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Popover } from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import Header from "../../Components/Header/Header";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import CreateInfringement from "./CreateInfringement/CreateInfringement";
import styles from "./InfringementReport.module.scss";
import StatusInfringement from "./StatusInfringement/StatusInfringement";

const InfringementReport = () => {
  const items = [
    {
      title: <div>Quản lý Vi Phạm</div>,
    },
    {
      title: <div>Danh Sách Báo Cáo Vi Phạm</div>,
    },
  ];
  const [dataInfringement, setDataInfringement] = useState<
    InfringementResponse[]
  >([]);
  const [dataOriginInfringement, setDataOriginInfringement] = useState<
    InfringementResponse[]
  >([]);
  const [openCreateInfringement, setOpenCreateInfringement] =
    useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [recall, setRecall] = useState<boolean>(false);
  const [currentRecord, setCurentRecord] = useState<InfringementResponse>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();
  const navigate = useNavigate();

  const getAllInfringement = async () => {
    try {
      showLoading("getAllExternal");
      const { data } = await axios.get(
        "https://localhost:7120/api/Infringement"
      );
      setDataInfringement(data.data);
      setDataOriginInfringement(data.data);
      closeLoading("getAllExternal");
    } catch (error) {
      closeLoading("getAllExternal");
    }
  };
  useEffect(() => {
    getAllInfringement();
  }, []);

  useEffect(() => {
    getAllInfringement();
  }, [recall]);

  const handleOpenCreate = () => {
    setOpenCreateInfringement(true);
    setIsEdit(false);
    setIsView(false);
    setReset(!reset);
  };

  const handleOpenEdit = (record: InfringementResponse) => {
    setOpenCreateInfringement(true);
    setIsEdit(true);
    setCurentRecord(record);
    setShowDelete(true);
    setReset(!reset);
  };

  const handleOpenDelete = (record: InfringementResponse) => {
    setIsOpenModal(true);
    setCurentRecord(record);
  };

  const handleDeleteInfringement = async () => {
    try {
      showLoading("DeleteInfringement");
      await axios.delete(
        `https://localhost:7120/api/Infringement/${currentRecord?.id}`
      );
      getAllInfringement();
      setIsOpenModal(false);
      notification.success(<div>Xóa Xuất Nhập thành công.</div>);
      closeLoading("DeleteInfringement");
    } catch (error) {
      setIsOpenModal(true);
      closeLoading("DeleteInfringement");
    }
  };

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
    {
      title: "Hoạt Động",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div className={styles.wrapperAction}>
          <div className={"editBtn"} onClick={() => handleOpenEdit(record)}>
            <EditOutlined style={{ fontSize: 18 }} />
          </div>

          <div className={"editBtn"} onClick={() => handleOpenDelete(record)}>
            <DeleteOutlined style={{ fontSize: 18 }} />
          </div>
        </div>
      ),
    },
  ];

  const onSearch = (val: string) => {
    if (val.trim() === "") {
      setDataInfringement(dataOriginInfringement);
    } else {
      const newList = dataOriginInfringement.filter(
        (item: InfringementResponse) =>
          item?.mvp?.toLowerCase().includes(val.toLowerCase())
      );
      setDataInfringement(newList);
    }
  };
  return (
    <div>
      <div className="share-sticky">
        <Header items={items} />
      </div>
      <div className="share-sticky-mobile">
        <MobileHeader />
      </div>

      <div className={styles.wrapperContent}>
        <div className={styles.wrapperBtn}>
          <div className={"createBtn"} onClick={handleOpenCreate}>
            <PlusCircleOutlined style={{ fontSize: 18 }} />
            Tạo Vi Phạm
          </div>
          <div>
            <Search
              placeholder="tìm kiếm theo tên phạm nhân"
              onSearch={onSearch}
              style={{ width: 250 }}
              size="large"
              allowClear
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataInfringement}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      </div>
      <CreateInfringement
        openCreateInfringement={openCreateInfringement}
        setOpenCreateInfringement={setOpenCreateInfringement}
        isEdit={isEdit}
        currentRecord={currentRecord}
        setRecall={setRecall}
        recall={recall}
        reset={reset}
        isView={isView}
        setIsView={setIsView}
      />

      <ModalComponent
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        handleDelete={handleDeleteInfringement}
        title="Xác xóa vi phạm"
        textConfirm="Xóa Vi Phạm"
      >
        <div>{`Bạn có muốn xóa vi phạm ${currentRecord?.mvp}`}</div>
      </ModalComponent>
    </div>
  );
};

export default InfringementReport;
