import React from "react";
import { Breadcrumb, Popover } from "antd";
import styles from "./Header.module.scss";
import avatar from "../../assets/avatar.jpg";
import { useNavigate } from 'react-router-dom'

interface IItems {
    title: any;
}

interface IHeader {
    items: IItems[];
}

const Header = (props: IHeader) => {
    const { items } = props;

    const navigate = useNavigate()
    const handleNavigateProfile = () => {
        navigate('/myProfile')
    }

    const handleNavigateLogin = () => {
        navigate('/login')
    }

    const content = (
        <div className={styles.popOver}>
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
