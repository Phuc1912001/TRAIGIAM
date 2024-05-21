import Header from '../../Components/Header/Header';
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import React, { useEffect, useState } from 'react'
import styles from './DomGender.module.scss'
import { PlusCircleOutlined } from '@ant-design/icons';
import { DomGenderModel } from '@/common/Model/domgender';
import { useLoading } from '../../common/Hook/useLoading';
import { useNotification } from '../../common/Hook/useNotification';
import { useNavigate } from 'react-router-dom';
import CreateDomGender from './CreateDomGender/CreateDomGender';
import axios from 'axios';

const DomGender = () => {

    const items = [
        {
            title: <div>Phòng Ban</div>,
        },
        {
            title: <div>Danh Sách Phòng Ban</div>,
        },
    ];


    const [dataDomGender, setDataDomGender] = useState<DomGenderModel[]>([])

    const [openCreateDomGender, setOpenCreateDomGender] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false)
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [recall, setRecall] = useState<boolean>(false)
    const [currentRecord, setCurentRecord] = useState<DomGenderModel>()
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { showLoading, closeLoading } = useLoading()
    const notification = useNotification();

    const nabigate = useNavigate()

    const getAllDomGender = async () => {
        try {
            showLoading('getAllDomGender')
            const { data } = await axios.get('https://localhost:7120/api/DomGender')
            setDataDomGender(data.data)
            closeLoading('getAllDomGender')
        } catch (error) {
            closeLoading('getAllDomGender')

        }
    }

    useEffect(() => {
        getAllDomGender()
    }, [])

    const handleOpenCreate = () => {
        setOpenCreateDomGender(true);
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
                        Tạo Nhà Giam
                    </div>
                    <div>search</div>
                </div>

            </div>

            <CreateDomGender
                openCreateDomGender={openCreateDomGender}
                setOpenCreateDomGender={setOpenCreateDomGender}
                isEdit={isEdit}
                reset={reset}
                setIsView={setIsView}
                getAllDomGender={getAllDomGender}
            />
        </div>
    )
}

export default DomGender