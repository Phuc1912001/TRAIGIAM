import { useLoading } from '../../../common/Hook/useLoading';
import { useNotification } from '../../../common/Hook/useNotification';
import { DomGenderModel } from '@/common/Model/domgender';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react'
import styles from './CreateDomGender.module.scss'
import axios from 'axios';
import { Button, Col, Drawer, Form, Input, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface ICreateDomGender {
    openCreateDomGender: boolean;
    setOpenCreateDomGender: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    reset: boolean;
    currentRecord?: DomGenderModel;
    isView?: boolean;
    setIsView: React.Dispatch<React.SetStateAction<boolean>>;
    getAllDomGender: () => void;
}

const CreateDomGender = (props: ICreateDomGender) => {

    const {
        openCreateDomGender,
        setOpenCreateDomGender,
        isEdit,
        reset,
        currentRecord,
        isView,
        setIsView,
        getAllDomGender
    } = props;

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();

    const onClose = () => {
        setOpenCreateDomGender(false);
        setIsView(false)
    };


    const handleOnFinish = async () => {
        try {
            showLoading("createDomGender");
            const value = await form.getFieldsValue();
            await form.validateFields();

            await axios.post("https://localhost:7120/api/DomGender", value);
            notification.success(<div>Tạo Nhà Giam Thành Công.</div>);
            setOpenCreateDomGender(false);
            getAllDomGender()
            closeLoading("createDomGender");
        } catch (error) {
            closeLoading("createDomGender");
        }
    };


    const handleOnEdit = async () => {
        try {
            showLoading("editDomGender");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: DomGenderModel = {
                id: currentRecord?.id,
            }
            await axios.put(`https://localhost:7120/api/DomGender/${currentRecord?.id}`, model);
            notification.success(<div>Sửa Nhà Giam Thành Công.</div>);
            setOpenCreateDomGender(false);
            getAllDomGender()
            closeLoading("editDomGender");
        } catch (error) {
            closeLoading("editDomGender");
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
                Tạo Nhà Giam
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
                Sửa Nhà Giam
            </div>
        </div>
    );

    return (
        <div>
            <Drawer
                title={isEdit ? "Sửa Nhà Giam" : "Tạo Nhà Giam"}
                open={openCreateDomGender}
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
                                rules={[
                                    { required: true, message: "Vui lòng điền tên nhà giam." },
                                ]}
                                name="domGenderName"
                                label="Tên Nhà Giam:"
                            >
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    )
}

export default CreateDomGender