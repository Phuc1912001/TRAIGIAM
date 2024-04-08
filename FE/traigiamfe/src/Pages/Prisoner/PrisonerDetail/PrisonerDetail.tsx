import Header from '../../../Components/Header/Header'
import React from 'react'
import styles from './PrisonerDetail.module.scss'
import { useNavigate } from 'react-router-dom'

const PrisonerDetail = () => {
    const navigate = useNavigate()
    const handleNavigateToList = () => {
        navigate("/")
    }
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
            <div className="share-sticky" >
                <Header items={items} />
            </div>
            <div>Chi tiết phạm nhân</div>
        </div>
    )
}

export default PrisonerDetail