import { useNotification } from "../../../common/Hook/useNotification";
import { InfringementResponse } from "@/common/Model/infringement";
import { PrisonerResponse } from "@/common/Model/prisoner";
import { StatmentModel } from "@/common/Model/statement";
import { Button, Row } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../common/Hook/useLoading";
import { BandingEnum, IBandingMap } from "../../../common/Model/banding";
import Header from "../../../Components/Header/Header";
import MobileHeader from "../../../Components/MobileHeader/MobileHeader";
import ModalComponent from "../../../Components/ModalDelete/ModalComponent";
import TextItem from "../../../Components/TextItem/TextItem";
import StatusStatement from "../../Statement/StatusStatement/StatusStatement";
import StatusInfringement from "../StatusInfringement/StatusInfringement";
import styles from "./InfringementDetail.module.scss";
import { UserModel } from "@/common/Model/user";
import { RoleEnum } from "../../MyProfile/Role.model";
import DetailStatement from "../DetailStatement/DetailStatement";

const InfringementDetail = () => {
  const navigate = useNavigate();
  const handleNavigateToList = () => {
    navigate("/infringement");
  };
  const { showLoading, closeLoading } = useLoading();
  const [openModel, setOpenModel] = useState<boolean>(false);
  const notification = useNotification();
  const [data, setData] = useState<A>();
  const storedUserDataString = localStorage.getItem("userData");
  const [dataUser, setDataUser] = useState<UserModel>();

  const [currentStatement, setCurrentStatement] = useState<StatmentModel>({});
  const [openStatement, setOpenStatement] = useState<boolean>(false);

  console.log("currentStatement", currentStatement);

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
        setDataUser(result.data);
        closeLoading("getUser");
      } catch (error) {
        closeLoading("getUser");
      }
    }
  };

  useEffect(() => {
    getUserById();
  }, [data?.id]);

  const items = [
    {
      title: <div>Vi Phạm</div>,
    },
    {
      title: (
        <div className={styles.breacrumb} onClick={handleNavigateToList}>
          Danh Sách Vi Phạm
        </div>
      ),
    },
    {
      title: <div>Chi Tiết Vi Phạm</div>,
    },
  ];

  const { id } = useParams();
  const [dataDetail, setDataDetail] = useState<InfringementResponse>();

  const handelGetDetail = async () => {
    try {
      showLoading("detailIR");
      const { data } = await axios.get(
        `https://localhost:7120/api/infringement/${id}`
      );
      setDataDetail(data.data);
      closeLoading("detailIR");
    } catch (error) {
      closeLoading("detailIR");
    }
  };
  useEffect(() => {
    handelGetDetail();
  }, [id]);

  const handleNavigate = (record: PrisonerResponse) => {
    navigate(`/prisoner/${record.id}`);
  };

  const handleToView = (record: StatmentModel) => {
    console.log("record", record);
    setCurrentStatement(record);
    setOpenStatement(true);
  };

  const handleCancel = () => {
    navigate(`/infringement`);
  };

  const handleOnFinish = () => {
    setOpenModel(true);
  };

  const handleConfirm = async () => {
    try {
      showLoading("ConfirmVisit");
      const model = {
        userId: data.id,
      };
      await axios.put(
        `https://localhost:7120/api/Infringement/${dataDetail?.id}/confirm`,
        model
      );
      handelGetDetail();
      setOpenModel(false);
      notification.success(<div>Cặp nhập thành công.</div>);
      closeLoading("ConfirmVisit");
    } catch (error) {
      closeLoading("ConfirmVisit");
    }
  };

  const columns: ColumnsType<StatmentModel> = [
    {
      title: "Tên Phạm Nhân",
      dataIndex: "prisonerName",
      key: "prisonerName",
      render: (_, record) => {
        return (
          <div
            style={{ cursor: "pointer", fontWeight: 600 }}
            onClick={() => handleToView(record)}
            className={styles.name}
          >
            {record.prisonerName}
          </div>
        );
      },
    },
    {
      title: "Tên Vi Phạm",
      dataIndex: "irName",
      key: "irName",
      render: (_, record) => {
        return (
          <div onClick={() => handleNavigate(record)} className={styles.irName}>
            {record.irName}
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return (
          <div>
            <StatusStatement status={record?.status ?? 0} />
          </div>
        );
      },
    },
    // {
    //     title: "Hoạt Động",
    //     dataIndex: "action",
    //     key: "action",
    //     render: (_, record) => (
    //         record.status === 0 &&
    //         <div className={styles.wrapperAction} >
    //             <div className={"editBtn"} onClick={() => handleOpenEdit(record)}>
    //                 <EditOutlined style={{ fontSize: 18 }} />
    //             </div>
    //             <div className={"editBtn"} onClick={() => handleOpenDelete(record)}>
    //                 <DeleteOutlined style={{ fontSize: 18 }} />
    //             </div>
    //         </div >
    //     ),
    // },
  ];

  const renderRivese = (revise: number) => {
    switch (revise) {
      case 1:
        return "Nghiêm trọng";
      case 2:
        return "Lớn";
      case 3:
        return "Nhỏ";
      default:
        break;
    }
  };

  return (
    <div>
      <div className="share-sticky">
        <Header items={items} />
      </div>
      <div className="share-sticky-mobile">
        <MobileHeader />
      </div>

      <div className={styles.containerDetail}>
        <h2>Chi Tiết Vi Phạm</h2>

        <Row style={{ height: "100%", marginTop: "40px" }}>
          <TextItem label="Mã Vi Phạm">{dataDetail?.mvp}</TextItem>
          <TextItem label="Trạng Thái">
            <StatusInfringement status={dataDetail?.status} />
          </TextItem>
          <TextItem label="Tên Vi Phạm">{dataDetail?.nameIR}</TextItem>
          <TextItem label="Địa Điểm">{dataDetail?.location}</TextItem>
          <TextItem label="Mức Độ">
            {renderRivese(dataDetail?.rivise ?? 1)}
          </TextItem>
          <TextItem label="Hình Phạt">{dataDetail?.punishName}</TextItem>
          <TextItem label="Thời gian">
            {dayjs(dataDetail?.timeInfringement).format("DD MM YYYY")}
          </TextItem>
          <TextItem label="Tạo Bởi">{dataDetail?.createdByName}</TextItem>
          <TextItem label="Cập Nhập Bởi">
            {dataDetail?.modifiedByName ?? "N/A"}
          </TextItem>
        </Row>

        <div className={styles.containerPrisoner}>
          <div className={styles.title}>
            <h3>Danh sách phạm nhân :</h3>
          </div>

          {dataDetail?.listPrisonerStatement?.map((item: PrisonerResponse) => (
            <div>
              <div key={item.id} className={styles.containerCard}>
                <div className={styles.wrapperInfor}>
                  <div className={styles.containerInfor}>
                    <div>
                      <img
                        className={styles.avatar}
                        src={item.imageSrc}
                        alt="Avatar"
                      />
                    </div>
                    <div>
                      <div className={styles.name}>{item.prisonerName}</div>
                      <div>{`${item.prisonerAge} tuổi`}</div>{" "}
                      {/* Assuming item has an age field */}
                    </div>
                  </div>
                  <img
                    alt="banding"
                    src={IBandingMap.get(
                      (item?.bandingID ?? 10) as BandingEnum
                    )}
                  />
                </div>
              </div>
              <div className={styles.expandCard}>
                <div className={styles.title}>Lời Khai: </div>
                <Table
                  columns={columns}
                  dataSource={
                    Array.isArray(item?.listStatement) ? item.listStatement : []
                  }
                  className={`${styles.prisonerTable} share-border-table`}
                  tableLayout="auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {dataDetail?.status !== 2 && (
        <div className="share-stickyBot">
          <div className={styles.footer}>
            <div className={styles.wrapperBtn}>
              <Button
                onClick={() => {
                  handleCancel();
                }}
                style={{ minWidth: 80 }}
              >
                Đóng
              </Button>
              {dataDetail?.status === 0 ? (
                <div>
                  {(dataUser?.role === RoleEnum.truongTrai ||
                    dataUser?.role === RoleEnum.giamThi) && (
                    <div onClick={handleOnFinish} className="btn-orange">
                      Xác Nhận
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {dataDetail?.status === 1 &&
                    dataUser?.role === RoleEnum.truongTrai && (
                      <div onClick={handleOnFinish} className="btn-orange">
                        Xác Nhận
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ModalComponent
        isOpenModal={openModel}
        setIsOpenModal={setOpenModel}
        handleDelete={handleConfirm}
        title="Xác nhận vi phạm"
        textConfirm="Xác Nhận Vi Phạm"
      >
        <div>
          Bạn có muốn xác nhận vi phạm
          <span> {dataDetail?.mvp}</span>.
        </div>
      </ModalComponent>
      <DetailStatement
        openStatement={openStatement}
        setOpenStatement={setOpenStatement}
        currentStatement={currentStatement}
      />
    </div>
  );
};

export default InfringementDetail;
