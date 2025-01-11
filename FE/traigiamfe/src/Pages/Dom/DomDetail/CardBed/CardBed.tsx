import { BedModel } from "@/common/Model/bed";
import { RoomModel } from "@/common/Model/Room";
import { PlusOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useLoading } from "../../../../common/Hook/useLoading";
import styles from "./CardBed.module.scss";

interface ICardBed {
  setOpenCreateBed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditBed: React.Dispatch<React.SetStateAction<boolean>>;
  setResetBed: React.Dispatch<React.SetStateAction<boolean>>;
  setRecallBed: React.Dispatch<React.SetStateAction<boolean>>;
  resetBed: boolean;
  setCurentRoom: React.Dispatch<React.SetStateAction<A>>;
  item?: RoomModel;
  setDataBed: React.Dispatch<React.SetStateAction<A>>;
  dataBed: BedModel[];
  recallBed: boolean;
}

const CardBed = (props: ICardBed) => {
  const {
    setOpenCreateBed,
    setIsEditBed,
    setResetBed,
    resetBed,
    setCurentRoom,
    item,
    setDataBed,
    dataBed,
    recallBed,
  } = props;

  const { showLoading, closeLoading } = useLoading();

  const handleOpenCreateBed = (item: RoomModel) => {
    setOpenCreateBed(true);
    setIsEditBed(false);
    setResetBed(!resetBed);
    setCurentRoom(item);
  };
  console.log("dataBed", dataBed);

  const getAllBed = async () => {
    try {
      showLoading("getAllBed");
      const model = {
        domId: item?.domId,
        roomId: item?.id,
      };
      const { data } = await axios.post(
        "https://localhost:7120/api/Bed/AllBed",
        model
      );
      setDataBed(data.data);
      closeLoading("getAllBed");
    } catch (error) {
      closeLoading("getAllBed");
    }
  };

  useEffect(() => {
    getAllBed();
  }, []);

  useEffect(() => {
    getAllBed();
  }, [recallBed]);
  return (
    <div>
      <Row gutter={[12, 12]}>
        {dataBed.map((item) => {
          return (
            <Col sm={8} md={4}>
              <div className={styles.bedRoom}>
                <div></div>
                <div>{item.bedName}</div>
              </div>
            </Col>
          );
        })}

        <Col sm={8} md={4} onClick={() => handleOpenCreateBed(item ?? {})}>
          <div className={styles.btnBedRoom}>
            <PlusOutlined />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CardBed;
