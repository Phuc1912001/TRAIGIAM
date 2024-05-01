import Header from '../../Components/Header/Header'
import MobileHeader from '../../Components/MobileHeader/MobileHeader'
import React, { useState } from 'react'
import styles from './CheckInCheckOut.module.scss'
import { useLoading } from '../../common/Hook/useLoading'
import { useNotification } from '../../common/Hook/useNotification'
import { CheckInCheckOutModel } from '@/common/Model/checkincheckout'
import { PlusCircleOutlined } from '@ant-design/icons'
import CreateExternal from './CreateExternal/CreateExternal'

const CheckInCheckOut = () => {
    const items = [
        {
            title: <div>Xuất Nhập</div>,
        },
        {
            title: <div>Danh Sách Xuất Nhập</div>,
        },
    ];
    const [dataExternal, setDataExternal] = useState<CheckInCheckOutModel[]>([])
    const [openCreateExternal, setOpenCreateExternal] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false)
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false)
    const [currentRecord, setCurentRecord] = useState<CheckInCheckOutModel>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading()
    const notification = useNotification();

    const handleOpenCreate = () => {
        setOpenCreateExternal(true);
        setIsEdit(false);
        setIsView(false)
        setReset(!reset)
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
                        Tạo Hình Phạt
                    </div>
                    <div>search</div>
                </div>
                {/* <Table
                    columns={columns}
                    dataSource={dataPunishment}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                /> */}
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
        </div>
    )
}

export default CheckInCheckOut