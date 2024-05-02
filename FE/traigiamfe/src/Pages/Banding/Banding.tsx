import Header from '../../Components/Header/Header';
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import React, { useState } from 'react'
import styles from './Banding.module.scss'
import entry from '../../assets/svg/entry.svg'
import { PlusCircleOutlined } from '@ant-design/icons';
import { BandingModel } from '@/common/Model/banding';
import { useLoading } from '../../common/Hook/useLoading';
import { useNotification } from '../../common/Hook/useNotification';

const Banding = () => {
    const items = [
        {
            title: <div>Cấp Bậc</div>,
        },
        {
            title: <div>Danh Sách Cấp Bậc</div>,
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


    const handleOpenCreate = () => {
        setOpenCreatePunish(true);
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
                        Tạo Cấp Bậc
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
        </div>
    )
}

export default Banding