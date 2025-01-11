import { DomModel } from "@/common/Model/dom";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import Header from "../../Components/Header/Header";
import MobileHeader from "../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../Components/ModalDelete/ModalComponent";
import CreateDom from "./CreateDom/CreateDom";
import styles from "./Dom.module.scss";

const Dom = () => {
  const navigate = useNavigate();

  const handleNavigateToList = () => {
    navigate("/gender");
  };

  const items = [
    {
      title: <div>Nhà Giam</div>,
    },
    {
      title: (
        <div className={styles.breacrumb} onClick={handleNavigateToList}>
          Danh Sách Nhà Giam
        </div>
      ),
    },
    {
      title: <div>Danh Sách Khu</div>,
    },
  ];

  const [dataDom, setDataDom] = useState<DomModel[]>([]);

  const [openCreateDom, setOpenCreateDom] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);

  const [recall, setRecall] = useState<boolean>(false);
  const [currentRecord, setCurentRecord] = useState<DomModel>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();

  const { state } = useLocation();

  const handleOpenCreate = () => {
    setOpenCreateDom(true);
    setIsEdit(false);
    setIsView(false);
    setReset(!reset);
  };

  const getAllDom = async () => {
    try {
      showLoading("getAllDom");
      const model: A = {
        domGenderId: state?.domGender?.id ?? 0,
      };
      const { data } = await axios.post(
        `https://localhost:7120/api/Dom/AllDom`,
        model
      );
      setDataDom(data.data);
      closeLoading("getAllDom");
    } catch (error) {
      closeLoading("getAllDom");
    }
  };
  useEffect(() => {
    getAllDom();
  }, []);

  useEffect(() => {
    getAllDom();
  }, [recall]);

  const handleOpenEdit = (record: DomModel, e: A) => {
    e.stopPropagation();
    setOpenCreateDom(true);
    setIsEdit(true);
    setCurentRecord(record);
    setReset(!reset);
  };

  const handleOpenDelete = (record: DomModel, e: A) => {
    e.stopPropagation();
    setIsOpenModal(true);
    setCurentRecord(record);
  };

  const handleDeleteDom = async () => {
    try {
      showLoading("deletePunish");
      await axios.delete(`https://localhost:7120/api/Dom/${currentRecord?.id}`);
      getAllDom();
      setIsOpenModal(false);
      notification.success(<div>Xóa Khu Thành Công.</div>);
      closeLoading("deletePunish");
    } catch (error) {
      setIsOpenModal(true);
      closeLoading("deletePunish");
    }
  };

  const handleNavigate = (record: DomModel) => {
    navigate(`/gender/dom/${record?.id}`, {
      state: {
        domName: record.domName,
        idDom: record.id,
        domGenderId: record.domGenderId,
        domGenderName: record.domGenderName,
      },
    });
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
            Tạo Khu
          </div>
          <div></div>
        </div>
        <div>
          {dataDom.map((item: DomModel) => {
            return (
              <div
                key={item?.id}
                className={styles.wrapperDom}
                onClick={() => handleNavigate(item)}
              >
                <div className={styles.nameDom}>{item.domName}</div>
                <div className={styles.wrapperAction}>
                  <div
                    className={"editBtn"}
                    onClick={(e) => handleOpenEdit(item, e)}
                  >
                    <EditOutlined style={{ fontSize: 18 }} />
                  </div>
                  <div
                    className={"editBtn"}
                    onClick={(e) => handleOpenDelete(item, e)}
                  >
                    <DeleteOutlined style={{ fontSize: 18 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateDom
        openCreateDom={openCreateDom}
        setOpenCreateDom={setOpenCreateDom}
        isEdit={isEdit}
        currentRecord={currentRecord}
        setRecall={setRecall}
        recall={recall}
        reset={reset}
        isView={isView}
        setIsView={setIsView}
      />

      <ModalComponent
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        handleDelete={handleDeleteDom}
        title="Xác Nhận Xóa Khu"
        textConfirm="Xóa Khu"
      >
        <div>{`Bạn có muốn xóa ${currentRecord?.domName}`}</div>
      </ModalComponent>
    </div>
  );
};

export default Dom;
