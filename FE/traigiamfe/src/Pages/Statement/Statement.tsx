import React, { useState } from 'react'
import styles from './Statement.module.scss'
import Header from '../../Components/Header/Header'
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import { PlusCircleOutlined } from '@ant-design/icons';


const Statement = () => {
    const items = [
        {
            title: <div>Lời Khai</div>
        },
        {
            title: <div>Danh Sách Lời Khai</div>
        }
    ];

    // const [dataInfringement, setDataInfringement] = useState<InfringementResponse[]>([]);
    // const [openCreateInfringement, setOpenCreateInfringement] = useState<boolean>(false);
    // const [isEdit, setIsEdit] = useState<boolean>(false);
    // const [isView, setIsView] = useState<boolean>(false);
    // const [reset, setReset] = useState<boolean>(false);
    // const [showDelete, setShowDelete] = useState<boolean>(false);
    // const [recall, setRecall] = useState<boolean>(false);
    // const [currentRecord, setCurentRecord] = useState<InfringementResponse>();
    // const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    // const { showLoading, closeLoading } = useLoading();
    // const notification = useNotification();
    // const navigate = useNavigate()

    // const handleOpenCreate = () => {
    //     setOpenCreateInfringement(true);
    //     setIsEdit(false);
    //     setIsView(false);
    //     setReset(!reset);
    // };

    return (
        <div>
            <div className="share-sticky">
                <Header items={items} />
            </div>
            <div className="share-sticky-mobile" >
                <MobileHeader />
            </div>
            <div className={styles.wrapperContent}>
                {/* <div className={styles.wrapperBtn}>
                    <div className={"createBtn"} onClick={handleOpenCreate}>
                        <PlusCircleOutlined style={{ fontSize: 18 }} />
                        Tạo Lời Khai
                    </div>
                    <div>search</div>
                </div> */}
                {/* <Table
                    columns={columns}
                    dataSource={dataInfringement}
                    className={`${styles.prisonerTable} share-border-table`}
                    tableLayout="auto"
                /> */}
            </div>
        </div>
    )
}

export default Statement