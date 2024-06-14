import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import avatar from "../../assets/avatar.jpg";
import Header from "../../Components/Header/Header";
import TextItem from "../../Components/TextItem/TextItem";
import styles from "./MyProfile.module.scss";
import { RoleEnum } from "./Role.model";
import defaultImage from "../../assets/default.jpg";
import { useLoading } from "../../common/Hook/useLoading";
import { useNotification } from "../../common/Hook/useNotification";
import axios from "axios";
import { UserModel } from "@/common/Model/user";

interface IOptionValue {
  label?: string;
  value?: string | number;
}

const MyProfile = () => {
  const initialFieldValues = {
    imageName: "",
    imageSrc: defaultImage,
    imageFile: null,
  };
  const items = [
    {
      title: <div>Thông Tin Cá Nhân</div>,
    },
  ];

  const [form] = useForm();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [values, setValues] = useState(initialFieldValues);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(true);
  const [showMessage, setShơwMessage] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { showLoading, closeLoading } = useLoading();
  const notification = useNotification();
  const [data, setData] = useState<any>();
  const storedUserDataString = localStorage.getItem("userData");
  const [dataDetail, setDataDetail] = useState<UserModel>();

  useEffect(() => {
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString ?? "");

      setData(storedUserData);
    }
  }, [storedUserDataString]);

  const filterOption = (input: string, option?: IOptionValue) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
    ((option as any)?.email || "").toLowerCase().includes(input.toLowerCase());

  const optionRoleType = [
    { label: "Trưởng trại", value: RoleEnum.truongTrai },
    { label: "Giám Thị", value: RoleEnum.giamThi },
    { label: "Đội trưởng", value: RoleEnum.doiTruong },
    { label: "Quân nhân ", value: RoleEnum.quanNhan },
    { label: "Công an ", value: RoleEnum.congAn },
    { label: "Người dùng ", value: RoleEnum.nguoiDung },
  ];

  const getUserById = async () => {
    if (data?.id) {
      try {
        showLoading("getUser");
        const { data: result } = await axios.get(
          `https://localhost:7120/api/Register/${data?.id}`
        );
        setDataDetail(result.data);
        closeLoading("getUser");
      } catch (error) {
        closeLoading("getUser");
      }
    }
  };

  useEffect(() => {
    getUserById();
  }, [data?.id]);

  const onClose = () => {
    setIsEdit(false);
    setIsConfirm(true);
    setShơwMessage(false);
  };

  const handleOnFinish = async () => {
    if (isConfirm) {
      try {
        showLoading("updateProfile");
        if (dataDetail?.imageUser && dataDetail?.imageUser === null) {
          setShơwMessage(true);
          setIsConfirm(false);
        } else if (
          values.imageFile === null &&
          dataDetail?.imageUser === null
        ) {
          setShơwMessage(true);
          setIsConfirm(false);
        } else {
          setShơwMessage(false);
          setIsConfirm(true);
        }

        await form.validateFields();
        const value = await form.getFieldsValue();

        const formData = new FormData();
        formData.append("id", String(dataDetail?.id ?? 0));
        formData.append("userName", value?.userName);
        formData.append("password", value?.password);
        formData.append("role", String(value?.role));
        formData.append("email", value?.email);
        formData.append("phoneNumber", value?.phoneNumber);
        if (dataDetail?.imageUser) {
          formData.append("imageUser", String(dataDetail?.imageUser));
        } else {
          formData.append("imageUser", String(values.imageName));
        }

        formData.append("fileUser", values.imageFile || "");
        await axios.put(
          `https://localhost:7120/api/Register/${data.id}`,
          formData
        );
        setIsEdit(false);
        getUserById();
        notification.success(<div>Cập nhập thành công.</div>);
        closeLoading("updateProfile");
      } catch (error) {
        closeLoading("updateProfile");
      }
    } else {
      setShơwMessage(true);
    }
  };

  const handleShowEdit = () => {
    setIsEdit(true);
    form.setFieldsValue(dataDetail);
    const arr = dataDetail?.imageSrc?.split("/");
    const hasNull = arr?.includes("null");
    const imgURL = hasNull ? defaultImage : dataDetail?.imageSrc;
    setValues({
      ...values,
      imageSrc: imgURL ?? "",
    });
  };

  const showPreview = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
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

  const renderRole = (role: number) => {
    switch (role) {
      case RoleEnum.truongTrai:
        return "Trưởng trại";
      case RoleEnum.giamThi:
        return "Giám Thị";
      case RoleEnum.doiTruong:
        return "Đội Trưởng";
      case RoleEnum.quanNhan:
        return "Quân Nhân";
      case RoleEnum.congAn:
        return "Công an";
      case RoleEnum.nguoiDung:
        return "Người dùng";
      default:
        break;
    }
  };

  return (
    <div>
      <div className="share-sticky">
        <Header items={items} />
      </div>
      <div className={styles.containerProfile}>
        <h2 style={{ marginBottom: "10px" }}>Thông Tin Cá Nhân</h2>

        {!isEdit ? (
          <div>
            <div className={styles.containerInfor}>
              <div className={styles.wrapperInfo}>
                <div>
                  <img
                    className={styles.avatar}
                    src={
                      dataDetail?.imageSrc ? dataDetail.imageSrc : defaultImage
                    }
                    alt=""
                  />
                </div>
                <div>
                  <h3>{dataDetail?.userName}</h3>
                  <div className={styles.admin}>
                    Vai Trò: {renderRole(dataDetail?.role ?? 0)}
                  </div>
                </div>
              </div>
              {(dataDetail?.role === RoleEnum.truongTrai ||
                dataDetail?.role === RoleEnum.doiTruong ||
                dataDetail?.role === RoleEnum.giamThi) && (
                <div className={styles.btnEdit} onClick={handleShowEdit}>
                  <EditOutlined style={{ fontSize: 18 }} />
                  <div>Edit</div>
                </div>
              )}
            </div>
            <Row style={{ height: "100%" }}>
              <TextItem label="Email">{dataDetail?.email ?? "N/A"}</TextItem>
              <TextItem label="Số Điện Thoại">
                {dataDetail?.phoneNumber ?? "N/A"}
              </TextItem>
            </Row>
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
              rules={[{ required: true, message: "Vui lòng điền mật khẩu ." }]}
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
              rules={[{ required: true, message: "Vui lòng điền email." }]}
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
                Sửa Thông tin
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
