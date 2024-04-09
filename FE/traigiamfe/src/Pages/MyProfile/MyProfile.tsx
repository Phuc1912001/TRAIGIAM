import Header from '../../Components/Header/Header'
import React from 'react'
import styles from './MyProfile.module.scss'

const MyProfile = () => {
    const items = [
        {
            title: <div>Thông Tin Cá Nhân</div>,
        },

    ];
    return (
        <div>
            <div className="share-sticky">
                <Header items={items} />
            </div>
            <div className={styles.containerProfile}>
                <h2>Thông Tin Cá Nhân</h2>
                <div>
                    <div>
                        Họ Và Tên :
                    </div>
                    <div>N/A</div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile