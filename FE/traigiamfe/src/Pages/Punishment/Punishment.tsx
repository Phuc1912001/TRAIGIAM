import { PunishmentModel } from '@/common/Model/punishment'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Table, { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLoading } from '../../common/Hook/useLoading'
import { useNotification } from '../../common/Hook/useNotification'
import Header from '../../Components/Header/Header'
import MobileHeader from '../../Components/MobileHeader/MobileHeader'
import ModalComponent from '../../Components/ModalDelete/ModalComponent'
import CreatePunishment from './CreatePunishment/CreatePunishment'
import styles from './Punishment.module.scss'
import StatusPunish from './StatusPunish/StatusPunish'

const Punishment = () => {
    const items = [
        {
            title: <div>Hình Phạt</div>,
        },
        {
            title: <div>Danh Sách Hình Phạt</div>,
        },
    ];
    const [dataPunishment, setDataPunishment] = useState<PunishmentModel[]>([])

    const [openCreatePunish, setOpenCreatePunish] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false)
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false)
    const [currentRecord, setCurentRecord] = useState<PunishmentModel>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading()
    const notification = useNotification();


    const getAllPunishment = async () => {
        try {
            showLoading("getAllPunishment")
            const { data } = await axios.get('https://localhost:7120/api/Punish')
            setDataPunishment(data.data)
            closeLoading("getAllPunishment")
        } catch (error) {
            closeLoading("getAllPunishment")

        }
    }

    useEffect(() => {
        getAllPunishment()
    }, [])

    useEffect(() => {
        getAllPunishment()
    }, [recall])


    const handleOpenCreate = () => {
        setOpenCreatePunish(true);
        setIsEdit(false);
        setIsView(false)
        setReset(!reset)
    };

    const handleOpenEdit = (record: PunishmentModel) => {
        setOpenCreatePunish(true);
        setIsEdit(true);
        setCurentRecord(record)
        setShowDelete(true)
        setReset(!reset)
    }

    const handleOpenDelete = (record: PunishmentModel) => {
        setIsOpenModal(true);
        setCurentRecord(record)
    }

    const handleDeletePrisoner = async () => {
        try {
            showLoading("deletePunish")
            await axios.delete(`https://localhost:7120/api/punish/${currentRecord?.id}`)
            getAllPunishment()
            setIsOpenModal(false);
            notification.success(<div>Xóa Hình Phạt Thành Công.</div>)
            closeLoading("deletePunish")
        } catch (error) {
            setIsOpenModal(true);
            closeLoading("deletePunish")
        }
    };

    const handleToView = (record: PunishmentModel) => {
        setIsView(true)
        setCurentRecord(record)
        setOpenCreatePunish(true);
    }

    const columns: ColumnsType<PunishmentModel> = [

        {
            title: "Tên Hình Phạt",
            dataIndex: "punishName",
            key: "punishName",
            render: (_, record) => {
                return <div onClick={() => handleToView(record)} className={styles.name}>{record.punishName}</div>
            }
        },
        {
            title: "Mô Tả",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (_, record) => {
                return <div>
                    <StatusPunish status={record?.status} />
                </div>
            }
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
                        Tạo Hình Phạt
                    </div>
                    <div>search</div>
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
    )
}

export default Punishment