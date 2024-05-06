import { InfringementResponse } from '@/common/Model/infringement'
import Header from '../../../Components/Header/Header'
import MobileHeader from '../../../Components/MobileHeader/MobileHeader'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './InfringementDetail.module.scss'

const InfringementDetail = () => {
    const navigate = useNavigate()
    const handleNavigateToList = () => {
        navigate("/infringement")
    }

    const items = [
        {
            title: <div>Vi Phạm</div>
        },
        {
            title: <div className={styles.breacrumb} onClick={handleNavigateToList} >Danh Sách Vi Phạm</div>
        },
        {
            title: <div>Chi Tiết Vi Phạm</div>
        },
    ];

    const { id } = useParams()
    const [dataDetail, setDataDetail] = useState<InfringementResponse>()

    return (
        <div>
            <div className="share-sticky">
                <Header items={items} />
            </div>
            <div className="share-sticky-mobile" >
                <MobileHeader />
            </div>
        </div>
    )
}

export default InfringementDetail