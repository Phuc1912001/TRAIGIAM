import { PunishmentModel } from "@/common/Model/punishment";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import Header from "../../Components/Header/Header";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import CreatePunishment from "./CreatePunishment/CreatePunishment";
import styles from "./Punishment.module.scss";
import StatusPunish from "./StatusPunish/StatusPunish";
import { LayoutContext } from "../../Layout/contextLayout/contextLayout";
import { RoleEnum } from "../MyProfile/Role.model";

const Punishment = () => {
  const items = [
    {
      title: <div>Hình Phạt</div>,
    },
    {
      title: <div>Danh Sách Hình Phạt</div>,
    },
  ];
  const [dataPunishment, setDataPunishment] = useState<PunishmentModel[]>([]);
  const [dataOriginPunishment, setDataOriginPunishment] = useState<
    PunishmentModel[]
  >([]);

  const [openCreatePunish, setOpenCreatePunish] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [recall, setRecall] = useState<boolean>(false);
  const [currentRecord, setCurentRecord] = useState<PunishmentModel>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();

  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "LayoutContext must be used within a LayoutContextProvider"
    );
  }
  const { dataDetail } = context;

  const getAllPunishment = async () => {
    try {
      showLoading("getAllPunishment");
      const { data } = await axios.get("https://localhost:7120/api/Punish");
      setDataPunishment(data.data);
      setDataOriginPunishment(data.data);
      closeLoading("getAllPunishment");
    } catch (error) {
      closeLoading("getAllPunishment");
    }
  };

  useEffect(() => {
    getAllPunishment();
  }, []);

  useEffect(() => {
    getAllPunishment();
  }, [recall]);

  const handleOpenCreate = () => {
    setOpenCreatePunish(true);
    setIsEdit(false);
    setIsView(false);
    setReset(!reset);
  };

  const handleOpenEdit = (record: PunishmentModel) => {
    setOpenCreatePunish(true);
    setIsEdit(true);
    setCurentRecord(record);
    setShowDelete(true);
    setReset(!reset);
  };

  const handleOpenDelete = (record: PunishmentModel) => {
    setIsOpenModal(true);
    setCurentRecord(record);
  };

  const handleDeletePrisoner = async () => {
    try {
      showLoading("deletePunish");
      await axios.delete(
        `https://localhost:7120/api/punish/${currentRecord?.id}`
      );
      getAllPunishment();
      setIsOpenModal(false);
      notification.success(<div>Xóa Hình Phạt Thành Công.</div>);
      closeLoading("deletePunish");
    } catch (error) {
      setIsOpenModal(true);
      closeLoading("deletePunish");
    }
  };

  const handleToView = (record: PunishmentModel) => {
    setIsView(true);
    setCurentRecord(record);
    setOpenCreatePunish(true);
  };

  const columns: ColumnsType<PunishmentModel> = [
    {
      title: "Tên Hình Phạt",
      dataIndex: "punishName",
      key: "punishName",
      render: (_, record) => {
        return (
          <div onClick={() => handleToView(record)} className={styles.name}>
            {record.punishName}
          </div>
        );
      },
    },
    {
      title: "Mô Tả",
      dataIndex: "desc",
      key: "desc",
      width: "22%",
      render: (_, record) => {
        return (
          <div className="tg-two-rows">
            <Tooltip
              placement="top"
              title={<div className="customTooltip">{record?.desc}</div>}
              color="#ffffff"
              arrow={true}
            >
              <div>{record?.desc}</div>
            </Tooltip>
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
            <StatusPunish status={record?.status} />
          </div>
        );
      },
    },
    ...(dataDetail?.role === RoleEnum.giamthi
      ? [
          {
            title: "Hoạt Động",
            dataIndex: "action",
            key: "action",
            render: (_: A, record: A) => (
              <div className={styles.wrapperAction}>
                <div
                  className={"editBtn"}
                  onClick={() => handleOpenEdit(record)}
                >
                  <EditOutlined style={{ fontSize: 18 }} />
                </div>
                <div
                  className={"editBtn"}
                  onClick={() => handleOpenDelete(record)}
                >
                  <DeleteOutlined style={{ fontSize: 18 }} />
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];
  const onSearch = (val: string) => {
    if (val.trim() === "") {
      setDataPunishment(dataOriginPunishment);
    } else {
      const newList = dataOriginPunishment.filter((item: PunishmentModel) =>
        item?.punishName?.toLowerCase().includes(val.toLowerCase())
      );
      setDataPunishment(newList);
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
          {dataDetail?.role === RoleEnum.giamthi ? (
            <div className={"createBtn"} onClick={handleOpenCreate}>
              <PlusCircleOutlined style={{ fontSize: 18 }} />
              Tạo Hình Phạt
            </div>
          ) : (
            <div></div>
          )}

          <div>
            <Search
              placeholder="tìm kiếm theo tên Phạm nhân"
              onSearch={onSearch}
              style={{ width: 250 }}
              size="large"
              allowClear
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataPunishment}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      </div>

      <CreatePunishment
        openCreatePunish={openCreatePunish}
        setOpenCreatePunish={setOpenCreatePunish}
        isEdit={isEdit}
        currentRecord={currentRecord}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
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
        title="Xác Nhận Xóa Hình Phạt"
        textConfirm="Xóa Hình Phạt"
      >
        <div>{`Bạn có muốn xóa Hình Phạt ${currentRecord?.punishName}`}</div>
      </ModalComponent>
    </div>
  );
};

export default Punishment;
