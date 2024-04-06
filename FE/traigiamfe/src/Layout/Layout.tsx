import React from 'react'
import styles from './Layout.module.scss'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar/SideBar'

const Layout = () => {
    return (
        <div className={styles.containerLayout} >
            <div><SideBar /></div>
            <div className={styles.content} ><Outlet /></div>
        </div>
    )
}

export default Layout