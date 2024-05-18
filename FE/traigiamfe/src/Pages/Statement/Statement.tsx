import { StatmentModel } from '@/common/Model/statement';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../assets/default.jpg';
import { useLoading } from '../../common/Hook/useLoading';
import { useNotification } from '../../common/Hook/useNotification';
import Header from '../../Components/Header/Header';
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import ModalComponent from '../../Components/ModalDelete/ModalComponent';
import CreateStatement from './CreateStatement/CreateStatement';
import styles from './Statement.module.scss';
import StatusStatement from './StatusStatement/StatusStatement';


const Statement = () => {
    const items = [
        {
            title: <div>Lời Khai</div>
        },
        {
            title: <div>Danh Sách Lời Khai</div>
        }
    ];
    const initialFieldValues = {
        imageName: "",
        imageSrc: defaultImage,
        imageFile: null,
    };

    const [dataStatement, setDataStatement] = useState<StatmentModel[]>([]);
    const [openCreateStatement, setOpenCreateStatement] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false);
    const [currentRecord, setCurrentRecord] = useState<StatmentModel>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading();
    const notification = useNotification();
    const navigate = useNavigate()
    const [values, setValues] = useState(initialFieldValues);



    const handleGetAllStatement = async () => {
        try {
            showLoading("getAllStatement");
            const { data } = await axios.get("https://localhost:7120/api/Statement");
            setDataStatement(data.data);
            closeLoading("getAllStatement");
        } catch (error) {
            closeLoading("getAllStatement");
        }
    };

    useEffect(() => {
        handleGetAllStatement();
    }, []);

    useEffect(() => {
        handleGetAllStatement();
    }, [recall]);


    const handleOpenCreate = () => {
        setOpenCreateStatement(true);
        setIsEdit(false);
        setIsView(false);
        setReset(!reset);
    };


    const handleOpenEdit = (record: StatmentModel) => {
        setOpenCreateStatement(true);
        setIsEdit(true);
        setCurrentRecord(record);
        setValues({
            ...values,
            imageSrc: record.imageSrc as string,
        });
        setShowDelete(true);
        setReset(!reset);
    };

    const handleOpenDelete = (record: StatmentModel) => {
        setIsOpenModal(true);
        setCurrentRecord(record);
    };

    const handleDeleteStatement = async () => {
        try {
            showLoading("deleteStatement");
            await axios.delete(
                `https://localhost:7120/api/Statement/${currentRecord?.id}`
            );
            handleGetAllStatement();
            setIsOpenModal(false);
            notification.success(<div>Xóa Lời Khai Thành Công.</div>);
            closeLoading("deleteStatement");
        } catch (error) {
            setIsOpenModal(true);
            closeLoading("deleteStatement");
        }
    };

    const handleToView = (record: StatmentModel) => {
        setIsView(true)
        setCurrentRecord(record)
        setOpenCreateStatement(true);
    }

    const handleNavigate = (record: StatmentModel) => {
        navigate(`/infringement/${record.irId}`)
    }


    const columns: ColumnsType<StatmentModel> = [
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
            title: "Tên Vi Phạm",
            dataIndex: "irName",
            key: "irName",
            render: (_, record) => {
                return <div onClick={() => handleNavigate(record)} className={styles.irName} >{record.irName}</div>
            }
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                return (
                    <div>
                        <StatusStatement status={record?.status ?? 0} />
                    </div>
                );
            },
        },
        {
            title: "Hoạt Động",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                record.status === 0 &&
                <div className={styles.wrapperAction} >
                    <div className={"editBtn"} onClick={() => handleOpenEdit(record)}>
                        <EditOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div className={"editBtn"} onClick={() => handleOpenDelete(record)}>
                        <DeleteOutlined style={{ fontSize: 18 }} />
                    </div>
                </div >
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
                        Tạo Lời Khai
                    </div>
                    <div>search</div>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataStatement}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                />
            </div>
            <CreateStatement
                openCreateStatement={openCreateStatement}
                setOpenCreateStatement={setOpenCreateStatement}
                isEdit={isEdit}
                currentRecord={currentRecord}
                values={values}
                setValues={setValues}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
                setRecall={setRecall}
                recall={recall}
                reset={reset}
                isView={isView}
                setIsView={setIsView}
                initialFieldValues={initialFieldValues}
            />

            <ModalComponent
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                handleDelete={handleDeleteStatement}
                title="Xác nhận xóa lời khai"
                textConfirm="Xóa Lời Khai"
            >
                <div>{`Bạn có muốn xóa lời khai `}</div>
            </ModalComponent>
        </div>
    )
}

export default Statement