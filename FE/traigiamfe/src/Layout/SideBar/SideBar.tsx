import {
    BookOutlined,
    CommentOutlined,
    ExceptionOutlined,
    FileDoneOutlined,
    HomeOutlined,
    IdcardOutlined,
    ReconciliationOutlined,
    SelectOutlined,
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
            path: "/prisoner",
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
        {
            id: 5,
            path: "/punishment",
            name: "Hình Phạt",
            icon: < BookOutlined />,
        },
        {
            id: 6,
            path: "/externalmoment",
            name: "Xuất Nhập",
            icon: < SelectOutlined />,
        },
        {
            id: 7,
            path: "/visit",
            name: "Thăm Khám",
            icon: < CommentOutlined />,
        },
    ];

    return (
        <div className={styles.containerSideBar}>
            <div className={styles.wrapperSidebar} >
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
        </div>
    );
};

export default SideBar;
