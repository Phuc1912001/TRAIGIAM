import Header from '../../Components/Header/Header'
import MobileHeader from '../../Components/MobileHeader/MobileHeader'
import React from 'react'
import styles from './CheckInCheckOut.module.scss'

const CheckInCheckOut = () => {
    const items = [
        {
            title: <div>Xuất Nhập</div>,
        },
        {
            title: <div>Danh Sách Xuất Nhập</div>,
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
        </div>
    )
}

export default CheckInCheckOut