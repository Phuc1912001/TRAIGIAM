import { BedModel } from "@/common/Model/bed";
import { DomModel } from "@/common/Model/dom";
import { RoomModel } from "@/common/Model/Room";
import { StaffModel } from "@/common/Model/staff";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Image, Input, InputNumber, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultImage from "../../../assets/default.jpg";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import {
  BandingEnum,
  BandingModel,
  IBandingTextMap,
} from "../../../common/Model/banding";
import { PrisonerResponse } from "../../../common/Model/prisoner";
import styles from "./CreatePrisoner.module.scss";

interface IInitValue {
  imageName: string;
  imageSrc: A;
  imageFile: A;
}
interface ICreatePrisoner {
  openCreatePrisoner: boolean;
  setOpenCreatePrisoner: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  currentRecord?: PrisonerResponse;
  values: IInitValue;
  setValues: React.Dispatch<React.SetStateAction<IInitValue>>;
  showDelete: boolean;
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
  initialFieldValues: IInitValue;
  recall: boolean;
  setRecall: React.Dispatch<React.SetStateAction<boolean>>;
  reset: boolean;
}

interface IOptionValue {
  label?: string;
  value?: string | number;
}

const CreatePrisoner = (props: ICreatePrisoner) => {
  const {
    openCreatePrisoner,
    setOpenCreatePrisoner,
    isEdit,
    currentRecord,
    values,
    setValues,
    showDelete,
    setShowDelete,
    initialFieldValues,
    recall,
    setRecall,
    reset,
  } = props;
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();
  console.log("previewImage", previewImage);

  const [showMessage, setShơwMessage] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(true);
  const onClose = () => {
    setOpenCreatePrisoner(false);
    setIsConfirm(true);
    setShơwMessage(false);
  };
  // const [dataStaff, setDataStaff] = useState<StaffModel[]>([]);
  // const [dataDom, setDataDom] = useState<DomModel[]>([]);
  // const [dataRoom, setDataRoom] = useState<RoomModel[]>([]);
  // const [dataBed, setDataBed] = useState<BedModel[]>([]);
  const [optionStaff, setOptionStaff] = useState<IOptionValue[]>([]);
  const [optionBanding, setOptionBanding] = useState<IOptionValue[]>([]);
  const [optionDomGender, setOptionDomGender] = useState<IOptionValue[]>([]);
  const [optionDom, setOptionDom] = useState<IOptionValue[]>([]);
  const [optionRoom, setOptionRoom] = useState<IOptionValue[]>([]);
  const [optionBed, setOptionBed] = useState<IOptionValue[]>([]);

  const getAllStaff = async () => {
    try {
      showLoading("getAllStaff");
      const { data } = await axios.get(
        "https://localhost:7120/api/staff/staffActive"
      );
      // setDataStaff(data.data);
      const newData = data.data.map((item: StaffModel) => ({
        label: item.staffName,
        value: item.id,
      }));
      setOptionStaff(newData);
      closeLoading("getAllStaff");
    } catch (error) {
      closeLoading("getAllStaff");
    }
  };
  const getAllBanding = async () => {
    try {
      showLoading("GetAllBanding");
      const { data } = await axios.get(
        "https://localhost:7120/api/banding/isActive"
      );
      // setDataStaff(data.data);
      const newData = data.data.map((item: BandingModel) => ({
        label: (
          <div>{IBandingTextMap.get(item.bandingID ?? BandingEnum.Entry)}</div>
        ),
        value: item.bandingID,
      }));
      setOptionBanding(newData);
      closeLoading("GetAllBanding");
    } catch (error) {
      closeLoading("GetAllBanding");
    }
  };

  const domGenderId = Form.useWatch("domGenderId", form);
  const domId = Form.useWatch("domId", form);
  const roomId = Form.useWatch("roomId", form);

  const getAllDomGender = async () => {
    try {
      showLoading("getAllDomGender");
      const { data } = await axios.get("https://localhost:7120/api/DomGender");
      const newData = data.data.map((item: DomModel) => ({
        label: item.domGenderName,
        value: item.id,
      }));
      setOptionDomGender(newData);
      closeLoading("getAllDomGender");
    } catch (error) {
      closeLoading("getAllDomGender");
    }
  };

  const getAllDom = async () => {
    try {
      showLoading("getAllDom");
      const model = {
        domGenderId: domGenderId,
      };
      const { data } = await axios.post(
        "https://localhost:7120/api/Dom/limitDom",
        model
      );
      // setDataDom(data.data);
      const newData = data.data.map((item: DomModel) => ({
        label: item.domName,
        value: item.id,
      }));
      setOptionDom(newData);
      closeLoading("getAllDom");
    } catch (error) {
      closeLoading("getAllDom");
    }
  };

  useEffect(() => {
    getAllDom();
  }, [domGenderId]);

  const getAllRoom = async () => {
    if (domId) {
      try {
        showLoading("getAllRoom");
        const model = {
          domGenderId: domGenderId,
          domId: domId,
        };
        const { data } = await axios.post(
          "https://localhost:7120/api/Room/limitRoom",
          model
        );
        const newData = data.data.map((item: RoomModel) => ({
          label: item.roomName,
          value: item.id,
        }));
        // setDataRoom(data.data);
        setOptionRoom(newData);

        closeLoading("getAllRoom");
      } catch (error) {
        closeLoading("getAllRoom");
      }
    }
  };
  useEffect(() => {
    getAllRoom();
  }, [domId]);

  const getAllBed = async () => {
    if (roomId) {
      try {
        showLoading("getAllBed");
        const model = {
          domGenderId: domGenderId,
          domId: domId,
          roomId: roomId,
        };
        const { data } = await axios.post(
          "https://localhost:7120/api/Bed/LimitBed",
          model
        );
        // setDataBed(data.data);
        const newData = data.data.map((item: BedModel) => ({
          label: item.bedName,
          value: item.id,
        }));
        setOptionBed(newData);
        closeLoading("getAllBed");
      } catch (error) {
        closeLoading("getAllBed");
      }
    }
  };

  const getAllBedEdit = async () => {
    try {
      showLoading("getAllBed");
      const model = {
        domGenderId: currentRecord?.domGenderId,
        domId: currentRecord?.domId,
        roomId: currentRecord?.roomId,
      };
      const { data } = await axios.post(
        "https://localhost:7120/api/Bed/LimitBedEdit",
        model
      );
      // setDataBed(data.data);
      const newData = data.data.map((item: BedModel) => ({
        label: item.bedName,
        value: item.id,
      }));
      setOptionBed(newData);
      closeLoading("getAllBed");
    } catch (error) {
      closeLoading("getAllBed");
    }
  };

  useEffect(() => {
    if (!isEdit) {
      getAllBed();
    }
  }, [roomId]);

  useEffect(() => {
    getAllStaff();
    getAllBanding();
    getAllDomGender();
    if (isEdit) {
      getAllBedEdit();
    }
  }, [openCreatePrisoner]);

  const handleOnFinish = async () => {
    if (isConfirm) {
      try {
        showLoading("createPrisoner");
        if (values.imageFile === null) {
          setShơwMessage(true);
          setIsConfirm(false);
        }
        await form.validateFields();
        const value = await form.getFieldsValue();
        const formData = new FormData();
        formData.append("prisonerName", value.prisonerName);
        formData.append("prisonerAge", value.prisonerAge);
        formData.append("prisonerSex", value.prisonerSex);
        formData.append("cccd", value.cccd);
        formData.append("mpn", value.mpn);
        formData.append("bandingID", value.bandingID);
        formData.append("domGenderId", value.domGenderId);
        formData.append("domId", value.domId);
        formData.append("roomId", value.roomId);
        formData.append("bedId", value.bedId);
        formData.append("countryside", value.countryside);
        formData.append("crime", value.crime);
        formData.append("years", value.years);
        formData.append("mananger", value.mananger);
        formData.append("imagePrisoner", values.imageName);
        formData.append("filePrisoner", values.imageFile || "");
        await axios.post("https://localhost:7120/api/Prisoner", formData);
        setOpenCreatePrisoner(false);
        setRecall(!recall);
        notification.success(<div>Thêm Phạm Nhân Thành Công.</div>);
        closeLoading("createPrisoner");
      } catch (error) {
        closeLoading("createPrisoner");
      }
    } else {
      setShơwMessage(true);
    }
  };

  const handleOnEdit = async () => {
    if (isConfirm) {
      try {
        showLoading("editPrisoner");
        await form.validateFields();
        const value = await form.getFieldsValue();
        const formData = new FormData();
        formData.append("id", String(currentRecord?.id ?? 0));
        formData.append("prisonerName", value.prisonerName);
        formData.append("prisonerAge", value.prisonerAge);
        formData.append("prisonerSex", value.prisonerSex);
        formData.append("cccd", value.cccd);
        formData.append("mpn", value.mpn);
        formData.append("bandingID", value.bandingID);
        formData.append("domGenderId", value.domGenderId);
        formData.append("domId", value.domId);
        formData.append("roomId", value.roomId);
        formData.append("bedId", value.bedId);
        formData.append("countryside", value.countryside);
        formData.append("crime", value.crime);
        formData.append("years", value.years);
        formData.append("mananger", value.mananger);
        formData.append("imagePrisoner", String(currentRecord?.imagePrisoner));
        formData.append("filePrisoner", values.imageFile || "");
        await axios.put(
          `https://localhost:7120/api/Prisoner/${currentRecord?.id}`,
          formData
        );
        setOpenCreatePrisoner(false);
        setRecall(!recall);
        closeLoading("editPrisoner");
        notification.success(<div>Sửa Phạm Nhân Thành Công.</div>);
      } catch (error) {
        closeLoading("editPrisoner");
      }
    } else {
      setShơwMessage(true);
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
        Thêm Phạm Nhân
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
        Sửa Phạm Nhân
      </div>
    </div>
  );

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(currentRecord);
      const arr = currentRecord?.imageSrc?.split("/");
      const hasNull = arr?.includes("null");
      const imgURL = hasNull ? defaultImage : currentRecord?.imageSrc;
      setValues({
        ...values,
        imageSrc: imgURL,
      });
    } else {
      form.resetFields();
      setValues(initialFieldValues);
    }
  }, [isEdit, reset]);

  const showPreview = (e: A) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValues({
          ...values,
          imageFile,
          imageSrc: x?.target?.result as string,
        });
      };
      setShowDelete(true);
      setIsConfirm(true);
      setShơwMessage(false);
      reader.readAsDataURL(imageFile);
    } else {
      setValues({
        ...values,
        imageFile: null,
        imageSrc: defaultImage,
      });
    }
  };

  const handleDeleteImage = () => {
    setValues({
      ...values,
      imageSrc: defaultImage,
    });
    setShowDelete(false);
    setIsConfirm(false);
  };

  const filterOption = (input: string, option?: IOptionValue) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    ((option as A)?.email || "").toLowerCase().includes(input.toLowerCase());

  const handleOnChangeDomGender = () => {
    form.setFieldValue("domId", "");
    form.setFieldValue("roomId", "");
    form.setFieldValue("bedId", "");
  };

  const handleOnChangeDom = () => {
    form.setFieldValue("roomId", "");
    form.setFieldValue("bedId", "");
  };

  const handleOnChangeRoom = () => {
    form.setFieldValue("bedId", "");
  };

  return (
    <div>
      <Drawer
        title={isEdit ? "Sửa Phạm Nhân" : "Thêm Phạm Nhân"}
        open={openCreatePrisoner}
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
          <Form.Item name="img" label="Chọn Ảnh Đại Diện:">
            <div className={styles.wrapperImage}>
              <div>
                <label htmlFor="image-uploader">
                  <div className={styles.labelImage}>
                    <PlusOutlined />
                  </div>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="image-uploader"
                  onChange={showPreview}
                  style={{ display: "none" }}
                />
              </div>
              <div>
                <div className={styles.imageChoose}>
                  <Image
                    rootClassName={styles.images}
                    preview={{
                      visible: previewOpen,
                      movable: false,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={values.imageSrc}
                  />
                  {showDelete && (
                    <div onClick={handleDeleteImage} className={styles.icon}>
                      <DeleteOutlined />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {showMessage && (
              <div style={{ color: "red", marginTop: "10px" }}>
                Vui lòng chọn ảnh đại diện.
              </div>
            )}
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: "Vui lòng điền tên phạm nhân." },
            ]}
            name="prisonerName"
            label="Tên Phạm Nhân:"
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: "Vui lòng điền tuổi phạm nhân." },
            ]}
            name="prisonerAge"
            label="Tuổi:"
          >
            <Input maxLength={150} type="number" />
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: "Vui lòng điền giới tính phạm nhân." },
            ]}
            name="prisonerSex"
            label="Giới Tính:"
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Vui lòng điền căn cước công dân.",
              },
            ]}
            name="cccd"
            label="Căn Cước Công Dân:"
          >
            <Input maxLength={150} type="number" />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền mã phạm nhân." }]}
            name="mpn"
            label="Mã Phạm Nhân:"
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng chọn cấp bậc." }]}
            name="bandingID"
            label="Xếp loại:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="chọn cấp bậc"
              // loading={!ygm}
              options={optionBanding}
              filterOption={filterOption}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền khu vực ." }]}
            name="domGenderId"
            label="Nhà Giam:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn Nhà Giam"
              // loading={!ygm}
              options={optionDomGender}
              filterOption={filterOption}
              onChange={handleOnChangeDomGender}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền khu vực ." }]}
            name="domId"
            label="Khu Vực:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn khu vực"
              // loading={!ygm}
              options={optionDom}
              filterOption={filterOption}
              onChange={handleOnChangeDom}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền phòng." }]}
            name="roomId"
            label="Phòng:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn phòng"
              // loading={!ygm}
              options={optionRoom}
              filterOption={filterOption}
              onChange={handleOnChangeRoom}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền giường." }]}
            name="bedId"
            label="Giường:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn Giường "
              // loading={!ygm}
              options={optionBed}
              filterOption={filterOption}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền quê quán." }]}
            name="countryside"
            label="Quê Quán:"
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Vui lòng điền tội danh." }]}
            name="crime"
            label="Tội Danh:"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: "Vui lòng điền số năm ngồi tù." },
            ]}
            name="years"
            label="Số Năm:"
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: "Vui lòng điền người quản lý." },
            ]}
            name="mananger"
            label="Người Quản Lý:"
          >
            <Select
              rootClassName={styles.emFilterSelectMultiple}
              placeholder="Chọn người quản lý"
              // loading={!ygm}
              options={optionStaff}
              filterOption={filterOption}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default CreatePrisoner;
