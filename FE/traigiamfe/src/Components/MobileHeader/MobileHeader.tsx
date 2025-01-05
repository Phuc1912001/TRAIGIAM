import { BarsOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import React from "react";
import styles from "./MobileHeader.module.scss";
import avatar from "../../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";

const MobileHeader = () => {
  const navigate = useNavigate();

  const handleNavigateProfile = () => {
    navigate("/myProfile");
  };

  const handleNavigateLogin = () => {
    navigate("/login");
  };
  const content = (
    <div className={styles.popOver}>
      <div className={styles.item} onClick={handleNavigateProfile}>
        Thông Tin Cá Nhân
      </div>
      <div className={styles.item} onClick={handleNavigateLogin}>
        Đăng Xuất
      </div>
    </div>
  );
  return (
    <div className={styles.containerHeader}>
      <div className={styles.bar}>
        <BarsOutlined style={{ fontSize: "30px" }} />
      </div>
      <div>
        <Popover placement="bottomLeft" content={content}>
          <div className={styles.wrapperAcount}>
            <img className={styles.avatar} src={avatar} alt="" />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default MobileHeader;
