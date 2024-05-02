import Header from '../../Components/Header/Header';
import MobileHeader from '../../Components/MobileHeader/MobileHeader';
import React from 'react'
import styles from './Dom.module.scss'

const Dom = () => {

    const items = [
        {
            title: <div>Phòng Ban</div>,
        },
        {
            title: <div>Danh Sách Phòng Ban</div>,
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
            <div>Phòng Ban</div>
        </div>
    )
}

export default Dom