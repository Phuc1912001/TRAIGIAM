import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLoading } from '../../common/Hook/useLoading';
import { useNotification } from '../../common/Hook/useNotification';
import { BandingEnum, BandingModel, IBandingMap, IBandingTextMap } from '../../common/Model/banding';
import Header from '../../Components/Header/Header';
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import ModalComponent from '../../Components/ModalDelete/ModalComponent';
import StatusPunish from '../Punishment/StatusPunish/StatusPunish';
import styles from './Banding.module.scss';
import CreateBanding from './CreateBanding/CreateBanding';

const Banding = () => {
    const items = [
        {
            title: <div>Xếp Loại</div>,
        },
        {
            title: <div>Danh Sách Xếp Loại</div>,
        },
    ];

    const [dataBanding, setDataBanding] = useState<BandingModel[]>([])

    const [openCreatePunish, setOpenCreatePunish] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false)
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false)
    const [currentRecord, setCurentRecord] = useState<BandingModel>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading()
    const notification = useNotification();

    const getAllBanding = async () => {
        try {
            showLoading("GetAllBanding")
            const { data } = await axios.get('https://localhost:7120/api/Banding')
            setDataBanding(data.data)
            closeLoading("GetAllBanding")
        } catch (error) {
            closeLoading("GetAllBanding")

        }
    }

    useEffect(() => {
        getAllBanding()
    }, [])

    useEffect(() => {
        getAllBanding()
    }, [recall])



    const handleOpenCreate = () => {
        setOpenCreatePunish(true);
        setIsEdit(false);
        setIsView(false)
        setReset(!reset)
    };

    const handleOpenEdit = (record: BandingModel) => {
        setOpenCreatePunish(true);
        setIsEdit(true);
        setCurentRecord(record)
        setShowDelete(true)
        setReset(!reset)
    }

    const handleOpenDelete = (record: BandingModel) => {
        setIsOpenModal(true);
        setCurentRecord(record)
    }

    const handleDeleteBanding = async () => {
        try {
            showLoading("deletePunish")
            await axios.delete(`https://localhost:7120/api/Banding/${currentRecord?.id}`)
            getAllBanding()
            setIsOpenModal(false);
            notification.success(<div>Xóa Cấp Bậc Thành Công.</div>)
            closeLoading("deletePunish")
        } catch (error) {
            setIsOpenModal(true);
            closeLoading("deletePunish")

        }
    };


    const handleToView = (record: BandingModel) => {
        setIsView(true)
        setCurentRecord(record)
        setOpenCreatePunish(true);
    }



    const columns: ColumnsType<BandingModel> = [

        {
            title: "Tên Hình Phạt",
            dataIndex: "bandingName",
            key: "bandingName",
            render: (_, record) => {
                return (
                    <div className={styles.bandingName} onClick={() => handleToView(record)} >
                        <img alt="banding" src={IBandingMap.get((record?.bandingID ?? 10) as BandingEnum)} />
                        {IBandingTextMap.get(record.bandingID ?? BandingEnum.Entry)}
                    </div>
                )
            }
        },
        {
            title: "Mô Tả",
            dataIndex: "desc",
            key: "desc",
            width: '22%',
            render: (_, record) => {
                return <div className='hcis-two-rows'>
                    <Tooltip

                        placement="top"
                        title={<div className="customTooltip">{record?.desc}</div>}
                        color="#ffffff"
                        arrow={true}
                    >
                        <div>{record?.desc}</div>
                    </Tooltip>
                </div>
            }
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
                        Tạo Xếp Loại
                    </div>
                    <div>search</div>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataBanding}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                />
            </div>

            <CreateBanding
                openCreatePunish={openCreatePunish}
                setOpenCreatePunish={setOpenCreatePunish}
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
                handleDelete={handleDeleteBanding}
                title="Xác Nhận Xóa Xếp Loại"
                textConfirm="Xóa Xếp Loại"
            >
                <div>{`Bạn có muốn xóa Xếp Loại ${currentRecord?.bandingID}.`}</div>
            </ModalComponent>
        </div>
    )
}

export default Banding