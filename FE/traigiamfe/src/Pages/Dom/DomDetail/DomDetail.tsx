import { BedModel, BedModelResponse } from "@/common/Model/bed";
import { RoomModel, RoomModelResponse } from "@/common/Model/Room";
import {
  DeleteOutlined,
  EditOutlined,
  ExpandOutlined,
  InfoCircleFilled,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Col, Form, Modal, Popover, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import Header from "../../../Components/Header/Header";
import MobileHeader from "../../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../../Components/ModalDelete/ModalComponent";
import CreateBed from "./CreateBed/CreateBed";
import CreateRoom from "./CreateRoom/CreateRoom";
import styles from "./DomDetail.module.scss";
import MovePrisoner from "./MovePrisoner/MovePrisoner";

const DomDetail = () => {
  const navigate = useNavigate();
  const handleNavigateToList = () => {
    navigate("/gender/dom");
  };
  const { state } = useLocation();

  const handleNavigateToDom = () => {
    navigate("/gender/dom", {
      state: { domGender: { id: state.domGenderId } },
    });
  };

  const items = [
    {
      title: <div>Nhà Giam</div>,
    },
    {
      title: (
        <div className={styles.breacrumb} onClick={handleNavigateToDom}>
          Danh Sách Nhà Giam
        </div>
      ),
    },
    {
      title: (
        <div className={styles.breacrumb} onClick={handleNavigateToDom}>
          Danh Sách Khu
        </div>
      ),
    },
    {
      title: <div>{state.domName}</div>,
    },
  ];

  const [dataRoom, setDataRoom] = useState<RoomModel[]>([]);

  const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
  const [isEditRoom, setIsEditRoom] = useState<boolean>(false);

  const [resetRoom, setResetRoom] = useState<boolean>(false);

  const [recallRoom, setRecallRoom] = useState<boolean>(false);
  const [currentRecordRoom, setCurentRecordRoom] = useState<RoomModel>();
  const [isOpenModalRoom, setIsOpenModalRoom] = useState<boolean>(false);

  const [dataBed, setDataBed] = useState<BedModel[]>([]);

  const [openCreateBed, setOpenCreateBed] = useState<boolean>(false);
  const [isEditBed, setIsEditBed] = useState<boolean>(false);

  const [resetBed, setResetBed] = useState<boolean>(false);

  const [recallBed, setRecallBed] = useState<boolean>(false);
  const [currentRecordBed, setCurentRecordBed] = useState<BedModel>();
  const [isOpenModalBed, setIsOpenModalBed] = useState<boolean>(false);
  const [currentRoom, setCurentRoom] = useState<RoomModel>();

  const [currentBed, setCurrentBed] = useState<BedModelResponse>();

  const [isOpenModalMove, setIsOpenModalMove] = useState<boolean>(false);
  const [type, setType] = useState<string>("view");

  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();

  const getAllRoom = async () => {
    try {
      showLoading("getAllRoom");
      const model = {
        domId: state.idDom,
        domGenderId: state.domGenderId,
      };
      const { data } = await axios.post(
        "https://localhost:7120/api/Room/AllRoom",
        model
      );
      setDataRoom(data.data);
      closeLoading("getAllRoom");
    } catch (error) {
      closeLoading("getAllRoom");
    }
  };

  useEffect(() => {
    getAllRoom();
  }, []);

  useEffect(() => {
    getAllRoom();
  }, [recallRoom]);

  const handleOpenCreate = () => {
    setOpenCreateRoom(true);
    setIsEditRoom(false);
    setResetRoom(!resetRoom);
  };

  const handleOpenEdit = (record: RoomModel) => {
    setOpenCreateRoom(true);
    setIsEditRoom(true);
    setCurentRecordRoom(record);
    setResetRoom(!resetRoom);
  };

  const handleOpenDelete = (record: RoomModel) => {
    setIsOpenModalRoom(true);
    setCurentRecordRoom(record);
  };

  const handleDeletePrisoner = async () => {
    try {
      showLoading("deleteRoom");
      await axios.delete(
        `https://localhost:7120/api/Room/${currentRecordRoom?.id}`
      );
      getAllRoom();
      setIsOpenModalRoom(false);
      notification.success(<div>Xóa Phòng Thành Công.</div>);
      closeLoading("deleteRoom");
    } catch (error) {
      setIsOpenModalRoom(true);
      closeLoading("deleteRoom");
    }
  };

  const handleOpenCreateBed = (item: RoomModel) => {
    setOpenCreateBed(true);
    setIsEditBed(false);
    setResetBed(!resetBed);
    setCurentRoom(item);
  };

  const handleMovePrisoner = (
    bed: BedModelResponse,
    item: RoomModelResponse
  ) => {
    setIsOpenModalMove(true);
    setCurrentBed(bed);
    setCurentRoom(item);
    setType("edit");
  };

  const handleViewBed = (bed: BedModelResponse, item: RoomModelResponse) => {
    setCurrentBed(bed);
    setType("view");
    setCurentRoom(item);
    setIsOpenModalMove(true);
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
            Tạo Phòng
          </div>
        </div>
        <div>
          <Row gutter={[24, 24]}>
            {dataRoom.map((item: RoomModelResponse) => {
              const content = (
                <div className={styles.contentPopup}>
                  <div
                    className={styles.itemPopup}
                    onClick={() => handleOpenEdit(item)}
                  >
                    <div>
                      <EditOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>Sửa</div>
                  </div>
                  <div
                    className={styles.itemPopup}
                    onClick={() => handleOpenDelete(item)}
                  >
                    <div>
                      <DeleteOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>Xóa</div>
                  </div>
                </div>
              );

              return (
                <Col sm={12} key={item.id}>
                  <div className={styles.wrapperRoom}>
                    <div className={styles.headRoom}>
                      <h3>{item.roomName}</h3>

                      <Popover placement="topLeft" content={content}>
                        <div className={styles.icon}>
                          <MoreOutlined
                            style={{ fontSize: 20, fontWeight: 600 }}
                          />
                        </div>
                      </Popover>
                    </div>

                    <Row gutter={[12, 12]}>
                      {item?.listBed?.map((bed) => {
                        return (
                          <Col sm={8} md={4}>
                            <div className={styles.bedRoom}>
                              {bed?.prisonerBed?.imageSrc ? (
                                <div
                                  className={styles.bedInfo}
                                  onClick={() => handleViewBed(bed, item)}
                                >
                                  <img
                                    style={{
                                      width: "100%",
                                      objectFit: "cover",
                                    }}
                                    src={bed?.prisonerBed?.imageSrc}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div
                                  className={styles.bedInfo}
                                  onClick={() => handleMovePrisoner(bed, item)}
                                >
                                  <ExpandOutlined style={{ fontSize: 18 }} />
                                </div>
                              )}
                            </div>
                            <div className={styles.bedName}>{bed.bedName}</div>
                          </Col>
                        );
                      })}
                      <Col
                        sm={8}
                        md={4}
                        onClick={() => handleOpenCreateBed(item ?? {})}
                      >
                        <div className={styles.btnBedRoom}>
                          <PlusOutlined />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
      <CreateRoom
        openCreateRoom={openCreateRoom}
        setOpenCreateRoom={setOpenCreateRoom}
        isEditRoom={isEditRoom}
        recallRoom={recallRoom}
        setRecallRoom={setRecallRoom}
        resetRoom={resetRoom}
        currentRecordRoom={currentRecordRoom}
      />

      <CreateBed
        openCreateBed={openCreateBed}
        setOpenCreateBed={setOpenCreateBed}
        isEditBed={isEditBed}
        recallBed={recallBed}
        setRecallBed={setRecallBed}
        recallRoom={recallRoom}
        setRecallRoom={setRecallRoom}
        resetBed={resetBed}
        currentRecordBed={currentRecordBed}
        currentRoom={currentRoom}
      />

      <ModalComponent
        isOpenModal={isOpenModalRoom}
        setIsOpenModal={setIsOpenModalRoom}
        handleDelete={handleDeletePrisoner}
        title="Xác Nhận Xóa Phòng"
        textConfirm="Xóa Phòng"
      >
        <div>{`Bạn có muốn xóa ${currentRecordRoom?.roomName}`}</div>
      </ModalComponent>

      <MovePrisoner
        isOpenModalMove={isOpenModalMove}
        setIsOpenModalMove={setIsOpenModalMove}
        currentBed={currentBed}
        currentRoom={currentRoom}
        getAllRoom={getAllRoom}
        type={type}
      />
    </div>
  );
};

export default DomDetail;
