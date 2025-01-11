import {
  InfringementModel,
  InfringementResponse,
} from "@/common/Model/infringement";
import { PrisonerModel } from "@/common/Model/prisoner";
import { PunishmentModel } from "@/common/Model/punishment";
import { CloseOutlined } from "@ant-design/icons";
import { Button, DatePicker, Drawer, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import styles from "./CreateInfringement.module.scss";

interface ICreateInfringement {
  openCreateInfringement: boolean;
  setOpenCreateInfringement: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  recall: boolean;
  setRecall: React.Dispatch<React.SetStateAction<boolean>>;
  reset: boolean;
  currentRecord?: InfringementResponse;
  isView?: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IOptionValue {
  label?: string;
  value?: string | number;
}

const CreateInfringement = (props: ICreateInfringement) => {
  const {
    openCreateInfringement,
    setOpenCreateInfringement,
    isEdit,
    recall,
    setRecall,
    reset,
    currentRecord,
    setIsView,
  } = props;

  const [form] = useForm();
  const notification = useNotification();
  const { showLoading, closeLoading } = useLoading();

  const [optionPunish, setOptionPunish] = useState<IOptionValue[]>([]);
  // const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [optionPrisoner, setOptionPrisoner] = useState<IOptionValue[]>([]);

  const [data, setData] = useState<A>();

  const storedUserDataString = localStorage.getItem("userData");

  const handleGetAllPunishment = async () => {
    try {
      showLoading("getAllPunish");
      const { data } = await axios.get("https://localhost:7120/api/Punish");

      const newData = data.data.map((item: PunishmentModel) => ({
        label: item.punishName,
        value: item.id,
      }));
      setOptionPunish(newData);
      closeLoading("getAllPunish");
    } catch (error) {
      closeLoading("getAllPunish");
    }
  };

  const handleGetAllPrisoner = async () => {
    try {
      showLoading("getAllPrisoner");
      const { data } = await axios.get(
        "https://localhost:7120/api/Prisoner/getFullList"
      );

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

  useEffect(() => {
    handleGetAllPunishment();
    handleGetAllPrisoner();
  }, [openCreateInfringement]);

  useEffect(() => {
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString ?? "");
      setData(storedUserData);
    }
  }, [storedUserDataString]);

  const onClose = () => {
    setOpenCreateInfringement(false);
    setIsView(false);
    setIsChange(false);
  };

  const filterOption = (input: string, option?: IOptionValue) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    ((option as A)?.email || "").toLowerCase().includes(input.toLowerCase());

  const handleOnFinish = async () => {
    try {
      showLoading("CreateIR");
      const value = await form.getFieldsValue();
      await form.validateFields();

      const currentDateTime = dayjs();

      const model: InfringementModel = {
        ...value,
        timeInfringement: dayjs(value.timeInfringement)
          .hour(currentDateTime.hour())
          .minute(currentDateTime.minute())
          .second(currentDateTime.second())
          .format(),
        createdBy: data.id,
        status: 0,
      };

      await axios.post("https://localhost:7120/api/Infringement", model);
      notification.success(<div>Tạo Vi Phạm thành công.</div>);
      setOpenCreateInfringement(false);
      setRecall(!recall);
      closeLoading("CreateIR");
    } catch (error) {
      closeLoading("CreateIR");
    }
  };

  const handleOnEdit = async () => {
    try {
      showLoading("EditIR");
      const value = await form.getFieldsValue();
      await form.validateFields();

      const currentDateTime = dayjs();

      const model: InfringementModel = {
        ...value,
        id: currentRecord?.id,
        timeInfringement: dayjs(value.timeInfringement)
          .hour(currentDateTime.hour())
          .minute(currentDateTime.minute())
          .second(currentDateTime.second())
          .format(),
        createdBy: data.id,
        YouthIRIds: isChange
          ? value.YouthIRIds
          : value.YouthIRIds.map((item: A) => item.value),
      };
      await axios.put(
        `https://localhost:7120/api/Infringement/${currentRecord?.id}`,
        model
      );
      notification.success(<div>Sửa Vi Phạm thành công.</div>);
      setIsChange(false);
      setOpenCreateInfringement(false);
      setRecall(!recall);
      closeLoading("EditIR");
    } catch (error) {
      closeLoading("EditIR");
    }
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
        Tạo Vi phạm
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
        Sửa vi phạm
      </div>
    </div>
  );

  const optionRivise = [
    { label: "Nghiêm Trọng", value: 1 },
    { label: "Lớn", value: 2 },
    { label: "Nhỏ", value: 3 },
  ];

  useEffect(() => {
    if (isEdit) {
      const newData: A = currentRecord?.listPrisoner?.map(
        (item: PrisonerModel) => ({
          label: item.prisonerName,
          value: item.id,
        })
      );
      setOptionPrisoner(newData);
      const formatData = {
        ...currentRecord,
        timeInfringement: dayjs(currentRecord?.timeInfringement),
        YouthIRIds: newData,
      };
      form.setFieldsValue(formatData);
    } else {
      form.resetFields();
    }
  }, [isEdit, reset]);

  const handleOnChange = () => {
    setIsChange(true);
  };

  console.log("isChange", isChange);

  return (
    <div>
      <Drawer
        title={isEdit ? "Sửa Vi Phạm" : "Tạo Vi Phạm"}
        open={openCreateInfringement}
        placement="right"
        closable={false}
        rootClassName={styles.EditInfringement}
        extra={<CloseOutlined onClick={onClose} />}
        width={620}
        footer={isEdit ? filterDrawFooter : filterDrawFooterView}
        destroyOnClose
        contentWrapperStyle={{ maxWidth: "calc(100vw - 32px)" }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền mã vi phạm." }]}
            name="mvp"
            label="Mã Vi Phạm:"
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền mã vi phạm." }]}
            name="nameIR"
            label="Tên Vi Phạm:"
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng chọn phạm nhân." }]}
            name="YouthIRIds"
            label="Các Phạm Nhân:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn phạm nhân:"
              // loading={!ygm}
              mode="multiple"
              options={optionPrisoner}
              filterOption={filterOption}
              onChange={handleOnChange}
            />
          </Form.Item>

          <Form.Item
            name="timeInfringement"
            label="Ngày Vi Phạm:"
            required
            rules={[{ required: true, message: "Vui lòng chọn ngày vi phạm." }]}
            rootClassName={styles.dateLabel}
          >
            <DatePicker
              format="DD MMM YYYY"
              inputReadOnly={true}
              placeholder="Ngày vi phạm"
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền địa điểm." }]}
            name="location"
            label="Địa Điểm:"
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng chọn mức độ.",
              },
            ]}
            name="rivise"
            label="Mức Độ:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn mức dộ"
              // loading={!ygm}
              options={optionRivise}
              filterOption={filterOption}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng chọn hình phạt." }]}
            name="punishId"
            label="Hình Phạt:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn hình phạt:"
              options={optionPunish}
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
        </Form>
      </Drawer>
    </div>
  );
};

export default CreateInfringement;
