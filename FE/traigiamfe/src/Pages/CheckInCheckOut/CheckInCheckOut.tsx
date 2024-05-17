import { CheckInCheckOutModel } from "@/common/Model/checkincheckout";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
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
    const { showLoading, closeLoading } = useLoading();
    const notification = useNotification();

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
            title: "Loại Xuât nhập",
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
        {
            title: "Hoạt Động",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <div className={styles.wrapperAction}>
                    {record.status === 0 && (
                        <div className={"editBtn"} onClick={() => handleOpenEdit(record)}>
                            <EditOutlined style={{ fontSize: 18 }} />
                        </div>
                    )}

                    {(record.status === 0 || record.status === 3) && (
                        <div className={"editBtn"} onClick={() => handleOpenDelete(record)}>
                            <DeleteOutlined style={{ fontSize: 18 }} />
                        </div>
                    )}
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
                        Tạo Xuất Nhập
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
                title="Xác xóa xuất nhập"
                textConfirm="Xóa xuất nhập"
            >
                <div>{`Bạn có muốn xóa Xuất Nhập của ${currentRecord?.prisonerId}`}</div>
            </ModalComponent>
        </div>
    );
};

export default CheckInCheckOut;
