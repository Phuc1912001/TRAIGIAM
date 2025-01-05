import { UserModel } from "@/common/Model/user";
import { Breadcrumb, Popover } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleEnum } from "../../Pages/MyProfile/Role.model";
import defaultImage from "../../assets/default.jpg";
import { useLoading } from "../../common/Hook/useLoading";
import styles from "./Header.module.scss";
interface IItems {
  title: A;
}

interface IHeader {
  items: IItems[];
}

const Header = (props: IHeader) => {
  const { items } = props;

  const navigate = useNavigate();
  const handleNavigateProfile = () => {
    navigate("/myProfile");
  };

  const handleNavigateLogin = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };
  const [data, setData] = useState<A>();
  const { showLoading, closeLoading } = useLoading();
  const [dataDetail, setDataDetail] = useState<UserModel>();

  const storedUserDataString = localStorage.getItem("userData");

  useEffect(() => {
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString ?? "");
      setData(storedUserData);
    }
  }, [storedUserDataString]);

  useEffect(() => {
    if (!storedUserDataString) {
      navigate("/login");
    }
  }, [storedUserDataString]);

  const getUserById = async () => {
    if (data?.id) {
      try {
        showLoading("getUser");
        const { data: result } = await axios.get(
          `https://localhost:7120/api/Register/${data?.id}`
        );
        setDataDetail(result.data);
        closeLoading("getUser");
      } catch (error) {
        closeLoading("getUser");
      }
    }
  };

  useEffect(() => {
    getUserById();
  }, [data?.id]);

  const renderRole = (role: number) => {
    switch (role) {
      case RoleEnum.truongTrai:
        return "Trưởng trại";
      case RoleEnum.giamThi:
        return "Giám Thị";
      case RoleEnum.congAn:
        return "Công an";
      default:
        break;
    }
  };

  const content = (
    <div className={styles.popOver}>
      <h3>{dataDetail?.userName}</h3>
      <div className={styles.role}>
        Vai Trò: {renderRole(dataDetail?.role ?? 0)}
      </div>
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
      <div>
        <Breadcrumb items={items} />
      </div>
      <Popover placement="bottomLeft" content={content}>
        <div className={styles.wrapperAcount}>
          <img
            className={styles.avatar}
            src={dataDetail?.imageSrc ?? defaultImage}
            alt=""
          />
        </div>
      </Popover>
    </div>
  );
};

export default Header;
