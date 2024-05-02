import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Drawer,
    Form,
    Image,
    Input,
    InputNumber,
    Row,
    Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PrisonerModel } from "../../../common/Model/prisoner";
import styles from "./CreatePrisoner.module.scss";
import defaultImage from "../../../assets/default.jpg";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import { StaffModel } from "@/common/Model/staff";

interface IInitValue {
    imageName: string;
    imageSrc: any;
    imageFile: any;
}
interface ICreatePrisoner {
    openCreatePrisoner: boolean;
    setOpenCreatePrisoner: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    currentRecord?: PrisonerModel;
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

    const [showMessage, setShơwMessage] = useState<boolean>(false)
    const [isConfirm, setIsConfirm] = useState<boolean>(true)
    const onClose = () => {
        setOpenCreatePrisoner(false);
        setIsConfirm(true)
        setShơwMessage(false)
    };
    const [dataStaff, setDataStaff] = useState<StaffModel[]>([])
    const [optionStaff, setOptionStaff] = useState<IOptionValue[]>([])

    const getAllStaff = async () => {
        try {
            showLoading("getAllStaff")
            const { data } = await axios.get('https://localhost:7120/api/staff')
            setDataStaff(data.data)
            let newData = data.data.map((item: StaffModel) => ({
                label: item.staffName,
                value: item.id
            }));
            setOptionStaff(newData)
            closeLoading("getAllStaff")
        } catch (error) {
            closeLoading("getAllStaff")
        }
    }
    useEffect(() => {
        getAllStaff()
    }, [openCreatePrisoner])

    const handleOnFinish = async () => {
        if (isConfirm) {
            try {
                showLoading("createPrisoner");
                if (values.imageFile === null) {
                    setShơwMessage(true)
                    setIsConfirm(false)
                }
                await form.validateFields();
                const value = await form.getFieldsValue();
                const formData = new FormData();
                formData.append("prisonerName", value.prisonerName);
                formData.append("prisonerAge", value.prisonerAge);
                formData.append("prisonerSex", value.prisonerSex);
                formData.append("cccd", value.cccd);
                formData.append("mpn", value.mpn);
                formData.append("banding", value.banding);
                formData.append("dom", value.dom);
                formData.append("bed", value.bed);
                formData.append("countryside", value.countryside);
                formData.append("crime", value.crime);
                formData.append("years", value.years);
                formData.append("mananger", value.mananger);
                formData.append("imagePrisoner", values.imageName);
                formData.append("filePrisoner", values.imageFile || "");
                await axios.post("https://localhost:7120/api/Prisoner", formData);
                setOpenCreatePrisoner(false);
                setRecall(!recall);
                notification.success(<div>Tạo Phạm Nhân Thành Công.</div>);
                closeLoading("createPrisoner");
            } catch (error) {
                closeLoading("createPrisoner");
            }
        } else {
            setShơwMessage(true)
        }


    };

    const handleOnEdit = async () => {
        console.log('isConfirm', isConfirm);

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
                formData.append("banding", value.banding);
                formData.append("dom", value.dom);
                formData.append("bed", value.bed);
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
            setIsConfirm(true)
            setShơwMessage(false)
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
        setIsConfirm(false)
    };

    const filterOption = (input: string, option?: IOptionValue) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
        ((option as any)?.email || '').toLowerCase().includes(input.toLowerCase());

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
                            <Form.Item
                                name="img"
                                label="Chọn Ảnh Đại Diện:"
                            >
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
                                {
                                    showMessage && <div style={{ color: 'red', marginTop: "10px" }}>Vui lòng chọn ảnh đại diện.</div>
                                }

                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tên phạm nhân." },
                                ]}
                                name="prisonerName"
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
                                name="prisonerAge"
                                label="Tuổi:"
                            >
                                <Input maxLength={150} type='number' />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền giới tính phạm nhân." },
                                ]}
                                name="prisonerSex"
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
                                <Input maxLength={150} type='number' />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền mã phạm nhân." },
                                ]}
                                name="mpn"
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
                                <Input maxLength={150} type='number' />
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
                                <Input maxLength={150} type='number' />
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
                                <Input maxLength={150} type='number' />
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
                                <InputNumber min={1} />
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
                                <Select
                                    rootClassName={styles.emFilterSelectMultiple}
                                    placeholder="Select YGM(s)"
                                    // loading={!ygm}
                                    options={optionStaff}
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default CreatePrisoner;
