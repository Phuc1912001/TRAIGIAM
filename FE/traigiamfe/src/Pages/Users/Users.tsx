import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import { UserModel } from "@/common/Model/user";
import React, { useEffect, useState } from "react";
import defaultImage from "../../assets/default.jpg";
import styles from "./Users.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Table, { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Header from "../../Components/Header/Header";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import CreateUser from "./CreateUser/CreateUser";
import { RoleEnum } from "../MyProfile/Role.model";
import Search from "antd/es/input/Search";

const Users = () => {
  const items = [
    {
      title: <div>Người dùng</div>,
    },
    {
      title: <div>Danh Sách Người dùng</div>,
    },
  ];
  const initialFieldValues = {
    imageName: "",
    imageSrc: defaultImage,
    imageFile: null,
  };
  const [dataUsers, setDataUsers] = useState<UserModel[]>([]);
  const [dataOriginUsers, setDataOriginUsers] = useState<UserModel[]>([]);
  const [openCreateUsers, setOpenCreateUsers] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [values, setValues] = useState(initialFieldValues);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentRecord, setCurentRecord] = useState<UserModel>();
  const [isView, setIsView] = useState<boolean>(false);

  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      showLoading("getAllUsers");
      const { data } = await axios.get("https://localhost:7120/api/Register");
      setDataUsers(data.data);
      setDataOriginUsers(data.data);
      closeLoading("getAllUsers");
    } catch (error) {
      closeLoading("getAllUsers");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreateUsers(true);
    setIsEdit(false);
    setReset(!reset);
  };

  const handleOpenEdit = (record: UserModel) => {
    setOpenCreateUsers(true);
    setIsEdit(true);
    setCurentRecord(record);
    setValues({
      ...values,
      imageSrc: record.imageSrc as string,
    });
    setShowDelete(true);
    setReset(!reset);
  };
  const handleOpenDelete = (record: UserModel) => {
    setIsOpenModal(true);
    setCurentRecord(record);
  };

  const handleDeleteUsers = async () => {
    try {
      showLoading("delete");
      await axios.delete(
        `https://localhost:7120/api/Register/${currentRecord?.id}`
      );
      getAllUsers();
      setIsOpenModal(false);
      notification.success(<div>Xóa Người dùng Thành Công.</div>);
      closeLoading("delete");
    } catch (error) {
      setIsOpenModal(true);
      closeLoading("delete");
    }
  };

  const handleToView = (record?: UserModel) => {
    setIsView(true);
    setCurentRecord(record);
    setOpenCreateUsers(true);
  };

  const renderRole = (role: number) => {
    switch (role) {
      case RoleEnum.truongTrai:
        return "Trưởng trại";
      case RoleEnum.giamThi:
        return "Giám Thị";
      case RoleEnum.doiTruong:
        return "Đội Trưởng";
      case RoleEnum.quanNhan:
        return "Quân Nhân";
      case RoleEnum.congAn:
        return "Công an";
      case RoleEnum.nguoiDung:
        return "Người dùng";
      default:
        break;
    }
  };

  const columns: ColumnsType<UserModel> = [
    {
      title: "Tên Người dùng",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => {
        const arr = record?.imageSrc?.split("/");

        const imgURL = !arr ? defaultImage : record.imageSrc;

        return (
          <div className={styles.containerInfor}>
            <div>
              <img className={styles.avatar} src={imgURL} alt="" />
            </div>
            <div>
              <div className={styles.name} onClick={() => handleToView(record)}>
                {record?.userName}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (_, record) => <div>{renderRole(record.role ?? 0)}</div>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },

    {
      title: "Hoạt Động",
      dataIndex: "action",
      key: "action",
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
      setDataUsers(dataOriginUsers);
    } else {
      const newList = dataOriginUsers.filter((item: UserModel) =>
        item?.userName?.toLowerCase().includes(val.toLowerCase())
      );
      setDataUsers(newList);
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
            Tạo Người dùng
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
          dataSource={dataUsers}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      </div>

      <CreateUser
        openCreateUsers={openCreateUsers}
        setOpenCreateUsers={setOpenCreateUsers}
        isEdit={isEdit}
        currentRecord={currentRecord}
        values={values}
        setValues={setValues}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        initialFieldValues={initialFieldValues}
        reset={reset}
        isView={isView}
        setIsView={setIsView}
        getAllUsers={getAllUsers}
      />

      <ModalComponent
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        handleDelete={handleDeleteUsers}
        title="Xác Nhận Xóa Người dùng"
        textConfirm="Xóa Người dùng"
      >
        <div>{`Bạn có muốn xóa Người dùng ${currentRecord?.userName}`}</div>
      </ModalComponent>
    </div>
  );
};

export default Users;
