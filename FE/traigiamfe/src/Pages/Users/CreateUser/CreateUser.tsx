import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import { UserModel } from "@/common/Model/user";
import React, { useEffect, useState } from "react";
import styles from "./CreateUser.module.scss";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { Button, Drawer, Form, Image, Input, Row, Select } from "antd";
import TextItem from "../../../Components/TextItem/TextItem";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { RoleEnum } from "../../../Pages/MyProfile/Role.model";
import defaultImage from "../../../assets/default.jpg";

interface IInitValue {
  imageName: string;
  imageSrc: A;
  imageFile: A;
}

interface ICreateUser {
  openCreateUsers: boolean;
  setOpenCreateUsers: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  values: IInitValue;
  setValues: React.Dispatch<React.SetStateAction<IInitValue>>;
  showDelete: boolean;
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
  initialFieldValues: IInitValue;
  reset: boolean;
  currentRecord?: UserModel;
  isView: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
  getAllUsers: () => void;
}

interface IOptionValue {
  label?: string;
  value?: string | number;
}

const CreateUser = (props: ICreateUser) => {
  const {
    openCreateUsers,
    setOpenCreateUsers,
    isEdit,
    values,
    setValues,
    showDelete,
    setShowDelete,
    currentRecord,
    reset,
    initialFieldValues,
    isView,
    setIsView,
    getAllUsers,
  } = props;
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form] = useForm();
  const [showMessage, setShơwMessage] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(true);

  const onClose = () => {
    setOpenCreateUsers(false);
    setIsConfirm(true);
    setIsView(false);
    setShơwMessage(false);
  };

  const filterOption = (input: string, option?: IOptionValue) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    ((option as A)?.email || "").toLowerCase().includes(input.toLowerCase());

  const optionRoleType = [
    { label: "Giám thị", value: RoleEnum.giamthi },
    { label: "Đội trưởng", value: RoleEnum.doitruong },
    { label: "Sĩ quan", value: RoleEnum.siquan },
  ];
  const renderRole = (role: number) => {
    switch (role) {
      case RoleEnum.giamthi:
        return "Giám thị";
      case RoleEnum.doitruong:
        return "Đội trưởng";
      case RoleEnum.siquan:
        return "Sĩ quan";
      default:
        break;
    }
  };

  const handleOnFinish = async () => {
    if (isConfirm) {
      try {
        showLoading("createUser");
        if (values.imageFile === null) {
          setShơwMessage(true);
          setIsConfirm(false);
        }
        await form.validateFields();
        const value = await form.getFieldsValue();
        const formData = new FormData();
        formData.append("userName", value?.userName);
        formData.append("password", value?.password);
        formData.append("role", String(value?.role));
        formData.append("email", value?.email);
        formData.append("phoneNumber", value?.phoneNumber);
        formData.append("imageUser", String(values.imageName));
        formData.append("fileUser", values.imageFile || "");
        await axios.post("https://localhost:7120/api/Register", formData);
        setOpenCreateUsers(false);
        getAllUsers();
        notification.success(<div>Tạo người dùng Thành Công.</div>);
        closeLoading("createUser");
      } catch (error) {
        closeLoading("createUser");
      }
    } else {
      setShơwMessage(true);
    }
  };

  const handleOnEdit = async () => {
    if (isConfirm) {
      try {
        showLoading("editUser");
        await form.validateFields();
        const value = await form.getFieldsValue();
        const formData = new FormData();
        formData.append("id", String(currentRecord?.id ?? 0));
        formData.append("userName", value?.userName);
        formData.append("password", value?.password);
        formData.append("role", String(value?.role));
        formData.append("email", value?.email);
        formData.append("phoneNumber", value?.phoneNumber);
        formData.append("imageUser", String(currentRecord?.imageUser));
        formData.append("fileUser", values.imageFile || "");
        await axios.put(
          `https://localhost:7120/api/Register/${currentRecord?.id}`,
          formData
        );
        setOpenCreateUsers(false);
        getAllUsers();
        notification.success(<div>Sửa người dùng Thành Công.</div>);
        closeLoading("editUser");
      } catch (error) {
        closeLoading("editUser");
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
        Thêm Người dùng
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
        Sửa Người dùng
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
    </div>
  );

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

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(currentRecord);
      const arr = currentRecord?.imageSrc?.split("/");
      const imgURL = !arr ? defaultImage : currentRecord?.imageSrc;
      setValues({
        ...values,
        imageSrc: imgURL,
      });
    } else {
      form.resetFields();
      setValues(initialFieldValues);
    }
  }, [isEdit, reset]);

  return (
    <div>
      <Drawer
        title={
          isView
            ? "Chi tiết Người dùng"
            : isEdit
            ? "Sửa Người dùng"
            : "Thêm Người dùng"
        }
        open={openCreateUsers}
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
              <TextItem label="Tên Người dùng">
                {currentRecord?.userName}
              </TextItem>
              <TextItem label="Vai trò">
                {renderRole(currentRecord?.role ?? 0)}
              </TextItem>
              <TextItem label="Mật Khẩu">{currentRecord?.password}</TextItem>
              <TextItem label="Số điện thoại">
                {currentRecord?.phoneNumber}
              </TextItem>
            </Row>
            <TextItem label="Email">{currentRecord?.email}</TextItem>
          </div>
        ) : (
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
              rules={[{ required: true, message: "Vui lòng điền tên." }]}
              name="userName"
              label="Tên người dùng:"
            >
              <Input maxLength={150} />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "Vui lòng điền mật khẩu" },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/,
                  message:
                    "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
                },
              ]}
              name="password"
              label="Mật khẩu:"
            >
              <Input maxLength={150} />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn vai trò.",
                },
              ]}
              name="role"
              label="Vai trò:"
            >
              <Select
                rootClassName={styles.emFilterSelectMultiple}
                placeholder="vai trò"
                // loading={!ygm}
                options={optionRoleType}
                filterOption={filterOption}
              />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "Vui lòng điền email." },
                { type: "email", message: "Email không hợp lệ." },
              ]}
              name="email"
              label="Email:"
            >
              <Input maxLength={150} />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "Vui lòng điền số điện thoại." },
              ]}
              name="phoneNumber"
              label="Số điện thoại:"
            >
              <Input maxLength={150} />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default CreateUser;
