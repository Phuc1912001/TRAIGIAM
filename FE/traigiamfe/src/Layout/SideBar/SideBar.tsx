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
import { NavLink } from "react-router-dom";
import styles from "./SideBar.module.scss";

const SideBar = () => {
  const listNav = [
    {
      id: 1,
      path: "/prisoner",
      name: "QL PHẠM NHÂN",
      icon: <TeamOutlined />,
    },
    {
      id: 2,
      path: "/staff",
      name: "QL NHÂN VIÊN",
      icon: <IdcardOutlined />,
    },
    {
      id: 3,
      path: "/infringement",
      name: "QL VI PHẠM",
      icon: <ReconciliationOutlined />,
    },
    {
      id: 4,
      path: "/statement",
      name: "QL LỜI KHAI",
      icon: <FileDoneOutlined />,
    },
    {
      id: 5,
      path: "/punishment",
      name: "QL HÌNH PHẠT",
      icon: <BookOutlined />,
    },
    {
      id: 6,
      path: "/externalmoment",
      name: "QL RA VÀO",
      icon: <SelectOutlined />,
    },
    {
      id: 7,
      path: "/visit",
      name: "QL THĂM KHÁM",
      icon: <CommentOutlined />,
    },
    {
      id: 8,
      path: "/gender",
      name: "QL NHÀ GIAM",
      icon: <DatabaseOutlined />,
    },
    {
      id: 9,
      path: "/banding",
      name: "QL XẾP LOẠI",
      icon: <HomeOutlined />,
    },
    {
      id: 10,
      path: "/user",
      name: "QL NGƯỜI DÙNG",
      icon: <UserAddOutlined />,
    },
  ];

  return (
    <div className={styles.containerSideBar}>
      <div className={styles.wrapperSidebar}>
        <div className={styles.wrapperHome}>
          <div>
            <HomeOutlined />
          </div>
          <div>TRẠI GIAM</div>
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
