import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import avatar from "../../assets/avatar.jpg";
import Header from "../../Components/Header/Header";
import TextItem from "../../Components/TextItem/TextItem";
import styles from "./MyProfile.module.scss";
import { RoleEnum } from "./Role.model";
import defaultImage from "../../assets/default.jpg";

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

  const onClose = () => {
    setIsEdit(false);
  };

  const handleOnFinish = () => {};

  const handleShowEdit = () => {
    setIsEdit(true);
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
                  <img className={styles.avatar} src={avatar} alt="" />
                </div>
                <div>
                  <h3>Nguyễn Văn A</h3>
                  <div className={styles.admin}>Vai Trò: Quản trị viên</div>
                </div>
              </div>
              <div className={styles.btnEdit} onClick={handleShowEdit}>
                <EditOutlined style={{ fontSize: 18 }} />
                <div>Edit</div>
              </div>
            </div>
            <Row style={{ height: "100%" }}>
              <TextItem label="Email">nguyenvanphuc1912001@gmail.com</TextItem>
              <TextItem label="Số Điện Thoại">0329609726</TextItem>
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
              name="prisonerId"
              label="Tên người dùng:"
            >
              <Input maxLength={150} />
            </Form.Item>

            <Form.Item
              rules={[{ required: true, message: "Vui lòng điền mật khẩu ." }]}
              name="prisonerId"
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
              name="typeVisit"
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
