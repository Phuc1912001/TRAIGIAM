import { useLoading } from "../../common/Hook/useLoading";
import { UserModel } from "@/common/Model/user";
import { RoleEnum } from "../../Pages/MyProfile/Role.model";
import {
  BookOutlined,
  CommentOutlined,
  DatabaseOutlined,
  FileDoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  ReconciliationOutlined,
  SelectOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons/lib/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./SideBar.module.scss";

const SideBar = () => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const [data, setData] = useState<any>();
  const storedUserDataString = localStorage.getItem("userData");
  const [dataDetail, setDataDetail] = useState<UserModel>();
  const { showLoading, closeLoading } = useLoading();

  useEffect(() => {
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString ?? "");

      setData(storedUserData);
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
      icon: <BookOutlined />,
    },
    {
      id: 6,
      path: "/externalmoment",
      name: "Ra Vào",
      icon: <SelectOutlined />,
    },
    {
      id: 7,
      path: "/visit",
      name: "Thăm Khám",
      icon: <CommentOutlined />,
    },
    {
      id: 8,
      path: "/gender",
      name: "Nhà Giam",
      icon: <DatabaseOutlined />,
    },
    {
      id: 9,
      path: "/banding",
      name: "Xếp loại",
      icon: <HomeOutlined />,
    },
    {
      id: 10,
      path: "/user",
      name: "Người dùng",
      icon:
        dataDetail?.role === RoleEnum.truongTrai ||
        dataDetail?.role === RoleEnum.giamThi ? (
          <UserAddOutlined />
        ) : null,
    },
  ];

  return (
    <div className={styles.containerSideBar}>
      <div className={styles.wrapperSidebar}>
        <div className={styles.wrapperHome}>
          <div>
            <HomeOutlined />
          </div>
          <div>Trại Giam</div>
        </div>

        <div className={styles.wrapper}>
          {listNav.map((item) => {
            if (item.icon === null) {
              return null;
            }
            return (
              <NavLink
                to={item.path}
                className={styles.sideBar}
                key={item.path}
              >
                <div>{item.icon}</div>
                <div>{item.name}</div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
