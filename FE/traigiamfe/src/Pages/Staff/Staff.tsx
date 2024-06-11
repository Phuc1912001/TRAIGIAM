import { StaffModel } from "@/common/Model/staff";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/default.jpg";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import Header from "../../Components/Header/Header";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import StatusStaff from "./Components/StatusStaff/StatusStaff";
import CreateStaff from "./CreateStaff/CreateStaff";
import styles from "./Staff.module.scss";

const Staff = () => {
  const items = [
    {
      title: <div>Nhân Viên</div>,
    },
    {
      title: <div>Danh Sách Nhân Viên</div>,
    },
  ];
  const initialFieldValues = {
    imageName: "",
    imageSrc: defaultImage,
    imageFile: null,
  };
  const [dataStaff, setDataStaff] = useState<StaffModel[]>([]);
  const [openCreatePrisoner, setOpenCreatePrisoner] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [recall, setRecall] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [values, setValues] = useState(initialFieldValues);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const notification = useNotification();
  const [currentRecord, setCurentRecord] = useState<StaffModel>();

  const navigate = useNavigate();

  const getAllStaff = async () => {
    try {
      showLoading("getAllStaff");
      const { data } = await axios.get("https://localhost:7120/api/staff");
      setDataStaff(data.data);
      closeLoading("getAllStaff");
    } catch (error) {
      closeLoading("getAllStaff");
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  useEffect(() => {
    getAllStaff();
  }, [recall]);

  const handleOpenCreate = () => {
    setOpenCreatePrisoner(true);
    setIsEdit(false);
    setReset(!reset);
  };

  const handleNavigate = (record: StaffModel) => {
    navigate(`/staff/${record.id}`);
  };

  const handleOpenEdit = (record: StaffModel) => {
    setOpenCreatePrisoner(true);
    setIsEdit(true);
    setCurentRecord(record);
    setValues({
      ...values,
      imageSrc: record.imageSrc as string,
    });
    setShowDelete(true);
    setReset(!reset);
  };

  const handleOpenDelete = (record: StaffModel) => {
    setIsOpenModal(true);
    setCurentRecord(record);
  };

  const handleDeletePrisoner = async () => {
    try {
      showLoading("deleteStaff");
      await axios.delete(
        `https://localhost:7120/api/staff/${currentRecord?.id}`
      );
      getAllStaff();
      setIsOpenModal(false);
      notification.success(<div>Xóa Nhân Viên Thành Công.</div>);
      closeLoading("deleteStaff");
    } catch (error) {
      setIsOpenModal(true);
      closeLoading("deleteStaff");
    }
  };

  const columns: ColumnsType<StaffModel> = [
    {
      title: "Tên Nhiên Viên",
      dataIndex: "staffName",
      key: "staffName",
      render: (_, record) => {
        const arr = record?.imageSrc?.split("/");
        const hasNull = arr?.includes("null");
        const imgURL = hasNull ? defaultImage : record.imageSrc;
        return (
          <div className={styles.containerInfor}>
            <div>
              <img className={styles.avatar} src={imgURL} alt="" />
            </div>
            <div>
              <div
                className={styles.name}
                onClick={() => handleNavigate(record)}
              >
                {record?.staffName}
              </div>
              <div>{`${record?.staffAge} tuổi`}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Ma Nhân Viên",
      dataIndex: "mnv",
      key: "mnv",
    },
    {
      title: "Giới Tính",
      dataIndex: "staffSex",
      key: "staffSex",
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (_, record) => {
        return (
          <div>
            <StatusStaff isActive={record?.isActive} />
          </div>
        );
      },
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

  return (
    <div>
      <div>
        <Header items={items} />
      </div>

      <div className={styles.wrapperContent}>
        <div className={styles.wrapperBtn}>
          <div className={"createBtn"} onClick={handleOpenCreate}>
            <PlusCircleOutlined style={{ fontSize: 18 }} />
            Tạo Nhân Viên
          </div>
          <div>search</div>
        </div>
        <Table
          columns={columns}
          dataSource={dataStaff}
          className={`${styles.prisonerTable} share-border-table`}
          tableLayout="auto"
        />
      </div>

      <CreateStaff
        openCreatePrisoner={openCreatePrisoner}
        setOpenCreatePrisoner={setOpenCreatePrisoner}
        isEdit={isEdit}
        currentRecord={currentRecord}
        values={values}
        setValues={setValues}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        initialFieldValues={initialFieldValues}
        setRecall={setRecall}
        recall={recall}
        reset={reset}
      />

      <ModalComponent
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        handleDelete={handleDeletePrisoner}
        title="Xác Nhận Xóa Nhân Viên"
        textConfirm="Xóa Nhân Viên"
      >
        <div>{`Bạn có muốn xóa Nhân Viên ${currentRecord?.staffName}`}</div>
      </ModalComponent>
    </div>
  );
};

export default Staff;
