import { PrisonerModel } from "@/common/Model/prisoner";
import { UserModel } from "@/common/Model/user";
import { VisitModel } from "@/common/Model/visit";
import { CloseOutlined } from "@ant-design/icons";
import { Button, DatePicker, Drawer, Form, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import ModalComponent from "../../../Components/ModalDelete/ModalComponent";
import TextItem from "../../../Components/TextItem/TextItem";
import { RoleEnum } from "../../MyProfile/Role.model";
import StatusVisit from "../StatusVisit/StatusVisit";
import { VisitType } from "../visit.model";
import styles from "./CreateVisit.module.scss";

interface ICreateVisit {
  openCreateVisit: boolean;
  setOpenCreateVisit: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  recall: boolean;
  setRecall: React.Dispatch<React.SetStateAction<boolean>>;
  reset: boolean;
  currentRecord?: VisitModel;
  isView?: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IOptionValue {
  label?: string;
  value?: string | number;
}

const CreateVisit = (props: ICreateVisit) => {
  const {
    openCreateVisit,
    setOpenCreateVisit,
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

  // const [dataPrisoner, setDataPrisoner] = useState<VisitModel[]>([]);
  const [optionPrisoner, setOptionPrisoner] = useState<IOptionValue[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [data, setData] = useState<A>();
  const [dataUser, setDataUser] = useState<UserModel>();

  const storedUserDataString = localStorage.getItem("userData");

  const handleGetAllPrisoner = async () => {
    try {
      showLoading("getAllPrisoner");
      const { data } = await axios.get(
        "https://localhost:7120/api/Prisoner/getFullList"
      );
      // setDataPrisoner(data.data);
      const newData = data.data.map((item: PrisonerModel) => ({
        label: item.prisonerName,
        value: item.id,
      }));
      setOptionPrisoner(newData);
      closeLoading("getAllPrisoner");
    } catch (error) {
      closeLoading("getAllPrisoner");
    }
  };

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

  useEffect(() => {
    handleGetAllPrisoner();
  }, [openCreateVisit]);

  useEffect(() => {
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString ?? "");
      setData(storedUserData);
    }
  }, [storedUserDataString]);

  const onClose = () => {
    setOpenCreateVisit(false);
    setIsView(false);
  };

  const handleOnFinish = async () => {
    try {
      showLoading("CreateVisit");
      const value = await form.getFieldsValue();
      await form.validateFields();
      const model: VisitModel = {
        ...value,
        startDate: dayjs(value.startDate).format(),
        endDate: dayjs(value.endDate).format(),
        createdBy: data.id,
      };
      await axios.post("https://localhost:7120/api/Visit", model);
      notification.success(<div>Tạo Phiếu Thăm Khám thành công.</div>);
      setOpenCreateVisit(false);
      setRecall(!recall);
      closeLoading("CreateVisit");
    } catch (error) {
      closeLoading("CreateVisit");
    }
  };

  const handleOnEdit = async () => {
    try {
      showLoading("EditVisit");
      const value = await form.getFieldsValue();
      await form.validateFields();

      const model: VisitModel = {
        ...value,
        startDate: dayjs(value.startDate).format(),
        endDate: dayjs(value.endDate).format(),
        createdBy: data.id,

        id: currentRecord?.id,
      };

      await axios.put(
        `https://localhost:7120/api/Visit/${currentRecord?.id}`,
        model
      );
      notification.success(<div>Sửa Phiếu Thăm Khám thành công.</div>);
      setOpenCreateVisit(false);
      setRecall(!recall);
      closeLoading("EditVisit");
    } catch (error) {
      closeLoading("EditVisit");
    }
  };

  const handleConfirm = async () => {
    try {
      showLoading("ConfirmVisit");
      const model = {
        userId: data.id,
      };
      await axios.put(
        `https://localhost:7120/api/Visit/${currentRecord?.id}/confirm`,
        model
      );
      notification.success(<div>Cặp nhập thành công.</div>);
      setOpenCreateVisit(false);
      setRecall(!recall);
      setIsOpenModal(false);
      closeLoading("ConfirmVisit");
    } catch (error) {
      closeLoading("ConfirmVisit");
    }
  };

  const handleCancel = async () => {
    try {
      showLoading("CancelVisit");
      const model = {
        userId: data.id,
      };
      await axios.put(
        `https://localhost:7120/api/Visit/${currentRecord?.id}/cancel`,
        model
      );
      notification.success(<div>Cặp nhập thành công.</div>);
      setOpenCreateVisit(false);
      setRecall(!recall);
      setIsOpenModal(false);
      closeLoading("CancelVisit");
    } catch (error) {
      closeLoading("CancelVisit");
    }
  };

  const renderBtn = (status: number) => {
    switch (status) {
      case 0:
        return (
          dataUser?.role === RoleEnum.doitruong && (
            <div onClick={handleOpenModel} className="btn-orange">
              Chấp Nhận
            </div>
          )
        );
      case 1:
        return (
          <div onClick={handleOpenModel} className="btn-orange">
            Đã Xong
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
        return " Đã Xong";

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
            Được thăm gia đình.
          </div>
        );
      case 1:
        return (
          <div>
            Phạm Nhân{" "}
            <span style={{ fontWeight: "600" }}>
              {currentRecord?.prisonerName}
            </span>{" "}
            đã hoàn thành việc thăm khám.
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
        Tạo Phiếm Thăm
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
        Sửa Phiếu Thăm
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
      {currentRecord?.status !== 2 ? (
        <div>{renderBtn(currentRecord?.status ?? 0)}</div>
      ) : (
        ""
      )}
      {currentRecord?.status === 0 && dataUser?.role === RoleEnum.doitruong && (
        <div>
          <Button
            onClick={() => {
              handleCancel();
            }}
            style={{ minWidth: 80 }}
          >
            Hủy Phiếu
          </Button>
        </div>
      )}
    </div>
  );

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

  const filterOption = (input: string, option?: IOptionValue) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    ((option as A)?.email || "").toLowerCase().includes(input.toLowerCase());

  const optionVisitType = [
    { label: "Gặp Người Thân", value: VisitType.gapNguoiThan },
    { label: "Gặp Bác sĩ", value: VisitType.gapBacSi },
    { label: "Gặp Luật sư", value: VisitType.gapLuatSu },
    { label: "Khác", value: VisitType.khac },
  ];

  const genderVisitType = (emtype: number) => {
    switch (emtype) {
      case VisitType.gapNguoiThan:
        return <div>Gặp Người Thân</div>;
      case VisitType.gapBacSi:
        return <div>Gặp Bác sĩ</div>;
      case VisitType.gapLuatSu:
        return <div>Gặp Luật sư</div>;
      case VisitType.khac:
        return <div>Khác</div>;
      default:
        break;
    }
  };

  return (
    <div>
      <Drawer
        title={
          isView
            ? "Chi tiết Phiếu Thăm Khám"
            : isEdit
            ? "Sửa Thăm Khám"
            : "Tạo Thăm Khám"
        }
        open={openCreateVisit}
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
              <TextItem label="Tên người thân">
                {currentRecord?.familyName}
              </TextItem>
              <TextItem label="Số điện thoại">
                {currentRecord?.familyPhone}
              </TextItem>
              <TextItem label="Địa chỉ người thân">
                {currentRecord?.familyAddress}
              </TextItem>
              <TextItem label="Tên Phạm Nhân">
                {currentRecord?.prisonerName ?? "Không tồn tại"}
              </TextItem>
              <TextItem label="Loại">
                {genderVisitType(currentRecord?.typeVisit ?? 0)}
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
              <StatusVisit status={currentRecord?.status} />
            </TextItem>
          </div>
        ) : (
          <Form layout="vertical" form={form}>
            <Form.Item
              rules={[
                { required: true, message: "Vui lòng điền tên người thân." },
              ]}
              name="familyName"
              label="Người thân:"
            >
              <Input placeholder="tên người thân" />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "Vui lòng điền tên người thân." },
              ]}
              name="familyPhone"
              label="Số điện thoại:"
            >
              <Input placeholder="số điện thoại của người thân" />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "Vui lòng điền tên người thân." },
              ]}
              name="familyAddress"
              label="Địa chỉ người thân:"
            >
              <Input placeholder="Địa chỉ người thân" />
            </Form.Item>
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
                  message: "Vui lòng điền loại ra vào.",
                },
              ]}
              name="typeVisit"
              label="Loại:"
            >
              <Select
                rootClassName={styles.emFilterSelectMultiple}
                placeholder="Chọn loại"
                // loading={!ygm}
                options={optionVisitType}
                filterOption={filterOption}
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Vui lòng điền Mô tả." }]}
              name="desc"
              label="Mô Tả:"
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
        title="Xác Nhận Phiếu Thăm Khám"
        textConfirm={renderBtnConfirm(currentRecord?.status ?? 0)}
      >
        <div>{renderContent(currentRecord?.status ?? 0)}</div>
      </ModalComponent>
    </div>
  );
};

export default CreateVisit;
