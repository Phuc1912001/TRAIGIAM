import Header from '../../Components/Header/Header';
import React from 'react'
import styles from './Visit.module.scss'
import MobileHeader from '../../Components/MobileHeader/MobileHeader';

const Visit = () => {
    const items = [
        {
            title: <div>Thăm Khám</div>,
        },
        {
            title: <div>Danh Sách Thăm Khám</div>,
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

export default Visit