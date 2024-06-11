import { CheckInCheckOutModel } from "@/common/Model/checkincheckout";
import {
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import Header from "../../Components/Header/Header";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import styles from "./CheckInCheckOut.module.scss";
import CreateExternal from "./CreateExternal/CreateExternal";
import StatusExternal from "./StatusExternal/StatusExternal";

const CheckInCheckOut = () => {
  const items = [
    {
      title: <div>Ra Vào</div>,
    },
    {
      title: <div>Danh Sách Ra Vào</div>,
    },
  ];
  const [dataExternal, setDataExternal] = useState<CheckInCheckOutModel[]>([]);
  const [openCreateExternal, setOpenCreateExternal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [recall, setRecall] = useState<boolean>(false);
  const [currentRecord, setCurentRecord] = useState<CheckInCheckOutModel>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalExport, setIsOpenModalExport] = useState<boolean>(false);

  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();

  const { state } = useLocation();

  const getAllExternal = async () => {
    try {
      showLoading("getAllExternal");
      const { data } = await axios.get("https://localhost:7120/api/External");
      setDataExternal(data.data);
      closeLoading("getAllExternal");
    } catch (error) {
      closeLoading("getAllExternal");
    }
  };

  useEffect(() => {
    getAllExternal();
  }, []);

  useEffect(() => {
    getAllExternal();
  }, [recall]);

  const handleOpenCreate = () => {
    setOpenCreateExternal(true);
    setIsEdit(false);
    setIsView(false);
    setReset(!reset);
  };

  const handleOpenEdit = (record: CheckInCheckOutModel) => {
    setOpenCreateExternal(true);
    setIsEdit(true);
    setCurentRecord(record);
    setShowDelete(true);
    setReset(!reset);
  };

  const handleOpenDelete = (record: CheckInCheckOutModel) => {
    setIsOpenModal(true);
    setCurentRecord(record);
  };

  const handleDeletePrisoner = async () => {
    try {
      showLoading("deleteExternal");
      await axios.delete(
        `https://localhost:7120/api/External/${currentRecord?.id}`
      );
      getAllExternal();
      setIsOpenModal(false);
      notification.success(<div>Xóa Xuất Nhập thành công.</div>);
      closeLoading("deleteExternal");
    } catch (error) {
      setIsOpenModal(true);
      closeLoading("deleteExternal");
    }
  };

  const handleToView = (record: CheckInCheckOutModel) => {
    setIsView(true);
    setCurentRecord(record);
    setOpenCreateExternal(true);
  };

  const genderEMType = (emtype: number) => {
    switch (emtype) {
      case 1:
        return <div>Nhập Viện</div>;
      case 2:
        return <div>Ra Tòa</div>;
      case 3:
        return <div>Đi Điều Tra</div>;
      default:
        break;
    }
  };

  const handleOpenModelExport = (record: CheckInCheckOutModel) => {
    setIsOpenModalExport(true);
    setCurentRecord(record);
  };

  const handleExport = async () => {
    showLoading();

    let model = {
      prisonerId: currentRecord?.prisonerId,
      recordId: currentRecord?.id,
      fileName: `${currentRecord?.prisonerName}.pdf`,
      ...currentRecord,
    };

    try {
      const response = await axios.post(
        `https://localhost:7120/api/External/generatepdfExternal`,
        model,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", model.fileName); // File name specified in the model
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsOpenModalExport(false);
    } catch (error) {
      console.error("Error during PDF generation:", error);
      // Handle error appropriately
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (state?.curentRecord) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://localhost:7120/api/External"
          );
          const { data } = response;
          const newRecord = data.data.find(
            (item: CheckInCheckOutModel) => item.id === state?.curentRecord?.id
          );
          handleToView(newRecord);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };
      fetchData();
    }
  }, [state?.curentRecord]);

  const columns: ColumnsType<CheckInCheckOutModel> = [
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
      title: "Loại Ra vào",
      dataIndex: "emtype",
      key: "emtype",
      render: (_, record) => {
        return <div>{genderEMType(record.emtype ?? 0)}</div>;
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return (
          <div>
            <StatusExternal status={record?.status} />
          </div>
        );
      },
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => {
        return <div>{dayjs(record?.startDate).format("DD-MM-YYYY HH:mm")}</div>;
      },
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => {
        return <div>{dayjs(record?.endDate).format("DD-MM-YYYY HH:mm")}</div>;
      },
    },
    {
      title: "Hoạt Động",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div className={styles.wrapperAction}>
          {record.status === 0 && (
            <Tooltip
              placement="top"
              title={<div className={"customTooltip"}>{`Sửa phiếu`}</div>}
              color="#ffffff"
              arrow={true}
            >
              <div className={"editBtn"} onClick={() => handleOpenEdit(record)}>
                <EditOutlined style={{ fontSize: 18 }} />
              </div>
            </Tooltip>
          )}

          {record.status == 1 && (
            <Tooltip
              placement="top"
              title={<div className={"customTooltip"}>{`Xuất phiếu`}</div>}
              color="#ffffff"
              arrow={true}
            >
              <div
                className={"editBtn"}
                onClick={() => handleOpenModelExport(record)}
              >
                <FilePdfOutlined style={{ fontSize: 18 }} />
              </div>
            </Tooltip>
          )}

          <Tooltip
            placement="top"
            title={<div className={"customTooltip"}>{`Xóa phiếu`}</div>}
            color="#ffffff"
            arrow={true}
          >
            <div className={"editBtn"} onClick={() => handleOpenDelete(record)}>
              <DeleteOutlined style={{ fontSize: 18 }} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

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
            Tạo Phiếu Ra Vào
          </div>
          <div>search</div>
        </div>
        <Table
          columns={columns}
          dataSource={dataExternal}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      </div>
      <CreateExternal
        openCreateExternal={openCreateExternal}
        setOpenCreateExternal={setOpenCreateExternal}
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
        handleDelete={handleDeletePrisoner}
        title="Xác xóa ra vào"
        textConfirm="Xóa ra vào"
      >
        <div>{`Bạn có muốn xóa ra vào của ${currentRecord?.prisonerId}`}</div>
      </ModalComponent>

      <ModalComponent
        isOpenModal={isOpenModalExport}
        setIsOpenModal={setIsOpenModalExport}
        handleDelete={handleExport}
        title="Xuất PDF phiếu ra vào"
        textConfirm="Xuất PDF"
      >
        <div>{`Bạn có muốn xuất PDF phiếu ra vào của phạm nhân ${currentRecord?.prisonerName}`}</div>
      </ModalComponent>
    </div>
  );
};

export default CheckInCheckOut;
