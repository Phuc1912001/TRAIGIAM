import Header from '../../Components/Header/Header';
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import React, { useEffect, useState } from 'react'
import styles from './Dom.module.scss'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { DomModel } from '@/common/Model/dom';
import { useLoading } from '../../common/Hook/useLoading';
import { useNotification } from '../../common/Hook/useNotification';
import CreateDom from './CreateDom/CreateDom';
import ModalComponent from '../../Components/ModalDelete/ModalComponent';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dom = () => {

    const items = [
        {
            title: <div>Phòng Ban</div>,
        },
        {
            title: <div>Danh Sách Phòng Ban</div>,
        },
    ];

    const [dataDom, setDataDom] = useState<DomModel[]>([])

    const [openCreateDom, setOpenCreateDom] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false)
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false)
    const [currentRecord, setCurentRecord] = useState<DomModel>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading()
    const notification = useNotification();

    const nabigate = useNavigate()

    const handleOpenCreate = () => {
        setOpenCreateDom(true);
        setIsEdit(false);
        setIsView(false)
        setReset(!reset)
    };

    const getAllDom = async () => {
        try {
            showLoading("getAllPunishment")
            const { data } = await axios.get('https://localhost:7120/api/Dom')
            setDataDom(data.data)
            closeLoading("getAllPunishment")
        } catch (error) {
            closeLoading("getAllPunishment")

        }
    }
    useEffect(() => {
        getAllDom()
    }, [])

    useEffect(() => {
        getAllDom()
    }, [recall])

    const handleOpenEdit = (record: DomModel) => {
        setOpenCreateDom(true);
        setIsEdit(true);
        setCurentRecord(record)
        setShowDelete(true)
        setReset(!reset)
    }

    const handleOpenDelete = (record: DomModel) => {
        setIsOpenModal(true);
        setCurentRecord(record)
    }


    const handleDeleteDom = async () => {
        try {
            showLoading("deletePunish")
            await axios.delete(`https://localhost:7120/api/Dom/${currentRecord?.id}`)
            getAllDom()
            setIsOpenModal(false);
            notification.success(<div>Xóa Khu Thành Công.</div>)
            closeLoading("deletePunish")
        } catch (error) {
            setIsOpenModal(true);
            closeLoading("deletePunish")
        }
    };

    const handleNavigate = (record: DomModel) => {
        nabigate(`/dom/${record?.id}`, { state: { domName: record.domName, idDom: record.id } })
    }

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
                        Tạo Khu
                    </div>
                    <div>search</div>
                </div>
                <div>
                    {
                        dataDom.map((item: DomModel) => {
                            return (
                                <div key={item?.id} className={styles.wrapperDom} onClick={() => handleNavigate(item)} >
                                    <div className={styles.nameDom} >
                                        {item.domName}
                                    </div>
                                    <div className={styles.wrapperAction}>
                                        <div className={"editBtn"} onClick={() => handleOpenEdit(item)}>
                                            <EditOutlined style={{ fontSize: 18 }} />
                                        </div>
                                        <div className={"editBtn"} onClick={() => handleOpenDelete(item)}>
                                            <DeleteOutlined style={{ fontSize: 18 }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <CreateDom
                openCreateDom={openCreateDom}
                setOpenCreateDom={setOpenCreateDom}
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
                handleDelete={handleDeleteDom}
                title="Xác Nhận Xóa Khu"
                textConfirm="Xóa Khu"
            >
                <div>{`Bạn có muốn xóa ${currentRecord?.domName}`}</div>
            </ModalComponent>
        </div>
    )
}

export default Dom