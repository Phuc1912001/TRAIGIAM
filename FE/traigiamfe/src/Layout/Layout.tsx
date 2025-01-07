import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";
import SideBar from "./SideBar/SideBar";
import { LayoutContextProvider } from "./contextLayout/contextLayout";
import { useEffect, useState } from "react";
import { UserModel } from "@/common/Model/user";
import axios from "axios";

const Layout = () => {
  const [dataDetail, setDataDetail] = useState<UserModel>({});
  const [data, setData] = useState<A>();

  const storedUserDataString = localStorage.getItem("userData");

  useEffect(() => {
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString ?? "");

      setData(storedUserData);
    }
  }, [storedUserDataString]);

  const getUserById = async () => {
    if (data?.id) {
      try {
        const { data: result } = await axios.get(
          `https://localhost:7120/api/Register/${data?.id}`
        );
        setDataDetail(result.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getUserById();
  }, [data?.id]);

  const value = {
    dataDetail,
  };

  return (
    <LayoutContextProvider value={value}>
      <div className={styles.containerLayout}>
        <div className={styles.sideBar}>
          <SideBar />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </LayoutContextProvider>
  );
};

export default Layout;
