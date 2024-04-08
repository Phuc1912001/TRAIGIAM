import React from "react";
import styles from "./Layout.module.scss";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import { Col, Row } from "antd";

const Layout = () => {
    return (
        <div className={styles.containerLayout}>
            <div className={styles.sideBar}>
                <SideBar />
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
