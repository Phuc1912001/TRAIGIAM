import Header from "../../Components/Header/Header";
import { Breadcrumb, Button, Layout, Table } from "antd";
import React, { useState } from "react";
import styles from "./Prisoner.module.scss";
import { ColumnsType } from "antd/es/table";
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { render } from "react-dom";
import { useNavigate } from "react-router-dom";
import CreatePrisoner from "./CreatePrisoner/CreatePrisoner";
import avatar from "../../assets/avatar.jpg";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import { PrisonerModel } from "../../common/Model/prisoner";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";

const Prisoner = () => {
    const items = [
        {
            title: <div>Phạm Nhân</div>,
        },
        {
            title: <div>Danh Sách Phạm Nhân</div>,
        },
    ];

    const navigate = useNavigate();
    const [openCreatePrisoner, setOpenCreatePrisoner] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [namePrisoner, setNamePrisoner] = useState<string>('');
    const [currentRecord, setCurrentRecord] = useState<PrisonerModel>()

    const mockData = [
        {
            id: 1,
            maPN: "PH1",
            name: "Nguyễn Văn A",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 2,
            maPN: "PH1",
            name: "Nguyễn Văn B",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 3,
            maPN: "PH1",
            name: "Nguyễn Văn C",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 4,
            maPN: "PH1",
            name: "Nguyễn Văn D",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 5,
            maPN: "PH1",
            name: "Nguyễn Văn E",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 6,
            maPN: "PH1",
            name: "Nguyễn Văn H",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 7,
            maPN: "PH1",
            name: "Nguyễn Văn I",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 8,
            maPN: "PH1",
            name: "Nguyễn Văn K",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 9,
            maPN: "PH1",
            name: "Nguyễn Văn L",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 10,
            maPN: "PH1",
            name: "Nguyễn Văn M",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 11,
            maPN: "PH1",
            name: "Nguyễn Văn Z",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
        {
            id: 12,
            maPN: "PH1",
            name: "Nguyễn Văn B",
            age: "18",
            cccd: "1951060922",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            year: 10,
            banding: 1,
            countryside: 'Ha Noi',
            guilty: 'Trộm Cắp',
            mananger: "otis Nguyễn",
        },
    ];

    const handleNavigate = (record: any) => {
        navigate(`/${record.id}`);
    };
    const handleOpenCreate = () => {
        setOpenCreatePrisoner(true);
        setIsEdit(false);
    };

    const handleOpenEdit = (record: PrisonerModel) => {
        setOpenCreatePrisoner(true);
        setIsEdit(true);
        setCurrentRecord(record)
    };

    const handleOpenDelete = (record: PrisonerModel) => {
        setIsOpenModal(true);
        setNamePrisoner(record.prisonerName ?? '')
    };

    const handleDeletePrisoner = () => {
        console.log("alo");
    };

    const columns: ColumnsType<any> = [
        {
            title: "Tên Phạm Nhân",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
                <div className={styles.containerInfor}>
                    <div>
                        <img className={styles.avatar} src={avatar} alt="" />
                    </div>
                    <div>
                        <div className={styles.name} onClick={() => handleNavigate(record)}>
                            {record?.name}
                        </div>
                        <div>{`${record?.age} tuổi`}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Ma Phạm Nhân",
            dataIndex: "maPN",
            key: "maPN",
        },
        {
            title: "Giới Tính",
            dataIndex: "sex",
            key: "sex",
        },
        {
            title: "Giường",
            dataIndex: "bed",
            key: "bed",
        },
        {
            title: "Người Quản Lý",
            dataIndex: "mananger",
            key: "mananger",
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
                        Tạo Phạm Nhân
                    </div>
                    <div>search</div>
                </div>
                <Table
                    columns={columns}
                    dataSource={mockData}
                    className={` ${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                />
            </div>
            <CreatePrisoner
                openCreatePrisoner={openCreatePrisoner}
                setOpenCreatePrisoner={setOpenCreatePrisoner}
                isEdit={isEdit}
                currentRecord={currentRecord}
            />
            <ModalComponent
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                handleDelete={handleDeletePrisoner}
                title="Xác Nhận Xóa Phạm Nhân"
                textConfirm="Xóa Phạm Nhân"
            >
                <div>{`Bạn có muốn xóa phạm nhân ${namePrisoner}`}</div>
            </ModalComponent>
        </div>
    );
};

export default Prisoner;
