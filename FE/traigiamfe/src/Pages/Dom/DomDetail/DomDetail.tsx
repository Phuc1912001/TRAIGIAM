import { useLoading } from '../../../common/Hook/useLoading'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './DomDetail.module.scss'
import Header from '../../../Components/Header/Header'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { RoomModel } from '@/common/Model/Room'
import { useNotification } from '../../../common/Hook/useNotification'
import CreateRoom from './CreateRoom/CreateRoom'
import axios from 'axios'
import { Col, Popover, Row } from 'antd'
import ModalComponent from '../../../Components/ModalDelete/ModalComponent'

const DomDetail = () => {

    const navigate = useNavigate()
    const handleNavigateToList = () => {
        navigate("/dom")
    }
    const { state } = useLocation()
    const items = [
        {
            title: <div>Phòng Ban</div>
        },
        {
            title: <div className={styles.breacrumb} onClick={handleNavigateToList} >Danh Sách Phòng Ban</div>
        },
        {
            title: <div>{state.domName}</div>
        },
    ];

    const [dataRoom, setDataRoom] = useState<RoomModel[]>([])

    const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
    const [isEditRoom, setIsEditRoom] = useState<boolean>(false);

    const [resetRoom, setResetRoom] = useState<boolean>(false)

    const [recallRoom, setRecallRoom] = useState<boolean>(false)
    const [currentRecordRoom, setCurentRecordRoom] = useState<RoomModel>()
    const [isOpenModalRoom, setIsOpenModalRoom] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading()
    const notification = useNotification();

    const getAllRoom = async () => {
        try {
            showLoading("getAllPunishment")
            const { data } = await axios.get('https://localhost:7120/api/Room')
            setDataRoom(data.data)
            closeLoading("getAllPunishment")
        } catch (error) {
            closeLoading("getAllPunishment")

        }
    }

    useEffect(() => {
        getAllRoom()
    }, [])

    useEffect(() => {
        getAllRoom()
    }, [recallRoom])

    const handleOpenCreate = () => {
        setOpenCreateRoom(true);
        setIsEditRoom(false);
        setResetRoom(!resetRoom)
    };

    const handleOpenEdit = (record: RoomModel) => {
        setOpenCreateRoom(true);
        setIsEditRoom(true);
        setCurentRecordRoom(record);
        setResetRoom(!resetRoom);
    };

    const handleOpenDelete = (record: RoomModel) => {
        setIsOpenModalRoom(true);
        setCurentRecordRoom(record)
    };

    const handleDeletePrisoner = async () => {
        try {
            showLoading("deleteRoom");
            await axios.delete(
                `https://localhost:7120/api/Room/${currentRecordRoom?.id}`
            );
            getAllRoom();
            setIsOpenModalRoom(false);
            notification.success(<div>Xóa Phòng Thành Công.</div>);
            closeLoading("deleteRoom");
        } catch (error) {
            setIsOpenModalRoom(true);
            closeLoading("deleteRoom");
        }
    };
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
                        Tạo Phòng
                    </div>
                </div>
                <div>
                    <Row gutter={[24, 24]} >
                        {
                            dataRoom.map((item: RoomModel) => {

                                const content = (
                                    <div className={styles.contentPopup} >
                                        <div className={styles.itemPopup} onClick={() => handleOpenEdit(item)} >
                                            <div>
                                                <EditOutlined style={{ fontSize: 18 }} />
                                            </div>
                                            <div>
                                                Sửa
                                            </div>
                                        </div>
                                        <div className={styles.itemPopup} onClick={() => handleOpenDelete(item)} >
                                            <div>
                                                <DeleteOutlined style={{ fontSize: 18 }} />
                                            </div>
                                            <div>
                                                Xóa
                                            </div>
                                        </div>
                                    </div>
                                )

                                return (
                                    <Col sm={12} key={item.id} >
                                        <div className={styles.wrapperRoom} >
                                            <div className={styles.headRoom} >
                                                <div>{item.roomName}</div>

                                                <Popover placement="topLeft" content={content}>
                                                    <div className={styles.icon} >div</div>
                                                </Popover>
                                            </div>
                                            <Row gutter={[12, 12]} >
                                                <Col sm={8} md={4} >
                                                    <div className={styles.bedRoom} >

                                                    </div>
                                                </Col>
                                                <Col sm={8} md={4} >
                                                    <div className={styles.btnBedRoom} >
                                                        <PlusOutlined />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </div>
            <CreateRoom
                openCreateRoom={openCreateRoom}
                setOpenCreateRoom={setOpenCreateRoom}
                isEditRoom={isEditRoom}
                recallRoom={recallRoom}
                setRecallRoom={setRecallRoom}
                resetRoom={resetRoom}
                currentRecordRoom={currentRecordRoom}
            />

            <ModalComponent
                isOpenModal={isOpenModalRoom}
                setIsOpenModal={setIsOpenModalRoom}
                handleDelete={handleDeletePrisoner}
                title="Xác Nhận Xóa Phòng"
                textConfirm="Xóa Phòng"
            >
                <div>{`Bạn có muốn xóa ${currentRecordRoom?.roomName}`}</div>
            </ModalComponent>
        </div>
    )
}

export default DomDetail