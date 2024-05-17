import { useLoading } from '../../../../common/Hook/useLoading';
import { useNotification } from '../../../../common/Hook/useNotification';
import { RoomModel } from '@/common/Model/Room';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react'
import styles from './CreateRoom.module.scss'
import axios from 'axios';
import { Button, Col, Drawer, Form, Input, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

interface ICreateRoom {
    openCreateRoom: boolean;
    setOpenCreateRoom: React.Dispatch<React.SetStateAction<boolean>>;
    isEditRoom: boolean;
    recallRoom: boolean;
    setRecallRoom: React.Dispatch<React.SetStateAction<boolean>>;
    resetRoom: boolean;
    currentRecordRoom?: RoomModel;

}

const CreateRoom = (props: ICreateRoom) => {

    const {
        openCreateRoom,
        setOpenCreateRoom,
        isEditRoom,
        recallRoom,
        setRecallRoom,
        resetRoom,
        currentRecordRoom,
    } = props;

    const { state } = useLocation()

    const [form] = useForm();
    const notification = useNotification();
    const { showLoading, closeLoading } = useLoading();


    const onClose = () => {
        setOpenCreateRoom(false);
    };

    const handleOnFinish = async () => {
        try {
            showLoading("createRoom");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: RoomModel = {
                domId: state.idDom,
                roomName: value.roomName
            }
            await axios.post("https://localhost:7120/api/Room", model);
            notification.success(<div>Tạo Phòng Thành Công.</div>);
            setOpenCreateRoom(false);
            setRecallRoom(!recallRoom);
            closeLoading("createRoom");
        } catch (error) {
            closeLoading("createRoom");
        }
    };


    const handleOnEdit = async () => {
        try {
            showLoading("editRoom");
            const value = await form.getFieldsValue();
            await form.validateFields();
            const model: RoomModel = {
                id: currentRecordRoom?.id,
                domId: state.idDom,
                roomName: value.roomName
            }
            await axios.put(`https://localhost:7120/api/Room/${currentRecordRoom?.id}`, model);
            notification.success(<div>Sửa Phòng Thành Công.</div>);
            setOpenCreateRoom(false);
            setRecallRoom(!recallRoom);
            closeLoading("editRoom");
        } catch (error) {
            closeLoading("editRoom");
        }
    };

    useEffect(() => {
        if (isEditRoom) {
            form.setFieldsValue(currentRecordRoom);
        } else {
            form.resetFields();
        }
    }, [isEditRoom, resetRoom]);

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
                Tạo Phòng
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
                Sửa Phòng
            </div>
        </div>
    );

    return (
        <div>
            <Drawer
                title={isEditRoom ? "Sửa Phòng" : "Tạo Phòng"}
                open={openCreateRoom}
                placement="right"
                closable={false}
                rootClassName={styles.EditInfringement}
                extra={<CloseOutlined onClick={onClose} />}
                width={620}
                footer={isEditRoom ? filterDrawFooter : filterDrawFooterView}
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
                                    { required: true, message: "Vui lòng điền tên Phòng vực." },
                                ]}
                                name="roomName"
                                label="Tên Phòng:"
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

export default CreateRoom