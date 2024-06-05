import { PrisonerResponse } from "@/common/Model/prisoner";
import { Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../../common/Hook/useLoading";
import Header from "../../../Components/Header/Header";
import MobileHeader from "../../../Components/MobileHeader/MobileHeader";
import TextItem from "../../../Components/TextItem/TextItem";
import styles from "./PrisonerDetail.module.scss";
import PrisonerExternal from "./PrisonerExternal/PrisonerExternal";
import PrisonerInfringement from "./PrisonerInfringement/PrisonerInfringement";
import PrisonerVisit from "./PrisonerVisit/PrisonerVisit";

const PrisonerDetail = () => {
  const navigate = useNavigate();
  const handleNavigateToList = () => {
    navigate("/");
  };
  const { showLoading, closeLoading } = useLoading();

  const items = [
    {
      title: <div>Phạm Nhân</div>,
    },
    {
      title: (
        <div className={styles.breacrumb} onClick={handleNavigateToList}>
          Danh Sách Phạm Nhân
        </div>
      ),
    },
    {
      title: <div>Chi Tiết Phạm Nhân</div>,
    },
  ];

  const { id } = useParams();
  const [dataDetail, setDataDetail] = useState<PrisonerResponse>();

  const handelGetDetail = async () => {
    try {
      showLoading("detailPrisoner");
      const { data } = await axios.get(
        `https://localhost:7120/api/Prisoner/${id}`
      );
      setDataDetail(data.data);
      closeLoading("detailPrisoner");
    } catch (error) {
      closeLoading("detailPrisoner");
    }
  };
  useEffect(() => {
    handelGetDetail();
  }, [id]);

  return (
    <div>
      <div className="share-sticky">
        <Header items={items} />
      </div>
      <div className="share-sticky-mobile">
        <MobileHeader />
      </div>
      <div className={styles.containerDetail}>
        <h2>Chi Tiết Phạm Nhân</h2>
        <div className={styles.wrapperInfor}>
          <div>
            <img className={styles.avatar} src={dataDetail?.imageSrc} alt="" />
          </div>
          <div>
            <h3>{dataDetail?.prisonerName}</h3>
            <div className={styles.age}>{dataDetail?.prisonerAge} age</div>
          </div>
        </div>
        <Row style={{ height: "100%" }}>
          <TextItem label="Mã Phạm Nhân">{dataDetail?.mpn}</TextItem>
          <TextItem label="Giới Tính">{dataDetail?.prisonerSex}</TextItem>
          <TextItem label="Căn Cước Công Dân">{dataDetail?.cccd}</TextItem>
          <TextItem label="Quê Quán">{dataDetail?.countryside}</TextItem>
          <TextItem label="Số Phòng">{dataDetail?.domId}</TextItem>
          <TextItem label="Số Giường">{dataDetail?.bedId}</TextItem>
          <TextItem label="Tội Danh">{dataDetail?.crime}</TextItem>
          <TextItem label="Số Năm">{dataDetail?.years}</TextItem>
          <TextItem label="Người Quản Lý">{dataDetail?.mananger}</TextItem>
        </Row>

        <h3 className={styles.titleHistory}>Lịch Sử Ra Vào :</h3>
        <PrisonerExternal dataExternal={dataDetail?.listExternal} />

        <h3 className={styles.titleHistory}>Lịch Sử Thăm Khám :</h3>
        <PrisonerVisit dataVisit={dataDetail?.listVisit} />

        <h3 className={styles.titleHistory}>Lịch Sử Vi Phạm :</h3>
        <PrisonerInfringement dataInfringement={dataDetail?.listInfringement} />
      </div>
    </div>
  );
};

export default PrisonerDetail;
