import { DomGenderModel } from "@/common/Model/domgender";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../common/Hook/useLoading";
import Header from "../../Components/Header/Header";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import CreateDomGender from "./CreateDomGender/CreateDomGender";
import styles from "./DomGender.module.scss";

const DomGender = () => {
  const items = [
    {
      title: <div>Nhà Giam</div>,
    },
    {
      title: <div>Danh Sách Nhà Giam</div>,
    },
  ];

  const [dataDomGender, setDataDomGender] = useState<DomGenderModel[]>([]);

  const [openCreateDomGender, setOpenCreateDomGender] =
    useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  console.log("isView", isView);

  const { showLoading, closeLoading } = useLoading();

  const navigate = useNavigate();

  const getAllDomGender = async () => {
    try {
      showLoading("getAllDomGender");
      const { data } = await axios.get("https://localhost:7120/api/DomGender");
      setDataDomGender(data.data);
      closeLoading("getAllDomGender");
    } catch (error) {
      closeLoading("getAllDomGender");
    }
  };

  useEffect(() => {
    getAllDomGender();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreateDomGender(true);
    setIsEdit(false);
    setReset(!reset);
  };

  const handleNavigate = (item: DomGenderModel) => {
    navigate("/gender/dom", { state: { domGender: item } });
  };

  return (
    <div>
      <div className="share-sticky">
        <Header items={items} />
      </div>
      <div className="share-sticky-mobile">
        <MobileHeader />
      </div>
      <div className={styles.wrapperContent}>
        <div className={styles.wrapperBtn}>
          <div className={"createBtn"} onClick={handleOpenCreate}>
            <PlusCircleOutlined style={{ fontSize: 18 }} />
            Tạo Nhà Giam
          </div>
          <div></div>
        </div>
        <Row>
          {dataDomGender.map((item) => {
            return (
              <Col
                sm={24}
                md={12}
                className={styles.domGender}
                onClick={() => handleNavigate(item)}
              >
                <div className={styles.item}>{item.domGenderName}</div>
              </Col>
            );
          })}
        </Row>
      </div>

      <CreateDomGender
        openCreateDomGender={openCreateDomGender}
        setOpenCreateDomGender={setOpenCreateDomGender}
        isEdit={isEdit}
        reset={reset}
        setIsView={setIsView}
        getAllDomGender={getAllDomGender}
      />
    </div>
  );
};

export default DomGender;
