import { useLoading } from '../../../common/Hook/useLoading'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './StaffDetail.module.scss'
import Header from '../../../Components/Header/Header'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'

const StaffDetail = () => {
    const navigate = useNavigate()
    const handleNavigateToList = () => {
        navigate("/")
    }
    const { showLoading, closeLoading } = useLoading()

    const items = [
        {
            title: <div>Phạm Nhân</div>
        },
        {
            title: <div className={styles.breacrumb} onClick={handleNavigateToList} >Danh Sách Phạm Nhân</div>
        },
        {
            title: <div>Chi Tiết Phạm Nhân</div>
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
            <div>
                Chi tiết Nhân viên
            </div>
        </div>
    )
}

export default StaffDetail