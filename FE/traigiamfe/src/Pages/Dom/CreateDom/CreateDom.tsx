import { DomModel } from '@/common/Model/dom';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../../../common/Hook/useLoading';
import { useNotification } from '../../../common/Hook/useNotification';
import styles from './CreateDom.module.scss';



interface ICreateDom {
    openCreateDom: boolean;
    setOpenCreateDom: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    recall: boolean;
    setRecall: React.Dispatch<React.SetStateAction<boolean>>;
    reset: boolean;
    currentRecord?: DomModel;
    isView?: boolean;
    setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateDom = (props: ICreateDom) => {
    const {
        openCreateDom,
        setOpenCreateDom,
        isEdit,
        recall,
        setRecall,
        reset,
        currentRecord,
        isView,
        setIsView
    } = props;

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();
    const { state } = useLocation()

    const onClose = () => {
        setOpenCreateDom(false);
        setIsView(false)
    };

    const handleOnFinish = async () => {
        try {
            showLoading("createDom");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: DomModel = {
                domGenderId: state.domGender.id,
                ...value
            }
            console.log('model', model);

            await axios.post("https://localhost:7120/api/Dom", model);
            notification.success(<div>Tạo Khu Thành Công.</div>);
            setOpenCreateDom(false);
            setRecall(!recall);
            closeLoading("createDom");
        } catch (error) {
            closeLoading("createDom");
        }
    };


    const handleOnEdit = async () => {
        try {
            showLoading("editDom");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: DomModel = {
                id: currentRecord?.id,
                domGenderId: state?.domGender?.id,
                domName: value.domName
            }
            await axios.put(`https://localhost:7120/api/Dom/${currentRecord?.id}`, model);
            notification.success(<div>Sửa Khu Thành Công.</div>);
            setOpenCreateDom(false);
            setRecall(!recall);
            closeLoading("editDom");
        } catch (error) {
            closeLoading("editDom");
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
                Tạo Khu
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
                Sửa Khu
            </div>
        </div>
    );

    return (
        <div>
            <Drawer
                title={isEdit ? "Sửa Khu" : "Tạo Khu"}
                open={openCreateDom}
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
                                    { required: true, message: "Vui lòng điền tên khu vực." },
                                ]}
                                name="domGenderName"
                                label="Nhà:"
                                initialValue={`${state?.domGender?.domGenderName}`}
                            >
                                <Input maxLength={150} disabled={true} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tên khu vực." },
                                ]}
                                name="domName"
                                label="Tên Khu:"
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

export default CreateDom