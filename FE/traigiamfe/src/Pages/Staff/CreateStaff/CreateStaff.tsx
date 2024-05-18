import { StaffModel } from "@/common/Model/staff";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Drawer,
    Form,
    Image,
    Input, Row,
    Switch
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultImage from "../../../assets/default.jpg";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import styles from "./CreateStaff.module.scss";

interface IInitValue {
    imageName: string;
    imageSrc: any;
    imageFile: any;
}

interface ICreateStaff {
    openCreatePrisoner: boolean;
    setOpenCreatePrisoner: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    values: IInitValue;
    setValues: React.Dispatch<React.SetStateAction<IInitValue>>;
    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
    initialFieldValues: IInitValue;
    recall: boolean;
    setRecall: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
    currentRecord?: StaffModel;
}

const CreateStaff = (props: ICreateStaff) => {
    const {
        openCreatePrisoner,
        setOpenCreatePrisoner,
        isEdit,
        values,
        setValues,
        showDelete,
        setShowDelete,
        recall,
        setRecall,
        currentRecord,
        reset,
        initialFieldValues,
    } = props;
    const { showLoading, closeLoading } = useLoading();
    const notification = useNotification();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [form] = useForm();

    const [showMessage, setShơwMessage] = useState<boolean>(false);
    const [isConfirm, setIsConfirm] = useState<boolean>(true);
    const onClose = () => {
        setOpenCreatePrisoner(false);
        setIsConfirm(true)

        setShơwMessage(false);
    };

    const handleOnFinish = async () => {
        if (isConfirm) {
            try {
                showLoading("createStaff");
                if (values.imageFile === null) {
                    setShơwMessage(true);
                    setIsConfirm(false);
                }
                await form.validateFields();
                const value = await form.getFieldsValue();
                const formData = new FormData();
                formData.append("staffName", value.staffName);
                formData.append("staffAge", value.staffAge);
                formData.append("staffSex", value.staffSex);
                formData.append("cccd", value.cccd);
                formData.append("mnv", value.mnv);
                formData.append("position", value.position);
                formData.append("countryside", value.countryside);
                formData.append("isActive", value.isActive ?? true);
                formData.append("imageStaff", values.imageName);
                formData.append("fileStaff", values.imageFile || "");
                await axios.post("https://localhost:7120/api/Staff", formData);
                setOpenCreatePrisoner(false);
                setRecall(!recall);
                notification.success(<div>Tạo Nhân Viên Thành Công.</div>);
                closeLoading("createStaff");
            } catch (error) {
                closeLoading("createStaff");
            }
        } else {
            setShơwMessage(true);
        }
    };

    const handleOnEdit = async () => {
        console.log('isConfirm', isConfirm);

        if (isConfirm) {
            try {
                showLoading("editStaff");
                await form.validateFields();
                const value = await form.getFieldsValue();
                const formData = new FormData();
                formData.append("id", String(currentRecord?.id ?? 0))
                formData.append("staffName", value.staffName);
                formData.append("staffAge", value.staffAge);
                formData.append("staffSex", value.staffSex);
                formData.append("cccd", value.cccd);
                formData.append("mnv", value.mnv);
                formData.append("position", value.position);
                formData.append("countryside", value.countryside);
                formData.append("isActive", value.isActive ?? true);
                formData.append("imageStaff", String(currentRecord?.imageStaff));
                formData.append("fileStaff", values.imageFile || "");
                await axios.put(`https://localhost:7120/api/Staff/${currentRecord?.id}`, formData);
                setOpenCreatePrisoner(false);
                setRecall(!recall);
                closeLoading("editStaff");
                notification.success(<div>Sửa Phạm Nhân Thành Công.</div>);
            } catch (error) {
                closeLoading("editStaff");
            }
        } else {
            setShơwMessage(true)
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
                Tạo Nhân Viên
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
                Sửa Nhân Viên
            </div>
        </div>
    );

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

    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };

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
    return (
        <div>
            <Drawer
                title={isEdit ? "Sửa Nhân Viên" : "Tạo Nhân Viên"}
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
                    <Row>
                        <Col sm={24}>
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
                                                <div
                                                    onClick={handleDeleteImage}
                                                    className={styles.icon}
                                                >
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
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tên nhân viên." },
                                ]}
                                name="staffName"
                                label="Tên Nhân Viên:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tuổi nhân viên." },
                                ]}
                                name="staffAge"
                                label="Tuổi:"
                            >
                                <Input maxLength={150} type="number" />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền Giới tính nhân viên.",
                                    },
                                ]}
                                name="staffSex"
                                label="Giới Tính:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
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
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền mã nhân viên." },
                                ]}
                                name="mnv"
                                label="Mã Nhân Viên:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền chức vụ của phạm nhân.",
                                    },
                                ]}
                                name="position"
                                label="Chức Vụ:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>

                        <Col sm={24}>
                            <Form.Item
                                rules={[{ required: true, message: "Vui lòng điền quê quán." }]}
                                name="countryside"
                                label="Quê Quán:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                name="isActive"
                                label="Trạng Thái:"
                                valuePropName="checked"
                            >
                                <Switch
                                    checked={currentRecord?.isActive === true}
                                    onChange={onChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default CreateStaff;
