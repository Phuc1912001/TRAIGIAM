
import React, { useEffect, useState } from 'react'
import styles from './Visit.module.scss'
import { VisitModel } from '@/common/Model/visit';
import { useLoading } from '../../common/Hook/useLoading';
import { useNotification } from '../../common/Hook/useNotification';
import Header from '../../Components/Header/Header';
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import CreateVisit from './CreateVisit/CreateVisit';
import ModalComponent from '../../Components/ModalDelete/ModalComponent';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import StatusVisit from './StatusVisit/StatusVisit';

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
    const [openCreateVisit, setOpenCreateVisit] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false);
    const [currentRecord, setCurentRecord] = useState<VisitModel>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading();
    const notification = useNotification();

    const getAllVisit = async () => {
        try {
            showLoading("getAllVisit");
            const { data } = await axios.get("https://localhost:7120/api/Visit");
            setDataVisit(data.data);
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
        setShowDelete(true);
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

    const handleToView = (record: VisitModel) => {
        setIsView(true);
        setCurentRecord(record);
        setOpenCreateVisit(true);
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
            <div className="share-sticky-mobile" >
                <MobileHeader />
            </div>
            <div className={styles.wrapperContent}>
                <div className={styles.wrapperBtn}>
                    <div className={"createBtn"} onClick={handleOpenCreate}>
                        <PlusCircleOutlined style={{ fontSize: 18 }} />
                        Tạo Thăm Khám
                    </div>
                    <div>search</div>
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
                title="Xác phiếu thăm khám"
                textConfirm="Xóa phiếu thăm khám"
            >
                <div>{`Bạn có muốn xóa phiếu thăm khám của phạm nhân ${currentRecord?.prisonerId}`}</div>
            </ModalComponent>
        </div>
    )
}

export default Visit