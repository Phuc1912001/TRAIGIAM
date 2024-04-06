import React from 'react'
import styles from './Statement.module.scss'
import Header from '../../Components/Header/Header'


const Statement = () => {
    const items = [
        {
            title: <div>Lời Khai</div>
        },
        {
            title: <div>Danh Sách Lời Khai</div>
        }
    ];
    return (
        <div>
            <div>
                <Header items={items} />
            </div>
            <div>
                Statement
            </div>
        </div>
    )
}

export default Statement