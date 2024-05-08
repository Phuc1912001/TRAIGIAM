import { useLoading } from '../../../common/Hook/useLoading'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './DomDetail.module.scss'
import Header from '../../../Components/Header/Header'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'
import { PlusCircleOutlined } from '@ant-design/icons'
import { RoomModel } from '@/common/Model/Room'
import { useNotification } from '../../../common/Hook/useNotification'
import CreateRoom from './CreateRoom/CreateRoom'

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

    const handleOpenCreate = () => {
        setOpenCreateRoom(true);
        setIsEditRoom(false);
        setResetRoom(!resetRoom)
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
                <div>phong</div>
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
        </div>
    )
}

export default DomDetail