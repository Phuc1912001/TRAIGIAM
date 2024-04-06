import Header from '../../Components/Header/Header'
import React from 'react'
import styles from './Staff.module.scss'

const Staff = () => {
    const items = [
        {
            title: <div>Nhân Viên</div>
        },
        {
            title: <div>Danh Sách Nhân Viên</div>
        }
    ];
    return (
        <div>

            <div>
                <Header items={items} />
            </div>

            <div>Staff</div>
        </div>
    )
}

export default Staff