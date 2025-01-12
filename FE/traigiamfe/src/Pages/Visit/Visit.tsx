import { VisitModel } from "@/common/Model/visit";
import {
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Table, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import Header from "../../Components/Header/Header";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import CreateVisit from "./CreateVisit/CreateVisit";
import StatusVisit from "./StatusVisit/StatusVisit";
import { VisitType } from "./visit.model";
import styles from "./Visit.module.scss";
import { LayoutContext } from "../../Layout/contextLayout/contextLayout";
import { RoleEnum } from "../MyProfile/Role.model";

const Visit = () => {
  const items = [
    {
      title: <div>Thăm Khám</div>,
    },
    {
      title: <div>Danh Sách Thăm Khám</div>,
    },
  ];

  const [dataVisit, setDataVisit] = useState<VisitModel[]>([]);
  const [originDataVisit, setOriginDataVisit] = useState<VisitModel[]>([]);

  const [openCreateVisit, setOpenCreateVisit] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [recall, setRecall] = useState<boolean>(false);
  const [currentRecord, setCurentRecord] = useState<VisitModel>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalExport, setIsOpenModalExport] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();

  const { state } = useLocation();

  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContextProvider"
    );
  }
  const { dataDetail } = context;

  const getAllVisit = async () => {
    try {
      showLoading("getAllVisit");
      const { data } = await axios.get("https://localhost:7120/api/Visit");
      setDataVisit(data.data);
      setOriginDataVisit(data.data);
      closeLoading("getAllVisit");
    } catch (error) {
      closeLoading("getAllVisit");
    }
  };

  useEffect(() => {
    getAllVisit();
  }, []);

  useEffect(() => {
    getAllVisit();
  }, [recall]);

  const handleOpenCreate = () => {
    setOpenCreateVisit(true);
    setIsEdit(false);
    setIsView(false);
    setReset(!reset);
  };

  const handleOpenEdit = (record: VisitModel) => {
    setOpenCreateVisit(true);
    setIsEdit(true);
    setCurentRecord(record);
    setReset(!reset);
  };

  const handleOpenDelete = (record: VisitModel) => {
    setIsOpenModal(true);
    setCurentRecord(record);
  };

  const handleDeleteVisit = async () => {
    try {
      showLoading("deleteVisit");
      await axios.delete(
        `https://localhost:7120/api/Visit/${currentRecord?.id}`
      );
      getAllVisit();
      setIsOpenModal(false);
      notification.success(<div>Xóa Thăm Khám thành công.</div>);
      closeLoading("deleteVisit");
    } catch (error) {
      setIsOpenModal(true);
      closeLoading("deleteVisit");
    }
  };

  const handleToView = (record?: VisitModel) => {
    setIsView(true);
    setCurentRecord(record);
    setOpenCreateVisit(true);
  };

  useEffect(() => {
    if (state?.curentRecord) {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://localhost:7120/api/Visit");
          const { data } = response;
          const newRecord = data.data.find(
            (item: VisitModel) => item.id === state?.curentRecord?.id
          );
          handleToView(newRecord);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };
      fetchData();
    }
  }, [state?.curentRecord]);

  const genderVisitType = (emtype: number) => {
    switch (emtype) {
      case VisitType.gapNguoiThan:
        return <div>Gặp Người Thân</div>;
      case VisitType.gapBacSi:
        return <div>Gặp Bác sĩ</div>;
      case VisitType.gapLuatSu:
        return <div>Gặp Luật sư</div>;
      case VisitType.khac:
        return <div>Khác</div>;
      default:
        break;
    }
  };

  const handleOpenModelExport = (record: VisitModel) => {
    setIsOpenModalExport(true);
    setCurentRecord(record);
  };

  const handleExport = async () => {
    showLoading();

    const model = {
      prisonerId: currentRecord?.prisonerId,
      recordId: currentRecord?.id,
      fileName: `${currentRecord?.prisonerName}.pdf`,
      ...currentRecord,
    };

    try {
      const response = await axios.post(
        `https://localhost:7120/api/Visit/generatepdfVisit`,
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

  const columns: ColumnsType<VisitModel> = [
    {
      title: "Tên Phạm Nhân",
      dataIndex: "prisonerName",
      key: "prisonerName",
      render: (_, record) => {
        return (
          <div onClick={() => handleToView(record)} className={styles.name}>
            {record.prisonerName ?? "Không tồn tại"}
          </div>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "typeVisit",
      key: "typeVisit",
      render: (_, record) => {
        return <div>{genderVisitType(record.typeVisit ?? 0)}</div>;
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
    ...(dataDetail?.role === RoleEnum.siquan
      ? [
          {
            title: "Hoạt Động",
            dataIndex: "status",
            key: "status",
            render: (_: A, record: A) => (
              <div>
                <div className={styles.wrapperAction}>
                  {record.status === 0 && (
                    <Tooltip
                      placement="top"
                      title={
                        <div className={"customTooltip"}>{`Sửa phiếu`}</div>
                      }
                      color="#ffffff"
                      arrow={true}
                    >
                      <div
                        className={"editBtn"}
                        onClick={() => handleOpenEdit(record)}
                      >
                        <EditOutlined style={{ fontSize: 18 }} />
                      </div>
                    </Tooltip>
                  )}
                  {record.status == 1 && (
                    <Tooltip
                      placement="top"
                      title={
                        <div className={"customTooltip"}>{`Xuất phiếu`}</div>
                      }
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
                    <div
                      className={"editBtn"}
                      onClick={() => handleOpenDelete(record)}
                    >
                      <DeleteOutlined style={{ fontSize: 18 }} />
                    </div>
                  </Tooltip>
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const onSearch = (val: string) => {
    if (val.trim() === "") {
      setDataVisit(originDataVisit);
    } else {
      const newList = originDataVisit.filter((item: VisitModel) =>
        item?.prisonerName?.toLowerCase().includes(val.toLowerCase())
      );
      setDataVisit(newList);
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
          {dataDetail?.role === RoleEnum.siquan ? (
            <div className={"createBtn"} onClick={handleOpenCreate}>
              <PlusCircleOutlined style={{ fontSize: 18 }} />
              Tạo Thăm Khám
            </div>
          ) : (
            <div></div>
          )}

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
          dataSource={dataVisit}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      </div>

      <CreateVisit
        openCreateVisit={openCreateVisit}
        setOpenCreateVisit={setOpenCreateVisit}
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
        handleDelete={handleDeleteVisit}
        title="Xác nhận xóa phiếu thăm khám"
        textConfirm="Xóa phiếu thăm khám"
      >
        <div>{`Bạn có muốn xóa phiếu thăm khám của phạm nhân ${currentRecord?.prisonerName}`}</div>
      </ModalComponent>

      <ModalComponent
        isOpenModal={isOpenModalExport}
        setIsOpenModal={setIsOpenModalExport}
        handleDelete={handleExport}
        title="Xuất PDF phiếu thăm khám"
        textConfirm="Xuất PDF"
      >
        <div>{`Bạn có muốn xuất PDF phiếu thăm khám của phạm nhân ${currentRecord?.prisonerName}`}</div>
      </ModalComponent>
    </div>
  );
};

export default Visit;
