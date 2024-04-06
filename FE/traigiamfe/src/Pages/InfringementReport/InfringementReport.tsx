import React from 'react'
import styles from './InfringementReport.module.scss'
import Header from "../../Components/Header/Header";


const InfringementReport = () => {
    const items = [
        {
            title: <div>Quản lý Vi Phạm</div>
        },
        {
            title: <div>Danh Sách Báo Cáo Vi Phạm</div>
        }
    ];
    return (
        <div>
            <div>
                <Header items={items} />
            </div>
            <div>InfringementReport</div>
        </div>
    )
}

export default InfringementReport