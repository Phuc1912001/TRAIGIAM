import React, { useEffect, useState } from "react";
import { Breadcrumb, Popover } from "antd";
import styles from "./Header.module.scss";
import avatar from "../../assets/avatar.jpg";
import { useNavigate } from 'react-router-dom'
import { contextUser } from "../../App";
import { useContext } from 'react'

interface IItems {
    title: any;
}

interface IHeader {
    items: IItems[];
}

const Header = (props: IHeader) => {
    const { items } = props;

    const { setUser, user } = useContext(contextUser)

    const navigate = useNavigate()
    const handleNavigateProfile = () => {
        navigate('/myProfile')
    }

    const handleNavigateLogin = () => {
        localStorage.removeItem("userData");
        setUser({})
        navigate('/login')
    }
    const [data, setData] = useState<any>();

    const storedUserDataString = localStorage.getItem("userData");

    useEffect(() => {
        if (storedUserDataString) {
            const storedUserData = JSON.parse(storedUserDataString ?? "");
            setData(storedUserData);
        }
    }, [storedUserDataString]);


    useEffect(() => {
        if (!storedUserDataString) {
            navigate('/login')
        }
    }, [storedUserDataString])

    const renderRole = (role: number) => {
        switch (role) {
            case 0:
                return 'Người Dùng'
            case 1:
                return 'Quản trị viên'
            case 2:
                return 'Giám Đốc'
            default:
                break;
        }
    }

    const content = (
        <div className={styles.popOver}>
            <h3>{data?.userName}</h3>
            <div className={styles.role} >Vai Trò: {renderRole(data?.role)}</div>
            <div className={styles.item} onClick={handleNavigateProfile} >Thông Tin Cá Nhân</div>
            <div className={styles.item} onClick={handleNavigateLogin} >Đăng Xuất</div>
        </div>
    );
    return (
        <div className={styles.containerHeader}>
            <div>
                <Breadcrumb items={items} />
            </div>
            <Popover placement="bottomLeft" content={content}>
                <div className={styles.wrapperAcount}>
                    <img className={styles.avatar} src={avatar} alt="" />
                </div>
            </Popover>
        </div>
    );
};

export default Header;
