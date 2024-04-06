import {
    ExceptionOutlined,
    FileDoneOutlined,
    HomeOutlined,
    IdcardOutlined,
    ReconciliationOutlined,
    TeamOutlined,
} from "@ant-design/icons/lib/icons";
import React, { useState } from "react";
import styles from "./SideBar.module.scss";
import { NavLink } from "react-router-dom";
import logo from '../../assets/logo.jpg'

const SideBar = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const listNav = [
        {
            id: 1,
            path: "/",
            name: "Phạm Nhân",
            icon: <TeamOutlined />,
        },
        {
            id: 2,
            path: "/staff",
            name: "Nhân Viên",
            icon: <IdcardOutlined />,
        },
        {
            id: 3,
            path: "/infringement",
            name: "Vi Phạm",
            icon: <ReconciliationOutlined />,
        },
        {
            id: 4,
            path: "/statement",
            name: "Lời Khai",
            icon: <FileDoneOutlined />,
        },
    ];

    return (
        <div className={styles.containerSideBar}>
            <div className={styles.wrapperHome} >
                <div><HomeOutlined /></div>
                <div>Trại Giam</div>
            </div>

            <div className={styles.wrapper}>
                {
                    listNav.map(item => (
                        <NavLink to={item.path} className={styles.sideBar}>
                            <div>{item.icon}</div>
                            <div>{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
        </div>
    );
};

export default SideBar;
