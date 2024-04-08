import Header from "../../Components/Header/Header";
import { Breadcrumb, Button, Layout, Table } from "antd";
import React from "react";
import styles from "./Prisoner.module.scss";
import { ColumnsType } from "antd/es/table";
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { render } from "react-dom";
import { useNavigate } from "react-router-dom";

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

    const mockData = [
        {
            id: 1,
            maPN: "PH1",
            name: "Nguyễn Văn A",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 2,
            maPN: "PH1",
            name: "Nguyễn Văn B",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 3,
            maPN: "PH1",
            name: "Nguyễn Văn C",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 4,
            maPN: "PH1",
            name: "Nguyễn Văn D",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 5,
            maPN: "PH1",
            name: "Nguyễn Văn E",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 6,
            maPN: "PH1",
            name: "Nguyễn Văn H",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 7,
            maPN: "PH1",
            name: "Nguyễn Văn I",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 8,
            maPN: "PH1",
            name: "Nguyễn Văn K",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 9,
            maPN: "PH1",
            name: "Nguyễn Văn L",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 10,
            maPN: "PH1",
            name: "Nguyễn Văn M",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 11,
            maPN: "PH1",
            name: "Nguyễn Văn Z",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
        {
            id: 12,
            maPN: "PH1",
            name: "Nguyễn Văn B",
            age: "18",
            sex: "Nam",
            dateTime: "abc",
            dom: "DOM A",
            bed: "Bed 1",
            manager: "otis Nguyễn",
        },
    ];

    const handleNavigate = (record: any) => {
        navigate(`/${record.id}`);
    };

    const columns: ColumnsType<any> = [
        {
            title: "Ma Phạm Nhân",
            dataIndex: "maPN",
            key: "maPN",
        },
        {
            title: "Tên Phạm Nhân",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
                <div className={styles.name} onClick={() => handleNavigate(record)}>
                    {record.name}
                </div>
            ),
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
            dataIndex: "manager",
            key: "manager",
        },
        {
            title: "Hoạt Động",
            dataIndex: "action",
            key: "action",
            render: () => (
                <div className={styles.wrapperAction}>
                    <div className={"editBtn"}>
                        <EditOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div className={"editBtn"}>
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

            <div className={styles.wrapperContent}>
                <div className={styles.wrapperBtn} >
                    <div className={'createBtn'}>
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
        </div>
    );
};

export default Prisoner;
