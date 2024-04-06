import React from 'react'
import { Breadcrumb } from 'antd'
import styles from './Header.module.scss'

interface IItems {
    title: any;
}

interface IHeader {
    items: IItems[];
}

const Header = (props: IHeader) => {
    const { items } = props
    return (
        <div className={styles.containerHeader} >
            <div>
                <Breadcrumb
                    items={items}
                />
            </div>
            <div>
                acount
            </div>
        </div>
    )
}

export default Header