import { CheckInCheckOutModel } from "@/common/Model/checkincheckout";
import { PrisonerModel } from "@/common/Model/prisoner";
import { RoleEnum } from "../../MyProfile/Role.model";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Drawer, Form, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import ModalComponent from "../../../Components/ModalDelete/ModalComponent";
import TextItem from "../../../Components/TextItem/TextItem";
import StatusExternal from "../StatusExternal/StatusExternal";
import styles from "./CreateExternal.module.scss";
import { UserModel } from "@/common/Model/user";

interface ICreateExternal {
  openCreateExternal: boolean;
  setOpenCreateExternal: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  recall: boolean;
  setRecall: React.Dispatch<React.SetStateAction<boolean>>;
  reset: boolean;
  currentRecord?: CheckInCheckOutModel;
  isView?: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IOptionValue {
  label?: string;
  value?: string | number;
}

const CreateExternal = (props: ICreateExternal) => {
  const {
    openCreateExternal,
    setOpenCreateExternal,
    isEdit,
    recall,
    setRecall,
    reset,
    currentRecord,
    isView,
    setIsView,
  } = props;

  const [form] = useForm();
  const notification = useNotification();
  const { showLoading, closeLoading } = useLoading();
  const [dataPrisoner, setDataPrisoner] = useState<PrisonerModel[]>([]);
  const [optionPrisoner, setOptionPrisoner] = useState<IOptionValue[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<UserModel>();

  const [data, setData] = useState<any>();

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

  const handleGetAllPrisoner = async () => {
    try {
      showLoading("getAllPrisoner");
      const { data } = await axios.get(
        "https://localhost:7120/api/Prisoner/getFullList"
      );
      setDataPrisoner(data.data);
      let newData = data.data.map((item: PrisonerModel) => ({
        label: item.prisonerName,
        value: item.id,
      }));
      setOptionPrisoner(newData);
      closeLoading("getAllPrisoner");
    } catch (error) {
      closeLoading("getAllPrisoner");
    }
  };

  useEffect(() => {
    handleGetAllPrisoner();
  }, [openCreateExternal]);

  const onClose = () => {
    setOpenCreateExternal(false);
    setIsView(false);
  };

  const handleOnFinish = async () => {
    try {
      showLoading("createExternal");
      const value = await form.getFieldsValue();
      await form.validateFields();

      const currentDateTime = dayjs();

      const model: CheckInCheckOutModel = {
        ...value,
        startDate: dayjs(value.startDate).format(),
        endDate: dayjs(value.endDate).format(),
        createdBy: data.id,
      };

      await axios.post("https://localhost:7120/api/External", model);
      notification.success(<div>Tạo phiếu ra vào thành công.</div>);
      setOpenCreateExternal(false);
      setRecall(!recall);
      closeLoading("createExternal");
    } catch (error) {
      closeLoading("createExternal");
    }
  };

  const handleOnEdit = async () => {
    try {
      showLoading("editExternal");
      const value = await form.getFieldsValue();
      await form.validateFields();
      const currentDateTime = dayjs();

      const model: CheckInCheckOutModel = {
        ...value,
        startDate: dayjs(value.startDate).format(),
        endDate: dayjs(value.endDate).format(),
        createdBy: data.id,
        id: currentRecord?.id,
      };
      await axios.put(
        `https://localhost:7120/api/External/${currentRecord?.id}`,
        model
      );
      notification.success(<div>Sửa phiếu ra vào thành công.</div>);
      setOpenCreateExternal(false);
      setRecall(!recall);
      closeLoading("editExternal");
    } catch (error) {
      closeLoading("editExternal");
    }
  };

  const handleConfirm = async () => {
    try {
      showLoading("confirmExternal");
      const model = {
        userId: data.id,
      };
      await axios.put(
        `https://localhost:7120/api/External/${currentRecord?.id}/confirm`,
        model
      );
      notification.success(<div>Cặp nhập thành công.</div>);
      setOpenCreateExternal(false);
      setRecall(!recall);
      setIsOpenModal(false);
      closeLoading("confirmExternal");
    } catch (error) {
      closeLoading("confirmExternal");
    }
  };

  const renderBtn = (status: number) => {
    switch (status) {
      case 0:
        return (
          (dataUser?.role === RoleEnum.truongTrai ||
            dataUser?.role === RoleEnum.giamThi) && (
            <div onClick={handleOpenModel} className="btn-orange">
              Chấp Nhận
            </div>
          )
        );
      case 1:
        return (
          <div onClick={handleOpenModel} className="btn-orange">
            Ra Ngoài
          </div>
        );
      case 2:
        return (
          <div onClick={handleOpenModel} className="btn-orange">
            Vào Trong
          </div>
        );
      default:
        break;
    }
  };

  const renderBtnConfirm = (status: number) => {
    switch (status) {
      case 0:
        return "Chấp Nhận";
      case 1:
        return "Ra Ngoài";
      case 2:
        return "Vào Trong";
      default:
        break;
    }
  };

  const renderContent = (status: number) => {
    switch (status) {
      case 0:
        return (
          <div>
            Bạn có chấp nhận cho phạm nhân{" "}
            <span style={{ fontWeight: "600" }}>
              {currentRecord?.prisonerName}
            </span>{" "}
            ra ngoài.
          </div>
        );
      case 1:
        return (
          <div>
            Nhân nút ra ngoài để phạm nhân{" "}
            <span style={{ fontWeight: "600" }}>
              {currentRecord?.prisonerName}
            </span>{" "}
            hoàn thành xác nhận ra ngoài.
          </div>
        );
      case 2:
        return (
          <div>
            Nhân nút vào trong để xác nhận phạm nhân{" "}
            <span style={{ fontWeight: "600" }}>
              {currentRecord?.prisonerName}
            </span>{" "}
            đã trở lại.
          </div>
        );
      default:
        break;
    }
  };

  const handleOpenModel = () => {
    setIsOpenModal(true);
  };

  const filterDrawFooterView = (
    <div className={styles.wrapperBtn}>
      <Button
        onClick={() => {
          onClose();
        }}
        style={{ minWidth: 80 }}
      >
        Đóng
      </Button>
      <div onClick={handleOnFinish} className="btn-orange">
        Tạo Ra Vào
      </div>
    </div>
  );

  const filterDrawFooter = (
    <div className={styles.wrapperBtn}>
      <Button
        onClick={() => {
          onClose();
        }}
        style={{ minWidth: 80 }}
      >
        Đóng
      </Button>
      <div onClick={handleOnEdit} className="btn-orange">
        Sửa Ra Vào
      </div>
    </div>
  );

  const footerOnlyView = (
    <div className={styles.wrapperBtn}>
      <Button
        onClick={() => {
          onClose();
        }}
        style={{ minWidth: 80 }}
      >
        Đóng
      </Button>
      {currentRecord?.status !== 3 && (
        <div>{renderBtn(currentRecord?.status ?? 0)}</div>
      )}
    </div>
  );

  const filterOption = (input: string, option?: IOptionValue) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    ((option as any)?.email || "").toLowerCase().includes(input.toLowerCase());

  const optionEMType = [
    { label: "Nhập Viện", value: 1 },
    { label: "Ra Tòa", value: 2 },
    { label: "Đi Điều Tra", value: 3 },
  ];

  const genderEMType = (emtype: number) => {
    switch (emtype) {
      case 1:
        return <div>Nhập Viện</div>;
      case 2:
        return <div>Ra Tòa</div>;
      case 3:
        return <div>Đi Điều Tra</div>;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isEdit) {
      const formatData = {
        ...currentRecord,
        startDate: dayjs(currentRecord?.startDate),
        endDate: dayjs(currentRecord?.endDate),
      };
      form.setFieldsValue(formatData);
    } else {
      form.resetFields();
    }
  }, [isEdit, reset]);

  return (
    <div>
      <Drawer
        title={
          isView ? "Chi tiết Ra vào" : isEdit ? "Sửa Ra vào" : "Tạo Ra vào"
        }
        open={openCreateExternal}
        placement="right"
        closable={false}
        rootClassName={styles.EditInfringement}
        extra={<CloseOutlined onClick={onClose} />}
        width={620}
        footer={
          isView
            ? footerOnlyView
            : isEdit
            ? filterDrawFooter
            : filterDrawFooterView
        }
        destroyOnClose
        contentWrapperStyle={{ maxWidth: "calc(100vw - 32px)" }}
      >
        {isView ? (
          <div>
            <Row style={{ height: "100%" }}>
              <TextItem label="Tên Phạm Nhân">
                {currentRecord?.prisonerName}
              </TextItem>
              <TextItem label="Loại Phiếu Ra vào">
                {genderEMType(currentRecord?.emtype ?? 1)}
              </TextItem>
              <TextItem label="Ngày Bắt Đầu">
                {dayjs(currentRecord?.startDate).format("DD-MM-YYYY")}
              </TextItem>
              <TextItem label="Ngày Kết Thúc">
                {dayjs(currentRecord?.endDate).format("DD-MM-YYYY")}
              </TextItem>
              <TextItem label="Tạo Bởi">
                {currentRecord?.createdByName}
              </TextItem>
              <TextItem label="Chấp Nhận Bởi">
                {currentRecord?.modifiedByName ?? "N/A"}
              </TextItem>
            </Row>
            <TextItem
              textItemProps={{ isCol: true, spanNumber: 24 }}
              label="Lý Do"
            >
              {currentRecord?.desc}
            </TextItem>
            <TextItem
              textItemProps={{ isCol: true, spanNumber: 24 }}
              label="Trạng Thái"
            >
              <StatusExternal status={currentRecord?.status} />
            </TextItem>
          </div>
        ) : (
          <Form layout="vertical" form={form}>
            <Form.Item
              rules={[{ required: true, message: "Vui lòng điền phạm nhân." }]}
              name="prisonerId"
              label="Phạm Nhân:"
            >
              <Select
                rootClassName={styles.emFilterSelectMultiple}
                placeholder="Chọn phạm nhân"
                // loading={!ygm}
                options={optionPrisoner}
                filterOption={filterOption}
              />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền loại thăm khám.",
                },
              ]}
              name="emtype"
              label="Loại ra vào:"
            >
              <Select
                rootClassName={styles.emFilterSelectMultiple}
                placeholder="Chọn loại ra vào"
                // loading={!ygm}
                options={optionEMType}
                filterOption={filterOption}
              />
            </Form.Item>

            <Form.Item
              rules={[{ required: true, message: "Vui lòng điền Lý do." }]}
              name="desc"
              label="Lý Do:"
            >
              <TextArea />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Ngày Bắt đầu"
              required
              rules={[{ required: true, message: "This field is required." }]}
              rootClassName={styles.dateLabel}
            >
              <DatePicker
                format="DD MMM YYYY"
                inputReadOnly={true}
                placeholder="Select a date"
                showTime
                showHour
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              required
              rules={[{ required: true, message: "This field is required." }]}
              rootClassName={styles.dateLabel}
            >
              <DatePicker
                format="DD MMM YYYY"
                inputReadOnly={true}
                placeholder="Select a date"
                showTime
                showHour
              />
            </Form.Item>
          </Form>
        )}
      </Drawer>

      <ModalComponent
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        handleDelete={handleConfirm}
        title="Xác Nhận Phiếu ra vào"
        textConfirm={renderBtnConfirm(currentRecord?.status ?? 0)}
      >
        <div>{renderContent(currentRecord?.status ?? 0)}</div>
      </ModalComponent>
    </div>
  );
};

export default CreateExternal;
