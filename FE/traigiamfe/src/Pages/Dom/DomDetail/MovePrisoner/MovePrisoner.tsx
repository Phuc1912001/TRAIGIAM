import { BedModelResponse } from "@/common/Model/bed";
import { PrisonerResponse } from "@/common/Model/prisoner";
import { RoomModelResponse } from "@/common/Model/Room";
import { InfoCircleFilled } from "@ant-design/icons";
import { Button, Divider, Form, Modal, Row, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoading } from "../../../../common/Hook/useLoading";
import { BandingEnum, IBandingMap } from "../../../../common/Model/banding";
import TextItem from "../../../../Components/TextItem/TextItem";
import styles from "./MovePrisoner.module.scss";

interface IMovePrisoner {
  isOpenModalMove: boolean;
  setIsOpenModalMove: React.Dispatch<React.SetStateAction<boolean>>;
  currentBed?: BedModelResponse;
  currentRoom?: RoomModelResponse;
  getAllRoom?: A;
  type?: string;
}

interface IOptionValue {
  label?: string;
  value?: string | number;
}

const MovePrisoner = (props: IMovePrisoner) => {
  const {
    isOpenModalMove,
    setIsOpenModalMove,
    currentRoom,
    currentBed,
    getAllRoom,
    type,
  } = props;

  const { showLoading, closeLoading } = useLoading();

  const [listPrisoner, setListPrisoner] = useState<PrisonerResponse[]>([]);
  console.log("listPrisoner", listPrisoner);

  const [optionPrisoner, setOptionPrisoner] = useState<IOptionValue[]>([]);

  console.log("type", type);

  const getAllPrisoner = async () => {
    try {
      showLoading("getAllBed");
      const model = {
        domGenderId: currentRoom?.domGenderId,
      };
      const { data } = await axios.post(
        "https://localhost:7120/api/Prisoner/getList",
        model
      );
      setListPrisoner(data.data);
      const newData = data.data.map((item: PrisonerResponse) => ({
        label: item.prisonerName,
        value: item.id,
      }));
      setOptionPrisoner(newData);
      closeLoading("getAllBed");
    } catch (error) {
      closeLoading("getAllBed");
    }
  };

  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsOpenModalMove(false);
    form.resetFields();
  };

  useEffect(() => {
    getAllPrisoner();
  }, [isOpenModalMove]);

  const filterOption = (input: string, option?: IOptionValue) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    ((option as A)?.email || "").toLowerCase().includes(input.toLowerCase());

  const handleFinish = async () => {
    const value = await form.getFieldsValue();
    try {
      showLoading("moveBed");
      const model = {
        domGenderId: currentRoom?.domGenderId,
        domId: currentRoom?.domId,
        roomId: currentRoom?.id,
        bedId: currentBed?.id,
        prisonerId: value.prisonerId,
      };

      await axios.post("https://localhost:7120/api/Prisoner/MoveBed", model);
      handleCancel();
      getAllRoom();
      closeLoading("moveBed");
    } catch (error) {
      closeLoading("moveBed");
    }
  };

  const handleOK = () => {
    form.submit();
  };

  return (
    <div>
      <Modal
        okText={"Đổi Chỗ"}
        cancelText={"Hủy"}
        visible={isOpenModalMove}
        onCancel={handleCancel}
        title={
          <div className={styles.titleModel}>
            <InfoCircleFilled className={styles.infoIcon} />
            {type === "view" ? (
              <div>Thông tin chỗ ở của phạm nhân</div>
            ) : (
              <div>Chuyển chỗ ở Phạm nhân</div>
            )}
          </div>
        }
        width={600}
        wrapClassName={styles.containerModel}
        destroyOnClose
        maskClosable={false}
        footer={
          <div>
            <Divider />
            <div className={styles.wrapperBtn}>
              <Button
                onClick={() => {
                  handleCancel();
                }}
                style={{ minWidth: 80 }}
              >
                Đóng
              </Button>
              {type === "edit" && (
                <div onClick={handleOK} className="btn-orange">
                  Đổi chỗ
                </div>
              )}
            </div>
          </div>
        }
      >
        {type === "view" ? (
          <div>
            <Divider />
            <div className={styles.wrapperPrisoner}>
              <img
                className={styles.imgPrisoner}
                src={currentBed?.prisonerBed?.imageSrc}
                alt=""
              />
              <div>
                <h3>{currentBed?.prisonerBed?.prisonerName}</h3>
                <div>{currentBed?.prisonerBed?.prisonerAge} tuổi</div>
              </div>
              <img
                className={styles.imgBanding}
                alt="banding"
                src={IBandingMap.get(
                  (currentBed?.prisonerBed?.bandingID ?? 10) as BandingEnum
                )}
              />
            </div>
            <Row style={{ height: "100%" }}>
              <TextItem label="Nhà Giam">{currentRoom?.domGenderName}</TextItem>
              <TextItem label="Khu">{currentRoom?.domName}</TextItem>
              <TextItem label="Phòng">{currentRoom?.roomName}</TextItem>
              <TextItem label="Giường">{currentBed?.bedName}</TextItem>
            </Row>
          </div>
        ) : (
          <div>
            <Divider />
            <Row style={{ height: "100%" }}>
              <TextItem label="Nhà Giam">{currentRoom?.domGenderName}</TextItem>
              <TextItem label="Khu">{currentRoom?.domName}</TextItem>
              <TextItem label="Phòng">{currentRoom?.roomName}</TextItem>
              <TextItem label="Giường">{currentBed?.bedName}</TextItem>
            </Row>
            <Form layout="vertical" form={form} onFinish={handleFinish}>
              <Form.Item
                rules={[
                  { required: true, message: "Vui lòng điền người quản lý." },
                ]}
                name="prisonerId"
                label="Chọn Phạm nhân:"
              >
                <Select
                  rootClassName={styles.emFilterSelectMultiple}
                  placeholder="Chọn Phạm nhân "
                  // loading={!ygm}
                  options={optionPrisoner}
                  filterOption={filterOption}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MovePrisoner;
