import {
    InfringementModel,
    InfringementResponse
} from "@/common/Model/infringement";
import { PrisonerModel } from "@/common/Model/prisoner";
import { StatmentModel } from "@/common/Model/statement";
import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Drawer,
    Form,
    Image, Row,
    Select
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import defaultImage from "../../../assets/default.jpg";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import ModalComponent from "../../../Components/ModalDelete/ModalComponent";
import TextItem from "../../../Components/TextItem/TextItem";
import StatusStatement from "../StatusStatement/StatusStatement";
import styles from "./CreateStatement.module.scss";

interface IInitValue {
    imageName: string;
    imageSrc: any;
    imageFile: any;
}

interface ICreateStatement {
    openCreateStatement: boolean;
    setOpenCreateStatement: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    recall: boolean;
    values: IInitValue;
    setValues: React.Dispatch<React.SetStateAction<IInitValue>>;
    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
    setRecall: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
    currentRecord?: StatmentModel;
    isView?: boolean;
    setIsView: React.Dispatch<React.SetStateAction<boolean>>;
    initialFieldValues: IInitValue;
}

interface IOptionValue {
    label?: string;
    value?: string | number;
}

const CreateStatement = (props: ICreateStatement) => {
    const {
        openCreateStatement,
        setOpenCreateStatement,
        isEdit,
        values,
        setValues,
        showDelete,
        setShowDelete,
        recall,
        setRecall,
        reset,
        currentRecord,
        isView,
        setIsView,
        initialFieldValues,
    } = props;

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);
    const [isOpenModelCancel, setIsOpenModelCancel] = useState<boolean>(false);
    const [isChange, setIsChange] = useState<boolean>(false);
    const [optionPrisoner, setOptionPrisoner] = useState<IOptionValue[]>([]);
    const [optionIR, setOptionIR] = useState<IOptionValue[]>([]);
    const [dataInfringement, setDataInfringement] = useState<
        InfringementResponse[]
    >([]);

    const [showMessage, setShơwMessage] = useState<boolean>(false);
    const [isConfirm, setIsConfirm] = useState<boolean>(true);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [prisonerId, setPrisonerId] = useState<any>(0);

    const [data, setData] = useState<any>();

    const storedUserDataString = localStorage.getItem("userData");

    const getAllInfringement = async () => {
        try {
            showLoading("getAllExternal");
            const { data } = await axios.get(
                "https://localhost:7120/api/Infringement"
            );
            setDataInfringement(data.data);
            closeLoading("getAllExternal");
        } catch (error) {
            closeLoading("getAllExternal");
        }
    };
    useEffect(() => {
        getAllInfringement();
    }, []);

    useEffect(() => {
        if (storedUserDataString) {
            const storedUserData = JSON.parse(storedUserDataString ?? "");
            setData(storedUserData);
        }
    }, [storedUserDataString]);

    const handleGetAllPrisoner = async () => {
        try {
            showLoading("getAllPrisoner");
            const { data } = await axios.get(
                "https://localhost:7120/api/Infringement/getPrisonerByIR"
            );

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
    const handleGetAllInfringementByPrisoner = async () => {
        try {
            showLoading("getAllIR");
            const { data } = await axios.get(
                `https://localhost:7120/api/Infringement/getIRByPrisoner/${prisonerId}`
            );

            let newData = data.data.map((item: InfringementModel) => ({
                label: item.nameIR,
                value: item.id,
            }));
            setOptionIR(newData);
            closeLoading("getAllIR");
        } catch (error) {
            closeLoading("getAllIR");
        }
    };

    useEffect(() => {
        handleGetAllPrisoner();
    }, [openCreateStatement]);

    useEffect(() => {
        handleGetAllInfringementByPrisoner();
    }, [prisonerId]);

    const onClose = () => {
        setOpenCreateStatement(false);
        setIsConfirm(true);
        setIsView(false);
        setShơwMessage(false);
    };

    const handleOnFinish = async () => {
        if (isConfirm) {
            try {
                showLoading("createStatement");
                if (values.imageFile === null) {
                    setShơwMessage(true);
                    setIsConfirm(false);
                }
                await form.validateFields();
                const value = await form.getFieldsValue();
                const formData = new FormData();
                const currentDateTime = dayjs();
                formData.append("prisonerId", value.prisonerId);
                formData.append("irId", value.irId);
                formData.append("createdBy", data.id);
                formData.append(
                    "timeStatement",
                    dayjs(value?.timeStatement)
                        .hour(currentDateTime.hour())
                        .minute(currentDateTime.minute())
                        .second(currentDateTime.second())
                        .format()
                );
                formData.append("statement", value.statement);
                formData.append("status", String(0));
                formData.append("imageStatement", values.imageName);
                formData.append("fileStatement", values.imageFile || "");
                await axios.post("https://localhost:7120/api/Statement", formData);
                setOpenCreateStatement(false);
                setRecall(!recall);
                notification.success(<div>Tạo Lời Khai Thành Công.</div>);
                closeLoading("createStatement");
            } catch (error) {
                closeLoading("createStatement");
            }
        } else {
            setShơwMessage(true);
        }
    };

    const handleOnEdit = async () => {
        if (isConfirm) {
            try {
                showLoading("createStatement");

                await form.validateFields();
                const value = await form.getFieldsValue();
                const formData = new FormData();
                const currentDateTime = dayjs();

                formData.append("id", String(currentRecord?.id ?? 0));
                formData.append("prisonerId", value.prisonerId);
                formData.append("irId", value.irId);
                formData.append("createdBy", data.id);
                formData.append(
                    "timeStatement",
                    dayjs(value?.timeStatement)
                        .hour(currentDateTime.hour())
                        .minute(currentDateTime.minute())
                        .second(currentDateTime.second())
                        .format()
                );
                formData.append("statement", value.statement);
                formData.append("status", String(currentRecord?.status));
                formData.append(
                    "imageStatement",
                    String(currentRecord?.imageStatement)
                );
                formData.append("fileStatement", values.imageFile || "");
                await axios.put(
                    `https://localhost:7120/api/Statement/${currentRecord?.id}`,
                    formData
                );
                setOpenCreateStatement(false);
                setRecall(!recall);
                notification.success(<div>Sửa Lời Khai Thành Công.</div>);
                closeLoading("createStatement");
            } catch (error) {
                closeLoading("createStatement");
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
                Tạo Lời Khai
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
                Sửa Lời Khai
            </div>
        </div>
    );

    const footerOnlyView = (
        <div>
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

    useEffect(() => {
        if (isEdit) {
            setPrisonerId(currentRecord?.prisonerId);
            const formatData = {
                ...currentRecord,
                timeStatement: dayjs(currentRecord?.timeStatement),
            };
            form.setFieldsValue(formatData);
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

    const filterOption = (input: string, option?: IOptionValue) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase()) ||
        ((option as any)?.email || "").toLowerCase().includes(input.toLowerCase());

    const handleOnChange = (value: any) => {
        setPrisonerId(value);
        form.setFieldValue("irId", "");
        form.setFieldValue("statement", "");
        form.setFieldValue("timeStatement", "");
        setValues({
            ...values,
            imageSrc: defaultImage,
        });
    };

    const handleOnCancelStatement = async () => {
        try {
            showLoading("cancelStatement")
            const formData = {
                userId: data.id
            }
            await axios.put(
                `https://localhost:7120/api/Statement/${currentRecord?.id}/cancel`,
                formData
            );
            notification.success(<div>Cặp nhập thành công.</div>);
            setOpenCreateStatement(false);
            setRecall(!recall);
            setIsOpenModelCancel(false);
            closeLoading("cancelStatement")
        } catch (error) {
            closeLoading("cancelStatement")
        }
    };

    const handleOnConfirmStatement = async () => {
        try {
            showLoading("confirmStatement")
            const formData = {
                userId: data.id
            }
            await axios.put(
                `https://localhost:7120/api/Statement/${currentRecord?.id}/confirm`,
                formData
            );

            notification.success(<div>Cặp nhập thành công.</div>);
            setOpenCreateStatement(false);
            setRecall(!recall);
            setIsOpenModalConfirm(false);
            closeLoading("confirmStatement")
        } catch (error) {
            closeLoading("confirmStatement")
        }

    }

    return (
        <div>
            <Drawer
                title={
                    isView
                        ? "Chi tiết Lời Khai"
                        : isEdit
                            ? "Sửa Lời Khai"
                            : "Tạo Lời Khai"
                }
                open={openCreateStatement}
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
                            <TextItem label="Tiên Vi Phạm">{currentRecord?.irName}</TextItem>
                            <TextItem label="Ngày Khai  Báo">
                                {dayjs(currentRecord?.timeStatement).format("DD-MM-YYYY")}
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
                            label="Lời Khai"
                        >
                            {currentRecord?.statement}
                        </TextItem>
                        <TextItem
                            textItemProps={{ isCol: true, spanNumber: 24 }}
                            label="Trạng Thái"
                        >
                            <StatusStatement status={currentRecord?.status} />
                        </TextItem>
                        <TextItem
                            textItemProps={{ isCol: true, spanNumber: 24 }}
                            label="Hình ảnh liên quan"
                        >
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
                                    src={currentRecord?.imageSrc}
                                />
                            </div>
                        </TextItem>
                        <div
                            style={{
                                paddingTop: "20px",
                                marginTop: "20px",
                                borderTop: "1px solid gray",
                            }}
                        >
                            <div className={styles.wrapperBtn}>
                                {
                                    currentRecord?.status !== 2 && <Button
                                        onClick={() => {
                                            setIsOpenModelCancel(true)
                                        }}
                                        style={{ minWidth: 80 }}
                                    >
                                        Hủy Lời Khai
                                    </Button>
                                }

                                {
                                    currentRecord?.status !== 1 && <div onClick={() => {
                                        setIsOpenModalConfirm(true)
                                    }} className="btn-orange">
                                        Đồng Ý
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                ) : (
                    <Form layout="vertical" form={form}>
                        <Row>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng chọn phạm nhân." },
                                    ]}
                                    name="prisonerId"
                                    label="Phạm Nhân:"
                                >
                                    <Select
                                        rootClassName={styles.emFilterSelectMultiple}
                                        placeholder="Chọn phạm nhân:"
                                        options={optionPrisoner}
                                        filterOption={filterOption}
                                        onChange={(value) => handleOnChange(value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng chọn vi phạm." },
                                    ]}
                                    name="irId"
                                    label="Vi Phạm:"
                                >
                                    <Select
                                        rootClassName={styles.emFilterSelectMultiple}
                                        placeholder="Chọn Vi Phạm:"
                                        options={optionIR}
                                        filterOption={filterOption}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12}>
                                <Form.Item
                                    name="timeStatement"
                                    label="Ngày khai báo:"
                                    required
                                    rules={[
                                        { required: true, message: "Vui lòng chọn ngày khai báo." },
                                    ]}
                                    rootClassName={styles.dateLabel}
                                >
                                    <DatePicker
                                        format="DD MMM YYYY"
                                        inputReadOnly={true}
                                        placeholder="Ngày khai báo"
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng nhập lời khai." },
                                    ]}
                                    name="statement"
                                    label="Lời Khai:"
                                >
                                    <TextArea style={{ minHeight: 120, resize: "none" }} />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item name="img" label="Chọn Ảnh Bằng Chứng:">
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
                                                        onVisibleChange: (visible) =>
                                                            setPreviewOpen(visible),
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
                                            Vui lòng chọn ảnh bằng chứng.
                                        </div>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Drawer>

            <ModalComponent
                isOpenModal={isOpenModalConfirm}
                setIsOpenModal={setIsOpenModalConfirm}
                handleDelete={handleOnConfirmStatement}
                title="Xác Nhận Đồng ý"
                textConfirm={"Tôi đồng ý"}
            >
                <div>Tôi đồng ý với lời khai trên</div>
            </ModalComponent>
            <ModalComponent
                isOpenModal={isOpenModelCancel}
                setIsOpenModal={setIsOpenModelCancel}
                handleDelete={handleOnCancelStatement}
                title="Xác Nhận Hủy Lời Khai"
                textConfirm={"Tôi không đồng ý"}
            >
                <div>Tôi không đồng ý với lời khai trên</div>
            </ModalComponent>
        </div>
    );
};

export default CreateStatement;
