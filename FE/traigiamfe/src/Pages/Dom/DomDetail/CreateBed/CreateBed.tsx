import { BedModel } from '@/common/Model/bed';
import { RoomModel } from '@/common/Model/Room';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../../../../common/Hook/useLoading';
import { useNotification } from '../../../../common/Hook/useNotification';
import styles from './CreateBed.module.scss';

interface ICreateBed {
    openCreateBed: boolean;
    setOpenCreateBed: React.Dispatch<React.SetStateAction<boolean>>;
    isEditBed: boolean;
    recallBed: boolean;
    setRecallBed: React.Dispatch<React.SetStateAction<boolean>>;
    resetBed: boolean;
    currentRecordBed?: BedModel;
    currentRoom?: RoomModel;
    recallRoom: boolean;
    setRecallRoom: React.Dispatch<React.SetStateAction<boolean>>;
}


const CreateBed = (props: ICreateBed) => {

    const {
        openCreateBed,
        setOpenCreateBed,
        isEditBed,
        recallBed,
        setRecallBed,
        resetBed,
        currentRecordBed,
        currentRoom,
        recallRoom,
        setRecallRoom
    } = props;

    const { state } = useLocation()

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();
    const onClose = () => {
        setOpenCreateBed(false);
    };



    const handleOnFinish = async () => {
        try {
            showLoading("createBed");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: BedModel = {
                domId: currentRoom?.domId,
                roomId: currentRoom?.id,
                domGenderId: currentRoom?.domGenderId,
                bedName: value.bedName
            }
            await axios.post("https://localhost:7120/api/Bed", model);
            notification.success(<div>Tạo Giường Thành Công.</div>);
            setOpenCreateBed(false);
            setRecallBed(!recallBed);
            setRecallRoom(!recallRoom)
            closeLoading("createBed");
        } catch (error) {
            closeLoading("createBed");
        }
    };


    const handleOnEdit = async () => {
        try {
            showLoading("editBed");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: BedModel = {
                domId: state.idDom,
                roomId: value.roomId,
                domGenderId: currentRoom?.domGenderId,
                bedName: value.bedName
            }
            await axios.put(`https://localhost:7120/api/Bed/${currentRecordBed?.id}`, model);
            notification.success(<div>Sửa Giường Thành Công.</div>);
            setOpenCreateBed(false);
            setRecallBed(!recallBed);
            setRecallRoom(!recallRoom)
            closeLoading("editBed");
        } catch (error) {
            closeLoading("editBed");
        }
    };

    useEffect(() => {
        if (isEditBed) {
            form.setFieldsValue(currentRecordBed);
        } else {
            form.resetFields();
        }
    }, [isEditBed, resetBed]);

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
                Tạo Giường
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
                Sửa Giường
            </div>
        </div>
    );

    return (
        <div>
            <Drawer
                title={isEditBed ? "Sửa Giường" : "Tạo Giường"}
                open={openCreateBed}
                placement="right"
                closable={false}
                rootClassName={styles.EditInfringement}
                extra={<CloseOutlined onClick={onClose} />}
                width={620}
                footer={isEditBed ? filterDrawFooter : filterDrawFooterView}
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
                                name="domGenderId"
                                label="Tên Nhà:"
                                initialValue={`${currentRoom?.domGenderName}`}

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
                                initialValue={`${state.domName}`}

                            >
                                <Input maxLength={150} disabled={true} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tên phòng ." },
                                ]}
                                name="domRoom"
                                label="Tên Phòng:"
                                initialValue={`${currentRoom?.roomName}`}

                            >
                                <Input maxLength={150} disabled={true} />
                            </Form.Item>
                        </Col>
                        <Col sm={24}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng điền tên giường." },
                                ]}
                                name="bedName"
                                label="Tên Giường:"
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

export default CreateBed