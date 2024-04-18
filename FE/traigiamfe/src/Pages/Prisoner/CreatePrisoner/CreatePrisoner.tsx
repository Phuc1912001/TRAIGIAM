import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Image, Input, InputNumber, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import defaultImage from '../../../assets/default.jpg';
import { PrisonerModel } from "../../../common/Model/prisoner";
import styles from "./CreatePrisoner.module.scss";

interface ICreatePrisoner {
    openCreatePrisoner: boolean;
    setOpenCreatePrisoner: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    currentRecord?: PrisonerModel;
}

const initialFieldValues = {
    imageName: '',
    imageSrc: defaultImage,
    imageFile: null,
};

const CreatePrisoner = (props: ICreatePrisoner) => {
    const { openCreatePrisoner, setOpenCreatePrisoner, isEdit, currentRecord } =
        props;
    const [form] = useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [showDelete, setShowDelete] = useState<boolean>(false)

    const [values, setValues] = useState(initialFieldValues);

    const onClose = () => {
        setOpenCreatePrisoner(false);
    };

    const handleOnFinish = async () => {
        await form.validateFields();
        const value = await form.getFieldsValue();
        const formData = new FormData()
        formData.append("prisonerName", value.prisonerName)
        formData.append("prisonerAge", value.prisonerName)
        formData.append("cCCD", value.cCCD)
        formData.append("mPN", value.mPN)
        formData.append("banding", value.banding)
        formData.append("dom", value.dom)
        formData.append("bed", value.bed)
        formData.append("countryside", value.countryside)
        formData.append("crime", value.crime)
        formData.append("years", value.years)
        formData.append("manager", value.manager)
        formData.append("ImagePrisoner", values.imageName)
        formData.append('FilePrisoner', values.imageFile || '');
        await axios.post('https://localhost:7120/api/Prisoner', formData)
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
                Tạo Phạm Nhân
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
            <div
                onClick={() => {
                    // onClose();
                }}
                className="btn-orange"
            >
                Sửa Phạm Nhân
            </div>
        </div>
    );

    useEffect(() => {
        form.setFieldsValue(currentRecord);
    }, [isEdit]);

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
            setShowDelete(true)
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
        setValues(
            {
                ...values,
                imageSrc: defaultImage
            }
        )
        setShowDelete(false)
    }

    return (
        <div>
            <Drawer
                title={isEdit ? "Sửa Phạm Nhân" : "Tạo Phạm Nhân"}
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
                                        <label
                                            htmlFor="image-uploader"
                                        >
                                            <div className={styles.labelImage} >
                                                <PlusOutlined />
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="image-uploader"
                                            onChange={showPreview}
                                            style={{ display: 'none' }}
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
                                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),

                                                }}
                                                src={values.imageSrc}
                                            />
                                            {showDelete && <div onClick={handleDeleteImage} className={styles.icon} ><DeleteOutlined /></div>}

                                        </div>

                                    </div>

                                </div>
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tên phạm nhân." },
                                ]}
                                name="name"
                                label="Tên Phạm Nhân:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tuổi phạm nhân." },
                                ]}
                                name="age"
                                label="Tuổi:"
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
                                name="cCCD"
                                label="Căn Cước Công Dân:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền mã phạm nhân." },
                                ]}
                                name="mPN"
                                label="Mã Phạm Nhân:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền cấp bậc của phạm nhân.",
                                    },
                                ]}
                                name="banding"
                                label="Cấp Bậc:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền cấp bậc của phạm nhân.",
                                    },
                                ]}
                                name="dom"
                                label="Số Phòng:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền cấp bậc của phạm nhân.",
                                    },
                                ]}
                                name="bed"
                                label="Số Giường:"
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
                                rules={[{ required: true, message: "Vui lòng điền tội danh." }]}
                                name="crime"
                                label="Tội Danh:"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền số năm ngồi tù." },
                                ]}
                                name="years"
                                label="Số Năm:"
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền người quản lý." },
                                ]}
                                name="mananger"
                                label="Người Quản Lý:"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default CreatePrisoner;
