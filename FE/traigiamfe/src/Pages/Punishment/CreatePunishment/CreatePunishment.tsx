import { PunishmentModel } from "@/common/Model/punishment";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Input, Row, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoading } from "../../../common/Hook/useLoading";
import { useNotification } from "../../../common/Hook/useNotification";
import TextItem from "../../../Components/TextItem/TextItem";
import StatusPunish from "../StatusPunish/StatusPunish";
import styles from "./CreatePunishment.module.scss";

interface ICreatePunish {
    openCreatePunish: boolean;
    setOpenCreatePunish: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    showDelete: boolean;
    setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
    recall: boolean;
    setRecall: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
    currentRecord?: PunishmentModel;
    isView?: boolean;
    setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePunishment = (props: ICreatePunish) => {
    const {
        openCreatePunish,
        setOpenCreatePunish,
        isEdit,
        recall,
        setRecall,
        reset,
        currentRecord,
        isView,
        setIsView
    } = props;

    const [isConfirm, setIsConfirm] = useState<boolean>(true);
    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();

    const onClose = () => {
        setOpenCreatePunish(false);
        setIsConfirm(true);
        setIsView(false)
    };

    const handleOnFinish = async () => {
        try {
            showLoading("createPunish");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: PunishmentModel = {
                punishName: value.punishName,
                desc: value.desc,
                status: value.status ?? true
            }
            await axios.post("https://localhost:7120/api/Punish", model);
            notification.success(<div>Tạo Hình Phạt Thành Công.</div>);
            setOpenCreatePunish(false);
            setRecall(!recall);
            closeLoading("createPunish");
        } catch (error) {
            closeLoading("createPunish");

        }
    };


    const handleOnEdit = async () => {
        try {
            showLoading("editPunish");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: PunishmentModel = {
                id: currentRecord?.id,
                punishName: value.punishName,
                desc: value.desc,
                status: value.status ?? true
            }
            await axios.put(`https://localhost:7120/api/Punish/${currentRecord?.id}`, model);
            notification.success(<div>Sửa Hình Phạt Thành Công.</div>);
            setOpenCreatePunish(false);
            setRecall(!recall);
            closeLoading("editPunish");
        } catch (error) {
            closeLoading("editPunish");

        }
    };

    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue(currentRecord);
        } else {
            form.resetFields();
        }
    }, [isEdit, reset]);


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
                Tạo Hình Phạt
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
                Sửa Hình Phạt
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
    )

    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
    return (
        <div>
            <Drawer
                title={isView ? "Chi tiết hình phạt" : isEdit ? "Sửa Hình Phạt" : "Tạo Hình Phạt"}
                open={openCreatePunish}
                placement="right"
                closable={false}
                rootClassName={styles.EditInfringement}
                extra={<CloseOutlined onClick={onClose} />}
                width={620}
                footer={isView ? footerOnlyView : isEdit ? filterDrawFooter : filterDrawFooterView}
                destroyOnClose
                contentWrapperStyle={{ maxWidth: "calc(100vw - 32px)" }}
            >
                {
                    isView ? <div>
                        <TextItem label='Tên Hình Phạt' textItemProps={{ isCol: true, spanNumber: 24 }}  >{currentRecord?.punishName}</TextItem>
                        <TextItem label='Mô Tả' textItemProps={{ isCol: true, spanNumber: 24 }}  >{currentRecord?.desc}</TextItem>
                        <TextItem label='Trạng Thái' textItemProps={{ isCol: true, spanNumber: 24 }}  >
                            <StatusPunish status={currentRecord?.status} />
                        </TextItem>
                    </div> : <Form layout="vertical" form={form}>
                        <Row>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng điền tên hình phạt." },
                                    ]}
                                    name="punishName"
                                    label="Tên Hình Phạt:"
                                >
                                    <Input maxLength={150} />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    rules={[{ required: true, message: "Vui lòng điền mô tả." }]}
                                    name="desc"
                                    label="Mô tả:"
                                >
                                    <TextArea />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name="status"
                                    label="Trạng Thái:"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checked={currentRecord?.status === true}
                                        defaultValue={true}
                                        onChange={onChange}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                }

            </Drawer>
        </div>
    );
};

export default CreatePunishment;
